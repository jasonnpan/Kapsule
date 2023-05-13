import {
  Box,
  Button,
  Input,
  Text,
  Image,
  SimpleGrid,
  AspectRatio,
  CircularProgress,
  Flex,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import axiosClient from "../config/axios";
import { useUpload } from "../hooks/useUpload";
import { useRetrieve } from "../hooks/useRetrieve";

const validFileTypes = ["image/jpg", "image/jpeg", "image/png"];

const ErrorText = ({ children, ...props }) => (
  <Text fontSize="lg" color="red.300" {...props}>
    {children}
  </Text>
);

const cloud_name = "dn2csumoj";
const api_key = "745634272993468";

const Posts = () => {
  const aRef = useRef(null);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  // upload and retrieve hooks
  const { upload, uploading, uploadErr } = useUpload();

  const [refetch, setRefetch] = useState(0);
  const {
    data: images,
    isLoading: retrieving,
    error: retrieveErr,
  } = useRetrieve(user.username, refetch);

  // handles upload
  const handleUpload = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];

    if (!validFileTypes.find((type) => type === file.type)) {
      setError("File must be in JPG/PNG format");
      return;
    }

    const signatureResponse = await axiosClient.get("/get-signature");

    const data = new FormData();
    data.append("file", file);
    data.append("api_key", api_key);
    data.append("signature", signatureResponse.data.signature);
    data.append("timestamp", signatureResponse.data.timestamp);

    const cloudRes = await axiosClient.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    await upload(user.username, cloudRes.data.public_id);
    setTimeout(() => {
      setRefetch((s) => s + 1);
    }, 1000);
  };

  const resetInput = () => {
    aRef.current.value = null;
  };

  const getUrl = (imageId) => {
    return `https://res.cloudinary.com/${cloud_name}/image/upload/${imageId}.jpg`;
  };

  return (
    <Flex mt={6} flexDirection={'column'} alignItems={'center'}>
      <Input
        id="imageInput"
        ref={aRef}
        type="file"
        hidden
        onChange={handleUpload}
      />
      <Button
        as="label"
        htmlFor="imageInput"
        colorScheme="blue"
        variant="outline"
        mb={4}
        cursor="pointer"
        isLoading={uploading}
        onClick={resetInput}
      >
        Upload
      </Button>
      {error && <ErrorText>{error}</ErrorText>}
      {uploadErr && <ErrorText>{uploadErr}</ErrorText>}

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
      <SimpleGrid columns={[3, 4, 5]} spacing={4} listStyleType={'none'} >
        {images?.length > 0 &&
          images.map((img) => (
            <li key={img.id}>
              <AspectRatio w={"auto"} ratio={1}>
              <Image src={getUrl(img.id)} alt="" objectFit="cover" />
            </AspectRatio>
            </li>
            
          ))}
      </SimpleGrid>
    </Flex>
  );
};
export default Posts;
