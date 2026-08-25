import React from "react";

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const displayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "string") {
    const normalized = value.toLowerCase().trim();

    if (normalized === "true") return "Yes";
    if (normalized === "false") return "No";
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.length ? `${value.length} file(s)` : "—";
    }

    if (value.text !== undefined) return String(value.text);
    if (value.remarks !== undefined) return String(value.remarks);
    if (value.value !== undefined) return String(value.value);
    if (value.name !== undefined) return String(value.name);
    if (value.url !== undefined) return String(value.url);

    return "—";
  }

  return String(value);
};

const isChecked = (value) => {
  if (value === true) return true;

  if (typeof value === "string") {
    const normalized = value.toLowerCase().trim();

    return ["true", "yes", "1", "checked"].includes(normalized);
  }

  if (typeof value === "number") {
    return value === 1;
  }

  return false;
};

const getImageSrc = (value) => {
  if (!value) return null;

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && value.url) {
    return value.url;
  }

  return null;
};

const getFloorSummary = (floorDetail) => {
  if (!Array.isArray(floorDetail) || floorDetail.length === 0) {
    return "—";
  }

  const floors = floorDetail.map((item) => item?.floor).filter(Boolean);

  return floors.length ? floors.join(", ") : "—";
};

/* =========================================================
   SECTION
========================================================= */

