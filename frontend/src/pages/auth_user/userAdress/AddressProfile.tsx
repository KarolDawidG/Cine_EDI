import { useEffect, useState } from "react";
import { Paper, Typography, Button } from "@mui/material";
import axios from "axios";
import { notify } from "../../../notification/Notify";
import EditAddressDialog from "./EditAddressDialog";

const AddressProfile = () => {
    const [addressData, setAddressData] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState<any>({});

    useEffect(() => {
        (async () => {
            try {
                const id = localStorage.getItem("idUser");
                const response = await axios.get(`http://localhost:3001/address/${id}`);
                setAddressData(response.data.address[0]);
                setEditData(response.data.address[0]);
            } catch (error:any) {
                if (error.response && error.response.data.message) {
                    console.log(error.response.data.message);
                    notify(error.response.data.message);
                } else {
                    console.log("An unknown error occurred");
                }
            }
        })();
    }, []);

    const handleChange = (prop: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditData({ ...editData, [prop]: event.target.value });
    };

    const handleSave = async () => {
        try {
            const id = localStorage.getItem("idUser");
            const response = await axios.put(`http://localhost:3001/address/${id}`, editData);
            setAddressData(editData);
            notify(response.data.message);
            setOpen(false);
        } catch (error:any) {
            if (error.response && error.response.data.message) {
                notify(error.response.data.message);
            } else {
                notify("Failed to update address");
            }
        }
    };

    return (
        <>
            <Paper elevation={3} style={{ padding: 10, height:'300px' }}>
                <Typography variant="h5" gutterBottom component="div">
                    Address Profile
                </Typography>
                {addressData ? (
                    <>
                        <Typography variant="h6">{addressData.street}, {addressData.house_number}</Typography>
                        <Typography variant="subtitle1">{addressData.city}, {addressData.state}</Typography>
                        <Typography variant="body2">Postal Code: {addressData.postal_code}</Typography>
                        <Typography variant="body2">Country: {addressData.country}</Typography>
                        <Button onClick={() => setOpen(true)} color="primary">Edit Address</Button>
                    </>
                ) : (
                    <Typography variant="body2">Loading address data...</Typography>
                )}
            </Paper>
            <EditAddressDialog open={open} onClose={() => setOpen(false)} onSave={handleSave} editData={editData} handleChange={handleChange} />
        </>
    );
};

export default AddressProfile;
