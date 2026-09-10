import { useState } from "react";
import "./Login.css";

import { login } from "../../services/api";
import logo from "../../assets/Korbalogo.png";
import { useNavigate } from "react-router-dom";
import GISBackground from "../../components/GISBackground.jsx";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      username: e.target[0].value,
      password: e.target[1].value,
    };

    setLoading(true);

    try {
      const response = await login(payload);

      localStorage.setItem(
        "user",
        JSON.stringify(response)
      );

      router("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      // Try to pull a meaningful message from the API response,
      // otherwise fall back to a generic one.
      const status = error?.response?.status;
      const serverMessage = error?.response?.data?.message;

      if (status === 401 || status === 400) {
        setError(serverMessage || "Incorrect username or password.");
      } else if (!error?.response) {
        setError("Unable to reach the server. Please try again.");
      } else {
        setError(serverMessage || "Something went wrong. Please try again.");
      }

      // Clear password field on failure
      e.target[1].value = "";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
       <GISBackground/>
      

      {/* Login card */}
      <div className="login-content">

        <div className="login-card">

          <div className="logo-wrapper">
            <img src={logo} alt="Logo" />
          </div>

          <h1>Municipal Corporation, Korba</h1>

          <p className="subtitle">
            GIS Based Property Survey
          </p>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                required
                onChange={() => error && setError("")}
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
                onChange={() => error && setError("")}
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

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}