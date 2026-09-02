import { useState } from "react";
import { FaEye, FaCheck, FaTimes, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RejectModal from "../../components/Rejectmodal";
import { approveSurveyAPI } from "../../services/api";
import { updateSurveyStatus } from "../../services/api";
import { fetchSurveyBySurveyID } from "../../services/api";
import { generateSurveyPdf } from "../../utils/generateSurveyPdf";
import { canManageSurveys } from "../../utils/roleUtils";

export default function SurveyTable({
  data = [],
  activeTab,
  onActionComplete,
}) {
  const navigate = useNavigate();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const canManage = canManageSurveys();

  const handleDownloadReport = async (surveyId) => {
    try {
      setDownloadingId(surveyId);
      const response = await fetchSurveyBySurveyID(surveyId);
      if (response.success) {
        await generateSurveyPdf(response.survey);
      }
    } catch (error) {
      console.error("Failed to generate survey report:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreview = (surveyId) => {
    navigate(`/surveys/${surveyId}`);
  };
  const getApproveInfo = () => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    return {
      approved_by: user?.username || "",
      approver_id: user?.user_id || "",
    };
  };
  const handleApprove = async (surveyId) => {
    try {
      const { approved_by, approver_id } = getApproveInfo();

      await updateSurveyStatus({
        survey_id: surveyId,
        action: "approve",
        approved_by,
        approver_id,
        reason: "",
        reason_remark: "",
      });
      onActionComplete?.("approve");
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = (surveyId) => {
    setSelectedSurveyId(surveyId);
    setRejectModalOpen(true);
    // TODO
    // Open Reject Modal
  };

  const handleRejectSubmit = async ({ surveyId, reason, description }) => {
    try {
      const { approved_by, approver_id } = getApproveInfo();
      await updateSurveyStatus({
        survey_id: surveyId,
        action: "reject",
        approved_by,
        approver_id,
        reason: reason.join(","),
        reason_remark: description.trim() || "No additional remarks",
      });
      setRejectModalOpen(false);
      onActionComplete?.("reject");
    } catch (error) {
      console.error(error);
    }
  };

  if (!Object.keys(data).length) {
    return (
      <div className="table-empty">
        <h3>No Survey Found</h3>
        <p>No survey data available.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="survey-table">
        <thead>
          <tr>
            <th>Survey ID</th>
            <th>Parcel No</th>
            <th>Surveyor ID</th>
            <th>Surveyor Name</th>
            {/* <th>Ward</th> */}
            <th>Zone</th>
            {/* <th>Surveyor ID</th> */}
            <th>Survey Date</th>
            <th>Status</th>
            <th width="250">Action</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(data).map(([surveyId, survey]) => (
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
                  {activeTab === "All" && canManage &&(
                    <button
                      className="preview-btn"
                      onClick={() => handlePreview(survey.survey_id)}
                    >
                      <FaEye />
                      View / Edit
                    </button>
                  )}
                  {activeTab === "All" && (
                    <button
                      className="preview-btn"
                      onClick={() => handleDownloadReport(survey.survey_id)}
                      disabled={downloadingId === survey.survey_id}
                    >
                      <FaDownload />
                      {downloadingId === survey.survey_id
                        ? "Generating..."
                        : "Download"}
                    </button>
                  )}
                  {activeTab === "Pending" && canManage && (
                    <>
                      <button
                        className="preview-btn"
                        onClick={() => handlePreview(survey.survey_id)}
                      >
                        <FaEye />
                        View / Edit
                      </button>
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(survey.survey_id)}
                      >
                        <FaCheck />
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => handleReject(survey.survey_id)}
                      >
                        <FaTimes />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <RejectModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onSubmit={handleRejectSubmit}
        surveyId={selectedSurveyId}
      />
    </div>
  );
}
