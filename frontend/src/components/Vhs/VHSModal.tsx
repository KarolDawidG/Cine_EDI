import { Box, Typography, Button, Modal, Grid, CardMedia, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { VHSModalProps } from "./interfaces/ModalInterfaces";
import { addFavorite } from "./utils/favorites";
import { getYear, parseISO } from 'date-fns';
import { notify } from "../../notification/Notify";

const VHSModal = ({ open, handleClose, vhs, addToCart }: VHSModalProps) => {
  if (!vhs) return null;

  const handleRent = () => {
    if (vhs.quantity_available === 0) {
      notify('The video is temporarily unavailable.');
      return null;
    } else {
      addToCart(vhs, () => {
        setTimeout(() => {
          handleClose();
        }, 500);
      });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box 
        sx={{ 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: { xs: '90%', md: '800px' }, 
          maxHeight: '90vh', 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4, 
          borderRadius: 2, 
          overflowY: 'auto', 
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              loading="lazy"
              image={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${vhs.img_url}`}
              alt={vhs.title}
              sx={{ width: '100%', height: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" component="h2">
              {vhs.title}
            </Typography>
            <Typography variant="body1">
              Release: {getYear(parseISO(vhs.release_date))}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              {vhs.description}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Price per rental: {vhs.price_per_day}$
            </Typography>
            <Typography variant="body1">
              Available quantities: {vhs.quantity_available}
            </Typography>
            <Typography variant="body1">
              Vote Average: {vhs.vote_average}
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2, width: '100%' }} onClick={handleRent}>
              Rent
            </Button>
            <Button variant="contained" color="success" sx={{ mt: 2, width: '100%' }} onClick={(e) => { e.stopPropagation(); addFavorite(vhs); }}>
              Favorite
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default VHSModal;
