import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Typography } from "@mui/material";
import Footer from "../../../layout/Footer";
import AdminBar from "../../../layout/AdminBar";
import UsersTable from "./userTable";
import OrdersTable from "./orderTable";
import SalesChart from "../../../components/DataAnalizing/SalesChart";
import UserOrdersChart from "../../../components/DataAnalizing/UserOrdersChart";

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
            <Grid container spacing={2} sx={{ padding: 2 }}>
                <Grid item xs={12}>
                    <Typography variant="h5" sx={{ marginBottom: 2 }}>User table</Typography>
                    <UsersTable />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h5" sx={{ marginBottom: 2 }}>Orders table</Typography>
                    <OrdersTable />
                </Grid>

                <Grid item xs={12}>
                    <SalesChart />
                </Grid>

                <Grid item xs={12}>
                    <UserOrdersChart />
                </Grid>
            </Grid>
            <Footer />
        </Box>
    );
};

export default AdminDashboard;
