import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PRIMARY = "#7a1453";

const formatDate = (date) =>
  date
    ? date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

const isSameDay = (a, b) =>
  a && b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function DateRangePicker({ startDate, endDate, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(startDate || new Date());
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);

  const wrapperRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target) &&
        !e.target.closest(".date-picker-portal")
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openPicker = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
    setTempStart(startDate);
    setTempEnd(endDate);
    setIsOpen((prev) => !prev);
  };

  const handleDayClick = (day) => {
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(day);
      setTempEnd(null);
    } else if (day < tempStart) {
      setTempStart(day);
    } else {
      setTempEnd(day);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setTempStart(today);
    setTempEnd(today);
    setViewMonth(today);
  };

  const handleApply = () => {
    if (tempStart && tempEnd) {
      onChange(tempStart, tempEnd);
      setIsOpen(false);
    } else if (tempStart) {
      onChange(tempStart, tempStart);
      setIsOpen(false);
    }
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const totalDays = daysInMonth(year, month);
  const startOffset = firstDayOfMonth(year, month);
  const dayCells = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => new Date(year, month, i + 1)),
  ];

  const isInRange = (day) =>
    tempStart && tempEnd && day > tempStart && day < tempEnd;

  return (
    <div ref={wrapperRef} className="relative w-full  sm:w-auto">
      <button
        ref={btnRef}
        onClick={openPicker}
        style={{ borderColor: PRIMARY, color: PRIMARY }}
        className="flex items-center gap-2 border bg-white px-5 py-2  h-10 rounded-lg text-sm font-bold   w-60 sm:w-60 justify-center hover:bg-[#7a1453]/5 transition"
      >
        <FaCalendarAlt />
        <span className="truncate">
          {startDate && endDate
            ? `${formatDate(startDate)} – ${formatDate(endDate)}`
            : "Select date range"}
        </span>
      </button>

      {isOpen &&
        createPortal(
          <div
            className="date-picker-portal fixed sm:absolute z-[2000] bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-[300px]"
            style={{
              top: pos.top,
              left: Math.min(pos.left, window.innerWidth - 316),
            }}
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() =>
                  setViewMonth(new Date(year, month - 1, 1))
                }
                className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
              >
                <FaChevronLeft size={12} />
              </button>
              <span className="font-semibold text-sm text-gray-800">
                {viewMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                onClick={() =>
                  setViewMonth(new Date(year, month + 1, 1))
                }
                className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
              >
                <FaChevronRight size={12} />
              </button>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div
                  key={d}
                  className="text-center text-xs text-gray-400 font-medium py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">
              {dayCells.map((day, idx) => {
                if (!day) return <div key={idx} />;

                const selected =
                  isSameDay(day, tempStart) || isSameDay(day, tempEnd);
                const inRange = isInRange(day);
                const today = isSameDay(day, new Date());

                return (
                  <button
                    key={idx}
                    onClick={() => handleDayClick(day)}
                    style={
                      selected
                        ? { backgroundColor: PRIMARY, color: "#fff" }
                        : inRange
                        ? { backgroundColor: `${PRIMARY}1A`, color: PRIMARY }
                        : undefined
                    }
                    className={`text-xs h-8 w-8 rounded-full flex items-center justify-center transition
                      ${!selected && !inRange ? "hover:bg-gray-100 text-gray-700" : ""}
                      ${today && !selected ? "font-bold" : ""}
                    `}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={handleToday}
                style={{ color: PRIMARY }}
                className="text-xs font-medium hover:bg-[#]"
              >
                Today
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-medium text-gray-500 px-3 py-1.5 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  style={{ backgroundColor: PRIMARY }}
                  className="text-xs font-medium text-white px-3 py-1.5 rounded-md hover:opacity-90"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}