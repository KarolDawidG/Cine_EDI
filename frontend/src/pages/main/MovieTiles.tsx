import Slider from "react-slick";
import { Box, Card, CardMedia } from '@mui/material';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { settings } from './utils/settingsCSS';
import { movies } from './utils/moviesData';
import { PrevArrow } from "./utils/PrevArrow";
import { NextArrow } from "./utils/NextArrow";

const customSettings = {
  ...settings,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />
};

interface MovieTilesProps {
  onMovieClick?: () => void;  
}

const MovieTiles = ({ onMovieClick }:MovieTilesProps)  => {
  return (
    <Box sx={{ flexGrow: 1, padding: 1 }}>
      <Slider {...customSettings}>
        {movies.map((movie) => (
          <Card key={movie.img_url} onClick={onMovieClick}>
            <CardMedia
              component="img"
              height="300"
              image={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.img_url}`}
            />
          </Card>
        ))}
      </Slider>
    </Box>
  );
};

export default MovieTiles;
