import '../styles/pages/Register.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormButton from '../components/FormButton';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!role) {
      alert('Please select a user type.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        email,
        username,
        password,
        role,
      });

      alert('Register successful');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Register failed');
    }
  };

  return (
      <div className="login-wrapper">

        <div className="login-bg"></div>

        <div className="form-container">
          <h2>Register</h2>

          <input
            className="form-input"
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="form-input"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="form-input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />


          <select
            className="form-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">-- Select Role --</option>
            <option value="organizer">Organizer</option>
            <option value="attendee">Attendee</option>
          </select>

          <div className="button-group">
            <FormButton text="Login" color="green" onClick={() => navigate('/')} />
            <FormButton text="Register" color="blue" onClick={handleRegister} />
          </div>

        </div>

      </div>
  );
}
