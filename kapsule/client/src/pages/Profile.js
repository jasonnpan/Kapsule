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
} from "@chakra-ui/react";

import Posts from "../components/Posts";
import Upload from "../components/Upload";
import ProfileImage from "../assets/profile.png";

import { useState } from "react";
import { useRetrieve } from "../hooks/useRetrieve";

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

  const [hidden, setHidden] = useState(true);
  const [style, setStyle] = useState(null);

  const handleMouseEnter = () => {
    setHidden(false);
    setStyle({ opacity: 0.3, cursor: "pointer" });
  };

  const handleMouseLeave = () => {
    setHidden(true);
    setStyle({ opacity: 1 });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChangeProfile = () => {
    onOpen();
  };

  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
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
      setImageURL(URL.createObjectURL(file))
    }
  };

  const handleUpload = async () => {
    localStorage.setItem("ProfileImage", image)
   
    onClose();
    window.location.reload(false);
  };

  return (
    <Box textAlign="center" fontSize="2xl" p={5}>
      <VStack p={7} m="auto" width="fit-content" borderRadius={6} pt={"65px"}>
        <Center>
          <Avatar
            borderRadius="full"
            size={"2xl"}
            src={ProfileImage}
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

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Change Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
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
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleUpload}>
                Upload
              </Button>
              <Button type="submit" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

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
