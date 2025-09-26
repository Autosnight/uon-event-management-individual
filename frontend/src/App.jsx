// src/App.jsx
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./styles/App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Footer";
import EditEvent from "./pages/EditEvent";
import Profile from "./pages/SideMunuBar/Profile";
import Settings from "./pages/SideMunuBar/Settings";
import Feedback from "./pages/SideMunuBar/Feedback";
import Help from "./pages/SideMunuBar/Help";
import SwitchAcc from "./pages/SideMunuBar/SwitchAcc";
import TopNavBar from "./components/TopNavBar";

import Home from "./pages/Homepage";
import About from "./pages/AboutPage";
import CreateEvent from "./pages/CreateEvent";
import RegisterEvent from "./pages/RegisterEvent";
import OrganizerEvents from "./pages/OrganizerEvents";
import AttendeeEvents from "./pages/AttendeeEvents";
import UpcomingEvents from "./pages/UpcomingEvents";
import SideMenuBar from "./components/menuBar/SideMenuBar";
import ChangePwdPage from "./pages/SideMunuBar/ChangePwdPage";

function WithTopNav() {
  return (
    <>
      <TopNavBar />
      <div className="main-content">
        <SideMenuBar />
        <Outlet />
      </div>
    </>
  );
}

function NoTopNav() {
  return <Outlet />;
}

export default function App() {
  return (
    <div className="app-shell">
      <div className="app-main">
        <div className="app-content">
          <div className="container">
            <BrowserRouter>
              <Routes>
                <Route element={<NoTopNav />}>
                  <Route path="/" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                <Route element={<WithTopNav />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/home" element={<Home />}></Route>
                  <Route path="/about" element={<About />}></Route>
                  <Route path="/create-event" element={<CreateEvent />}></Route>
                  <Route
                    path="/register-event"
                    element={<RegisterEvent />}
                  ></Route>
                  <Route
                    path="/upcoming-events"
                    element={<UpcomingEvents />}
                  ></Route>
                  <Route
                    path="/my-events/organizer"
                    element={<OrganizerEvents />}
                  ></Route>
                  <Route
                    path="/my-events/attendee"
                    element={<AttendeeEvents />}
                  ></Route>
                  <Route
                    path="/organizer/events/:id/edit"
                    element={<EditEvent />}
                  ></Route>
                  <Route path="/profile" element={<Profile />}></Route>
                  <Route path="/profile/change-password" element={<ChangePwdPage />}></Route>
                  <Route path="/settings" element={<Settings />}></Route>
                  <Route path="/feedback" element={<Feedback />}></Route>
                  <Route path="/help" element={<Help />}></Route>
                  <Route path="/switch-account" element={<SwitchAcc />}></Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
