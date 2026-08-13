import { useState, useEffect } from "react";
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
import {
  fetchCompletedSurveys,
  fetchRejectedPendingSurveys,
  fetchAllSurveys,
  fetchSurveyStatusCounts,
} from "../../services/api";
import SurveyStatistics from "./SurveyStatistics";
import SurveyTabs from "./SurveyTabs";
import SurveyFilter from "./SurveyFilter";
import SurveyTable from "./SurveyTable";

export default function Survey() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [optimisticCounts, setOptimisticCounts] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

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

  const loadStatistics = async () => {
    try {
      setStatsLoading(true);
      const response = await fetchSurveyStatusCounts();
      setOptimisticCounts(response.status_counts || {});
    } catch (error) {
      console.error("Error fetching survey statistics:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadSurveyData();
  }, [activeTab]);

  useEffect(() => {
    loadStatistics();
  }, []);

  const handleActionComplete = (action) => {
    loadSurveyData();
    setOptimisticCounts((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      updated.Pending = Math.max(0, (updated.pending || 0) - 1);
      if (action === "approve") updated.Approved = (updated.Approved || 0) + 1;
      if (action === "reject") updated.Rejected = (updated.Rejected || 0) + 1;
      return updated;
    });
    loadStatistics();
  };

  return (
    <div className="survey-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Survey Management</h2>
          <p>Manage and review property survey records.</p>
        </div>

        <div className="header-actions">
          <button className="refresh-btn" onClick={loadSurveyData}>
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
      <SurveyStatistics counts={optimisticCounts} loading={statsLoading} />

      {/* Tabs */}
      <SurveyTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={optimisticCounts}
        loading={statsLoading}
      />

      {/* Filters */}
      <SurveyFilter />

      {/* Table */}
      <SurveyTable
        data={surveyData}
        activeTab={activeTab}
        onActionComplete={handleActionComplete}
      />
    </div>
  );
}
