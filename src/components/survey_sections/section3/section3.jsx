import React, { useState } from "react";

const Section3 = ({
  thisFormData,
  setThisFormData,
  activeSection,
  setActiveSection,
}) => {
  const [responses, setResponses] = useState({});

  const handleResponseChange = (name, value) => {
    setResponses((prev) => ({ ...prev, [name]: value }));
    console.log(responses);
  };

  const [isDone, setIsDone] = useState(false);
  const saveData = () => {
    setThisFormData(responses);
    setActiveSection(0);
    alert("Data saved successfully!");
    setIsDone(true);
    console.log(responses);
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
        Section 3: Perception/Attitude
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
                    "I have complete information about the air pollution levels.",
                  name: "info_about_air_pollution",
                },
                {
                  question:
                    "I check the air pollution information portals/apps daily.",
                  name: "check_air_pollution_apps",
                },
                {
                  question:
                    "Information about air quality influences my daily trip planning (mode, route, or time of travel).",
                  name: "air_quality_influences_trip",
                },
                {
                  question:
                    "I believe exposure to air pollution can impact my health.",
                  name: "air_pollution_impact_health",
                },
              ],
            },
            {
              title: "Attitudes Toward Public Transport (Bus, Metro)",
              questions: [
                {
                  question:
                    "I use public transport modes as they have lower exposure to air pollution.",
                  name: "public_transport_lower_pollution",
                },
                {
                  question:
                    "I prefer public transport because it helps reduce air pollution in the city.",
                  name: "prefer_public_transport_reduce_pollution",
                },
                {
                  question:
                    "I believe public transport offers a cleaner environment in terms of exposure to pollutants when compared to active transport or using a private vehicle.",
                  name: "public_transport_cleaner_environment",
                },
              ],
            },
            {
              title: "Attitudes Toward Private Vehicles (Car, Two-Wheeler)",
              questions: [
                {
                  question:
                    "I am willing to reduce the use of my private vehicle if it contributes to lower air pollution in the city.",
                  name: "reduce_private_vehicle_use",
                },
                {
                  question:
                    "I’m exposed to air pollution while using my current travel mode.",
                  name: "pollution_exposure_current_mode",
                },
                {
                  question:
                    "I would switch from a private vehicle to public transport if I knew it would reduce my exposure to air pollution.",
                  name: "switch_to_public_transport",
                },
              ],
            },
            {
              title:
                "Attitudes Toward Route Preference (Existing Route vs. Greener Route)",
              questions: [
                {
                  question:
                    "I will take a route if it reduces my exposure to air pollution.",
                  name: "take_route_reduce_pollution",
                },
                {
                  question:
                    "I think avoiding high traffic volume roads can reduce my exposure to air pollution even if it takes less time.",
                  name: "avoid_high_traffic_pollution",
                },
                {
                  question:
                    "I would take a greener route with better air quality even if it takes more time.",
                  name: "take_greener_route",
                },
              ],
            },
            {
              title: "Attitudes Toward Technology and Real-Time Information",
              questions: [
                {
                  question:
                    "If real-time air quality information was available, it would influence my choice of route or mode of transport.",
                  name: "real_time_info_influence_choice",
                },
                {
                  question:
                    "I would be more likely to switch to public transport or greener routes if I had access to real-time air quality data.",
                  name: "switch_to_public_transport_greener",
                },
                {
                  question:
                    "Technology-based tools, such as mobile apps, help me make better decisions about avoiding polluted areas during my commute.",
                  name: "tech_tools_avoid_pollution",
                },
                {
                  question:
                    "I ride EVs as they reduce pollution and have less impact on the environment.",
                  name: "ride_ev_reduce_pollution",
                },
              ],
            },
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
                      <label key={i} className="flex items-center space-x-1">
                        <input
                          type="radio"
                          name={name}
                          value={i + 1}
                          className="accent-blue-500 cursor-pointer"
                          onChange={(e) =>
                            handleResponseChange(name, e.target.value)
                          }
                        />
                        <span>{i + 1}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Socio-Demographic Survey */}
          <div id="socio-demographic" className="mt-8">
            <h4 className="text-lg font-bold bg-white p-2 rounded-lg mb-4 border-violet-500 border-l-4">
              Socio-Demographic Survey
            </h4>

            {/* Gender */}
            <div className="mb-6">
              <label htmlFor="gender" className="block text-gray-800 mb-2">
                Please specify your gender:
              </label>
              <select
                id="gender"
                name="gender"
                className="border rounded w-full p-2"
                onChange={(e) =>
                  handleResponseChange(e.target.name, e.target.value)
                }
              >
                <option value="" disabled selected>
                  Select your gender
                </option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            {/* Age */}
            <div className="mb-6">
              <label htmlFor="age" className="block text-gray-800 mb-2">
                Please specify your age:
              </label>
              <select
                id="age"
                name="age"
                className="border rounded w-full p-2"
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
            </div>

            {/* Occupation */}
            <div className="mb-6">
              <label htmlFor="occupation" className="block text-gray-800 mb-2">
                What is your occupation?
              </label>
              <select
                id="occupation"
                name="occupation"
                className="border rounded w-full p-2"
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
            </div>

            {/* Vehicles */}
            <div className="mb-6">
              <h5 className="text-gray-800 mb-2">
                Number of Vehicles in Household:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Cars", id: "car_count" },
                  { label: "Two-Wheelers", id: "two_wheeler_count" },
                  { label: "Bicycles", id: "bicycle_count" },
                ].map(({ label, id }) => (
                  <div key={id} className="flex flex-col items-start">
                    <label htmlFor={id} className="text-gray-800 mb-2">
                      {label}
                    </label>
                    <input
                      type="number"
                      id={id}
                      name={id}
                      min="0"
                      placeholder="0"
                      className="border rounded p-2 w-full"
                      onChange={(e) =>
                        handleResponseChange(e.target.name, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Driving License */}
            <div className="mb-6">
              <label className="block text-gray-800 mb-2">
                Do you have a driving license?
              </label>
              <div className="flex space-x-4">
                {[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ].map(({ label, value }) => (
                  <label
                    key={value}
                    className="flex items-center space-x-2 cursor-pointer"
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
              <div className="flex justify-center">
                <button
                  onClick={() => saveData()}
                  className="mt-4 rounded-md bg-blue-500 py-2 px-4 text-white flex items-center justify-center"
                >
                  Save Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Section3;
