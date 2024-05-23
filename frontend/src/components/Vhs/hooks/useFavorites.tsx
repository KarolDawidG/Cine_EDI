import { useState, useEffect } from "react";
import { getFavorites, addFavorite, removeFavorite } from "../utils/favorites";
import { VHS } from "../interfaces/VhsInterface";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<VHS[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleAddFavorite = (vhs: VHS) => {
    addFavorite(vhs);
    setFavorites(getFavorites());
  };

  const handleRemoveFavorite = (vhsId: string) => {
    removeFavorite(vhsId);
    setFavorites(getFavorites());
  };

  return {
    favorites,
    handleAddFavorite,
    handleRemoveFavorite,
  };
};
