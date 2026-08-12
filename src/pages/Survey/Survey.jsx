import { useState } from "react";
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSearch,
  FaEye,
  FaSyncAlt,
  FaFileExport,
} from "react-icons/fa";

import "./Survey.css";
import { useEffect } from "react";
import {
  fetchCompletedSurveys,
  fetchRejectedPendingSurveys,
  fetchAllSurveys,
} from "../../services/api";
import SurveyStatistics from "./SurveyStatistics";
import SurveyTabs from "./SurveyTabs";
import SurveyFilter from "./SurveyFilter";
import SurveyTable from "./SurveyTable";

export default function Survey() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSurveyData = async () => {
      try {
        setLoading(true);

        let response;

        switch (activeTab) {
          case "Approved":
            response = await fetchCompletedSurveys();
            break;

          case "All":
            response = await fetchAllSurveys();
            break;

          case "Rejected":
            response = await fetchRejectedPendingSurveys();
            response = response.rejected;
            break;

          case "Pending":
          default:
            response = await fetchRejectedPendingSurveys();
            response = response.pending;
            break;
        }
        setSurveyData(response.surveys || []);
      } catch (error) {
        console.error("Error fetching survey data:", error);
        setSurveyData([]);
      } finally {
        setLoading(false);
      }
    };

    loadSurveyData();
  }, [activeTab]);

  return (
    <div className="survey-page">
      {/* Header */}

      <div className="page-header">
        <div>
          <h2>Survey Management</h2>
          <p>Manage and review property survey records.</p>
        </div>

        <div className="header-actions">
          <button className="refresh-btn">
            <FaSyncAlt />
            Refresh
          </button>

          <button className="export-btn">
            <FaFileExport />
            Export
          </button>
        </div>
      </div>

      {/* Statistics */}
      <SurveyStatistics />

      {/* Tabs */}

      <SurveyTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Filters */}
      <SurveyFilter />

      {/* Table */}
      <SurveyTable data={surveyData} activeTab={activeTab} />
    </div>
  );
}
