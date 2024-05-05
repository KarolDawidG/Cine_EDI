import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import {
    Box,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import { useNavigate  } from "react-router-dom";

const MainBar = () => {
    const redirect = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const redirectToLogin = () => {
        redirect("/login");
    };

    const redirectToRegister = () => {
        redirect("/register");
    };

    const redirectToMain = () => {
        redirect("/");
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <Box>
            <AppBar component='nav'>
                <Toolbar>
                    <IconButton color='inherit' aria-label="open drawer" edge="start"  onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Cine EDI
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={toggleDrawer}
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer}
                    onKeyDown={toggleDrawer}
                >
                    <List>
                        <ListItem  key="Home" onClick={redirectToMain}>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem  key="Login" onClick={redirectToLogin}>
                            <ListItemText primary="Login" />
                        </ListItem>
                        <ListItem  key="Register" onClick={redirectToRegister}>
                            <ListItemText primary="Register" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
};

export default MainBar;
