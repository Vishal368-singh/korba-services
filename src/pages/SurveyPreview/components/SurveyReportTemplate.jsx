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

const toNumber = (value) => {
  const number = parseFloat(value);
  return Number.isNaN(number) ? 0 : number;
};

/* =========================================================
   IMAGE URL
========================================================= */

const getImageSrc = (value) => {
  if (!value) return null;

  let url = null;

  if (typeof value === "string") {
    url = value;
  } else if (typeof value === "object" && value.url) {
    url = value.url;
  }

  if (!url) return null;

  if (url.startsWith("https://weather.mlinfomap.com/")) {
    return url.replace("https://weather.mlinfomap.com", "/gis-images");
  }

  if (url.startsWith("http://weather.mlinfomap.com/")) {
    return url.replace("http://weather.mlinfomap.com", "/gis-images");
  }

  if (url.startsWith("/gis-images/")) {
    return url;
  }

  return url;
};
/* =========================================================
   WATER SUPPLY CONNECTION
========================================================= */

function UtilityConnectionsSection({ survey }) {
  const utility = survey?.utility_connections || {};

  const waterSupplyProvided = utility.water_connection_no ? "Yes" : "No";
  const waterSupplyNumber = utility.water_connection_no ?? "";

  const sewerageConnection = utility.sewer_connection;
  const sewerageType = utility.sewerage_type ?? utility.sewer_type ?? "";

  const doorToDoorCollection = utility.door_to_door_collection;
  const doorToDoorCollectionType =
    utility.door_to_door_collection_type ?? utility.waste_collection_type ?? "";

  const blankIfMissing = (value) => {
    if (value === null || value === undefined || value === "") {
      return "—";
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    return String(value);
  };

  const rowStyle = {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    minHeight: "3mm",
    marginBottom: "2.5mm",
    fontSize: "8px",
    lineHeight: "1.4",
    color: "#222",
  };

  const labelStyle = {
    fontWeight: 700,
  };

  const valueStyle = {
    marginLeft: "2mm",
    fontWeight: 400,
    whiteSpace: "nowrap",
  };

  return (
    <section
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "4mm 1mm",
        marginTop: "0mm",
        marginBottom: "2.5mm",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          gap: "18mm",
          boxSizing: "border-box",
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ width: "50%", minWidth: 0, boxSizing: "border-box" }}>
          <div style={rowStyle}>
            <span style={labelStyle}>
              1. Water Supply Connection provided by Municipal Council (Yes/No):
            </span>
            <span style={valueStyle}>{waterSupplyProvided}</span>
          </div>

          <div style={rowStyle}>
            <span style={labelStyle}>2. Sewerage Connection (Yes/No):</span>
            <span style={valueStyle}>{blankIfMissing(sewerageConnection)}</span>
          </div>

          <div style={{ ...rowStyle, marginBottom: 0 }}>
            <span style={labelStyle}>3. Door to Door Collection (Yes/No):</span>
            <span style={valueStyle}>
              {blankIfMissing(doorToDoorCollection)}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: "50%", minWidth: 0, boxSizing: "border-box" }}>
          <div style={rowStyle}>
            <span style={labelStyle}>
              If yes, water supply connection number :
            </span>
            <span style={valueStyle}>{blankIfMissing(waterSupplyNumber)}</span>
          </div>

          <div style={rowStyle}>
            <span style={labelStyle}>If yes, Sewerage Type:</span>
            <span style={valueStyle}>{blankIfMissing(sewerageType)}</span>
          </div>

          <div style={{ ...rowStyle, marginBottom: 0 }}>
            <span style={labelStyle}>If yes, Collection Type:</span>
            <span style={valueStyle}>
              {blankIfMissing(doorToDoorCollectionType)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeclarationSection({ survey }) {
  const owner = survey?.owner_details || {};
  const ownerName = owner.owner_name || "—";
  const fatherHusbandName = owner.father_husband_name || "—";

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        marginTop: "3mm",
        paddingTop: "2.5mm",
        borderTop: "1px dashed #777",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "7px",
          lineHeight: "1.5",
          color: "#222",
        }}
      >
        The property owner's name is{" "}
        <strong style={{ textDecoration: "underline" }}>{ownerName}</strong>,
        father's/husband's name is{" "}
        <strong style={{ textDecoration: "underline" }}>
          {fatherHusbandName}
        </strong>
        . Based on the GIS survey of your house/plot, the property tax survey
        work has been completed through a single page. Through this, complete
        information about your property has been provided to you. Therefore, for
        any kind of correction, please contact the municipal office.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "4mm",
        }}
      >
        <span
          style={{
            fontSize: "7px",
            fontWeight: 700,
            color: "#222",
            borderTop: "1px solid #333",
            paddingTop: "1mm",
            minWidth: "35mm",
            textAlign: "center",
          }}
        >
          Recipient's Signature
        </span>
      </div>
    </div>
  );
}
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
            marginBottom: "2.5mm",
            marginRight: "2.5mm",
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
      className="flex w-full items-center "
      style={{
        minHeight: "5.8mm",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: "0 0 auto",
          maxWidth: "42%",
          minWidth: 0,
          paddingRight: "1.5mm",
          paddingLeft: "1mm",
          fontSize: "7.1px",
          fontWeight: 700,
          lineHeight: "1.15",
          color: "#292929",
          boxSizing: "border-box",
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        {label} :
      </div>

      <div
        style={{
          flex: "1 1 auto",
          minWidth: 0,
          paddingLeft: "1mm",
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

      <span className="min-w-0 flex-1 text-[6.7px] leading-tight text-[#333]">
        {label}
      </span>

      <strong className="shrink-0 whitespace-nowrap text-[6.1px] font-semibold text-[#555]">
        {uploaded ? `Uploaded${count ? ` (${count})` : ""}` : "Not Uploaded"}
      </strong>
    </div>
  );
}

/* =========================================================
   PROPERTY PHOTO BOX
========================================================= */

function PropertyPhotoBox({ src, title = "PROPERTY PHOTO" }) {
  const handleImageLoad = () => {
    console.log("[Survey Report] Property photo loaded:", src);
  };

  const handleImageError = (event) => {
    console.error("[Survey Report] Property photo failed:", src);
    event.currentTarget.style.display = "none";
  };

  return (
    <div
      style={{
        width: "50%",
        height: "42mm",
        boxSizing: "border-box",
        border: "1px solid #b5b5b5",
        backgroundColor: "#fff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: "#fafafa",
        }}
      >
        {src ? (
          <img
            src={src}
            alt={title}
            crossOrigin="anonymous"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <span
            style={{
              fontSize: "7px",
              fontWeight: 700,
              color: "#999",
            }}
          >
            NO PROPERTY PHOTO
          </span>
        )}
      </div>

      <div
        style={{
          height: "5mm",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTop: "1px solid #b5b5b5",
          backgroundColor: "#fff",
          fontSize: "6.5px",
          fontWeight: 700,
          color: "#333",
        }}
      >
        {title}
      </div>
    </div>
  );
}

/* =========================================================
   GPS LOCATION BOX
========================================================= */

function LocationBox({ latitude, longitude, locationName }) {
  const validLatitude =
    latitude !== null &&
    latitude !== undefined &&
    latitude !== "" &&
    !Number.isNaN(Number(latitude));

  const validLongitude =
    longitude !== null &&
    longitude !== undefined &&
    longitude !== "" &&
    !Number.isNaN(Number(longitude));

  const hasLocation = validLatitude && validLongitude;

  const lat = Number(latitude);
  const lng = Number(longitude);

  const googleMapsUrl = hasLocation
    ? `https://www.google.com/maps?q=${lat},${lng}&z=18`
    : null;

  const cleanLocationName =
    locationName && String(locationName).trim() !== ""
      ? String(locationName).trim()
      : null;

  return (
    <div
      style={{
        width: "50%",
        height: "42mm",
        boxSizing: "border-box",
        border: "1px solid #b5b5b5",
        backgroundColor: "#fff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#eef2f3",
        }}
      >
        {hasLocation ? (
          <React.Fragment>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, #edf1ee 25%, #dfe5df 25%, #dfe5df 50%, #edf1ee 50%, #edf1ee 75%, #dfe5df 75%)",
                backgroundSize: "24px 24px",
                zIndex: 1,
              }}
            />

            <div
              style={{
                position: "absolute",
                width: "140%",
                height: "12px",
                left: "-20%",
                top: "48%",
                backgroundColor: "#fff",
                borderTop: "1px solid #d2d2d2",
                borderBottom: "1px solid #d2d2d2",
                transform: "rotate(-18deg)",
                zIndex: 2,
              }}
            />

            <div
              style={{
                position: "absolute",
                width: "140%",
                height: "9px",
                left: "-20%",
                top: "42%",
                backgroundColor: "#fff",
                borderTop: "1px solid #d2d2d2",
                borderBottom: "1px solid #d2d2d2",
                transform: "rotate(42deg)",
                zIndex: 3,
              }}
            />

            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "auto",
                minWidth: "40px",
                height: "58px",
                zIndex: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                pointerEvents: "none",
                overflow: "visible",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50% 50% 50% 0",
                  backgroundColor: "#222",
                  transform: "rotate(-45deg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 21,
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                  }}
                />
              </div>

              {cleanLocationName ? (
                <div
                  style={{
                    position: "absolute",
                    top: "31px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 25,
                    fontSize: "6.8px",
                    lineHeight: "9px",
                    fontWeight: 700,
                    color: "#222",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    backgroundColor: "transparent",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    textShadow: "0 0 2px #fff, 0 0 2px #fff, 0 0 2px #fff",
                    pointerEvents: "none",
                  }}
                >
                  {cleanLocationName}
                </div>
              ) : null}
            </div>

            <div
              style={{
                position: "absolute",
                left: "4px",
                bottom: "4px",
                zIndex: 30,
                padding: "2px 4px",
                backgroundColor: "rgba(255,255,255,0.92)",
                border: "1px solid #aaa",
                fontSize: "5.8px",
                lineHeight: 1.25,
                color: "#333",
                fontWeight: 600,
              }}
            >
              {"GPS: " + lat.toFixed(6) + ", " + lng.toFixed(6)}
            </div>

            {googleMapsUrl ? (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: "absolute",
                  right: "4px",
                  bottom: "4px",
                  zIndex: 30,
                  padding: "2px 4px",
                  backgroundColor: "rgba(255,255,255,0.95)",
                  border: "1px solid #aaa",
                  color: "#222",
                  textDecoration: "none",
                  fontSize: "5.8px",
                  fontWeight: 700,
                }}
              >
                VIEW MAP
              </a>
            ) : null}
          </React.Fragment>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "#999",
              fontSize: "7px",
              fontWeight: 700,
            }}
          >
            GPS LOCATION NOT AVAILABLE
          </div>
        )}
      </div>

      <div
        style={{
          height: "5mm",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTop: "1px solid #b5b5b5",
          backgroundColor: "#fff",
          fontSize: "6.5px",
          fontWeight: 700,
          color: "#333",
        }}
      >
        PROPERTY LOCATION
      </div>
    </div>
  );
}

