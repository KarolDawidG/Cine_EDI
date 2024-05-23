import React from "react";
import { Card, CardMedia, CardContent, Typography, Box, Button } from "@mui/material";
import { VHSCardProps } from "./interfaces/CardInterfaces";

const VHSCard: React.FC<VHSCardProps> = ({ vhs, addToCart, handleOpen, handleAddFavorite }) => {
  return (
    <Card sx={{ width: 300, height: 700, display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="400"
        image={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${vhs.img_url}`}
        alt={vhs.title}
        loading="lazy"
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
        <Box>
          <Typography gutterBottom variant="h6" component="div">
            {vhs.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxHeight: '4.5em',
            }}
          >
            {vhs.description}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1">
            Cena za dobę: ${vhs.price_per_day}
          </Typography>
          <Typography variant="body1">
            Dostępne ilości: {vhs.quantity_available}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {addToCart && (
              <Button variant="contained" color="primary" sx={{ mt: 1, width: '100px' }} onClick={(e) => { e.stopPropagation(); addToCart(vhs); }}>
                Wypożycz
              </Button>
            )}
            {handleOpen && (
              <Button variant="contained" color="secondary" sx={{ mt: 1, width: '100px' }} onClick={(e) => { e.stopPropagation(); handleOpen(vhs); }}>
                Info
              </Button>
            )}
            {handleAddFavorite && (
              <Button variant="contained" color="success" sx={{ mt: 1, width: '100px' }} onClick={(e) => { e.stopPropagation(); handleAddFavorite(vhs); }}>
                Ulubione
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VHSCard;
