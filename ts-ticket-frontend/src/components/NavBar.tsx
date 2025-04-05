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
    Avatar,
    Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const pages = [
    { name: 'Salles', path: 'admin/salles' },
    { name: 'Films', path: 'admin/films' },
    { name: 'Seances', path: 'admin/seances' },
    { name: 'Reservations', path: 'admin/bookings' },
    { name: 'Users', path: 'admin/users'},
    { name: 'Contact', path: 'admin/contact' },
];

const Navbar: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        // Initial check for authentication
        setIsAuthenticated(!!localStorage.getItem('token'));
        
        // Setup event listener for storage changes
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('token'));
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Setup a token check interval
        const tokenCheckInterval = setInterval(() => {
            setIsAuthenticated(!!localStorage.getItem('token'));
        }, 1000); // Check every second

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(tokenCheckInterval);
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
        <>
            <AppBar 
                position="fixed" 
                elevation={0} 
                sx={{ 
                    backgroundColor: '#ffffff', 
                    borderBottom: '1px solid #e0e0e0', 
                    color: '#232323',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ height: 70 }}>
                        <Typography variant="h6" noWrap component="div" sx={{ mr: 4, display: { xs: 'none', md: 'flex' }, fontWeight: 700, color: '#3f51b5', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: '#3f51b5', width: 32, height: 32, mr: 1, fontSize: '1rem' }}>CB</Avatar>
                            CineGold
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton size="large" aria-label="menu" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} sx={{ color: '#3f51b5' }}>
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' }, '& .MuiPaper-root': { borderRadius: '8px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)', mt: 1.5 } }}
                            >
                                {isAuthenticated && pages.map((page) => (
                                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">
                                            <Link to={`/${page.path.toLowerCase()}`} style={{ textDecoration: 'none', color: '#232323' }}>{page.name}</Link>
                                        </Typography>
                                    </MenuItem>
                                ))}
                                <Divider />
                                {isAuthenticated ? (
                                    <MenuItem onClick={handleLogout}>
                                        <Typography textAlign="center" sx={{ color: '#f44336' }}>Logout</Typography>
                                    </MenuItem>
                                ) : (
                                    <MenuItem>
                                        <Typography textAlign="center">
                                            <Link to="/login" style={{ textDecoration: 'none', color: '#3f51b5' }}>Login</Link>
                                        </Typography>
                                    </MenuItem>
                                )}
                            </Menu>
                        </Box>

                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, fontWeight: 700, color: '#3f51b5', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: '#3f51b5', width: 32, height: 32, mr: 1, fontSize: '1rem' }}>CB</Avatar>
                            CineGold
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                            {isAuthenticated && pages.map((page) => (
                                <Button key={page.name} sx={{ mx: 1, my: 2, color: '#555555', fontSize: '0.95rem', textTransform: 'none', fontWeight: 500, position: 'relative', '&:hover': { backgroundColor: 'transparent', color: '#3f51b5', '&::after': { width: '70%' } }, '&::after': { content: '""', position: 'absolute', bottom: 6, left: '15%', width: 0, height: '2px', backgroundColor: '#3f51b5', transition: 'width 0.3s ease' } }} component={Link} to={`/${page.path.toLowerCase()}`}>
                                    {page.name}
                                </Button>
                            ))}
                        </Box>

                        {/* Login/Logout button for desktop */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {isAuthenticated ? (
                                <Button 
                                    sx={{ 
                                        color: '#f44336', 
                                        borderColor: '#f44336', 
                                        borderRadius: '8px', 
                                        textTransform: 'none', 
                                        fontWeight: 500, 
                                        '&:hover': { 
                                            backgroundColor: 'rgba(244, 67, 54, 0.08)', 
                                            borderColor: '#d32f2f' 
                                        } 
                                    }} 
                                    variant="outlined" 
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            ) : (
                                <Button 
                                    sx={{ 
                                        backgroundColor: '#3f51b5', 
                                        color: 'white', 
                                        borderRadius: '8px', 
                                        textTransform: 'none', 
                                        fontWeight: 500, 
                                        px: 3, 
                                        '&:hover': { 
                                            backgroundColor: '#303f9f' 
                                        } 
                                    }} 
                                    variant="contained" 
                                    component={Link} 
                                    to="/login"
                                >
                                    Login
                                </Button>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {/* Toolbar placeholder to push content below the navbar */}
            <Toolbar sx={{ height: 70 }} />
        </>
    );
};

export default Navbar;