import {
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import "../SectionCard.css";
import "../SurveyPreview.css";

export default function VerificationCard({ data }) {
  if (!data) return null;

  const verificationItems = [
    {
      label: "Unassessed Property",
      value: data.unassessed_property,
    },
    {
      label: "Under Assessed Property",
      value: data.under_assessed_property,
    },
    {
      label: "Property Use Changed",
      value: data.property_use_changed,
    },
    {
      label: "Additional Floor Constructed",
      value: data.additional_floor_constructed,
    },
    {
      label: "Boundary Changed",
      value: data.boundary_changed,
    },
    {
      label: "Ownership Changed",
      value: data.ownership_changed,
    },
    {
      label: "Demolished Property",
      value: data.demolished_property,
    },
    {
      label: "New Property",
      value: data.new_property,
    },
  ];

  return (
    <div className="section-card">

      <div className="section-header">
        <h3>Verification</h3>
      </div>

      <div className="verification-grid">

        {verificationItems.map((item) => (

          <div
            key={item.label}
            className={`verification-item ${
              item.value ? "yes" : "no"
            }`}
          >

            {item.value ? (
              <FaCheckCircle className="status-icon" />
            ) : (
              <FaTimesCircle className="status-icon" />
            )}

            <span>{item.label}</span>

          </div>

        ))}

      </div>

    </div>
  );
}