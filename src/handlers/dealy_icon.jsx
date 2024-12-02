import React from "react";

const DelayDisplay = ({ delayLevel }) => {
  const getDelayDetails = (level) => {
    if (!level || typeof level !== "string") {
      return { label: "No Delay", count: 0 };
    }

    const trimmedLevel = level.trim();

    switch (trimmedLevel.toLowerCase()) {
      case "0-10% additional time":
        return { label: "Minimal Delay", count: 1 };
      case "11-25% additional time":
        return { label: "Moderate Delay", count: 2 };
      case "26-50% additional time":
        return { label: "Significant Delay", count: 3 };
      default:
        return { label: "No Delay", count: 0 };
    }
  };

  const { label, count } = getDelayDetails(delayLevel);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2">
        {Array.from({ length: count }, (_, index) => (
          <span key={index} className="text-4xl">
            ⏱️
          </span> // Clock icon
        ))}
      </div>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
};

export default DelayDisplay;
