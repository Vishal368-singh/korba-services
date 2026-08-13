import { useState, useEffect } from "react";
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import { fetchSurveyStatusCounts } from "../../services/api";

const statistics = [
  {
    title: "Total Survey",
    key: "Total",
    icon: <FaClipboardList />,
    color: "#7A1453",
  },
  {
    title: "Pending",
    key: "Pending",
    icon: <FaClock />,
    color: "#F59E0B",
  },
  {
    title: "Approved",
    key: "Approved",
    icon: <FaCheckCircle />,
    color: "#16A34A",
  },
  {
    title: "Rejected",
    key: "Rejected",
    icon: <FaTimesCircle />,
    color: "#DC2626",
  },
];

export default function SurveyStatistics({counts, loading}) {
  
  if(loading || !counts){
    return <div className="stats-grid">Loading statistics...</div>
  }

  

  return (
    <div className="stats-grid">
      {statistics.map((item) => (
        <div className="stat-card" key={item.key}>
          <div className="stat-icon" style={{ background: item.color }}>
            {item.icon}
          </div>
          <div>
            <h4>{item.title}</h4>
            <h2>{counts[item.key] ?? 0}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}
