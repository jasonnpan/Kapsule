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
  Tag,
  TagLabel,
  TagCloseButton,
  Checkbox,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useMutation } from '../hooks/useMutation';

const ImageOptions = ({ open, setOpen, img }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState('');
  const [description, setDescription] = useState(img.description);
  const [pub, setPub] = useState(img.public);
  const [tags, setTags] = useState(img.tags);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (open) onOpen();
  }, [open]);

  const {
    fn: update,
    isLoading: updating,
    error: updateErr,
  } = useMutation('update');

  const handleUpdate = async () => {
    const updateInfo = {
      username: img.author,
      id: img.id,
      description: description,
      public: pub,
      tags: tags,
      date: Date().toLocaleString(),
    };

    await update(updateInfo);
    handleClose();
    window.location.reload(false);
  };

  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  const handleAddTag = () => {
    if (!(tags.indexOf(newTag) > -1)) {
      setTags([...tags, newTag]);
    }

    setNewTag('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag) => {
    const newTags = tags.filter((x) => x !== tag);
    setTags(newTags);
  };

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update image</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Description'
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Public</FormLabel>
              <Checkbox isChecked={pub} onChange={() => setPub(!pub)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Tags</FormLabel>
              <InputGroup>
                <Input
                  value={newTag}
                  placeholder='Add your favourite tags !!!'
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                ></Input>
                <InputRightElement>
                  <Button
                    onClick={handleAddTag}
                    colorScheme='blue'
                    variant={'outline'}
                  >
                    Add
                  </Button>
                </InputRightElement>
              </InputGroup>

              {tags.map((item) => (
                <Tag
                  size={'md'}
                  key={item}
                  borderRadius='full'
                  variant='solid'
                  colorScheme='green'
                  m={1}
                >
                  <TagLabel>{item}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveTag(item)} />
                </Tag>
              ))}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleUpdate}>
              Update
            </Button>
            <Button type='submit' onClick={handleClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ImageOptions;
