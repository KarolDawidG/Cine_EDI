import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Container } from "@mui/material";
import Footer from "../../layout/Footer";
import AuthMainBar from "../../layout/AuthMainBar";
import { notify } from "../../notification/Notify";
import UserData from "./userData/UserData";
import AddressProfile from "./userAdress/AddressProfile";

const Profile = () => {
    const redirect = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    redirect("/be-login");
                    return;
                }
            } catch (error) {
                    console.error(error);
                    notify("An unknown error occurred");
            }
        })();
    }, [redirect]);

return (
<Box display="flex" flexDirection="column" sx={{ bgcolor: "background.paper", color: '#f0f8ff', fontFamily: "'Press Start 2P', cursive", margin: 5 }}>
    <AuthMainBar />
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <UserData/>
            </Grid>

            <Grid item xs={12} md={6}>
                <AddressProfile/>
            </Grid>
        </Grid>
    </Container>
    <Footer />
</Box>
    );
};

export default Profile;
