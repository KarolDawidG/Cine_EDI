import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from '../../public/logo3.png';
import axios from 'axios';
import { notify } from '../notification/Notify';
import { BACKEND } from '../utils/linkt';
import ContactFormModal from './ContactFormModal';

function AuthMainBar() {
    const redirect = useNavigate();
    const [imageUrl, setImageUrl] = useState<string | any>(null);
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [contactFormOpen, setContactFormOpen] = useState(false);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        handleCloseUserMenu();
        redirect("/logout");
    };

    const handleProfile = () => {
        handleCloseUserMenu();
        redirect("/profile");
    };

    const handleAccount = () => {
        handleCloseUserMenu();
        redirect("/account");
    };

    const handleNavigate = (path: string) => {
        handleCloseNavMenu();
        redirect(path);
    };

    const handleOpenContactForm = () => {
        setContactFormOpen(true);
    };

    const handleCloseContactForm = () => {
        setContactFormOpen(false);
    };

    React.useEffect(() => {
        (async () => {
            try {
                const storedLocale = localStorage.getItem("idUser");
                const res = await axios.get(`${BACKEND}/url/${storedLocale}`);
                setImageUrl(res.data.img_url as string);
            } catch (error: any) {
                notify(error.response.data.message);
            }
        })();
    }, [setImageUrl]);

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            <img src={logo} alt="Logo" style={{ width: '50px', height: 'auto', marginRight: '10px' }} />
                            <Typography variant="h6" noWrap component="a" href="dashboard" sx={{ display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none' }}>
                                Cine EDI
                            </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                                <MenuIcon />
                            </IconButton>
                            <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left' }} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{ display: { xs: 'block', md: 'none' } }}>
                                <MenuItem onClick={() => handleNavigate('/vhs')}>
                                    <Typography textAlign="center">VHS tapes</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => handleNavigate('/basket')}>
                                    <Typography textAlign="center">Cart</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleOpenContactForm}>
                                    Contact
                                </MenuItem>
                            </Menu>
                        </Box>

                        <Typography variant="h6" noWrap component="a" href="dashboard" sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none' }}>
                            Cine EDI
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
                            <Button onClick={() => handleNavigate('/vhs')} sx={{ my: 2, color: 'white', display: 'block' }}>
                                VHS tapes
                            </Button>
                            <Button onClick={() => handleNavigate('/basket')} sx={{ my: 2, color: 'white', display: 'block' }}>
                                Cart
                            </Button>
                            <Button onClick={handleOpenContactForm} sx={{ my: 2, color: 'white', display: 'block' }}>
                                Contact
                            </Button>
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar src={imageUrl} />
                                </IconButton>
                            </Tooltip>
                            <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                                <MenuItem onClick={handleProfile}>
                                    <Typography textAlign="center">Profile</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleAccount}>
                                    <Typography textAlign="center">Account</Typography>
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    <Typography textAlign="center">Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <ContactFormModal open={contactFormOpen} handleClose={handleCloseContactForm} />
        </>
    );
}
export default AuthMainBar;
