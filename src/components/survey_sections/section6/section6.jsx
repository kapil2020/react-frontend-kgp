import React, { useState } from "react";

const Section6 = ({
  thisFormData,
  setThisFormData,
  activeSection,
  setActiveSection,
}) => {
  const [responses, setResponses] = useState({
    car_count: 0,
    two_wheeler_count: 0,
    bicycle_count: 0,
  });
  const [errors, setErrors] = useState({});
  const [isDone, setIsDone] = useState(false);

  const handleResponseChange = (name, value) => {
    setResponses((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user makes a selection
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateResponses = () => {
    const requiredFields = [
      "gender",
      "age",
      "occupation",
      "education",
      "income",
      "household_size",
      // "car_count",
      // "two_wheeler_count",
      // "bicycle_count",
    ];

    const newErrors = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!responses[field]) {
        newErrors[field] = "This field is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const saveData = () => {
    if (validateResponses()) {
      setThisFormData(responses);
      setActiveSection(0);
      alert("Data saved successfully!");
      setIsDone(true);
      console.log("Section 6 Data: ", responses);
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <section
      id="socio-demographic"
      className="max-w-7xl mx-auto my-8 bg-blue-100 px-4 rounded-lg shadow-md pt-4 pb-1"
    >
      <h3
        className="text-xl font-bold mb-6 flex justify-between cursor-pointer"
        onClick={() => {
          if (activeSection === 6) setActiveSection(0);
          else setActiveSection(6);
        }}
      >
        <div>
          Section 6: Socio-Demographic Survey{" "}
          <span className="text-red-600">*</span>
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

      {activeSection === 6 && (
        <div>
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Please fill in all required fields
            </div>
          )}

          {/* Gender */}
          <div className="mb-6">
            <label htmlFor="gender" className="block mb-2">
              Please specify your gender:{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full border rounded p-2"
              onChange={(e) =>
                handleResponseChange(e.target.name, e.target.value)
              }
            >
              <option value="" disabled selected>
                Select your gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Age */}
          <div className="mb-6">
            <label htmlFor="age" className="block mb-2">
              Please specify your age:
            </label>
            <select
              id="age"
              name="age"
              className="w-full border rounded p-2"
              onChange={(e) =>
                handleResponseChange(e.target.name, e.target.value)
              }
            >
              <option value="" disabled selected>
                Select your age
              </option>
              <option value="15-19">15-19</option>
              <option value="20-29">20-29</option>
              <option value="30-44">30-44</option>
              <option value="44-59">44-59</option>
              <option value="60_above">More than 60</option>
            </select>
            {errors.age && (
              <p className="text-red-500 text-sm mt-1">{errors.age}</p>
            )}
          </div>

          {/* Occupation */}
          <div className="mb-6">
            <label htmlFor="occupation" className="block mb-2">
              What is your occupation?
            </label>
            <select
              id="occupation"
              name="occupation"
              className="w-full border rounded p-2"
              onChange={(e) =>
                handleResponseChange(e.target.name, e.target.value)
              }
            >
              <option value="" disabled selected>
                Select your occupation
              </option>
              <option value="student">Student</option>
              <option value="employee">Employee (Private or Govt)</option>
              <option value="self_employed">Self-employed</option>
              <option value="homemaker">Homemaker</option>
              <option value="unemployed">Unemployed</option>
              <option value="retired">Retired</option>
              <option value="other">Other</option>
            </select>
            {errors.occupation && (
              <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>
            )}
          </div>

          {/* Educational Level */}
          <div className="mb-6">
            <label htmlFor="education" className="block mb-2">
              Educational level:
            </label>
            <select
              id="education"
              name="education"
              className="w-full border rounded p-2"
              onChange={(e) =>
                handleResponseChange(e.target.name, e.target.value)
              }
            >
              <option value="" disabled selected>
                Select your education level
              </option>
  <option value="grade_10_or_below">Grade 10 or below</option>
  <option value="intermediate">Intermediate (Grade 12)</option>
  <option value="graduate">Graduate</option>
  <option value="postgraduate_above">Post Graduate and above</option>
            </select>
            {errors.education && (
              <p className="text-red-500 text-sm mt-1">{errors.education}</p>
            )}
          </div>

          {/* Monthly Household Income */}
          <div className="mb-6">
            <label htmlFor="income" className="block mb-2">
              Monthly indiviual income (in Rs):
            </label>
            <select
              id="income"
              name="income"
              className="w-full border rounded p-2"
              onChange={(e) =>
                handleResponseChange(e.target.name, e.target.value)
              }
            >
              <option value="" disabled selected>
                Select your income range
              </option>
              <option value="none">none</option>
              <option value="less_25k">Less than 25k</option>
              <option value="25_50k">25k - 50k</option>
              <option value="50_1lakh">50k - 1 lakh</option>
              <option value="1_1_5lakh">1 lakh - 1.5 lakh</option>
              <option value="above_1_5lakh">More than 1.5 lakh</option>
            </select>
            {errors.income && (
              <p className="text-red-500 text-sm mt-1">{errors.income}</p>
            )}
          </div>

          {/* Household Size */}
          <div className="mb-6">
            <label htmlFor="household_size" className="block mb-2">
              Household size:
            </label>
            <select
              id="household_size"
              name="household_size"
              className="w-full border rounded p-2"
              onChange={(e) =>
                handleResponseChange(e.target.name, e.target.value)
              }
            >
              <option value="" disabled selected>
                Select household size
              </option>
              <option value="1">1 person</option>
              <option value="2_3">2-3 people</option>
              <option value="4_5">4-5 people</option>
              <option value="more_6">6 or more people</option>
            </select>
            {errors.household_size && (
              <p className="text-red-500 text-sm mt-1">
                {errors.household_size}
              </p>
            )}
          </div>

          {/* Vehicles */}
          <div className="mb-6">
            <h5 className="text-gray-800 mb-2">
              Number of vehicles in household:
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Cars", id: "car_count" },
                { label: "Two-Wheelers", id: "two_wheeler_count" },
                { label: "Bicycles", id: "bicycle_count" },
              ].map(({ label, id }) => (
                <div key={id} className="flex flex-col">
                  <label htmlFor={id} className="mb-2">
                    {label}
                  </label>
                  <input
                    type="number"
                    id={id}
                    name={id}
                    min="0"
                    placeholder="0"
                    defaultValue={0}
                    className="border rounded p-2 w-full"
                    onChange={(e) =>
                      handleResponseChange(e.target.name, e.target.value)
                    }
                  />
                  {errors[id] && (
                    <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Driving License */}
          <div className="mb-6">
            <label className="block text-gray-800 mb-2">
              Do you have a driving license?
            </label>
            <div className="flex gap-4">
              {[
                { label: "Car", value: "car" },
                { label: "Two-wheeler", value: "Two_wheeler" },
                { label: "Both", value: "both" },
                { label: "None", value: "none" },
              ].map(({ label, value }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="driving_license"
                    value={value}
                    className="accent-blue-500"
                    onChange={(e) =>
                      handleResponseChange(e.target.name, e.target.value)
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block mt-4">
              Panel Data Information (optional):
            </label>
            <textarea
              onChange={(e) =>
                handleResponseChange(e.target.name, e.target.value)
              }
              name="panel_data"
              placeholder="Add your comments or additional information here..."
              className="border rounded w-full mt-2 p-2"
              rows="4"
            ></textarea>
          </div>

          <div>
            <label className="block mt-4">
              If you want a copy of your response, please provide your email and
              our team will get in touch with you (optional):
            </label>
            <textarea
              onChange={(e) =>
                handleResponseChange(e.target.name, e.target.value)
              }
              name="email"
              placeholder="johndoe@gmail.com"
              itemType="email"
              className="border rounded w-full mt-2 p-2"
              rows="1"
            ></textarea>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={saveData}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Save Data
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Section6;
