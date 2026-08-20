import { useState } from "react";
import "./Login.css";
import { login } from "../../services/api";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useNavigate();

  const handleSubmit = async (e) => {
    const payload = {
      username: e.target[0].value,
      password: e.target[1].value,
    };
    e.preventDefault();  {/* the default behavior of a <form> is to submit the form and reload the page. */ }
    const response = await login(payload);
    localStorage.setItem("user", JSON.stringify(response));
    router("/dashboard");  {/* navigate to the dashboard page after successful login */ }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="logo-wrapper">
          <img src={logo} alt="Logo" />
        </div>

        <h1>Property Survey</h1>
        <p className="subtitle">Korba Nagar Nigam</p>

        {/* <div className="status">
          <span className="dot"></span>
          Online
        </div> */}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              required
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />

            <button
              type="button"
              className="show-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button className="login-btn" onClick={handleSubmit}>
            Login
          </button>

        </form>

      </div>
    </div>
  );
}