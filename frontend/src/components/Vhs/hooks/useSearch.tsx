import { useState } from "react";
import { VHS } from "../interfaces/VhsInterface";

export const useSearch = (vhsList: VHS[]) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };
  
    const filteredVhsList = vhsList.filter((vhs:VHS) => 
      vhs.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    

  return {
    handleSearchChange,
    filteredVhsList,
    searchTerm,
    setSearchTerm,
  };
};
