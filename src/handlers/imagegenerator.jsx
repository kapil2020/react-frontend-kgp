import React from "react";
import AQI_good from "../aqi_images/AQI_good.jpg";
import AQI_moderate from "../aqi_images/AQI_moderate.jpg";
import AQI_poor from "../aqi_images/AQI_poor.jpg";
import AQI_severe from "../aqi_images/AQI_severe.jpg";
import AQI_verypoor from "../aqi_images/AQI_verypoor.jpg";

const AQIImageDisplay = ({ aqiData }) => {
  // Normalize and determine image path based on AQI category
  const getImageByAQI = (aqiCategory) => {
    if (!aqiCategory) {
      return AQI_good; // Default case
    }
    const normalizedCategory = aqiCategory.trim().toLowerCase();

    if (
      normalizedCategory === "good (0-50)" ||
      normalizedCategory === "satisfactory (51-100)"
    ) {
      return AQI_good;
    } else if (normalizedCategory === "moderate (101-200)") {
      return AQI_moderate;
    } else if (normalizedCategory === "poor (201-300)") {
      return AQI_poor;
    } else if (normalizedCategory === "very poor (301-400)") {
      return AQI_verypoor;
    } else if (normalizedCategory === "severe (401+)") {
      return AQI_severe;
    } else {
      return AQI_good; // Default case
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      <img
        src={getImageByAQI(aqiData)}
        alt={`AQI category: ${aqiData}`}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-cover rounded shadow-lg"
      />
    </div>
  );
};

export default AQIImageDisplay;
