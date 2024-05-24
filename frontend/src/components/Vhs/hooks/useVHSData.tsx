import { useState, useEffect } from "react";
import axios from "axios";
import { VHS } from "../interfaces/VhsInterface";
import { BACKEND } from "../../../utils/linkt";
import { useMovies } from "./context/MoviesContext";

export const useVHSData = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [genres, setGenres] = useState<string[]>(["All"]);

  const { movies, setMovies } = useMovies();

  useEffect(() => {
    const fetchVHSData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKEND}/vhs`);
        const fetchedVhsList = response.data.vhsData;
        setMovies(fetchedVhsList);
        const uniqueGenres: string[] = Array.from(
          new Set(fetchedVhsList.map((vhs: VHS) => vhs.genre))
        );
        setGenres(["All", ...uniqueGenres]);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      }
      setIsLoading(false);
    };

    if (movies.length === 0) {
      fetchVHSData();
    } else {
      const uniqueGenres: string[] = Array.from(
        new Set(movies.map((vhs: VHS) => vhs.genre))
      );
      setGenres(["All", ...uniqueGenres]);
    }
  }, [movies, setMovies]);

  const filteredVhsList =
    selectedGenre === "All"
      ? movies
      : movies.filter((vhs) => vhs.genre === selectedGenre);

  return {
    vhsList: filteredVhsList,
    genres,
    selectedGenre,
    setSelectedGenre,
    isLoading,
    error,
  };
};
