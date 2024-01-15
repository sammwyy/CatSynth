import { useContext } from "react";
import { SynthesizerContext } from "../context/synthesizer";

const useSynthesizer = () => useContext(SynthesizerContext);

export default useSynthesizer;
