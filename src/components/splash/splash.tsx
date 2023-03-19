import { Button, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";

interface SplashProps {
  onClick: () => void;
}

export default function Splash({ onClick }: SplashProps) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    setTimeout(() => {
      onClick();
    }, 6000);
  };

  return (
    <Flex
      height={"100vh"}
      width={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
      bg={pressed ? "url('/bg.gif') fixed" : ""}
      bgRepeat={"repeat-x"}
      bgSize={"contain"}
      bgPos={"center"}
      style={{
        imageRendering: "pixelated",
      }}
    >
      {!pressed && (
        <>
          <Heading>Welcome!</Heading>
          <Button onClick={handleClick} disabled={pressed} margin={"10px"}>
            Grant audio permission
          </Button>
        </>
      )}

      {pressed && <audio src="/boot.mp3" controls={false} autoPlay={true} />}
    </Flex>
  );
}
