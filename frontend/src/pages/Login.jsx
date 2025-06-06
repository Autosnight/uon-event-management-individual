import '../styles/pages/login.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormButton from '../components/FormButton';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('role', res.data.role);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
      <div className="login-wrapper">

        <div className="login-bg"></div>

        <div className="form-container">
          <h2>Login</h2>
          <input className="form-input" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          <input className="form-input" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <div className="button-group">
              <FormButton text="Login" color="green" onClick={handleLogin} />
              <FormButton text="Register" color="blue" onClick={() => navigate('/register')} />
            </div>
        </div>

      </div>
  );
}
