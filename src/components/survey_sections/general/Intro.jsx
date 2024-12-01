import React from "react";

const SurveyIntro = ({
  title,
  didYouKnow,
  aboutSurvey,
  contactInfo,
  callToAction,
  surveyLink,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-8 py-10">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6 sm:p-8">
        {/* Title Section */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-blue-900">
          {title}
        </h1>

        {/* Did You Know Section */}
        <p className="mt-6 text-center text-gray-700 text-sm sm:text-lg leading-relaxed">
          <span className="font-bold">Did You Know?</span>
          <br />
          {didYouKnow}
        </p>

        {/* Call to Action Section */}
        <p className="mt-4 text-center text-blue-600 font-medium text-sm sm:text-base">
          Travel smart. Breathe healthy. 🌬️
        </p>

        <hr className="border-t border-gray-300 my-8" />

        {/* About the Survey Section */}
        <div className="text-gray-800">
          <h2 className="text-lg sm:text-xl font-semibold text-center">
            📝 About the Survey:
          </h2>
          <p className="mt-6 text-center text-sm sm:text-base leading-relaxed">
            {aboutSurvey}
          </p>
        </div>

        <hr className="border-t border-gray-300 my-8" />

        {/* Contact Info Section */}
        <div className="text-gray-700">
          <h3 className="text-lg font-semibold text-center">📧 Contact Us</h3>
          <div className="flex flex-col sm:flex-row justify-around mt-6">
            {contactInfo.map((contact, index) => (
              <div key={index} className="mb-6 sm:mb-0 text-center sm:text-left">
                <p className="font-semibold">{contact.name}</p>
                <p className="text-sm sm:text-base">{contact.role}</p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-500 hover:underline"
                >
                  {contact.email}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Join Us Section */}
        <p className="mt-6 text-center text-blue-800 font-medium text-sm sm:text-base">
          {callToAction}
        </p>

        {/* Button Section */}
        <div className="flex justify-center mt-8">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            onClick={() => (window.location.href = surveyLink)}
          >
            Start Survey
          </button>
        </div>
      </div>
    </div>
  );
};

// Default props for dynamic rendering
SurveyIntro.defaultProps = {
  title: "Impact of Air Pollution Exposure on Travel Behavior",
  didYouKnow:
    "Our exposure to air pollution is highest during travel—more than any other daily activity! 🚗 🚌 From sitting in traffic jams ⏳ to waiting at bus stops 🕒, commuting exposes you to harmful pollutants at levels far greater than indoors or other activities. 🌍💡",
  aboutSurvey:
    "How does air quality influence your travel choices? This survey dives into how real-time air quality information 🌫️ affects your decisions on routes and modes of transportation. Our aim is to uncover ways to help private vehicle users 🚘 shift towards healthier, greener options like public transit 🚌 🚈.",
  contactInfo: [
    {
      name: "Kapil Meena",
      role: "Doctoral Scholar, IIT Kharagpur",
      email: "kapil.meena@kgpin.iitkgp.ac.in",
    },
    {
      name: "Prof. Arkopal Goswami",
      role:
        "Associate Professor, Ranbir and Chitra Gupta School of Infrastructure Design and Management (RCGSIDM), IIT Kharagpur",
      email: "akgoswami@infra.iitkgp.ac.in",
    },
  ],
  callToAction: "✨ Join us in shaping the future of urban mobility. Your voice matters! 😊",
  surveyLink: "/survey",
};

export default SurveyIntro;
