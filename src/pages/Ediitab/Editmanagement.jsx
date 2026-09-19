// import { useEffect, useState } from "react";
// import { FaEdit } from "react-icons/fa";
// import "./Editmanagement.css";
// import { fetchEditManagementDataAPI } from "../../services/api";

// const Editmanagement = () => {
//   const [editData, setEditData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit] = useState(20);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total_records: 0,
//     total_pages: 1,
//     has_next: false,
//     has_previous: false,
//   });

//   const fetchEditManagementData = async (page = 1) => {
//     try {
//       setLoading(true);

//       const data = await fetchEditManagementDataAPI(page, limit);

//       if (data.success) {
//         setEditData(data.surveys || []);

//         setPagination(
//           data.pagination || {
//             page: 1,
//             limit: 20,
//             total_records: 0,
//             total_pages: 1,
//             has_next: false,
//             has_previous: false,
//           },
//         );
//       } else {
//         setEditData([]);
//       }
//     } catch (error) {
//       console.error("Error fetching edit management data:", error);
//       setEditData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEditManagementData(currentPage);
//   }, [currentPage]);

//   const handlePrevious = () => {
//     if (pagination.has_previous) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   const handleNext = () => {
//     if (pagination.has_next) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   return (
//     <div className="survey-page">
//       {/* ================= HEADER ================= */}
//       <div className="page-header">
//         <div>
//           <h2 className="text-2xl sm:text-3xl text-[#7a1453]">
//             Edit Management
//           </h2>

//           <p className="text-[#666] mt-1">
//             Manage and edit property survey records.
//           </p>
//         </div>

//         <div className="header-actions">{/* Refresh can be added later */}</div>
//       </div>

//       {/* ================= TABLE ================= */}
//       <div className="edit-management-table-container">
//         <table className="survey-table">
//           <thead>
//             <tr>
//               <th>S.No</th>

//               <th>
//                 <div className="table-header">
//                   <span>Parcel No</span>
//                   <input type="text" placeholder="Search" />
//                 </div>
//               </th>

//               <th>
//                 <div className="table-header">
//                   <span>Property ID</span>
//                   <input type="text" placeholder="Search" />
//                 </div>
//               </th>

//               <th>
//                 <div className="table-header">
//                   <span>Existing Property ID</span>
//                   <input type="text" placeholder="Search" />
//                 </div>
//               </th>

//               <th>
//                 <div className="table-header">
//                   <span>Owner Name</span>
//                   <input type="text" placeholder="Search" />
//                 </div>
//               </th>

//               <th>
//                 <div className="table-header">
//                   <span>Mobile No</span>
//                   <input type="text" placeholder="Search" />
//                 </div>
//               </th>

//               <th>Survey Date</th>
//               <th width="250">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="7" style={{ textAlign: "center" }}>
//                   Loading...
//                 </td>
//               </tr>
//             ) : editData.length === 0 ? (
//               <tr>
//                 <td colSpan="7" style={{ textAlign: "center" }}>
//                   No survey records found.
//                 </td>
//               </tr>
//             ) : (
//               editData.map((survey, index) => (
//                 <tr key={index}>
//                   <td>{(currentPage - 1) * limit + index + 1}</td>

//                   <td>{survey.parcel_no || "-"}</td>
//                   <td>{survey.property_id || "-"}</td>

//                   <td>{survey.existing_property_id || "-"}</td>

//                   <td>{survey.owner_name || "-"}</td>
//                   <td>{survey.mobile_number || "-"}</td>

//                   <td>
//                     {survey.survey_date
//                       ? new Date(survey.survey_date).toLocaleDateString("en-GB")
//                       : "-"}
//                   </td>

