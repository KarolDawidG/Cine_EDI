import Footer from "../layout/Footer";
import MainBar from "../layout/MainBar";
import { Box, Paper, Grid, Typography } from "@mui/material";

export const LookEmail = () => {
  return (
    <Box>
      <MainBar/>
          <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "80vh" }}>
              <Grid item xs={12} sm={6}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                      <Typography variant="h5" gutterBottom>
                        An activation link has been sent to the provided email address!
                      </Typography>
                  </Paper>
              </Grid>
          </Grid>
      <Footer/>
    </Box>
  );
};
