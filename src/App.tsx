import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { PlayerProvider } from "./context/player-context";
import { SynthesizerProvider } from "./context/synthesizer-context";
import { Analytics } from "@vercel/analytics/react";

import Layout from "./layout";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

function App() {
  return (
    <ChakraProvider theme={theme}>
      <SynthesizerProvider>
        <PlayerProvider>
          <Analytics />
          <Layout />
        </PlayerProvider>
      </SynthesizerProvider>
    </ChakraProvider>
  );
}

export default App;
