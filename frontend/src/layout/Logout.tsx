import {useEffect} from "react";
import { Box, Paper, Grid, Typography } from "@mui/material";
import Footer from "./Footer";
import MainBar from "./MainBar";

const Logout = () => {
    useEffect(() => {
        localStorage.removeItem("token")

    }, []);

    return (
        <Box>
            <MainBar/>
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "80vh" }}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Logout?
                            Nooooo...
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
            <Footer/>
        </Box>
    );
};

export default Logout;
