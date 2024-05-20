import { useState } from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Box, Paper, Grid, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import MainBar from "../layout/MainBar";
import Footer from "../layout/Footer";
import { BACKEND } from "../utils/linkt";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const redirect = useNavigate();

    const handleSubmit = async (event:any) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${BACKEND}/auth`, {
                username,
                password,
            });
        
            if (response && response.status === 200){

                const token = response.data.token;
                localStorage.setItem("token", token);
                
                const idUser = response.data.idUser;
                localStorage.setItem("idUser", idUser);

                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
                const decodedToken: any = jwtDecode(token);
                const userRole = decodedToken.role;
                if (userRole === 'admin') {
                  redirect("/admin-dashboard");
                } else {
                  redirect("/dashboard");
                }
            
            }

        } catch (error) {
            setError("Invalid username or password");
        }
        setLoading(false);
    };    

    return (
        <Box>
            <MainBar />
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "80vh" }}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Log in
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                id="login"
                                label="Login"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                variant="outlined"
                                fullWidth
                                required
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                variant="outlined"
                                fullWidth
                                required
                                sx={{ marginBottom: 2 }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                                sx={{ marginBottom: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : "Log in"}
                            </Button>
                            {error && <Typography variant="body2" color="error">{error}</Typography>}
                        </form>
                        <Link to="/reset-password" className="btn btn-link">
                            <Button>
                                Forgot password
                            </Button>                            
                        </Link>
                    </Paper>
                </Grid>
            </Grid>
            <Footer/>
        </Box>
    );
};

export default Login;
