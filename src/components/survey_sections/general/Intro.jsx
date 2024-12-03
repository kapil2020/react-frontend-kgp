import React from "react";

const SurveyIntro = () => {
  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl px-6 py-8 mx-4 mt-8 bg-white rounded-lg shadow-xl">
        {/* Title Section */}
        <h1 className="text-2xl font-extrabold text-center text-blue-900 sm:text-3xl md:text-4xl">
          Impact of Air Pollution Exposure on Travel Behaviour
        </h1>

        {/* Content Grid with Vertical Divider */}
        <div className="flex flex-col w-full mt-8 md:flex-row">
          {/* Did You Know Section */}
          <div className="w-full md:w-1/2 md:pr-4">
            <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">
              Did You Know?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-700 sm:text-lg">
              Our exposure to air pollution is highest during travel—more than any
              other daily activity! 🚗 🚌 From sitting in traffic jams ⏳ to waiting
              at bus stops 🕒, commuting exposes you to harmful pollutants at levels
              far greater than indoors or other activities. 🌍💡
            </p>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block md:w-px md:bg-gray-300 md:mx-4"></div>

          {/* About Section */}
          <div className="w-full mt-8 md:w-1/2 md:pl-4 md:mt-0">
            <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">
              About the Survey 📝
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-700 sm:text-lg">
              This survey explores how air quality impacts your travel decisions.
              Discover how air pollution exposure influences your choice of routes
              and modes, encouraging a shift towards greener options like public
              transit 🚍 🚇.
            </p>
            <p className="mt-4 text-base font-medium leading-relaxed text-center text-blue-800 sm:text-lg">
              Your participation contributes to creating smarter, healthier urban
              mobility solutions for a sustainable future. 🌱
            </p>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="mt-12">
          <button
            className="px-8 py-3 text-lg font-semibold text-white transition-transform transform bg-blue-800 rounded-full shadow-lg hover:scale-105 hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
            onClick={() => {
              window.location.href = "/survey";
            }}
          >
            Start Survey
          </button>
        </div>

        {/* Contact Section */}
        <div className="w-full mt-12 text-center text-gray-800">
          <h3 className="text-xl font-semibold sm:text-2xl">
            📧 For Queries or Assistance
          </h3>
          <div className="grid grid-cols-1 gap-8 mt-8 sm:grid-cols-2">
            <div className="space-y-2">
              <a
                href="https://sites.google.com/view/kapil-lab/home"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-blue-800 transition-colors hover:text-blue-900"
              >
                Mr. Kapil Meena
              </a>
              <p className="text-sm text-gray-600">
                (Doctoral Scholar, IIT Kharagpur)
              </p>
              <a
                href="mailto:kapil.meena@kgpin.iitkgp.ac.in"
                className="text-blue-800 transition-colors hover:text-blue-900"
              >
                kapil.meena@kgpin.iitkgp.ac.in
              </a>
            </div>
            <div className="space-y-2">
              <a
                href="https://www.mustlab.in/faculty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-blue-800 transition-colors hover:text-blue-900"
              >
                Prof. Arkopal K. Goswami, PhD
              </a>
              <p className="text-sm text-gray-600">
                Associate Professor <br />
                Chairperson <br />
                Ranbir and Chitra Gupta School of Infrastructure Design and
                Management (RCGSIDM) <br />
                Indian Institute of Technology Kharagpur
              </p>
              <a
                href="mailto:akgoswami@infra.iitkgp.ac.in"
                className="text-blue-800 transition-colors hover:text-blue-900"
              >
                akgoswami@infra.iitkgp.ac.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-fixed bg-center bg-cover" style={{ backgroundImage: 'url("/path-to-your-background-image.jpg")', opacity: 0.1 }}></div>
      </div>

      {/* Sticky Start Button for Mobile */}
      <div className="fixed bottom-4 left-0 right-0 z-20 flex justify-center md:hidden">
        <button
          className="px-6 py-3 text-lg font-semibold text-white transition-transform transform bg-blue-800 rounded-full shadow-lg hover:scale-105 hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
          onClick={() => {
            window.location.href = "/survey";
          }}
        >
          Start Survey
        </button>
      </div>
    </div>
  );
};

export default SurveyIntro;
