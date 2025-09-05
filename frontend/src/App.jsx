// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";

function App() {
  return (
    <div className="app-content">
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/create-event" element={<CreateEvent />} /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
