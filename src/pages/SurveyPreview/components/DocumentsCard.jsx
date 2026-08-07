import {
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";

import "../SectionCard.css";
import "../SurveyPreview.css";

export default function DocumentsCard({ data }) {
  if (!data) return null;

  const documents = [
    {
      title: "Aadhaar Copy",
      available: data.aadhaar_copy,
      files: data.aadhaar_copy_files,
    },
    {
      title: "Electricity Bill",
      available: data.electricity_bill,
      files: data.electricity_bill_files,
    },
    {
      title: "Water Bill",
      available: data.water_bill,
      files: data.water_bill_files,
    },
    {
      title: "Sale Deed",
      available: data.sale_deed,
      files: data.sale_deed_files,
    },
    {
      title: "Property Tax Receipt",
      available: data.property_tax_receipt,
      files: data.property_tax_receipt_files,
    },
    {
      title: "Building Permission",
      available: data.building_permission,
      files: data.building_permission_files,
    },
    {
      title: "Other Documents",
      available: data.other_documents,
      files: data.other_documents_files,
    },
  ];

  return (
    <div className="section-card">

      <div className="section-header">
        <h3>Documents</h3>
      </div>

      <div className="documents-grid">

        {documents.map((doc) => (

          <div
            className="document-card"
            key={doc.title}
          >

            <div className="document-header">

              <h4>{doc.title}</h4>

              {doc.files?.length ? (
                <FaCheckCircle className="uploaded" />
              ) : (
                <FaTimesCircle className="not-uploaded" />
              )}

            </div>

            {doc.files?.length ? (

              <>
                <div className="document-preview">

                  {doc.files.map((file, index) => (

                    <img
                      key={index}
                      src={file}
                      alt={doc.title}
                    />

                  ))}

                </div>

                <button
                  className="view-btn"
                  onClick={() =>
                    window.open(doc.files[0], "_blank")
                  }
                >
                  <FaExternalLinkAlt />

                  View Document
                </button>
              </>

            ) : (

              <p className="no-document">
                Not Uploaded
              </p>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}