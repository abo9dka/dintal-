import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import "./App.css";
import "./styles/doctor.css";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ThemeProvider>
                    <LanguageProvider>
                        <App />
                    </LanguageProvider>
                </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
