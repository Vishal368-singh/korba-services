export default function SurveyTabs({
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    {
      label: "Pending",
      count: 220,
    },
    {
      label: "Approved",
      count: 2140,
    },
    {
      label: "Rejected",
      count: 90,
    },
  ];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={
            activeTab === tab.label
              ? "tab active"
              : "tab"
          }
          onClick={() => setActiveTab(tab.label)}
        >
          {tab.label}

          <span className="tab-count">
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}