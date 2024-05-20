import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import Footer from "../../../layout/Footer";
import AdminBar from "../../../layout/AdminBar";
import UsersTable from "./userTable";
import OrdersTable from "./orderTable";

const AdminDashboard = () => {
    const redirect = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            redirect("/be-login");
        }
    }, [redirect]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AdminBar />
            <Grid item xs={12}>
                <Grid sx={{ marginBottom: 2, padding: 2, marginTop:2 }}>

                    <Grid sx={{ marginBottom: 2, marginTop:2 }}>
                        <Typography variant="h5">Tabela uzytkownikow</Typography>
                        <UsersTable/>
                    </Grid>

                    <Grid sx={{ marginBottom: 2, marginTop:2 }}>
                        <Typography variant="h5">Tabela zamowien</Typography>
                        <OrdersTable />
                    </Grid>

                    <Grid sx={{ marginBottom: 2, marginTop:2 }}>
                        Wykres sprzedazy
                    </Grid>

                    <Grid sx={{ marginBottom: 2, marginTop:2 }}>
                        Wykres sprzedazy poszczegolnych uzytkownikow 
                    </Grid>

                </Grid>
            </Grid>

            <Footer />
        </Box>
    );
};

export default AdminDashboard;
