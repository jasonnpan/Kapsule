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

import { Favorite } from "@mui/icons-material";
import { useLikes } from "../hooks/useLikes";
import { useRetrieveAll } from "../hooks/useRetrieveAll";

const ErrorText = ({ children, ...props }) => (
  <Text fontSize="lg" color="red.300" {...props}>
    {children}
  </Text>
);

const cloud_name = "dn2csumoj";

const Gallery = () => {
  const {
    data: images,
    isLoading: retrieving,
    error: retrieveErr,
  } = useRetrieveAll();

  const sortedImages = images
    ?.map((obj) => {
      return { ...obj, date: new Date(obj.date) };
    })
    .sort((a, b) => b.date - a.date);

  const { likes, error: likesError } = useLikes();

  const handleLikes = async (index) => {
    const img = sortedImages[index];
    images.find((a) => a.id === img.id).likes += 1;
    const likesInfo = { username: img.author, id: img.id };
    await likes(likesInfo);
  };

  const getUrl = (imageId) => {
    return `https://res.cloudinary.com/${cloud_name}/image/upload/${imageId}`;
  };

  return (
    <Flex mt={6} flexDirection={"column"}>
      <Text textAlign={"left"} fontSize={"4xl"} mb={2}>
        Discover
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
            <Box key={img.id} >
              <AspectRatio w={"auto"} ratio={1}>
                <Image src={getUrl(img.id)} alt="" objectFit="cover" />
              </AspectRatio>
              <Button
                leftIcon={<Favorite />}
                onClick={() => handleLikes(index)}
                // mx={'50%'}
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
    </Flex>
  );
};
export default Gallery;
