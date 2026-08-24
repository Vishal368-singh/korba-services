import { useState } from "react";
import "./Login.css";

import { login } from "../../services/api";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

import GISBackground from "../../components/GISBackground";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: e.target[0].value,
      password: e.target[1].value,
    };

    try {
      const response = await login(payload);

      localStorage.setItem(
        "user",
        JSON.stringify(response)
      );

      router("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-page">

      {/* Animated GIS background */}
      <GISBackground />

      {/* Login card */}
      <div className="login-content">

        <div className="login-card">

          <div className="logo-wrapper">
            <img src={logo} alt="Logo" />
          </div>

          <h1>Property Survey</h1>

          <p className="subtitle">
            Municipal Corporation, Korba
          </p>

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
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                required
              />

              <button
                type="button"
                className="show-btn"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

            <button
              type="submit"
              className="login-btn"
            >
              Login
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}