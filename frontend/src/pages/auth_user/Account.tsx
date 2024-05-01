import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Container, Button, Typography } from "@mui/material";
import Footer from "../../layout/Footer";
import AuthMainBar from "../../layout/AuthMainBar";
import AddressForm from "../../components/AddressForm";
import ShowAddress from "../../components/ShowAddress";
import EditAddressForm from "../../components/EditAddressForm";

const Account = () => {
    const redirect = useNavigate();
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showEditAddressForm, setShowEditAddressForm] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            redirect("/be-login");
        }
    }, [redirect]);

    const handleToggleAddressForm = () => {
        setShowAddressForm(!showAddressForm);
    };

    const handleToggleEditAddressForm = () => {
        setShowEditAddressForm(!showEditAddressForm);
    };

    return (
        <Box>
            <AuthMainBar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography>Dane adresowe</Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                    <Button variant="contained" onClick={handleToggleAddressForm}>
                            {showAddressForm ? 'Zamknij' : 'Dodaj adres'}
                        </Button>
                        {showAddressForm && <AddressForm />}

                        <Button variant="contained" onClick={handleToggleEditAddressForm}>
                            {showEditAddressForm ? 'Zamknij' : 'Edytuj adres'}
                        </Button>
                        {showEditAddressForm && <EditAddressForm />}
                        <ShowAddress />
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </Box>
    );
};

export default Account;
