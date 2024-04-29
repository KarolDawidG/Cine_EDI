import { format } from 'date-fns';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction } from "@mui/material";
import axios from "axios";

const FinalizingOrder = () => {
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
            },
            {
                vhs_id: '9faf18ef-0577-11ef-bd4e-1002b54ccc69',
                due_date: format(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd HH:mm:ss'),
                status: 'rented'
            }
        ]
    };

    const sendData = async () => {
        try {
            const response = await axios.post('http://localhost:3001/orders', formData);
            console.log('Response:', response.data);
            alert('Zamówienie zostało pomyślnie wysłane!');
        } catch (error) {
            console.error('Error:', error);
            alert('Wystąpił błąd podczas wysyłania zamówienia!');
        }
    };


return (
    <Box>
        <Paper elevation={3} sx={{ p: 2, width: '95%', height: '400px' }}>
            <Typography variant="h6" gutterBottom>Twoje zamówienia</Typography>
                <List>
                    {formData.items.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={`Kaseta ${index + 1}: ${item.vhs_id}`} secondary={`Termin zwrotu: ${item.due_date}`} />
                                <ListItemSecondaryAction>
                                    <Button>Del</Button>
                                </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            <Button variant="contained" color="primary" onClick={sendData} fullWidth>Finalizuj zamówienie</Button>
        </Paper>
    </Box>

    );
};

export default FinalizingOrder;
