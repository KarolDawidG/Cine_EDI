import { Box, Typography, Grid, Container } from "@mui/material";
import MainBar from "../../layout/MainBar";
import Footer from "../../layout/Footer";
import MovieTiles from "./MovieTiles";
import logo from "../../../public/logo2.png";

const MainPage = () => {
  return (
    <Box display="flex" flexDirection="column" sx={{ bgcolor: "background.paper", color: '#f0f8ff', fontFamily: "'Press Start 2P', cursive", margin: 5 }}>
      <MainBar />

      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 8 }}>
        <Grid container spacing={3}>

          <Grid item xs={12} md={2}>
            <Typography variant="h4" gutterBottom component="div">
              <img src={logo} alt="Logo" style={{ width: 200, height: 200, filter: 'drop-shadow(2px 4px 6px black)' }} />
            </Typography>
          </Grid>

          <Grid item xs={12} md={7}>
            <MovieTiles/>
          </Grid>
              
          <Grid item xs={12} md={3}>
            <Typography variant="body1" sx={{ fontSize: '1.0rem', color: 'black' }}>
              Odkryj na nowo magię kina z epoki VHS. Od klasyków po rzadko spotykane perełki, po najnowsze hity!! Nasz katalog oferuje unikalne doświadczenie filmowe, które przeniesie Cię w czasie.
            </Typography>
          </Grid>

        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default MainPage;
