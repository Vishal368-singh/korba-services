import PreviewField from "./PreviewField";
import "../SectionCard.css";

export default function OwnerDetailsCard({ data }) {
  if (!data) return null;

  return (
    <div className="section-card">

      <div className="section-header">
        <h3>Owner Details</h3>
      </div>

      <div className="section-body">

        <PreviewField
          label="Owner Name"
          value={data.owner_name}
        />

        <PreviewField
          label="Father / Husband Name"
          value={data.father_husband_name}
        />

        <PreviewField
          label="Mobile Number"
          value={data.mobile_number}
        />

        <PreviewField
          label="Correspondence Address"
          value={data.correspondence_address}
        />

      </div>

    </div>
  );
}