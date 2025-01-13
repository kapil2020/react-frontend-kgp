import React from "react";

const SurveyIntro = () => {
  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gray-100 overflow-hidden">
      {/* Animated Background Waves */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-48"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#1E3A8A"
            fillOpacity="1"
            d="M0,64L48,74.7C96,85,192,107,288,112C384,117,480,107,576,96C672,85,768,75,864,69.3C960,64,1056,64,1152,85.3C1248,107,1344,149,1392,170.7L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl px-6 py-8 mx-4 mt-16 bg-white rounded-lg shadow-xl animate-fade-in">
        {/* Title Section */}
        <h1 className="text-2xl font-extrabold text-center text-blue-900 sm:text-3xl md:text-4xl">
          Impact of Air Pollution Exposure on Travel Behaviour
        </h1>

        {/* Content Grid with Vertical Divider */}
        <div className="flex flex-col w-full mt-8 md:flex-row">
          {/* Did You Know Section */}
          <div className="w-full md:w-1/2 md:pr-4 animate-fade-in-left">
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
          <div className="w-full mt-8 md:w-1/2 md:pl-4 md:mt-0 animate-fade-in-right">
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
        <div className="mt-12 animate-fade-in">
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
        <div className="w-full mt-12 text-center text-gray-800 animate-fade-in">
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
                href="mailto:kapil.meena@kgpian.iitkgp.ac.in"
                className="text-blue-800 transition-colors hover:text-blue-900"
              >
                kapil.meena@kgpian.iitkgp.ac.in
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

        {/* Footer with Logo */}
        <div className="w-full mt-8 text-center">
          <img
            src="https://raw.githubusercontent.com/kapil2020/react-frontend-kgp/main/src/components/survey_frontend/survey_sections/general/Screenshot_2023-06-18_114302-removebg-preview.png"
            alt="Logo"
            className="mx-auto max-w-full h-auto"
            style={{ maxHeight: '150px' }}
          />
        </div>
      </div>

      {/* Animated Background Waves at Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-48"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#1E3A8A"
            fillOpacity="1"
            d="M0,64L48,74.7C96,85,192,107,288,112C384,117,480,107,576,96C672,85,768,75,864,69.3C960,64,1056,64,1152,85.3C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default SurveyIntro;
