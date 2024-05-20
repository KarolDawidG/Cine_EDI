import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Box, Paper, Grid, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import MainBar from "../layout/MainBar";
import Footer from "../layout/Footer";
import { BACKEND } from "../utils/linkt";

const Register = () => {
    const redirect = useNavigate();
    const [userData, setUserData] = useState({
        first_name: "",
        second_name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event:any) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${BACKEND}/register`, userData);
            if (response.status === 200) {
                setTimeout(() => redirect(`/click-link`), 500);
            }
        } catch (error) {
            setError("Error during registration");
        }
        setLoading(false);
    };

    return (
        <Box>
            <MainBar/>
                <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={3} sx={{ padding: 2 }}>
                            <Typography variant="h5" gutterBottom>
                                Sign up!
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="first_name"
                                    label="First name"
                                    name="first_name"
                                    autoComplete="first_name"
                                    autoFocus
                                    value={userData.first_name}
                                    onChange={handleChange}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="second_name"
                                    label="Second name"
                                    name="second_name"
                                    autoComplete="first_name"
                                    autoFocus
                                    value={userData.second_name}
                                    onChange={handleChange}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="E-mail"
                                    name="email"
                                    autoComplete="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={userData.password}
                                    onChange={handleChange}
                                    sx={{ marginBottom: 2 }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={{ marginBottom: 2 }}
                                >
                                    {loading ? <CircularProgress size={24} /> : "Sign up!"}
                                </Button>
                                {error && <Typography variant="body2" color="error">{error}</Typography>}
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            <Footer/>
        </Box>
    );
};

export default Register;
