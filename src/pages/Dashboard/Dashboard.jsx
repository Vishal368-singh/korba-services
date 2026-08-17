import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import KeyIndicators from "./KeyIndicators";

export default function Dashboard(){
  const today=new Date();
  const [startDate,setStartDate]=useState(
    new Date(today.getFullYear(),today.getMonth(),today.getDate()-9),
  );
  const [endDate,setEndDate]=useState(today);

  const handleDateChange=(start,end)=>{
    setStartDate(start);
    setEndDate(end);
  };
  
  return(
     <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <DashboardHeader
       startDate={startDate}
       endDate={endDate}
       onDateChange={handleDateChange}
      />
        <KeyIndicators />
     </div>
  );



}