import { useContext } from "react";
import { PlayerContext } from "../context/player";

const usePlayer = () => useContext(PlayerContext);

export default usePlayer;
