import { FaDownload } from "react-icons/fa";
import DateRangePicker from "./DateRangePicker";

const PRIMARY = "#7a1453";

export default function DashboardHeader({
  startDate,
  endDate,
  onDateChange,
  onDownloadReport,
  isDownloading,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
      <div>
        <h1 className="text-2xl sm:text-3xl  text-[#7a1453]">
          KPI Dashboard
        </h1>
        <p className="text-[#666]  mt-1">
          Overview of surveyed data and key performance indicators
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-10">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={onDateChange}
        />
        <button
          onClick={onDownloadReport}
          disabled={isDownloading}
          style={{ backgroundColor: PRIMARY }}
          className="flex items-center justify-center gap-2 text-white px-5 py-2 h-10 rounded-lg text-sm font-medium hover:opacity-90 transition w-60 sm:w-70"
        >
          <FaDownload />
          {isDownloading ? "Generating..." : "Download Report"}
        </button>
      </div>
    </div>
  );
}
