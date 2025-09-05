import "../styles/pages/Register.css";
import "../styles/pages/auth-glass.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormButton from "../components/FormButton";
import ValidatedInput from "../components/ValidatedInput";

export default function Register() {
  const formRef = useRef(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        const tag = (e.target?.tagName || "").toLowerCase();
        formRef.current?.requestSubmit?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        username,
        password,
        role,
      });

      alert(
        "An email has been sent to your email address, please verify your email"
      );
      navigate("/");
    } catch (e) {
      alert(e.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-color c1" />
      <div className="auth-color c2" />
      <div className="auth-color c3" />
      <div className="auth-box">
        <div className="auth-square s1" style={{ "--i": 0 }} />
        <div className="auth-square s2" style={{ "--i": 1 }} />
        <div className="auth-square s3" style={{ "--i": 2 }} />
        <div className="auth-square s4" style={{ "--i": 3 }} />
        <div className="auth-square s5" style={{ "--i": 4 }} />
        <form
          ref={formRef}
          onSubmit={handleRegister}
          className="form-container auth-card"
        >
          <h2>Register</h2>

          <ValidatedInput
            name="reg-email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            rules={["required", "email"]}
          />

          <ValidatedInput
            name="reg-username"
            placeholder="Username"
            value={username}
            onChange={setUsername}
            rules={["required", "username"]}
          />

          <ValidatedInput
            name="reg-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            rules={["required", "password"]}
          />

          <ValidatedInput
            name="reg-confirm-password"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            rules={["required", "confirmPassword"]}
            originPassword={password}
          />

          <ValidatedInput
            tagType="select"
            name="reg-role"
            value={role}
            onChange={setRole}
            rules={["required"]}
          >
            <option value="">-- Select Role --</option>
            <option value="organizer">Organizer</option>
            <option value="attendee">Attendee</option>
          </ValidatedInput>

          <div className="button-group">
            {/* <FormButton
              text="Login"
              color="green"
              onClick={() => navigate("/")}
            /> */}
            <FormButton text="Register" color="blue" type="submit" />
          </div>
          <div className="auth-links">
            <p>
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/"); // 回登录页
                }}
              >
                Log in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
