import { PropsWithChildren, createContext, useState, useEffect } from "react";
import { Synthesizer } from "../modules/synthesizer";
import { loadBinaryFromFile, loadBinaryFromURL } from "../utils/file.utils";
import useSynthesizer from "../hooks/useSynthesizer";
import { Midi } from "../data/midis";
import { SoundFont } from "../data/soundfonts";

export function usePlayer(synthesizer: Synthesizer) {
  const [lastFontLoaded, setLastFontLoaded] = useState(-1);
  const [currentMidi, setCurrentMidi] = useState<{
    midi: Midi;
    buffer: ArrayBuffer;
  }>();
  const [currentFont, setCurrentFont] = useState<SoundFont>();

  const [isPlaying, setIsPlaying] = useState(false);

  // If midi and font change well stop and reset player
  useEffect(() => {
    stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMidi, currentFont]);

  // Check if player stopped to reload player using stop function
  useEffect(() => {
    !isPlaying && stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  function getMidi() {
    return currentMidi?.midi;
  }

  function getSoundFont() {
    return currentFont;
  }

  function isFontLoaded() {
    return lastFontLoaded !== -1;
  }

  function isSongLoaded() {
    return currentMidi?.midi != null;
  }

  function getPosition(): Promise<number> {
    return synthesizer.retrievePlayerCurrentTick();
  }

  async function loadMidi(buffer: ArrayBuffer, midi: Midi) {
    await synthesizer.addSMFDataToPlayer(buffer);

    setCurrentMidi({ midi, buffer });
  }

  async function loadMidiFile(midi: File) {
    const buffer = await loadBinaryFromFile(midi);
    if (buffer) {
      await loadMidi(buffer, {
        author: "unknown",
        url: "file",
        name: midi.name,
      });
    }
  }

  async function loadMidiURL(midi: Midi) {
    const buffer = await loadBinaryFromURL(midi.url);
    if (buffer) {
      await loadMidi(buffer, midi);
    }
  }

  async function loadSoundfont(buffer: ArrayBuffer, soundfont: SoundFont) {
    if (lastFontLoaded !== -1) {
      await synthesizer.unloadSFontAsync(lastFontLoaded);
    }

    const font = await synthesizer.loadSFont(buffer);
    setLastFontLoaded(font);
    setCurrentFont(soundfont);
  }

  async function loadSoundfontFile(midi: File) {
    const buffer = await loadBinaryFromFile(midi);
    if (buffer) {
      await loadSoundfont(buffer, {
        url: "file",
        name: midi.name,
      });
    }
  }

  async function loadSoundfontURL(font: SoundFont) {
    const buffer = await loadBinaryFromURL(font.url);
    if (buffer) {
      await loadSoundfont(buffer, font);
    }
  }

  async function play() {
    await synthesizer.playPlayer();

    setIsPlaying(true);

    await synthesizer.waitForPlayerStopped();
    await synthesizer.waitForVoicesStopped();

    setIsPlaying(false);
  }

  function setPosition(ticks: number) {
    synthesizer.seekPlayer(ticks);
  }

  async function stop() {
    await synthesizer.resetPlayer();

    console.log({ currentMidi });

    currentMidi?.buffer &&
      (await synthesizer.addSMFDataToPlayer(currentMidi.buffer));

    setIsPlaying(false);
  }

  return {
    getMidi,
    getSoundFont,
    isFontLoaded,
    isSongLoaded,
    getPosition,
    isPlaying,
    loadMidi,
    loadMidiFile,
    loadMidiURL,
    loadSoundfont,
    loadSoundfontFile,
    loadSoundfontURL,
    play,
    setPosition,
    stop,
  };
}

export const PlayerContext = createContext<any>(null) as React.Context<
  ReturnType<typeof usePlayer>
>;

export const PlayerProvider = ({ children }: PropsWithChildren) => {
  const { synthesizer } = useSynthesizer();

  return (
    <PlayerContext.Provider value={usePlayer(synthesizer as Synthesizer)}>
      {children}
    </PlayerContext.Provider>
  );
};
