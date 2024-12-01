import React from "react";
import { Chart } from "react-google-charts";

// Pac-Man Style Pie Chart Component
const TravelTimePacManChart = ({ travelTime }) => {
  // Ensure travelTime is provided and in the correct format
  if (!travelTime || !travelTime.includes(":")) {
    return <div className="text-red-500">Invalid travel time format</div>;
  }

  // Parse the input like "Medium: 30 min" to extract time
  const timeValue = parseInt(
    travelTime.split(":")[1].trim().replace("min", "").trim()
  );

  // Validate the parsed value
  if (isNaN(timeValue) || timeValue < 0 || timeValue > 60) {
    return <div className="text-red-500">Invalid travel time value</div>;
  }

  const travelPercentage = ((timeValue / 60) * 100).toFixed(1);
  const remainingPercentage = (100 - travelPercentage).toFixed(1);

  // Chart data for visualization
  const data = [
    ["Category", "Percentage"],
    ["Travel Time", parseFloat(travelPercentage)],
    ["Remaining Time", parseFloat(remainingPercentage)],
  ];

  // Chart options for visualization
  const options = {
    legend: "none",
    pieSliceText: "none",
    pieStartAngle: 90,
    tooltip: { trigger: "none" },
    slices: {
      0: { color: "red" }, // Travel time slice
      1: { color: "green" }, // Remaining time slice
    },
  };

  return (
    <div className="flex items-center justify-center">
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"120px"}
        height={"120px"}
      />
    </div>
  );
};

// App Component (Main)
const TravelTimeDisplay = ({ Travel_time }) => {
  // Validate input prop
  if (!Travel_time) {
    return <div className="text-blue-500">Travel time data is required</div>;
  }

  return (
    <div className=" flex flex-col items-center gap-6 py-2">
      <TravelTimePacManChart travelTime={Travel_time} />
    </div>
  );
};

export default TravelTimeDisplay;
