import { PropsWithChildren, useEffect, useState } from "react";
import useSynthesizer from "../../hooks/useSynthesizer";
import Midi from "../../interfaces/midi";
import SoundFont from "../../interfaces/soundfont";
import { wavFromAudioBuffer } from "../../utils/buffer.utils";
import { loadBinaryFromFile, loadBinaryFromURL } from "../../utils/file.utils";
import { MidiState, PlayerContext } from "./player-context";

export const PlayerProvider = ({ children }: PropsWithChildren) => {
  const { synthesizer } = useSynthesizer();

  // Midi and soundfont state.
  const [midi, setMidi] = useState<MidiState | null>(null);
  const [soundFont, setSoundFont] = useState<SoundFont | null>(null);
  const [lastFontLoaded, setLastFontLoaded] = useState<number | undefined>(-1);

  // Player state.
  const [playing, setPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  // Metadata.
  const [bpm, setBPM] = useState(0);
  const [currentTick, setCurrentTick] = useState(0);
  const [totalTicks, setTotalTicks] = useState(0);

  // Check if the source is a file.
  const isFile = (source: Midi | SoundFont | File): source is File => {
    return source instanceof File;
  };

  // Load the buffer from the source.
  const loadBuffer = async (source: Midi | SoundFont | File) => {
    if (isFile(source)) {
      return loadBinaryFromFile(source);
    } else {
      return loadBinaryFromURL(source.url);
    }
  };

  // Load the midi file.
  const loadMidi = async (resource: Midi | File) => {
    const buffer = await loadBuffer(resource);
    const midi: Midi = isFile(resource)
      ? { author: "unknown", url: "", name: resource.name }
      : resource;

    if (buffer) {
      await synthesizer?.resetPlayer();
      await synthesizer?.addSMFDataToPlayer(buffer);

      const bpm = await synthesizer?.retrievePlayerBpm();
      setBPM(bpm || 0);

      setMidi({ midi, buffer });
    }
  };

  // Load the soundfont.
  const loadSoundFont = async (resource: SoundFont | File) => {
    if (lastFontLoaded !== -1 && lastFontLoaded !== undefined) {
      await synthesizer?.unloadSFontAsync(lastFontLoaded);
    }

    const buffer = await loadBuffer(resource);
    if (buffer) {
      const soundFont: SoundFont = isFile(resource)
        ? { url: "", name: resource.name }
        : resource;
      const font = await synthesizer?.loadSFont(buffer);
      setLastFontLoaded(font);
      setSoundFont(soundFont);
    }
  };

  // Seek the player to the given tick.
  const seekPlayer = (tick: number) => {
    synthesizer?.seekPlayer(tick);
    setCurrentTick(tick);
  };

  // Get the duration of the midi file.
  const getMidiDuration = () => {
    return (totalTicks / (bpm * 1000)) * 60;
  };

  // Allocate a new audio buffer.
  const buffAlloc = (
    duration: number,
    numberOfChannels: number,
    sampleRate: number
  ) => {
    const length = duration * sampleRate;
    return new AudioBuffer({ length, sampleRate, numberOfChannels });
  };

  // Render the player.
  const render = async () => {
    //setIsRendering(true);
    // seekPlayer(0);

    const bpm = (await synthesizer?.retrievePlayerBpm()) || 0;
    const ticks = (await synthesizer?.retrievePlayerTotalTicks()) || 0;
    const tempo = (await synthesizer?.retrievePlayerMIDITempo()) || 0;

    const node = synthesizer?.createAudioNode(new AudioContext(), 8192);
    const ctx = node?.context;
    const sampleRate = ctx?.sampleRate || 44100;

    console.log("BPM:", bpm);
    console.log("Ticks:", ticks);
    console.log("Sample Rate:", sampleRate);
    console.log("Tempo:", tempo);

    const duration = getMidiDuration();
    console.log("Duration:", duration);
    const buffer = buffAlloc(duration, 2, sampleRate);
    synthesizer?.render(buffer);

    const wav = wavFromAudioBuffer(buffer);
    const url = URL.createObjectURL(wav);

    const link = document.createElement("a");
    link.href = url;
    link.download = "audio.wav";
    link.click();

    // setIsRendering(false);
  };

  // Reset the player when a new midi or soundfont is loaded.
  useEffect(() => {
    setPlaying(false);
    setCurrentTick(0);
  }, [midi, soundFont]);

  // Play or stop the player when the playing state changes.
  useEffect(() => {
    if (playing) {
      synthesizer?.seekPlayer(currentTick);
      synthesizer?.playPlayer();
    } else {
      synthesizer?.stopPlayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  // Update the position of the player every second.
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!synthesizer) return;

      const totalTicks = await synthesizer?.retrievePlayerTotalTicks();
      setTotalTicks(totalTicks || 0);

      if (!playing) return;

      const currentTick = await synthesizer?.retrievePlayerCurrentTick();
      setCurrentTick(currentTick || 0);

      if (currentTick === undefined || currentTick >= totalTicks) {
        if (repeat) {
          seekPlayer(0);
          synthesizer?.playPlayer();
        } else {
          setPlaying(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synthesizer, repeat, playing]);

  return (
    <PlayerContext.Provider
      value={{
        loadMidi,
        loadSoundFont,
        midi,
        playing,
        currentTick,
        totalTicks,
        seek: seekPlayer,
        setPlaying,
        soundFont,
        repeat,
        setRepeat,
        render,
        isRendering,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
