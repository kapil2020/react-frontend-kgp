import React, { useState } from "react";
import { useTransport } from "../../transportContext/TransportContext";
import car_choiceData1 from "./carData/set1.json";
import car_choiceData2 from "./carData/set2.json";
import car_choiceData3 from "./carData/set3.json";
import car_choiceData4 from "./carData/set4.json";
import car_choiceData5 from "./carData/set5.json";
import car_choiceData6 from "./carData/set6.json";
import car_choiceData7 from "./carData/set7.json";
import car_choiceData8 from "./carData/set8.json";

import pt_choiceData1 from "./PublicTransportData/set1.json";
import pt_choiceData2 from "./PublicTransportData/set2.json";
import pt_choiceData3 from "./PublicTransportData/set3.json";
import pt_choiceData4 from "./PublicTransportData/set4.json";
import pt_choiceData5 from "./PublicTransportData/set5.json";
import pt_choiceData6 from "./PublicTransportData/set6.json";
import pt_choiceData7 from "./PublicTransportData/set7.json";
import pt_choiceData8 from "./PublicTransportData/set8.json";

import tw_choiceData1 from "./twoWheelerData/set1.json";
import tw_choiceData2 from "./twoWheelerData/set2.json";
import tw_choiceData3 from "./twoWheelerData/set3.json";
import tw_choiceData4 from "./twoWheelerData/set4.json";
import tw_choiceData5 from "./twoWheelerData/set5.json";
import tw_choiceData6 from "./twoWheelerData/set6.json";
import tw_choiceData7 from "./twoWheelerData/set7.json";
import tw_choiceData8 from "./twoWheelerData/set8.json";

import AQIImageDisplay from "../../../../handlers/imagegenerator";
import TravelPurposeDisplay from "../../../../handlers/icons_for_travel";
import TravelTimeDisplay from "../../../../handlers/traveltime";
import CleanlinessDisplay from "../../../../handlers/icons_for_cleanliness";
import TravelCostDisplay from "../../../../handlers/icons_for_cost";
import WaitingTimeDisplay from "../../../../handlers/waiting_time_slider";
import ChoiceInput from "../../../../handlers/travel_emoji";

// Randomly select a set of options for the survey. This is done so that each
// user is presented with a different set of options, which can help reduce
// bias in the survey results. The set of options is selected randomly from
// the 8 available sets of options. This is done using the Math.random()
// function, which generates a random number between 0 and 1. The
// Math.floor() function is used to round this number down to the nearest
// whole number, and then multiplied by 8 to generate a number between 0 and
// 7. This number is used as the index into the array of options, selecting
// one of the 8 available sets of options.
const index_no = Math.floor(Math.random() * 8); // 0 to 7

