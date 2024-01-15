import { PropsWithChildren, useEffect, useState } from "react";

import { Synthesizer } from "js-synthesizer";

import Loading from "../../components/loading";
import { SynthesizerContext } from "./synthesizer-context";

export function SynthesizerProvider({ children }: PropsWithChildren) {
  const [synthesizer, setSynthesizer] = useState<Synthesizer | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  async function setup() {
    // Initialize Synthesizer with audio context.
    const audioContext = new AudioContext();
    setAudioContext(audioContext);
    const synth = new Synthesizer();
    synth.init(audioContext.sampleRate);

    // Create AudioNode (ScriptProcessorNode) to output audio data
    var node = synth.createAudioNode(audioContext, 8192); // 8192 is the frame count of buffer
    node.connect(audioContext.destination);

    setSynthesizer(synth);
  }

  useEffect(() => {
    if (synthesizer == null) {
      setup();
    }
  }, [synthesizer]);

  return (
    <SynthesizerContext.Provider value={{ synthesizer, audioContext }}>
      <Loading
        loaded={synthesizer != null && audioContext != null}
        loadingText="Initializing synthesizer..."
      >
        {children}
      </Loading>
    </SynthesizerContext.Provider>
  );
}
