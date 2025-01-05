import React, { useState } from "react";

const Section3 = ({
  thisFormData,
  setThisFormData,
  activeSection,
  setActiveSection,
}) => {
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});

  const handleResponseChange = (name, value) => {
    setResponses((prev) => ({ ...prev, [name]: value }));
    console.log(responses);
  };

  const [isDone, setIsDone] = useState(false);

  const validateResponses = () => {
    const newErrors = {};
    let totalQuestions = 0;
    let answeredQuestions = 0;

    // Count total questions from all sections
    const sections = [
      "General Air Pollution Awareness",
      "Attitudes Toward Public Transport (Bus, Metro)",
      "Attitudes Toward Private Vehicles (Car, Two-Wheeler)",
      "Attitudes Toward Route Preference (Existing Route vs. Greener Route)",
      "Attitudes Toward Technology and Real-Time Information",
    ];

    // Calculate total questions from all sections
    totalQuestions = Object.keys(responses).length;

    // Count answered questions
    answeredQuestions = Object.values(responses).filter(
      (value) => value !== undefined && value !== ""
    ).length;

    if (answeredQuestions < 16) {
      // Total number of questions in the form
      setErrors({ general: "Please answer all questions before saving." });
      return false;
    }

    setErrors({});
    return true;
  };

  const saveData = () => {
    if (validateResponses()) {
      setThisFormData(responses);
      setActiveSection(0);
      alert("Data saved successfully!");
      setIsDone(true);
      console.log(responses);
    }
  };

  return (
    <section
      id="perception-attitude"
      className="max-w-7xl mx-auto my-8 rounded-lg"
    >
      <h3
        className="flex text-xl font-bold mb-4 rounded-md bg-blue-100 p-4 shadow-md justify-between cursor-pointer"
        onClick={() => {
          if (activeSection === 3) setActiveSection(0);
          else setActiveSection(3);
        }}
      >
        <div>
          Section 3: Perception/Attitude <span className="text-red-600">*</span>
        </div>
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
              activeSection === 3 ? "rotate-180" : ""
            }`}
          >
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
      </h3>

      {activeSection === 3 && (
        <div className="bg-blue-50 rounded-lg shadow-md p-6">
          {errors.general && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {errors.general}
            </p>
          )}
          <p className="text-gray-700 mb-6">
            <span className="text-2xl mr-2">📊</span>
            Rate your level of agreement with the following statements:{" "}
            <strong className="text-green-600">
              1 = Strongly Disagree
            </strong>,{" "}
            <strong className="text-red-600">5 = Strongly Agree</strong>.
          </p>

          {/* Section Questions */}
          {[
            {
              title: "General Air Pollution Awareness",
              questions: [
                {
                  question:
                    "I have complete information about the air pollution levels",
                  name: "info_about_air_pollution",
                },
                {
                  question:
                    "I regularly use apps and portals to check air pollution information",
                  name: "check_air_pollution_apps",
                },
                {
                  question:
                    "Air quality information influences how I plan my daily trips, including the mode, route, time of travel, and departure",
                  name: "air_quality_influences_trip",
                },
                {
                  question:
                    "I believe that being exposed to air pollution can affect my health",
                  name: "air_pollution_impact_health",
                },
              ],
            },
            // Additional sections...
          ].map(({ title, questions }, sectionIndex) => (
            <div key={sectionIndex} className="mb-8">
              <h4 className="text-lg font-semibold mb-4 bg-white p-2 rounded-lg mb-4 border-violet-500 border-l-4">
                {title}
              </h4>
              {questions.map(({ question, name }, index) => (
                <div key={index} className="mb-6">
                  <label className="block text-gray-800 mb-2">
                    {index + 1}. {question}
                  </label>
                  <div className="flex space-x-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <label key={i} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={name}
                          value={i + 1}
                          className="accent-blue-500 cursor-pointer scale-125 hover:border-blue-600"
                          onChange={(e) =>
                            handleResponseChange(name, e.target.value)
                          }
                        />
                        <span>{i + 1}</span>
                      </label>
                    ))}
                  </div>
                  {errors[name] && (
                    <p className="text-red-500 text-sm mt-2">{errors[name]}</p>
                  )}
                </div>
              ))}
            </div>
          ))}

          <div className="text-center mt-6">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md"
              onClick={saveData}
            >
              Save Data
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Section3;
