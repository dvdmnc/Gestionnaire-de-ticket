
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

function App() {

  return (
    <Box sx={{ width:'100%' }}>
        <Navbar />
        <Routes>
            <Route>
                {/* <Route index element={<Home />} />
                  <Route path="about" element={<About />} />*/}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route element={<AuthRoute />}>
                    <Route path={"admin/salles"} element={<SalleManagement />} />
                    <Route path={"admin/films"} element={<FilmManagement />} />
                    <Route path={"admin/seances"} element={<SeanceManagement />} />
                    <Route path={"admin/users" } element={<UserManagement />} />
                </Route>

                <Route path="*" element={<Login />} />
            </Route>


        </Routes>
    </Box>
  )
}

export default App
