import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Container, Typography } from "@mui/material";
import Footer from "../../layout/Footer";
import AuthMainBar from "../../layout/AuthMainBar";
import MovieTiles from "../main/MovieTiles";
import logo from "../../../public/logo2.png";
import { RentalProcess } from "../main/RentalProcess";

const Dashboard = () => {
    const redirect = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            redirect("/be-login");
        }
    }, [redirect]);

    const handleMovieClick = () => {
        redirect('/vhs');
    };

    return (
        <Box display="flex" flexDirection="column" sx={{ bgcolor: "background.paper", color: '#f0f8ff', fontFamily: "'Press Start 2P', cursive", margin: 5 }}>
            <AuthMainBar />
            <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 8 }}>
                <Grid container spacing={3}>

                <Grid item xs={12} md={2}>
                    <Typography variant="h4" gutterBottom component="div">
                        <img src={logo} alt="Logo" style={{ width: 200, height: 200, filter: 'drop-shadow(2px 4px 6px black)' }} />
                    </Typography>
                </Grid>

                <Grid item xs={12} md={7}>
                    <MovieTiles onMovieClick={handleMovieClick} />
                </Grid>
                    
                <Grid item xs={12} md={3}>
                    <Typography variant="body1" sx={{ fontSize: '1.0rem', color: 'black' }}>
                        Browse and select old style 90's movies
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

export default Dashboard;
