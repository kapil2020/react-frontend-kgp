import React from "react";

const SurveyIntro = () => {
  return (
    <div className="relative flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-200 via-pink-100 to-yellow-200">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl px-6 py-8 mx-4 mt-8 bg-white bg-opacity-80 rounded-lg shadow-xl">
        {/* Title Section */}
        <h1 className="text-2xl font-extrabold text-center text-gray-800 sm:text-3xl md:text-4xl">
          Impact of Air Pollution Exposure on Travel Behaviour
        </h1>

        {/* Content Grid */}
        <div className="grid w-full grid-cols-1 gap-8 mt-8 md:grid-cols-2">
          {/* Key Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">
              Did You Know?
            </h2>
            <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
              Our exposure to air pollution is highest during travel—more than any
              other daily activity! 🚗 🚌 From sitting in traffic jams ⏳ to waiting
              at bus stops 🕒, commuting exposes you to harmful pollutants at levels
              far greater than indoors or other activities. 🌍💡
            </p>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">
              About the Survey 📝
            </h2>
            <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
              This survey explores how air quality impacts your travel decisions.
              Discover how air pollution exposure influences your choice of routes
              and modes, encouraging a shift towards greener options like public
              transit 🚍 🚇.
            </p>
            <p className="text-base font-medium leading-relaxed text-green-700 sm:text-lg">
              Your participation contributes to creating smarter, healthier urban
              mobility solutions for a sustainable future. 🌱
            </p>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="mt-8">
          <button
            className="px-6 py-3 text-lg font-semibold text-white transition-transform transform bg-blue-600 rounded-full shadow-lg hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
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
                className="text-lg font-medium text-blue-600 transition-colors hover:text-blue-800"
              >
                Mr. Kapil Meena
              </a>
              <p className="text-sm text-gray-600">
                (Doctoral Scholar, IIT Kharagpur)
              </p>
              <a
                href="mailto:kapil.meena@kgpin.iitkgp.ac.in"
                className="text-blue-600 transition-colors hover:text-blue-800"
              >
                kapil.meena@kgpin.iitkgp.ac.in
              </a>
            </div>
            <div className="space-y-2">
              <a
                href="https://www.mustlab.in/faculty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-blue-600 transition-colors hover:text-blue-800"
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
                className="text-blue-600 transition-colors hover:text-blue-800"
              >
                akgoswami@infra.iitkgp.ac.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Sticky Start Button for Mobile */}
      <div className="fixed bottom-4 left-0 right-0 z-20 flex justify-center md:hidden">
        <button
          className="px-6 py-3 text-lg font-semibold text-white transition-transform transform bg-blue-600 rounded-full shadow-lg hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          onClick={() => {
            window.location.href = "/survey";
          }}
        >
          Start Survey
        </button>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(20px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};

export default SurveyIntro;
