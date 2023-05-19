import { useState } from "react";
import axiosClient from "../config/axios";

import {
  Box,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Image,
  Tag,
  TagLabel,
  TagCloseButton,
  Checkbox,
  InputRightElement,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import { useMutation } from "../hooks/useMutation";

const user = JSON.parse(localStorage.getItem("user"));
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

const Upload = ({ setUpdate }) => {
  const [description, setDescription] = useState("");
  const [pub, setPub] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const onImageChange = (e) => {
    setError("");
    setImage(null);
    setUploadError("");

    const file = e.target.files[0];

    if (!validFileTypes.find((type) => file && type === file.type)) {
      setError("File must be in JPG/PNG format");
      return;
    }

    if (e.target.files && e.target.files[0]) {
      setImage(file);
      setImageURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const checkHandler = () => {
    setPub(!pub);
  };

  const reset = () => {
    setImage(null);
    setDescription("");
    setPub(false);
    setTags([]);
    setNewTag("");
    setError("");
    setUploadError("");
  };

  const openHandler = () => {
    onOpen();
    reset();
  };

  const addTag = () => {
    if (!(tags.indexOf(newTag) > -1)) {
      setTags([...tags, newTag]);
    }
    setNewTag("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTag();
    }
  };

  const {
    fn: upload,
    isLoading: uploading,
    error: uploadErr,
  } = useMutation("upload");
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async () => {
    if (!image) {
      setUploadError("Please add an image.");
      return;
    }

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

    const uploadInfo = {
      username: user.username,
      id: cloudRes.data.public_id,
      description: description,
      public: pub,
      tags: tags,
      date: Date().toLocaleString(),
    };

    await upload(uploadInfo);
    setUpdate(true);
    onClose();
  };

  return (
    <Box>
      <Button onClick={openHandler} colorScheme="blue" variant="outline">
        Upload
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload options</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={uploadError}>
              <Input onChange={onImageChange} type="file" padding={1.5} />
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

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Public</FormLabel>
              <Checkbox defaultChecked={pub} onChange={checkHandler} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tags</FormLabel>
              <InputGroup>
                <Input
                  value={newTag}
                  placeholder="Add your favourite tags !!!"
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                ></Input>
                <InputRightElement>
                  <Button
                    onClick={addTag}
                    colorScheme="blue"
                    variant={"outline"}
                  >
                    Add
                  </Button>
                </InputRightElement>
              </InputGroup>

              {tags.map((item) => (
                <Tag
                  size={"md"}
                  key={item}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="green"
                  m={1}
                >
                  <TagLabel>{item}</TagLabel>
                  <TagCloseButton />
                </Tag>
              ))}
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
            <Button type="submit" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
          {uploadError && <ErrorText>{uploadError}</ErrorText>}
          {uploadErr && <ErrorText>{uploadErr}</ErrorText>}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Upload;
