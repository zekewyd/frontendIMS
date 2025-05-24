import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';

function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // BASIC LOGIN WITHOUT TOKEN (FOR TESTING OR FRONTEND ONLY)
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent page reload
    // You can validate username/password here if needed
    navigate("/admin/dashboard"); // Navigate to dashboard
  };

  return (
    <div className="wrapper">
      <div className="login-container login-background">
        <div className="login-form-container">
          <img src={logo} alt="Logo" className="logo-login" />
          <form className="login-form" onSubmit={handleLogin}>
            <h5 className="system-label">Inventory Management System</h5>
            <h1 className="login-title">LOGIN</h1>

            <div className="input-group">
              <FontAwesomeIcon icon={faUser} className="icon" />
              <input
                type="text"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <FontAwesomeIcon icon={faLock} className="icon" />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
              <FontAwesomeIcon
                icon={passwordVisible ? faEyeSlash : faEye}
                className="eye-icon"
                onClick={() => setPasswordVisible(!passwordVisible)}
              />
            </div>

            <button className="login-button" type="submit">
              Log in
            </button>

            <p className="forgot-password">
              Forgot Password? <Link to="/reset-password">Reset Here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
