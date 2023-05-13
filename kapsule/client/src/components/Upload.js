import { useState } from "react";
import axiosClient from "../config/axios";

import { useUpload } from "../hooks/useUpload";

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
} from "@chakra-ui/react";

const user = JSON.parse(localStorage.getItem("user"));
const cloud_name = "dn2csumoj";
const api_key = "745634272993468";

const Upload = () => {
  const [description, setDescription] = useState("");
  const [pub, setPub] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
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

  const { upload, uploading, uploadErr } = useUpload();

  const handleUpload = async () => {
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
    };

    await upload(uploadInfo);
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
            <FormControl>
              <Input onChange={onImageChange} type="file" padding={1.5} />
              {image && (
                <Image
                  mt={2}
                  boxSize={100}
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
                ></Input>
                <InputRightElement>
                  <Button onClick={addTag} colorScheme="blue" variant={'outline'}>Add</Button>
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
            <Button colorScheme="blue" mr={3} onClick={handleUpload}>
              Upload
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Upload;
