import React, { createContext, useContext, useState, ReactNode } from "react";

interface MoviesContextType {
  movies: any[];
  setMovies: React.Dispatch<React.SetStateAction<any[]>>;
}

const MoviesContext = createContext<MoviesContextType>({
  movies: [],
  setMovies: () => {}
});

export const MoviesProvider = ({ children }: { children: ReactNode }) => {
  const [movies, setMovies] = useState<any[]>([]);

  return (
    <MoviesContext.Provider value={{ movies, setMovies }}>
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => useContext(MoviesContext);
