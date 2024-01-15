import { PropsWithChildren, useEffect, useState } from "react";

import Loading from "../../components/loading";
import Midi from "../../interfaces/midi";
import SoundFont from "../../interfaces/soundfont";
import { getCDNPath } from "../../utils/constants.utils";
import { DataContext } from "./data-context";

export function DataProvider({ children }: PropsWithChildren) {
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const [soundfonts, setSoundfonts] = useState<SoundFont[]>([]);
  const [midis, setMidis] = useState<Midi[]>([]);

  const fixItem = (item: Midi | SoundFont) => {
    item.url = getCDNPath(item.url);
    return item;
  };

  const fetchData = async () => {
    const res = await fetch(getCDNPath("data.json"));
    const data = await res.json();
    const soundfonts = data.soundfonts.map(fixItem);
    const midis = data.midis.map(fixItem);
    setSoundfonts(soundfonts);
    setMidis(midis);
    setFetched(true);
  };

  useEffect(() => {
    fetchData().catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DataContext.Provider value={{ midis, soundfonts }}>
      <Loading
        loaded={fetched}
        loadingText={"Fetching resources..."}
        error={error}
      >
        {children}
      </Loading>
    </DataContext.Provider>
  );
}
