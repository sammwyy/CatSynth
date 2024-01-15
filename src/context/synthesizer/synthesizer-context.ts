import { Synthesizer } from "js-synthesizer";
import React from "react";

export interface SynthesizerHook {
  synthesizer: Synthesizer | null;
  audioContext: AudioContext | null;
}

export const SynthesizerContext = React.createContext<SynthesizerHook>({
  synthesizer: null,
  audioContext: null,
});
