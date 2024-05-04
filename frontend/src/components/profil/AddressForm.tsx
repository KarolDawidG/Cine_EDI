import { useState } from "react";
import { Button, TextField, Box, Paper, Typography, Grid } from "@mui/material";
import axios from "axios";
import { notify } from "../../notification/Notify";

type AddressData = {
    account_id: string | null;
    street: string;
    house_number: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    [key: string]: string | null;
};

const AddressForm = () => {
    const idUser = localStorage.getItem('idUser');
    const [orderId, setOrderId] = useState();
    const [addressData, setAddressData] = useState<AddressData>({
        account_id: idUser,
        street: "",
        house_number: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddressData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:3001/address`, addressData);
            setOrderId(response.data.orderId);
            localStorage.setItem('orderId', response.data.orderId);
        } catch (error:any) {
            if (axios.isAxiosError(error) && error.response) {
                notify(error.response.data.message);
            } else {
                console.error('Error:', error.message);
            }
        }
    };
    
    return (
        <Box>
            <Paper elevation={3} sx={{ p: 2, width: '95%', height: '400px' }}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                    Wprowadź swoje dane adresowe
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {['street', 'house_number', 'city', 'state', 'postal_code', 'country'].map((field) => (
                            <Grid item xs={12} sm={6} key={field}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name={field}
                                    label={field.replace(/_/g, ' ').charAt(0).toUpperCase() + field.slice(1)}
                                    type="text"
                                    id={field}
                                    value={addressData[field]}
                                    onChange={handleChange}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button type="submit" fullWidth variant="contained">
                                Wyślij
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default AddressForm;
