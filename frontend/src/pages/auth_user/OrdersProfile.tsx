import { useEffect, useState } from "react";
import { Paper, Typography, List, ListItem, ListItemText, Box } from "@mui/material";
import axios from "axios";
import { notify } from "../../notification/Notify";

const OrdersProfile = () => {
    const [groupedOrders, setGroupedOrders] = useState<Map<string, string[]>>(new Map());

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const id = localStorage.getItem("idUser");
                const response = await axios.get(`http://localhost:3001/orders/${id}`);
                const data = response.data.data;
                console.log(data);

                // Grupowanie zamówień według daty
                const ordersMap = new Map<string, string[]>();
                data.forEach((order: any) => {
                    const rentalDate = new Date(order.rentalDate).toDateString();
                    const existing = ordersMap.get(rentalDate) || [];
                    ordersMap.set(rentalDate, [...existing, order.title]);
                });

                setGroupedOrders(ordersMap);
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
                Historia wszystkich zamowien wygenerowana przez uzytkownika:
            </Typography>
            <Box style={{ maxHeight: '350px', height: '350px' , overflow: 'auto' }}>
                <List>
                    {[...groupedOrders].map(([date, titles], index) => (
                        <ListItem key={index} alignItems="flex-start">
                            <ListItemText
                                primary={date}
                                secondary={
                                    <>
                                        {titles.map((title, idx) => (
                                            <Typography key={idx} component="span" variant="body2" display="block">
                                                * {title}
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
