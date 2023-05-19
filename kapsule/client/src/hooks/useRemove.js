import { useState } from "react";

export const useRemove = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const remove = async (deleteInfo) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:4000/api/user/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deleteInfo),
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    setIsLoading(false);
  };

  return { remove, isLoading, error };
};
