import {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Grid, Typography } from "@mui/material";
import Footer from "../../layout/Footer";
import AuthMainBar from "../../layout/AuthMainBar";

const AdminDashboard = () => {
    const redirect = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token ) {
            redirect("/be-login");
        }
    }, []);

    return (
        <Box>
            <AuthMainBar/>
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "80vh" }}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            AdminDashboard
                        </Typography>

                    </Paper>
                </Grid>
            </Grid>
            <Footer/>
        </Box>
    );
};

export default AdminDashboard;
