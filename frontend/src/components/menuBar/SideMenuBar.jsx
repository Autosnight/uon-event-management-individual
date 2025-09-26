import { useStateContext } from "../../context/StateContext";
import "../menuBar/SideMenuBar.css";
import profile from "../../assets/icons/profile.ico";
import setting from "../../assets/icons/Setting.ico";
import feedback from "../../assets/icons/feedback.ico";
import logout from "../../assets/icons/logout.ico";
import help from "../../assets/icons/help.ico";
import about from "../../assets/icons/about.ico";
import switchAcc from "../../assets/icons/switch.ico";
import useLogout from "../../hooks/logout";

//NOTE: 这里有一个sticky的bug，会卡在Settings下面
export default function SideMenuBar() {
  const { sideBarOpen } = useStateContext();
  const handleLogout = useLogout();

  return (
    <div className={`sidebar ${sideBarOpen ? "" : "hidden"}`}>
      <ul>
        <li className="menu-item-2"></li>

        <li className="menu-item-2">
          <a className="menu-a" href="/profile">
            <img src={profile} className="icon"></img>
            <span className="menu-text-2">Profile</span>
          </a>
        </li>

        <li className="menu-item-2"></li>
        <li className="menu-item-2"></li>

        <li className="menu-item-2">
          <a className="menu-a" href="/settings">
            <img src={setting} className="icon"></img>
            <span className="menu-text-2">Settings</span>
          </a>
        </li>

        <li className="menu-item-2"></li>
        <li className="menu-item-2"></li>

        <li className="menu-item-2">
          <a className="menu-a" href="/Feedback">
            <img src={feedback} className="icon"></img>
            <span className="menu-text-2">Feedback</span>
          </a>
        </li>

        <li className="menu-item-2"></li>
        <li className="menu-item-2"></li>

        <li className="menu-item-2">
          <a className="menu-a" href="/create-event">
            <img src={feedback} className="icon"></img>
            <span className="menu-text-2">Create an Event</span>
          </a>
        </li>

        <li className="menu-item-2"></li>
        <li className="menu-item-2"></li>

        <li className="menu-item-2">
          <a className="menu-a" href="/upcoming-events">
            <img src={feedback} className="icon"></img>
            <span className="menu-text-2">Upcoming Events</span>
          </a>
        </li>

        <li className="menu-item-2"></li>
        <li className="menu-item-2"></li>

        <li className="menu-item-2">
          <a className="menu-a" href="/my-events/organizer">
            <img src={feedback} className="icon"></img>
            <span className="menu-text-2">My Events</span>
          </a>
        </li>

        <li className="menu-item-2"></li>
        <li className="menu-item-2"></li>

        <li className="menu-item-2">
          <a className="menu-a" href="/about">
            <img src={feedback} className="icon"></img>
            <span className="menu-text-2">Terms</span>
          </a>
        </li>

        <li className="menu-item-2"></li>
        <li className="menu-item-2"></li>

        <li className="menu-item-2">
          <a className="menu-a" href="/about">
            <img src={about} className="icon"></img>
            <span className="menu-text-2">About Us</span>
          </a>
        </li>

        <li className="menu-item-2"></li>
        <li className="menu-item-2"></li>

        <li className="menu-item-2">
          <a className="menu-a" href="/help">
            <img src={help} className="icon"></img>
            <span className="menu-text-2">Help</span>
          </a>
        </li>

        <li className="menu-item-2"></li>
        <li className="menu-item-2"></li>

        <li className="menu-item-2">
          <a className="menu-a" href="/switch-account">
            <img src={switchAcc} className="icon"></img>
            <span className="menu-text-2">Switch Account</span>
          </a>
        </li>

        <li className="menu-item-2"></li>
        <li className="menu-item-2"></li>

        <li className="menu-item-2">
          <a className="menu-a" onClick={handleLogout}>
            <img src={logout} className="icon"></img>
            <span className="menu-text-2">Logout</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
