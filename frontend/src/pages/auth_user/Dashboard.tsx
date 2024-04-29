import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { Box, Paper, Grid, Typography, Button } from "@mui/material";
import Footer from "../../layout/Footer";
import AuthMainBar from "../../layout/AuthMainBar";
import axios from "axios";
import AddressForm from "../../components/AddressForm";

const  generateRandomString = (length:number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const Dashboard = () => {
    const redirect = useNavigate();
    const idUser = localStorage.getItem('idUser');

    //testowe dane
    const formData = {
        account_id: idUser,
        items: [
            {
                vhs_id: '9faf19a6-0577-11ef-bd4e-1002b54ccc69',
                due_date: format(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd HH:mm:ss'),
                status: 'rented'
            },
            {
                vhs_id: '9faf1827-0577-11ef-bd4e-1002b54ccc69',
                due_date: format(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd HH:mm:ss'),
                status: 'rented'
            }
        ]
    };

    const sendData = async () => {
        try {
            console.log(generateRandomString(24)); 
            const response = await axios.post('http://localhost:3001/orders', formData);
            console.log('Response:', response.data);
            alert('Zamówienie zostało pomyślnie wysłane!');
        } catch (error) {
            console.error('Error:', error);
            alert('Wystąpił błąd podczas wysyłania zamówienia!');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            redirect("/be-login");
        }
    }, [redirect]);

    return (
        <Box>
            <AuthMainBar />
            <AddressForm/>
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "80vh" }}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h5" gutterBottom> Wyslij zamowienie! </Typography>
                        <Button variant="contained" onClick={sendData}>Wyslij</Button>
                    </Paper>
                </Grid>
            </Grid>
            <Footer />
        </Box>
    );
};

export default Dashboard;
