import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import "./Editmanagement.css";
import { fetchEditManagementDataAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Editmanagement = () => {
  const [editData, setEditData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Frontend pagination
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  // Search values
  const [search, setSearch] = useState({
    // parcel_no: "",
    property_id: "",
    existing_property_id: "",
    // owner_name: "",
    // mobile_number: "",
  });

  // ================= FETCH ALL DATA =================
  const fetchEditManagementData = async () => {
    try {
      setLoading(true);

      // API now returns ALL records
      const data = await fetchEditManagementDataAPI();

      if (data.success) {
        setEditData(data.surveys || []);
      } else {
        setEditData([]);
      }
    } catch (error) {
      console.error("Error fetching edit management data:", error);
      setEditData([]);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (surveyId) => {
    console.log("Editing Survey ID:", surveyId);
    navigate(`/surveys/${surveyId}`);
  };
  useEffect(() => {
    fetchEditManagementData();
  }, []);

  // ================= SEARCH =================
  // const filteredData = editData.filter((survey) => {
  //   const parcelNo = String(survey.parcel_no || "").toLowerCase();
  //   const propertyId = String(survey.property_id || "").toLowerCase();
  //   const existingPropertyId = String(
  //     survey.existing_property_id || "",
  //   ).toLowerCase();
  //   const ownerName = String(survey.owner_name || "").toLowerCase();
  //   const mobileNumber = String(survey.mobile_number || "").toLowerCase();

  //   return (
  //     parcelNo.includes(search.parcel_no.toLowerCase()) &&
  //     propertyId.includes(search.property_id.toLowerCase()) &&
  //     existingPropertyId.includes(search.existing_property_id.toLowerCase()) &&
  //     ownerName.includes(search.owner_name.toLowerCase()) &&
  //     mobileNumber.includes(search.mobile_number.toLowerCase())
  //   );
  // });
  const filteredData = editData
    .map((survey, index) => ({
      ...survey,
      originalSerialNo: index + 1,
    }))
    .filter((survey) => {
      // const parcelNo = String(survey.parcel_no || "").toLowerCase();
      const propertyId = String(survey.property_id || "").toLowerCase();
      const existingPropertyId = String(
        survey.existing_property_id || "",
      ).toLowerCase();
      // const ownerName = String(survey.owner_name || "").toLowerCase();
      // const mobileNumber = String(survey.mobile_number || "").toLowerCase();

      return (
        // parcelNo.includes(search.parcel_no.toLowerCase()) &&
        propertyId.includes(search.property_id.toLowerCase()) &&
        existingPropertyId.includes(search.existing_property_id.toLowerCase())
        // ownerName.includes(search.owner_name.toLowerCase()) &&
        // mobileNumber.includes(search.mobile_number.toLowerCase())
      );
    });

  // ================= PAGINATION =================
  // const totalRecords = filteredData.length;

  // const totalPages = Math.max(1, Math.ceil(totalRecords / limit));

  // // Current page records
  // const startIndex = (currentPage - 1) * limit;

  // const paginatedData = filteredData.slice(startIndex, startIndex + limit);
  const totalRecords = filteredData.length;

  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));

  const startIndex = (currentPage - 1) * limit;

  const paginatedData = filteredData.slice(startIndex, startIndex + limit);

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // ================= SEARCH HANDLER =================
  const handleSearchChange = (field, value) => {
    setSearch((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Whenever search changes, go back to page 1
    setCurrentPage(1);
  };

  // ================= PAGINATION =================
  const handlePrevious = () => {
    if (hasPrevious) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div
      className="survey-page"
      Edit
      Managementc
      style={{ userSelect: "none" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ================= HEADER ================= */}
      <div className="page-header">
        <div>
          <h2 className="text-2xl sm:text-3xl text-[#7a1453]">
            Edit Management
          </h2>

          <p className="text-[#666] mt-1">
            Manage and edit property survey records.
          </p>
        </div>

        <div className="header-actions">{/* Refresh can be added later */}</div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="edit-management-table-container">
        <table className="survey-table">
          <thead>
            <tr className="w-[100%]">
              <th className="   w-1/6 ">S.No</th>

              {/* <th>
                <div className="table-header">
                  <span>Parcel No</span>
                  <input
                    type="text"
                    placeholder="Search"
                    value={search.parcel_no}
                    onChange={(e) =>
                      handleSearchChange("parcel_no", e.target.value)
                    }
                  />
                </div>
              </th> */}

              <th className=" w-1/6  ">
                <div className="table-header">
                  <span>Property ID</span>
                  <input
                    type="text"
                    placeholder="Search"
                    value={search.property_id}
                    onChange={(e) =>
                      handleSearchChange("property_id", e.target.value)
                    }
                  />
                </div>
              </th>

              <th className=" w-1/6  text-center ">
                <div className="table-header">
                  <span>Existing Property ID</span>
                  <input
                    type="text"
                    placeholder="Search"
                    value={search.existing_property_id}
                    onChange={(e) =>
                      handleSearchChange("existing_property_id", e.target.value)
                    }
                  />
                </div>
              </th>

              {/* <th>
                <div className="table-header">
                  <span>Owner Name</span>
                  <input
                    type="text"
                    placeholder="Search"
                    value={search.owner_name}
                    onChange={(e) =>
                      handleSearchChange("owner_name", e.target.value)
                    }
                  />
                </div>
              </th> */}

              {/* <th>
                <div className="table-header">
                  <span>Mobile No</span>
                  <input
                    type="text"
                    placeholder="Search"
                    value={search.mobile_number}
                    onChange={(e) =>
                      handleSearchChange("mobile_number", e.target.value)
                    }
                  />
                </div>
              </th> */}

              {/* <th>Survey Date</th> */}

              <th className=" w-1/6  ">Action</th>
            </tr>
          </thead>

          <tbody className="w-[100%]">
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No survey records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((survey, index) => (
                <tr
                  key={index}
                  style={{ userSelect: "none" }}
                  className="w-1/6  "
                >
                  {/* Serial number across filtered results */}
                  {/* <td>{startIndex + index + 1}</td> */}
                  <td>{survey.originalSerialNo}</td>

                  {/* <td>{survey.parcel_no || "-"}</td> */}

                  <td>{survey.property_id || "-"}</td>

                  <td>{survey.existing_property_id || "-"}</td>

                  {/* <td>{survey.owner_name || "-"}</td> */}

                  {/* <td>{survey.mobile_number || "-"}</td> */}

                  {/* <td>
                    {survey.survey_date
                      ? new Date(survey.survey_date).toLocaleDateString("en-GB")
                      : "-"}
                  </td> */}

                  <td>
                    <div className="edit-management-action-buttons">
                      <button
                        className="preview-btn"
                        onClick={() => handleEdit(survey.survey_id)}
                      >
                        <FaEdit />
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {!loading && totalRecords > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            padding: "0 5px",
          }}
        >
          {/* TOTAL COUNT */}
          <div
            style={{
              color: "#666",
              fontSize: "14px",
            }}
          >
            Total Records:{" "}
            <strong style={{ color: "#333" }}>{totalRecords}</strong>
          </div>

          {/* PAGINATION */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              style={{
                padding: "8px 16px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                background: hasPrevious ? "#fff" : "#f5f5f5",
                color: hasPrevious ? "#333" : "#aaa",
                cursor: hasPrevious ? "pointer" : "not-allowed",
              }}
            >
              Previous
            </button>

            <span
              style={{
                fontSize: "14px",
                color: "#666",
                minWidth: "100px",
                textAlign: "center",
              }}
            >
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={!hasNext}
              style={{
                padding: "8px 16px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                background: hasNext ? "#fff" : "#f5f5f5",
                color: hasNext ? "#333" : "#aaa",
                cursor: hasNext ? "pointer" : "not-allowed",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editmanagement;
