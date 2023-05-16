import {
  Text,
  Image,
  SimpleGrid,
  AspectRatio,
  CircularProgress,
  Flex,
  Button,
  Box,
  Stack,
  Select,
} from "@chakra-ui/react";

import { useState } from "react";
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

  const [filterTag, setFilterTag] = useState("");
  const [filtered, setFiltered] = useState(null);

  const tags = {};
  images?.map((img) => {
    img.tags?.map((tag) => {
      if (tags[tag]) {
        tags[tag] += 1;
      } else {
        tags[tag] = 1;
      }
    });
  });

  const sortedImages = images
    ?.filter((img) => img.public)
    .map((obj) => {
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

  const handleSelect = (e) => {
    return setFilterTag(e.target.value);
  };

  const handleFilter = () => {
    var filtered = images
      ?.filter((img) => img.public)
      .map((obj) => {
        return { ...obj, date: new Date(obj.date) };
      })
      .sort((a, b) => b.date - a.date);

    if (filterTag != "") {
      filtered = filtered.filter((img) => img.tags.includes(filterTag));
    }

    setFiltered(filtered);
  };

  return (
    <Flex mt={6} flexDirection={"column"}>
      <Text textAlign={"left"} fontSize={"4xl"} mb={2}>
        Discover
      </Text>

      <Stack direction={"row"}>
        <Select placeholder="Select tags" onChange={handleSelect}>
          {Object.keys(tags).map((tag) => (
            <option value={tag} key={tag}>
              {tag + " " + tags[tag]}
            </option>
          ))}
        </Select>
        <Button onClick={handleFilter}>Filter</Button>
      </Stack>

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
        {filtered?.length > 0 &&
          filtered.map((img, index) => (
            <Box key={img.id} p={2}>
              <AspectRatio w={"auto"} ratio={1}>
                <Image src={getUrl(img.id)} alt="" objectFit="cover" />
              </AspectRatio>
              <Button
                leftIcon={<Favorite />}
                onClick={() => handleLikes(index)}
              >
                <Text>{img.likes}</Text>
              </Button>
              {likesError && <ErrorText>Likes malfunction</ErrorText>}
              <Text fontSize={"md"} noOfLines={2}>
                {img.description}
              </Text>{" "}
            </Box>
          ))}

        {sortedImages?.length > 0 &&
          !filtered &&
          sortedImages.map((img, index) => (
            <Box key={img.id} p={2}>
              <AspectRatio w={"auto"} ratio={1}>
                <Image src={getUrl(img.id)} alt="" objectFit="cover" />
              </AspectRatio>
              <Button
                leftIcon={<Favorite />}
                onClick={() => handleLikes(index)}
              >
                <Text>{img.likes}</Text>
              </Button>
              {likesError && <ErrorText>Likes malfunction</ErrorText>}
              <Text fontSize={"md"} noOfLines={2}>
                {img.description}
              </Text>{" "}
            </Box>
          ))}
      </SimpleGrid>
    </Flex>
  );
};
export default Gallery;
