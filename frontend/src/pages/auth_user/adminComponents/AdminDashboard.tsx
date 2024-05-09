import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Grid, Typography } from "@mui/material";
import Footer from "../../../layout/Footer";
import AdminBar from "../../../layout/AdminBar";
import CustomTable from "./userTable";

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
                        <CustomTable/>
                    </Grid>

                    <Grid sx={{ marginBottom: 2, marginTop:2 }}>
                        Second
                    </Grid>

                    <Grid sx={{ marginBottom: 2, marginTop:2 }}>
                        Third
                    </Grid>

                    <Grid sx={{ marginBottom: 2, marginTop:2 }}>
                        Fourth 
                    </Grid>

                </Grid>
            </Grid>

            <Footer />
        </Box>
    );
};

export default AdminDashboard;
