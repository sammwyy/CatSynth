import React from "react";

import Midi from "../../interfaces/midi";
import SoundFont from "../../interfaces/soundfont";

export interface MidiState {
  midi: Midi;
  buffer: ArrayBuffer;
}

export interface PlayerHook {
  // Midi
  midi: MidiState | null;
  loadMidi: (midi: Midi | File) => unknown;

  // SoundFont
  soundFont: SoundFont | null;
  loadSoundFont: (soundFont: SoundFont | File) => unknown;

  // Player
  currentTick: number;
  totalTicks: number;
  seek: (position: number) => unknown;

  playing: boolean;
  setPlaying: (playing: boolean) => unknown;
  repeat: boolean;
  setRepeat: (repeat: boolean) => unknown;

  // Actions
  render: () => unknown;
  isRendering: boolean;
}

export const PlayerContext = React.createContext<PlayerHook>({
  // Midi
  midi: null,
  loadMidi: () => {},

  // SoundFont
  soundFont: null,
  loadSoundFont: () => {},

  // Player
  currentTick: 0,
  totalTicks: 0,
  seek: () => {},

  playing: false,
  setPlaying: () => {},
  repeat: false,
  setRepeat: () => {},

  // Actions
  render: () => {},
  isRendering: false,
});
