import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { Link } from "react-router-dom";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Checkbox,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading, error } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(username, password);
  };

  const [terms, setTerms] = useState(false);

  return (
    <Flex
      pt={10}
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={6} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Create your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="username" isRequired isInvalid={error}>
              <FormLabel>Username</FormLabel>
              <Input
                type="username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </FormControl>
            <FormControl id="password" isRequired isInvalid={error}>
              <FormLabel> Password</FormLabel>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </FormControl>
            <Stack spacing={3} fontSize={"11px"}>
              <Stack direction={"row"}>
                <Checkbox size={"sm"}></Checkbox>
                <Stack direction={"row"} spacing={1}>
                  <Text display={"inline"}>I agree to the</Text>
                  <Text
                    color={"blue.400"}
                    _hover={{
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => setTerms(!terms)}
                  >
                    Terms and Conditions
                  </Text>
                </Stack>
              </Stack>
              {terms && <Box color={'red.300'}>There are currently no terms and conditions</Box>}

              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign Up
              </Button>
            </Stack>
            {error && <Box color="red">{error}</Box>}

            <Stack direction={"row"} fontSize={"11px"} w={"100%"}>
              <Text>Already have an account?</Text>
              <Text
                textColor={"blue.400"}
                _hover={{ textDecoration: "underline", cursor: "pointer" }}
              >
                <Link to="/login">Log in</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Signup;
