import { useEffect, useState } from "react";
import { Paper, Typography, List, ListItem, ListItemText, Box, Button } from "@mui/material";
import axios from 'axios';
import { notify } from "../../notification/Notify";

const OrdersProfile = ({ ordersData }: any) => {
    const [groupedOrders, setGroupedOrders] = useState<Map<string, string[]>>(new Map());
    const [dateDel, setDateDel] = useState<any>();

    useEffect(() => {
        const ordersMap = new Map<string, string[]>();
        ordersData.forEach((order: any) => {
            const rentalDate = order.rentalDate;
            setDateDel(order.rentalDate);
            console.log(order.rentalDate);
            const existing = ordersMap.get(rentalDate) || [];
            ordersMap.set(rentalDate, [...existing, order.title]);
        });

        setGroupedOrders(ordersMap);
    }, [ordersData]);

    const handleDeleteOrders = async (date: string) => {
        try {
            const id = localStorage.getItem("idUser");
            
            console.log(date);
            await axios.delete(`http://localhost:3001/orders/${date}/${id}`);
    
            const newOrdersMap = new Map(groupedOrders);
            newOrdersMap.delete(date);
            setGroupedOrders(newOrdersMap);
            notify("Zamówienia usunięte.");
        } catch (error) {
            console.error("Error deleting orders:", error);
            notify("Nie udało się usunąć zamówień.");
        }
    };
    

    return (
        <Paper elevation={3} style={{ padding: 10, margin: "10px" }}>
            <Typography variant="h5" gutterBottom>
                Historia wszystkich zamówień wygenerowana przez użytkownika:
            </Typography>
            <Box style={{ maxHeight: '350px', overflow: 'auto' }}>
                <List>
                    {[...groupedOrders].map(([date, titles], index) => (
                        <ListItem key={index} alignItems="flex-start" secondaryAction={
                            <Button aria-label="delete" onClick={() => handleDeleteOrders(date)}>
                                Usun zamowienie!
                            </Button>
                        }>
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
