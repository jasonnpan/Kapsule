import { Box } from "@chakra-ui/react";

import Posts from "../components/Posts";
import Upload from "../components/Upload";
import ProfileImage from "../components/ProfileImage";

import { useState } from "react";
import { useRetrieve } from "../hooks/useRetrieve";

const user = JSON.parse(localStorage.getItem("user"));

const Profile = () => {
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

  return (
    <Box textAlign="center" fontSize="2xl" p={5}>
      <ProfileImage />
      <Upload setUpdate={setUpdate} />
      <Posts retrieveState={retrieveState} />
    </Box>
  );
};

export default Profile;
