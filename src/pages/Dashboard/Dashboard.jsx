import { useState, useEffect } from "react";
import DashboardHeader from "./DashboardHeader";
import KeyIndicators from "./KeyIndicators";
import DashboardCharts from "./DashboardCharts";
import PropertyBreakdowns from "./PropertyBreakdowns";
import DataCompletenes from "./DataCompleteness";
import {
  fetchKeyIndicators,
  fetchDashboardData,
} from "../../services/api";
import { generateDashboardPdf } from "../../utils/generateDashboardPdf";

export default function Dashboard() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDownloading, setIsDownLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [keyIndicatorsData, setKeyIndicatorsData] = useState(null);

  const handleSegmentClick = (label, uids) => {
    setSelectedFilter((prev) => {
      const next = prev?.label === label ? null : { label, uids: uids || [] };
      return next;
    });
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchDashboardData(
          startDate,
          endDate,
          selectedFilter?.uids,
        );
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError("Failed to fetch dashboard data");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [startDate, endDate, selectedFilter]);

  useEffect(() => {
    const loadKeyIndicators = async () => {
      try {
        const response = await fetchKeyIndicators(startDate, endDate);
        if (response.success) {
          setKeyIndicatorsData(response.data);
        }
      } catch (err) {
        console.error("Error loading key indicators:", err);
      }
    };
    loadKeyIndicators();
  }, [startDate, endDate]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleDownloadReport = async () => {
    try {
      setIsDownLoading(true);
      await generateDashboardPdf("dashboard-content");
    } catch (err) {
      console.error("Failed to generate dashboard PDF:", err);
    } finally {
      setIsDownLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-17.5">
      <DashboardHeader
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
        onDownloadReport={handleDownloadReport}
        isDownloading={isDownloading}
      />

      <div id="dashboard-content">
        <div className="mt-6">
          <KeyIndicators data={keyIndicatorsData} />
        </div>

        <DashboardCharts
          data={dashboardData}
          selectedFilter={selectedFilter}
          onSegmentClick={handleSegmentClick}
          onClearFilter={() => setSelectedFilter(null)}
        />
        <PropertyBreakdowns
          data={dashboardData}
          selectedFilter={selectedFilter}
          onSegmentClick={handleSegmentClick}
        />
        <DataCompletenes
          data={dashboardData?.data_completeness}
          selectedFilter={selectedFilter}
          onSegmentClick={handleSegmentClick}
        />
      </div>
    </div>
  );
}