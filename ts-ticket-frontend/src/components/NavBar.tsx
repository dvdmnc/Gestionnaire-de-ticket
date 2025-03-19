import React, {useEffect, useState} from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Container,
    Button,
    Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
//    'salles', 'Movies', 'Bookings', 'Contact'
const pages = [
    { name: 'Salles', path: 'admin/salles' },
    { name: 'Movies', path: 'admin/films' },
    { name: 'Seances', path: 'admin/seances' },
    { name: 'Contact', path: 'admin/contact' },
    { name:'Users', path:'admin/users'}
];

const Navbar: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('token'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        window.location.href = '/login'; // Redirect to login page
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
       >
            <Container>
                <Toolbar disableGutters>
                    {/* Logo */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                    >
                        FilmBooking
                    </Typography>

                    {/* Mobile Menu Icon */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">
                                        <Link to={`/${page.path.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {page.name}
                                        </Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Desktop Menu */}
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                    >
                        FilmBooking
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                                component={Link}
                                to={`/${page.path.toLowerCase()}`}
                            >
                                {page.name}
                            </Button>
                        ))}

                            {isAuthenticated ? (
                                <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={handleLogout}>
                                    Logout
                                </Button>
                            ) : (
                                <Button sx={{ my: 2, color: 'white', display: 'block' }} component={Link} to="/login">
                                    Login
                                </Button>
                            )}

                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
