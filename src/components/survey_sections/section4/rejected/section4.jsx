import React, { useState } from "react";
import set1choices from "../set1.json";

const Section4 = () => {
  const [selectedChoices, setSelectedChoices] = useState({});

  const handleSelection = (choiceId, option) => {
    setSelectedChoices((prev) => ({ ...prev, [choiceId]: option }));
  };

  return (
    <div className="mx-auto w-full max-w-6xl my-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Section 4: Stated Preference Survey
      </h2>
      {set1choices.choices.map((choice) => (
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
                  <th className="border border-gray-300 px-4 py-2">Select</th>
                  <th className="border border-gray-300 px-4 py-2">Option</th>
                  <th className="border border-gray-300 px-4 py-2">AQI</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Travel Time
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Travel Cost
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Waiting Time
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Cleanliness
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Trip Purpose
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(choice.options).map(([option, details]) => (
                  <tr key={option}>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <input
                        type="radio"
                        name={`choice-${choice.choiceId}`}
                        value={option}
                        checked={selectedChoices[choice.choiceId] === option}
                        onChange={() =>
                          handleSelection(choice.choiceId, option)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">
                      {option}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {details.AQI}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {details.TravelTime}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {details.TravelCost}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {details.WaitingTime}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {details.Cleanliness}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {details.TripPurpose}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <div className="text-center mt-6">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          onClick={() => console.log(selectedChoices)}
        >
          Submit Preferences
        </button>
      </div>
    </div>
  );
};

export default Section4;
