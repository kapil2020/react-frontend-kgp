import React, { useEffect, useState } from "react";

const ResponseCounter = () => {
  const [responseCount, setResponseCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch(
          "https://survey-backend-zsdp.onrender.com/responses",
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const textData = await res.text();

        console.log("Raw Response:", textData); // Debugging step

        const jsonData = textData
          .trim()
          .split("\n")
          .map((line, index) => {
            try {
              return JSON.parse(line);
            } catch (parseError) {
              console.error(
                `Error parsing JSON at line ${index + 1}:`,
                parseError,
                line
              );
              return null;
            }
          })
          .filter(Boolean);

        setResponseCount(jsonData.length);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    fetchResponses();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-96 text-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
        {error ? (
          <p className="text-red-600 text-lg font-medium">{error}</p>
        ) : responseCount !== null ? (
          <>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
              Total Responses
            </h1>
            <p className="text-5xl font-bold text-indigo-500 animate-pulse">
              {responseCount}
            </p>
          </>
        ) : (
          <p className="text-gray-500 text-lg font-medium animate-bounce">
            Loading...
          </p>
        )}
      </div>
    </div>
  );
};

export default ResponseCounter;