/* =========================================================
   QUICK INFO STRIP
========================================================= */

function QuickInfoStrip({ items }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
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
            borderRight: index !== items.length - 1 ? "1px solid #555" : "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "visible",
          }}
        >
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
   FLOOR AREA TABLE — CONFIG
========================================================= */

const CONSTRUCTION_COLUMNS = ["Pucca / RCC", "Tin", "Kachha"];
const USAGE_TYPES = ["Residential", "Commercial"];
const OCCUPANCY_TYPES = ["Self-Used", "Rented"];

const normalizeConstructionType = (type) => {
  const normalized = String(type || "")
    .toLowerCase()
    .trim();

  if (
    normalized === "pucca" ||
    normalized === "rcc" ||
    normalized === "pucca / rcc"
  ) {
    return "Pucca / RCC";
  }

  if (normalized === "tin") {
    return "Tin";
  }

  return "Kachha";
};

const normalizeUsageType = (type) => {
  const normalized = String(type || "")
    .toLowerCase()
    .trim();

  if (normalized === "residential") {
    return "Residential";
  }

  return "Commercial";
};

const normalizeOccupancy = (factor) => {
  const normalized = String(factor || "")
    .toLowerCase()
    .trim();

  if (
    normalized === "self occupied" ||
    normalized === "self-used" ||
    normalized === "self used" ||
    normalized === "self"
  ) {
    return "Self-Used";
  }

  if (normalized === "rented" || normalized === "rent") {
    return "Rented";
  }

  return "Self-Used";
};

