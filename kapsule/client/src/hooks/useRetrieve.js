import { useState, useEffect } from "react";

export const useRetrieve = (userId, refetch) => {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: "",
  });

  useEffect(() => {
    const retrieve = async () => {
      const response = await fetch("http://localhost:4000/api/user/retrieve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "username": userId }),
      });

      const json = await response.json();

      if (response.ok) {
        setState({ data: json, isLoading: false, error: "" });
      } else {
        setState({ data: null, isLoading: false, error: json.error });
      }
    };

    retrieve();
  }, [userId, refetch]);

  return state; 
};
