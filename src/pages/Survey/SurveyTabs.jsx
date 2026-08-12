import { useState, useEffect } from "react";
import { fetchSurveyStatusCounts } from "../../services/api";
const tabs = [
  {
    label: "All",
    key: "Total",
  },
  {
    label: "Pending",
    key: "Pending",
  },
  {
    label: "Approved",
    key: "Approved",
  },
  {
    label: "Rejected",
    key: "Rejected",
  },
];
export default function SurveyTabs({ activeTab, setActiveTab }) {
  const [counts, setCounts] = useState({});

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetchSurveyStatusCounts();
      setCounts(response.status_counts || {});
    } catch (error) {
      console.error("Error fetching survey statistics:", error);
      setCounts({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="stats-grid">Loading statistics...</div>;
  }

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={activeTab === tab.label ? "tab active" : "tab"}
          onClick={() => setActiveTab(tab.label)}
        >
          {tab.label}

          <span className="tab-count">{counts[tab.key] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}
