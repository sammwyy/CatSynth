import { Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import useMobile from "../../hooks/useMobile";

interface SideProps extends PropsWithChildren {
  onClick?: () => void;
  vAlign?: "top" | "center" | "bottom";
}

const vAlignMap = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
};

export default function Side(props: SideProps) {
  const isMobile = useMobile();

  return (
    <Flex
      alignItems={"center"}
      flexDir={"column"}
      justifyContent={vAlignMap[props.vAlign || "top"]}
      transition={"120ms all ease-in-out"}
      height={"100%"}
      width={isMobile ? "49%" : "33%"}
      cursor={props.onClick ? "pointer" : "normal"}
      gap={"20px"}
      onClick={props.onClick}
    >
      {props.children}
    </Flex>
  );
}
