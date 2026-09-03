import api from "../config/axios";
import notify from "../utils/toast";

export const login = async (payload) => {
  const response = await api.post("/auth/login", payload);
  if (response.status !== 200) {
    notify.error("Login failed");
    throw new Error("Login failed");
  } else if (response.data.role === "Surveyor") {
    notify.error("Access denied: Surveyor is not allowed to log in.");
    throw new Error("Access denied: Surveyor is not allowed to log in.");
  }
  notify.success("Login successful");
  return response.data;
};

export const logout = async () => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;
  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }
  const response = await api.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (response.status !== 200) {
    notify.error("Logout failed");
    throw new Error("Logout failed");
  }
  notify.success("Logout successful");
  return response.data;
};

export const fetchCompletedSurveys = async (page = 1) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;
  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }
  const response = await api.post(
    "/web/completed-survey-data-summary",
    { page },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (response.status !== 200) {
    notify.error("Failed to fetch completed surveys");
    throw new Error("Failed to fetch completed surveys");
  }
  return response.data;
};

export const fetchAllSurveys = async (page = 1) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;
  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }
  const response = await api.post(
    "/web/all-survey-data-summary",
    { page },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (response.status !== 200) {
    notify.error("Failed to fetch completed surveys");
    throw new Error("Failed to fetch completed surveys");
  }
  return response.data;
};

export const fetchRejectedPendingSurveys = async (page = 1) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;
  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }
  const response = await api.post(
    "/web/pending-rejected-survey-data-summary",
    { page },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (response.status !== 200) {
    notify.error("Failed to fetch rejected surveys");
    throw new Error("Failed to fetch rejected surveys");
  }
  return response.data;
};

export const fetchSurveyBySurveyID = async (surveyId) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;
  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }
  const payload = { survey_id: surveyId };
  const response = await api.post(`/web/survey-data-by-survey-id`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (response.status !== 200) {
    notify.error("Failed to fetch survey data");
    throw new Error("Failed to fetch survey data");
  }
  return response.data;
};

export const approveSurveyAPI = async (surveyId) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;
  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }
  const payload = { survey_id: surveyId };
  const response = await api.post(`/web/approve-survey`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (response.status !== 200) {
    notify.error("Failed to approve survey");
    throw new Error("Failed to approve survey");
  }
  notify.success("Survey approved successfully");
  return response.data;
};

export const fetchSurveyorsList = async () => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;
  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }
  const response = await api.post(`/auth/surveyor-list`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (response.status !== 200) {
    notify.error("Failed to fetch surveyors list");
    throw new Error("Failed to fetch surveyors list");
  }
  return response.data;
};

export const addSurveyorAPI = async (payload) => {
  otpValidationModal;
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }

  const response = await api.post(`/auth/register`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200 && response.status !== 201) {
    notify.error("Failed to add surveyor");
    throw new Error("Failed to add surveyor");
  }

  return response;
};

// Send OTP to email
export const sendOTP = async (email) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }

  const payload = { email: email };
  const response = await api.post(`/auth/send-otp`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200 && response.status !== 201) {
    notify.error("Failed to send OTP");
    throw new Error("Failed to send OTP");
  }
  return response.data;
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }

  const payload = {
    email: email,
    otp: otp,
  };
  const response = await api.post(`/auth/verify-otp`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    notify.error("Invalid OTP. Please try again.");
    throw new Error("Invalid OTP");
  }
  return response.data;
};

// Update entire survey
export const updateSurvey = async (surveyId, surveyData) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  if (!token) {
    toast.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }

  const response = await api.put(`/web/update/${surveyId}`, surveyData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    toast.error("Failed to update survey");
    throw new Error("Failed to update survey");
  }

  return response.data;
};

export const updateSurveyStatus = async (payload) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  if (!token) {
    notify.error("No token found. Please log in first. ");
    throw new Error("No token first. Please log in first.");
  }

  const response = await api.post(
    "/web/survey-approve-reject-by-surveyid",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (response.status !== 200 && response.status !== 201) {
    notify.error(
      payload.action == "approve"
        ? "Failed to approve survey"
        : "Failed to reject survey",
    );
    throw new Error("Failed to update survey status");
  }

  notify.success(
    payload.action == "approve" ? "survey approved" : "survey rejected",
  );
  return response.data;
};

export const fetchSurveyStatusCounts = async () => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  if (!token) {
    notify.error("No token found. Please log in first");
    throw new Error("No token found. Please log in first");
  }

  const response = await api.post(
    "/web/survey-status-count",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.status !== 200) {
    notify.error("Failed to fetch survey statistics");
    throw new Error("Failed to fetch survey statistics");
  }

  return response.data;
};

