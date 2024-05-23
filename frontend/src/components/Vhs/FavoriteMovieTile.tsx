import React from "react";
import { Card, CardMedia, CardContent, Typography, Box, Button } from "@mui/material";
import { VHS } from "./interfaces/VhsInterface";

interface FavoriteMovieTileProps {
  vhs: VHS;
  handleRemoveFavorite: (id: string) => void;
  addToCart: (vhs: VHS) => void;
}

const FavoriteMovieTile: React.FC<FavoriteMovieTileProps> = ({ vhs, handleRemoveFavorite, addToCart }) => {
  return (
    <Card sx={{ width: 300, display: 'flex', flexDirection: 'column', height: 550 }}>
      <CardMedia
        component="img"
        sx={{ height: 225, width: 150 }}
        image={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${vhs.img_url}`}
        alt={vhs.title}
        loading="lazy"
      />
      <CardContent sx={{ flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '1rem' }}>
            {vhs.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxHeight: '8.5em',
            }}
          >
            {vhs.description}
          </Typography>
        </Box>
        <Box>
          <Button variant="contained" sx={{ mt: 1, width: '100%' }} onClick={() => handleRemoveFavorite(vhs.id)}>
            Usuń z ulubionych
          </Button>
          <Button variant="contained" color="primary" sx={{ mt: 1, width: '100%' }} onClick={() => addToCart(vhs)}>
            Wypożycz
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FavoriteMovieTile;
