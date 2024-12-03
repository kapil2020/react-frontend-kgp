import React from "react";

const SurveyIntro = () => {
  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-hidden bg-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gray-100"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-3xl p-6 mx-4 mt-12 bg-white rounded-lg shadow-lg sm:p-8 md:p-12 md:mt-20">
        {/* Logo or Header Image (Optional) */}
        {/* <div className="flex justify-center">
          <img src="/path-to-your-logo.png" alt="Logo" className="w-24 h-24" />
        </div> */}

        {/* Title Section */}
        <h1 className="mt-4 text-2xl font-extrabold text-center text-gray-800 sm:text-3xl md:text-4xl">
          Impact of Air Pollution Exposure on Travel Behaviour
        </h1>

        {/* Key Information */}
        <div className="mt-8">
          <p className="text-base leading-relaxed text-center text-gray-700 sm:text-lg">
            <span className="font-semibold text-gray-900">
              Did You Know?
              <br />
            </span>
            Our exposure to air pollution is highest during travel—more than any
            other daily activity! 🚗 🚌 From sitting in traffic jams ⏳ to
            waiting at bus stops 🕒, commuting exposes you to harmful pollutants
            at levels far greater than indoors or other activities. 🌍💡
          </p>
        </div>

        {/* Decorative Divider */}
        <div className="my-8 border-b border-gray-200"></div>

        {/* About Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-center text-gray-800 sm:text-2xl">
            About the Survey 📝
          </h2>
          <p className="text-base leading-relaxed text-center text-gray-700 sm:text-lg">
            This survey explores how air quality impacts your travel decisions.
            Discover how air pollution exposure influences your choice of routes
            and modes, encouraging a shift towards greener options like public
            transit 🚍 🚇.
          </p>
          <p className="text-base font-medium leading-relaxed text-center text-green-700 sm:text-lg">
            Your participation contributes to creating smarter, healthier urban
            mobility solutions for a sustainable future. 🌱
          </p>
        </div>

        {/* Call-to-Action */}
        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-gray-800 sm:text-xl">
            Join us in shaping the future of urban mobility. Your voice matters!
            🚀
          </p>
          <div className="mt-8">
            <button
              className="px-6 py-3 text-base font-semibold text-white transition-colors bg-blue-600 rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 sm:text-lg"
              onClick={() => {
                window.location.href = "/survey";
              }}
            >
              Start Survey
            </button>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="my-8 border-b border-gray-200"></div>

        {/* Contact Section */}
        <div className="text-center text-gray-800">
          <h3 className="text-xl font-semibold sm:text-2xl">
            📧 For Queries or Assistance
          </h3>
          <div className="grid grid-cols-1 gap-8 mt-8 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-lg font-medium">Mr. Kapil Meena</p>
              <a
                href="mailto:kapil.meena@kgpin.iitkgp.ac.in"
                className="text-blue-600 transition-colors hover:text-blue-800"
              >
                kapil.meena@kgpin.iitkgp.ac.in
              </a>
              <p className="text-sm text-gray-600">
                (Doctoral Scholar, IIT Kharagpur)
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">Prof. Arkopal K. Goswami, PhD</p>
              <p className="text-sm text-gray-600">
                Associate Professor <br />
                Chairperson <br />
                Ranbir and Chitra Gupta School of Infrastructure Design and
                Management (RCGSIDM) <br />
                Indian Institute of Technology Kharagpur
              </p>
              <a
                href="mailto:akgoswami@infra.iitkgp.ac.in"
                className="text-blue-600 transition-colors hover:text-blue-800"
              >
                akgoswami@infra.iitkgp.ac.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (Optional) */}
      {/* <footer className="relative z-10 w-full max-w-3xl p-4 mx-4 mt-8 text-sm text-center text-gray-500">
        © 2023 Your Organization Name. All rights reserved.
      </footer> */}
    </div>
  );
};

export default SurveyIntro;
