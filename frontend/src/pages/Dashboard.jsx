import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/pages/dashboard.css";
import OrganizerEvents from "./OrganizerEvents";
import AttendeeEvents from "./AttendeeEvents";
import RegisterEvent from "./RegisterEvent";

import { useStateContext } from "../context/StateContext";

import TopNavBar from "../components/TopNavBar";
import SideMenuBar from "../components/menuBar/SideMenuBar";
import Homepage from "./Homepage";

import AboutPage from "./AboutPage";
import CreateEvent from "./CreateEvent";
import UpcomingEvents from "./UpcomingEvents";

import ButtonConfirm from "../components/ButtonConfirm";

export default function Dashboard() {
  const { activeSection } = useStateContext();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [isOrganizer, setIsOrganizer] = useState(false);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [myCreatedEvents, setMyCreatedEvents] = useState([]);
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const handleSwitchMenu = () => setSideBarOpen(v => !v);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (!token) {
      alert("Unauthorized");
      navigate("/");
      return;
    }

    setUsername(username);
    setRole(role);
    setIsOrganizer(role === "organizer");

    axios
      .get("http://localhost:5000/api/auth/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsername(res.data.username);
        setIsOrganizer(res.data.role === "organizer");
      })
      .catch(() => {
        alert("Unauthorized");
        navigate("/");
      });

    axios
      .get("http://localhost:5000/api/auth/events/upcoming", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUpcomingEvents(res.data);
      })
      .catch(() => {
        alert("Unauthorized");
        navigate("/");
      });

    axios
      .get("http://localhost:5000/api/auth/user/registrations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserRegistrations(res.data))
      .catch(() => {
        alert("Unauthorized");
        navigate("/");
      });

    axios
      .get("http://localhost:5000/api/auth/organizer/my-events", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMyCreatedEvents(res.data))
      .catch(() => {
        alert("Unauthorized");
        navigate("/");
      });
  }, [activeSection, navigate]);



  return (
    <div className="dashboard-container">
      <main className={`main-content`}>
        <SideMenuBar />

        <div className="main-content-wrap">
          {activeSection === "home" && (
            <Homepage username={username} role={role} />
          )}

          {activeSection === "about" && <AboutPage />}

          {activeSection === "create" && <CreateEvent />}

          {activeSection === "register" && (
            <section>
              <RegisterEvent />
            </section>
          )}

          {activeSection === "events" && (
            <UpcomingEvents />
          )}

          {activeSection === "myEvents" && (
            <section>
              <h2 style={{ textAlign: "center" }}>My Events</h2>
              {role === "organizer" ? <OrganizerEvents /> : <AttendeeEvents />}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
