import { useState, useEffect, useCallback, useRef } from "react";
import { FaSyncAlt, FaFileExport } from "react-icons/fa";

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

  // NEW: tracks the most recent survey-data request so stale
  // responses (from a previous tab/page, or duplicate effect
  // firing) can be safely ignored instead of overwriting fresh data.
  const latestRequestId = useRef(0);

  const loadSurveyData = useCallback(
    async (pageOverride) => {
      const pageToUse = pageOverride ?? currentPage;

      // NEW: stamp this call with a unique id
      const requestId = ++latestRequestId.current;

      try {
        setLoading(true);

        let response;

        switch (activeTab) {
          case "Approved":
            response = await fetchCompletedSurveys(pageToUse);
            break;

          case "All":
            response = await fetchAllSurveys(pageToUse);
            break;

          case "Rejected":
            response = await fetchRejectedPendingSurveys(pageToUse);
            response = response.rejected;
            break;

          case "Pending":
          default:
            response = await fetchRejectedPendingSurveys(pageToUse);
            response = response.pending;
            break;
        }

        // NEW: if a newer request has started since this one began,
        // drop this (now-stale) response entirely — don't touch state.
        if (requestId !== latestRequestId.current) {
          return;
        }

        const paginationSource = response.pagination || response;
        const totalPages = paginationSource.total_pages ?? 1;
        const surveysObj = response.surveys || {};
        const hasSurveys = Object.keys(surveysObj).length > 0;

        // Defensive retry: if backend says records exist but this
        // page came back empty, and we're not already on page 1,
        // retry once at page 1. The backend's own page/total_pages
        // fields for "rejected" can't be fully trusted (see bug).
        if (
          !hasSurveys &&
          (paginationSource.total_surveys ?? 0) > 0 &&
          pageToUse !== 1
        ) {
          setCurrentPage(1);
          await loadSurveyData(1);
          return;
        }

        setSurveyData(surveysObj);
        setPagination({
          total_surveys: paginationSource.total_surveys ?? 0,
          total_pages: totalPages,
          has_next: paginationSource.has_next ?? false,
          has_previous: paginationSource.has_previous ?? false,
        });
      } catch (error) {
        // NEW: only report/clear state if this is still the latest request
        if (requestId === latestRequestId.current) {
          console.error("Error fetching survey data:", error);
          setSurveyData([]);
        }
      } finally {
        // NEW: only clear loading if this is still the latest request
        if (requestId === latestRequestId.current) {
          setLoading(false);
        }
      }
    },
    [activeTab, currentPage],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadSurveyData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadSurveyData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

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
    const timeoutId = setTimeout(() => {
      loadStatistics();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleActionComplete = (action) => {
    loadSurveyData();
    setOptimisticCounts((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      updated.Pending = Math.max(0, (updated.Pending || 0) - 1);
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
          <h2 className="text-2xl sm:text-3xl  text-[#7a1453]">
            Survey Management
          </h2>
          <p className="text-[#666]  mt-1">
            Manage and review property survey records.
          </p>
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
        setActiveTab={handleTabChange}
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
