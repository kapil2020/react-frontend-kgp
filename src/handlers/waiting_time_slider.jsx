import React from "react";

// WaitingTimeDisplay Component
const WaitingTimeDisplay = ({ waitingLevel }) => {
  // Function to determine waiting time details
  const getWaitingTimeDetails = (level) => {
    if (!level || typeof level !== "string") {
      return { time: "No Waiting Time", count: 0, label: "No Waiting Time" };
    }

    const trimmedLevel = level.trim();

    const label = trimmedLevel.split(":")[0]; // Extract the label (Low, Medium, High)

    switch (label.toLowerCase()) {
      case "low":
        return { time: trimmedLevel, count: 1, label: "Low" };
      case "medium":
        return { time: trimmedLevel, count: 2, label: "Medium" };
      case "high":
        return { time: trimmedLevel, count: 3, label: "High" };
      default:
        return { time: "No Waiting Time", count: 0, label: "No Waiting Time" };
    }
  };

  const { time, count, label } = getWaitingTimeDetails(waitingLevel);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2">
        {Array.from({ length: count }, (_, index) => (
          <span key={index} className="text-4xl">
            ⏳
          </span> // Hourglass icon
        ))}
      </div>
    </div>
  );
};
export default WaitingTimeDisplay;
