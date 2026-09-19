import { useState, useEffect, useCallback } from "react";
import { FaSyncAlt, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { fetchAllSurveys } from "../../services/api";
import SurveyFilter from "../Survey/SurveyFilter";
import Pagination from "../Survey/Pagination";
import notify from "../../utils/toast";

const Editmanagement = () => {
  const navigate = useNavigate();

  const [surveyData, setSurveyData] = useState({});
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    total_surveys: 0,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });

  // =========================================================
  // LOAD SURVEY DATA
  // =========================================================

  const loadSurveyData = useCallback(
    async (pageOverride) => {
      const pageToUse = pageOverride ?? currentPage;

      try {
        setLoading(true);

        const response = await fetchAllSurveys(pageToUse);

        console.log("Edit Management Response:", response);

        const paginationSource = response?.pagination || response || {};

        const surveysObj = response?.surveys || {};

        setSurveyData(surveysObj);

        setPagination({
          total_surveys: paginationSource.total_surveys ?? 0,

          total_pages: paginationSource.total_pages ?? 1,

          has_next: paginationSource.has_next ?? false,

          has_previous: paginationSource.has_previous ?? false,
        });
      } catch (error) {
        console.error("Error fetching Edit Management data:", error);

        setSurveyData({});

        notify.error("Failed to load survey data");
      } finally {
        setLoading(false);
      }
    },
    [currentPage],
  );

  // =========================================================
  // INITIAL LOAD / PAGE CHANGE
  // =========================================================

  useEffect(() => {
    loadSurveyData();
  }, [loadSurveyData]);

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefreshClick = async () => {
    await loadSurveyData();

    notify.success("Data Refresh");
  };

  // =========================================================
  // PAGE CHANGE
  // =========================================================

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // =========================================================
  // EDIT SURVEY
  // =========================================================

  const handleEdit = (surveyId) => {
    navigate(`/surveys/${surveyId}`);
  };

  const hasData = Object.keys(surveyData).length > 0;

  // =========================================================
  // RENDER
  // =========================================================

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

        <div className="header-actions">
          <button
            className="refresh-btn"
            onClick={handleRefreshClick}
            disabled={loading}
          >
            <FaSyncAlt />

            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* ================= FILTER ================= */}

      <SurveyFilter />

      {/* ================= TABLE ================= */}

      <div className="table-container">
        <table className="survey-table">
          <thead>
            <tr>
              <th>Survey ID</th>
              <th>Parcel No</th>
              <th>Surveyor ID</th>
              <th>Surveyor Name</th>
              <th>Zone</th>
              <th>Survey Date</th>
              <th>Status</th>
              <th width="250">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">
                  <div className="table-empty">
                    <h3>Loading...</h3>
                    <p>Fetching survey records.</p>
                  </div>
                </td>
              </tr>
            ) : hasData ? (
              Object.entries(surveyData).map(([surveyId, survey]) => (
                <tr key={surveyId}>
                  <td>{survey.survey_id}</td>

                  <td>{survey.parcel_no}</td>

                  <td>{survey.surveyor_id}</td>

                  <td>{survey.surveyor_name}</td>

                  <td>{survey.zone}</td>

                  <td>{survey.survey_date}</td>

                  <td>{survey.status}</td>

                  <td>
                    <div className="action-buttons">
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
            ) : (
              <tr>
                <td colSpan="8">
                  <div className="table-empty">
                    <h3>No Survey Found</h3>

                    <p>No survey data available.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}

      <Pagination
        totalRecords={pagination.total_surveys}
        currentPage={currentPage}
        totalPages={pagination.total_pages}
        hasNext={pagination.has_next}
        hasPrevious={pagination.has_previous}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Editmanagement;
