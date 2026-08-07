import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

const statistics = [
  {
    title: "Total Survey",
    value: 2450,
    icon: <FaClipboardList />,
    color: "#7A1453",
  },
  {
    title: "Pending",
    value: 220,
    icon: <FaClock />,
    color: "#F59E0B",
  },
  {
    title: "Approved",
    value: 2140,
    icon: <FaCheckCircle />,
    color: "#16A34A",
  },
  {
    title: "Rejected",
    value: 90,
    icon: <FaTimesCircle />,
    color: "#DC2626",
  },
];

export default function SurveyStatistics() {
  return (
    <div className="stats-grid">
      {statistics.map((item) => (
        <div className="stat-card" key={item.title}>
          <div
            className="stat-icon"
            style={{ background: item.color }}
          >
            {item.icon}
          </div>

          <div>
            <h4>{item.title}</h4>
            <h2>{item.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}