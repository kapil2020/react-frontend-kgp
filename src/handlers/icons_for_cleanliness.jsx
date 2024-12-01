import React from "react";

// CleanlinessDisplay Component
const CleanlinessDisplay = ({ cleanlinessLevel }) => {
  // Function to determine the number of brooms based on cleanliness level
  const getBroomCount = (level) => {
    const normalizedLevel = level?.toLowerCase().trim();

    switch (normalizedLevel) {
      case "low cleanliness":
        return 1;
      case "moderate cleanliness":
        return 2;
      case "high cleanliness":
        return 3;
      default:
        return 0; // For invalid or unknown levels
    }
  };

  const broomCount = getBroomCount(cleanlinessLevel);

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <div className="flex gap-2">
        {Array.from({ length: broomCount }, (_, index) => (
          <span key={index} className="text-4xl">
            🧹
          </span> // Broom icon
        ))}
      </div>
    </div>
  );
};

export default CleanlinessDisplay;
