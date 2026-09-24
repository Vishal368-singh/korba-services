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
  const [activeTab, setActiveTab] = useState("All");
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optimisticCounts, setOptimisticCounts] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  // Search
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    total_surveys: 0,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });

  const latestRequestId = useRef(0);

  // =========================================================
  // SEARCH CHANGE
  // =========================================================
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // =========================================================
  // LOAD SURVEY DATA
  // =========================================================
  const loadSurveyData = useCallback(
    async (pageOverride) => {
      const pageToUse = pageOverride ?? currentPage;

      const requestId = ++latestRequestId.current;

      try {
        setLoading(true);

        let response;

        switch (activeTab) {
          case "Approved":
            response = await fetchCompletedSurveys(pageToUse, search);
            break;

          case "All":
            response = await fetchAllSurveys(pageToUse, 20, search);
            break;

          case "Rejected":
            response = await fetchRejectedPendingSurveys(pageToUse, 1, search);
            response = response.rejected;
            break;

          case "Pending":
          default:
            response = await fetchRejectedPendingSurveys(pageToUse, 1, search);
            response = response.pending;
            break;
        }

        // Ignore old request
        if (requestId !== latestRequestId.current) {
          return;
        }

        const paginationSource = response.pagination || response;

        const totalPages = paginationSource.total_pages ?? 1;

        const surveysObj = response.surveys || {};

        setSurveyData(surveysObj);

        setPagination({
          total_surveys: paginationSource.total_surveys ?? 0,

          total_pages: totalPages,

          has_next: paginationSource.has_next ?? false,

          has_previous: paginationSource.has_previous ?? false,
        });
      } catch (error) {
        if (requestId === latestRequestId.current) {
          console.error("Error fetching survey data:", error);

          setSurveyData([]);

          setPagination({
            total_surveys: 0,
            total_pages: 1,
            has_next: false,
            has_previous: false,
          });
        }
      } finally {
        if (requestId === latestRequestId.current) {
          setLoading(false);
        }
      }
    },
    [activeTab, currentPage, search],
  );

  // =========================================================
  // LOAD DATA WHEN TAB / PAGE / SEARCH CHANGES
  // =========================================================
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadSurveyData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [loadSurveyData]);

  // =========================================================
  // TAB CHANGE
  // =========================================================
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // =========================================================
  // PAGE CHANGE
  // =========================================================
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // =========================================================
  // STATISTICS
  // =========================================================
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

  // =========================================================
  // ACTION COMPLETE
  // =========================================================
  const handleActionComplete = (action) => {
    loadSurveyData();

    setOptimisticCounts((prev) => {
      if (!prev) return prev;

      const updated = { ...prev };

      updated.Pending = Math.max(0, (updated.Pending || 0) - 1);

      if (action === "approve") {
        updated.Approved = (updated.Approved || 0) + 1;
      }

      if (action === "reject") {
        updated.Rejected = (updated.Rejected || 0) + 1;
      }

      return updated;
    });

    loadStatistics();
  };

  // =========================================================
  // REFRESH
  // =========================================================
  const handleRefreshClick = async () => {
    await loadSurveyData();

    notify.success("Data Refresh");
  };

  return (
    <div className="survey-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="text-2xl sm:text-3xl text-[#7a1453]">
            Survey Management
          </h2>

          <p className="text-[#666] mt-1">
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

      {/* Search / Filters */}
      <SurveyFilter search={search} setSearch={handleSearchChange} />

      {/* Tabs */}
      <SurveyTabs
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        counts={optimisticCounts}
        loading={statsLoading}
      />

      {/* Table */}
      <SurveyTable
        data={surveyData}
        activeTab={activeTab}
        onActionComplete={handleActionComplete}
      />

      {/* Pagination */}
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
