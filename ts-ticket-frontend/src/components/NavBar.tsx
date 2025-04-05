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
                    background: 'linear-gradient(to right,rgb(8, 30, 63) 0%,rgb(0, 6, 34) 100%)',
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ height: 70 }}>
                        <Typography 
                            variant="h6" 
                            noWrap 
                            component="div" 
                            sx={{ 
                                mr: 4, 
                                display: { xs: 'none', md: 'flex' }, 
                                fontWeight: 600, 
                                color: '#ffffff', 
                                alignItems: 'center',
                                fontFamily: 'Poppins, sans-serif',
                            }}
                        >
                            <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32, mr: 1, fontSize: '1rem' }}>CG</Avatar>
                            CineGold
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton 
                                size="large" 
                                aria-label="menu" 
                                aria-controls="menu-appbar" 
                                aria-haspopup="true" 
                                onClick={handleOpenNavMenu} 
                                sx={{ color: '#ffffff' }}
                            >
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
                                sx={{ 
                                    display: { xs: 'block', md: 'none' }, 
                                    '& .MuiPaper-root': { 
                                        borderRadius: '8px', 
                                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)', 
                                        mt: 1.5,
                                        background: 'linear-gradient(to right,rgb(8, 30, 63) 0%,rgb(0, 6, 34) 100%)',
                                    } 
                                }}
                            >
                                {isAuthenticated && pages.map((page) => (
                                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                        <Typography 
                                            textAlign="center"
                                            sx={{ 
                                                fontFamily: 'Montserrat, sans-serif',
                                                color: '#c3d0ff',
                                                '&:hover': {
                                                    color: '#ffffff',
                                                }
                                            }}
                                        >
                                            <Link to={`/${page.path.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>{page.name}</Link>
                                        </Typography>
                                    </MenuItem>
                                ))}
                                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                                {isAuthenticated ? (
                                    <MenuItem onClick={handleLogout}>
                                        <Typography 
                                            textAlign="center" 
                                            sx={{ 
                                                color: '#ff8a80',
                                                fontFamily: 'Montserrat, sans-serif',
                                            }}
                                        >
                                            Logout
                                        </Typography>
                                    </MenuItem>
                                ) : (
                                    <MenuItem>
                                        <Typography 
                                            textAlign="center"
                                            sx={{ 
                                                fontFamily: 'Montserrat, sans-serif',
                                                color: '#1976d2',
                                            }}
                                        >
                                            <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
                                        </Typography>
                                    </MenuItem>
                                )}
                            </Menu>
                        </Box>

                        <Typography 
                            variant="h6" 
                            noWrap 
                            component="div" 
                            sx={{ 
                                flexGrow: 1, 
                                display: { xs: 'flex', md: 'none' }, 
                                fontWeight: 600, 
                                color: '#ffffff', 
                                alignItems: 'center',
                                fontFamily: 'Poppins, sans-serif',
                            }}
                        >
                            <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32, mr: 1, fontSize: '1rem' }}>CG</Avatar>
                            CineGold
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                            {isAuthenticated && pages.map((page) => (
                                <Button 
                                    key={page.name} 
                                    sx={{ 
                                        mx: 1.5, 
                                        my: 2, 
                                        color: '#c3d0ff', 
                                        fontSize: '0.95rem', 
                                        textTransform: 'none', 
                                        fontWeight: 500, 
                                        fontFamily: 'Montserrat, sans-serif',
                                        position: 'relative', 
                                        '&:hover': { 
                                            backgroundColor: 'transparent', 
                                            color: '#ffffff', 
                                            '&::after': { width: '70%' } 
                                        }, 
                                        '&::after': { 
                                            content: '""', 
                                            position: 'absolute', 
                                            bottom: 6, 
                                            left: '15%', 
                                            width: 0, 
                                            height: '2px', 
                                            backgroundColor: '#1976d2', 
                                            transition: 'width 0.3s ease' 
                                        } 
                                    }} 
                                    component={Link} 
                                    to={`/${page.path.toLowerCase()}`}
                                >
                                    {page.name}
                                </Button>
                            ))}
                        </Box>

                        {/* Login/Logout button for desktop */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {isAuthenticated ? (
                                <Button 
                                    sx={{ 
                                        borderColor: '#ff8a80', 
                                        color: '#ff8a80', 
                                        borderRadius: '8px', 
                                        textTransform: 'none', 
                                        fontWeight: 500, 
                                        fontFamily: 'Montserrat, sans-serif',
                                        '&:hover': { 
                                            backgroundColor: 'rgba(255, 138, 128, 0.1)', 
                                            borderColor: '#ff5252' 
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
                                        backgroundColor: '#1976d2', 
                                        color: 'white', 
                                        borderRadius: '8px', 
                                        textTransform: 'none', 
                                        fontWeight: 500, 
                                        fontFamily: 'Montserrat, sans-serif',
                                        px: 3, 
                                        '&:hover': { 
                                            backgroundColor: '#1565c0' 
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