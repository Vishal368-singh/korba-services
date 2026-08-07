import { useState, useRef, useEffect } from "react";
import { FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";
import { logout } from "../services/api";

export default function Navbar( { collapsed, setCollapsed } ) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  const navigate = useNavigate();

  const handlelogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>

        <img src={logo} alt="logo" className="logo" />

        <div>
          <h2>Property Survey</h2>
          <span>Korba Nagar Nigam</span>
        </div>
      </div>

      <div className="navbar-right" ref={menuRef}>
        <FaUserCircle
          className="profile-icon"
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div className="profile-dropdown">

            {/* <div className="profile-header">
              <strong>Vishal Singh</strong>
              <small>Administrator</small>
            </div> */}

            <button
              className="dropdown-item logout"
              onClick={handlelogout}
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>
        )}
      </div>
    </header>
  );
}