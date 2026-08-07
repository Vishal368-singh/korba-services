import { FaSearch } from "react-icons/fa";

export default function SurveyFilter() {
  return (
    <div className="filter-section">
      <div className="search-box">
        <FaSearch />

        <input
          type="text"
          placeholder="Search Survey ID / Owner"
        />
      </div>

      <select>
        <option>All Wards</option>
      </select>

      <select>
        <option>All Surveyors</option>
      </select>

      <input type="date" />
    </div>
  );
}