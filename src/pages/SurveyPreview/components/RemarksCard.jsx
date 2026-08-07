import "../SectionCard.css";
import "../SurveyPreview.css";

export default function RemarksCard({ data }) {
  if (!data) return null;

  return (
    <div className="section-card">

      <div className="section-header">
        <h3>Surveyor Remarks</h3>
      </div>

      <div className="remarks-container">

        <textarea
          value={data.surveyor_remarks || ""}
          readOnly
          rows={6}
        />

      </div>

    </div>
  );
}