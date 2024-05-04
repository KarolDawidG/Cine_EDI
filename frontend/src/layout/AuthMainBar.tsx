import * as React from 'react';
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

function AuthMainBar() {
    const redirect = useNavigate();
    const [imageUrl, setImageUrl ]: string | any = React.useState();
    const [anchorElNav, setAnchorElNav] = React.useState<any>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<any>(null);

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

    const handleNavigate = (path:string) => {
        handleCloseNavMenu();
        redirect(path);
    };
    

    React.useEffect(() => {
        (async () => {
          try {
            const storedLocale = localStorage.getItem("idUser");
            const res = await axios.get(`http://localhost:3001/url/${storedLocale}`);
            setImageUrl(res.data.img_url);
          } catch (error) {
            console.error("Błąd pobierania awatar URL:", error);
          }
        })();
      }, [setImageUrl]);

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <img src={logo} alt="Logo" style={{ width: '70px', height: 'auto', marginRight: '10px' }} />
                    <Typography variant="h6" noWrap component="a" href="dashboard" sx={{mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none',}}>
                        Cine EDI
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                            <MenuIcon />
                        </IconButton>
                        <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{vertical: 'bottom', horizontal: 'left',}} keepMounted transformOrigin={{vertical: 'top', horizontal: 'left',}} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{display: { xs: 'block', md: 'none' },}}>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">Kasety VHS</Typography>
                            </MenuItem>

                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">strona 2</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>

                    <Typography variant="h5" noWrap component="a" href="dashboard" sx={{mr: 2, display: { xs: 'flex', md: 'none' }, flexGrow: 1, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none',}}>
                        Cine EDI
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button onClick={() => handleNavigate('/vhs')} sx={{ my: 2, color: 'white', display: 'block' }}>
                            Kasety VHS
                        </Button>
                        <Button onClick={() => handleNavigate('/basket')} sx={{ my: 2, color: 'white', display: 'block' }}>
                            Koszyk
                        </Button>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar src={imageUrl}  />
                            </IconButton>
                        </Tooltip>
                        <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{vertical: 'top', horizontal: 'right',}} keepMounted transformOrigin={{vertical: 'top', horizontal: 'right',}} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
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
    );
}
export default AuthMainBar;