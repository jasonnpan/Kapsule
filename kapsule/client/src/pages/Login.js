import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(username);
    console.log(password);
    await login(username, password);
  };

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
          <Heading fontSize={"4xl"}>Log in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="username" isInvalid={error}>
              <FormLabel>Username</FormLabel>
              <Input
                type="username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </FormControl>
            <FormControl id="password" isInvalid={error}>
              <FormLabel> Password</FormLabel>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </FormControl>
            <Stack spacing={6}>
              <Stack
                direction={'row'}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Text
                  color={"blue.400"}
                  _hover={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  Forgot password?
                </Text>
              </Stack>
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
                Log in
              </Button>
            </Stack>
            {error && <Box color="red">{error}</Box>}

            <Stack direction={"row"} fontSize={"11px"} w={"100%"}>
              <Text>Don't have an account?</Text>
              <Text
                textColor={"blue.400"}
                _hover={{ textDecoration: "underline", cursor: "pointer" }}
              >
                <Link to="/signup">Sign up</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
