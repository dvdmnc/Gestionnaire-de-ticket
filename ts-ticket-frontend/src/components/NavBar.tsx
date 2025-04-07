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
    Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MovieIcon from '@mui/icons-material/Movie';
import EventIcon from '@mui/icons-material/Event';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PeopleIcon from '@mui/icons-material/People';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PersonIcon from '@mui/icons-material/Person';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

    // Define pages with their icons
    const getPages = () => {
        if (isAdmin) {
            return [
                { name: 'Home', path: 'client/home', icon: <HomeIcon sx={{ fontSize: '1.1rem' }} /> },
                { name: 'Rooms', path: 'admin/salles', icon: <MeetingRoomIcon sx={{ fontSize: '1.1rem' }} /> },
                { name: 'Movies', path: 'admin/films', icon: <MovieIcon sx={{ fontSize: '1.1rem' }} /> },
                { name: 'Screenings', path: 'admin/seances', icon: <EventIcon sx={{ fontSize: '1.1rem' }} /> },
                { name: 'Bookings', path: 'admin/bookings', icon: <BookOnlineIcon sx={{ fontSize: '1.1rem' }} /> },
                { name: 'Users', path: 'admin/users', icon: <PeopleIcon sx={{ fontSize: '1.1rem' }} /> },
                { name: 'Contact', path: 'admin/contact', icon: <ContactMailIcon sx={{ fontSize: '1.1rem' }} /> },
            ];
        } else if (isAuthenticated) {
            return [
                { name: 'Home', path: 'client/home', icon: <HomeIcon sx={{ fontSize: '1.1rem' }} /> },
                { name: 'Profile', path: 'client/profile', icon: <PersonIcon sx={{ fontSize: '1.1rem' }} /> },
            ];
        } else {
            return [
                { name: 'Home', path: 'client/home', icon: <HomeIcon sx={{ fontSize: '1.1rem' }} /> },
                { name: 'Register', path: 'client/register', icon: <HowToRegIcon sx={{ fontSize: '1.1rem' }} /> }
            ];
        }
    };

    const pages = getPages();

    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('token'));
        
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('token'));
            setIsAdmin(localStorage.getItem('isAdmin') === 'true');
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Setup a token check interval
        const tokenCheckInterval = setInterval(() => {
            setIsAuthenticated(!!localStorage.getItem('token'));
            setIsAdmin(localStorage.getItem('isAdmin') === 'true');
        }, 1000); // Check every second

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(tokenCheckInterval);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('user_id');
        setIsAuthenticated(false);
        setIsAdmin(false);
        window.location.href = '/login'; 
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
                elevation={3} 
                sx={{ 
                    background: 'linear-gradient(to right,rgb(8, 30, 63) 0%,rgb(0, 6, 34) 100%)',
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)'
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ height: 70 }}>
                        {/* Logo for desktop */}
                        <Avatar 
                            sx={{ 
                                bgcolor: '#1976d2', 
                                width: 35, 
                                height: 35, 
                                mr: 1, 
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                                display: { xs: 'none', md: 'flex' }
                            }}
                        >
                            CG
                        </Avatar>
                        <Typography 
                            variant="h6" 
                            noWrap 
                            component={Link}
                            to="/"
                            sx={{ 
                                mr: 5, 
                                display: { xs: 'none', md: 'flex' }, 
                                fontWeight: 700, 
                                color: '#ffffff', 
                                alignItems: 'center',
                                fontFamily: 'Poppins, sans-serif',
                                letterSpacing: '0.05rem',
                                textDecoration: 'none',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                fontSize: '1.4rem',
                                "&:hover": {
                                    color: '#f0f4ff',
                                }
                            }}
                        >
                            CineGold
                        </Typography>

                        {/* Mobile menu */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton 
                                size="large" 
                                aria-label="menu" 
                                aria-controls="menu-appbar" 
                                aria-haspopup="true" 
                                onClick={handleOpenNavMenu} 
                                sx={{ 
                                    color: '#ffffff',
                                    "&:hover": {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
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
                                        borderRadius: '10px', 
                                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)', 
                                        mt: 1.5,
                                        background: 'linear-gradient(to right,rgb(8, 30, 63) 0%,rgb(0, 6, 34) 100%)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        overflow: 'hidden'
                                    } 
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem 
                                        key={page.name} 
                                        onClick={handleCloseNavMenu}
                                        component={Link}
                                        to={`/${page.path.toLowerCase()}`}
                                        sx={{
                                            py: 1.2,
                                            transition: 'all 0.2s ease',
                                            "&:hover": {
                                                backgroundColor: 'rgba(25, 118, 210, 0.15)',
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#c3d0ff' }}>
                                            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                                {page.icon}
                                            </Box>
                                            <Typography 
                                                sx={{ 
                                                    fontFamily: 'Montserrat, sans-serif',
                                                    fontWeight: 500,
                                                    "&:hover": {
                                                        color: '#ffffff',
                                                    }
                                                }}
                                            >
                                                {page.name}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 0.5 }} />
                                {isAuthenticated ? (
                                    <MenuItem 
                                        onClick={handleLogout}
                                        sx={{
                                            py: 1.2,
                                            transition: 'all 0.2s ease',
                                            "&:hover": {
                                                backgroundColor: 'rgba(255, 138, 128, 0.15)',
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#ff8a80' }}>
                                            <LogoutIcon sx={{ mr: 2, fontSize: '1.1rem' }} />
                                            <Typography 
                                                sx={{ 
                                                    fontFamily: 'Montserrat, sans-serif',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Logout
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ) : (
                                    <MenuItem 
                                        component={Link} 
                                        to="/login"
                                        sx={{
                                            py: 1.2,
                                            transition: 'all 0.2s ease',
                                            "&:hover": {
                                                backgroundColor: 'rgba(25, 118, 210, 0.15)',
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#1976d2' }}>
                                            <LoginIcon sx={{ mr: 2, fontSize: '1.1rem' }} />
                                            <Typography 
                                                sx={{ 
                                                    fontFamily: 'Montserrat, sans-serif',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Login
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                )}
                            </Menu>
                        </Box>

                        {/* Logo for mobile */}
                        <Avatar 
                            sx={{ 
                                bgcolor: '#1976d2', 
                                width: 34, 
                                height: 34, 
                                mr: 1, 
                                fontSize: '1rem',
                                display: { xs: 'flex', md: 'none' }
                            }}
                        >
                            CG
                        </Avatar>
                        <Typography 
                            variant="h6" 
                            noWrap 
                            component={Link}
                            to="/"
                            sx={{ 
                                flexGrow: 1, 
                                display: { xs: 'flex', md: 'none' }, 
                                fontWeight: 600, 
                                color: '#ffffff', 
                                alignItems: 'center',
                                fontFamily: 'Poppins, sans-serif',
                                textDecoration: 'none'
                            }}
                        >
                            CineGold
                        </Typography>

                        {/* Desktop menu */}
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                            {pages.map((page) => (
                                <Tooltip title={page.name} arrow key={page.name}>
                                    <Button 
                                        sx={{ 
                                            mx: 1.2, 
                                            color: '#c3d0ff', 
                                            fontSize: '0.95rem', 
                                            textTransform: 'none', 
                                            fontWeight: 500, 
                                            fontFamily: 'Montserrat, sans-serif',
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 1,
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            transition: 'all 0.3s ease',
                                            '&:hover': { 
                                                backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                                                color: '#ffffff',
                                                transform: 'translateY(-2px)',
                                                '&::after': { width: '100%' } 
                                            }, 
                                            '&::after': { 
                                                content: '""', 
                                                position: 'absolute', 
                                                bottom: 0, 
                                                left: 0, 
                                                width: 0, 
                                                height: '2px', 
                                                backgroundColor: '#1976d2', 
                                                transition: 'width 0.3s ease' 
                                            } 
                                        }} 
                                        component={Link} 
                                        to={`/${page.path.toLowerCase()}`}
                                        disableRipple
                                    >
                                        {page.icon}
                                        {page.name}
                                    </Button>
                                </Tooltip>
                            ))}
                        </Box>

                        {/* Login/Logout button for desktop */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            {isAuthenticated ? (
                                <Button 
                                    sx={{ 
                                        borderColor: '#ff8a80', 
                                        color: '#ff8a80', 
                                        borderRadius: '10px', 
                                        textTransform: 'none', 
                                        fontWeight: 500, 
                                        fontFamily: 'Montserrat, sans-serif',
                                        display: 'flex',
                                        gap: 1,
                                        py: 0.8,
                                        px: 2.5,
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                            backgroundColor: 'rgba(255, 138, 128, 0.1)', 
                                            borderColor: '#ff5252',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 8px rgba(255, 138, 128, 0.2)'
                                        } 
                                    }} 
                                    variant="outlined" 
                                    onClick={handleLogout}
                                    startIcon={<LogoutIcon />}
                                >
                                    Logout
                                </Button>
                            ) : (
                                <Button 
                                    sx={{ 
                                        backgroundColor: '#1976d2', 
                                        color: 'white', 
                                        borderRadius: '10px', 
                                        textTransform: 'none', 
                                        fontWeight: 500, 
                                        fontFamily: 'Montserrat, sans-serif',
                                        py: 0.8,
                                        px: 3,
                                        display: 'flex',
                                        gap: 1,
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                                        '&:hover': { 
                                            backgroundColor: '#1565c0',
                                            boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)',
                                            transform: 'translateY(-2px)'
                                        } 
                                    }} 
                                    variant="contained" 
                                    component={Link} 
                                    to="/login"
                                    startIcon={<LoginIcon />}
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