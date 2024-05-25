import { useEffect, useState } from "react";
import { Paper, Typography, List, ListItem, ListItemText, Box, Button } from "@mui/material";
import axios from 'axios';
import { notify } from "../../notification/Notify";
import { BACKEND } from "../../utils/linkt";

const OrdersProfile = () => {
    const [ordersData, setOrdersData] = useState<any>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const id = localStorage.getItem("idUser");
                const response = await axios.get(`${BACKEND}/orders/all/${id}`);
            
                setOrdersData(response.data.data);
            } catch (error:any) {
                console.error("Error fetching orders:", error);
                notify("Failed to fetch orders"); 
            }
        };
        fetchOrders();
    }, []);

    const handleDeleteOrders = async (id:string) => {
        try {          

            const response = await axios.delete(`${BACKEND}/orders/all/${id}`);

            notify(response.data.message);
        } catch (error:any) {
            console.error("Error deleting orders:", error);
            notify(error.response.data.message);
        }
    };

    return (
        <Paper elevation={3} style={{ padding: 10, margin: "10px" }}>
            <Typography variant="h5" gutterBottom>
                User-generated history of all orders:
            </Typography>
            <Box style={{ maxHeight: '350px', overflow: 'auto' }}>
                <List>
                    {ordersData.map((order:any, index:number) => (
                        <ListItem key={index} alignItems="flex-start" secondaryAction={
                            <Button aria-label="delete" onClick={() => handleDeleteOrders(order.orderId)}>
                                Delete order!
                            </Button>
                        }>
                        <ListItemText
                            primary={
                                <Typography component="span" variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                                Date: {order.orderDate}
                                {'\n'}
                                Status: {order.orderStatus}
                                </Typography>
                            }
                            secondary={
                                <>
                                {order.rentals.map((rental: any, idx: any) => (
                                    <Typography key={idx} component="span" variant="body2" display="block">
                                    * {rental.title}
                                    </Typography>
                                ))}
                                </>
                            }
                        />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Paper>
    );
};

export default OrdersProfile;