const Section4 = ({
  thisFormData,
  setThisFormData,
  activeSection,
  setActiveSection,
}) => {
  const { selectedTransport, setSelectedTransport } = useTransport();

  const [selectedChoices, setSelectedChoices] = useState({
    set: index_no + 1,
  });
  const [errors, setErrors] = useState({});

  let pt_optionsDataAvailable = [
    pt_choiceData1,
    pt_choiceData2,
    pt_choiceData3,
    pt_choiceData4,
    pt_choiceData5,
    pt_choiceData6,
    pt_choiceData7,
    pt_choiceData8,
  ];

  let car_optionsDataAvailable = [
    car_choiceData1,
    car_choiceData2,
    car_choiceData3,
    car_choiceData4,
    car_choiceData5,
    car_choiceData6,
    car_choiceData7,
    car_choiceData8,
  ];

  let tw_optionsDataAvailable = [
    tw_choiceData1,
    tw_choiceData2,
    tw_choiceData3,
    tw_choiceData4,
    tw_choiceData5,
    tw_choiceData6,
    tw_choiceData7,
    tw_choiceData8,
  ];
  const [isDone, setIsDone] = useState(false);

  let choiceData = car_optionsDataAvailable[index_no];

  if (
    selectedTransport === "bus" ||
    selectedTransport === "metro" ||
    selectedTransport === "auto_rickshaw"
  ) {
    choiceData = pt_optionsDataAvailable[index_no];
    console.log("Index is ", index_no, " and choice is ", choiceData);
  } else if (selectedTransport === "two_wheeler") {
    choiceData = tw_optionsDataAvailable[index_no];
    console.log("Index is ", index_no, " and choice is ", choiceData);
  }

  const handleSelection = (choiceId, option) => {
    const selectedOption = choiceData.choices.find(
      (choice) => choice.choiceId === choiceId
    ).options[option];

    setSelectedChoices((prev) => ({
      ...prev,
      [choiceId]: {
        option,
        details: selectedOption,
      },
    }));
    console.log(selectedChoices);
  };

  const validateChoices = () => {
    const requiredChoices = choiceData.choices.map((choice) => choice.choiceId);
    const newErrors = {};
    let isValid = true;

    requiredChoices.forEach((choiceId) => {
      if (!selectedChoices[choiceId]) {
        newErrors[choiceId] = "Please select an option";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateChoices()) {
      setThisFormData(selectedChoices);
      setActiveSection(0);
      console.log("Stated Preference Survey Data:", selectedChoices);
      setIsDone(true);
      alert("Data saved successfully!");
    } else {
      alert("Please make all required selections before saving");
    }
  };

  return (
    <div className="mx-auto max-w-7xl my-6">
      {/* Section Header */}
      <div
        className="flex justify-between items-center bg-blue-100 p-4 rounded-lg shadow-md cursor-pointer"
        onClick={() => {
          if (activeSection === 4) setActiveSection(0);
          else setActiveSection(4);
        }}
      >
        <h3 className="text-lg font-bold">
          Section 4: Stated Preference Survey(Mode Choice){" "}
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
          activeSection === 4 ? "" : "max-h-0"
        }`}
      >
        <section className="bg-blue-50 mt-4 p-4 rounded-lg shadow-md">
          {choiceData.choices.map((choice) => (
            <div
              key={choice.choiceId}
              className="bg-blue-100 rounded-lg shadow-md p-4 mb-8"
            >
              <h3 className="text-lg font-bold mb-4">
                Choice {choice.choiceId}: Select Your Preferred Travel Option{" "}
                <span className="text-red-600">*</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-blue-200 text-left">
                      <th className="border border-gray-300 px-4 py-2">
                        Attributes
                      </th>
                      {Object.keys(choice.options).map((option) => (
                        <th
                          key={option}
                          className="border border-gray-300 px-4 py-2 text-center"
                        >
                          {/* Rendering the options with image */}
                          {option}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "AQI",
                      "TravelTime",
                      "TravelCost",
                      "WaitingTime",
                      "Cleanliness",
                      "TripPurpose",
                    ].map((attribute) => (
                      <tr key={attribute}>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">
                          {attribute.replace(/([A-Z])/g, " $1").trim()}
                        </td>
                        {Object.values(choice.options).map((details, index) => {
                          const value = details[attribute];
                          const tdClassNames = `border border-gray-300 px-4 py-2 text-center`;

                          // Image Rendering
                          if (attribute === "AQI") {
                            return (
                              <td key={index} className={tdClassNames}>
                                <AQIImageDisplay aqiData={value} />
                                {value}
                              </td>
                            );
                          } else if (attribute === "TripPurpose") {
                            return (
                              <td key={index} className={tdClassNames}>
                                {/* // Image for TravelPurpose */}
                                <TravelPurposeDisplay travelPurpose={value} />
                                {value}
                              </td>
                            );
                          } else if (attribute === "TravelTime") {
                            return (
                              <td key={index} className={tdClassNames}>
                                {/* // Image for TravelPurpose */}
                                <TravelTimeDisplay Travel_time={value} />
                                {value}
                              </td>
                            );
                          } else if (attribute === "Cleanliness") {
                            return (
                              <td key={index} className={tdClassNames}>
                                {/* // Image for TravelPurpose */}
                                <CleanlinessDisplay cleanlinessLevel={value} />
                                {value}
                              </td>
                            );
                          } else if (attribute === "WaitingTime") {
                            return (
                              <td key={index} className={tdClassNames}>
                                {/* // Image for TravelPurpose */}
                                <WaitingTimeDisplay waitingLevel={value} />
                                {value}
                              </td>
                            );
                          } else if (attribute === "TravelCost") {
                            return (
                              <td key={index} className={tdClassNames}>
                                {/* // Image for TravelPurpose */}
                                <TravelCostDisplay costLevel={value} />
                                {value}
                              </td>
                            );
                          } else {
                            return (
                              <td key={index} className={tdClassNames}>
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
                      {Object.keys(choice.options).map((option) => (
                        <td
                          key={option}
                          className="border border-gray-300 px-4 py-2 text-center"
                        >
                          <label className="flex items-center justify-center gap-2">
                            <input
                              type="radio"
                              name={`choice-${choice.choiceId}`}
                              value={option}
                              checked={
                                selectedChoices[choice.choiceId]?.option ===
                                option
                              }
                              onChange={() =>
                                handleSelection(choice.choiceId, option)
                              }
                              className="form-radio h-4 w-4 text-blue-600"
                            />
                            {/* Add the icon next to the radio button */}
                            <span className="text-2xl">
                              <ChoiceInput emoji_required_for={option} />
                            </span>
                          </label>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              {errors[choice.choiceId] && (
                <p className="text-red-500 mt-2 text-sm">
                  {errors[choice.choiceId]}
                </p>
              )}
            </div>
          ))}
          <div className="text-center mt-6">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => handleSave()}
            >
              Save Data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Section4;
