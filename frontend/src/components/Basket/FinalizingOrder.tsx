import { format } from 'date-fns';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, Grid } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from 'react';
import { notify } from '../../notification/Notify';
import { BACKEND } from '../../utils/linkt';
import { useCartContext } from './context/CartContext';

interface VHS {
  id: string;
  title: string;
  description: string;
  img_url: string;
  genre: string;
  price_per_day: number;
  quantity_available: number;
  due_date?: string;
  account_id?: string | null;
  status?: string;
}

const FinalizingOrder = () => {
  const idUser = localStorage.getItem('idUser');
  const { cartItems, removeFromCart, clearCart } = useCartContext();
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (cartItems.length > 0) {
      const totalPrice = cartItems.reduce((acc, item) => acc + item.price_per_day, 0);
      setPrice(totalPrice);
    } else {
      setPrice(0);
    }
  }, [cartItems]);

  const sendData = async () => {
    const orderItems = cartItems.map(item => ({
      ...item,
      account_id: idUser,
      due_date: format(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd HH:mm:ss'),
      status: 'rented'
    }));

    try {
      const response = await axios.post(`${BACKEND}/orders`, { items: orderItems });
      clearCart();
      notify('The order has been successfully shipped!');
    } catch (error: any) {
      notify(error.response.data.message);
    }
  };

  return (
    <Box>
      {cartItems.length > 0 ? (
        <Paper elevation={3} sx={{ p: 2, width: '95%', height: '400px' }}>
          <Typography variant="h6" gutterBottom>Your order</Typography>
          <List
            sx={{
              height: '300px',
              maxWidth: '95%',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              maxHeight: 300,
              '& ul': { padding: 0 },
            }}
            subheader={<li />}
          >
            {cartItems.map((item: VHS, index: number) => (
              <ListItem key={index}>
                <ListItemText primary={`${item.title}`} secondary={`Return date: ${item.due_date}`} />
                <ListItemSecondaryAction>
                  <Button onClick={() => removeFromCart(index)}>Delete</Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Typography sx={{ textAlign: 'right' }}>
          The order value is: {price} $
          </Typography>
          <Button variant="contained" color="primary" onClick={sendData} fullWidth>Finalize your order</Button>
        </Paper>
      ) : (
        <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
            Your shopping cart is empty
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
            It looks like you haven't added any products to your cart yet.
            </Typography>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default FinalizingOrder;
