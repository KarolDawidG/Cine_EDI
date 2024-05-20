import React from "react";
import { List, ListItem, ListItemText, Box, Typography } from "@mui/material";
import { GenreListProps } from "./interfaces/GenreInterfaces";

const GenreList: React.FC<GenreListProps> = ({ genres, selectedGenre, setSelectedGenre }) => {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Genres
      </Typography>
      <Box sx={{ overflowY: 'auto', maxHeight: '70vh', boxShadow: 3, p: 1, borderRadius: 2, bgcolor: 'background.paper' }}>
        <List component="nav">
          {genres.map((genre) => (
            <ListItem
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              sx={{
                bgcolor: selectedGenre === genre ? 'primary.main' : 'inherit',
                color: selectedGenre === genre ? 'common.white' : 'text.primary',
                '&:hover': {
                  bgcolor: 'primary.light',
                  color: 'common.white',
                  transition: 'background-color 0.3s ease'
                },
                mb: 0.5,
                borderRadius: 1
              }}
            >
              <ListItemText primary={genre} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default GenreList;
