import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {NotificationsProvider} from "@toolpad/core";

createRoot(document.getElementById('root')!).render(

    <NotificationsProvider>
  <StrictMode>

            <BrowserRouter>

                    <App/>

          </BrowserRouter>

  </StrictMode>
    </NotificationsProvider>

    ,
)
