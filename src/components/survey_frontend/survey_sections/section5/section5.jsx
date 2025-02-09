import React, { useState } from "react";
import choiceData1 from "./set1.json";
import choiceData2 from "./set2.json";
import choiceData3 from "./set3.json";
import choiceData4 from "./set4.json";
import choiceData5 from "./set5.json";
import choiceData6 from "./set6.json";
import choiceData7 from "./set7.json";
import choiceData8 from "./set8.json";

import AQIImageDisplay from "../../../../handlers/imagegenerator";
import TravelPurposeDisplay from "../../../../handlers/icons_for_travel";
import TravelTimeDisplay from "../../../../handlers/traveltime";
import CleanlinessDisplay from "../../../../handlers/icons_for_cleanliness";
import TravelCostDisplay from "../../../../handlers/icons_for_cost";
import WaitingTimeDisplay from "../../../../handlers/waiting_time_slider";
import GreenCoverDisplay from "../../../../handlers/icon_greenCover";
import PreTripInfoDisplay from "../../../../handlers/icon_preTripInfo";
import DelayDisplay from "../../../../handlers/dealy_icon";

const index_no = Math.floor(Math.random() * 8);

const Section5 = ({
  thisSection5FormData,
  setThisSection5FormData,
  activeSection,
  setActiveSection,
}) => {
  const [selectedRoutes, setSelectedRoutes] = useState({
    set: index_no + 1,
  });
  const [errors, setErrors] = useState({});

  const optionsDataAvailable = [
    choiceData1,
    choiceData2,
    choiceData3,
    choiceData4,
    choiceData5,
    choiceData6,
    choiceData7,
    choiceData8,
  ];

  const [isDone, setIsDone] = useState(false);
  const section5Data = optionsDataAvailable[index_no];

  const validateSelections = () => {
    const newErrors = {};
    let isValid = true;

    // Check if all choices have been made
    section5Data?.forEach((_, index) => {
      if (!selectedRoutes[`choice-${index}`]) {
        newErrors[`choice-${index}`] = "Please select a route for this choice";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const saveData = () => {
    if (validateSelections()) {
      setThisSection5FormData(selectedRoutes);
      setActiveSection(6);
      alert("Data saved successfully!");
      setIsDone(true);
    } else {
      alert("Please make all required selections before saving");
    }
  };

  const handleRouteSelection = (choiceId, route) => {
    setSelectedRoutes((prev) => ({
      ...prev,
      [choiceId]: route,
    }));
  };

  return (
    <div className="mx-auto max-w-7xl my-6">
      {/* Section Header */}
      <div
        className="flex justify-between items-center bg-blue-100 p-4 rounded-lg shadow-md cursor-pointer"
        onClick={() => {
          if (activeSection === 5) setActiveSection(0);
          else setActiveSection(5);
        }}
      >
        <h3 className="text-lg font-bold">
          Section 5: Route Preference Survey(Route Choice){" "}
          <span className="text-red-600">*</span>
        </h3>
        <div>
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
          <span
            className={`transition-transform duration-300 ${
              activeSection === 4 ? "rotate-180" : ""
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

      <div
        className={`transition-all duration-500 overflow-hidden ${
          activeSection === 5 ? "" : "max-h-0"
        }`}
      >
        <section className="bg-blue-50 mt-4 p-4 rounded-lg shadow-md">
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Please make all required selections
            </div>
          )}
          {section5Data?.map((choiceSet, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-8">
              <h4 className="text-lg font-semibold mb-4">
                Choice {index + 1}: Select Your Preferred Route{" "}
                <span className="text-red-600">*</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-blue-200 text-left">
                      <th className="border border-gray-300 px-4 py-2">
                        Attributes
                      </th>
                      {Object.keys(choiceSet.routes).map((route) => (
                        <th
                          key={route}
                          className="border border-gray-300 px-4 py-2 text-center"
                        >
                          {route}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "PreTripInfoAvailable",
                      "AirQualityLevel",
                      "TravelTime",
                      "TravelCost",
                      "TripPurpose",
                      "Delay",
                      "GreenCover",
                    ].map((attribute) => (
                      <tr key={attribute}>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">
                          {attribute === "PreTripInfoAvailable"
                            ? "Pre-trip AQI available"
                            : attribute.replace(/([A-Z])/g, " $1").trim()}
                        </td>
                        {Object.values(choiceSet.routes).map((details, idx) => {
                          const value = details[attribute];
                          const tdClassNames =
                            " border border-gray-300 px-4 py-1 text-center";

                          if (attribute === "AirQualityLevel") {
                            return (
                              <td key={idx} className={tdClassNames}>
                                <div className="flex justify-center w-40">
                                  <AQIImageDisplay aqiData={value} />
                                </div>

                                {value}
                              </td>
                            );
                          } else if (attribute === "TravelTime") {
                            return (
                              <td key={idx} className={tdClassNames}>
                                <TravelTimeDisplay Travel_time={value} />
                                {value}
                              </td>
                            );
                          } else if (attribute === "TravelCost") {
                            return (
                              <td key={idx} className={tdClassNames}>
                                <TravelCostDisplay costLevel={value} />
                                {value}
                              </td>
                            );
                          } else if (attribute === "WaitingTime") {
                            return (
                              <td key={idx} className={tdClassNames}>
                                <WaitingTimeDisplay waitingLevel={value} />
                                {value}
                              </td>
                            );
                          } else if (attribute === "Cleanliness") {
                            return (
                              <td key={idx} className={tdClassNames}>
                                <CleanlinessDisplay cleanlinessLevel={value} />
                                {value}
                              </td>
                            );
                          } else if (attribute === "TripPurpose") {
                            return (
                              <td key={idx} className={tdClassNames}>
                                <TravelPurposeDisplay travelPurpose={value} />
                                {value}
                              </td>
                            );
                          } else if (attribute === "GreenCover") {
                            return (
                              <td key={idx} className={tdClassNames}>
                                <GreenCoverDisplay greenCoverLevel={value} />
                                {value}
                              </td>
                            );
                          } else if (attribute === "Delay") {
                            return (
                              <td key={idx} className={tdClassNames}>
                                <DelayDisplay delayLevel={value} />
                                {value}
                              </td>
                            );
                          } else if (attribute === "PreTripInfoAvailable") {
                            return (
                              <td key={idx} className={tdClassNames}>
                                <PreTripInfoDisplay infoLevel={value} />
                                {value}
                              </td>
                            );
                          } else {
                            return (
                              <td key={idx} className={tdClassNames}>
                                {value}
                              </td>
                            );
                          }
                        })}
                      </tr>
                    ))}
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">
                        Select
                      </td>
                      {Object.keys(choiceSet.routes).map((route) => (
                        <td
                          key={route}
                          className="border border-gray-300 px-4 py-2 text-center"
                        >
                          <input
                            type="radio"
                            name={`choice-${index}`}
                            value={route}
                            checked={
                              selectedRoutes[`choice-${index}`] === route
                            }
                            onChange={() =>
                              handleRouteSelection(`choice-${index}`, route)
                            }
                            className="accent-blue-500 cursor-pointer w-5 h-5"
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              {errors[`choice-${index}`] && (
                <p className="text-red-500 text-sm mt-2">
                  {errors[`choice-${index}`]}
                </p>
              )}
            </div>
          ))}
          <div className="text-center mt-6">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => saveData()}
            >
              Save Data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Section5;
