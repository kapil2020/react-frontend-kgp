import React from "react";
import { motion } from "framer-motion";

const SurveyIntro = () => {
  return (
    <div className="flex flex-col items-center py-8 sm:py-16 px-6 sm:px-8 bg-gradient-to-b from-blue-50 to-green-50 min-h-screen">
      {/* Card Container with animation */}
      <motion.div
        className="lg:max-w-4xl sm:max-w-2xl w-full bg-white shadow-md rounded-xl p-6 sm:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Title Section */}
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-800 leading-tight"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Impact of Air Pollution Exposure on Travel Behaviour
        </motion.h1>

        {/* Key Information */}
        <div className="mt-6 sm:mt-8">
          <p className="text-center text-gray-600 text-sm sm:text-base leading-relaxed">
            <span className="font-semibold text-gray-900">
              Did You Know?
              <br />
            </span>
            Exposure to air pollution peaks during travel—more than any other
            daily activity! Whether stuck in traffic 🚗 or waiting at bus stops
            🕒, commuting exposes you to harmful pollutants at alarming levels.
          </p>
          <motion.p
            className="mt-4 text-center text-blue-700 font-medium text-sm sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Make smarter choices, reduce exposure, and safeguard your health.
          </motion.p>
        </div>

        {/* Divider */}
        <hr className="my-6 sm:my-8 border-gray-200" />

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-700">
            About the Survey 📝
          </h2>
          <p className="mt-4 text-center text-gray-600 text-sm sm:text-base leading-relaxed">
            This survey explores how air quality impacts your travel decisions.
            Discover how real-time air quality data influences your choice of
            routes and modes, encouraging a shift towards greener options like
            public transit 🚍 🚇.
          </p>
          <p className="mt-4 text-center text-green-600 font-medium text-sm sm:text-base">
            Your participation contributes to creating smarter, healthier urban
            mobility solutions for a sustainable future. 🌱
          </p>
        </motion.div>

        {/* Divider */}
        <hr className="my-6 sm:my-8 border-gray-200" />

        {/* Contact Section */}
        <div className="text-center text-gray-700">
          <h3 className="text-lg font-semibold">Contact Us 📧</h3>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
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
              <p className="font-medium">Prof. Arkopal Goswami</p>
              <a
                href="mailto:akgoswami@infra.iitkgp.ac.in"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                akgoswami@infra.iitkgp.ac.in
              </a>
              <p className="text-sm text-gray-600">
                Associate Professor <br />
                RCGSIDM, IIT Kharagpur
              </p>
            </div>
          </motion.div>
        </div>

        {/* Call-to-Action */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <p className="text-center text-gray-800 font-medium">
            Join us in shaping the future of urban mobility. Your voice
            matters! 🚀
          </p>
          <div className="mt-6 flex justify-center">
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-300 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105 focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.location.href = "/survey";
              }}
            >
              Start Survey
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SurveyIntro;
