import { useState } from "react";
import { Grid, TextField, Typography, CircularProgress, Box, Container } from "@mui/material";
import AuthMainBar from "../../layout/AuthMainBar";
import Footer from "../../layout/Footer";
import { useVHSData } from "./hooks/useVHSData";
import { useCartContext } from "../Basket/context/CartContext";
import VHSModal from "./VHSModal";
import VHSCard from "./VHSCard";
import GenreList from "./GenreList";
import { useSearch } from "./hooks/useSearch";
import { useFavorites } from "./hooks/useFavorites";
import { VHS } from "./interfaces/VhsInterface";

const VHSCatalog = () => {
  const { vhsList, genres, selectedGenre, setSelectedGenre, isLoading, error } = useVHSData();
  const { addToCart } = useCartContext();
  const { handleSearchChange, filteredVhsList, searchTerm } = useSearch(vhsList);
  const { handleAddFavorite } = useFavorites(); 
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
        <TextField 
          label="Search by title" 
          variant="outlined"  
          margin="normal" 
          value={searchTerm} 
          onChange={handleSearchChange} 
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={2}>
            <GenreList genres={genres} selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
          </Grid>
          <Grid item xs={12} md={10}>
            <Grid container spacing={3}>
              {filteredVhsList.map((vhs: VHS) => (
                <Grid item xs={12} sm={6} md={4} key={vhs.id}>
                  <VHSCard vhs={vhs} addToCart={addToCart} handleOpen={handleOpen} handleAddFavorite={handleAddFavorite} />
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
