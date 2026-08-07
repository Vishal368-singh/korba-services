import PreviewField from "./PreviewField";
import "../SectionCard.css";

export default function UsageDetailsCard({ data }) {
  if (!data) return null;

  return (
    <div className="section-card">

      <div className="section-header">
        <h3>Usage Details</h3>
      </div>

      <div className="section-body">

        <PreviewField
          label="Primary Use"
          value={data.primary_use}
        />

        <PreviewField
          label="Mixed Use"
          value={data.mixed_use}
          type="boolean"
        />

        <PreviewField
          label="Occupancy"
          value={data.occupancy}
        />

        <PreviewField
          label="Number of Families"
          value={data.number_of_families}
        />

        <PreviewField
          label="Number of Shops"
          value={data.number_of_shops}
        />

      </div>

    </div>
  );
}