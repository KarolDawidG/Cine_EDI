import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Container } from "@mui/material";
import axios from "axios";
import Footer from "../../layout/Footer";
import AuthMainBar from "../../layout/AuthMainBar";
import OrdersHistory from "./OrdersHistory";
import OrdersProfile from "./OrdersProfile";

const Account = () => {
    const redirect = useNavigate();
    const [ordersData, setOrdersData] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchOrders = async () => {
            try {
                const id = localStorage.getItem("idUser");
                const response = await axios.get(`http://localhost:3001/orders/${id}`);
                setOrdersData(response.data.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        if (!token) {
            redirect("/be-login");
        } else {
            fetchOrders();
        }
    }, [redirect]);

    return (
        <Box>
            <AuthMainBar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <OrdersHistory ordersData={ordersData}/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <OrdersProfile/>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </Box>
    );
};

export default Account;
