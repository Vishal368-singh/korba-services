import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DashboardHeader from "./DashboardHeader";
import KeyIndicators from "./KeyIndicators";
import DashboardCharts from "./DashboardCharts";
import PropertyBreakdowns from "./PropertyBreakdowns";
import DataCompletenes from "./DataCompleteness";
import {
  fetchKeyIndicators,
  fetchRevenueBreakdown,
  fetchUsersBreakdown,
  fetchConversionsTrend,
  fetchSessionsTrend,
  fetchPropertyBreakdowns,
  fetchDataCompleteness,
  fetchDashboardData,
} from "../../services/api";

const PRIMARY = [122, 20, 83];

// Fixed column width presets so tables line up across sections
const THREE_COL = {
  0: { cellWidth: 90 },
  1: { cellWidth: 46 },
  2: { cellWidth: 46 },
};

const TWO_COL = {
  0: { cellWidth: 90 },
  1: { cellWidth: 92 },
};

const FOUR_COL = {
  0: { cellWidth: 70 },
  1: { cellWidth: 37 },
  2: { cellWidth: 37 },
  3: { cellWidth: 38 },
};

export default function Dashboard() {
  const today = new Date();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDownloading, setIsDownLoading] = useState(false);

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [keyIndicatorsData, setKeyIndicatorsData] = useState(null);

const handleSegmentClick = (label, uids) => {
  console.log("CLICKED:", label, "uids count:", uids?.length);
  setSelectedFilter((prev) => {
    const next = prev?.label === label ? null : { label, uids: uids || [] };
    console.log("NEW selectedFilter:", next?.label, "uids:", next?.uids?.length);
    return next;
  });
};
  // Fetch dashboard data when date range changes
useEffect(() => {
  console.log("FETCHING with selectedFilter:", selectedFilter?.label, selectedFilter?.uids?.length);
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchDashboardData(startDate, endDate, selectedFilter?.uids);
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
}, [startDate, endDate, selectedFilter]); // Re-fetch when date range changes

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

  const addSectionTitle = (doc, title, y) => {
    doc.setFontSize(13);
    doc.setTextColor(...PRIMARY);
    doc.text(title, 14, y);
    return y + 5;
  };

  const addTable = (doc, head, body, startY, columnWidths) => {
    autoTable(doc, {
      startY,
      head: [head],
      body,
      headStyles: { fillColor: PRIMARY, fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 2 },
      margin: { left: 14, right: 14 },
      columnStyles: columnWidths,
      tableWidth: 182,
    });
    return doc.lastAutoTable.finalY + 10;
  };

  const ensureSpace = (doc, y, needed = 40) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + needed > pageHeight - 15) {
      doc.addPage();
      return 20;
    }
    return y;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-17.5">
      <DashboardHeader
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
        isDownloading={isDownloading}
      />
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
  );
}
