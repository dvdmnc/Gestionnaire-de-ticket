
import './App.css'
import {Route, Routes} from "react-router-dom";
import Navbar from "./components/NavBar.tsx";
import {Box} from "@mui/material";
import SalleManagement from "./view/salle/SalleManagement.tsx";
import FilmManagement from "./view/films/FilmManagment.tsx";
import SeanceManagement from "./view/seance/SeanceManagement.tsx";
import Register from "./view/Auth/Register.tsx";
import Login from "./view/Auth/Login.tsx";
import AuthRoute from "./view/Auth/AuthRoute.tsx";
import UserManagement from "./view/user/UserManagement.tsx";
import BookingManager from "./view/booking/BookingManager.tsx";
import ForgotPassword from './view/Auth/ForgotPassword.tsx';
import UpdatePassword from './view/Auth/UpdatePassword.tsx';
import Contact from './view/Contact.tsx';
import LandingPage from './client/Landing/LandingPage.tsx';
import MovieDetails from './client/MovieDetails.tsx';
import ReservationPage from './client/ReservationPage.tsx'; // Added missing import
import UserProfile from './client/UserProfile.tsx';
import AdminRoute from './view/Auth/AdminRoute.tsx';
function App() {

  return (
    <Box sx={{ width:'100%' }}>
        <Navbar />
        <Routes>
                 <Route path="/" element={<LandingPage />} />
                 <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ForgotPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route element={<AdminRoute />}>
                    <Route path={"admin/salles"} element={<SalleManagement />} />
                    <Route path={"admin/films"} element={<FilmManagement />} />
                    <Route path={"admin/seances"} element={<SeanceManagement />} />
                    <Route path={"admin/users" } element={<UserManagement />} />
                    <Route path={"admin/bookings"} element={<BookingManager />} />
                    <Route path={"admin/contact"} element={<Contact/>} />
                </Route>

              <Route path={"client/home"} element={<LandingPage />} />
            <Route path={"client/reservation"} element={<ReservationPage />} />
              <Route path="client/register" element={<Register />} />
              <Route element={<AuthRoute />}>
                <Route path={"client/profile"} element={<UserProfile />} />
            </Route>


        </Routes>
    </Box>
  )
}

export default App
