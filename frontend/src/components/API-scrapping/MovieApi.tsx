import axios from "axios";
import { Grid, Typography, Box, Container, Button, TextField } from "@mui/material";
import AuthMainBar from "../../layout/AuthMainBar";
import Footer from "../../layout/Footer";
import { saveAs } from 'file-saver';
import { useState } from "react";

const MovieApi = () => {
  const [page, setPage] = useState(1);

  const fetchMovies = async () => {
    
    const options = {
      method: 'GET',
      //url: `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&page=${page}&sort_by=popularity.desc`,
      url: 'https://api.themoviedb.org/3/genre/movie/list?language=en',
      headers: {
        accept: 'applicati  on/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMzNkNGQzNjQxMzNmNzYzZWVmMjk3NWMwYTcxOThkOSIsInN1YiI6IjY2MzFmMGVkODEzY2I2MDEyNDg2NGRmMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6dA05xEzx_w3yJFhWxDEBHHmV8Srk-ALZ4ihU1kXUxI'
      }
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      saveAs(blob, `movies-data-${page}.json`); 
      
    } catch (error) {
      console.log(error)
    }
  };

  const handlePageChange = (event:any) => {
    setPage(event.target.value);
  };

  return (
    <Box>
      <AuthMainBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Pobiez plik JSON z danymi filmow.</Typography>
        <Grid container spacing={3}>

          <Grid item xs={12} md={2}>
            <TextField
              label="Page Number"
              type="number"
              variant="outlined"
              value={page}
              onChange={handlePageChange}
              sx={{ mr: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={10}>
            <Button onClick={fetchMovies}>Get API</Button>
          </Grid>

        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default MovieApi;
