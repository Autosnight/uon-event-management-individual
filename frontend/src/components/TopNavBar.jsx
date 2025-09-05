import "../styles/pages/dashboard.css";
import { useStateContext } from "../context/StateContext";

export default function TopNavBar({ role, isOrganizer, handleLogout }) {
  const { setActiveSection } = useStateContext();
  return (
    <nav className="navbar">
      <div className="nav-left-top">
        <span className="user-role">
          {role
            ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
            : ""}
        </span>
      </div>
      <div className="nav-center">
        <div className="nav-links">
          <a onClick={() => setActiveSection("home")}>Home</a>
          <a onClick={() => setActiveSection("about")}>About</a>
          {isOrganizer && (
            <a onClick={() => setActiveSection("create")}>Create an Event</a>
          )}
          {!isOrganizer && (
            <a onClick={() => setActiveSection("register")}>
              Register for Events
            </a>
          )}
          <a onClick={() => setActiveSection("events")}>Upcoming Events</a>
          <a onClick={() => setActiveSection("myEvents")}>My Events</a>
          <a onClick={handleLogout} style={{ color: "red" }}>
            Logout
          </a>
        </div>
      </div>
    </nav>
  );
}
