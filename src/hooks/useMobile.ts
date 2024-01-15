import { useMediaQuery } from "@chakra-ui/react";

const useMobile = () => useMediaQuery("(max-width: 768px)")[0];

export default useMobile;
