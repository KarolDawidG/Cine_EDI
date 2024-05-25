import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import { useFavorites } from "../../components/Vhs/hooks/useFavorites";
import FavoriteMovieTile from "../../components/Vhs/FavoriteMovieTile";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { NextArrow } from "../main/utils/NextArrow";
import { PrevArrow } from "../main/utils/PrevArrow";
import { useCartContext } from "../../components/Basket/context/CartContext"; // Użyj nowego kontekstu

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};

const FavoriteMoviesSlider = () => {
  const { favorites, handleRemoveFavorite } = useFavorites();
  const { addToCart } = useCartContext(); // Zamiast useCart
  
  return (
    <Box sx={{ flexGrow: 1, padding: 1 }}>
      <Typography variant="h4" gutterBottom>
        Favorite Movies
      </Typography>
      {favorites.length > 0 ? (
        <Slider {...settings}>
          {favorites.map((vhs) => (
            <Box key={vhs.id} sx={{ padding: 1 }}>
              <FavoriteMovieTile vhs={vhs} handleRemoveFavorite={handleRemoveFavorite} addToCart={addToCart} />
            </Box>
          ))}
        </Slider>
      ) : (
        <Typography variant="body1">No favorite movies</Typography>
      )}
    </Box>
  );
};

export default FavoriteMoviesSlider;
