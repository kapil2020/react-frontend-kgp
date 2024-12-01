import React, { useState, useEffect } from "react";
import traveloptions from "./traveloptions.json";
import LocationRetrieval from "../general/LocationRetrival";
import TripInformation from "./TripInformation";

const TravelDetails = ({
  thisFormData,
  setThisFormData,
  activeSection,
  setActiveSection,
}) => {
  const [showPTAccess, setShowPTAccess] = useState(false);
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [landmark, setLandmark] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [formData, setFormData] = useState({
    location: { latitude: "", longitude: "" },
    landmark: "",
    origin: "",
    destination: "",
    travelMode: "",
    accessMode: "",
    frequency: "",
    purpose: "",
    distance: "",
  });

  // Synchronize individual states with `formData`
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      location,
      origin,
      destination,
      landmark,
    }));
  }, [location, landmark, origin, destination]);

  const handleModeChange = (event) => {
    const mode = event.target.value;
    setShowPTAccess(mode === "metro" || mode === "bus");
    setFormData((prevData) => ({ ...prevData, travelMode: mode }));
  };

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleSave = () => {
    setThisFormData(formData);
    console.log("Form Data:", formData);
    setIsDone(true);
    alert("Data saved successfully!");
    setActiveSection(0);
    // Add save logic here (e.g., send to backend or localStorage)
  };

  return (
    <>
      {/* Location Retrieval Section */}
      <div className="mx-auto w-full max-w-7xl rounded-lg shadow-sm bg-slate-100 mt-4">
        <LocationRetrieval
          location={location}
          setLocation={setLocation}
          landmark={landmark}
          setLandmark={setLandmark}
        />
      </div>

      {/* Section 1: Trip Information */}
      <div className="mt-8">
        <div className="mx-auto w-full max-w-7xl my-6">
          {/* Section Header */}
          <div
            className="flex justify-between items-center bg-blue-100 p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => {
              if (activeSection !== 1) {
                setActiveSection(1);
              } else {
                setActiveSection(0);
              }
            }}
          >
            <h3 className="text-lg font-bold">Section 1: Trip Information</h3>
            <div className="">
              {isDone && (
                <div>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#20fe45"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M9 10L12.2581 12.4436C12.6766 12.7574 13.2662 12.6957 13.6107 12.3021L20 5"
                        stroke="#23fb3c"
                        stroke-width="2.256"
                        stroke-linecap="round"
                      ></path>{" "}
                      <path
                        d="M21 12C21 13.8805 20.411 15.7137 19.3156 17.2423C18.2203 18.7709 16.6736 19.9179 14.893 20.5224C13.1123 21.1268 11.187 21.1583 9.38744 20.6125C7.58792 20.0666 6.00459 18.9707 4.85982 17.4789C3.71505 15.987 3.06635 14.174 3.00482 12.2945C2.94329 10.415 3.47203 8.56344 4.51677 6.99987C5.56152 5.4363 7.06979 4.23925 8.82975 3.57685C10.5897 2.91444 12.513 2.81996 14.3294 3.30667"
                        stroke="#23fb3c"
                        stroke-width="2.256"
                        stroke-linecap="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
              )}
              <div>
                <span
                  className={`transition-transform duration-300 ${
                    activeSection === 1 ? "rotate-180" : ""
                  }`}
                >
                  {/* Arrow Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Collapsible Content */}
          <div
            className={`transition-all duration-500 overflow-hidden ${
              activeSection === 1 ? "max-h-screen" : "max-h-0"
            }`}
          ></div>
        </div>

        {activeSection === 1 && (
          <section
            id="travel-details"
            className="py-4 px-4 mx-auto w-full max-w-7xl bg-blue-200 sm:px-6 rounded-lg shadow-md"
          >
            {/* Trip Information */}
            <TripInformation
              setOrigin={setOrigin}
              setDestination={setDestination}
            />

            {/* Travel Mode Selection */}
            <label htmlFor="travel_mode" className="block mt-4">
              Q.3 Select the primary mode of travel for your daily trip:
            </label>
            <select
              id="travel_mode"
              onChange={handleModeChange}
              className="border rounded w-full mt-2 p-2"
              value={formData.travelMode}
            >
              <option value="" disabled>
                Select your mode of travel
              </option>
              {traveloptions.travelModes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>

            {/* Public Transport Access Mode */}
            {showPTAccess && (
              <div id="pt_access_mode" className="mt-4">
                <label>If PT, what is the access mode?</label>
                <select
                  id="access_mode"
                  className="border rounded w-full mt-2 p-2"
                  value={formData.accessMode}
                  onChange={(e) =>
                    handleInputChange("accessMode", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select access mode
                  </option>
                  {traveloptions.ptAccessModes.map((accessMode) => (
                    <option key={accessMode.value} value={accessMode.value}>
                      {accessMode.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Frequency */}
            <label htmlFor="frequency" className="block mt-4">
              Q.4 How frequently do you travel in a week using the primary mode
              mentioned?
            </label>
            <select
              id="frequency"
              className="border rounded w-full mt-2 p-2"
              value={formData.frequency}
              onChange={(e) => handleInputChange("frequency", e.target.value)}
            >
              <option value="" disabled>
                Select frequency
              </option>
              {traveloptions.frequencies.map((frequency) => (
                <option key={frequency.value} value={frequency.value}>
                  {frequency.label}
                </option>
              ))}
            </select>

            {/* Purpose */}
            <label htmlFor="purpose" className="block mt-4">
              Q.5 What is the main purpose of your daily trip?
            </label>
            <select
              id="purpose"
              className="border rounded w-full mt-2 p-2"
              value={formData.purpose}
              onChange={(e) => handleInputChange("purpose", e.target.value)}
            >
              <option value="" disabled>
                Select purpose
              </option>
              {traveloptions.tripPurposes.map((purpose) => (
                <option key={purpose.value} value={purpose.value}>
                  {purpose.label}
                </option>
              ))}
            </select>

            {/* Distance */}
            <label htmlFor="distance" className="block mt-4">
              Q.6 How long is your most typical trip?
            </label>
            <select
              id="distance"
              className="border rounded w-full mt-2 p-2"
              value={formData.distance}
              onChange={(e) => handleInputChange("distance", e.target.value)}
            >
              <option value="" disabled>
                Select distance
              </option>
              {traveloptions.tripDistances.map((distance) => (
                <option key={distance.value} value={distance.value}>
                  {distance.label}
                </option>
              ))}
            </select>

            {/* Save Button */}
            <div className="text-center mt-6">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                onClick={handleSave}
              >
                Save Data
              </button>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default TravelDetails;
