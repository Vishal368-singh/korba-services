import {
  FaHome,
  FaClipboardList,
  FaUsers,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ collapsed, setCollapsed }) {
  const menus = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
    },
    {
      name: "Survey Management",
      icon: <FaClipboardList />,
      path: "/survey",
    },
    {
      name: "Surveyor Management",
      icon: <FaUsers />,
      path: "/users",
    },
    // {
    //   name: "Settings",
    //   icon: <FaCog />,
    //   path: "/settings",
    // },
  ];

  return (
    <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <button
        className="collapse-btn"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      <ul>
        {menus.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "menu active" : "menu")}
            >
              <span className="icon">{item.icon}</span>

              {!collapsed && <span className="title">{item.name}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
