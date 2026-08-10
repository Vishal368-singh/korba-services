import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Survey from "../pages/Survey/Survey";
import SurveyPreview from "../pages/SurveyPreview/SurveyPreview";
import SurveyorsManagement from "../pages/User/SurveyorsManagement";
// import NotFound from "../pages/NotFound/NotFound";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Login Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
      </Route>

      {/* Protected Pages */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/users" element={<SurveyorsManagement />} />
        <Route
    path="/surveys/:surveyId"
    element={<SurveyPreview />}
/>
      </Route>

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}