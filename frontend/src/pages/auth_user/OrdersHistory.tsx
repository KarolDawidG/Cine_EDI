import { useEffect, useState } from "react";
import { Paper, Typography, List, ListItem, ListItemAvatar, ListItemText, Box } from "@mui/material";
import axios from "axios";
import { notify } from "../../notification/Notify";

const OrdersHistory = () => {
    const [ordersData, setOrdersData] = useState<any>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const id = localStorage.getItem("idUser");
                const response = await axios.get(`http://localhost:3001/orders/${id}`);
                setOrdersData(response.data.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                notify("Failed to load orders.");
            }
        };

        fetchOrders();
    }, []);

    return (
        <Paper elevation={3} style={{ padding: 10, margin: "10px" }}>
            <Typography variant="h5" gutterBottom>
                Wszystkie filmy wypozyczone przez uzytkownika!
            </Typography>
            <Box style={{ maxHeight: '350px', height: '350px', overflow: 'auto' }}>
                <List>
                    {ordersData.map((order: any) => (
                        <ListItem key={order.rentalId} alignItems="flex-start">
                            <ListItemAvatar>
                                <img
                                    src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${order.imageUrl}`}
                                    alt={order.title}
                                    style={{ width: 'auto', height: 120, borderRadius: 1 }}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                sx={{ display: 'inline' , marginLeft: 5}}
                                primary={order.title}
                                secondary={
                                    <>
                                        <Typography
                                            sx={{ display: 'inline'}}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Due: {new Date(order.dueDate).toLocaleDateString()}
                                        </Typography>
                                        — {order.description}
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

export default OrdersHistory;
