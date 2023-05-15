import { useState, useEffect } from "react";

export const useRetrieveAll = (userId, refetch) => {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: "",
  });

  useEffect(() => {
    const retrieveAll = async () => {
      const response = await fetch("http://localhost:4000/api/user/allImages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userId }),
      }).catch((error) => {
        console.log(error);
      });
      if (response) {
        const json = await response.json();

        if (response.ok) {
          setState({ data: json, isLoading: false, error: "" });
        } else {
          setState({ data: null, isLoading: false, error: json.error });
        }
      }
    };

    retrieveAll();
  }, [userId, refetch]);

  return state;
};
