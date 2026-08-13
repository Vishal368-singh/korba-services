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

export const fetchCompletedSurveys = async () => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;
  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }
  const response = await api.post(
    "/survey/completed-survey-data-summary",
    {},
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

export const fetchAllSurveys = async () => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;
  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }
  const response = await api.post(
    "/survey/all-survey-data-summary",
    {},
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

export const fetchRejectedPendingSurveys = async () => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).access_token
    : null;
  if (!token) {
    notify.error("No token found. Please log in first.");
    throw new Error("No token found. Please log in first.");
  }
  const response = await api.post(
    "/survey/pending-rejected-survey-data-summary",
    {},
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
  const response = await api.post(`/survey/survey-data-by-survey-id`, payload, {
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
  const response = await api.post(`/survey/approve-survey`, payload, {
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
  otpValidationModal
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
    otp: otp 
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

  const response = await api.put(`/survey/update/${surveyId}`, surveyData, {
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
    "/survey/survey-approve-reject-by-surveyid",
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
    "/survey/survey-status-count",
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
