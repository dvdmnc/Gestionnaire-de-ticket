
import './App.css'
import {Route, Routes} from "react-router-dom";
import SalleList from "./view/salle/SalleList.tsx";
import Navbar from "./components/NavBar.tsx";
import {Box} from "@mui/material";
import SalleManagement from "./view/salle/SalleManagement.tsx";

function App() {

  return (
    <Box sx={{ width:'100%' }}>
        <Navbar />
        <Routes>
            <Route >
                {/* <Route index element={<Home />} />
                  <Route path="about" element={<About />} />*/}
                <Route path={"salles"} element={<SalleManagement />} />
            </Route>
        </Routes>
    </Box>
  )
}

export default App
