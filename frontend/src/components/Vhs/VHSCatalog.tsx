import {  useState } from "react";
import { Grid, TextField, Typography, CircularProgress, Box, Container, FormControl, InputLabel, Select, MenuItem, Slider, FormControlLabel, Checkbox } from "@mui/material";
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
  const { 
    handleSearchChange,  
    handleYearChange, 
    handleRatingChange, 
    handleAvailabilityChange, 
    filteredVhsList, 
    searchTerm,  
    selectedYear, 
    selectedRating, 
    availability 
  } = useSearch(vhsList);
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
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField 
              label="Search by title" 
              variant="outlined"  
              value={searchTerm} 
              onChange={handleSearchChange} 
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select value={selectedYear} onChange={handleYearChange}>
                <MenuItem value=""><em>All</em></MenuItem>
                {Array.from(new Set(vhsList.map(vhs => new Date(vhs.release_date).getFullYear()))).sort((a, b) => b - a).map(year => (
                  <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography gutterBottom>Rating</Typography>
            <Slider
              value={selectedRating}
              onChange={handleRatingChange}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={availability}
                  onChange={handleAvailabilityChange}
                  name="availability"
                  color="primary"
                />
              }
              label="Only show available"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
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
