import { useContext } from "react";
import { DataContext } from "../context/data";

const useData = () => useContext(DataContext);

export default useData;
