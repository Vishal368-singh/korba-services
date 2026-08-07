import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SurveyTable({ data = [], activeTab }) {
  const navigate = useNavigate();

  const handlePreview = (surveyId) => {
    navigate(`/surveys/${surveyId}`);
  };

  const handleApprove = (surveyId) => {
    console.log("Approve :", surveyId);

    // TODO
    // Call Approve API
  };

  const handleReject = (surveyId) => {
    console.log("Reject :", surveyId);

    // TODO
    // Open Reject Modal
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

            <td>
                <span className={`status ${activeTab.toLowerCase()}`}>
                {activeTab === "Pending" ? "Pending" : activeTab === "Approved" ? "Approved" : "Rejected"}
                </span>
            </td>

            <td>
                <div className="action-buttons">
                <button
                    className="preview-btn"
                    onClick={() => handlePreview(survey.survey_id)}
                >
                    <FaEye />
                    Preview
                </button>

                {activeTab === "Pending" && (
                    <>
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

    </div>
  );
}