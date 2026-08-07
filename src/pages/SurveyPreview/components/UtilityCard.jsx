import PreviewField from "./PreviewField";
import "../SectionCard.css";

export default function UtilityCard({ data }) {
  if (!data) return null;

  const getBoolean = (value) => {
    if (typeof value === "boolean") return value;

    if (typeof value === "string") {
      return value.toLowerCase() === "true";
    }

    return false;
  };

  return (
    <div className="section-card">

      <div className="section-header">
        <h3>Utility Connections</h3>
      </div>

      <div className="section-body">

        <PreviewField
          label="Sewer Connection"
          value={getBoolean(data.sewer_connection)}
          type="boolean"
        />

        <PreviewField
          label="Electricity Connection"
          value={getBoolean(data.is_electricity_connection)}
          type="boolean"
        />

        <PreviewField
          label="Gas Connection"
          value={getBoolean(data.gas_connection)}
          type="boolean"
        />

      </div>

    </div>
  );
}