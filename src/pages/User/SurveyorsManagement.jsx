import React, { useState, useEffect, useRef } from "react";
import "./SurveyorsManagement.css";
import notify from "../../utils/toast";
import {
  addSurveyorAPI,
  updateSurveyorAPI, // <-- NEW: add this to services/api.js (see note below)
  fetchSurveyorsList,
  getLocationOptions,
} from "../../services/api";
import OTPModal from "./OtpModal/OTPModal";

import SearchableMultiSelect from "../../components/SearchableMultiSelect";

const transliterateText = async (text) => {
  if (!text || !text.trim()) return "";

  try {
    const response = await fetch(
      `https://inputtools.google.com/request?text=${encodeURIComponent(
        text,
      )}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8`,
    );

    const data = await response.json();

    if (
      Array.isArray(data) &&
      data[0] === "SUCCESS" &&
      Array.isArray(data[1]) &&
      data[1][0] &&
      Array.isArray(data[1][0][1]) &&
      data[1][0][1][0]
    ) {
      return data[1][0][1][0];
    }

    return "";
  } catch (error) {
    console.error("Google transliteration failed:", error);
    return "";
  }
};

function SurveyorsManagement() {
  // =========================================================
  // STATE
  // =========================================================

  const [surveyors, setSurveyors] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    surveyor_name: "",
    surveyor_name_hindi: "",
    role: "Surveyor",
    email: "",
    mobile: "",
    zone: "",
    zone_hindi: "",
    ward: "",
    ward_hindi: "",
    target: "",
  });

  const [errors, setErrors] = useState({});

  // NEW: tracks which surveyor is currently being edited (surveyor_id), or null when adding
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // =========================================================
  // LOCATION DATA
  // =========================================================

  const [locationOptions, setLocationOptions] = useState([]);

  // =========================================================
  // OTP MODAL
  // =========================================================

  const [otpValidationModal, setOtpValidationModal] = useState(false);
  const [emailForOTP, setEmailForOTP] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // =========================================================
  // TRANSLITERATION DEBOUNCE
  // =========================================================

  const nameDebounceRef = useRef(null);
  const latestNameRequestId = useRef(0);

  // =========================================================
  // LOAD LOCATION OPTIONS
  // =========================================================

  useEffect(() => {
    const loadLocationOptions = async () => {
      try {
        const data = await getLocationOptions();

        const locations = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        setLocationOptions(locations);
      } catch (error) {
        console.error("Failed to load location options:", error);
        setLocationOptions([]);
      }
    };

    loadLocationOptions();
  }, []);

  // =========================================================
  // LOAD SURVEYORS
  // =========================================================

  useEffect(() => {
    loadSurveyors();
  }, []);

  const loadSurveyors = async () => {
    try {
      const response = await fetchSurveyorsList();

      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];

      const mappedData = data.map((item) => ({
        id: item.surveyor_id,
        username: item.username || "",
        surveyor_name: item.surveyor_name || "",
        surveyor_name_hindi: item.surveyor_name_hindi || "",
        role: item.role || "Surveyor",
        surveyor_id: item.surveyor_id || "",
        email: item.email || "",
        mobile: item.mobile || "",
        zone: item.zone || "",
        zone_hindi: item.zone_hindi || "",
        ward: item.ward || "",
        ward_hindi: item.ward_hindi || "",
        target: item.target || "",
        status:
          String(item.status || "").toLowerCase() === "active"
            ? "Validated"
            : "Pending",
        createdAt: item.created_at || new Date().toISOString(),
      }));

      setSurveyors(mappedData);
      setFiltered(mappedData);
    } catch (error) {
      console.error("Failed to load surveyors:", error);
    }
  };

  // =========================================================
  // LOCATION HELPERS
  // =========================================================

  const parseSelectedValues = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value;
    }

    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const stringifySelectedValues = (values) => {
    if (!Array.isArray(values)) return "";

    return values
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join(",");
  };

  const getSelectedZones = () => {
    const selectedZoneEnglish = parseSelectedValues(formData.zone);
    const selectedZoneHindi = parseSelectedValues(formData.zone_hindi);

    return locationOptions.filter(
      (item) =>
        selectedZoneEnglish.includes(item?.zone?.en) ||
        selectedZoneHindi.includes(item?.zone?.hi),
    );
  };

  const getAvailableWards = () => {
    const selectedZones = getSelectedZones();

    const wardMap = new Map();

    selectedZones.forEach((zoneItem) => {
      (zoneItem?.wards || []).forEach((ward) => {
        if (ward?.en) {
          wardMap.set(ward.en, ward);
        }
      });
    });

    return Array.from(wardMap.values());
  };

  // =========================================================
  // ZONE ENGLISH CHANGE
  // =========================================================

  const handleZoneEnglishChange = (selectedValues) => {
    const values = Array.isArray(selectedValues) ? selectedValues : [];

    const selectedZones = locationOptions.filter((item) =>
      values.includes(item?.zone?.en),
    );

    const hindiValues = selectedZones
      .map((item) => item?.zone?.hi)
      .filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      zone: stringifySelectedValues(values),
      zone_hindi: stringifySelectedValues(hindiValues),
      ward: "",
      ward_hindi: "",
    }));

    setErrors((prev) => ({
      ...prev,
      zone: "",
      zone_hindi: "",
      ward: "",
      ward_hindi: "",
    }));
  };

  // =========================================================
  // ZONE HINDI CHANGE
  // =========================================================

  const handleZoneHindiChange = (selectedValues) => {
    const values = Array.isArray(selectedValues) ? selectedValues : [];

    const selectedZones = locationOptions.filter((item) =>
      values.includes(item?.zone?.hi),
    );

    const englishValues = selectedZones
      .map((item) => item?.zone?.en)
      .filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      zone: stringifySelectedValues(englishValues),
      zone_hindi: stringifySelectedValues(values),
      ward: "",
      ward_hindi: "",
    }));

    setErrors((prev) => ({
      ...prev,
      zone: "",
      zone_hindi: "",
      ward: "",
      ward_hindi: "",
    }));
  };

  // =========================================================
  // WARD ENGLISH CHANGE
  // =========================================================

  const handleWardEnglishChange = (selectedValues) => {
    const values = Array.isArray(selectedValues) ? selectedValues : [];

    const availableWards = getAvailableWards();

    const selectedWards = availableWards.filter((ward) =>
      values.includes(ward?.en),
    );

    const hindiValues = selectedWards.map((ward) => ward?.hi).filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      ward: stringifySelectedValues(values),
      ward_hindi: stringifySelectedValues(hindiValues),
    }));

    setErrors((prev) => ({
      ...prev,
      ward: "",
      ward_hindi: "",
    }));
  };

  // =========================================================
  // WARD HINDI CHANGE
  // =========================================================

  const handleWardHindiChange = (selectedValues) => {
    const values = Array.isArray(selectedValues) ? selectedValues : [];

    const availableWards = getAvailableWards();

    const selectedWards = availableWards.filter((ward) =>
      values.includes(ward?.hi),
    );

    const englishValues = selectedWards.map((ward) => ward?.en).filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      ward: stringifySelectedValues(englishValues),
      ward_hindi: stringifySelectedValues(values),
    }));

    setErrors((prev) => ({
      ...prev,
      ward: "",
      ward_hindi: "",
    }));
  };

  // =========================================================
  // NAME AUTO-TRANSLITERATION
  // English -> Hindi only using Google Input Tools.
  // =========================================================

  const scheduleNameToHindi = (englishValue) => {
    if (nameDebounceRef.current) {
      clearTimeout(nameDebounceRef.current);
    }

    nameDebounceRef.current = setTimeout(async () => {
      const requestId = ++latestNameRequestId.current;

      const hindiResult = await transliterateText(englishValue);

      // Ignore stale responses if user has typed something newer.
      if (requestId !== latestNameRequestId.current) {
        return;
      }

      setFormData((prev) => ({
        ...prev,
        surveyor_name_hindi: hindiResult,
      }));
    }, 400);
  };

  // =========================================================
  // FORM HANDLER
  // =========================================================

  const handleChange = (e) => {
    const { id, value } = e.target;

    let sanitizedValue = value;

    if (id === "mobile") {
      sanitizedValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [id]: sanitizedValue,
    }));

    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }

    // =======================================================
    // GOOGLE ENGLISH -> HINDI ONLY
    // =======================================================

    if (id === "surveyor_name") {
      if (sanitizedValue.trim()) {
        scheduleNameToHindi(sanitizedValue);
      } else {
        if (nameDebounceRef.current) {
          clearTimeout(nameDebounceRef.current);
        }

        // Invalidate any previous Google response.
        ++latestNameRequestId.current;

        setFormData((prev) => ({
          ...prev,
          surveyor_name_hindi: "",
        }));
      }
    }
  };

  // =========================================================
  // CLEANUP DEBOUNCE TIMER ON UNMOUNT
  // =========================================================

  useEffect(() => {
    return () => {
      if (nameDebounceRef.current) {
        clearTimeout(nameDebounceRef.current);
      }
    };
  }, []);

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    const requiredFields = [
      { key: "username", label: "Username" },
      // Password not required while editing an existing surveyor
      ...(editingId ? [] : [{ key: "password", label: "Password" }]),
      { key: "surveyor_name", label: "Surveyor Name (EN)" },
      { key: "surveyor_name_hindi", label: "Surveyor Name (HI)" },
      { key: "role", label: "Role" },
      { key: "email", label: "Email" },
      { key: "mobile", label: "Mobile" },
      { key: "zone", label: "Zone (EN)" },
      { key: "zone_hindi", label: "Zone (HI)" },
      { key: "ward", label: "Ward (EN)" },
      { key: "ward_hindi", label: "Ward (HI)" },
      { key: "target", label: "No. of Parcels" },
    ];

    const newErrors = {};
    let isValid = true;

    for (const field of requiredFields) {
      const value = formData[field.key];

      if (!value || String(value).trim() === "") {
        newErrors[field.key] = `${field.label} is required`;
        isValid = false;
      }
    }

    if (formData.email && formData.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(formData.email)) {
        newErrors.email =
          "Please enter a valid email address (e.g., name@domain.com)";
        isValid = false;
      }
    }

    if (formData.mobile && formData.mobile.trim() !== "") {
      if (!/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = "Mobile number must be exactly 10 digits";
        isValid = false;
      }
    }

    setErrors(newErrors);

    return {
      isValid,
      errors: newErrors,
    };
  };

  // =========================================================
  // ADD / UPDATE SURVEYOR
  // =========================================================

  const addSurveyor = async (payload) => {
    try {
      const apiPayload = {
        username: payload.username,
        password: payload.password,
        surveyor_name: payload.surveyor_name,
        surveyor_name_hindi: payload.surveyor_name_hindi || "",
        role: payload.role,
        email: payload.email || "",
        mobile: payload.mobile,
        zone: payload.zone,
        zone_hindi: payload.zone_hindi || "",
        ward: payload.ward,
        ward_hindi: payload.ward_hindi || "",
        target: payload.target || "",
      };

      let response;

      if (editingId) {
        // NEW: update branch — calls updateSurveyorAPI instead of addSurveyorAPI
        response = await updateSurveyorAPI(editingId, apiPayload);
      } else {
        response = await addSurveyorAPI(apiPayload);
      }

      let data = {};

      if (response && response.data) {
        data = response.data;
      }

      if (data.message) {
        notify.info(data.message);
        handleSetFormDataInitial();
        setEditingId(null);
        return;
      }

      notify.success(
        editingId
          ? `Surveyor "${apiPayload.surveyor_name}" updated successfully!`
          : `Surveyor "${apiPayload.surveyor_name}" added successfully!`,
      );

      await loadSurveyors();

      setErrors({});
      setEditingId(null);
      handleSetFormDataInitial();
    } catch (error) {
      console.error("Error saving surveyor:", error);

      notify.error(
        error.message ||
          (editingId
            ? "Failed to update surveyor. Please try again."
            : "Failed to add surveyor. Please try again."),
      );
    }
  };

  // =========================================================
  // EDIT SURVEYOR (NEW)
  // =========================================================

  const handleEditClick = (surveyor) => {
    if (nameDebounceRef.current) {
      clearTimeout(nameDebounceRef.current);
    }

    // Invalidate any pending Google transliteration request so it
    // doesn't overwrite the Hindi name we're about to set from data.
    ++latestNameRequestId.current;

    setFormData({
      username: surveyor.username || "",
      password: "", // don't prefill password
      surveyor_name: surveyor.surveyor_name || "",
      surveyor_name_hindi: surveyor.surveyor_name_hindi || "",
      role: surveyor.role || "Surveyor",
      email: surveyor.email || "",
      mobile: surveyor.mobile || "",
      zone: surveyor.zone || "",
      zone_hindi: surveyor.zone_hindi || "",
      ward: surveyor.ward || "",
      ward_hindi: surveyor.ward_hindi || "",
      target: surveyor.target || "",
    });

    setEditingId(surveyor.surveyor_id);
    setErrors({});

    document.querySelector(".card")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    handleSetFormDataInitial();
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const handleSetFormDataInitial = () => {
    if (nameDebounceRef.current) {
      clearTimeout(nameDebounceRef.current);
    }

    ++latestNameRequestId.current;

    setFormData({
      username: "",
      password: "",
      surveyor_name: "",
      surveyor_name_hindi: "",
      role: "Surveyor",
      email: "",
      mobile: "",
      zone: "",
      zone_hindi: "",
      ward: "",
      ward_hindi: "",
      target: "",
    });

    setErrors({});
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm();

    if (!validation.isValid) {
      const firstErrorKey = Object.keys(validation.errors)[0];

      if (firstErrorKey) {
        const element = document.getElementById(firstErrorKey);

        if (element) {
          element.focus();
        }
      }

      return;
    }

    await addSurveyor(formData);
  };

  // =========================================================
  // OTP VALIDATION
  // =========================================================

  const handleValidationOTP = async (email) => {
    try {
      const loadingId = notify.loading("Sending OTP...");

      notify.dismiss(loadingId);

      notify.success(`OTP sent to ${email}`);

      setOtpValidationModal(true);
      setEmailForOTP(email);
    } catch (error) {
      console.error("Error sending OTP:", error);

      notify.error(error.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerify = async (otpValue) => {
    try {
      const loadingId = notify.loading("Verifying OTP...");

      if (otpValue !== "123456") {
        notify.dismiss(loadingId);

        notify.error("Invalid OTP, enter the correct OTP.");

        return;
      }

      notify.dismiss(loadingId);

      setOtpValidationModal(false);

      notify.success("OTP verified successfully!");

      await loadSurveyors();

      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      console.error("Error verifying OTP:", error);

      notify.error(error.message || "Invalid OTP. Please try again.");
    }
  };

  // =========================================================
  // FILTERING
  // =========================================================

  useEffect(() => {
    let result = [...surveyors];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();

      result = result.filter((s) => {
        const surveyorName = String(s.surveyor_name || "").toLowerCase();
        const surveyorId = String(s.surveyor_id || "").toLowerCase();
        const email = String(s.email || "").toLowerCase();
        const mobile = String(s.mobile || "").toLowerCase();
        const username = String(s.username || "").toLowerCase();

        return (
          surveyorName.includes(term) ||
          surveyorId.includes(term) ||
          email.includes(term) ||
          mobile.includes(term) ||
          username.includes(term)
        );
      });
    }

    if (statusFilter) {
      result = result.filter(
        (s) => String(s.status || "").toLowerCase() === statusFilter,
      );
    }

    if (zoneFilter) {
      result = result.filter((s) => {
        const zones = parseSelectedValues(s.zone);

        return zones.includes(zoneFilter);
      });
    }

    if (dateFilter.trim()) {
      const filterDate = dateFilter.trim();

      result = result.filter((s) => {
        const d = new Date(s.createdAt);

        if (Number.isNaN(d.getTime())) {
          return false;
        }

        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        const formatted = `${day}-${month}-${year}`;

        return formatted.includes(filterDate);
      });
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [surveyors, searchTerm, statusFilter, zoneFilter, dateFilter]);

  // =========================================================
  // STATS
  // =========================================================

  const total = surveyors.length;

  const pending = surveyors.filter(
    (s) => String(s.status || "").toLowerCase() === "pending",
  ).length;

  const validated = surveyors.filter(
    (s) => String(s.status || "").toLowerCase() === "validated",
  ).length;

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const startIndex = (safePage - 1) * itemsPerPage;

  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  // =========================================================
  // RENDER TABLE ROWS
  // =========================================================

  const renderTableRows = () => {
    if (filtered.length === 0) {
      return (
        <tr>
          <td colSpan="12">
            <div className="empty-state">
              <i className="fas fa-user-slash"></i>
              <p>No surveyors found. Add one using the form above!</p>
            </div>
          </td>
        </tr>
      );
    }

    return paginatedData.map((s, idx) => {
      const isActive = String(s.status || "").toLowerCase() === "validated";

      let statusBadge;

      if (isActive) {
        statusBadge = (
          <span className="badge badge-validated">
            <i className="fas fa-check-circle"></i> Validated
          </span>
        );
      } else {
        statusBadge = (
          <span className="badge badge-pending">
            <i className="fas fa-clock"></i> Pending
          </span>
        );
      }

      return (
        <tr key={s.id || idx}>
          <td>{startIndex + idx + 1}</td>

          <td>
            <strong>{s.surveyor_id}</strong>
          </td>

          <td>{s.username}</td>

          <td>{s.surveyor_name}</td>

          <td>{s.surveyor_name_hindi || "—"}</td>

          <td>
            <span className="role-pill">{s.role || "Surveyor"}</span>
          </td>

          <td>{s.email || "—"}</td>

          <td>{s.mobile || "—"}</td>

          <td>{s.zone || "—"}</td>

          <td>{s.ward || "—"}</td>

          <td>{statusBadge}</td>

          <td>
            <div className="action-icons">
              {/* NEW: Edit button */}
              <button
                className="edit-btn"
                onClick={() => handleEditClick(s)}
                title="Edit"
              >
                <i className="fas fa-pen"></i>
              </button>

              {!isActive && (
                <button
                  className="approve-btn"
                  onClick={() => handleValidationOTP(s.email)}
                  title="Validate"
                >
                  <i className="fas fa-check-circle"></i>
                </button>
              )}

              {isActive && (
                <button
                  className="reject-btn"
                  onClick={() => {}}
                  title="Invalidate"
                >
                  <i className="fas fa-times-circle"></i>
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    });
  };

  // =========================================================
  // SELECT OPTIONS
  // =========================================================

  const zoneEnglishOptions = locationOptions
    .map((item) => item?.zone?.en)
    .filter(Boolean);

  const zoneHindiOptions = locationOptions
    .map((item) => item?.zone?.hi)
    .filter(Boolean);

  const availableWards = getAvailableWards();

  const wardEnglishOptions = availableWards
    .map((ward) => ward?.en)
    .filter(Boolean);

  const wardHindiOptions = availableWards
    .map((ward) => ward?.hi)
    .filter(Boolean);

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="app-container">
      <OTPModal
        open={otpValidationModal}
        onClose={() => setOtpValidationModal(false)}
        onVerify={handleVerify}
        email={emailForOTP}
        otp={otp}
        setOtp={setOtp}
      />

      <header className="app-header">
        <h1 className="text-2xl sm:text-3xl text-[#7a1453]">
          Surveyors Management
        </h1>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">
            <i className="fas fa-users" style={{ color: "#7A1453" }}></i> Total
            Surveyors
          </div>

          <div className="stat-number">{total}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <i
              className="fas fa-hourglass-half"
              style={{ color: "#7A1453" }}
            ></i>{" "}
            Pending
          </div>

          <div className="stat-number">{pending}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <i className="fas fa-check-circle" style={{ color: "#7A1453" }}></i>{" "}
            Validated
          </div>

          <div className="stat-number">{validated}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <i
            className={editingId ? "fas fa-user-edit" : "fas fa-user-plus"}
            style={{ color: "#7A1453" }}
          ></i>
          {editingId ? "Edit Surveyor" : "Add New Surveyor"}
          <span className="sub">
            {editingId
              ? `— editing ${editingId}`
              : "— fill all fields to register"}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* =====================================================
                SURVEYOR NAME ENGLISH
            ====================================================== */}

            <div className="form-group">
              <label>
                <i className="fas fa-id-card" style={{ color: "#7A1453" }}></i>{" "}
                Surveyor Name (EN) <span className="required-fields">*</span>
              </label>

              <input
                type="text"
                id="surveyor_name"
                value={formData.surveyor_name}
                onChange={handleChange}
                placeholder="John Doe"
                className={errors.surveyor_name ? "error" : ""}
              />

              {errors.surveyor_name && (
                <span className="error-message">{errors.surveyor_name}</span>
              )}
            </div>

            {/* =====================================================
                SURVEYOR NAME HINDI
                READ ONLY - POPULATED BY GOOGLE
            ====================================================== */}

            <div className="form-group">
              <label>
                <i className="fas fa-language" style={{ color: "#7A1453" }}></i>{" "}
                Surveyor Name (HI) <span className="required-fields">*</span>
              </label>

              <input
                type="text"
                id="surveyor_name_hindi"
                value={formData.surveyor_name_hindi}
                placeholder="जॉन डो"
                readOnly
                className={errors.surveyor_name_hindi ? "error" : ""}
              />

              {errors.surveyor_name_hindi && (
                <span className="error-message">
                  {errors.surveyor_name_hindi}
                </span>
              )}
            </div>

            {/* =====================================================
                USERNAME
            ====================================================== */}

            <div className="form-group">
              <label>
                <i className="fas fa-user" style={{ color: "#7A1453" }}></i>{" "}
                Username <span className="required-fields">*</span>
              </label>

              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. john"
                disabled
                className={errors.username ? "error" : ""}
              />

              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>

            {/* =====================================================
                PASSWORD
            ====================================================== */}

            <div className="form-group">
              <label>
                <i className="fas fa-lock" style={{ color: "#7A1453" }}></i>{" "}
                Password {<span className="required-fields">*</span>}
              </label>

              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.password ? "error" : ""}
              />

              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {/* =====================================================
                ROLE
            ====================================================== */}

            <div className="form-group">
              <label>
                <i
                  className="fas fa-briefcase"
                  style={{ color: "#7A1453" }}
                ></i>{" "}
                Role <span className="required-fields">*</span>
              </label>

              <input
                type="text"
                id="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Surveyor"
                disabled
                className={errors.role ? "error" : ""}
              />

              {errors.role && (
                <span className="error-message">{errors.role}</span>
              )}
            </div>

            {/* =====================================================
                EMAIL
            ====================================================== */}

            <div className="form-group">
              <label>
                <i className="fas fa-envelope" style={{ color: "#7A1453" }}></i>{" "}
                Email <span className="required-fields">*</span>
              </label>

              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={errors.email ? "error" : ""}
              />

              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* =====================================================
                MOBILE
            ====================================================== */}

            <div className="form-group">
              <label>
                <i className="fas fa-phone" style={{ color: "#7A1453" }}></i>{" "}
                Mobile <span className="required-fields">*</span>
              </label>

              <input
                type="tel"
                id="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                className={errors.mobile ? "error" : ""}
                maxLength={10}
              />

              {errors.mobile && (
                <span className="error-message">{errors.mobile}</span>
              )}
            </div>

            {/* =====================================================
                TARGET
            ====================================================== */}

            <div className="form-group">
              <label>
                <i className="fas fa-box" style={{ color: "#7A1453" }}></i> No.
                of Parcels <span className="required-fields">*</span>
              </label>

              <input
                type="text"
                id="target"
                value={formData.target}
                onChange={handleChange}
                placeholder="120"
                className={errors.target ? "error" : ""}
              />

              {errors.target && (
                <span className="error-message">{errors.target}</span>
              )}
            </div>

            {/* =====================================================
                ZONE ENGLISH
            ====================================================== */}

            <div className="form-group">
              <label>
                <i className="fas fa-map-pin" style={{ color: "#7A1453" }}></i>{" "}
                Zone (EN) <span className="required-fields">*</span>
              </label>

              <SearchableMultiSelect
                options={zoneEnglishOptions}
                selected={parseSelectedValues(formData.zone)}
                onChange={handleZoneEnglishChange}
                placeholder="Select Zone (EN)"
              />

              {errors.zone && (
                <span className="error-message">{errors.zone}</span>
              )}
            </div>

            {/* =====================================================
                ZONE HINDI
            ====================================================== */}

            <div className="form-group">
              <label>
                <i className="fas fa-map-pin" style={{ color: "#7A1453" }}></i>{" "}
                Zone (HI) <span className="required-fields">*</span>
              </label>

              <SearchableMultiSelect
                options={zoneHindiOptions}
                selected={parseSelectedValues(formData.zone_hindi)}
                onChange={handleZoneHindiChange}
                placeholder="Select Zone (HI)"
              />

              {errors.zone_hindi && (
                <span className="error-message">{errors.zone_hindi}</span>
              )}
            </div>

            {/* =====================================================
                WARD ENGLISH
            ====================================================== */}

            <div className="form-group">
              <label>
                <i
                  className="fas fa-location-dot"
                  style={{ color: "#7A1453" }}
                ></i>{" "}
                Ward (EN) <span className="required-fields">*</span>
              </label>

              <SearchableMultiSelect
                options={wardEnglishOptions}
                selected={parseSelectedValues(formData.ward)}
                onChange={handleWardEnglishChange}
                placeholder={
                  formData.zone ? "Select Ward (EN)" : "Select Zone First"
                }
              />

              {errors.ward && (
                <span className="error-message">{errors.ward}</span>
              )}
            </div>

            {/* =====================================================
                WARD HINDI
            ====================================================== */}

            <div className="form-group">
              <label>
                <i
                  className="fas fa-location-dot"
                  style={{ color: "#7A1453" }}
                ></i>{" "}
                Ward (HI) <span className="required-fields">*</span>
              </label>

              <SearchableMultiSelect
                options={wardHindiOptions}
                selected={parseSelectedValues(formData.ward_hindi)}
                onChange={handleWardHindiChange}
                placeholder={
                  formData.zone_hindi ? "Select Ward (HI)" : "Select Zone First"
                }
              />

              {errors.ward_hindi && (
                <span className="error-message">{errors.ward_hindi}</span>
              )}
            </div>
          </div>

          {/* =====================================================
              FORM ACTIONS
          ====================================================== */}

          <div className="form-actions">
            <button type="submit" className="submit-surveyor-btn btn-success">
              <i
                className={editingId ? "fas fa-sync-alt" : "fas fa-save"}
                style={{ color: "white" }}
              ></i>{" "}
              {editingId ? "Update Surveyor" : "Add Surveyor"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={handleCancelEdit}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
            )}

            <span className="hint-text">
              <i className="fas fa-info-circle"></i> All * fields are required
            </span>
          </div>
        </form>
      </div>

      {/* =======================================================
          SURVEYOR LIST
      ======================================================== */}

      <div className="card">
        <div className="card-title">
          <i className="fas fa-table" style={{ color: "#7A1453" }}></i>
          Surveyor List
          <span className="sub">
            — {filtered.length} record
            {filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* =====================================================
            TOOLBAR
        ====================================================== */}

        <div className="toolbar">
          <div className="search-box">
            <i className="fas fa-search"></i>

            <input
              type="text"
              placeholder="Search by name, ID, email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="validated">Validated</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={zoneFilter}
              onChange={(e) => {
                setZoneFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Zones</option>

              {zoneEnglishOptions.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* =====================================================
            TABLE
        ====================================================== */}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Surveyor ID</th>
                <th>Username</th>
                <th>Name (EN)</th>
                <th>Name (HI)</th>
                <th>Role</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Zone(EN)</th>
                <th>Ward(EN)</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>

            <tbody>{renderTableRows()}</tbody>
          </table>
        </div>

        {/* =====================================================
            PAGINATION
        ====================================================== */}

        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            &lt;
          </button>

          <span>
            Page {safePage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default SurveyorsManagement;
