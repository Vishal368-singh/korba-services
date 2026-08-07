import PreviewField from "./PreviewField";
import "../SectionCard.css";

export default function PropertyDetailsCard({ data }) {
  if (!data) return null;

  return (
    <div className="section-card">

      <div className="section-header">
        <h3>Property Details</h3>
      </div>

      <div className="section-body">

        <PreviewField
          label="Property Status"
          value={data.property_status}
        />

        <PreviewField
          label="Building Permission Available"
          value={data.building_permission_available}
          type="boolean"
        />

        <PreviewField
          label="Property Ownership"
          value={data.property_ownership}
        />

      </div>

    </div>
  );
}