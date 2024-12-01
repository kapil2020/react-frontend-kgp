import React, { useState } from "react";
import choiceData1 from "./set1.json";
import choiceData2 from "./set2.json";
import choiceData3 from "./set3.json";
import choiceData4 from "./set4.json";
import choiceData5 from "./set5.json";
import choiceData6 from "./set6.json";
import choiceData7 from "./set7.json";
import choiceData8 from "./set8.json";

const index_no = Math.floor(Math.random() * 8);

const Section4 = ({
  thisFormData,
  setThisFormData,
  activeSection,
  setActiveSection,
}) => {
  const [selectedChoices, setSelectedChoices] = useState({
    set: index_no + 1,
  });

  let optionsDataAvailable = [
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
  const choiceData = optionsDataAvailable[index_no];

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

  const handleSave = () => {
    setThisFormData(selectedChoices);
    setActiveSection(0);
    console.log("Stated Preference Survey Data:", selectedChoices);
    setIsDone(true);
    alert("Data saved successfully!");
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
          Section 4: Stated Preference Survey:
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
                Choice {choice.choiceId}: Select Your Preferred Travel Option
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
                        {Object.values(choice.options).map((details, index) => (
                          <td
                            key={index}
                            className="border border-gray-300 px-4 py-2 text-center"
                          >
                            {details[attribute]}
                          </td>
                        ))}
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
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
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
