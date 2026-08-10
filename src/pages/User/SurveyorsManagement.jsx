import React, { useState, useEffect, useRef } from "react";
import "./SurveyorsManagement.css";
import notify from "../../utils/toast";
import { addSurveyorAPI, fetchSurveyorsList } from "../../services/api";

function SurveyorsManagement() {
  // ---------- state ----------
  const [surveyors, setSurveyors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    surveyor_name: "",
    surveyor_name_hindi: "",
    role: "surveyor",
    // surveyor_id: "",
    email: "",
    mobile: "",
    zone: "",
    zone_hindi: "",
    ward: "",
    ward_hindi: "",
    num_of_parcels: "",
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

  // Reset to first page when search/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, zoneFilter]);

  // ---------- ref for toast timeout ----------
  const toastTimeout = useRef(null);

  // ---------- load initial mock data ----------
  // useEffect(() => {
  //   // Simulate initial API call
  //   const mockData = [
  //     {
  //       id: 1,
  //       username: "mladmin",
  //       password: "****",
  //       surveyor_name: "MLAdmin",
  //       surveyor_name_hindi: "एमएल एडमिन",
  //       role: "admin",
  //       surveyor_id: "SUR22336913",
  //       email: "admin@korba.in",
  //       mobile: "9876543210",
  //       zone: "Zone 1",
  //       zone_hindi: "ज़ोन १",
  //       ward: "Ward A",
  //       ward_hindi: "वार्ड ए",
  //       status: "validated",
  //       createdAt: "2026-07-30T00:00:00",
  //     },
  //     {
  //       id: 2,
  //       username: "surveyor1",
  //       password: "****",
  //       surveyor_name: "Rajesh Kumar",
  //       surveyor_name_hindi: "राजेश कुमार",
  //       role: "surveyor",
  //       surveyor_id: "SUR22336914",
  //       email: "rajesh@korba.in",
  //       mobile: "9876543211",
  //       zone: "Zone 2",
  //       zone_hindi: "ज़ोन २",
  //       ward: "Ward B",
  //       ward_hindi: "वार्ड बी",
  //       status: "pending",
  //       createdAt: "2026-07-28T00:00:00",
  //     },
  //   ];
  //   setSurveyors(mockData);
  //   setFiltered(mockData);
  // }, []);
  useEffect(() => {
    const loadSurveyors = async () => {
      try {
        const response = await fetchSurveyorsList();
        // Assuming response is an array of objects like the sample
        const data = response || []; // adjust if response has wrapper
        // Map to our internal structure (add missing fields with defaults)
        const mappedData = data.map((item) => ({
          id: item.id,
          username: item.username,
          password: "", // not exposed
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
          status: item.status === "Active" ? "Active" : "Pending", // map to Active/Pending
          createdAt: item.created_at || new Date().toISOString(),
        }));
        setSurveyors(mappedData);
        setFiltered(mappedData);
      } catch (error) {
        console.error("Failed to load surveyors:", error);
        showToast("Failed to load surveyors", "error");
      }
    };
    loadSurveyors();
  }, []);

  // ---------- filtering logic ----------
  useEffect(() => {
    let result = surveyors;

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
      result = result.filter((s) => s.status === statusFilter);
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
  const pending = surveyors.filter((s) => s.status === "pending").length;
  const validated = surveyors.filter((s) => s.status === "validated").length;
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

  const updateStatus = async (id, newStatus) => {
    try {
      // Find the surveyor by id or surveyor_id
      const surveyor = surveyors.find(
        (s) => s.id === id || s.surveyor_id === id,
      );
      if (!surveyor) {
        showToast("Surveyor not found", "error");
        return;
      }

      // Call your API to update status
      const payload = {
        surveyor_id: surveyor.surveyor_id || id,
        status: newStatus === "validated" ? "active" : "inactive", // adjust based on your API
      };

      // If you have a dedicated API endpoint for status update
      // const response = await updateSurveyorStatus(payload);

      // Mock API call (replace with actual)
      await apiCall("PATCH", `/api/surveyors/${id}`, { status: newStatus });

      // Update local state
      setSurveyors((prev) =>
        prev.map((s) => {
          const match = s.id === id || s.surveyor_id === id;
          if (match) {
            const newStatusValue =
              newStatus === "validated" ? "Active" : "Pending";
            return { ...s, status: newStatusValue };
          }
          return s;
        }),
      );

      const label = newStatus === "validated" ? "Active" : "Pending";
      showToast(
        `Status updated to "${label}" for ${surveyor.surveyor_name}`,
        "success",
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast("Failed to update status", "error");
    }
  };

  const deleteSurveyor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this surveyor?"))
      return;
    try {
      const surveyor = surveyors.find(
        (s) => s.id === id || s.surveyor_id === id,
      );
      if (!surveyor) return;

      // Call your API to delete
      // await deleteSurveyorAPI(surveyor.surveyor_id || id);

      // Mock API call (replace with actual)
      await apiCall("DELETE", `/api/surveyors/${id}`);

      setSurveyors((prev) =>
        prev.filter((s) => s.id !== id && s.surveyor_id !== id),
      );
      showToast(`Surveyor "${surveyor.surveyor_name}" deleted.`, "success");
    } catch (error) {
      console.error("Failed to delete:", error);
      showToast("Failed to delete surveyor", "error");
    }
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
      // { key: "surveyor_id", label: "Surveyor ID" },
      { key: "email", label: "Email" },
      { key: "mobile", label: "Mobile" },
      { key: "zone", label: "Zone (EN)" },
      { key: "zone_hindi", label: "Zone (HI)" },
      { key: "ward", label: "Ward (EN)" },
      { key: "ward_hindi", label: "Ward (HI)" },
      { key: "num_of_parcels", label: "No. of Parcels" },
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
    const firstName = formData.surveyor_name.trim().split(' ')[0];
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
      debugger;
      // Show loading state (optional)
      const loadingId = notify.loading("Adding surveyor...");

      // Prepare payload for API (match the API expected fields)
      const apiPayload = {
        username: payload.username,
        password: payload.password,
        surveyor_name: payload.surveyor_name,
        surveyor_name_hindi: payload.surveyor_name_hindi || "",
        role: payload.role,
        // surveyor_id: payload.surveyor_id,
        email: payload.email || "",
        mobile: payload.mobile,
        zone: payload.zone,
        zone_hindi: payload.zone_hindi || "",
        ward: payload.ward,
        ward_hindi: payload.ward_hindi || "",
        num_of_parcels: payload.num_of_parcels || "",
      };

      // Call the actual API function
      const response = await addSurveyorAPI(apiPayload);

      // Dismiss loading toast
      toast.dismiss(loadingId);

      // Create new surveyor object with response data
      const newSurveyor = {
        id: response.id || Date.now(),
        ...apiPayload,
        status: response.status || "Pending",
        createdAt: response.created_at || new Date().toISOString(),
      };

      // Update state - add to beginning of list
      setSurveyors((prev) => [newSurveyor, ...prev]);
      setFiltered((prev) => [newSurveyor, ...prev]);

      notify.success(
        `Surveyor "${newSurveyor.surveyor_name}" added successfully!`,
      );

      // Reset form and clear errors
      setFormData({
        username: "",
        password: "",
        surveyor_name: "",
        surveyor_name_hindi: "",
        role: "",
        // surveyor_id: "",
        email: "",
        mobile: "",
        zone: "",
        zone_hindi: "",
        ward: "",
        ward_hindi: "",
        num_of_parcels: "",
      });
      setErrors({});
    } catch (error) {
      toast.dismiss(loadingId);
      console.error("Error adding surveyor:", error);
      notify.error(
        error.message || "Failed to add surveyor. Please try again.",
      );
    }
  };

  const handleSubmit = async (e) => {
    debugger;
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
      // Status logic: Active = validated, anything else = pending
      const isActive = s.status?.toLowerCase() === "active";
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
          <td>{s.zone_hindi}</td>
          <td>{s.ward}</td>
          <td>{s.ward_hindi}</td>
          <td>{statusBadge}</td>
          <td>
            <div className="action-icons">
              {/* Show validate button only if NOT active */}
              {!isActive && (
                <button
                  className="approve-btn"
                  onClick={() =>
                    updateStatus(s.id || s.surveyor_id, "validated")
                  }
                  title="Validate"
                >
                  <i className="fas fa-check-circle"></i>
                </button>
              )}
              {/* Show reject button only if active */}
              {isActive && (
                <button
                  className="reject-btn"
                  onClick={() =>
                    updateStatus(s.id || s.surveyor_id, "not-validated")
                  }
                  title="Not Validate"
                >
                  <i className="fas fa-times-circle"></i>
                </button>
              )}
              {/* Delete button always visible */}
              <button
                className="delete-btn"
                onClick={() => deleteSurveyor(s.id || s.surveyor_id)}
                title="Delete"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  // ---------- JSX ----------
  return (
    <div className="app-container">
      {/* toast */}
      {/* {toast.visible && (
        <div className={`toast show ${toast.type}`}>
          <i
            className={
              toast.type === "success"
                ? "fas fa-check-circle"
                : "fas fa-exclamation-circle"
            }
          ></i>
          <span>{toast.message}</span>
        </div>
      )} */}

      {/* header */}
      <header className="app-header">
        <h1>
          <i className="fas fa-clipboard-list" style={{ color: "#7A1453" }}></i>
          Surveyors Management
          <span className="header-sub">Korba Nagar Nigam</span>
        </h1>
        {/* <div className="header-badge">
          <i className="fas fa-user-cog"></i>
          Admin Panel
        </div> */}
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
        {/* <div className="stat-card">
          <div className="stat-label">
            <i className="fas fa-times-circle"></i> Not Validated
          </div>
          <div className="stat-number">{notValidated}</div>
        </div> */}
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
                // required
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
                // required
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
              {/* <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                // required
                disabled
                className={errors.role ? "error" : ""}
              >
                <option value="surveyor">Select Role</option>
               
                <option value="surveyor">Surveyor</option>
                <option value="supervisor">Supervisor</option>
              </select> */}
               <input
                type="text"
                id="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. SUR22336913"
                // required
                disabled
                className={errors.role ? "error" : ""}
              />
              {errors.role && (
                <span className="error-message">{errors.role}</span>
              )}
            </div>
            {/* <div className="form-group">
              <label>
                <i className="fas fa-hashtag"></i> Surveyor ID{" "}
                <span className="required-fields">*</span>
              </label>
              <input
                type="text"
                id="surveyor_id"
                value={formData.surveyor_id}
                onChange={handleChange}
                placeholder="e.g. SUR22336913"
                // required
                className={errors.surveyor_id ? "error" : ""}
              />
              {errors.surveyor_id && (
                <span className="error-message">{errors.surveyor_id}</span>
              )}
            </div> */}
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
                // required
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
                // required
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
                // required
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
                // required
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
                id="num_of_parcels"
                value={formData.num_of_parcels}
                onChange={handleChange}
                placeholder="120"
                className={errors.num_of_parcels ? "error" : ""}
              />
              {errors.num_of_parcels && (
                <span className="error-message">{errors.num_of_parcels}</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-surveyor-btn btn-success">
              <i className="fas fa-save" style={{ color: "white" }}></i> Add
              Surveyor
            </button>
            {/* <button
              type="reset"
              className="btn btn-outline"
              onClick={() =>
                setFormData({
                  username: "",
                  password: "",
                  surveyor_name: "",
                  surveyor_name_hindi: "",
                  role: "",
                  surveyor_id: "",
                  email: "",
                  mobile: "",
                  zone: "",
                  zone_hindi: "",
                  ward: "",
                  ward_hindi: "",
                })
              }
            >
              <i className="fas fa-undo"></i> Reset
            </button> */}
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
              <option value="not-validated">Not Validated</option>
            </select>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
            >
              <option value="">All Zones</option>
              <option value="Zone 1">Zone 1</option>
              <option value="Zone 2">Zone 2</option>
              <option value="Zone 3">Zone 3</option>
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
                <th>Zone(HI)</th>
                <th>Ward(EN)</th>
                <th>Ward(HI)</th>
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
