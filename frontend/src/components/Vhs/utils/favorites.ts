import { notify } from "../../../notification/Notify";

const FAVORITES_KEY = "favorites";

export const getFavorites = () => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

export const addFavorite = (vhs:any) => {
  const favorites = getFavorites();
  if (!favorites.find((fav:any) => fav.id === vhs.id)) {
    favorites.push(vhs);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    notify('Added to favorites!');
  } else (
    notify('The movie is already in my favorites!')
  )
};

export const removeFavorite = (vhsId:any) => {
  let favorites = getFavorites();
  favorites = favorites.filter((fav:any) => fav.id !== vhsId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};
