import { Box } from "@chakra-ui/react";
import Gallery from "../components/Gallery";

const Discover = () => {
  return (
    <Box pt={"60px"}>
      <Gallery title={'Search'} initialSort={"Most recent"}/>
    </Box>
  );
};

export default Discover;
