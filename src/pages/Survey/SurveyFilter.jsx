import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import SearchableMultiSelect from "../../components/SearchableMultiSelect";

const WARD_OPTIONS=["Ward 1","Ward 2","Ward 3","Ward 4"];
const SURVEYOR_OPTIONS=["Surveyor 1","Surveyor 2","Surveyor 3","Surveyor 4"];

export default function SurveyFilter() {
  const [wards,setWards]=useState([]);
  const [surveyors,setSurveyors]=useState([]);
  return (
    <div className="filter-section">
      <div className="search-box">
        <FaSearch />

        <input
          type="text"
          placeholder="Search Survey ID / Owner"
        />
      </div>
      
      <SearchableMultiSelect
      options={ WARD_OPTIONS}
      selected={wards}
      onChange={setWards}
      placeholder="All Wards"
      />
      <SearchableMultiSelect
      options={SURVEYOR_OPTIONS}
      selected={surveyors}
      onChange={setSurveyors}
      placeholder="All Surveyors"
      />

      <input type="date" />
    </div>
  );
}