import React from "react";

const GreenCoverDisplay = ({ greenCoverLevel }) => {
  const getGreenCoverDetails = (level) => {
    if (!level || typeof level !== "string") {
      return { label: "No Green Cover", count: 0 };
    }

    const trimmedLevel = level.trim();

    switch (trimmedLevel.toLowerCase()) {
      case "low green cover (urban/industrial areas)":
        return { label: "Low Green Cover", count: 1 };
      case "medium green cover":
        return { label: "Moderate", count: 2 };
      case "high green cover (tree-lined parks)":
        return { label: "High green cover", count: 3 };
      default:
        return { label: "No green cover", count: 0 };
    }
  };

  const { label, count } = getGreenCoverDetails(greenCoverLevel);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2">
        {Array.from({ length: count }, (_, index) => (
          <span key={index} className="text-4xl">
            🍃
          </span> // Leaf icon
        ))}
      </div>
    </div>
  );
};

export default GreenCoverDisplay;
