const PRIMARY = "#7a1453";

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${d.getFullYear()}`;
};

const displayValue = (val) => {
  if (val === null || val === undefined || val === "") return "-";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  return String(val);
};

function SectionTable({ title, fields, data }) {
  if (!data) return null;

  return (
    <div style={{ marginBottom: "18px", breakInside: "avoid" }}>
      <div
        style={{
          backgroundColor: PRIMARY,
          color: "#fff",
          padding: "8px 12px",
          fontSize: "13px",
          fontWeight: 700,
          borderRadius: "4px 4px 0 0",
        }}
      >
        {title}
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "12px",
          border: "1px solid #e5e7eb",
          borderTop: "none",
        }}
      >
        <tbody>
          {fields.map(([label, key, isDate], idx) => (
            <tr key={key} style={{ backgroundColor: idx % 2 === 0 ? "#faf7f9" : "#fff" }}>
              <td
                style={{
                  padding: "7px 12px",
                  fontWeight: 600,
                  color: "#4b5563",
                  width: "35%",
                  borderBottom: "1px solid #f0f0f0",
                  verticalAlign: "top",
                }}
              >
                {label}
              </td>
              <td
                style={{
                  padding: "7px 12px",
                  color: "#111827",
                  borderBottom: "1px solid #f0f0f0",
                  verticalAlign: "top",
                  wordBreak: "break-word",
                }}
              >
                {isDate ? formatDate(data[key]) : displayValue(data[key])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Boolean-style checklist section (Verification flags)
function ChecklistSection({ title, fields, data }) {
  if (!data) return null;

  return (
    <div style={{ marginBottom: "18px", breakInside: "avoid" }}>
      <div
        style={{
          backgroundColor: PRIMARY,
          color: "#fff",
          padding: "8px 12px",
          fontSize: "13px",
          fontWeight: 700,
          borderRadius: "4px 4px 0 0",
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "6px",
          border: "1px solid #e5e7eb",
          borderTop: "none",
          padding: "10px 12px",
          fontSize: "12px",
        }}
      >
        {fields.map(([label, key]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                display: "inline-block",
                width: "14px",
                height: "14px",
                borderRadius: "3px",
                border: `1px solid ${PRIMARY}`,
                backgroundColor: data[key] ? PRIMARY : "#fff",
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#374151" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Documents section (upload status)
function DocumentsSection({ data }) {
  if (!data) return null;

  const fields = [
    ["Aadhaar Copy", "aadhaar_copy"],
    ["Electricity Bill", "electricity_bill"],
    ["Water Bill", "water_bill"],
    ["Sale Deed", "sale_deed"],
    ["Property Tax Receipt", "property_tax_receipt"],
    ["Building Permission", "building_permission"],
    ["Other Documents", "other_documents"],
  ];

  return (
    <div style={{ marginBottom: "18px", breakInside: "avoid" }}>
      <div
        style={{
          backgroundColor: PRIMARY,
          color: "#fff",
          padding: "8px 12px",
          fontSize: "13px",
          fontWeight: 700,
          borderRadius: "4px 4px 0 0",
        }}
      >
        Documents
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "12px",
          border: "1px solid #e5e7eb",
          borderTop: "none",
        }}
      >
        <tbody>
          {fields.map(([label, key], idx) => (
            <tr key={key} style={{ backgroundColor: idx % 2 === 0 ? "#faf7f9" : "#fff" }}>
              <td
                style={{
                  padding: "7px 12px",
                  fontWeight: 600,
                  color: "#4b5563",
                  width: "35%",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                {label}
              </td>
              <td
                style={{
                  padding: "7px 12px",
                  borderBottom: "1px solid #f0f0f0",
                  color: data[key] ? "#16a34a" : "#9ca3af",
                  fontWeight: 600,
                }}
              >
                {data[key] ? "Uploaded" : "Not Uploaded"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SurveyReportTemplate({ survey }) {
  if (!survey) return null;
console.log(survey, "survey in report template");
  const info = survey.survey_information || {};

  return (
    <div
      style={{
        width: "780px",
        padding: "32px",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#111827",
        backgroundColor: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `3px solid ${PRIMARY}`,
          paddingBottom: "14px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "20px", color: PRIMARY }}>
            Property Survey Report
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280" }}>
            Korba Nagar Nigam
          </p>
        </div>
        <div style={{ textAlign: "right", fontSize: "11px", color: "#6b7280" }}>
          Generated on {formatDate(new Date().toISOString())}
        </div>
      </div>

      {/* Summary strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {[
          ["Survey ID", info.survey_id],
          ["Property ID", info.property_id],
          ["Parcel No", info.parcel_no],
          ["Surveyor", info.surveyor_name],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "10px 12px" }}
          >
            <div style={{ fontSize: "10px", color: "#9ca3af", marginBottom: "3px" }}>{label}</div>
            <div style={{ fontSize: "13px", fontWeight: 700 }}>{value || "-"}</div>
          </div>
        ))}
      </div>

      <SectionTable
        title="Survey Information"
        data={survey.survey_information}
        fields={[
          ["Parcel Number", "parcel_no"],
          ["Property ID", "property_id"],
          ["Existing Property ID", "existing_property_id"],
          ["Property Location", "property_location"],
          ["Tax Rate Zone", "tax_rate_zone"],
          ["Survey ID", "survey_id"],
          ["Survey Date", "survey_date", true],
          ["Surveyor Name", "surveyor_name"],
          ["Surveyor ID", "surveyor_id"],
          ["Ward No", "ward_no"],
          ["Zone", "zone"],
          ["Colony / Locality", "colony_locality"],
          ["GPS Latitude", "gps_latitude"],
          ["GPS Longitude", "gps_longitude"],
        ]}
      />

      <SectionTable
        title="Owner Details"
        data={survey.owner_details}
        fields={[
          ["Owner Name", "owner_name"],
          ["Father / Husband Name", "father_husband_name"],
          ["Mobile Number", "mobile_number"],
          ["Correspondence Address", "correspondence_address"],
        ]}
      />

      <SectionTable
        title="Property Details"
        data={survey.property_details}
        fields={[
          ["Property Status", "property_status"],
          ["Building Permission Available", "building_permission_available"],
          ["Property Ownership", "property_ownership"],
        ]}
      />

      <SectionTable
        title="Land & Building Information"
        data={survey.land_building_information}
        fields={[
          ["Plot Area (Sq. Ft.)", "plot_area"],
          ["Plinth Area", "plinth_area"],
          ["Year Of Construction", "year_of_construction"],
          ["Building Age", "building_age"],
          ["Total Built-up Area", "total_builtup_area"],
          ["Floor Details", "floor_details"],
        ]}
      />

      <SectionTable
        title="Usage Details"
        data={survey.usage_details}
        fields={[
          ["Primary Use", "primary_use"],
          ["Mixed Use", "mixed_use"],
          ["Occupancy", "occupancy"],
          ["Number of Families", "number_of_families"],
          ["Number of Shops", "number_of_shops"],
        ]}
      />

      <SectionTable
        title="Utility Connections"
        data={survey.utility_connections}
        fields={[
          ["Sewer Connection", "sewer_connection"],
          ["Electricity Connection", "electricity_connection"],
          ["Gas Connection", "gas_connection"],
        ]}
      />

      <ChecklistSection
        title="Verification"
        data={survey.verification}
        fields={[
          ["Unassessed Property", "unassessed_property"],
          ["Under Assessed Property", "under_assessed_property"],
          ["Property Use Changed", "property_use_changed"],
          ["Additional Floor Constructed", "additional_floor_constructed"],
          ["Boundary Changed", "boundary_changed"],
          ["Ownership Changed", "ownership_changed"],
          ["Demolished Property", "demolished_property"],
          ["New Property", "new_property"],
        ]}
      />

      <DocumentsSection data={survey.documents_collected} />

      <SectionTable
        title="Surveyor Remarks"
        data={{ remarks: survey.surveyor_remarks }}
        fields={[["Remarks", "remarks"]]}
      />

      <div
        style={{
          marginTop: "24px",
          paddingTop: "12px",
          borderTop: "1px solid #e5e7eb",
          fontSize: "10px",
          color: "#9ca3af",
          textAlign: "center",
        }}
      >
        This is a system-generated report. Korba Nagar Nigam — Property Survey Management
      </div>
    </div>
  );
}