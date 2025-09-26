import "../styles/pages/login.css";
import "../styles/pages/auth-glass.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormButton from "../components/Button/FormButton";
import ValidatedInput from "../components/ValidatedInput";

import { useStateContext } from "../context/StateContext";

export default function Login() {
  const formRef = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setActiveSection } = useStateContext();

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin();
  };
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("role", res.data.role);
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
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
          className="form-container auth-card"
          onSubmit={handleSubmit}
          noValidate
        >
          <h2>Login</h2>

          <ValidatedInput
            name="login-username"
            placeholder="Username or email"
            value={username}
            onChange={setUsername}
            rules={["required", "userOrEmail"]}
            // onError={setUsernameErr}
          />

          <ValidatedInput
            name="login-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            rules={["required", "password"]}
            // onError={setPasswordErr}
          />

          <div className="button-group">
            <FormButton text="Login" color="green" type="submit" />
            {/* <FormButton
              text="Register"
              color="blue"
              onClick={() => navigate("/register")}
            /> */}
          </div>
          <div className="auth-links">
            <p>
              Forgot password?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Coming soon");
                }}
              >
                Click Here
              </a>
            </p>
            <p>
              Don't have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
