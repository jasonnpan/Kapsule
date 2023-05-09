import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useState, useRef } from "react";
import axiosClient from "../config/axios";

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

  const handleUpload = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    console.log(file);

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

    const cloudinaryResponse = await axiosClient.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: function (e) {
          console.log(e.loaded / e.total);
        },
      },
    );
    console.log(cloudinaryResponse.data);
  };

  const resetInput = () => {
    aRef.current.value = null;
  };

  return (
    <Box mt={6}>
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
        onClick={resetInput}
      >
        Upload
      </Button>
      {error && <ErrorText />}
    </Box>
  );
};
export default Posts;
