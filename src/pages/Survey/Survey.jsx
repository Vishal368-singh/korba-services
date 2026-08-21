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
import notify from "../../utils/toast";
import Pagination from "./Pagination";

export default function Survey() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optimisticCounts, setOptimisticCounts] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total_surveys: 0,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });

  const loadSurveyData = async () => {
    try {
      setLoading(true);

      let response;

      switch (activeTab) {
        case "Approved":
          response = await fetchCompletedSurveys(currentPage);
          break;

        case "All":
          response = await fetchAllSurveys(currentPage);
          break;

        case "Rejected":
          response = await fetchRejectedPendingSurveys(currentPage);
          response = response.rejected;
          break;

        case "Pending":
        default:
          response = await fetchRejectedPendingSurveys(currentPage);
          response = response.pending;
          break;
      }

      setSurveyData(response.surveys || []);
      setPagination({
        total_surveys: response.total_surveys ?? 0,
        total_pages: response.total_pages ?? 1,
        has_next: response.has_next ?? false,
        has_previous: response.has_previous ?? false,
      });
    } catch (error) {
      console.error("Error fetching survey data:", error);
      setSurveyData([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadSurveyData();
  }, [activeTab, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
  const handleRefreshClick = async () => {
    await loadSurveyData();
    notify.success("Data Refresh");
  };
  return (
    <div className="survey-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="text-2xl sm:text-3xl  text-[#7a1453]">Survey Management</h2>
          <p className="text-[#666]  mt-1">Manage and review property survey records.</p>
        </div>

        <div className="header-actions">
          <button className="refresh-btn" onClick={handleRefreshClick}>
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
      <Pagination
        totalRecords={pagination.total_surveys}
        currentPage={currentPage}
        totalPages={pagination.total_pages}
        hasNext={pagination.has_next}
        hasPrevious={pagination.has_previous}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
