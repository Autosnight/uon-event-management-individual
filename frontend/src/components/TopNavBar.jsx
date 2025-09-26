import React, { useEffect, useState } from "react";
import "../styles/pages/TopNavBar.css";
import { useStateContext } from "../context/StateContext";
import { useNavigate, useLocation } from "react-router-dom";
import ButtonConfirm from "../components/ButtonConfirm";
import useLogout from "../hooks/logout";

export default function TopNavBar() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [isOrganizer, setIsOrganizer] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setSideBarOpen } = useStateContext();
  const handleSwitchMenu = () => setSideBarOpen((v) => !v);
  const handleLogout = useLogout();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    setUsername(username);
    setRole(role);
    setIsOrganizer(role === "organizer");
  }, [navigate]);


  return (
    <nav className="navbar">
      <div className="nav-left-top">
        <span>
          <button type="button" onClick={handleSwitchMenu}></button>
        </span>
        <span className="user-role">
          {role
            ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
            : ""}
        </span>
        <span className="user-badge">
          <span className="avatar" aria-hidden="true" />
          <span className="user-name">{username || "Unknown_User"}</span>
        </span>
      </div>
      <div className="nav-center">
        <div className="nav-links">
          <a className={pathname === "/home" ? "active" : ""} href="/home">
            Home
          </a>

          <a className={pathname === "/about" ? "active" : ""} href="/about">
            About
          </a>

          {isOrganizer ? (
            <a
              className={pathname === "/create-event" ? "active" : ""}
              href="/create-event"
            >
              Create an Event
            </a>
          ) : (
            <a
              className={pathname === "/register-event" ? "active" : ""}
              href="/register-event"
            >
              Register for Events
            </a>
          )}

          <a
            className={pathname === "/upcoming-events" ? "active" : ""}
            href="/upcoming-events"
          >
            Upcoming Events
          </a>

          {isOrganizer ? (
            <a
              className={pathname === "/my-events/organizer" ? "active" : ""}
              href="/my-events/organizer"
            >
              My Events
            </a>
          ) : (
            <a
              className={pathname === "/my-events/attendee" ? "active" : ""}
              href="/my-events/attendee"
            >
              My Events
            </a>
          )}

          <a onClick={handleLogout} style={{ color: "red" }}>
            Logout
          </a>
        </div>
      </div>
    </nav>
  );
}
