import { useState } from "react";

export const useUpload = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const upload = async (uploadInfo) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:4000/api/user/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uploadInfo),
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    setIsLoading(false);
  };

  return { upload, isLoading, error };
};
