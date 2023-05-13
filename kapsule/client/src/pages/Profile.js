import { Box, VStack, Image, Text, useColorModeValue } from "@chakra-ui/react";
import Posts from "../components/Posts";
import Upload from "../components/Upload";
import ProfileImage from "../assets/profile.png";

import { useState } from "react";
import { useRetrieve } from "../hooks/useRetrieve";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [update, setUpdate] = useState(false);

  // retrieve hooks
  const [refetch, setRefetch] = useState(0);
  const retrieveState = useRetrieve(user.username, refetch);

  if (update) {
    setTimeout(() => {
      setRefetch((s) => s + 1);
    }, 1000);
    setUpdate(false);
  }

  return (
    <Box textAlign="center" fontSize="2xl" p={5}>
      <VStack p={7} m="auto" width="fit-content" borderRadius={6} pt={"65px"}>
        <Image
          borderRadius="full"
          boxSize="120px"
          src={ProfileImage}
          alt="Profile"
          bg={useColorModeValue("white", "gray.100")}
        />
        <Text>{user.username}</Text>
        <Text fontSize="lg" color="gray.400">
          Software Engineer
        </Text>
      </VStack>

      <Upload setUpdate={setUpdate} />
      <Posts retrieveState={retrieveState} />
    </Box>
  );
};

export default Profile;
