import { Box, VStack, Image, Text, useColorModeValue } from "@chakra-ui/react";
import Posts from "../components/Posts";
import Upload from "../components/Upload";
import ProfileImage from "../assets/profile.png";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Box textAlign="center" fontSize="2xl" p={5}>
      <VStack p={7} m="auto" width="fit-content" borderRadius={6} pt={"65px"}>
        <Image
          borderRadius="full"
          boxSize="80px"
          src={ProfileImage}
          alt="Profile"
          bg={useColorModeValue("white", "gray.100")}
        />
        <Text>{user.username}</Text>
        <Text fontSize="lg" color="gray.400">
          Software Engineer
        </Text>
      </VStack>
      
      <Upload />
      {/* <Posts /> */}
    </Box>
  );
};

export default Profile;
