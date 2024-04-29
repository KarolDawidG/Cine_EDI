import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Container } from "@mui/material";
import Footer from "../../layout/Footer";
import AuthMainBar from "../../layout/AuthMainBar";
import AddressForm from "../../components/AddressForm";
import FinalizingOrder from "./FinalizingOrder";

const Dashboard = () => {
    const redirect = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            redirect("/be-login");
        }
    }, [redirect]);

    return (
        <Box>
            <AuthMainBar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>

                    <Grid item xs={12} md={6}>
                        <AddressForm />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FinalizingOrder />
                    </Grid>
                    
                </Grid>
            </Container>
            <Footer />
        </Box>

    );
};

export default Dashboard;