//                   <td>
//                     <div className="edit-management-action-buttons">
//                       <button className="preview-btn">
//                         <FaEdit />
//                         Edit
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ================= PAGINATION ================= */}
//       {!loading && pagination.total_records > 0 && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginTop: "20px",
//             padding: "0 5px",
//           }}
//         >
//           {/* ================= TOTAL COUNT - LEFT ================= */}
//           <div
//             style={{
//               color: "#666",
//               fontSize: "14px",
//             }}
//           >
//             Total Records:{" "}
//             <strong style={{ color: "#333" }}>
//               {pagination.total_records}
//             </strong>
//           </div>

//           {/* ================= PREVIOUS / NEXT - RIGHT ================= */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//             }}
//           >
//             <button
//               onClick={handlePrevious}
//               disabled={!pagination.has_previous}
//               style={{
//                 padding: "8px 16px",
//                 border: "1px solid #ddd",
//                 borderRadius: "5px",
//                 background: pagination.has_previous ? "#fff" : "#f5f5f5",
//                 color: pagination.has_previous ? "#333" : "#aaa",
//                 cursor: pagination.has_previous ? "pointer" : "not-allowed",
//               }}
//             >
//               Previous
//             </button>

//             <span
//               style={{
//                 fontSize: "14px",
//                 color: "#666",
//                 minWidth: "80px",
//                 textAlign: "center",
//               }}
//             >
//               Page {pagination.page} of {pagination.total_pages}
//             </span>

//             <button
//               onClick={handleNext}
//               disabled={!pagination.has_next}
//               style={{
//                 padding: "8px 16px",
//                 border: "1px solid #ddd",
//                 borderRadius: "5px",
//                 background: pagination.has_next ? "#fff" : "#f5f5f5",
//                 color: pagination.has_next ? "#333" : "#aaa",
//                 cursor: pagination.has_next ? "pointer" : "not-allowed",
//               }}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Editmanagement;
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import "./Editmanagement.css";
import { fetchEditManagementDataAPI } from "../../services/api";

const Editmanagement = () => {
  const [editData, setEditData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Frontend pagination
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  // Search values
  const [search, setSearch] = useState({
    parcel_no: "",
    property_id: "",
    existing_property_id: "",
    owner_name: "",
    mobile_number: "",
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

  useEffect(() => {
    fetchEditManagementData();
  }, []);

  // ================= SEARCH =================
  const filteredData = editData.filter((survey) => {
    const parcelNo = String(survey.parcel_no || "").toLowerCase();
    const propertyId = String(survey.property_id || "").toLowerCase();
    const existingPropertyId = String(
      survey.existing_property_id || "",
    ).toLowerCase();
    const ownerName = String(survey.owner_name || "").toLowerCase();
    const mobileNumber = String(survey.mobile_number || "").toLowerCase();

    return (
      parcelNo.includes(search.parcel_no.toLowerCase()) &&
      propertyId.includes(search.property_id.toLowerCase()) &&
      existingPropertyId.includes(search.existing_property_id.toLowerCase()) &&
      ownerName.includes(search.owner_name.toLowerCase()) &&
      mobileNumber.includes(search.mobile_number.toLowerCase())
    );
  });

  // ================= PAGINATION =================
  const totalRecords = filteredData.length;

  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));

  // Current page records
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
    <div className="survey-page">
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
            <tr>
              <th>S.No</th>

              <th>
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
              </th>

              <th>
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

              <th>
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

              <th>
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
              </th>

              <th>
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
              </th>

              <th>Survey Date</th>

              <th width="250">Action</th>
            </tr>
          </thead>

          <tbody>
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
                <tr key={index}>
                  {/* Serial number across filtered results */}
                  <td>{startIndex + index + 1}</td>

                  <td>{survey.parcel_no || "-"}</td>

                  <td>{survey.property_id || "-"}</td>

                  <td>{survey.existing_property_id || "-"}</td>

                  <td>{survey.owner_name || "-"}</td>

                  <td>{survey.mobile_number || "-"}</td>

                  <td>
                    {survey.survey_date
                      ? new Date(survey.survey_date).toLocaleDateString("en-GB")
                      : "-"}
                  </td>

                  <td>
                    <div className="edit-management-action-buttons">
                      <button className="preview-btn">
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