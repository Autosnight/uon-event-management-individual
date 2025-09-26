import "./SideMenuPage.css";
import "./Profile.css";
import AnimatedButton from "../../components/Button/AnimatedButton";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const [twoFA, setTwoFA] = useState(false);
  const goToChangePassword = () => {
    navigate("/profile/change-password");
  };

  const enable2FA = async () => {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:5000/api/auth/2fa/enable", null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const disable2FA = async () => {
    const token = localStorage.getItem("token");
    axios.post("http://localhost:5000/api/auth/2fa/disable", null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const handleTwoFAChange = (e) => {
    const next = e.target.checked;
    const prev = twoFA;
    setTwoFA(next);
    try {
      if (next) {
        enable2FA();
      } else {
        disable2FA();
      }
    } catch (error) {
      setTwoFA(prev);
      alert(error.response?.data?.error || "Updating 2FA setting failed");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized");
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:5000/api/auth/2fa/status", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const val = data?.value;
        setTwoFA(!!val);
      })
      .catch((error) => {
        alert(error.response?.data?.error || "Fetching 2FA setting failed");
      });
  }, []);

  return (
    <section id="main-content">
      <div className="profile-wrapper">
        <div className="sidebar-area">
          <div className="profile-badge-wrapper">
            <div className="profile-pic-area">
              <div className="profile-pic"></div>
              <div>Jun</div>
            </div>

          </div>
          <div className="profile-signature-area">This is a signature...</div>
          email address: <br></br>
          phone number:

        </div>

        <div className="sidebar-area">
          <div className="sidebar-header">Account & Safety</div>
          <div className="sidebar-header-2">Change password:</div>
          <div className="profile-section-content">
            <AnimatedButton
              label="Change Password"
              onClick={goToChangePassword}
            />
          </div>
          <div className="sidebar-header-2">2-Factor Authentication:</div>
          <div className="profile-section-content">
            <input
              type="checkbox"
              checked={twoFA}
              onChange={handleTwoFAChange}
            />{" "}
            Enable
          </div>
          <div className="sidebar-header-2">Active devices:</div>
          <div className="sidebar-header-2">Login history:</div>
        </div>

        <div className="sidebar-area">
          <div className="sidebar-header">Notification Settings</div>
          <div className="sidebar-header-2">Email notifications:</div>
          <div className="sidebar-header-2">SMS notifications:</div>
          <div className="sidebar-header-2">Push notifications:</div>
          <div className="sidebar-header-2">Newsletter subscriptions:</div>
        </div>

        <div className="sidebar-area">
          <div className="sidebar-header">Security Settings</div>
          <div className="sidebar-header-2">Login alerts:</div>
          <div className="sidebar-header-2">Data download:</div>
          <div className="sidebar-header-2">Connected apps:</div>
          <div className="sidebar-header-2">Account recovery options:</div>
        </div>

        <div className="profile-section-area">
          <div className="profile-section-header">Preferences</div>
          <div>Language:</div>
          <div>Time zone:</div>
          <div>Content preferences:</div>
          <div>Accessibility settings:</div>
        </div>

        <div className="personal-info-section"></div>
        <div className="account-settings-section"></div>
        <div className="activity-logs-section"></div>
      </div>
    </section>
  );
}
