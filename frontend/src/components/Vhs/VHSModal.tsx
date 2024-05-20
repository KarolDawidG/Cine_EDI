import { Box, Typography, Button, Modal, Grid, CardMedia, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { VHSModalProps } from "./interfaces/ModalInterfaces";

const VHSModal = ({ open, handleClose, vhs, addToCart }: VHSModalProps) => {
  if (!vhs) return null;

  const handleRent = () => {
    addToCart(vhs, () => {
      setTimeout(() => {
        handleClose();
      }, 500);
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, maxHeight: '90vh', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, overflowY: 'auto', position: 'relative' }}>
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
            <Typography sx={{ mt: 2 }}>
              {vhs.description}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Cena za dobę: ${vhs.price_per_day}
            </Typography>
            <Typography variant="body1">
              Dostępne ilości: {vhs.quantity_available}
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleRent}>
              Wypożycz
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default VHSModal;
