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
  Input,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import { Favorite } from "@mui/icons-material";
import { useLikes } from "../hooks/useLikes";
import { useRetrieveAll } from "../hooks/useRetrieveAll";

const ErrorText = ({ children, ...props }) => (
  <Text fontSize="lg" color="red.300" {...props}>
    {children}
  </Text>
);

const cloud_name = "dn2csumoj";

const years = [2023, 2022, 2021, 2020, 2019, 2018];
const sortOptions = ["Most recent", "Most favourited"];

const Gallery = ({ title, initialSort }) => {
  const {
    data: images,
    isLoading: retrieving,
    error: retrieveErr,
  } = useRetrieveAll();

  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [sortOption, setSortOption] = useState(initialSort);
  const [filtered, setFiltered] = useState([]);

  const tags = {};
  images?.forEach((img) => {
    img.tags?.forEach((tag) => {
      if (tags[tag]) {
        tags[tag] += 1;
      } else {
        tags[tag] = 1;
      }
    });
  });

  const { likes, error: likesError } = useLikes();

  const handleLikes = async (arr, index) => {
    arr[index].likes += 1;
    const img = arr[index];
    images.find((a) => a.id === img.id).likes += 1;
    const likesInfo = { username: img.author, id: img.id };
    await likes(likesInfo);
  };

  const getUrl = (imageId) => {
    return `https://res.cloudinary.com/${cloud_name}/image/upload/${imageId}`;
  };

  const handleSelect = (e, setFilter) => {
    return setFilter(e.target.value);
  };

  const handleFilter = () => {
    var filtered = images
      ?.filter((img) => img.public)
      .map((obj) => {
        return { ...obj, date: new Date(obj.date) };
      });

    if (filterTag !== "") {
      filtered = filtered?.filter((img) => img.tags.includes(filterTag));
    }

    if (filterYear !== "") {
      filtered = filtered?.filter(
        (img) => img.date.getFullYear().toString() === filterYear
      );
    }

    if (sortOption === "Most favourited") {
      filtered = filtered?.sort((a, b) => b.likes - a.likes);
    } else if (sortOption === "Most recent") {
      filtered = filtered?.sort((a, b) => b.date - a.date);
    }

    if (search !== "") {
      filtered = filtered?.filter((img) => img.description.includes(search));
    }

    setFiltered(filtered);
  };

  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  return (
    <Flex mt={6} flexDirection={"column"}>
      <Text textAlign={"left"} fontSize={"4xl"} mx={2} mb={2}>
        {title}
      </Text>

      <Stack direction={"row"} mx={2} spacing={4}>
        <Input
          placeholder="Search image..."
          onChange={(e) => handleSelect(e, setSearch)}
        ></Input>
        <Select
          placeholder="Select tags"
          onChange={(e) => handleSelect(e, setFilterTag)}
        >
          {Object.keys(tags).map((tag) => (
            <option value={tag} key={tag}>
              {tag + " " + tags[tag]}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Select Year"
          onChange={(e) => handleSelect(e, setFilterYear)}
        >
          {years.map((year) => (
            <option value={year} key={year}>
              {year}
            </option>
          ))}
        </Select>
        <Select value={initialSort} onChange={(e) => handleSelect(e, setSortOption)}>
          {sortOptions.map((opt) => (
            <option value={opt} key={opt}>
              {opt}
            </option>
          ))}
        </Select>
        <Button onClick={handleFilter} px={8}>Filter</Button>
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
      <SimpleGrid columns={[4, 5, 6]} spacing={4} mt={4} listStyleType={"none"}>
        {filtered?.length > 0 &&
          filtered.map((img, index) => (
            <Box key={img.id} p={2}>
              <AspectRatio w={"auto"} ratio={1}>
                <Image src={getUrl(img.id)} alt="" objectFit="cover" />
              </AspectRatio>
              <Button
                leftIcon={<Favorite />}
                onClick={() => handleLikes(filtered, index)}
              >
                <Text>{img.likes}</Text>
              </Button>
              {likesError && <ErrorText>Likes malfunction</ErrorText>}
              <Text fontSize={"md"} noOfLines={2}>
                {img.date.toString()}
              </Text>
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
