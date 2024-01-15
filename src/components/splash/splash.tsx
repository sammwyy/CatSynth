import { PropsWithChildren, useRef, useState } from "react";

import { Button, Flex, Heading } from "@chakra-ui/react";

export function Splash({ children }: PropsWithChildren) {
  const [ended, setEnded] = useState(false);
  const [pressed, setPressed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleClick = () => {
    if (audioRef.current) {
      const audio = audioRef.current;

      setPressed(true);
      audio.volume = 0.2;
      audio.play();
      audio.addEventListener("ended", () => {
        setEnded(true);
      });
    }
  };

  // If the audio has ended, we can render the children
  if (ended) return <>{children}</>;

  // If the audio has not ended, we can render the splash screen
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

      <audio src="/boot.mp3" controls={false} autoPlay={false} ref={audioRef} />
    </Flex>
  );
}