/* =========================================================
   FLOOR AREA TABLE — COMPONENT
========================================================= */

function FloorAreaTable({ floorDetails = [] }) {
  const getCellValue = (floor, constructionType, usageType, occupancy) => {
    const match = floorDetails.find(
      (item) =>
        String(item.floor || "").trim() === String(floor || "").trim() &&
        normalizeConstructionType(item.construction_type) ===
          constructionType &&
        normalizeUsageType(item.usage_type) === usageType &&
        normalizeOccupancy(item.usage_factor) === occupancy,
    );
    return match ? toNumber(match.area) : 0;
  };

  const floorNames = [
    ...new Set(
      floorDetails
        .map((item) => item.floor)
        .filter(
          (floor) =>
            floor !== null &&
            floor !== undefined &&
            String(floor).trim() !== "",
        ),
    ),
  ];

  const getFloorTotal = (floor) => {
    let total = 0;
    CONSTRUCTION_COLUMNS.forEach((constructionType) => {
      USAGE_TYPES.forEach((usageType) => {
        OCCUPANCY_TYPES.forEach((occupancy) => {
          total += getCellValue(floor, constructionType, usageType, occupancy);
        });
      });
    });
    return total;
  };

  const getColumnTotal = (constructionType, usageType, occupancy) => {
    let total = 0;
    floorNames.forEach((floor) => {
      total += getCellValue(floor, constructionType, usageType, occupancy);
    });
    return total;
  };

  const grandTotal = floorNames.reduce(
    (sum, floor) => sum + getFloorTotal(floor),
    0,
  );

  const FLOOR_WIDTH = "9%";
  const DETAIL_WIDTH = "6.75%";
  const DETAILS_GROUP_WIDTH = "81%";
  const TOTAL_WIDTH = "10%";
  const CONSTRUCTION_WIDTH = "27%";
  const USAGE_GROUP_WIDTH = "13.5%";

  // ✅ Reduced row height — this is the main size reduction
  const ROW_HEIGHT = "4.5mm";
  const HEADER_ROW1_HEIGHT = "5mm";
  const HEADER_ROW_HEIGHT = "4mm";

  const cellContentStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    boxSizing: "border-box",
    lineHeight: "1",
    margin: 0,
    padding: 0,
  };

  const thStyle = {
    border: "1px solid #b7b7b7",
    padding: 0,
    fontWeight: 700,
    fontSize: "4.6px",
    lineHeight: "1",
    backgroundColor: "#f2f2f2",
    color: "#222",
    boxSizing: "border-box",
    textAlign: "center",
    overflow: "hidden",
    whiteSpace: "normal",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    height: "100%",
  };

  const tdStyle = {
    border: "1px solid #b7b7b7",
    padding: 0,
    fontSize: "4.6px",
    lineHeight: "1",
    color: "#333",
    boxSizing: "border-box",
    textAlign: "center",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "clip",
    // height: ROW_HEIGHT, // ✅ reduced from 7mm
  };

  const totalThStyle = {
    ...thStyle,
    backgroundColor: "#f2f2f2",
    borderLeft: "1px solid #b7b7b7",
    textAlign: "center",
  };

  const totalTdStyle = {
    ...tdStyle,
    borderLeft: "1px solid #b7b7b7",
    fontWeight: 700,
    textAlign: "center",
  };

  const detailCellStyle = {
    ...tdStyle,
    width: DETAIL_WIDTH,
    minWidth: 0,
    maxWidth: DETAIL_WIDTH,
    textAlign: "center",
  };

  const detailHeaderStyle = {
    ...thStyle,
    width: DETAIL_WIDTH,
    minWidth: 0,
    maxWidth: DETAIL_WIDTH,
    textAlign: "center",
  };

  if (floorNames.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          marginTop: "1.5mm",
          border: "1px solid #b7b7b7",
          padding: "3mm",
          textAlign: "center",
          fontSize: "6.5px",
          color: "#999",
        }}
      >
        No floor details available
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        marginTop: "1.5mm",
        boxSizing: "border-box",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <table
        cellPadding={0}
        cellSpacing={0}
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          tableLayout: "fixed",
          borderCollapse: "collapse",
          borderSpacing: 0,
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <colgroup>
          <col style={{ width: FLOOR_WIDTH }} />
          {Array.from({ length: 12 }).map((_, index) => (
            <col key={index} style={{ width: DETAIL_WIDTH }} />
          ))}
          <col style={{ width: TOTAL_WIDTH }} />
        </colgroup>

        <thead>
          <tr style={{ height: HEADER_ROW1_HEIGHT }}>
            <th
              rowSpan={4}
              style={{
                ...thStyle,
                width: FLOOR_WIDTH,
                minWidth: 0,
                maxWidth: FLOOR_WIDTH,
                fontSize: "4.6px",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  ...cellContentStyle,
                  minHeight: "16mm",
                  fontWeight: 700,
                }}
              >
                Floor
              </div>
            </th>

            <th
              colSpan={12}
              style={{
                ...thStyle,
                width: DETAILS_GROUP_WIDTH,
                minWidth: 0,
                maxWidth: DETAILS_GROUP_WIDTH,
                fontSize: "4.6px",
                letterSpacing: "0.05px",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  ...cellContentStyle,
                  minHeight: "5mm",
                  fontWeight: 700,
                }}
              >
                Details of Constructed Area of Property
              </div>
            </th>

            <th
              rowSpan={4}
              style={{
                ...totalThStyle,
                width: TOTAL_WIDTH,
                minWidth: 0,
                maxWidth: TOTAL_WIDTH,
                fontSize: "4.6px",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  ...cellContentStyle,
                  minHeight: "16mm",
                  fontWeight: 700,
                }}
              >
                Total
              </div>
            </th>
          </tr>

          <tr style={{ height: HEADER_ROW_HEIGHT }}>
            {CONSTRUCTION_COLUMNS.map((constructionType) => (
              <th
                key={constructionType}
                colSpan={4}
                style={{
                  ...thStyle,
                  width: CONSTRUCTION_WIDTH,
                  minWidth: 0,
                  maxWidth: CONSTRUCTION_WIDTH,
                  fontSize: "4.4px",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                <div
                  style={{ ...cellContentStyle, minHeight: HEADER_ROW_HEIGHT }}
                >
                  {constructionType}
                </div>
              </th>
            ))}
          </tr>

          <tr style={{ height: HEADER_ROW_HEIGHT }}>
            {CONSTRUCTION_COLUMNS.map((constructionType) => (
              <React.Fragment key={constructionType}>
                <th
                  colSpan={2}
                  style={{
                    ...thStyle,
                    width: USAGE_GROUP_WIDTH,
                    minWidth: 0,
                    maxWidth: USAGE_GROUP_WIDTH,
                    fontSize: "4.3px",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      ...cellContentStyle,
                      minHeight: HEADER_ROW_HEIGHT,
                    }}
                  >
                    Residential
                  </div>
                </th>

                <th
                  colSpan={2}
                  style={{
                    ...thStyle,
                    width: USAGE_GROUP_WIDTH,
                    minWidth: 0,
                    maxWidth: USAGE_GROUP_WIDTH,
                    fontSize: "4.3px",
                    textTransform: "uppercase",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      ...cellContentStyle,
                      minHeight: HEADER_ROW_HEIGHT,
                    }}
                  >
                    Commercial
                  </div>
                </th>
              </React.Fragment>
            ))}
          </tr>

          <tr style={{ height: HEADER_ROW_HEIGHT }}>
            {CONSTRUCTION_COLUMNS.map((constructionType) => (
              <React.Fragment key={constructionType}>
                <th style={{ ...detailHeaderStyle, textAlign: "center" }}>
                  <div
                    style={{
                      ...cellContentStyle,
                      minHeight: HEADER_ROW_HEIGHT,
                      flexDirection: "column",
                    }}
                  >
                    <span>Self-</span>
                    <span>Used</span>
                  </div>
                </th>

                <th style={{ ...detailHeaderStyle, textAlign: "center" }}>
                  <div
                    style={{
                      ...cellContentStyle,
                      minHeight: HEADER_ROW_HEIGHT,
                    }}
                  >
                    Rented
                  </div>
                </th>

                <th style={{ ...detailHeaderStyle, textAlign: "center" }}>
                  <div
                    style={{
                      ...cellContentStyle,
                      minHeight: HEADER_ROW_HEIGHT,
                      flexDirection: "column",
                    }}
                  >
                    <span>Self-</span>
                    <span>Used</span>
                  </div>
                </th>

                <th style={{ ...detailHeaderStyle, textAlign: "center" }}>
                  <div
                    style={{
                      ...cellContentStyle,
                      minHeight: HEADER_ROW_HEIGHT,
                    }}
                  >
                    Rented
                  </div>
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>

        <tbody>
          {floorNames.map((floor) => (
            <tr key={String(floor)} style={{ height: ROW_HEIGHT }}>
              <td
                style={{
                  ...tdStyle,
                  width: FLOOR_WIDTH,
                  minWidth: 0,
                  maxWidth: FLOOR_WIDTH,
                  fontWeight: 700,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  fontSize: "4.3px",
                  lineHeight: "1",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    ...cellContentStyle,
                    minHeight: ROW_HEIGHT,
                    fontWeight: 700,
                  }}
                >
                  {String(floor).toUpperCase()}
                </div>
              </td>

              {CONSTRUCTION_COLUMNS.map((constructionType) => (
                <React.Fragment key={constructionType}>
                  <td style={{ ...detailCellStyle, textAlign: "center" }}>
                    <div
                      style={{
                        ...cellContentStyle /*minHeight: ROW_HEIGHT  */,
                      }}
                    >
                      {getCellValue(
                        floor,
                        constructionType,
                        "Residential",
                        "Self-Used",
                      )}
                    </div>
                  </td>
                  <td style={{ ...detailCellStyle, textAlign: "center" }}>
                    <div
                      style={{
                        ...cellContentStyle /*minHeight: ROW_HEIGHT  */,
                      }}
                    >
                      {getCellValue(
                        floor,
                        constructionType,
                        "Residential",
                        "Rented",
                      )}
                    </div>
                  </td>
                  <td style={{ ...detailCellStyle, textAlign: "center" }}>
                    <div
                      style={{
                        ...cellContentStyle /*minHeight: ROW_HEIGHT  */,
                      }}
                    >
                      {getCellValue(
                        floor,
                        constructionType,
                        "Commercial",
                        "Self-Used",
                      )}
                    </div>
                  </td>
                  <td style={{ ...detailCellStyle, textAlign: "center" }}>
                    <div
                      style={{
                        ...cellContentStyle /*minHeight: ROW_HEIGHT  */,
                      }}
                    >
                      {getCellValue(
                        floor,
                        constructionType,
                        "Commercial",
                        "Rented",
                      )}
                    </div>
                  </td>
                </React.Fragment>
              ))}

              <td
                style={{
                  ...totalTdStyle,
                  width: TOTAL_WIDTH,
                  minWidth: 0,
                  maxWidth: TOTAL_WIDTH,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    ...cellContentStyle,
                    // minHeight: ROW_HEIGHT  ,
                    fontWeight: 700,
                  }}
                >
                  {getFloorTotal(floor)}
                </div>
              </td>
            </tr>
          ))}

          <tr style={{ height: ROW_HEIGHT }}>
            <td
              style={{
                ...tdStyle,
                width: FLOOR_WIDTH,
                minWidth: 0,
                maxWidth: FLOOR_WIDTH,
                fontWeight: 700,
                whiteSpace: "nowrap",
                fontSize: "4.3px",
                lineHeight: "1",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  ...cellContentStyle,
                  // minHeight: ROW_HEIGHT  ,
                  fontWeight: 700,
                }}
              >
                Total:-
              </div>
            </td>

            {CONSTRUCTION_COLUMNS.map((constructionType) => (
              <React.Fragment key={constructionType}>
                <td
                  style={{
                    ...detailCellStyle,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      ...cellContentStyle,
                      // minHeight: ROW_HEIGHT,
                      fontWeight: 700,
                    }}
                  >
                    {getColumnTotal(
                      constructionType,
                      "Residential",
                      "Self-Used",
                    )}
                  </div>
                </td>
                <td
                  style={{
                    ...detailCellStyle,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      ...cellContentStyle,
                      // minHeight: ROW_HEIGHT,
                      fontWeight: 700,
                    }}
                  >
                    {getColumnTotal(constructionType, "Residential", "Rented")}
                  </div>
                </td>
                <td
                  style={{
                    ...detailCellStyle,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      ...cellContentStyle,
                      // minHeight: ROW_HEIGHT,
                      fontWeight: 700,
                    }}
                  >
                    {getColumnTotal(
                      constructionType,
                      "Commercial",
                      "Self-Used",
                    )}
                  </div>
                </td>
                <td
                  style={{
                    ...detailCellStyle,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      ...cellContentStyle,
                      // minHeight: ROW_HEIGHT,
                      fontWeight: 700,
                    }}
                  >
                    {getColumnTotal(constructionType, "Commercial", "Rented")}
                  </div>
                </td>
              </React.Fragment>
            ))}

            <td
              style={{
                ...totalTdStyle,
                width: TOTAL_WIDTH,
                minWidth: 0,
                maxWidth: TOTAL_WIDTH,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  ...cellContentStyle,
                  // minHeight: ROW_HEIGHT,
                  fontWeight: 700,
                }}
              >
                {grandTotal}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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

  const info = survey.survey_information || {};
  const owner = survey.owner_details || {};
  const property = survey.property_details || {};
  const land = survey.land_building_information || {};
  const usage = survey.usage_details || {};
  const utility = survey.utility_connections || {};
  const gis = survey.gis_information || {};
  const verification = survey.verification || {};
  const documents = survey.documents_collected || {};

  const remarks = survey.surveyor_remarks
    ? survey.surveyor_remarks.surveyor_remarks !== undefined
      ? survey.surveyor_remarks.surveyor_remarks
      : survey.surveyor_remarks
    : null;

  const taxInformation = survey.tax_related_information || {};

  const floorDetails = Array.isArray(land.floor_detail)
    ? land.floor_detail
    : [];

  const hasSelfOccupiedFloor = floorDetails.some(function (floor) {
    return (
      String((floor && floor.usage_factor) || "")
        .toLowerCase()
        .trim() === "self occupied"
    );
  });

  const hasRentedFloor = floorDetails.some(function (floor) {
    return (
      String((floor && floor.usage_factor) || "")
        .toLowerCase()
        .trim() === "rented"
    );
  });

  const hasResidentialFloor = floorDetails.some(function (floor) {
    return (
      String((floor && floor.usage_type) || "")
        .toLowerCase()
        .trim() === "residential"
    );
  });

  const hasCommercialFloor = floorDetails.some(function (floor) {
    return (
      String((floor && floor.usage_type) || "")
        .toLowerCase()
        .trim() === "commercial"
    );
  });

  const isSelf =
    hasSelfOccupiedFloor ||
    String(usage.occupancy || "")
      .toLowerCase()
      .trim() === "self";

  const isRented =
    hasRentedFloor ||
    String(usage.occupancy || "")
      .toLowerCase()
      .trim() === "rented" ||
    usage.mixed_use === true;

  const isResidential =
    hasResidentialFloor ||
    String(usage.primary_use || "")
      .toLowerCase()
      .trim() === "residential" ||
    usage.mixed_use === true;

  const isCommercial =
    hasCommercialFloor ||
    String(usage.primary_use || "")
      .toLowerCase()
      .trim() === "commercial" ||
    usage.mixed_use === true;

  const streetRoadName = String(info.street_road_name || "").trim();
  const propertyLocation = String(info.property_location || "").trim();
  const isRoadOrMarket = /road|market/i.test(streetRoadName);

  const propertyLocationFieldValue = isRoadOrMarket ? streetRoadName : "—";

  const otherLocationFieldValue = isRoadOrMarket
    ? "—"
    : propertyLocation || "—";

  const isOtherLocation = propertyLocation.toLowerCase() === "other";

  const otherPropertyLocation =
    info.property_location_other ||
    info.other_property_location ||
    info.property_location_other_details ||
    "";

  const locationName = isOtherLocation
    ? otherPropertyLocation
    : propertyLocation;

  const latitude =
    info.gps_latitude !== undefined && info.gps_latitude !== null
      ? info.gps_latitude
      : info.latitude !== undefined && info.latitude !== null
        ? info.latitude
        : gis.gps_latitude !== undefined && gis.gps_latitude !== null
          ? gis.gps_latitude
          : survey.gps_latitude;

  const longitude =
    info.gps_longitude !== undefined && info.gps_longitude !== null
      ? info.gps_longitude
      : info.longitude !== undefined && info.longitude !== null
        ? info.longitude
        : gis.gps_longitude !== undefined && gis.gps_longitude !== null
          ? gis.gps_longitude
          : survey.gps_longitude;

  const gisFields = [
    ["GIS Property Polygon", "gis_property_polygon_available"],
    ["Boundary Verified", "property_boundary_verified"],
    ["Geo Tag Completed", "geo_tag_completed"],
    ["Property Photo Captured", "property_photo_captured"],
  ];

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

  const propertyPhoto =
    gis.property_photo_path || survey.property_photo_path || null;

  return (
    <div
      id="survey-report"
      style={{
        width: "208mm",
        maxWidth: "208mm",
        margin: "0 auto",
        padding: "2mm",
        boxSizing: "border-box",
        backgroundColor: "#fff",
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#333",
        overflow: "hidden",
      }}
    >
      <header
        style={{
          textAlign: "center",
          borderBottom: "1.5px solid #333",
          paddingBottom: "2.5mm",
          marginBottom: "4mm",
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
          OFFICE OF THE MUNICIPAL CORPORATION / KORBA (CHHATTISGARH)
        </h1>

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
          Property Survey &amp; Assessment Report
        </h1>
      </header>

      <Section number="1" title="PROPERTY INFORMATION">
        <div className="flex w-full" style={{ gap: "5px" }}>
          <div className="min-w-0 flex-1" style={{ width: "33.33%" }}>
            <Field label="Tax Rate Zone" value={info.tax_rate_zone} />
            <Field label="Parcel Number" value={info.parcel_no} />
            <Field
              label="Electricity Bill CA NO."
              value={utility.electricity_consumer_no || "NA"}
            />
          </div>

          <div className="min-w-0 flex-1" style={{ width: "33.33%" }}>
            <Field label="Zone" value={info.zone} />
            <Field label="Property ID" value={info.property_id} />
            <Field label="Gas Connection" value={utility.gas_connection} />
          </div>

          <div className="min-w-0 flex-1" style={{ width: "33.33%" }}>
            <Field label="Ward No." value={info.ward_no} />
            <Field
              label="Existing Property ID"
              value={info.existing_property_id}
            />
            <Field
              label="Property Ownership"
              value={property.property_ownership}
            />
          </div>
        </div>
      </Section>

      <Section number="2" title="PROPERTY OWNER DETAILS">
        <div className="flex w-full" style={{ gap: "5px" }}>
          <div className="min-w-0 flex-1" style={{ width: "33.33%" }}>
            <Field label="Owner Name" value={owner.owner_name} />
            <Field label="Mobile Number" value={owner.mobile_number} />
            <Field
              label="Property Tax NO."
              value={taxInformation.existing_property_tax_no}
            />
          </div>

          <div className="min-w-0 flex-1" style={{ width: "33.33%" }}>
            <Field
              label="Father / Husband Name"
              value={owner.father_husband_name}
            />
            <Field label="AADHAR NO." value={documents.aadhaar_number} />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                minHeight: "5.8mm",
                paddingLeft: "1mm",
                boxSizing: "border-box",

                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  fontSize: "7.1px",
                  fontWeight: 700,
                  lineHeight: "1",
                  color: "#292929",
                  marginRight: "3mm",
                  flexShrink: 0,
                }}
              >
                Usage Type:
              </span>

              <span
                style={{
                  fontSize: "7.1px",
                  fontWeight: 400,
                  lineHeight: "1",
                  color: "#333",
                }}
              >
                {usage.mixed_use
                  ? "Both"
                  : usage.primary_use === "Residential"
                    ? "Residential"
                    : usage.primary_use === "Commercial"
                      ? "Commercial"
                      : "—"}
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1" style={{ width: "33.33%" }}>
            <Field
              label="Correspondence Address"
              value={owner.correspondence_address}
            />
            <Field label="Email" value={owner.email || survey.email || "—"} />
            <Field
              label="Total Built-up Area"
              value={land.total_builtup_area}
            />
          </div>
        </div>
      </Section>

      <Section number="3" title="LAND & BUILDING">
        <div className="flex w-full" style={{ gap: "5px" }}>
          <div className="min-w-0 flex-1" style={{ width: "33.33%" }}>
            <Field
              label="Property Ownership"
              value={property.property_ownership}
            />
            <Field
              label="Property Use (Rented / Self / Both)"
              value={
                isSelf && isRented
                  ? "Both"
                  : isSelf
                    ? "Self"
                    : isRented
                      ? "Rented"
                      : "—"
              }
            />
            <Field
              label="Property Use (Residential / Commercial / Both)"
              value={
                isResidential && isCommercial
                  ? "Both"
                  : isResidential
                    ? "Residential"
                    : isCommercial
                      ? "Commercial"
                      : "—"
              }
            />
            <Field label="Building Year" value={land.year_of_construction} />
          </div>

          <div className="min-w-0 flex-1" style={{ width: "33.33%" }}>
            <Field
              label="Property Location (Main Road / Main Market / Other)"
              value={propertyLocationFieldValue}
            />
            <Field label="Self" value={isSelf ? "Yes" : "No"} />
            <Field label="Residential" value={isResidential ? "Yes" : "No"} />
            <Field label="Building Age" value={land.building_age} />
          </div>

          <div className="min-w-0 flex-1" style={{ width: "33.33%" }}>
            <Field label="Other" value={otherLocationFieldValue} />
            <Field label="Rented" value={isRented ? "Yes" : "No"} />
            <Field label="Commercial" value={isCommercial ? "Yes" : "No"} />
            <Field label="" value="" />
          </div>
        </div>
      </Section>

      <Section number="4" title="PROPERTY AREA DETAILS">
        <div className="flex w-full" style={{ gap: "5px" }}>
          <div className="min-w-0 flex-1" style={{ width: "33.33%" }}>
            <Field label="Land / Plot Area (in sq ft)" value={land.plot_area} />
            <Field
              label="Property's Plinth Area - Commercial / Industrial Use (in sq ft)"
              value="—"
            />
          </div>

          <div className="min-w-0 flex-1" style={{ width: "33.33%" }}>
            <Field
              label="Property Plinth Area (in sq ft)"
              value={land.plinth_area}
            />
            <Field
              label="Total Built-up Area of Property (in sq ft)"
              value={land.total_builtup_area}
            />
          </div>

          <div className="min-w-0 flex-1" style={{ width: "33.33%" }}>
            <Field
              label="Vacant Land / Plot Area (in sq ft)"
              value={toNumber(land.plot_area) - toNumber(land.plinth_area)}
            />
            <Field
              label="Lat/Long"
              value={
                latitude !== undefined &&
                latitude !== null &&
                longitude !== undefined &&
                longitude !== null
                  ? latitude + "," + longitude
                  : "—"
              }
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "1.5mm",
            marginBottom: "0.8mm",
            fontSize: "7px",
            fontWeight: 700,
            color: "#222",
          }}
        >
          Details of Constructed Area of Property
        </div>

        <FloorAreaTable floorDetails={floorDetails} />
        <UtilityConnectionsSection survey={survey} />
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "7px",
            marginTop: "5px",
          }}
        >
          <PropertyPhotoBox
            src={getImageSrc(propertyPhoto)}
            title="PROPERTY PHOTO"
          />
          <LocationBox
            latitude={latitude}
            longitude={longitude}
            locationName={locationName}
          />
        </div>
        <div
          style={{
            marginTop: "2.5mm",
            paddingTop: "1.5mm",

            fontSize: "5.8px",
            lineHeight: 1.35,
            color: "#555",
          }}
        >
          <strong>Note:</strong> This report has been prepared based on the
          information recorded in the property survey system. This document is
          not a final proof of property ownership.
        </div>
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
          ].map(function (label) {
            return (
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
            );
          })}
        </div>
        <DeclarationSection survey={survey} />
      </Section>

      <footer className="mt-[1.5mm] flex items-center justify-between gap-4 text-[5.5px] text-[#666]">
        <span>Generated on: {formatDate(new Date().toISOString())}</span>
      </footer>
    </div>
  );
}
