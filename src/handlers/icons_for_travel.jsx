import React from "react";

const TravelPurposeDisplay = ({ travelPurpose }) => {
  // Function to get appropriate icon or emoji based on travel purpose
  const getIconByPurpose = (purpose) => {
    const normalizedPurpose = purpose?.trim().toLowerCase();

    switch (normalizedPurpose) {
      case "education":
        return "🎓"; // Graduation cap
      case "work/business":
        return "💼"; // Briefcase
      case "leisure/personal":
        return "🎉"; // Party popper
      case "healthcare":
        return "🏥"; // Hospital
      case "shopping":
        return "🛍️"; // Shopping bags
      case "commuting":
        return "🚗"; // Car
      default:
        return "❓"; // Question mark for unknown purposes
    }
  };
  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      <div className="flex flex-col items-center bg-gray-5 shadow-md p-1 rounded-lg">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          {getIconByPurpose(travelPurpose)}
        </div>
      </div>
    </div>
  );
};

export default TravelPurposeDisplay;
