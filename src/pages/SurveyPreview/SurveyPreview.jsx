import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { fetchSurveyBySurveyID } from "../../services/api";
import SurveyInformationCard from "./components/SurveyInformationCard.jsx";
import OwnerDetailsCard from "./components/OwnerDetailsCard";
import PropertyDetailsCard from "./components/PropertyDetailsCard";
import LandBuildingCard from "./components/LandBuildingCard";
import UsageDetailsCard from "./components/UsageDetailsCard";
import UtilityCard from "./components/UtilityCard";
import GISCard from "./components/GISCard";
import VerificationCard from "./components/VerificationCard";
import DocumentsCard from "./components/DocumentsCard";
import RemarksCard from "./components/RemarksCard";
import {  Cancel } from "@mui/icons-material";
import { updateSurvey } from "../../services/api";
import "./SurveyPreview.css";
import notify from "../../utils/toast.js";

export default function SurveyPreview() {
  const navigate = useNavigate();
  const { surveyId } = useParams();

  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const loadSurvey = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchSurveyBySurveyID(surveyId);
      if (response.success) {
        setSurvey(response.survey);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [surveyId]);

  useEffect(() => {
    const loadSurveyAsync = async () => {
      await loadSurvey();
    };

    loadSurveyAsync();
  }, [loadSurvey]);

  // Update handler for each section
  const handleSectionUpdate = (sectionKey, updatedData) => {
    ;
    setSurvey((prev) => ({
      ...prev,
      [sectionKey]: updatedData,
    }));
    setHasChanges(true);
  };
  // Save all changes
  const handleSaveAll = async () => {
    if (!hasChanges) {
      notify.info("No changes to save");
      return;
    }

    try {
      setSaving(true);
      const loadingId = notify.loading("Saving all changes...");

      // Prepare the complete survey data
      const surveyData = {
        survey_id: surveyId,
        survey_information: survey.survey_information,
        owner_details: survey.owner_details,
        property_details: survey.property_details,
        land_building_information: survey.land_building_information,
        usage_details: survey.usage_details,
        utility_connections: survey.utility_connections,
        gis_information: survey.gis_information,
        verification: survey.verification,
        documents_collected: survey.documents_collected,
        surveyor_remarks: survey.surveyor_remarks,
      };

      // Call API to update survey
      const response = await updateSurvey(surveyId, surveyData);

      notify.dismiss(loadingId);

      if (response.success) {
        notify.success("All changes saved successfully!");
        setHasChanges(false);
        // Reload survey to get fresh data
        await loadSurvey();
      } else {
        notify.error(response.message || "Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving survey:", error);
      notify.error(error.message || "Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel all changes and reload
  const handleCancelChanges = async () => {
    
    if (hasChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to discard them?",
        )
      ) {
        await loadSurvey();
        notify.info("Changes discarded");
        setSaving(false);
        setHasChanges(false);
      }
    }
  };

  if (loading) {
    return <div className="preview-loading">Loading Survey...</div>;
  }

  if (!survey) {
    return <div className="preview-loading">Survey not found.</div>;
  }

  return (
    <div className="preview-page">
      {/* Header */}
      <div className="preview-header">
        <div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
            Back
          </button>
          <h2>Survey Preview</h2>
        </div>
        <div className="header-actions">
          {hasChanges && (
            <span className="unsaved-indicator">• Unsaved changes</span>
          )}
          <button
            className={`save-all-btn ${hasChanges ? "has-changes" : ""}`}
            onClick={handleSaveAll}
            disabled={saving || !hasChanges}
          >
            <FaSave />
            {saving ? "Saving..." : "Save All"}
          </button>
          {hasChanges && (
            <button
              className="cancel-btn"
              onClick={handleCancelChanges}
              disabled={saving}
            >
              <Cancel />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="survey-summary">
        <div>
          <label>Survey ID</label>
          <p>{survey.survey_information?.survey_id}</p>
        </div>
        <div>
          <label>Property ID</label>
          <p>{survey.survey_information?.property_id}</p>
        </div>
        <div>
          <label>Parcel No</label>
          <p>{survey.survey_information?.parcel_no}</p>
        </div>
        <div>
          <label>Surveyor</label>
          <p>{survey.survey_information?.surveyor_name}</p>
        </div>
      </div>

      {/* Cards */}
      <SurveyInformationCard
        data={survey.survey_information}
        onUpdate={handleSectionUpdate}
      />

      {/* Uncomment other cards when ready */}

      <OwnerDetailsCard
        data={survey.owner_details}
        onUpdate={handleSectionUpdate}
      />

      <PropertyDetailsCard
        data={survey.property_details}
        onUpdate={handleSectionUpdate}
      />

      <LandBuildingCard
        data={survey.land_building_information}
        onUpdate={handleSectionUpdate}
      />

      <UsageDetailsCard
        data={survey.usage_details}
        onUpdate={handleSectionUpdate}
      />

      <UtilityCard
        data={survey.utility_connections}
        onUpdate={handleSectionUpdate}
      />

      <GISCard
        data={survey.gis_information}
        surveyInfo={survey.survey_information}
        onUpdate={handleSectionUpdate}
      />

      <VerificationCard
        data={survey.verification}
        onUpdate={handleSectionUpdate}
      />

      <DocumentsCard
        data={survey.documents_collected}
        onUpdate={handleSectionUpdate}
      />

      <RemarksCard
        data={survey.surveyor_remarks}
        onUpdate={handleSectionUpdate}
      />
    </div>
  );
}
