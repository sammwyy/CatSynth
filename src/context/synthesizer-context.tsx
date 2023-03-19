import { PropsWithChildren, createContext, useState } from "react";
import Splash from "../components/splash/splash";
import { Synthesizer, waitForReady } from "../modules/synthesizer";

type NullableSynthesizer = Synthesizer | null;
type NullableAudioContext = AudioContext | null;

export const SynthesizerContext = createContext<{
  synthesizer: NullableSynthesizer;
  audioContext: NullableAudioContext;
}>({
  synthesizer: null,
  audioContext: null,
});

export const SynthesizerProvider = ({ children }: PropsWithChildren) => {
  const [synthesizer, setSynthesizer] = useState<NullableSynthesizer>(null);
  const [audiocontext, setAudioContext] = useState<NullableAudioContext>(null);

  async function setup() {
    await waitForReady();

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

  return (
    <SynthesizerContext.Provider
      value={{ synthesizer, audioContext: audiocontext }}
    >
      {synthesizer != null && children}
      {synthesizer == null && (
        <Splash
          onClick={() => {
            setup();
          }}
        />
      )}
    </SynthesizerContext.Provider>
  );
};
