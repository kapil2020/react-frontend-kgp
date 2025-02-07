import React from "react";
import AQI_good from "../aqi_images/AQI_good.jpeg";
import AQI_moderate from "../aqi_images/AQI_moderate.jpeg";
import AQI_poor from "../aqi_images/AQI_poor.jpeg";
import AQI_severe from "../aqi_images/AQI_severe.jpeg";
import AQI_verypoor from "../aqi_images/AQI_verypoor.jpeg";
import AQI_satisfactory from "../aqi_images/AQI_satisfatory.jpeg";

const AQIImageDisplay = ({ aqiData }) => {
  // Normalize and determine image path based on AQI category
  const getImageByAQI = (aqiCategory) => {
    if (!aqiCategory) {
      return AQI_good; // Default case
    }
    const normalizedCategory = aqiCategory.trim().toLowerCase();

    if (normalizedCategory === "good (0-50)") {
      return AQI_good;
    } else if (normalizedCategory === "satisfactory (51-100)") {
      return AQI_satisfactory;
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
        className="flex justify-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-cover rounded shadow-lg"
      />
    </div>
  );
};

export default AQIImageDisplay;
