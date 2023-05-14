import {
  Text,
  Image,
  SimpleGrid,
  AspectRatio,
  CircularProgress,
  Flex,
  Button,
  Box,
} from "@chakra-ui/react";

import { useState } from "react";

import { Favorite } from "@mui/icons-material";
import { useLikes } from "../hooks/useLikes";

const ErrorText = ({ children, ...props }) => (
  <Text fontSize="lg" color="red.300" {...props}>
    {children}
  </Text>
);

const cloud_name = "dn2csumoj";
const user = JSON.parse(localStorage.getItem("user"));

const Posts = ({ retrieveState }) => {
  const {
    data: images,
    isLoading: retrieving,
    error: retrieveErr,
  } = retrieveState;

  const {
    likes: likes,
    isLoading: likesLoading,
    error: likesError,
  } = useLikes();

  const handleLikes = async (id) => {
    const likesInfo = { username: user.username, id: id };
    await likes(likesInfo);
  };

  const getUrl = (imageId) => {
    return `https://res.cloudinary.com/${cloud_name}/image/upload/${imageId}.jpg`;
  };

  return (
    <Flex mt={6} flexDirection={"column"}>
      <Text textAlign={"left"} fontSize={"4xl"} mb={2}>
        Posts
      </Text>
      {retrieving && (
        <CircularProgress
          color="gray.600"
          trackColor="blue.300"
          size={7}
          thickness={10}
          isIndeterminate
        />
      )}
      {retrieveErr && (
        <ErrorText textAlign="left">Failed to load images</ErrorText>
      )}

      {!retrieveErr && images?.length === 0 && (
        <Text textAlign="left" fontSize="lg" color="gray.500">
          No images found
        </Text>
      )}
      <SimpleGrid columns={[4, 5, 6]} spacing={4} listStyleType={"none"}>
        {images?.length > 0 &&
          images
            .slice()
            .reverse()
            .map((img) => (
              <li key={img.id}>
                <AspectRatio w={"auto"} ratio={1}>
                  <Image src={getUrl(img.id)} alt="" objectFit="cover" />
                </AspectRatio>
                <Button leftIcon={<Favorite />} onClick={() => handleLikes(img.id)}>
                  Like
                </Button>
                <Text fontSize={"md"} noOfLines={2}>
                  {img.description}
                </Text>
              </li>
            ))}
      </SimpleGrid>
    </Flex>
  );
};
export default Posts;
