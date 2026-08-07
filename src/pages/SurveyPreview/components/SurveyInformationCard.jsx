import PreviewField from "./PreviewField";
import "../SurveyPreview.css";

export default function SurveyInformationCard({ data }) {
  if (!data) return null;

  return (
    <div className="section-card">

      <div className="section-header">
        <h3>Survey Information</h3>
      </div>

      <div className="section-body">

        <PreviewField
          label="Parcel Number"
          value={data.parcel_no}
        />

        <PreviewField
          label="Property ID"
          value={data.property_id}
        />

        <PreviewField
          label="Existing Property ID"
          value={data.existing_property_id}
        />

        <PreviewField
          label="Property Location"
          value={data.property_location}
        />

        <PreviewField
          label="Tax Rate Zone"
          value={data.tax_rate_zone}
        />

        <PreviewField
          label="Survey ID"
          value={data.survey_id}
        />

        <PreviewField
          label="Survey Date"
          value={data.survey_date}
          type="date"
        />

        <PreviewField
          label="Surveyor Name"
          value={data.surveyor_name}
        />

        <PreviewField
          label="Surveyor ID"
          value={data.surveyor_id}
        />

        <PreviewField
          label="Ward No"
          value={data.ward_no}
        />

        <PreviewField
          label="Zone"
          value={data.zone}
        />

        <PreviewField
          label="Colony / Locality"
          value={data.colony_locality}
        />

        <PreviewField
          label="GPS Latitude"
          value={data.gps_latitude}
        />

        <PreviewField
          label="GPS Longitude"
          value={data.gps_longitude}
        />

      </div>

    </div>
  );
}