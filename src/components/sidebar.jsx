import {
  FaClipboardList,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
} from "react-icons/fa";
import { LuChartNetwork } from "react-icons/lu";

import { NavLink } from "react-router-dom";
import "./Sidebar.css";

// export default function Sidebar({ collapsed, setCollapsed }) {
// const user = { role: "manager" };
// const canEditSurvey = user?.role === "manager" || user?.role === "admin";

//   const menus = [
//     {
//       name: "Dashboard",
//       icon: <LuChartNetwork />,
//       path: "/dashboard",
//     },
//     {
//       name: "Survey Management",
//       icon: <FaClipboardList />,
//       path: "/survey",
//     },
//     {
//       name: "Surveyor Management",
//       icon: <FaUsers />,
//       path: "/users",
//     },

//     // Only manager can see this menu
//     ...(canEditSurvey
//       ? [
//           {
//             name: "Edit Survey",
//             icon: <FaEdit />,
//             path: "/edit",
//           },
//         ]
//       : []),
//   ];

//   return (
//     <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>
//       <button
//         className="collapse-btn"
//         onClick={() => setCollapsed((prev) => !prev)}
//       >
//         {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
//       </button>

//       <ul>
//         {menus.map((item) => (
//           <li key={item.path}>
//             <NavLink
//               to={item.path}
//               className={({ isActive }) => (isActive ? "menu active" : "menu")}
//             >
//               {({ isActive }) => (
//                 <>
//                   <span
//                     className={`icon ${
//                       item.name === "Dashboard" ? "dashboard-svg-icon" : ""
//                     } ${isActive ? "active-icon" : ""}`}
//                   >
//                     {item.icon}
//                   </span>

//                   {!collapsed && <span className="title">{item.name}</span>}
//                 </>
//               )}
//             </NavLink>
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// }
// import {
//   FaClipboardList,
//   FaUsers,
//   FaChevronLeft,
//   FaChevronRight,
//   FaEdit,
// } from "react-icons/fa";
// import { LuChartNetwork } from "react-icons/lu";

// import { NavLink } from "react-router-dom";
// import "./Sidebar.css";
// import { use } from "react";

// export default function Sidebar({ collapsed, setCollapsed }) {
//   // Hardcoded for now - change to "admin" or "manager" to test
//   // Replace later with the real user from your auth/context
//   const user = JSON.parse(localStorage.getItem("user"));
//   // console.log("user", user);

//   const allMenus = [
//     {
//       name: "Dashboard",
//       icon: <LuChartNetwork />,
//       path: "/dashboard",
//       roles: ["admin"],
//     },
//     {
//       name: "Survey Management",
//       icon: <FaClipboardList />,
//       path: "/survey",
//       roles: ["admin"],
//     },
//     {
//       name: "Surveyor Management",
//       icon: <FaUsers />,
//       path: "/users",
//       roles: ["admin"],
//     },
//     {
//       name: "Edit Survey",
//       icon: <FaEdit />,
//       path: "/edit",
//       roles: ["admin", "manager"],
//     },
//   ];

//   // Show only the tabs allowed for the current role
//   const menus = allMenus.filter((item) => item.roles.includes(user?.role));

//   return (
//     <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>
//       <button
//         className="collapse-btn"
//         onClick={() => setCollapsed((prev) => !prev)}
//       >
//         {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
//       </button>

//       <ul>
//         {menus.map((item) => (
//           <li key={item.path}>
//             <NavLink
//               to={item.path}
//               className={({ isActive }) => (isActive ? "menu active" : "menu")}
//             >
//               {({ isActive }) => (
//                 <>
//                   <span
//                     className={`icon ${
//                       item.name === "Dashboard" ? "dashboard-svg-icon" : ""
//                     } ${isActive ? "active-icon" : ""}`}
//                   >
//                     {item.icon}
//                   </span>

//                   {!collapsed && <span className="title">{item.name}</span>}
//                 </>
//               )}
//             </NavLink>
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// }
export default function Sidebar({ collapsed, setCollapsed }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const allMenus = [
    {
      name: "Dashboard",
      icon: <LuChartNetwork />,
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
    {
      name: "Edit Survey",
      icon: <FaEdit />,
      path: "/edit",
    },
  ];

  // Only surveyor is restricted
  const menus =
    user?.role === "MLAdmin"
      ? allMenus.filter((item) => item.path === "/edit")
      : allMenus;

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
              {({ isActive }) => (
                <>
                  <span
                    className={`icon ${
                      item.name === "Dashboard" ? "dashboard-svg-icon" : ""
                    } ${isActive ? "active-icon" : ""}`}
                  >
                    {item.icon}
                  </span>

                  {!collapsed && <span className="title">{item.name}</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
