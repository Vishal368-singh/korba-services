import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "./RejectModal.css";
import SearchableMultiSelect from "./SearchableMultiSelect"; // adjust path
const REJECT_REASONS = [
  "Area & Building Information Issues",
  "Data Inconsistency",
  "Duplicate & Existing Record Issues",
  "Field Verification / Suspected Irregularity",
  "Incorrect Built-up Area",
  "Incorrect Location / Geo-tag",
  "Incorrect Occupancy Status",
  "Missing Photographs",
  "Missing Tenant Information",
  "Owner/Property Information Issues",
  "Photograph/Image Issues",
  "Poor Image Quality / Image Data Readability Issue",
  "Property ID Issue",
];

export default function RejectModal({ isOpen, onClose, onSubmit, surveyId }) {
  const [reason, setReason] = useState([]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (reason.length === 0) {
      setError("Please select at least one reason.");
      return;
    }
    onSubmit({ surveyId, reason, description }); // reason is now an array
    handleClose();
  };

  const handleClose = () => {
    setReason([]);
    setDescription("");
    setError("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Reject Surveys</h3>
          <button className="modal-close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="reject-reason">Reason</label>

            <div className="form-group">
              <SearchableMultiSelect
                options={REJECT_REASONS}
                selected={reason}
                onChange={(newSelected) => {
                  setReason(newSelected);
                  setError("");
                }}
                placeholder="Select reason(s)"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="reject-description">Description</label>
            <textarea
              id="reject-description"
              rows={4}
              placeholder="Add additionals details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>
        <div className="modal-footer">
          <button className="close-btn" onClick={handleClose}>
            Close
          </button>
          <button className="reject-confirm-btn" onClick={handleSubmit}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
