import React from "react";
import Midi from "../../interfaces/midi";
import SoundFont from "../../interfaces/soundfont";

export interface DataHook {
  midis: Midi[];
  soundfonts: SoundFont[];
}

export const DataContext = React.createContext<DataHook>({
  midis: [],
  soundfonts: [],
});
