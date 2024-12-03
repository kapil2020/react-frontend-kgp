import React from "react";

const SurveyIntro = () => {
  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-hidden bg-gray-900">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        >
          <source src="/path-to-your-background-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-6 py-12 mx-4 bg-white bg-opacity-80 rounded-lg shadow-xl backdrop-filter backdrop-blur-lg sm:px-8 md:px-12 md:py-16">
        {/* Title Section */}
        <h1 className="text-2xl font-extrabold text-center text-white sm:text-4xl md:text-5xl">
          Impact of Air Pollution Exposure on Travel Behaviour
        </h1>

        {/* Call-to-Action */}
        <div className="mt-8">
          <button
            className="px-8 py-4 text-lg font-semibold text-white transition-transform transform bg-blue-600 rounded-full shadow-lg hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            onClick={() => {
              window.location.href = "/survey";
            }}
          >
            Start Survey
          </button>
        </div>

        {/* Key Information */}
        <div className="mt-12">
          <p className="text-lg leading-relaxed text-center text-white sm:text-xl">
            <span className="font-semibold text-white">
              Did You Know?
              <br />
            </span>
            Our exposure to air pollution is highest during travel—more than any
            other daily activity! 🚗 🚌 From sitting in traffic jams ⏳ to waiting
            at bus stops 🕒, commuting exposes you to harmful pollutants at levels
            far greater than indoors or other activities. 🌍💡
          </p>
        </div>

        {/* Decorative Divider */}
        <div className="my-12 border-b border-gray-300"></div>

        {/* About Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-white">
            About the Survey 📝
          </h2>
          <p className="text-lg leading-relaxed text-center text-white sm:px-12">
            This survey explores how air quality impacts your travel decisions.
            Discover how air pollution exposure influences your choice of routes
            and modes, encouraging a shift towards greener options like public
            transit 🚍 🚇.
          </p>
          <p className="text-lg font-medium leading-relaxed text-center text-green-300">
            Your participation contributes to creating smarter, healthier urban
            mobility solutions for a sustainable future. 🌱
          </p>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center text-white">
          <h3 className="text-2xl font-semibold">
            📧 For Queries or Assistance
          </h3>
          <div className="grid grid-cols-1 gap-8 mt-8 sm:grid-cols-2">
            <div className="space-y-2">
              <a
                href="https://sites.google.com/view/kapil-lab/home"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-medium text-blue-400 transition-colors hover:text-blue-500"
              >
                Mr. Kapil Meena
              </a>
              <a
                href="mailto:kapil.meena@kgpin.iitkgp.ac.in"
                className="text-blue-400 transition-colors hover:text-blue-500"
              >
                kapil.meena@kgpin.iitkgp.ac.in
              </a>
              <p className="text-gray-300">(Doctoral Scholar, IIT Kharagpur)</p>
            </div>
            <div className="space-y-2">
              <a
                href="https://www.mustlab.in/faculty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-medium text-blue-400 transition-colors hover:text-blue-500"
              >
                Prof. Arkopal K. Goswami, PhD
              </a>
              <p className="text-gray-300">
                Associate Professor <br />
                Chairperson <br />
                Ranbir and Chitra Gupta School of Infrastructure Design and
                Management (RCGSIDM) <br />
                Indian Institute of Technology Kharagpur
              </p>
              <a
                href="mailto:akgoswami@infra.iitkgp.ac.in"
                className="text-blue-400 transition-colors hover:text-blue-500"
              >
                akgoswami@infra.iitkgp.ac.in
              </a>
            </div>
          </div>
        </div>

        {/* Footer (Optional) */}
        {/* <footer className="mt-12 text-sm text-center text-gray-400">
          © 2023 Your Organization Name. All rights reserved.
        </footer> */}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        /* Add any custom styles here */
      `}</style>
    </div>
  );
};

export default SurveyIntro;
