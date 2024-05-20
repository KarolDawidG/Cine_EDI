export interface GenreListProps {
    genres: string[];
    selectedGenre: string;
    setSelectedGenre: (genre: string) => void;
  }