import { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Card, CardMedia, CardContent, Typography, CircularProgress, Box, Container, List, ListItem, ListItemText} from "@mui/material";
import AuthMainBar from "../../layout/AuthMainBar";
import Footer from "../../layout/Footer";

interface VHS {
  id: string;
  title: string;
  description: string;
  img_url: string;
  genre: string;
  price_per_day: number;
  quantity_available: number;
}

const VHSCatalog = () => {
  const [vhsList, setVhsList] = useState<VHS[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [genres, setGenres] = useState<string[]>(["All"]);

  useEffect(() => {
    const fetchVHSData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/vhs");
        setVhsList(response.data.vhsData);
        const uniqueGenres: string[] = Array.from(
          new Set(response.data.vhsData.map((vhs: VHS) => vhs.genre))
        );
        setGenres(["All", ...uniqueGenres]);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      }
      setIsLoading(false);
    };

    fetchVHSData();
  }, []);

  const filteredVhsList =
    selectedGenre === "All"
      ? vhsList
      : vhsList.filter((vhs) => vhs.genre === selectedGenre);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <AuthMainBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2}>
            <Box sx={{ width: 240, flexShrink: 0 }}>
              <List>
                {genres.map((genre) => (
                  <ListItem key={genre} onClick={() => setSelectedGenre(genre)}>
                    <ListItemText primary={genre} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>

          <Grid item xs={12} md={10}>
            <Grid container spacing={2}>
              {filteredVhsList.map((vhs) => (
                <Grid item xs={12} sm={6} md={4} key={vhs.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image="/vhs.webp"
                      alt={vhs.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {vhs.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vhs.description}
                      </Typography>
                      <Typography variant="body1">
                        Cena za dobę: ${vhs.price_per_day}
                      </Typography>
                      <Typography variant="body1">
                        Dostępne ilości: {vhs.quantity_available}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default VHSCatalog;
