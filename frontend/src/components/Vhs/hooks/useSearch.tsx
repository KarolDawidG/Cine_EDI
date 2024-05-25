import { useState } from "react";
import { VHS } from "../interfaces/VhsInterface";
import { SelectChangeEvent } from "@mui/material";

export const useSearch = (vhsList: VHS[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | number[]>([0, 10]);
  const [availability, setAvailability] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setSelectedYear(event.target.value);
  };

  const handleRatingChange = (event: Event, newValue: number | number[]) => {
    setSelectedRating(newValue as number | number[]);
  };

  const handleAvailabilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvailability(event.target.checked);
  };

  const filteredVhsList = vhsList.filter((vhs: VHS) => {
    const releaseYear = new Date(vhs.release_date).getFullYear().toString();
    return (
      vhs.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedGenre === "" || vhs.genre === selectedGenre) &&
      (selectedYear === "" || releaseYear === selectedYear) &&
      vhs.vote_average >= (selectedRating as [number, number])[0] &&
      vhs.vote_average <= (selectedRating as [number, number])[1] &&
      (!availability || vhs.quantity_available > 0)
    );
  });

  return {
    handleSearchChange,
    handleGenreChange,
    handleYearChange,
    handleRatingChange,
    handleAvailabilityChange,
    filteredVhsList,
    searchTerm,
    selectedGenre,
    selectedYear,
    selectedRating,
    availability,
    setSearchTerm,
    setSelectedGenre,
    setSelectedYear,
    setSelectedRating,
    setAvailability,
  };
};


// import { useState } from "react";
// import { VHS } from "../interfaces/VhsInterface";

// export const useSearch = (vhsList: VHS[]) => {
//     const [searchTerm, setSearchTerm] = useState("");

//     const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//       setSearchTerm(event.target.value);
//     };
  
//     const filteredVhsList = vhsList.filter((vhs:VHS) => 
//       vhs.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
    

//   return {
//     handleSearchChange,
//     filteredVhsList,
//     searchTerm,
//     setSearchTerm,
//   };
// };
