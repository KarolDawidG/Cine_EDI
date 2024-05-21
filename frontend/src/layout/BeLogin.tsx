import { Box, Paper, Grid, Typography } from "@mui/material";
import Footer from "./Footer";
import MainBar from "./MainBar";

const BeLogin = () => {

    return (
        <Box>
            <MainBar/>
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "80vh" }}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            You should be logged in!
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
            <Footer/>
        </Box>
    );
};

export default BeLogin;