function Section({ number, title, children, className = "" }) {
  return (
    <section
      className={`w-full overflow-hidden border border-[#b7b7b7] bg-white ${className}`}
      style={{
        boxSizing: "border-box",
        marginBottom: "2.8mm",
      }}
    >
      {/* SECTION HEADER */}
      <div
        style={{
          borderBottom: "1px solid #b7b7b7",
          background: "#f2f2f2",
          padding: "1.4mm 2mm",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            margin: 0,
            padding: 0,
            fontSize: "8px",
            fontWeight: 700,
            lineHeight: "1",
            color: "#222",
          }}
        >
          {number}. {title}
        </h2>
      </div>

      {/* SECTION CONTENT */}
      <div
        style={{
          padding: "1.2mm 2mm",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({ label, value, date = false }) {
  return (
    <div
      className="flex w-full items-center border-b border-[#dedede]"
      style={{
        minHeight: "5.8mm",
        boxSizing: "border-box",
      }}
    >
      {/* LABEL */}
      <div
        style={{
          width: "48%",
          minWidth: 0,
          paddingRight: "2mm",
          paddingLeft: "1mm",
          fontSize: "7.1px",
          fontWeight: 700,
          lineHeight: "1.15",
          color: "#292929",
          boxSizing: "border-box",
        }}
      >
        {label}
      </div>

      {/* VALUE */}
      <div
        style={{
          width: "52%",
          minWidth: 0,
          paddingLeft: "1.5mm",
          paddingRight: "1mm",
          fontSize: "7.1px",
          fontWeight: 400,
          lineHeight: "1.15",
          color: "#333",
          overflowWrap: "break-word",
          wordBreak: "break-word",
          boxSizing: "border-box",
        }}
      >
        {date ? formatDate(value) : displayValue(value)}
      </div>
    </div>
  );
}

/* =========================================================
   CHECK ITEM
========================================================= */

function CheckItem({ label, checked, widthClass = "w-1/4" }) {
  const active = isChecked(checked);

  return (
    <div
      className={`${widthClass} box-border flex items-center gap-[7px] border-b border-r border-[#bcbcbc] px-[6px] py-[3px]`}
      style={{
        minHeight: "8mm",
        boxSizing: "border-box",
      }}
    >
      {/* CHECKBOX */}
      <span
        style={{
          width: "12px",
          height: "12px",
          minWidth: "12px",
          minHeight: "12px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          boxSizing: "border-box",

          border: active ? "1.8px solid #111" : "1.4px solid #555",

          backgroundColor: active ? "#111" : "#fff",

          color: active ? "#fff" : "transparent",

          fontSize: "9px",
          fontWeight: 900,
          lineHeight: 1,

          fontFamily: "Arial, Helvetica, sans-serif",

          flexShrink: 0,
        }}
      >
        {active ? "✓" : ""}
      </span>

      {/* LABEL */}
      <span
        style={{
          minWidth: 0,
          flex: 1,
          fontSize: "6.8px",
          lineHeight: "1.2",
          color: "#222",
          fontWeight: 500,
          overflowWrap: "break-word",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   DOCUMENT ITEM
========================================================= */

function DocumentItem({ label, uploaded, count }) {
  return (
    <div
      className="box-border flex w-1/2 items-center gap-[5px] border-b border-r border-[#bcbcbc] px-[6px] py-[2.5px]"
      style={{
        minHeight: "7.2mm",
      }}
    >
      {/* STATUS DOT */}
      <span
        style={{
          width: "7px",
          height: "7px",
          minWidth: "7px",
          borderRadius: "50%",
          backgroundColor: uploaded ? "#222" : "#b5b5b5",
          flexShrink: 0,
        }}
      />

      {/* DOCUMENT NAME */}
      <span className="min-w-0 flex-1 text-[6.7px] leading-tight text-[#333]">
        {label}
      </span>

      {/* STATUS */}
      <strong className="shrink-0 whitespace-nowrap text-[6.1px] font-semibold text-[#555]">
        {uploaded ? `Uploaded${count ? ` (${count})` : ""}` : "Not Uploaded"}
      </strong>
    </div>
  );
}

/* =========================================================
   IMAGE BOX
========================================================= */

function ImageBox({ src, title }) {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col overflow-hidden border border-[#b5b5b5] bg-white"
      style={{
        height: "37mm",
        boxSizing: "border-box",
      }}
    >
      {/* IMAGE AREA */}
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#fafafa]">
        {src ? (
          <img
            src={src}
            alt={title}
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[7px] font-semibold text-[#999]">NO IMAGE</span>
        )}
      </div>

      {/* IMAGE TITLE */}
      <div className="flex h-[5mm] shrink-0 items-center justify-center border-t border-[#b5b5b5] bg-white px-1 text-center text-[6.5px] font-bold leading-none text-[#333]">
        {title}
      </div>
    </div>
  );
}

/* =========================================================
   QUICK INFO STRIP
   Fixed: values were getting vertically clipped
========================================================= */

function QuickInfoStrip({ items }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",

        /* Don't force a very small height */
        minHeight: "14mm",

        boxSizing: "border-box",

        border: "1px solid #555",

        backgroundColor: "#fff",

        marginBottom: "2.5mm",

        overflow: "visible",
      }}
    >
      {items.map(([label, value], index) => (
        <div
          key={label}
          style={{
            width: `${100 / items.length}%`,

            minWidth: 0,

            boxSizing: "border-box",

            padding: "2.2mm 2.5mm 2.5mm 2.5mm",

            borderRight:
              index !== items.length - 1
                ? "1px solid #555"
                : "none",

            display: "flex",
            flexDirection: "column",

            justifyContent: "center",

            overflow: "visible",
          }}
        >
          {/* LABEL */}
          <div
            style={{
              margin: 0,
              padding: 0,

              fontSize: "6.2px",

              fontWeight: 700,

              lineHeight: "2.8mm",

              color: "#666",

              textTransform: "uppercase",

              whiteSpace: "nowrap",

              overflow: "visible",
            }}
          >
            {label}
          </div>

          {/* VALUE */}
          <div
            style={{
              marginTop: "0.8mm",

              padding: 0,

              fontSize: "8px",

              fontWeight: 700,

              lineHeight: "3.5mm",

              color: "#222",

              minHeight: "3.5mm",

              whiteSpace: "nowrap",

              overflow: "visible",

              textOverflow: "clip",

              wordBreak: "normal",

              overflowWrap: "normal",

              boxSizing: "border-box",
            }}
          >
            {displayValue(value)}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SurveyReportTemplate({ survey }) {
  if (!survey) {
    return null;
  }

  /* =======================================================
     API DATA
  ======================================================= */

  const info = survey.survey_information || {};

  const owner = survey.owner_details || {};

  const property = survey.property_details || {};

  const land = survey.land_building_information || {};

  const usage = survey.usage_details || {};

  const utility = survey.utility_connections || {};

  const gis = survey.gis_information || {};

  const verification = survey.verification || {};

  const documents = survey.documents_collected || {};

  const remarks =
    survey.surveyor_remarks?.surveyor_remarks ?? survey.surveyor_remarks;

  /* =======================================================
     GIS FIELDS
  ======================================================= */

  const gisFields = [
    ["GIS Property Polygon", "gis_property_polygon_available"],
    ["Boundary Verified", "property_boundary_verified"],
    ["Geo Tag Completed", "geo_tag_completed"],
    ["Property Photo Captured", "property_photo_captured"],
  ];

  /* =======================================================
     VERIFICATION FIELDS
  ======================================================= */

  const verificationFields = [
    ["Unassessed Property", "unassessed_property"],
    ["Under Assessed Property", "under_assessed_property"],
    ["Property Use Changed", "property_use_changed"],
    ["Additional Floor Constructed", "additional_floor_constructed"],
    ["Boundary Changed", "boundary_changed"],
    ["Ownership Changed", "ownership_changed"],
    ["Demolished Property", "demolished_property"],
    ["New Property", "new_property"],
  ];

  /* =======================================================
     DOCUMENT FIELDS
  ======================================================= */

  const documentFields = [
    ["Aadhaar Copy", "aadhaar_copy", "aadhaar_copy_files"],
    ["Electricity Bill", "electricity_bill", "electricity_bill_files"],
    ["Water Bill", "water_bill", "water_bill_files"],
    ["Sale Deed", "sale_deed", "sale_deed_files"],
    [
      "Property Tax Receipt",
      "property_tax_receipt",
      "property_tax_receipt_files",
    ],
    ["Building Permission", "building_permission", "building_permission_files"],
    ["Other Documents", "other_documents", "other_documents_files"],
  ];

  /* =======================================================
     IMAGE FIELDS
  ======================================================= */

  const imageFields = [
    ["Front Elevation", gis.front_elevation_photo_path],
    ["Name Plate", gis.name_plate_photo_path],
    ["Property Photo", gis.property_photo_path],
  ];

  /* =======================================================
     REPORT
  ======================================================= */

  return (
    <div
      id="survey-report"
      style={{
        width: "204mm",
        margin: "0 auto",
        padding: "4mm",

        boxSizing: "border-box",

        backgroundColor: "#fff",

        fontFamily: "Arial, Helvetica, sans-serif",

        color: "#333",
      }}
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <header
        style={{
          textAlign: "center",

          borderBottom: "1.5px solid #333",

          paddingBottom: "2.5mm",

          marginBottom: "2.5mm",
        }}
      >
        <h1
          style={{
            margin: 0,
            padding: 0,

            fontSize: "12px",
            fontWeight: 700,
            lineHeight: "1.15",

            color: "#111",

            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          OFFICE OF THE MUNICIPAL CORPORATION / MUNICIPAL COUNCIL / MUNICIPALITY
        </h1>

        <p
          style={{
            margin: "1mm 0 0",

            fontSize: "7.5px",
            fontWeight: 700,
            lineHeight: "1.1",

            color: "#222",

            textAlign: "center",
          }}
        >
          KORBA NAGAR NIGAM, KORBA (CHHATTISGARH)
        </p>

        <p
          style={{
            margin: "0.8mm 0 0",

            fontSize: "6.5px",
            lineHeight: "1.1",

            color: "#666",

            textAlign: "center",
          }}
        >
          Property Survey &amp; Assessment Report
        </p>
      </header>

      {/* ===================================================
          QUICK INFO
      =================================================== */}

      <QuickInfoStrip
        items={[
          ["Survey ID", info.survey_id],
          ["Property ID", info.property_id],
          ["Parcel No.", info.parcel_no],
          ["Surveyor", info.surveyor_name],
        ]}
      />

      {/* ===================================================
          1. SURVEY INFORMATION
      =================================================== */}

      <Section number="1" title="SURVEY INFORMATION">
        <div
          className="flex w-full"
          style={{
            gap: "5px",
          }}
        >
          {/* COLUMN 1 */}
          <div
            className="min-w-0 flex-1"
            style={{
              width: "25%",
            }}
          >
            <Field label="Survey ID" value={info.survey_id} />

            <Field label="Survey Date" value={info.survey_date} date />

            <Field label="Ward No." value={info.ward_no} />

            <Field label="Zone" value={info.zone} />
          </div>

          {/* COLUMN 2 */}
          <div
            className="min-w-0 flex-1"
            style={{
              width: "25%",
            }}
          >
            <Field label="Property ID" value={info.property_id} />

            <Field
              label="Existing Property ID"
              value={info.existing_property_id}
            />

            <Field label="Parcel Number" value={info.parcel_no} />

            <Field label="Colony / Locality" value={info.colony_locality} />
          </div>

          {/* COLUMN 3 */}
          <div
            className="min-w-0 flex-1"
            style={{
              width: "25%",
            }}
          >
            <Field label="Surveyor Name" value={info.surveyor_name} />

            <Field label="Surveyor ID" value={info.surveyor_id} />

            <Field label="Tax Rate Zone" value={info.tax_rate_zone} />

            <Field label="Property Location" value={info.property_location} />
          </div>

          {/* COLUMN 4 */}
          <div
            className="min-w-0 flex-1"
            style={{
              width: "25%",
            }}
          >
            <Field label="GPS Latitude" value={info.gps_latitude} />

            <Field label="GPS Longitude" value={info.gps_longitude} />
          </div>
        </div>
      </Section>

      {/* ===================================================
          2 + 3
      =================================================== */}

      <div
        className="flex gap-[5px]"
        style={{
          marginBottom: "2.8mm",
        }}
      >
        {/* 2. OWNER DETAILS */}

        <Section
          number="2"
          title="OWNER DETAILS"
          className="mb-0 min-w-0 flex-1"
        >
          <Field label="Owner Name" value={owner.owner_name} />

          <Field
            label="Father / Husband Name"
            value={owner.father_husband_name}
          />

          <Field label="Mobile Number" value={owner.mobile_number} />

          <Field
            label="Correspondence Address"
            value={owner.correspondence_address}
          />
        </Section>

        {/* 3. PROPERTY DETAILS */}

        <Section
          number="3"
          title="PROPERTY DETAILS"
          className="mb-0 min-w-0 flex-1"
        >
          <Field label="Property Status" value={property.property_status} />

          <Field
            label="Building Permission Available"
            value={property.building_permission_available}
          />

          <Field
            label="Property Ownership"
            value={property.property_ownership}
          />
        </Section>
      </div>

      {/* ===================================================
          4. LAND & BUILDING
      =================================================== */}

      <Section number="4" title="LAND & BUILDING INFORMATION">
        <div className="flex gap-x-[7px]">
          {/* COLUMN 1 */}

          <div className="min-w-0 flex-1">
            <Field label="Plot Area (Sq. Ft.)" value={land.plot_area} />

            <Field label="Plinth Area" value={land.plinth_area} />
          </div>

          {/* COLUMN 2 */}

          <div className="min-w-0 flex-1">
            <Field
              label="Year of Construction"
              value={land.year_of_construction}
            />

            <Field
              label="Building Age"
              value={
                land.building_age
                  ? `${land.building_age} Year(s)`
                  : land.building_age
              }
            />
          </div>

          {/* COLUMN 3 */}

          <div className="min-w-0 flex-1">
            <Field
              label="Total Built-up Area"
              value={land.total_builtup_area}
            />

            <Field
              label="Floor Details"
              value={getFloorSummary(land.floor_detail)}
            />
          </div>
        </div>
      </Section>

      {/* ===================================================
          5 + 6
      =================================================== */}

      <div
        className="flex gap-[5px]"
        style={{
          marginBottom: "2.8mm",
        }}
      >
        {/* 5. USAGE DETAILS */}

        <Section
          number="5"
          title="USAGE DETAILS"
          className="mb-0 min-w-0 flex-1"
        >
          <div className="flex gap-x-[7px]">
            {/* COLUMN 1 */}

            <div className="min-w-0 flex-1">
              <Field label="Primary Use" value={usage.primary_use} />

              <Field label="Mixed Use" value={usage.mixed_use} />

              <Field label="Occupancy" value={usage.occupancy} />
            </div>

            {/* COLUMN 2 */}

            <div className="min-w-0 flex-1">
              <Field label="No. of Families" value={usage.number_of_families} />

              <Field label="No. of Shops" value={usage.number_of_shops} />
            </div>
          </div>
        </Section>

        {/* 6. UTILITY CONNECTIONS */}

        <Section
          number="6"
          title="UTILITY CONNECTIONS"
          className="mb-0 min-w-0 flex-1"
        >
          <Field label="Sewer Connection" value={utility.sewer_connection} />

          <Field
            label="Electricity Connection"
            value={utility.is_electricity_connection}
          />

          <Field label="Gas Connection" value={utility.gas_connection} />
        </Section>
      </div>

      {/* ===================================================
          7. GIS INFORMATION
      =================================================== */}

      <Section number="7" title="GIS INFORMATION">
        <div className="flex flex-wrap overflow-hidden border-l border-t border-[#bcbcbc]">
          {gisFields.map(([label, key]) => (
            <CheckItem key={key} label={label} checked={gis[key]} />
          ))}
        </div>
      </Section>

      {/* ===================================================
          8. PROPERTY IMAGES
      =================================================== */}

      <Section number="8" title="PROPERTY IMAGES">
        <div className="flex gap-[7px]">
          {imageFields.map(([title, url]) => (
            <ImageBox key={title} title={title} src={getImageSrc(url)} />
          ))}
        </div>
      </Section>

      {/* ===================================================
          9. VERIFICATION
      =================================================== */}

      <Section number="9" title="VERIFICATION">
        <div className="flex flex-wrap overflow-hidden border-l border-t border-[#bcbcbc]">
          {verificationFields.map(([label, key]) => (
            <CheckItem key={key} label={label} checked={verification[key]} />
          ))}
        </div>
      </Section>

      {/* ===================================================
          10. DOCUMENTS
      =================================================== */}

      <Section number="10" title="DOCUMENTS">
        <div className="flex flex-wrap overflow-hidden border-l border-t border-[#bcbcbc]">
          {documentFields.map(([label, key, filesKey]) => (
            <DocumentItem
              key={key}
              label={label}
              uploaded={
                isChecked(documents[key]) ||
                (documents[key] !== undefined &&
                  documents[key] !== null &&
                  documents[key] !== "" &&
                  documents[key] !== "No" &&
                  documents[key] !== "false")
              }
              count={
                Array.isArray(documents[filesKey])
                  ? documents[filesKey].length
                  : 0
              }
            />
          ))}
        </div>
      </Section>

      {/* ===================================================
          11. SURVEYOR REMARKS
      =================================================== */}

      <Section number="11" title="SURVEYOR REMARKS" className="mb-0">
        <div
          style={{
            minHeight: "8mm",
            fontSize: "7px",
            lineHeight: 1.35,
            color: "#444",
            overflowWrap: "break-word",
          }}
        >
          {displayValue(remarks)}
        </div>
      </Section>

      {/* ===================================================
          SIGNATURES
          
          IMPORTANT:
          The labels are positioned inside each box using
          absolute positioning. This prevents the dashed
          NOTE border from passing through the text.
      =================================================== */}

      <div
        style={{
          display: "flex",
          width: "100%",
          gap: "8px",
          marginTop: "3mm",
          boxSizing: "border-box",
        }}
      >
        {[
          "Chief Municipal Officer",
          "Revenue Officer Signature",
          "Property Owner Signature",
        ].map((label) => (
          <div
            key={label}
            style={{
              position: "relative",

              width: "calc((100% - 16px) / 3)",

              height: "18mm",

              minWidth: 0,
              flexShrink: 0,

              boxSizing: "border-box",

              border: "1px solid #b7b7b7",

              backgroundColor: "#fff",

              overflow: "hidden",
            }}
          >
            {/* SIGNATURE LABEL */}

            <div
              style={{
                position: "absolute",

                left: 0,
                right: 0,

                bottom: "2.5mm",

                height: "4mm",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                backgroundColor: "#fff",

                padding: "0 2mm",

                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  display: "block",

                  width: "100%",

                  fontSize: "6.2px",

                  fontWeight: 700,

                  lineHeight: "4mm",

                  color: "#222",

                  textAlign: "center",

                  whiteSpace: "nowrap",

                  overflow: "hidden",

                  textOverflow: "ellipsis",

                  backgroundColor: "#fff",
                }}
              >
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ===================================================
          NOTE
      =================================================== */}

      <div
        style={{
          marginTop: "2.5mm",

          paddingTop: "1.5mm",

          borderTop: "1px dashed #777",

          fontSize: "5.8px",

          lineHeight: 1.35,

          color: "#555",
        }}
      >
        <strong>Note:</strong> This report has been prepared based on the
        information recorded in the property survey system. This document is not
        a final proof of property ownership.
      </div>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="mt-[1.5mm] flex items-center justify-between gap-4 text-[5.5px] text-[#666]">
        <span>System Generated Property Survey Report</span>

        <span>Generated on: {formatDate(new Date().toISOString())}</span>
      </footer>
    </div>
  );
}
