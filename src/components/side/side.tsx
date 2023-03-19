import { Flex } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface SideProps extends PropsWithChildren {
  onClick: () => void;
}

export default function Side(props: SideProps) {
  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      transition={"120ms all ease-in-out"}
      height={"100%"}
      width={"50%"}
      cursor={"pointer"}
      onClick={props.onClick}
    >
      {props.children}
    </Flex>
  );
}
