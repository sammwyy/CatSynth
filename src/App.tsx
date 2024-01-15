import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import { SynthesizerProvider } from "./context/synthesizer";

import Splash from "./components/splash";
import { DataProvider } from "./context/data";
import { PlayerProvider } from "./context/player";
import Layout from "./layout";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Splash>
        <DataProvider>
          <SynthesizerProvider>
            <PlayerProvider>
              <Analytics />
              <Layout />
            </PlayerProvider>
          </SynthesizerProvider>
        </DataProvider>
      </Splash>
    </ChakraProvider>
  );
}

export default App;
