import { useState } from "react";

export const useMutation = (url) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const fn = async (info) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`http://localhost:4000/api/user/${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(info),
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    setIsLoading(false);
  };

  return { fn, isLoading, error };
};