// TODO: replace with real API call once TL provides the endpoint
// export const fetchKeyIndicators = async () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         indicators: [
//           {
//             key: "unique_parcels",
//             label: "Land Parcels",
//             value: 181,
//             // subtext: "96.8% of Total Surveys",
//           },
//           {
//             key: "unique_properties",
//             label: "Unique Properties",
//             value: 187,
//             // subtext: "100% of Total Surveys",
//           },
//           {
//             key: "total_plot_area",
//             label: "Total Parcel Area (sq.ft.)",
//             value: 301355,
//             subtext: "100% of Total Parcels",
//           },
//           {
//             key: "total_builtup_area",
//             label: "Total Built-up Area (sq.ft.)",
//             value: 248853,
//             subtext: "82.6% of Plot Area",
//           },
//           {
//             key: "vacant_properties",
//             label: "Vacant Properties",
//             value: 26,
//             subtext: "13.9% of Total Properties",
//           },
//           {
//             key: "new_construction",
//             label: "New Construction",
//             value: 12,
//             subtext: "6.4% of Total Properties",
//           },
//           {
//             key: "additional_floor_constructed",
//             label: "Additional Floor Constructed",
//             value: 15,
//             subtext: "8.0% of Total Properties",
//           },
//         ],
//       });
//     }, 300);
//   });
// };
// export const fetchKeyIndicators = async () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         indicators: [
//           {
//             key: "unique_parcels",
//             label: "Land Parcels",
//             value: 181,
//             // subtext: "96.8% of Total Surveys",
//           },
//           {
//             key: "unique_properties",
//             label: "Unique Properties",
//             value: 187,
//             // subtext: "100% of Total Surveys",
//           },
//           {
//             key: "total_plot_area",
//             label: "Total Parcel Area (sq.ft.)",
//             value: 301355,
//             subtext: "100% of Total Parcels",
//           },
//           {
//             key: "total_builtup_area",
//             label: "Total Built-up Area (sq.ft.)",
//             value: 248853,
//             subtext: "82.6% of Plot Area",
//           },
//           {
//             key: "vacant_properties",
//             label: "Vacant Properties",
//             value: 26,
//             subtext: "13.9% of Total Properties",
//           },
//           {
//             key: "new_construction",
//             label: "New Construction",
//             value: 12,
//             subtext: "6.4% of Total Properties",
//           },
//           {
//             key: "additional_floor_constructed",
//             label: "Additional Floor Constructed",
//             value: 15,
//             subtext: "8.0% of Total Properties",
//           },
//         ],
//       });
//     }, 300);
//   });
// };

export const fetchGeographicOverview = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        locations: [
          { name: "Northfield", lat: 22.755, lng: 75.893, color: "#3b82f6" },
          { name: "Westview", lat: 22.71, lng: 75.82, color: "#16a34a" },
          {
            name: "Central City",
            lat: 22.7196,
            lng: 75.8577,
            color: "#f59e0b",
          },
          { name: "Riverside", lat: 22.725, lng: 75.9, color: "#7a1453" },
          { name: "Southgate", lat: 22.69, lng: 75.845, color: "#dc2626" },
        ],
      });
    }, 300);
  });
};

export const fetchRevenueBreakdown = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        compareLabel: "vs May 5 – May 11, 2024",
        totalCount: 187,
        segments: [
          {
            label: "Zone 1",
            value: 69,
            percent: 36.9,
            color: "#7a1453",
          },
          {
            label: "Zone 2",
            value: 57,
            percent: 30.5,
            color: "#a8306e",
          },
          { label: "Zone 3", value: 38, percent: 20.3, color: "#c96b98" },
          {
            label: "Zone 4",
            value: 23,
            percent: 12.3,
            color: "#e6b8cf",
          },
        ],
      });
    }, 300);
  });
};

export const fetchUsersBreakdown = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total: "18,742",
        changePercent: 8.3,
        changeDirection: "up",
        compareLabel: "vs May 5 – May 11, 2024",
        totalCount: 187,
        segments: [
          { label: "Ward A", value: 80, percent: 42.8, color: "#5c0f3d" },
          { label: "Ward B", value: 52, percent: 27.8, color: "#7a1453" },
          { label: "Ward C", value: 32, percent: 17.1, color: "#a8306e" },
          { label: "Ward D", value: 23, percent: 12.3, color: "#e6b8cf" },
        ],
      });
    }, 300);
  });
};

export const fetchConversionsTrend = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total: 187,
        data: [
          { label: "0–5 Years", value: 28 },
          { label: "6–10 Years", value: 37 },
          { label: "11–20 Years", value: 56 },
          { label: "21–30 Years", value: 38 },
          { label: "30+ Years", value: 28 },
        ],
      });
    }, 300);
  });
};

export const fetchSessionsTrend = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total: 187,
        data: [
          { label: "Water Supply", value: 178 },
          { label: "Electricity", value: 184 },
          { label: "Sewerage", value: 156 },
          { label: "Drainage", value: 142 },
          { label: "Solid Waste", value: 173 },
        ],
      });
    }, 300);
  });
};

