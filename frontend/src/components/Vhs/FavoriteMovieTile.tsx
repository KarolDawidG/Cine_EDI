import { useState } from "react";
import { Card, CardMedia, CardContent, Typography, Box, Button } from "@mui/material";
import VHSModal from "./VHSModal";
import { VHS } from "./interfaces/VhsInterface";

const FavoriteMovieTile = ({ vhs, handleRemoveFavorite, addToCart }: { vhs: VHS, handleRemoveFavorite: (id: string) => void, addToCart: (vhs: VHS, callback: () => void) => void }) => {
  const [open, setOpen] = useState(false);
  const [selectedVhs, setSelectedVhs] = useState<VHS | null>(null);

  const handleOpenModal = () => {
    setSelectedVhs(vhs);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedVhs(null);
  };

  return (
    <>
      <Card sx={{ width: 300, display: 'flex', flexDirection: 'column', height: 550 }}>
        <CardMedia
          component="img"
          sx={{ height: 225, width: '100%' }}
          image={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${vhs.img_url}`}
          alt={vhs.title}
          loading="lazy"
        />
        <CardContent sx={{ flexDirection: 'column', justifyContent: 'space-between' }} onClick={handleOpenModal}>
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
            <Button variant="contained" sx={{ mt: 1, width: '100%' }} onClick={(e) => { e.stopPropagation(); handleRemoveFavorite(vhs.id); }}>
              Usuń z ulubionych
            </Button>
          </Box>
        </CardContent>
      </Card>

      {selectedVhs && (
        <VHSModal open={open} handleClose={handleCloseModal} vhs={selectedVhs} addToCart={addToCart} />
      )}
    </>
  );
};

export default FavoriteMovieTile;
