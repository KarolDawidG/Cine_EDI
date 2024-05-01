import { useEffect, useState } from "react";
import { Button, TextField, Box, Paper, Typography, Grid } from "@mui/material";
import axios from "axios";

const ShowAddress = () => {
    const [id, setId] = useState();
    const [address, setAddress] = useState<any>();

    const fetchData = async () => {
        if (id) {  // Upewnij się, że id istnieje przed wykonaniem żądania
            try {
                const response = await axios.get(`http://localhost:3001/address/${id}`);
                console.log(response.data.address[0]);
                setAddress(response.data.address[0]);
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        const idFromStorage:any = localStorage.getItem('idUser');  // Zapisz wartość pobraną z localStorage
        if (idFromStorage) {
            setId(idFromStorage);
        }
    }, []);

    useEffect(() => {
        fetchData();  // Wywołuj fetchData tylko, gdy id jest ustawione
    }, [id]);  // Dodaj id jako zależność do tego useEffect

    return (
        <Box>
            <Paper elevation={3} sx={{ p: 2, width: '95%', height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'left' }}>
                    Dane adresowe
                </Typography>
                <Typography sx={{ mb: 2, textAlign: 'left' }}>
                    Kraj: {address?.country}
                </Typography>
                <Typography sx={{ mb: 2, textAlign: 'left' }}>
                    Wojewodztwo: {address?.state}
                </Typography>
                <Typography sx={{ mb: 2, textAlign: 'left' }}>
                    Miasto: {address?.city}
                </Typography>
                <Typography sx={{ mb: 2, textAlign: 'left' }}>
                    Kod pocztowy: {address?.postal_code}
                </Typography>
                <Typography sx={{ mb: 2, textAlign: 'left' }}>
                    Ulica: {address?.street} {address?.house_number} 
                </Typography>
            </Paper>
        </Box>
    );
};

export default ShowAddress;
