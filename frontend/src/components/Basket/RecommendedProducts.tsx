import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, CardMedia, Button } from "@mui/material";
import { useFavorites } from "../Vhs/hooks/useFavorites";
import { useMovies } from "../Vhs/hooks/context/MoviesContext";
import { VHS } from "../Vhs/interfaces/VhsInterface";
import VHSModal from "../Vhs/VHSModal";
import { useCartContext } from "./context/CartContext";

const RecommendedProducts: React.FC = () => {
  const { movies } = useMovies();
  const { favorites } = useFavorites();
  const { addToCart } = useCartContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recommendations, setRecommendations] = useState<VHS[]>([]);
  const [selectedVhs, setSelectedVhs] = useState<VHS | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getMostFrequentGenre = () => {
      if (favorites.length === 0) return null;

      const genreCount: { [key: string]: number } = favorites.reduce((acc, movie) => {
        acc[movie.genre] = (acc[movie.genre] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      return Object.keys(genreCount).reduce((a, b) => (genreCount[a] > genreCount[b] ? a : b));
    };

    const mostFrequentGenre = getMostFrequentGenre();

    if (mostFrequentGenre) {
      const filteredMovies = movies.filter(movie => movie.genre === mostFrequentGenre);
      const randomMovies = filteredMovies.sort(() => 0.5 - Math.random()).slice(0, 5);
      setRecommendations(randomMovies);
    }

    setIsLoading(false);
  }, [movies, favorites]);

  const handleOpen = (vhs: VHS) => {
    setSelectedVhs(vhs);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVhs(null);
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
      Recommendations for you
      </Typography>

      <Box sx={{ display: 'flex', overflowX: 'scroll', gap: 2 }}>
        {recommendations.length > 0 ? (
          recommendations.map((recommended) => (
            <Card key={recommended.id} sx={{ minWidth: 200 }}>
              <CardMedia
                component="img"
                sx={{ height: 300, objectFit: 'cover' }}
                image={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${recommended.img_url}`}
                alt={recommended.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {recommended.title}
                </Typography>
                <Button 
                  size="small" 
                  color="primary" 
                  onClick={() => handleOpen(recommended)}
                >
                  Details
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1">
            No recommendations. Add videos to favorites.
          </Typography>
        )}
      </Box>

      <VHSModal open={open} handleClose={handleClose} vhs={selectedVhs} addToCart={addToCart} />
    </Box>
  );
};

export default RecommendedProducts;
