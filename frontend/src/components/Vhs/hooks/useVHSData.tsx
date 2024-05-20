import { useState, useEffect } from "react";
import axios from "axios";
import { VHS } from "../interfaces/VhsInterface";
import { BACKEND } from "../../../utils/linkt";

export const useVHSData = () => {
  const [vhsList, setVhsList] = useState<VHS[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [genres, setGenres] = useState<string[]>(["All"]);

  useEffect(() => {
    const fetchVHSData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKEND}/vhs`);
        setVhsList(response.data.vhsData);
        const uniqueGenres: string[] = Array.from(
          new Set(response.data.vhsData.map((vhs: VHS) => vhs.genre))
        );
        setGenres(["All", ...uniqueGenres]);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      }
      setIsLoading(false);
    };

    fetchVHSData();
  }, []);

  const filteredVhsList =
    selectedGenre === "All"
      ? vhsList
      : vhsList.filter((vhs) => vhs.genre === selectedGenre);

  return {
    vhsList: filteredVhsList,
    genres,
    selectedGenre,
    setSelectedGenre,
    isLoading,
    error,
  };
};