export const fetchPropertyBreakdowns = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        charts: [
          {
            key: "property_status",
            title: "Property Status",
            total: 187,
            segments: [
              {
                label: "Occupied",
                value: 144,
                percent: 77.0,
                color: "#7a1453",
              },
              { label: "Vacant", value: 29, percent: 15.5, color: "#a8306e" },
              {
                label: "Under Construction",
                value: 14,
                percent: 7.5,
                color: "#d68fb0",
              },
            ],
          },
          {
            key: "usage_details",
            title: "Usage details",
            total: 187,
            segments: [
              {
                label: "Residential",
                value: 85,
                percent: 45.5,
                color: "#7a1453",
              },
              {
                label: "Commercial",
                value: 52,
                percent: 27.8,
                color: "#a8306e",
              },
              {
                label: "Institutional",
                value: 29,
                percent: 15.5,
                color: "#c96b98",
              },
              {
                label: "Industrial",
                value: 21,
                percent: 11.2,
                color: "#e6b8cf",
              },
            ],
          },
          {
            key: "usage_factor",
            title: "Usage Factor",
            total: 187,
            segments: [
              { label: "High", value: 116, percent: 62.0, color: "#7a1453" },
              { label: "Medium", value: 38, percent: 20.3, color: "#a8306e" },
              { label: "Low", value: 19, percent: 10.2, color: "#c96b98" },
              { label: "Very Low", value: 14, percent: 7.5, color: "#e6b8cf" },
            ],
          },
          {
            key: "construction_type",
            title: "Construction Type",
            total: 187,
            segments: [
              { label: "Pucca", value: 128, percent: 68.4, color: "#7a1453" },
              {
                label: "Semi Pucca",
                value: 40,
                percent: 21.4,
                color: "#a8306e",
              },
              { label: "Kutcha", value: 13, percent: 7.0, color: "#c96b98" },
              { label: "Others", value: 6, percent: 3.2, color: "#e6b8cf" },
            ],
          },
        ],
      });
    }, 300);
  });
};

export const fetchDataCompleteness = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total: 187,
        metrics: [
          { key: "Owner_mobile", label: "Owner Mobile No", completed: 147 },
          { key: "Property_image", label: "Property Image", completed: 117 },
          { key: "geo_tag", label: "Geo-tag Completion", completed: 1 },
          {
            key: "boundary_verification",
            label: "Boundary Verification",
            completed: 0,
          },
        ],
      });
    }, 300);
  });
};

// Dashboard API calls
export const fetchDashboardData = async (
  startDate,
  endDate,
  selectedUids = null,
) => {
 
export const fetchDashboardData = async (
  startDate,
  endDate,
  selectedUids = null,
) => {
 
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const params = new URLSearchParams();
  if (startDate) params.append("start_date", formatDate(startDate));
  if (endDate) params.append("end_date", formatDate(endDate));
  if (selectedUids && selectedUids.length > 0) {
    params.append("property_uids", selectedUids.join(","));
  if (startDate) params.append("start_date", formatDate(startDate));
  if (endDate) params.append("end_date", formatDate(endDate));
  if (selectedUids && selectedUids.length > 0) {
    params.append("property_uids", selectedUids.join(","));
  }

  const url = `/api/dashboard/all${params.toString() ? `?${params.toString()}` : ""}`;

  const response = await api.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status !== 200) {
    notify.error("Failed to fetch dashboard data");
    throw new Error("Failed to fetch dashboard data");
  }

  return response.data;
};

export const fetchKeyIndicators = async (
  startDate,
  endDate
) => {
 
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const params = new URLSearchParams();
  if (startDate) params.append("start_date", formatDate(startDate));
  if (endDate) params.append("end_date", formatDate(endDate));
  // if (selectedUids && selectedUids.length > 0) {
  //   params.append("property_uids", selectedUids.join(","));
  // }

  const url = `/api/dashboard/key-indicators${params.toString() ? `?${params.toString()}` : ""}`;

  const response = await api.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
 console.log("fetchKeyIndicators response:", response);
  if (response.status !== 200) {
    notify.error("Failed to fetch dashboard data");
    throw new Error("Failed to fetch dashboard data");
  }

  return response.data;
};

export const fetchKeyIndicators = async (
  startDate,
  endDate
) => {
 
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const params = new URLSearchParams();
  if (startDate) params.append("start_date", formatDate(startDate));
  if (endDate) params.append("end_date", formatDate(endDate));
  // if (selectedUids && selectedUids.length > 0) {
  //   params.append("property_uids", selectedUids.join(","));
  // }

  const url = `/api/dashboard/key-indicators${params.toString() ? `?${params.toString()}` : ""}`;

  const response = await api.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
 console.log("fetchKeyIndicators response:", response);
  if (response.status !== 200) {
    notify.error("Failed to fetch dashboard data");
    throw new Error("Failed to fetch dashboard data");
  }

  return response.data;
};

export const updateSurveyorAPI = async (surveyorId, payload) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;

  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }

  const response = await api.post(
    `/auth/update-surveyor`, 
    { surveyor_id: surveyorId, ...payload },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status !== 200 && response.status !== 201) {
    notify.error("Failed to update surveyor");
    throw new Error("Failed to update surveyor");
  }

  return response;
};
