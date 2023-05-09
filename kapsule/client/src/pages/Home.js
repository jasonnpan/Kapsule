import React from "react";
import Background from "../assets/bg.jpg";

import {
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  Highlight,
  useColorMode,
} from "@chakra-ui/react";

const Home = () => {
  return (
    <Stack minH={"100vh"} direction={{ base: "row", md: "row" }} spacing={0}>
      <Flex display={{ base: "none", md: "flex" }} ml={10}>
        <Desktop />
      </Flex>
      <Flex display={{ base: "flex", md: "none" }}>
        <Mobile />
      </Flex>
    </Stack>
  );
};

export default Home;

const Desktop = () => {
  const { colorMode } = useColorMode();

  return (
    <Flex>
      <Flex m={0} p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"lg"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <Highlight
              query={"Unleash"}
              styles={{
                fontFamily: "Bungee shade",
                color:
                  colorMode === "light"
                    ? "var(--chakra-colors-gray-600)"
                    : "var(--chakra-colors-white)",
              }}
            >
              Unleash
            </Highlight>
            <Text color={"blue.400"}>your creativity!</Text>
          </Heading>

          <Text
            fontSize={{ base: "sm", md: "md", lg: "lg" }}
            color={"gray.400"}
            fontWeight={"bold"}
          >
            <Highlight query={["Kapsule"]} styles={{ color: "blue.300" }}>
              Create your own Kapsule to show off your own artwork.
            </Highlight>
          </Text>

          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Button
              rounded={"full"}
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Get Started
            </Button>
            <Button rounded={"full"}>How It Works</Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image alt={"Login Image"} objectFit={"cover"} src={Background} />
      </Flex>
    </Flex>
  );
};

const Mobile = () => {
  const { colorMode } = useColorMode();
  
  return (
    <Flex direction={"column"} mt={10}>
      <Image alt={"Login Image"} objectFit={"cover"} src={Background} />

      <Flex p={8} flex={1} justify={"center"}>
        <Stack spacing={5} w={"full"} maxW={"lg"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <Highlight
              query={"Unleash"}
              styles={{
                fontFamily: "Bungee shade",
                color:
                  colorMode === "light"
                    ? "var(--chakra-colors-gray-600)"
                    : "var(--chakra-colors-white)",
              }}
            >
              Unleash
            </Highlight>
            <Text color={"blue.400"}>your creativity!</Text>
          </Heading>

          <Text
            fontSize={{ base: "sm", md: "md", lg: "lg" }}
            color={"gray.400"}
            fontWeight={"bold"}
          >
            <Highlight query={["Kapsule"]} styles={{ color: "blue.300" }}>
              Create your own Kapsule to show off your own artwork.
            </Highlight>
          </Text>

          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Button
              rounded={"full"}
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Get Started
            </Button>
            <Button rounded={"full"}>How It Works</Button>
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};
