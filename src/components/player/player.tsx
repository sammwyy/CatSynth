import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import usePlayer from "../../hooks/usePlayer";
import styles from "./player.module.css";

export default function Player() {
  const player = usePlayer();
  const canPlay = player.isSongLoaded() && player.isFontLoaded();

  return (
    <Box className={styles["player"]}>
      <Heading fontSize={"60px"} className={styles["title"]}>
        CatSynth
      </Heading>
      <Text className={styles["subtitle"]}>
        Experimental web synth by
        <Link
          href="https://twitter.com/sammwy"
          target="_blank"
          rel="nofollow noreferrer"
        >
          {" "}
          Sammwy
        </Link>
      </Text>
      <Flex alignItems={"center"} marginTop={"10px"}>
        <Button
          margin={"auto"}
          isDisabled={!canPlay}
          onClick={async () => {
            if (player.isPlaying) await player.stop();
            else await player.play();
          }}
        >
          {canPlay
            ? player.isPlaying
              ? "Stop"
              : "Play"
            : "No font nor midi selected"}
        </Button>
      </Flex>
    </Box>
  );
}
