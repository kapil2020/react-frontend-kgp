import React from "react";

const SurveyIntro = () => {
  return (
    <div className="flex flex-col items-center  py-6 sm:py-12 px-4 sm:px-6">
      <div className="lg:max-w-5xl sm:max-w-4xl bg-green-50 shadow-lg rounded-lg p-6 sm:p-8">
        <h1 className="mt-10 text-xl sm:text-2xl md:text-3xl font-bold text-center text-blue-800">
          IMPACT OF AIR POLLUTION EXPOSURE ON TRAVEL BEHAVIOUR
        </h1>
        <p className="mt-4 sm:mt-6 text-center text-gray-700 text-sm sm:text-lg leading-relaxed">
          <span className="font-bold">
            Did You Know?
            <br />
          </span>{" "}
          Our exposure to air pollution is highest during travel—more than any
          other daily activity! 🚗 🚌 From sitting in traffic jams ⏳ to waiting
          at bus stops 🕒, commuting exposes you to harmful pollutants at levels
          far greater than indoors or other activities. 🌍💡
        </p>
        <p className="mt-3 sm:mt-4 text-center text-blue-700 font-semibold text-sm sm:text-base">
          Choose smarter routes, safer modes, and reduce the impact on your
          health. 🫁✨ Travel smart. Breathe healthy. 🌬️
        </p>

        <hr className="my-6 sm:my-8 border-t border-blue-200" />

        <div className="text-gray-800">
          <h2 className="text-base sm:text-lg font-semibold text-center">
            📝 About the Survey:
          </h2>
          <p className="mt-3 sm:mt-4 text-center leading-relaxed text-sm sm:text-base">
            How does air quality influence your travel choices? This survey
            dives into how real-time air quality information 🌫️ affects your
            decisions on routes and modes of transportation. Our aim is to
            uncover ways to help private vehicle users 🚘 shift towards
            healthier, greener options like public transit 🚌 🚈.
          </p>
          <p className="mt-3 sm:mt-4 text-center text-green-600 font-medium text-sm sm:text-base">
            💡 Your responses will pave the way for a smarter, more sustainable
            future—making cities healthier 🌱 and commutes safer for everyone!
            🌍
          </p>
        </div>

        <hr className="my-6 sm:my-8 border-t border-blue-200" />

        <div className="text-gray-700 text-center">
          <h3 className="text-base sm:text-lg font-semibold">
            📧 For Queries or Assistance:
          </h3>
          <div className="flex justify-between">
            <p className="mt-2 text-sm w-1/2 sm:text-base">
              Mr. Kapil Meena:{" "}
              <a
                href="mailto:kapil.meena@kgpin.iitkgp.ac.in"
                className="text-blue-500 hover:underline"
              >
                <br />
                kapil.meena@kgpin.iitkgp.ac.in
              </a>{" "}
              <br />
              (Research Scholar, IIT Kharagpur)
            </p>
            <p className="mt-1 w-1/2 text-sm sm:text-base">
              Prof. Arkopal Goswami: <br />
              <a
                href="mailto:akgoswami@infra.iitkgp.ac.in"
                className="text-blue-500 hover:underline"
              >
                akgoswami@infra.iitkgp.ac.in
              </a>{" "}
              <br />
              Associate Professor <br /> Ranbir and Chitra Gupta School of
              Infrastructure Design and Management (RCGSIDM) <br /> Indian
              Institute of Technology Kharagpur
            </p>
          </div>
        </div>

        <p className="mt-6 sm:mt-8 text-center text-blue-800 font-semibold text-sm sm:text-base">
          ✨ Join us in shaping the future of urban mobility. Your voice
          matters! 😊
        </p>

        <br />
        <br />
        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              window.location.href = "/survey";
            }}
          >
            Start Survey
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyIntro;
