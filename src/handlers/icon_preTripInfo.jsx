import React from "react";

// PreTripInfoDisplay Component
const PreTripInfoDisplay = ({ infoLevel }) => {
  const getInfoDetails = (level) => {
    if (!level || typeof level !== "string") {
      return { label: "No Info Available", icon: "❌" }; // Default
    }

    const trimmedLevel = level.trim();

    switch (trimmedLevel) {
      case "Available":
        return { label: "Info Available", icon: "📋" }; // Clipboard icon
      case "Not Available":
        return { label: "Info Not Available", icon: "❌" }; // Cross icon
      default:
        return { label: "Unknown Info Status", icon: "❓" }; // Unknown icon
    }
  };

  const { label, icon } = getInfoDetails(infoLevel);

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <span className="text-4xl">{icon}</span>
    </div>
  );
};

export default PreTripInfoDisplay;
