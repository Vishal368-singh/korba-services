import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

import { fetchSurveyBySurveyID } from "../../services/api";

import SurveyInformationCard from "./components/SurveyInformationCard.jsx";
import OwnerDetailsCard from "./components/OwnerDetailsCard";
// import OccupierDetailsCard from "./components/OccupierDetailsCard";
import PropertyDetailsCard from "./components/PropertyDetailsCard";
import LandBuildingCard from "./components/LandBuildingCard";
import UsageDetailsCard from "./components/UsageDetailsCard";
import UtilityCard from "./components/UtilityCard";
import GISCard from "./components/GISCard";
import VerificationCard from "./components/VerificationCard";
import DocumentsCard from "./components/DocumentsCard";
import RemarksCard from "./components/RemarksCard";

import "./SurveyPreview.css";

export default function SurveyPreview() {
  const navigate = useNavigate();
  const { surveyId } = useParams();

  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurvey();
  }, []);

  const loadSurvey = async () => {
    try {
      setLoading(true);

      const response = await fetchSurveyBySurveyID(surveyId);
      debugger
      if (response.success) {
        setSurvey(response.survey);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="preview-loading">
        Loading Survey...
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="preview-loading">
        Survey not found.
      </div>
    );
  }

  return (
    <div className="preview-page">

      {/* Header */}

      <div className="preview-header">

        <div>

          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />

            Back
          </button>

          <h2>Survey Preview</h2>

        </div>

        <button className="edit-btn">
          <FaEdit />

          Edit
        </button>

      </div>

      {/* Summary */}

      <div className="survey-summary">

        <div>
          <label>Survey ID</label>
          <p>{survey.survey_information.survey_id}</p>
        </div>

        <div>
          <label>Property ID</label>
          <p>{survey.survey_information.property_id}</p>
        </div>

        <div>
          <label>Parcel No</label>
          <p>{survey.survey_information.parcel_no}</p>
        </div>

        <div>
          <label>Surveyor</label>
          <p>{survey.survey_information.surveyor_name}</p>
        </div>

      </div>

      {/* Cards */}

      <SurveyInformationCard
        data={survey.survey_information}
      />

      <OwnerDetailsCard
        data={survey.owner_details}
      />

      {/* <OccupierDetailsCard
        data={survey.occupier_details}
      /> */}

      <PropertyDetailsCard
        data={survey.property_details}
      />

      <LandBuildingCard
        data={survey.land_building_information}
      />

      <UsageDetailsCard
        data={survey.usage_details}
      />

      <UtilityCard
        data={survey.utility_connections}
      />

      <GISCard
        data={survey.gis_information}
      />

      <VerificationCard
        data={survey.verification}
      />

      <DocumentsCard
        data={survey.documents_collected}
      />

      <RemarksCard
        data={survey.surveyor_remarks}
      />

    </div>
  );
}