import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import KeyIndicators from "./KeyIndicators";
import DashboardCharts from "./DashboardCharts";
import PropertyBreakdowns from "./PropertyBreakdowns";
import DataCompletenes from "./DataCompleteness";
export default function Dashboard() {
  const today = new Date();
  const [startDate, setStartDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 9),
  );
  const [endDate, setEndDate] = useState(today);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-[70px] ">
      <DashboardHeader
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
      />
      <div className="mt-6">
        <KeyIndicators />
      </div>
      
        <DashboardCharts />
        <PropertyBreakdowns />
        <DataCompletenes/>
    
    </div>
    
  );
}
