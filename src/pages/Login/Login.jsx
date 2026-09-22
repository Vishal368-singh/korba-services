import { useState } from "react";
import "./Login.css";

import { login,forceLogOut } from "../../services/api";
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

    const username = e.target[0].value;
    const password = e.target[1].value;

    setLoading(true);

    try {
      // =========================
      // FIRST LOGIN ATTEMPT
      // =========================
      const response = await login({
        username,
        password,
      });

      console.log("LOGIN RESPONSE:", response);
      console.log("ROLE:", response?.role);

      localStorage.setItem("user", JSON.stringify(response));

      if (response?.role === "supervisor") {
        router("/edit");
      } else {
        router("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);

      const status = error?.response?.status;

      // ==========================================
      // USER ALREADY LOGGED IN
      // ==========================================
      if (status === 409) {
        const confirmForceLogout = window.confirm(
          "This user is already logged in on another window or browser.\n\n" +
            "Do you want to force logout the existing session?",
        );

        // =========================
        // USER CLICKED NO
        // =========================
        if (!confirmForceLogout) {
          setLoading(false);
          return;
        }

        // =========================
        // USER CLICKED YES
        // =========================
        try {
          await forceLogOut(username);

          // =========================
          // OLD SESSION CLEARED
          // NOW LOGIN AGAIN
          // =========================

          const newResponse = await login({
            username,
            password,
          });

          console.log("LOGIN AFTER FORCE LOGOUT:", newResponse);

          localStorage.setItem("user", JSON.stringify(newResponse));

          if (newResponse?.role === "supervisor") {
            router("/edit");
          } else {
            router("/dashboard");
          }
        } catch (forceError) {
          console.error("Force logout failed:", forceError);

          const forceMessage =
            forceError?.response?.data?.detail ||
            forceError?.response?.data?.message ||
            "Unable to force logout the existing session.";

          setError(forceMessage);
        }

        return;
      }

      // ==========================================
      // OTHER LOGIN ERRORS
      // ==========================================

      const serverMessage =
        error?.response?.data?.detail || error?.response?.data?.message;

      if (status === 401 || status === 400) {
        setError(serverMessage || "Incorrect username or password.");
      } else if (!error?.response) {
        setError("Unable to reach the server. Please try again.");
      } else {
        setError(serverMessage || "Something went wrong. Please try again.");
      }

      // Clear password
      e.target[1].value = "";
    } finally {
      setLoading(false);
    }
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   const payload = {
  //     username: e.target[0].value,
  //     password: e.target[1].value,
  //   };

  //   setLoading(true);

  //   try {
  //     const response = await login(payload);
  //     console.log("LOGIN RESPONSE:", response);
  //     console.log("ROLE:", response?.role);

  //     localStorage.setItem("user", JSON.stringify(response));

  //     if (response?.role === "supervisor") {
  //       router("/edit");
  //     } else {
  //       router("/dashboard");
  //     }
  //   } catch (error) {
  //     console.error("Login failed:", error);

  //     // Try to pull a meaningful message from the API response,
  //     // otherwise fall back to a generic one.
  //     const status = error?.response?.status;
  //     const serverMessage = error?.response?.data?.message;

  //     if (status === 401 || status === 400) {
  //       setError(serverMessage || "Incorrect username or password.");
  //     } else if (!error?.response) {
  //       setError("Unable to reach the server. Please try again.");
  //     } else {
  //       setError(serverMessage || "Something went wrong. Please try again.");
  //     }

  //     // Clear password field on failure
  //     e.target[1].value = "";
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="login-page">
      <GISBackground />

      {/* Login card */}
      <div className="login-content">
        <div className="login-card">
          <div className="logo-wrapper">
            <img src={logo} alt="Logo" />
          </div>

          <h1>Municipal Corporation, Korba</h1>

          <p className="subtitle">GIS Based Property Survey</p>

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
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                onChange={() => error && setError("")}
              />

              <button
                type="button"
                className="show-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
