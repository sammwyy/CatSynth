import { useContext } from "react";
import { SynthesizerContext } from "../context/synthesizer-context";

const useSynthesizer = () => useContext(SynthesizerContext);

export default useSynthesizer;
