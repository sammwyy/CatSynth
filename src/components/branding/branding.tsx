import { Flex, Heading, Link, Text } from "@chakra-ui/react";

import styles from "./branding.module.css";

export function Branding() {
  return (
    <Flex flexDir={"column"}>
      <Heading fontSize={"60px"} className={styles.title}>
        CatSynth
      </Heading>
      <Text className={styles.subtitle}>
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
    </Flex>
  );
}
