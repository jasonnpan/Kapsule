import { useState } from "react";

export const useLikes = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const likes = async (likesInfo) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:4000/api/user/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(likesInfo),
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    setIsLoading(false);
  };

  return { likes, isLoading, error };
};
