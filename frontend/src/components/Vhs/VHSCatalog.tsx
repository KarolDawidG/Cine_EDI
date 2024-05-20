import { useState } from "react";
import { Grid, Typography, CircularProgress, Box, Container } from "@mui/material";
import AuthMainBar from "../../layout/AuthMainBar";
import Footer from "../../layout/Footer";
import { useVHSData } from "./hooks/useVHSData";
import { useCart } from "./hooks/useCart";
import VHSModal from "./VHSModal";
import VHSCard from "./VHSCard";
import GenreList from "./GenreList";
import { VHS } from "./interfaces/VhsInterface";

const VHSCatalog = () => {
  const { vhsList, genres, selectedGenre, setSelectedGenre, isLoading, error } = useVHSData();
  const { addToCart } = useCart();
  const [selectedVhs, setSelectedVhs] = useState<VHS | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (vhs: VHS) => {
    setSelectedVhs(vhs);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVhs(null);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <AuthMainBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2}>
            <GenreList genres={genres} selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
          </Grid>

          <Grid item xs={12} md={10}>
            <Grid container spacing={3}>
              {vhsList.map((vhs) => (
                <Grid item xs={12} sm={6} md={4} key={vhs.id}>
                  <VHSCard vhs={vhs} addToCart={addToCart} handleOpen={handleOpen} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <VHSModal open={open} handleClose={handleClose} vhs={selectedVhs} addToCart={addToCart} />

      <Footer />
    </Box>
  );
};

export default VHSCatalog;
