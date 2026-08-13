import React, { useState, useEffect, useRef } from "react";
import "./SurveyorsManagement.css";
import notify from "../../utils/toast";
import { addSurveyorAPI, fetchSurveyorsList } from "../../services/api";
import OTPModal from "./OtpModal/OTPModal";
import { sendOTP, verifyOTP } from "../../services/api";

function SurveyorsManagement() {
  // ---------- state ----------
  const [surveyors, setSurveyors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    surveyor_name: "",
    surveyor_name_hindi: "",
    role: "Surveyor",
    // surveyor_id: "",
    email: "",
    mobile: "",
    zone: "",
    zone_hindi: "",
    ward: "",
    ward_hindi: "",
    target: "",
  });

  // Error state: one key per field
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // you can make this a dropdown later

  // Pending validatin Modal State
  const [otpValidationModal, setOtpValidationModal] = useState(false);
  const [emailForOTP, setEmailForOTP] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Reset to first page when search/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, zoneFilter]);

  // ---------- ref for toast timeout ----------
  const toastTimeout = useRef(null);

  // ---------- load initial mock data ----------
  useEffect(() => {
    loadSurveyors();
  }, []);

  const loadSurveyors = async () => {
    try {
      otpValidationModal;
      const response = await fetchSurveyorsList();
      // Assuming response is an array of objects like the sample
      const data = response || []; // adjust if response has wrapper
      // Map to our internal structure (add missing fields with defaults)
      const mappedData = data.map((item) => ({
        id: item.surveyor_id,
        username: item.username,
        surveyor_name: item.surveyor_name,
        surveyor_name_hindi: item.surveyor_name_hindi || "",
        role: item.role || "Surveyor",
        surveyor_id: item.surveyor_id,
        email: item.email || "",
        mobile: item.mobile,
        zone: item.zone,
        zone_hindi: item.zone_hindi || "",
        ward: item.ward,
        ward_hindi: item.ward_hindi || "",
        status:
          item.status.toLowerCase() === "active" ? "Validated" : "Pending", // map to Active/Pending
        createdAt: item.created_at || new Date().toISOString(),
      }));
      setSurveyors(mappedData);
      setFiltered(mappedData);
    } catch (error) {
      console.error("Failed to load surveyors:", error);
    }
  };

  // ---------- filtering logic ----------
  useEffect(() => {
    let result = surveyors;
    otpValidationModal;
    // search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.surveyor_name.toLowerCase().includes(term) ||
          s.surveyor_id.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term) ||
          s.mobile.includes(term) ||
          s.username.toLowerCase().includes(term),
      );
    }

    // status filter
    if (statusFilter) {
      result = result.filter((s) => s.status.toLowerCase() === statusFilter);
    }

    // zone filter
    if (zoneFilter) {
      result = result.filter((s) => s.zone === zoneFilter);
    }

    // date filter (simple partial match)
    if (dateFilter.trim()) {
      const filterDate = dateFilter.trim();
      result = result.filter((s) => {
        const d = new Date(s.createdAt);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        const formatted = `${day}-${month}-${year}`;
        return formatted.includes(filterDate);
      });
    }

    setFiltered(result);
  }, [surveyors, searchTerm, statusFilter, zoneFilter, dateFilter]);

  // ---------- stats ----------
  const total = surveyors.length;
  const pending = surveyors.filter(
    (s) => s.status.toLowerCase() === "pending",
  ).length;
  const validated = surveyors.filter(
    (s) => s.status.toLowerCase() === "validated",
  ).length;
  const notValidated = surveyors.filter(
    (s) => s.status === "not-validated",
  ).length;

  // ---------- toast ----------
  const showToast = (message, type = "success") => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ visible: true, message, type });
    toastTimeout.current = setTimeout(() => {
      setToast({ visible: false, message: "", type: "success" });
    }, 3000);
  };

  // ---------- CRUD operations (mock API) ----------
  const apiCall = (method, endpoint, data = null) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, data }), 300);
    });
  };

  // ---------- form handlers ----------
  const handleChange = (e) => {
    const { id, value } = e.target;

    // Special handling for mobile: only digits allowed
    let sanitizedValue = value;
    if (id === "mobile") {
      sanitizedValue = value.replace(/\D/g, ""); // remove non-digits
    }

    setFormData((prev) => ({ ...prev, [id]: sanitizedValue }));
    // Clear error for this field if it exists
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // Validation function – returns true if valid, else sets errors and returns false
  const validateForm = () => {
    const requiredFields = [
      { key: "username", label: "Username" },
      { key: "password", label: "Password" },
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

    // 1. Check empty fields
    for (const field of requiredFields) {
      if (!formData[field.key] || formData[field.key].trim() === "") {
        newErrors[field.key] = `${field.label} is required`;
        isValid = false;
      }
    }

    // 2. Email format (only if not empty)
    if (formData.email && formData.email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email =
          "Please enter a valid email address (e.g., name@domain.com)";
        isValid = false;
      }
    }

    // 3. Mobile number: exactly 10 digits (only if not empty)
    if (formData.mobile && formData.mobile.trim() !== "") {
      if (!/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = "Mobile number must be exactly 10 digits";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Update the field username with the help of the Surveyor Name
  useEffect(() => {
    if (formData.surveyor_name && formData.surveyor_name.trim().length > 0) {
      const firstName = formData.surveyor_name.trim().split(" ")[0];
      setFormData((prev) => ({
        ...prev,
        username: firstName.toLowerCase(),
      }));
    } else {
      // Clear username when surveyor_name is empty
      setFormData((prev) => ({
        ...prev,
        username: "",
      }));
    }
  }, [formData.surveyor_name]);
  useEffect(() => {
    if (formData.surveyor_name && formData.surveyor_name.trim().length > 0) {
      const firstName = formData.surveyor_name.trim().split(" ")[0];
      setFormData((prev) => ({
        ...prev,
        username: firstName.toLowerCase(),
      }));
    } else {
      // Clear username when surveyor_name is empty
      setFormData((prev) => ({
        ...prev,
        username: "",
      }));
    }
  }, [formData.surveyor_name]);

  const addSurveyor = async (payload) => {
    try {
      otpValidationModal;

      // Prepare payload for API (match the API expected fields)
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

      // Call the actual API function
      otpValidationModal;
      const response = await addSurveyorAPI(apiPayload);

      let data = {};

      if (response && response.data) {
        data = response.data;
      }

      if (data.message) {
        notify.info(data.message);
        handleSetFormDataInitial();
        return;
      }
      const newSurveyor = {
        id: data.id || Date.now(),
        ...apiPayload,
        status: data.status || "Pending",
        createdAt: data.created_at || new Date().toISOString(),
      };

      notify.success(
        `Surveyor "${newSurveyor.surveyor_name}" added successfully!`,
      );

      await loadSurveyors();
      setErrors({});
      handleSetFormDataInitial();
    } catch (error) {
      console.error("Error adding surveyor:", error);
      notify.error(
        error.message || "Failed to add surveyor. Please try again.",
      );
    }
  };

  const handleSetFormDataInitial = () => {
    // Reset form and clear errors
    setFormData({
      username: "",
      password: "",
      surveyor_name: "",
      surveyor_name_hindi: "",
      role: "",
      email: "",
      mobile: "",
      zone: "",
      zone_hindi: "",
      ward: "",
      ward_hindi: "",
      target: "",
    });
  };

  const handleSubmit = async (e) => {
    otpValidationModal;
    e.preventDefault();
    if (!validateForm()) {
      // Focus first error field
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const el = document.getElementById(firstErrorKey);
        if (el) el.focus();
      }
      return;
    }
    await addSurveyor(formData);
  };

  const handleValidationOTP = async (email) => {
    try {
      // Show loading
      const loadingId = notify.loading("Sending OTP...");

      // Call API to send OTP
      // await sendOTP(email);

      // Dismiss loading
      notify.dismiss(loadingId);

      // Show success message
      notify.success(`OTP sent to ${email}`);

      // Open the OTP validation modal
      setOtpValidationModal(true);
      setEmailForOTP(email); // Store email for verification
    } catch (error) {
      console.error("Error sending OTP:", error);
      notify.error(error.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerify = async (otp) => {
    try {
      otpValidationModal;

      const loadingId = notify.loading("Verifying OTP...");

      // Call API to verify OTP
      // const response = await verifyOTP(emailForOTP, otp);

      if (otp !== "123456") {
        notify.dismiss(loadingId);
        notify.error("Invalid opt, Enter correct otp.");
        return;
      }

      notify.dismiss(loadingId);
      setOtpValidationModal(false);
      notify.success("OTP verified successfully!");

      // Reload surveyors list
      await loadSurveyors();

      // Optional: Reset OTP state
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      notify.error(error.message || "Invalid OTP. Please try again.");
    }
  };

  // ---------- render table rows ----------
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const renderTableRows = () => {
    if (filtered.length === 0) {
      return (
        <tr>
          <td colSpan="11">
            <div className="empty-state">
              <i className="fas fa-user-slash"></i>
              <p>No surveyors found. Add one using the form above!</p>
            </div>
          </td>
        </tr>
      );
    }

    return paginatedData.map((s, idx) => {
      const isActive = s.status?.toLowerCase() === "validated";
      const displayStatus = isActive ? "validated" : "pending";

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
          <td>{s.mobile}</td>
          <td>{s.zone}</td>
          {/* <td>{s.zone_hindi}</td> */}
          <td>{s.ward}</td>
          {/* <td>{s.ward_hindi}</td> */}
          <td>{statusBadge}</td>
          <td>
            <div className="action-icons">
              {/* Show validate button only if NOT active */}
              {!isActive && (
                <button
                  className="approve-btn"
                  onClick={() => handleValidationOTP(s.email)}
                  title="Validate"
                >
                  <i className="fas fa-check-circle"></i>
                </button>
              )}
              {/* Show reject button only if active */}
              {isActive && (
                <button className="reject-btn" onClick={""} title="Invalidate">
                  <i className="fas fa-times-circle"></i>
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    });
  };

  // ---------- JSX ----------
  return (
    <div className="app-container">
      {
        <OTPModal
          open={otpValidationModal}
          onClose={() => setOtpValidationModal(false)}
          onVerify={handleVerify}
          email={emailForOTP}
          otp={otp}
          setOtp = {setOtp}
        />
      }
      {/* header */}
      <header className="app-header">
        <h1>
          <i className="fas fa-clipboard-list" style={{ color: "#7A1453" }}></i>
          Surveyors Management
          <span className="header-sub">Korba Nagar Nigam</span>
        </h1>
      </header>

      {/* stats */}
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

      {/* add form */}
      <div className="card">
        <div className="card-title">
          <i className="fas fa-user-plus" style={{ color: "#7A1453" }}></i>
          Add New Surveyor
          <span className="sub">— fill all fields to register</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
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
                // required
                disabled
                className={errors.username ? "error" : ""}
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>
            <div className="form-group">
              <label>
                <i className="fas fa-lock" style={{ color: "#7A1453" }}></i>{" "}
                Password <span className="required-fields">*</span>
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

            <div className="form-group">
              <label>
                <i className="fas fa-language" style={{ color: "#7A1453" }}></i>{" "}
                Surveyor Name (HI) <span className="required-fields">*</span>
              </label>
              <input
                type="text"
                id="surveyor_name_hindi"
                value={formData.surveyor_name_hindi}
                onChange={handleChange}
                placeholder="जॉन डो"
                className={errors.surveyor_name_hindi ? "error" : ""}
              />
              {errors.surveyor_name_hindi && (
                <span className="error-message">
                  {errors.surveyor_name_hindi}
                </span>
              )}
            </div>
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
                placeholder="e.g. SUR22336913"
                disabled
                className={errors.role ? "error" : ""}
              />
              {errors.role && (
                <span className="error-message">{errors.role}</span>
              )}
            </div>
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
            <div className="form-group">
              <label>
                <i className="fas fa-map-pin" style={{ color: "#7A1453" }}></i>{" "}
                Zone (EN) <span className="required-fields">*</span>
              </label>
              <input
                type="text"
                id="zone"
                value={formData.zone}
                onChange={handleChange}
                placeholder="Zone 1"
                className={errors.zone ? "error" : ""}
              />
              {errors.zone && (
                <span className="error-message">{errors.zone}</span>
              )}
            </div>
            <div className="form-group">
              <label>
                <i className="fas fa-map-pin" style={{ color: "#7A1453" }}></i>{" "}
                Zone (HI) <span className="required-fields">*</span>
              </label>
              <input
                type="text"
                id="zone_hindi"
                value={formData.zone_hindi}
                onChange={handleChange}
                placeholder="ज़ोन १"
                className={errors.zone_hindi ? "error" : ""}
              />
              {errors.zone_hindi && (
                <span className="error-message">{errors.zone_hindi}</span>
              )}
            </div>
            <div className="form-group">
              <label>
                <i
                  className="fas fa-location-dot"
                  style={{ color: "#7A1453" }}
                ></i>{" "}
                Ward (EN) <span className="required-fields">*</span>
              </label>
              <input
                type="text"
                id="ward"
                value={formData.ward}
                onChange={handleChange}
                placeholder="Ward A"
                className={errors.ward ? "error" : ""}
              />
              {errors.ward && (
                <span className="error-message">{errors.ward}</span>
              )}
            </div>
            <div className="form-group">
              <label>
                <i
                  className="fas fa-location-dot"
                  style={{ color: "#7A1453" }}
                ></i>{" "}
                Ward (HI) <span className="required-fields">*</span>
              </label>
              <input
                type="text"
                id="ward_hindi"
                value={formData.ward_hindi}
                onChange={handleChange}
                placeholder="वार्ड ए"
                className={errors.ward_hindi ? "error" : ""}
              />
              {errors.ward_hindi && (
                <span className="error-message">{errors.ward_hindi}</span>
              )}
            </div>
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
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-surveyor-btn btn-success">
              <i className="fas fa-save" style={{ color: "white" }}></i> Add
              Surveyor
            </button>
            <span className="hint-text">
              <i className="fas fa-info-circle"></i> All * fields are required
            </span>
          </div>
        </form>
      </div>

      {/* table */}
      <div className="card">
        <div className="card-title">
          <i className="fas fa-table" style={{ color: "#7A1453" }}></i>
          Surveyor List
          <span className="sub">
            — {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* toolbar */}
        <div className="toolbar">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by name, ID, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="validated">Validated</option>
              <option value="pending">Pending</option>
            </select>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
            >
              <option value="">All Zones</option>
              <option value="Zone 1">Zone 1</option>
              <option value="Zone 2">Zone 2</option>
            </select>
          </div>
          {/* <div className="date-picker">
            <i className="fas fa-calendar-alt"></i>
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div> */}
        </div>

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
                {/* <th>Zone(HI)</th> */}
                <th>Ward(EN)</th>
                {/* <th>Ward(HI)</th> */}
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        </div>
        {/* Pagination */}
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
