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
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    if (value.text !== undefined) {
      return String(value.text);
    }

    if (value.remarks !== undefined) {
      return String(value.remarks);
    }

    if (value.value !== undefined) {
      return String(value.value);
    }

    if (value.name !== undefined) {
      return String(value.name);
    }

    return "—";
  }

  return String(value);
};


/* =========================================================
   SECTION
========================================================= */

function Section({
  number,
  title,
  children,
  className = "",
}) {
  return (
    <section
      className={`
        mb-[5px]
        w-full
        break-inside-avoid
        overflow-hidden
        rounded-[2px]
        border
        border-[#bdbdbd]
        ${className}
      `}
    >

      {/* SECTION TITLE */}

      <div
        className="
          border-b
          border-[#bdbdbd]
          bg-[#f7f7f7]
          px-[7px]
          py-[4px]
        "
      >
        <h2
          className="
            m-0
            text-[9px]
            font-bold
            leading-none
            text-[#222222]
          "
        >
          {number}. {title}
        </h2>
      </div>

      {/* SECTION CONTENT */}

      <div className="px-[7px] py-[5px]">
        {children}
      </div>

    </section>
  );
}


/* =========================================================
   ALIGNED FIELD
========================================================= */

function Field({
  label,
  value,
  date = false,
}) {
  return (
    <div
      className="
        grid
        min-w-0
        grid-cols-[42%_58%]
        items-start
        border-b
        border-[#e4e4e4]
        py-[2px]
      "
    >

      {/* LABEL */}

      <span
        className="
          pr-1
          text-[7.8px]
          font-bold
          leading-[1.25]
          text-[#333333]
        "
      >
        {label}
      </span>


      {/* VALUE */}

      <span
        className="
          min-w-0
          break-words
          text-[7.8px]
          leading-[1.25]
          text-[#444444]
        "
      >
        {date
          ? formatDate(value)
          : displayValue(value)}
      </span>

    </div>
  );
}


/* =========================================================
   VERIFICATION ITEM
========================================================= */

function VerificationItem({
  label,
  checked,
}) {
  return (
    <div
      className="
        flex
        min-h-[20px]
        items-center
        gap-[5px]
        border-b
        border-r
        border-[#d5d5d5]
        px-[6px]
        py-[3px]
      "
    >

      <span
        className={`
          flex
          h-[10px]
          w-[10px]
          shrink-0
          items-center
          justify-center
          border
          text-[7px]
          font-bold
          leading-none
          ${
            checked
              ? "border-[#333333] bg-[#333333] text-white"
              : "border-[#888888] bg-white text-[#666666]"
          }
        `}
      >
        {checked ? "✓" : ""}
      </span>

      <span
        className="
          text-[7px]
          leading-tight
          text-[#444444]
        "
      >
        {label}
      </span>

    </div>
  );
}


/* =========================================================
   DOCUMENT ITEM
========================================================= */

function DocumentItem({
  label,
  uploaded,
}) {
  return (
    <div
      className="
        grid
        min-h-[20px]
        grid-cols-[7px_1fr_auto]
        items-center
        gap-[5px]
        border-b
        border-r
        border-[#d5d5d5]
        px-[6px]
        py-[3px]
      "
    >

      <span
        className={`
          h-[6px]
          w-[6px]
          rounded-full
          ${
            uploaded
              ? "bg-[#333333]"
              : "bg-[#aaa]"
          }
        `}
      />

      <span
        className="
          min-w-0
          text-[7px]
          leading-tight
          text-[#444444]
        "
      >
        {label}
      </span>

      <strong
        className="
          whitespace-nowrap
          text-[6.5px]
          font-semibold
          text-[#555555]
        "
      >
        {uploaded
          ? "Uploaded"
          : "N/A"}
      </strong>

    </div>
  );
}


/* =========================================================
   MEDIA BOX
========================================================= */

function MediaBox({
  src,
  title,
}) {
  return (
    <div
      className="
        flex
        h-[32mm]
        min-w-0
        flex-col
        overflow-hidden
        rounded-[2px]
        border
        border-[#c8c8c8]
        bg-white
      "
    >

      {/* IMAGE */}

      <div
        className="
          flex
          min-h-0
          flex-1
          items-center
          justify-center
          overflow-hidden
          bg-[#fafafa]
        "
      >
        {src ? (
          <img
            src={src}
            alt={title}
            className="
              h-full
              w-full
              object-cover
            "
          />
        ) : (
          <span
            className="
              text-[8px]
              font-semibold
              text-[#999999]
            "
          >
            PHOTO / MAP
          </span>
        )}
      </div>


      {/* TITLE */}

      <div
        className="
          flex
          h-[5mm]
          shrink-0
          items-center
          justify-center
          border-t
          border-[#c8c8c8]
          bg-white
          px-1
          text-center
          text-[7px]
          font-bold
          leading-none
          text-[#333333]
        "
      >
        {title}
      </div>

    </div>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SurveyReportTemplate({
  survey,
}) {
  if (!survey) {
    return null;
  }


  /* =======================================================
     DATA
  ======================================================= */

  const info =
    survey.survey_information || {};

  const owner =
    survey.owner_details || {};

  const property =
    survey.property_details || {};

  const land =
    survey.land_building_information || {};

  const usage =
    survey.usage_details || {};

  const utility =
    survey.utility_connections || {};

  const verification =
    survey.verification || {};

  const documents =
    survey.documents_collected || {};


  /* =======================================================
     VERIFICATION
  ======================================================= */

  const verificationFields = [
    [
      "Unassessed Property",
      "unassessed_property",
    ],
    [
      "Under Assessed Property",
      "under_assessed_property",
    ],
    [
      "Property Use Changed",
      "property_use_changed",
    ],
    [
      "Additional Floor Constructed",
      "additional_floor_constructed",
    ],
    [
      "Boundary Changed",
      "boundary_changed",
    ],
    [
      "Ownership Changed",
      "ownership_changed",
    ],
    [
      "Demolished Property",
      "demolished_property",
    ],
    [
      "New Property",
      "new_property",
    ],
  ];


  /* =======================================================
     DOCUMENTS
  ======================================================= */

  const documentFields = [
    [
      "Aadhaar Copy",
      "aadhaar_copy",
    ],
    [
      "Electricity Bill",
      "electricity_bill",
    ],
    [
      "Water Bill",
      "water_bill",
    ],
    [
      "Sale Deed",
      "sale_deed",
    ],
    [
      "Property Tax Receipt",
      "property_tax_receipt",
    ],
    [
      "Building Permission",
      "building_permission",
    ],
    [
      "Other Documents",
      "other_documents",
    ],
  ];


  /* =======================================================
     MEDIA
  ======================================================= */

  const propertyPhoto =
    survey.property_photo ||
    survey.propertyPhoto;

  const propertyMap =
    survey.property_map ||
    survey.propertyMap;

  const areaChart =
    survey.area_chart ||
    survey.areaChart;


  /* =======================================================
     REPORT
  ======================================================= */

  return (
    <div
      id="survey-report"
      className="
        mx-auto
        box-border
        w-[196mm]
        bg-white
        font-sans
        text-[#333333]
        print:m-0
        print:w-[196mm]
      "
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <header
        className="
          mb-[5px]
          border-b-2
          border-[#444444]
          pb-[5px]
          text-center
        "
      >

        <h1
          className="
            m-0
            text-[12px]
            font-bold
            leading-tight
          "
        >
          OFFICE OF THE MUNICIPAL CORPORATION /
          MUNICIPAL COUNCIL / MUNICIPALITY
        </h1>

        <p
          className="
            mt-[2px]
            text-[8px]
            font-bold
            leading-tight
          "
        >
          KORBA NAGAR NIGAM, KORBA (CHHATTISGARH)
        </p>

        <p
          className="
            mt-[2px]
            text-[7px]
            text-[#555555]
          "
        >
          Property Survey & Assessment Report
        </p>

      </header>


      {/* ===================================================
          1. GENERAL PROPERTY INFORMATION
      =================================================== */}

      <Section
        number="1"
        title="GENERAL PROPERTY INFORMATION"
      >

        <div
          className="
            grid
            grid-cols-3
            gap-x-[10px]
          "
        >

          <div>
            <Field
              label="Survey ID"
              value={info.survey_id}
            />

            <Field
              label="Survey Date"
              value={info.survey_date}
              date
            />

            <Field
              label="Ward No."
              value={info.ward_no}
            />

            <Field
              label="Colony / Locality"
              value={info.colony_locality}
            />
          </div>


          <div>
            <Field
              label="Property ID"
              value={info.property_id}
            />

            <Field
              label="Surveyor"
              value={info.surveyor_name}
            />

            <Field
              label="Zone"
              value={info.zone}
            />

            <Field
              label="Property Location"
              value={info.property_location}
            />
          </div>


          <div>
            <Field
              label="Parcel No."
              value={info.parcel_no}
            />

            <Field
              label="Surveyor ID"
              value={info.surveyor_id}
            />

            <Field
              label="Tax Rate Zone"
              value={info.tax_rate_zone}
            />

            <Field
              label="Existing Property ID"
              value={info.existing_property_id}
            />
          </div>

        </div>

      </Section>


      {/* ===================================================
          2. OWNER
      =================================================== */}

      <Section
        number="2"
        title="PROPERTY OWNER INFORMATION"
      >

        <div
          className="
            grid
            grid-cols-2
            gap-x-[12px]
          "
        >

          <div>

            <Field
              label="Owner Name"
              value={owner.owner_name}
            />

            <Field
              label="Father / Husband Name"
              value={
                owner.father_husband_name
              }
            />

            <Field
              label="Mobile Number"
              value={
                owner.mobile_number
              }
            />

          </div>


          <div>

            <Field
              label="Correspondence Address"
              value={
                owner.correspondence_address
              }
            />

            <Field
              label="Property Ownership"
              value={
                property.property_ownership
              }
            />

            <Field
              label="Property Status"
              value={
                property.property_status
              }
            />

          </div>

        </div>

      </Section>


      {/* ===================================================
          3. USE & CONSTRUCTION
      =================================================== */}

      <Section
        number="3"
        title="PROPERTY USE & CONSTRUCTION INFORMATION"
      >

        <div
          className="
            grid
            grid-cols-3
            gap-x-[10px]
          "
        >

          <div>

            <Field
              label="Primary Use"
              value={usage.primary_use}
            />

            <Field
              label="Building Permission"
              value={
                property.building_permission_available
              }
            />

            <Field
              label="Number of Families"
              value={
                usage.number_of_families
              }
            />

          </div>


          <div>

            <Field
              label="Mixed Use"
              value={usage.mixed_use}
            />

            <Field
              label="Year of Construction"
              value={
                land.year_of_construction
              }
            />

            <Field
              label="Number of Shops"
              value={
                usage.number_of_shops
              }
            />

          </div>


          <div>

            <Field
              label="Occupancy"
              value={usage.occupancy}
            />

            <Field
              label="Building Age"
              value={land.building_age}
            />

            <Field
              label="Floor Details"
              value={land.floor_details}
            />

          </div>

        </div>

      </Section>


      {/* ===================================================
          4. AREA & BUILDING
      =================================================== */}

      <Section
        number="4"
        title="AREA & BUILDING DETAILS"
      >

        {/* AREA SUMMARY */}

        <div
          className="
            grid
            grid-cols-4
            gap-x-[8px]
            border-b
            border-[#d5d5d5]
            pb-[4px]
          "
        >

          <Field
            label="Plot Area (Sq. Ft.)"
            value={land.plot_area}
          />

          <Field
            label="Plinth Area"
            value={land.plinth_area}
          />

          <Field
            label="Built-up Area"
            value={
              land.total_builtup_area
            }
          />

          <Field
            label="Construction Year"
            value={
              land.year_of_construction
            }
          />

        </div>


        {/* TABLE */}

        <div
          className="
            mt-[5px]
            overflow-hidden
            border
            border-[#bdbdbd]
          "
        >

          <table
            className="
              w-full
              table-fixed
              border-collapse
              text-center
            "
          >

            <colgroup>

              <col className="w-[16%]" />

              <col className="w-[12%]" />
              <col className="w-[12%]" />

              <col className="w-[12%]" />
              <col className="w-[12%]" />

              <col className="w-[12%]" />
              <col className="w-[12%]" />

              <col className="w-[12%]" />

            </colgroup>


            <thead>

              <tr>

                <th
                  rowSpan={2}
                  className="
                    border
                    border-[#bdbdbd]
                    bg-[#f7f7f7]
                    px-[3px]
                    py-[4px]
                    text-[7px]
                    font-bold
                  "
                >
                  FLOOR
                </th>

                <th
                  colSpan={2}
                  className="
                    border
                    border-[#bdbdbd]
                    bg-[#f7f7f7]
                    px-[3px]
                    py-[4px]
                    text-[7px]
                    font-bold
                  "
                >
                  RESIDENTIAL
                </th>

                <th
                  colSpan={2}
                  className="
                    border
                    border-[#bdbdbd]
                    bg-[#f7f7f7]
                    px-[3px]
                    py-[4px]
                    text-[7px]
                    font-bold
                  "
                >
                  COMMERCIAL
                </th>

                <th
                  colSpan={2}
                  className="
                    border
                    border-[#bdbdbd]
                    bg-[#f7f7f7]
                    px-[3px]
                    py-[4px]
                    text-[7px]
                    font-bold
                  "
                >
                  OTHER
                </th>

                <th
                  rowSpan={2}
                  className="
                    border
                    border-[#bdbdbd]
                    bg-[#f7f7f7]
                    px-[3px]
                    py-[4px]
                    text-[7px]
                    font-bold
                  "
                >
                  TOTAL
                </th>

              </tr>


              <tr>

                {[
                  "SELF USE",
                  "RENT",
                  "SELF USE",
                  "RENT",
                  "SELF USE",
                  "RENT",
                ].map((item, index) => (
                  <th
                    key={index}
                    className="
                      border
                      border-[#bdbdbd]
                      bg-[#fafafa]
                      px-[2px]
                      py-[4px]
                      text-[6.5px]
                      font-bold
                    "
                  >
                    {item}
                  </th>
                ))}

              </tr>

            </thead>


            <tbody>

              <tr>

                <td
                  className="
                    border
                    border-[#bdbdbd]
                    px-[3px]
                    py-[6px]
                    text-[7px]
                    font-bold
                  "
                >
                  GROUND
                  <br />
                  FLOOR
                </td>


                {[
                  land.ground_floor_residential_self,
                  land.ground_floor_residential_rent,
                  land.ground_floor_commercial_self,
                  land.ground_floor_commercial_rent,
                  land.ground_floor_other_self,
                  land.ground_floor_other_rent,
                  land.ground_floor_total ||
                    land.plinth_area,
                ].map((value, index) => (
                  <td
                    key={index}
                    className="
                      border
                      border-[#bdbdbd]
                      px-[3px]
                      py-[6px]
                      text-[7px]
                    "
                  >
                    {displayValue(value)}
                  </td>
                ))}

              </tr>

            </tbody>

          </table>

        </div>

      </Section>


      {/* ===================================================
          5. UTILITIES
      =================================================== */}

      <Section
        number="5"
        title="UTILITY CONNECTIONS"
      >

        <div
          className="
            grid
            grid-cols-3
            gap-x-[10px]
          "
        >

          <Field
            label="Electricity Connection"
            value={
              utility.electricity_connection
            }
          />

          <Field
            label="Sewer Connection"
            value={
              utility.sewer_connection
            }
          />

          <Field
            label="Gas Connection"
            value={
              utility.gas_connection
            }
          />

        </div>

      </Section>


      {/* ===================================================
          6. VERIFICATION
      =================================================== */}

      <Section
        number="6"
        title="VERIFICATION"
      >

        <div
          className="
            grid
            grid-cols-4
            border-l
            border-t
            border-[#d5d5d5]
          "
        >

          {verificationFields.map(
            ([label, key]) => (
              <VerificationItem
                key={key}
                label={label}
                checked={
                  !!verification[key]
                }
              />
            )
          )}

        </div>

      </Section>


      {/* ===================================================
          7. DOCUMENTS
      =================================================== */}

      <Section
        number="7"
        title="DOCUMENTS"
      >

        <div
          className="
            grid
            grid-cols-2
            border-l
            border-t
            border-[#d5d5d5]
          "
        >

          {documentFields.map(
            ([label, key]) => (
              <DocumentItem
                key={key}
                label={label}
                uploaded={
                  !!documents[key]
                }
              />
            )
          )}

        </div>

      </Section>


      {/* ===================================================
          8. PHOTO / LOCATION
      =================================================== */}

      <Section
        number="8"
        title="PROPERTY PHOTOGRAPH & LOCATION"
      >

        <div
          className="
            grid
            grid-cols-3
            gap-[8px]
          "
        >

          <MediaBox
            src={propertyPhoto}
            title="Property Photograph"
          />

          <MediaBox
            src={areaChart}
            title="Area Summary"
          />

          <MediaBox
            src={propertyMap}
            title="GIS Map"
          />

        </div>


        {/* GPS */}

        <div
          className="
            mt-[5px]
            grid
            grid-cols-3
            gap-x-[10px]
          "
        >

          <Field
            label="GPS Latitude"
            value={info.gps_latitude}
          />

          <Field
            label="GPS Longitude"
            value={info.gps_longitude}
          />

          <Field
            label="Surveyor Remarks"
            value={
              survey.surveyor_remarks
            }
          />

        </div>

      </Section>


      {/* ===================================================
          SIGNATURES
      =================================================== */}

      <div
        className="
          mt-[5px]
          grid
          grid-cols-3
          gap-[10px]
        "
      >

        {[
          "Chief Municipal Officer",
          "Revenue Officer Signature",
          "Property Owner Signature",
        ].map((label) => (
          <div
            key={label}
            className="
              flex
              h-[25px]
              items-end
              justify-center
              border
              border-[#bdbdbd]
              pb-[4px]
              text-center
              text-[7px]
              font-bold
              leading-none
            "
          >
            {label}
          </div>
        ))}

      </div>


      {/* ===================================================
          NOTE
      =================================================== */}

      <div
        className="
          mt-[5px]
          border-t
          border-dashed
          border-[#777777]
          pt-[4px]
          text-[6.5px]
          leading-snug
        "
      >

        <strong>Note:</strong>{" "}
        This report has been prepared based on the
        information recorded in the property survey
        system. This document is not a final proof of
        property ownership.

      </div>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer
        className="
          mt-[4px]
          flex
          items-center
          justify-between
          gap-4
          text-[6px]
          text-[#666666]
        "
      >

        <span>
          System Generated Property Survey Report
        </span>

        <span>
          Generated on:{" "}
          {formatDate(
            new Date().toISOString()
          )}
        </span>

      </footer>

    </div>
  );
}