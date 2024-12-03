import React from "react";

const SurveyIntro = () => {
  return (
    <div className="relative flex flex-col items-center py-8 sm:py-16 px-6 sm:px-8 min-h-screen overflow-hidden">
      {/* Background Design */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-green-200 to-blue-300 opacity-70 animate-gradient-x"></div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-5 md:left-20 w-48 md:w-72 h-48 md:h-72 bg-blue-400 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-10 right-5 md:right-20 w-60 md:w-96 h-60 md:h-96 bg-green-400 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Main Content */}
      <div
        className="relative z-10 max-w-full md:max-w-4xl sm:max-w-2xl w-full bg-white shadow-md rounded-xl p-6 sm:p-10 
          transition transform hover:scale-105 hover:shadow-xl duration-300"
      >
        {/* Title Section */}
        <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-center text-gray-800 leading-tight">
          Impact of Air Pollution Exposure on Travel Behaviour
        </h1>

        {/* Key Information */}
        <div className="mt-6 sm:mt-8">
          <p className="text-center text-gray-600 text-sm sm:text-base leading-relaxed">
            <span className="font-semibold text-gray-900">
              Did You Know?
              <br />
            </span>
             Our exposure to air pollution is highest during travel—more than any other daily activity! 🚗 🚌 From sitting in traffic jams⏳to waiting at bus stops 🕒, commuting exposes you to harmful pollutants at levels
          far greater than indoors or other activities. 🌍💡
          </p>
        </div>

        {/* Divider */}
        <hr className="my-6 sm:my-8 border-gray-200" />

        {/* About Section */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-700">
            About the Survey 📝
          </h2>
          <p className="mt-4 text-center text-gray-600 text-sm sm:text-base leading-relaxed">
            This survey explores how air quality impacts your travel decisions.
            Discover how air pollution exposure influences your choice of
            routes and modes, encouraging a shift towards greener options like
            public transit 🚍 🚇.
          </p>
          <p className="mt-4 text-center text-green-600 font-medium text-sm sm:text-base">
            Your participation contributes to creating smarter, healthier urban
            mobility solutions for a sustainable future. 🌱
          </p>
        </div>

        {/* Call-to-Action */}
        <div className="mt-8">
          <p className="text-center text-gray-800 font-medium">
            Join us in shaping the future of urban mobility. Your voice matters! 🚀
          </p>
          <div className="mt-6 flex justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-300 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105 duration-300"
              onClick={() => {
                window.location.href = "/survey";
              }}
            >
              Start Survey
            </button>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 sm:my-8 border-gray-200" />

        {/* Contact Section */}
        <div className="text-center text-gray-700">
          <h3 className="text-lg font-semibold">📧 For Queries or Assistance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <p className="font-medium">Mr. Kapil Meena</p>
              <a
                href="mailto:kapil.meena@kgpin.iitkgp.ac.in"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                kapil.meena@kgpin.iitkgp.ac.in
              </a>
              <p className="text-sm text-gray-600">(Doctoral Scholar, IIT Kharagpur)</p>
            </div>
            <div>
              <p className="font-medium">Prof. Arkopal K. Goswami, PhD</p>
              <p className="text-sm text-gray-600">
                Associate Professor <br />
                Chairperson <br />
                Ranbir and Chitra Gupta School of Infrastructure Design and
                Management (RCGSIDM) <br />
                Indian Institute of Technology Kharagpur
              </p>
              <a
                href="mailto:akgoswami@infra.iitkgp.ac.in"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                akgoswami@infra.iitkgp.ac.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyIntro;
