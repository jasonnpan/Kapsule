import { Box } from "@chakra-ui/react";
import Gallery from "../components/Gallery";

const Popular = () => {
  return (
    <Box pt={"60px"}>
      <Gallery title={'Popular'} initialSort={"Most favourited"}/>
    </Box>
  );
};

export default Popular;
