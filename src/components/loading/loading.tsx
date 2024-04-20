import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface LoadingProps extends PropsWithChildren {
  loaded: boolean;
  loadingText?: string;
  error?: string;
}

export function Loading({
  children,
  loaded,
  loadingText,
  error,
}: LoadingProps) {
  if (loaded) {
    return <>{children}</>;
  }

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
      height={"100vh"}
      width={"100vw"}
    >
      <Heading color={"white"} marginBottom={"20px"}>
        {error ? "Error" : "Please wait"}
      </Heading>

      {loadingText && !error && (
        <Text color={"white"} marginBottom={"20px"}>
          {loadingText}
        </Text>
      )}

      {error && (
        <Text color={"red"} marginBottom={"20px"}>
          {error}
        </Text>
      )}

      {error && (
        <Link href={"/?offline=1"} textDecoration={"underline"}>
          Try offline mode
        </Link>
      )}
    </Flex>
  );
}
