import { Paper, Typography, List, ListItem, ListItemAvatar, ListItemText, Box } from "@mui/material";

const OrdersHistory = ({ ordersData }:any) => {
    return (
        <Paper elevation={3} style={{ padding: 10, margin: "10px" }}>
            <Typography variant="h5" gutterBottom>
                All movies rented by the user!
            </Typography>
            <Box style={{ maxHeight: '350px', overflow: 'auto' }}>
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
                                sx={{ display: 'inline', marginLeft: 5 }}
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
