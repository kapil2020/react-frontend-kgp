import React, { useState } from "react";

const AirQualityAwareness = ({
  thisFormData,
  setThisFormData,
  activeSection,
  setActiveSection,
}) => {
  const [formData, setFormData] = useState({
    healthEffectsAwareness: "",
    healthIssues: "",
    aqiExposure: "",
    aqiAwareness: "",
    aqiInfoSource: "",
    aqiFrequency: "",
    aqiActions: "",
    symptoms: [],
    otherSymptoms: "",
  });

  const [isDone, setIsDone] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCheckboxChange = (value) => {
    setFormData((prevData) => {
      const symptoms = prevData.symptoms.includes(value)
        ? prevData.symptoms.filter((symptom) => symptom !== value)
        : [...prevData.symptoms, value];
      return { ...prevData, symptoms };
    });
  };

  const handleSave = () => {
    setActiveSection(0);
    setThisFormData(formData);
    setIsDone(true);
    console.log("Air Quality Awareness Data:", formData);
    alert("Data saved successfully!");
  };

  return (
    <div className="mx-auto max-w-7xl my-6">
      {/* Section Header */}
      <div
        className="flex justify-between items-center bg-blue-100 p-4 rounded-lg shadow-md cursor-pointer"
        onClick={() => {
          if (activeSection === 2) setActiveSection(0);
          else setActiveSection(2);
        }}
      >
        <h3 className="text-lg font-bold">Section 2: Air Quality Awareness</h3>
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
              activeSection === 2 ? "rotate-180" : ""
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

      {/* Collapsible Content */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          activeSection === 2 ? "" : "max-h-0"
        }`}
      >
        <section
          id="air-quality-awareness"
          className="bg-blue-50 mt-4 p-4 rounded-lg shadow-md"
        >
          {/* Dropdown Questions */}
          <label htmlFor="health_effects_awareness" className="block mt-4">
            Q.11 Do you know air pollution can cause adverse health effects?
          </label>
          <select
            id="health_effects_awareness"
            className="border rounded w-full mt-2 p-2"
            value={formData.healthEffectsAwareness}
            onChange={(e) =>
              handleInputChange("healthEffectsAwareness", e.target.value)
            }
          >
            <option value="" disabled>
              Select your response
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="dont_know">I don’t know</option>
          </select>

          <label htmlFor="health_issues" className="block mt-4">
            Q.12 Do you have any pre-existing health issues (like asthma,
            bronchitis, lung issues, etc.) which may be worsened due to exposure
            to bad air quality?
          </label>
          <select
            id="health_issues"
            className="border rounded w-full mt-2 p-2"
            value={formData.healthIssues}
            onChange={(e) => handleInputChange("healthIssues", e.target.value)}
          >
            <option value="" disabled>
              Select your response
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="dont_know">I don’t know</option>
          </select>

          {/* Image Section */}
          <div className="text-center mt-6 bg-white border rounded-lg p-4 shadow-sm">
            <img
              src="https://raw.githubusercontent.com/kapil2020/survey-frontend/main/aqi_info.png"
              alt="Air Quality Index Chart"
              className="max-w-full h-auto rounded"
            />
            <p className="mt-2 text-sm text-gray-600">
              Figure: Air Quality Index (AQI) Levels and Categories
            </p>
          </div>

          <label htmlFor="aqi_exposure" className="block mt-4">
            Q.13 Which of the above scenarios describes your typical exposure to
            air quality during your weekday commute in this winter season?
          </label>
          <select
            id="aqi_exposure"
            className="border rounded w-full mt-2 p-2"
            value={formData.aqiExposure}
            onChange={(e) => handleInputChange("aqiExposure", e.target.value)}
          >
            <option value="" disabled>
              Select AQI exposure level
            </option>
            <option value="good">Good</option>
            <option value="satisfactory">Satisfactory</option>
            <option value="moderate">Moderate</option>
            <option value="poor">Poor</option>
            <option value="very_poor">Very Poor</option>
            <option value="severe">Severe</option>
          </select>

          <label htmlFor="aqi_awareness" className="block mt-4">
            Q.14 Are you aware of the Air Quality Index (AQI) levels as shown in
            the figure above and/or understand its implications on health?
          </label>
          <select
            id="aqi_awareness"
            className="border rounded w-full mt-2 p-2"
            value={formData.aqiAwareness}
            onChange={(e) => handleInputChange("aqiAwareness", e.target.value)}
          >
            <option value="" disabled>
              Select awareness level
            </option>
            <option value="aware_understand">Aware and understand it</option>
            <option value="aware_no_understand">
              Aware but do not understand it
            </option>
            <option value="not_aware">Not aware</option>
          </select>

          <label htmlFor="aqi_info_source" className="block mt-4">
            Q.15 Which information source do you use for checking the Air
            Quality Index (AQI)/ AQI level?
          </label>
          <select
            id="aqi_info_source"
            className="border rounded w-full mt-2 p-2"
            value={formData.aqiInfoSource}
            onChange={(e) => handleInputChange("aqiInfoSource", e.target.value)}
          >
            <option value="" disabled>
              Select information source
            </option>
            <option value="website_app">Website or Mobile Applications</option>
            <option value="newspaper">Newspaper</option>
            <option value="public_monitors">Public Monitors</option>
            <option value="television">Television</option>
            <option value="not_check">Not check at all</option>
          </select>

          <label htmlFor="aqi_frequency" className="block mt-4">
            Q.16 How frequently do you look at the Air Quality Index/level?
          </label>
          <select
            id="aqi_frequency"
            className="border rounded w-full mt-2 p-2"
            value={formData.aqiFrequency}
            onChange={(e) => handleInputChange("aqiFrequency", e.target.value)}
          >
            <option value="" disabled>
              Select frequency
            </option>
            <option value="daily">Daily</option>
            <option value="weekly">Once in a week</option>
            <option value="monthly">Once in a month</option>
            <option value="special_advisory">On some special advisory</option>
            <option value="never">Never</option>
          </select>

          <label htmlFor="aqi_actions" className="block mt-4">
            Q.17 What steps/actions do you take if air quality is affecting
            during your commute?
          </label>
          <select
            id="aqi_actions"
            className="border rounded w-full mt-2 p-2"
            value={formData.aqiActions}
            onChange={(e) => handleInputChange("aqiActions", e.target.value)}
          >
            <option value="" disabled>
              Select action
            </option>
            <option value="change_route">Change the route</option>
            <option value="change_mode">Change the mode</option>
            <option value="change_time">Change the departure time</option>
            <option value="avoid_travel">Avoid the travel</option>
            <option value="no_action">No action</option>
          </select>

          <label className="block mt-4">
            Q.18 After or during travel, do you feel any of these? (Select all
            that apply)
          </label>
          <div className="mt-2 space-y-2">
            {[
              { value: "sneezing", label: "Sneezing" },
              { value: "runny_nose", label: "Runny nose" },
              { value: "eye_irritation", label: "Eye irritation" },
              { value: "skin_problem", label: "Skin problem" },
              { value: "none", label: "None" },
            ].map((symptom) => (
              <label key={symptom.value} className="block">
                <input
                  type="checkbox"
                  value={symptom.value}
                  checked={formData.symptoms.includes(symptom.value)}
                  onChange={() => handleCheckboxChange(symptom.value)}
                  className="mr-2"
                />
                {symptom.label}
              </label>
            ))}
            <label className="block">
              Other:
              <input
                type="text"
                id="other_symptoms"
                placeholder="Specify"
                className="border rounded ml-2 p-1"
                value={formData.otherSymptoms}
                onChange={(e) =>
                  handleInputChange("otherSymptoms", e.target.value)
                }
              />
            </label>
          </div>

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
      </div>
    </div>
  );
};

export default AirQualityAwareness;
