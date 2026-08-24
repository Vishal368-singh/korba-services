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
export default function SurveyTabs({ activeTab, setActiveTab, counts, loading }) {

  if(loading || !counts){
    return<div className="stats-grid">Loading Statistics...</div>
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
