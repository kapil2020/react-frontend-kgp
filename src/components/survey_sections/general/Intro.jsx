import React from "react";

const SurveyIntro = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 sm:px-8 bg-gray-50">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-blue-900">
            Impact of Air Pollution Exposure on Travel Behavior
          </h1>
          <p className="mt-4 sm:mt-6 text-center text-gray-700 text-sm sm:text-lg leading-relaxed">
            <span className="font-semibold">Did You Know?</span>
            <br />
            Exposure to air pollution is highest during travel—whether stuck in
            traffic 🚗 or waiting at bus stops 🚌. Your daily commute can expose
            you to harmful pollutants at levels far greater than most indoor
            activities! 🌍💡
          </p>
          <p className="mt-4 sm:mt-6 text-center text-blue-600 font-medium text-sm sm:text-base">
            Choose smarter routes, safer modes, and protect your health. 🫁✨
            Travel smart. Breathe healthy. 🌬️
          </p>
        </div>

        <hr className="border-t border-gray-200 my-6 sm:my-8" />

        <div className="p-6 sm:p-8 text-gray-800">
          <h2 className="text-lg sm:text-xl font-semibold text-center">
            📝 About the Survey
          </h2>
          <p className="mt-4 text-center text-sm sm:text-base leading-relaxed">
            How does air quality influence your travel choices? This survey
            explores how real-time air quality information 🌫️ impacts your
            decisions on routes and transportation modes. Our goal is to assist
            private vehicle users 🚘 in transitioning to healthier, greener
            alternatives like public transit 🚌 🚈.
          </p>
          <p className="mt-4 text-center text-green-600 font-medium text-sm sm:text-base">
            💡 Your responses will contribute to a smarter, more sustainable
            future—making cities healthier 🌱 and commutes safer for everyone!
            🌍
          </p>
        </div>

        <hr className="border-t border-gray-200 my-6 sm:my-8" />

        <div className="p-6 sm:p-8 text-gray-700">
          <h3 className="text-lg font-semibold text-center">📧 Contact Us</h3>
          <div className="flex flex-col sm:flex-row justify-between mt-4">
            <div className="text-center sm:text-left mb-4 sm:mb-0 sm:pr-4">
              <p className="font-semibold">Kapil Meena</p>
              <p className="text-sm sm:text-base">Doctoral researcher, IIT Kharagpur</p>
              <a
                href="mailto:kapil.meena@kgpin.iitkgp.ac.in"
                className="text-blue-500 hover:underline"
              >
                kapil.meena@kgpin.iitkgp.ac.in
              </a>
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold">Prof. Arkopal Goswami</p>
              <p className="text-sm sm:text-base">
                Associate Professor,
                <br />
                RCGSIDM, IIT Kharagpur
              </p>
              <a
                href="mailto:akgoswami@infra.iitkgp.ac.in"
                className="text-blue-500 hover:underline"
              >
                akgoswami@infra.iitkgp.ac.in
              </a>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 text-center">
          <p className="text-sm sm:text-base text-blue-800 font-medium">
            ✨ Join us in shaping the future of urban mobility. Your voice
            matters! 😊
          </p>
          <button
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            onClick={() => (window.location.href = "/survey")}
          >
            Start Survey
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyIntro;
