import React from "react";

// TravelCostDisplay Component
const TravelCostDisplay = ({ costLevel }) => {
  // Function to determine the number of money bags and the cost based on the cost level
  const getCostDetails = (level) => {
    if (!level || typeof level !== "string") {
      return { bags: 0, cost: "Unknown" }; // Handle invalid or missing input
    }

    const trimmedLevel = level.trim().toLowerCase();

    if (trimmedLevel.startsWith("low")) {
      return { bags: 1, cost: level.trim() };
    } else if (trimmedLevel.startsWith("medium")) {
      return { bags: 2, cost: level.trim() };
    } else if (trimmedLevel.startsWith("high")) {
      return { bags: 3, cost: level.trim() };
    } else {
      return { bags: 0, cost: "Unknown" }; // For invalid or unknown levels
    }
  };

  const { bags, cost } = getCostDetails(costLevel);

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <div className="flex gap-2">
        {Array.from({ length: bags }, (_, index) => (
          <span key={index} className="text-4xl">
            💰
          </span> // Money bag icon
        ))}
      </div>
    </div>
  );
};

export default TravelCostDisplay;
