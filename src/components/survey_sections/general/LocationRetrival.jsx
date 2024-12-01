import React from "react";

const LocationRetrieval = ({
  location,
  setLocation,
  landmark,
  setLandmark,
}) => {
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
        },
        (error) => {
          alert("Unable to retrieve Location. Error: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <section id="pre-survey" className="py-4 px-4 sm:px-6">
      <h3 className="text-lg font-bold mb-4 justify-center">
        Pre-Survey Details
      </h3>
      <button
        type="button"
        onClick={getLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Get My Location
      </button>
      <p className="mt-4">Q.1 Location of surveyed household:</p>
      <p>
        Latitude: <span id="latitude">{location.latitude}</span>
      </p>
      <p>
        Longitude: <span id="longitude">{location.longitude}</span>
      </p>
      <label htmlFor="landmark" className="block mt-4">
        Specific landmark (optional):
      </label>
      <input
        onChange={(e) => setLandmark(e.target.value)}
        type="text"
        id="landmark"
        placeholder="Nearest landmark"
        className="border rounded w-full mt-2 p-2"
      />
    </section>
  );
};

export default LocationRetrieval;
