import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ContextProvider } from "../Context.jsx";
import Login from "./component/login.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"; // Correct import
import Register from "./component/register.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </ContextProvider>
  </StrictMode>
);
