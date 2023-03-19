import { useContext } from "react";
import { PlayerContext } from "../context/player-context";

const usePlayer = () => useContext(PlayerContext);

export default usePlayer;
