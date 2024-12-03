import React from "react";

const SurveyIntro = () => {
  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-hidden bg-gray-50">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-green-400 animate-gradient-xy"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-300 opacity-20 rounded-full mix-blend-multiply filter blur-2xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-300 opacity-20 rounded-full mix-blend-multiply filter blur-2xl animate-float animation-delay-2000"></div>
        <div className="absolute top-3/4 left-1/4 w-80 h-80 bg-blue-300 opacity-20 rounded-full mix-blend-multiply filter blur-2xl animate-float animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl p-8 mx-4 bg-white rounded-3xl shadow-2xl bg-opacity-90 backdrop-filter backdrop-blur-lg">
        {/* Title Section */}
        <h1 className="text-3xl font-extrabold text-center text-gray-800 sm:text-4xl md:text-5xl">
          Impact of Air Pollution Exposure on Travel Behaviour
        </h1>

        {/* Key Information */}
        <div className="mt-8">
          <p className="text-lg leading-relaxed text-center text-gray-700 sm:text-xl">
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
        <div className="my-12 border-b-2 border-dashed border-gray-300"></div>

        {/* About Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            About the Survey 📝
          </h2>
          <p className="text-lg leading-relaxed text-center text-gray-700 sm:px-12">
            This survey explores how air quality impacts your travel decisions.
            Discover how air pollution exposure influences your choice of routes
            and modes, encouraging a shift towards greener options like public
            transit 🚍 🚇.
          </p>
          <p className="text-lg font-medium leading-relaxed text-center text-green-700">
            Your participation contributes to creating smarter, healthier urban
            mobility solutions for a sustainable future. 🌱
          </p>
        </div>

        {/* Call-to-Action */}
        <div className="mt-12 text-center">
          <p className="text-xl font-medium text-gray-800">
            Join us in shaping the future of urban mobility. Your voice matters!
            🚀
          </p>
          <div className="mt-8">
            <button
              className="px-8 py-4 text-lg font-semibold text-white transition-transform transform bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
              onClick={() => {
                window.location.href = "/survey";
              }}
            >
              Start Survey
            </button>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="my-12 border-b-2 border-dashed border-gray-300"></div>

        {/* Contact Section */}
        <div className="text-center text-gray-800">
          <h3 className="text-2xl font-semibold">📧 For Queries or Assistance</h3>
          <div className="grid grid-cols-1 gap-8 mt-8 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xl font-medium">Mr. Kapil Meena</p>
              <a
                href="mailto:kapil.meena@kgpin.iitkgp.ac.in"
                className="text-blue-600 transition-colors hover:text-blue-800"
              >
                kapil.meena@kgpin.iitkgp.ac.in
              </a>
              <p className="text-gray-600">(Doctoral Scholar, IIT Kharagpur)</p>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-medium">Prof. Arkopal K. Goswami, PhD</p>
              <p className="text-gray-600">
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

      {/* Custom Animations */}
      <style jsx>{`
        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 15s ease infinite;
        }
        @keyframes gradient-xy {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(10px);
          }
        }
      `}</style>
    </div>
  );
};

export default SurveyIntro;
