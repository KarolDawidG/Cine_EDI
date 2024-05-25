import { Box, Typography, Grid, Container } from "@mui/material";
import MainBar from "../../layout/MainBar";
import Footer from "../../layout/Footer";
import MovieTiles from "./MovieTiles";
import logo from "../../../public/logo2.png";
import { RentalProcess } from "./RentalProcess";

const MainPage = () => {
  return (
    <Box display="flex" flexDirection="column" sx={{ bgcolor: "background.paper", color: '#f0f8ff', fontFamily: "'Press Start 2P', cursive", margin: 5 }}>
      <MainBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>

          <Grid item xs={12} md={2}>
            <Typography variant="h4" gutterBottom component="div">
              <img src={logo} alt="Logo" style={{ width: 200, height: 200, filter: 'drop-shadow(2px 4px 6px black)' }} />
            </Typography>
          </Grid>

          <Grid item xs={12} md={7}>
            <MovieTiles />
          </Grid>
              
          <Grid item xs={12} md={3}>
            <Typography variant="body1" sx={{ fontSize: '1.0rem', color: 'black' }}>
              Rediscover the magic of cinema from the VHS era. From classics to rare gems to the latest hits!! Our catalog offers a unique film experience that will take you back in time.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <RentalProcess/>
          </Grid>

        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default MainPage;
