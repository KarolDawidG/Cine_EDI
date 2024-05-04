import { format } from 'date-fns';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, Grid, IconButton } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from 'react';
import { notify } from '../notification/Notify';

interface VHS {
    id: string;
    title: string;
    description: string;
    img_url: string;
    genre: string;
    price_per_day: number;
    quantity_available: number;
    due_date: string;
    account_id: string | null;
    status: string;
}

const FinalizingOrder = () => {
    const idUser = localStorage.getItem('idUser');
    const [price, setPrice] = useState<number>(0);
    const [cartItems, setCartItems] = useState<VHS[]>(() => {
        const initialBasket = JSON.parse(localStorage.getItem('cart') || '[]');
        
        return initialBasket.map((item: VHS) => ({
            ...item,
            account_id: idUser,
            due_date: format(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd HH:mm:ss'),
            status: 'rented'
        }));
        
    });

    const removeFromCart = (index: number) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1);
        setCartItems(updatedCartItems);
    };
    

    const sendData = async () => {
        try {
            const response = await axios.post('http://localhost:3001/orders', { items: cartItems });
            setCartItems([]);
            console.log(response.data);
            notify('Zamówienie zostało pomyślnie wysłane!');
        } catch (error:any) {
            console.log(error.response.data.message);
            notify(error.response.data.message);
        }
    };
    
    useEffect(() => {
        if (cartItems.length > 0) {
            const totalPrice = cartItems.reduce((acc, item) => acc + (item.price_per_day), 0);
            setPrice(totalPrice);
        } else {
            setPrice(0);
        }
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <Box>
          {cartItems.length > 0 ? (
            <Paper elevation={3} sx={{ p: 2, width: '95%', height: '400px' }}>
                <Typography variant="h6" gutterBottom>Twoje zamówienia</Typography>
                
                <List sx={{ height: '300px', maxWidth: '95%', bgcolor: 'background.paper', position: 'relative', overflow: 'auto', maxHeight: 300, '& ul': { padding: 0 },}} subheader={<li />} >
                    {cartItems.map((item: VHS, index: number) => (
                        <ListItem key={index}>
                            <ListItemText primary={`${item.title}`} secondary={`Termin zwrotu: ${item.due_date}`} />
                            <ListItemSecondaryAction>
                                <Button onClick={() => removeFromCart(index)}>Usuń</Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>

                <Typography sx={{ textAlign: 'right' }}>
                    Wartosc zamowienia to: {price} PLN
                </Typography>

                <Button variant="contained" color="primary" onClick={sendData} fullWidth>Finalizuj zamówienie</Button>
            </Paper>
          ) : (
            <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                <Grid item>
                    <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
                        Twój koszyk jest pusty
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1" sx={{ textAlign: 'center' }}>
                        Wygląda na to, że nie dodałeś jeszcze żadnego produktu do koszyka.
                    </Typography>
                </Grid>
            </Grid>
          )}
        </Box>
    );
};

export default FinalizingOrder;
