import { useState } from "react";
import {
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaChevronLeft,
} from "react-icons/fa";

const PRIMARY = "#7a1453";

export default function Pagination({
  totalRecords,
  currentpage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}) {
  const [jumpValue, setJumpValue] = useState("");
  const handleJump = (e) => {

    e.preventDefault();
    const pageNum = parseInt(jumpValue, 10);
    if (!pageNum || pageNum < 1 || pageNum > totalPages) {
      return;
    }
    onPageChange(pageNum);
    setJumpValue("");
  };
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 px-1 text-sm">
      <span className="font-semibold text-gray-700">
        Total Records:{totalRecords}
      </span>
      <div className="flex items-center gap-3">
        <button
          disabled={!hasPrevious}
          onClick={() => onPageChange(currentpage - 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          <FaChevronLeft size={10} />
          previous
        </button>
        <span className="text-gray-600">
          Page {currentpage} of {totalPages}
        </span>
        <button
          disabled={!hasNext}
          onClick={() => onPageChange(currentpage + 1)}
          style={{ borderColor: PRIMARY, color: PRIMARY }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#7a1453]/5 transition"
        >
          Next
          <FaChevronCircleRight size={10} />
        </button>

        <form onSubmit={handleJump} className="flex items-center gap-1.5">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            placeholder="Go to"
            className="w-16 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
          />
          <button
            type="submit"
            style={{ backgroundColor: PRIMARY }}
            className="px-3 py-1.5 rounded-md text-white text-xs font-medium hover:opacity-90"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
}
