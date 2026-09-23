import { useState } from "react";
import "./Login.css";

import { login, forceLogOut } from "../../services/api";
import logo from "../../assets/Korbalogo.png";
import { useNavigate } from "react-router-dom";
import GISBackground from "../../components/GISBackground.jsx";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForceLogoutDialog, setShowForceLogoutDialog] = useState(false);
  const [pendingLogin, setPendingLogin] = useState(null);

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
        // Store credentials temporarily for force logout
        setPendingLogin({
          username,
          password,
        });

        // Open custom dialog
        setShowForceLogoutDialog(true);

        setLoading(false);
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

  const handleForceLogout = async () => {
    if (!pendingLogin) return;

    const { username, password } = pendingLogin;

    setLoading(true);
    setError("");

    try {
      // =========================
      // FORCE LOGOUT OLD SESSION
      // =========================
      await forceLogOut(username);

      // =========================
      // LOGIN AGAIN
      // =========================
      const newResponse = await login({
        username,
        password,
      });

      console.log("LOGIN AFTER FORCE LOGOUT:", newResponse);

      localStorage.setItem("user", JSON.stringify(newResponse));

      // Close dialog
      setShowForceLogoutDialog(false);
      setPendingLogin(null);

      // Redirect
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
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForceLogoutDialog = () => {
    setShowForceLogoutDialog(false);
    setPendingLogin(null);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   const username = e.target[0].value;
  //   const password = e.target[1].value;

  //   setLoading(true);

  //   try {
  //     // =========================
  //     // FIRST LOGIN ATTEMPT
  //     // =========================
  //     const response = await login({
  //       username,
  //       password,
  //     });

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

  //     const status = error?.response?.status;

  //     // ==========================================
  //     // USER ALREADY LOGGED IN
  //     // ==========================================
  //     if (status === 409) {
  //       const confirmForceLogout = window.confirm(
  //         "This user is already logged in on another window or browser.\n\n" +
  //           "Do you want to force logout the existing session?",
  //       );

  //       // =========================
  //       // USER CLICKED NO
  //       // =========================
  //       if (!confirmForceLogout) {
  //         setLoading(false);
  //         return;
  //       }

  //       // =========================
  //       // USER CLICKED YES
  //       // =========================
  //       try {
  //         await forceLogOut(username);

  //         // =========================
  //         // OLD SESSION CLEARED
  //         // NOW LOGIN AGAIN
  //         // =========================

  //         const newResponse = await login({
  //           username,
  //           password,
  //         });

  //         console.log("LOGIN AFTER FORCE LOGOUT:", newResponse);

  //         localStorage.setItem("user", JSON.stringify(newResponse));

  //         if (newResponse?.role === "supervisor") {
  //           router("/edit");
  //         } else {
  //           router("/dashboard");
  //         }
  //       } catch (forceError) {
  //         console.error("Force logout failed:", forceError);

  //         const forceMessage =
  //           forceError?.response?.data?.detail ||
  //           forceError?.response?.data?.message ||
  //           "Unable to force logout the existing session.";

  //         setError(forceMessage);
  //       }

  //       return;
  //     }

  //     // ==========================================
  //     // OTHER LOGIN ERRORS
  //     // ==========================================

  //     const serverMessage =
  //       error?.response?.data?.detail || error?.response?.data?.message;

  //     if (status === 401 || status === 400) {
  //       setError(serverMessage || "Incorrect username or password.");
  //     } else if (!error?.response) {
  //       setError("Unable to reach the server. Please try again.");
  //     } else {
  //       setError(serverMessage || "Something went wrong. Please try again.");
  //     }

  //     // Clear password
  //     e.target[1].value = "";
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <div className="login-page w-full">
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
        <Dialog
          open={showForceLogoutDialog}
          onClose={loading ? undefined : handleCloseForceLogoutDialog}
          maxWidth="sm"
          fullWidth
        >
          {/* Header */}
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: 600,
              fontSize: "20px",
            }}
          >
            User Already Logged In
            <IconButton
              onClick={handleCloseForceLogoutDialog}
              disabled={loading}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          {/* Message */}
          <DialogContent>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1 , fontSize: "18px"}}
            >
              This user is already logged in on another window or browser.
              <br />
              <br />
              Do you want to force logout the existing session and continue
              logging in?
            </Typography>
          </DialogContent>

          {/* Buttons */}
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseForceLogoutDialog}
              disabled={loading}
              sx={{
                textTransform: "none",
                cursor: "pointer",
              }}
            >
              Close
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleForceLogout}
              disabled={loading}
              sx={{
                textTransform: "none",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Processing..." : "Force Logout"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
