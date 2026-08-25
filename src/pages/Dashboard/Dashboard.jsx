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
  fetchDashboardData
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
  const [startDate, setStartDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 9),
  );
  const [endDate, setEndDate] = useState(today);
  const [isDownloading, setIsDownLoading] = useState(false);

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data when date range changes
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
       
        setLoading(true);
        setError(null);

        const response = await fetchDashboardData(startDate, endDate);

        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError("Failed to fetch dashboard data");
        }
      } catch (err) {
      //  console.error("Error loading dashboard data:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [startDate, endDate]); // Re-fetch when date range changes

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

  const handleDownloadReport = async () => {
    try {
      setIsDownLoading(true);
      const [
        keyIndicatorsRes,
        revenueRes,
        usersRes,
        conversionsRes,
        sessionsRes,
        breakdownsRes,
        completenessRes,
      ] = await Promise.all([
        fetchKeyIndicators(),
        fetchRevenueBreakdown(),
        fetchUsersBreakdown(),
        fetchConversionsTrend(),
        fetchSessionsTrend(),
        fetchPropertyBreakdowns(),
        fetchDataCompleteness(),
      ]);

      const doc = new jsPDF();
      let y = 15;

      doc.setFontSize(18);
      doc.setTextColor(...PRIMARY);
      doc.text("Survey KPI Dashboard Report", 14, y);
      y += 7;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `${startDate.toLocaleDateString("en-GB")} - ${endDate.toLocaleDateString("en-GB")}`,
        14,
        y,
      );
      y += 10;

      y = addSectionTitle(doc, "Key Indicators", y);
      y = addTable(
        doc,
        ["Indicators", "Value", "Detail"],
        (keyIndicatorsRes.indicators || []).map((item) => [
          item.label,
          String(item.value),
          item.subtext,
        ]),
        y,
        THREE_COL,
      );

      y = ensureSpace(doc, y);
      y = addSectionTitle(doc, "Tax Rate Zone", y);
      y = addTable(
        doc,
        ["Zone", "Count", "Percentage"],
        revenueRes.segments.map((s) => [
          s.label,
          String(s.value),
          `${s.percent}%`,
        ]),
        y,
        THREE_COL,
      );

      y = ensureSpace(doc, y);
      y = addSectionTitle(doc, "Property Location", y);
      y = addTable(
        doc,
        ["Ward", "Count", "Percentage"],
        usersRes.segments.map((s) => [
          s.label,
          String(s.value),
          `${s.percent}%`,
        ]),
        y,
        THREE_COL,
      );

      y = ensureSpace(doc, y);
      y = addSectionTitle(doc, "Property Age", y);
      y = addTable(
        doc,
        ["Age Range", "Properties"],
        conversionsRes.data.map((d) => [d.label, String(d.value)]),
        y,
        TWO_COL,
      );

      y = ensureSpace(doc, y);
      y = addSectionTitle(doc, "Utilities", y);
      y = addTable(
        doc,
        ["Utility", "Properties"],
        sessionsRes.data.map((d) => [d.label, String(d.value)]),
        y,
        TWO_COL,
      );

      breakdownsRes.charts.forEach((chart) => {
        y = ensureSpace(doc, y);
        y = addSectionTitle(doc, chart.title, y);
        y = addTable(
          doc,
          ["Category", "Count", "Percentage"],
          chart.segments.map((s) => [
            s.label,
            String(s.value),
            `${s.percent}%`,
          ]),
          y,
          THREE_COL,
        );
      });

      y = ensureSpace(doc, y);
      y = addSectionTitle(doc, "Data Completeness", y);
      y = addTable(
        doc,
        ["Metric", "Completed", "Total", "Percentage"],
        completenessRes.metrics.map((m) => {
          const percent =
            completenessRes.total > 0
              ? ((m.completed / completenessRes.total) * 100).toFixed(1)
              : "0";
          return [
            m.label,
            String(m.completed),
            String(completenessRes.total),
            `${percent}%`,
          ];
        }),
        y,
        FOUR_COL,
      );

      doc.save(`Survey-KPI-Report-${today.toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Failed to generate report:", error);
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
      <div className="mt-6">
        <KeyIndicators data={dashboardData?.key_indicators} />
      </div>

      <DashboardCharts data = {dashboardData} />
      <PropertyBreakdowns  data = {dashboardData} />
      <DataCompletenes />
    </div>
  );
}

