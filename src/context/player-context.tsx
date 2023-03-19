import { PropsWithChildren, createContext } from "react";
import { Synthesizer } from "../modules/synthesizer";
import { loadBinaryFromFile, loadBinaryFromURL } from "../utils/file.utils";
import useSynthesizer from "../hooks/useSynthesizer";
import { Midi } from "../data/midis";
import { SoundFont } from "../data/soundfonts";

export class Player {
  private readonly synthesizer: Synthesizer;
  private lastFontLoaded: number;
  private currentMidi: Midi | null;
  private currentFont: SoundFont | null;

  constructor(synthesizer: Synthesizer | null) {
    this.synthesizer = synthesizer as Synthesizer;
    this.lastFontLoaded = -1;
    this.currentMidi = null;
    this.currentFont = null;
  }

  public getMidi() {
    return this.currentMidi;
  }

  public getSoundFont() {
    return this.currentFont;
  }

  public isFontLoaded() {
    return this.lastFontLoaded !== -1;
  }

  public isSongLoaded() {
    return this.currentMidi != null;
  }

  public getPosition(): Promise<number> {
    return this.synthesizer.retrievePlayerCurrentTick();
  }

  public isPlaying() {
    return this.synthesizer.isPlaying();
  }

  public async loadMidi(buffer: ArrayBuffer, midi: Midi) {
    await this.synthesizer.addSMFDataToPlayer(buffer);
    this.currentMidi = midi;
  }

  public async loadMidiFile(midi: File) {
    const buffer = await loadBinaryFromFile(midi);
    if (buffer) {
      await this.loadMidi(buffer, {
        author: "unknown",
        url: "file",
        name: midi.name,
      });
    }
  }

  public async loadMidiURL(midi: Midi) {
    const buffer = await loadBinaryFromURL(midi.url);
    if (buffer) {
      await this.loadMidi(buffer, midi);
    }
  }

  public async loadSoundfont(buffer: ArrayBuffer, soundfont: SoundFont) {
    if (this.lastFontLoaded !== -1) {
      await this.synthesizer.unloadSFontAsync(this.lastFontLoaded);
    }

    this.lastFontLoaded = await this.synthesizer.loadSFont(buffer);
    this.currentFont = soundfont;
  }

  public async loadSoundfontFile(midi: File) {
    const buffer = await loadBinaryFromFile(midi);
    if (buffer) {
      await this.loadSoundfont(buffer, {
        url: "file",
        name: midi.name,
      });
    }
  }

  public async loadSoundfontURL(font: SoundFont) {
    const buffer = await loadBinaryFromURL(font.url);
    if (buffer) {
      await this.loadSoundfont(buffer, font);
    }
  }

  public async play() {
    await this.synthesizer.playPlayer();
    await this.synthesizer.waitForPlayerStopped();
    await this.synthesizer.waitForVoicesStopped();
    await this.synthesizer.resetPlayer();
  }

  public setPosition(ticks: number) {
    this.synthesizer.seekPlayer(ticks);
  }

  public async stop() {
    if (this.isPlaying()) {
      this.synthesizer.stopPlayer();
    }
    await this.synthesizer.resetPlayer();
  }
}

export const PlayerContext = createContext<{
  player: Player;
}>({
  player: new Player(null),
});

export const PlayerProvider = ({ children }: PropsWithChildren) => {
  const { synthesizer } = useSynthesizer();
  const player = new Player(synthesizer as Synthesizer);

  return (
    <PlayerContext.Provider value={{ player }}>
      {children}
    </PlayerContext.Provider>
  );
};
