import AnimatedButton from "../../components/Button/AnimatedButton";
import "./ChangePwdPage.css";
import { useNavigate } from "react-router-dom";
import ValidatedInput from "../../components/ValidatedInput";
import { useState } from "react";
import axios from "axios";
import { useRef } from "react";

export default function ChangePwdPage() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const goToProfile = () => {
    navigate("/profile");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/change-password",
        { newPassword: password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password changed successfully");
      navigate("/profile");
    } catch (e) {
      alert(e.response?.data?.error || "Password failed to change");
    }
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <section id="main-content">
      <div className="sidebar-wrapper">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="sidebar-area">
            <div className="sidebar-header">
              Please enter your new password:
            </div>
            <div className="sidebar-header">
              <ValidatedInput
                name="new-pwd"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={setPassword}
                rules={["required", "password"]}
              />
            </div>
          </div>

          <div className="sidebar-area">
            <div className="sidebar-header">
              Please confirm your new password:
            </div>

            <div className="sidebar-header">
              <ValidatedInput
                name="new-confirm-pwd"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                rules={["required", "confirmPassword"]}
                originPassword={password}
              />
            </div>
          </div>

          <div className="sidebar-area">
            <div className="changePwd-btn-group">
              <AnimatedButton
                label="Cancel"
                onClick={goToProfile}
              ></AnimatedButton>
              <AnimatedButton label="Submit" type="submit"></AnimatedButton>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
