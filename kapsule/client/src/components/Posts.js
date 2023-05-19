import {
  Text,
  Image,
  SimpleGrid,
  AspectRatio,
  CircularProgress,
  Flex,
  Button,
  Box,
  CloseButton,
} from "@chakra-ui/react";

import ImageOptions from "./ImageOptions";
import { Favorite } from "@mui/icons-material";
import { useMutation } from "../hooks/useMutation";
import axiosClient from "../config/axios";
import { useState } from "react";

const ErrorText = ({ children, ...props }) => (
  <Text fontSize="lg" color="red.300" {...props}>
    {children}
  </Text>
);

const cloud_name = "dn2csumoj";
const api_key = "745634272993468";
const user = JSON.parse(localStorage.getItem("user"));

const Posts = ({ setUpdate, retrieveState }) => {
  const {
    data: images,
    isLoading: retrieving,
    error: retrieveErr,
  } = retrieveState;

  const {
    fn: remove,
    isLoading: removing,
    error: removeError,
  } = useMutation("delete");

  const {
    fn: likes,
    isLoading: liking,
    error: likesError,
  } = useMutation("likes");

  const sortedImages = images
    ?.map((obj) => {
      return { ...obj, date: new Date(obj.date) };
    })
    .sort((a, b) => b.date - a.date);

  const handleLikes = async (id, revIndex) => {
    images[images.length - revIndex - 1].likes += 1;
    const likesInfo = { username: user.username, id: id };
    await likes(likesInfo);
  };

  const handleDelete = async (imgId) => {
    const signatureResponse = await axiosClient.post("/find-signature", {
      imgId,
    });
    const formData = new FormData();
    formData.append("public_id", imgId);
    formData.append("signature", signatureResponse.data.signature);
    formData.append("api_key", api_key);
    formData.append("timestamp", signatureResponse.data.timestamp);

    const res = await axiosClient.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/destroy`,
      formData
    );

    const removeInfo = {
      username: user.username,
      id: imgId,
    };

    remove(removeInfo);
    setUpdate(true);
  };

  const [openOptions, setOpenOptions] = useState(false);
  const [imageInfo, setImageInfo] = useState("");
  const handleImage = (img) => {
    setImageInfo(img);
    setOpenOptions(true);
  };

  const getUrl = (imageId) => {
    return `https://res.cloudinary.com/${cloud_name}/image/upload/${imageId}`;
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
        {sortedImages?.length > 0 &&
          sortedImages.map((img, index) => (
            <Box
              key={img.id}
              pos={"relative"}
              _hover={{
                p: 1,
                opacity: 0.8,
                transition: "1s ease",
                cursor: "pointer",
              }}
              onClick={() => handleImage(img)}
            >
              <CloseButton
                pos={"absolute"}
                top={0}
                right={0}
                zIndex={1}
                _active={{ color: "red" }}
                onClick={() => handleDelete(img.id)}
              />
              <AspectRatio w={"auto"} ratio={1}>
                <Image src={getUrl(img.id)} alt="" objectFit="cover" />
              </AspectRatio>
              <Button
                leftIcon={<Favorite />}
                onClick={() => handleLikes(img.id, index)}
              >
                <Text>{img.likes}</Text>
              </Button>
              {likesError && <ErrorText>Likes malfunction</ErrorText>}
              <Text fontSize={"md"} noOfLines={2}>
                {img.description}
              </Text>
            </Box>
          ))}
      </SimpleGrid>

      {openOptions && (
        <ImageOptions
          open={openOptions}
          setOpen={setOpenOptions}
          img={imageInfo}
        />
      )}
    </Flex>
  );
};
export default Posts;
