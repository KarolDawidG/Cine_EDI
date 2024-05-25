import { useEffect, useState } from "react";
import { Paper, Typography, Avatar, Button } from "@mui/material";
import axios from "axios";
import { notify } from "../../../notification/Notify";
import EditUserDialog from './EditUserDialog';
import { BACKEND } from "../../../utils/linkt";

const UserData = () => {
    const [userData, setUserData] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState<any>({});

    useEffect(() => {
        (async () => {
            try {
                const id = localStorage.getItem("idUser");
                const response = await axios.get(`${BACKEND}/user/${id}`);
                setUserData(response.data[0]);
                setEditData(response.data[0]);
            } catch (error:any) {
                if (error.response && error.response.data.message) {
                    notify(error.response.data.message);
                } else {
                    notify("An unknown error occurred");
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
            const response = await axios.put(`${BACKEND}/user/${id}`, editData);
            setUserData(editData);
            notify(response.data.message);
            setOpen(false);
        } catch (error:any) {
            if (error.response && error.response.data.message) {
                notify(error.response.data.message);
            } else {
                notify("Failed to update user data");
            }
        }
    };

    return (
        <>
            <Paper elevation={3} style={{ padding: 20 }}>
                <Typography variant="h5" gutterBottom component="div">
                    Profile Component
                </Typography>
                {userData ? (
                    <>
                        <Avatar src={userData.img_url} sx={{ width: 100, height: 100 }} alt={`${userData.first_name} ${userData.second_name}`} />
                        <Typography variant="h6">{userData.first_name} {userData.second_name}</Typography>
                        <Typography variant="subtitle1">{userData.email}</Typography>
                        <Typography variant="body2">User ID: {userData.id}</Typography>
                        <Typography variant="body2">Role: {userData.role}</Typography>
                        <Button onClick={() => setOpen(true)} color="primary">Edit Profile</Button>
                    </>
                ) : (
                    <Typography variant="body2">Loading user data...</Typography>
                )}
            </Paper>
            <EditUserDialog open={open} onClose={() => setOpen(false)} onSave={handleSave} editData={editData} handleChange={handleChange} />
        </>
    );
};

export default UserData;
