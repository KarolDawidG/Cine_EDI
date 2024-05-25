import React from "react";
import { Card, CardMedia, CardContent, Typography, Box, Button } from "@mui/material";
import { VHS } from "./interfaces/VhsInterface";
import { notify } from "../../notification/Notify";

interface FavoriteMovieTileProps {
  vhs: VHS;
  handleRemoveFavorite: (id: string) => void;
  addToCart: (vhs: VHS) => void;
}

const FavoriteMovieTile: React.FC<FavoriteMovieTileProps> = ({ vhs, handleRemoveFavorite, addToCart }) => {
  const handleAddToCart = (vhs: VHS) => {
    if (vhs.quantity_available > 0) {
      addToCart(vhs);
    } else {
      notify('The video is temporarily unavailable');
    }
  };

  return (
    <Card 
      sx={{ 
        width: '100%', 
        maxWidth: 300, 
        display: 'flex', 
        flexDirection: 'column', 
        height: 550, 
        margin: '0 auto' 
      }}
    >
      <CardMedia
        component="img"
        sx={{ height: 225, width: '100%', objectFit: 'cover' }}
        image={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${vhs.img_url}`}
        alt={vhs.title}
        loading="lazy"
      />
      <CardContent sx={{ flexDirection: 'column', justifyContent: 'space-between', flex: '1' }}>
        <Box>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '1rem' }}>
            {vhs.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: { xs: 'none', sm: '-webkit-box' },
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
            Remove from favorites
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 1, width: '100%' }} 
            onClick={() => handleAddToCart(vhs)}
            disabled={vhs.quantity_available === 0}
          >
            Rent
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FavoriteMovieTile;
