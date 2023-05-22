import {
  Box,
  VStack,
  Image,
  Text,
  useColorModeValue,
  Center,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Avatar,
  FormControl,
} from "@chakra-ui/react";

import { useState } from "react";
import axiosClient from "../config/axios";
import { useMutation } from "../hooks/useMutation";

import Pic from "../assets/profile.png";

const cloud_name = "dn2csumoj";
const api_key = "745634272993468";

const validFileTypes = ["image/jpg", "image/jpeg", "image/png"];

const ErrorText = ({ children, ...props }) => (
  <Text
    fontSize="lg"
    color="red.300"
    textAlign="center"
    mb={2}
    fontWeight={"bold"}
    {...props}
  >
    {children}
  </Text>
);

const user = JSON.parse(localStorage.getItem("user"));

const ProfileImage = () => {
  const [hidden, setHidden] = useState(true);
  const [style, setStyle] = useState(null);

  const {
    fn: upload,
    isLoading: uploading,
    error: uploadError,
  } = useMutation("profile");

  const handleMouseEnter = () => {
    setHidden(false);
    setStyle({ opacity: 0.3, cursor: "pointer" });
  };

  const handleMouseLeave = () => {
    setHidden(true);
    setStyle({ opacity: 1 });
  };

  const handleClose = () => {
    onClose();
    handleMouseLeave();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChangeProfile = () => {
    onOpen();
    setImageError("");
  };

  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [imageError, setImageError] = useState("");
  const handleImageChange = (e) => {
    setError("");
    setImage(null);

    const file = e.target.files[0];

    if (!validFileTypes.find((type) => file && type === file.type)) {
      setError("File must be in JPG/PNG format");
      return;
    }

    if (e.target.files && e.target.files[0]) {
      setImage(file);
      setImageURL(URL.createObjectURL(file));
    }
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

    console.log(res.statusText);
  };

  const handleUpload = async () => {
    if (!image) {
      setImageError("Please add an image.");
      return;
    }
    handleDelete(user.profile);

    const signatureResponse = await axiosClient.get("/get-signature");
    const data = new FormData();
    data.append("file", image);
    data.append("api_key", api_key);
    data.append("signature", signatureResponse.data.signature);
    data.append("timestamp", signatureResponse.data.timestamp);
    const cloudRes = await axiosClient.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    user["profile"] = cloudRes.data.public_id;
    localStorage.setItem("user", JSON.stringify(user));

    const info = {
      username: user.username,
      profile: cloudRes.data.public_id,
    };
    await upload(info);

    onClose();
    window.location.reload(false);
  };

  const getUrl = (imageId) => {
    return `https://res.cloudinary.com/${cloud_name}/image/upload/${imageId}`;
  };

  return (
    <Box>
      <VStack p={7} m="auto" width="fit-content" borderRadius={6} pt={"65px"}>
        <Center>
          <Avatar
            borderRadius="full"
            size={"2xl"}
            src={user.profile ? getUrl(user.profile) : Pic}
            alt="Profile"
            bg={useColorModeValue("white", "gray.100")}
            style={style}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            draggable={false}
            onClick={handleChangeProfile}
            overflow={true}
          />
          <Text
            pos={"absolute"}
            fontSize={["sm", "md"]}
            hidden={hidden}
            onMouseEnter={handleMouseEnter}
            _hover={{ cursor: "pointer" }}
            onClick={handleChangeProfile}
          >
            Change profile
          </Text>
        </Center>

        <Modal isOpen={isOpen} onClose={handleClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Change Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isInvalid={imageError}>
                <Input onChange={handleImageChange} type="file" padding={1.5} />
                {error && <ErrorText>{error}</ErrorText>}
                {image && (
                  <Image
                    mt={2}
                    boxSize={100}
                    objectFit={"cover"}
                    alt="preview image"
                    src={imageURL}
                  />
                )}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleUpload}
                isLoading={uploading}
              >
                Upload
              </Button>

              <Button type="submit" onClick={handleClose}>
                Cancel
              </Button>
            </ModalFooter>
            {imageError && <ErrorText>{imageError}</ErrorText>}
            {uploadError && <ErrorText>{uploadError}</ErrorText>}
          </ModalContent>
        </Modal>

        <Text>{user.username}</Text>
      </VStack>
    </Box>
  );
};

export default ProfileImage;
