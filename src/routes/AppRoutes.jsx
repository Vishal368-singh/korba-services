// import { Routes, Route } from "react-router-dom";

// import MainLayout from "../layouts/MainLayout";
// import AuthLayout from "../layouts/AuthLayout";

// import Login from "../pages/Login/Login";
// import Dashboard from "../pages/Dashboard/Dashboard";
// import Survey from "../pages/Survey/Survey";
// import SurveyPreview from "../pages/SurveyPreview/SurveyPreview";
// import SurveyorsManagement from "../pages/User/SurveyorsManagement";
// import Editmanagement from "../pages/Ediitab/Editmanagement";
// // import NotFound from "../pages/NotFound/NotFound";

// export default function AppRoutes() {
//   const user = JSON.parse(localStorage.getItem("user"));

//   console.log(user);
//   console.log(user?.role);
//   return (
//     <Routes>
//       {/* Login Pages */}
//       <Route element={<AuthLayout />}>
//         <Route path="/" element={<Login />} />
//         <Route path="/login" element={<Login />} />
//       </Route>

//       {/* Protected Pages */}
//       <Route element={<MainLayout />}>
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/survey" element={<Survey />} />
//         <Route path="/users" element={<SurveyorsManagement />} />
//         <Route path="/surveys/:surveyId" element={<SurveyPreview />} />
//         <Route path="/edit" element={<Editmanagement />} />
//       </Route>

//       {/* <Route path="*" element={<NotFound />} /> */}
//     </Routes>
//   );
// }
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Survey from "../pages/Survey/Survey";
import SurveyPreview from "../pages/SurveyPreview/SurveyPreview";
import SurveyorsManagement from "../pages/User/SurveyorsManagement";
import Editmanagement from "../pages/Ediitab/Editmanagement";

// ================= ROLE CONFIG =================
const COMMON_ROLES = ["officier", "MLAdmin", "supervisor"];
const SUPERVISOR_ROLES = ["supervisor"];

// ================= PROTECTED ROUTE =================
function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "supervisor" ? "/edit" : "/dashboard"}
        replace
      />
    );
  }

  return children;
}

// ================= APP ROUTES =================
export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= LOGIN ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ================= PROTECTED ================= */}
      <Route element={<MainLayout />}>
        {/* ===== COMMON: Officer, MLAdmin, Admin ===== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={COMMON_ROLES}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/survey"
          element={
            <ProtectedRoute allowedRoles={COMMON_ROLES}>
              <Survey />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={COMMON_ROLES}>
              <SurveyorsManagement />
            </ProtectedRoute>
          }
        />

        {/* ===== SUPERVISOR ONLY ===== */}

        <Route
          path="/edit"
          element={
            <ProtectedRoute
              allowedRoles={[...SUPERVISOR_ROLES, ...COMMON_ROLES]}
            >
              <Editmanagement />
            </ProtectedRoute>
          }
        />
        <Route path="/surveys/:surveyId" element={<SurveyPreview />} />
      </Route>

      {/* ================= UNKNOWN ROUTE ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
