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

        // Split by newline and parse each JSON object
        const jsonData = textData
          .trim() // Remove leading/trailing whitespace
          .split("\n") // Split by newlines
          .map((line, index) => {
            try {
              return JSON.parse(line); // Parse each line as JSON
            } catch (parseError) {
              console.error(
                `Error parsing JSON at line ${index + 1}:`,
                parseError,
                line
              );
              return null; // Skip invalid lines
            }
          })
          .filter(Boolean); // Filter out null values for invalid JSON lines

        setResponseCount(jsonData.length);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    fetchResponses();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : responseCount !== null ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Total Responses
            </h1>
            <p className="text-xl text-gray-700">{responseCount}</p>
          </>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ResponseCounter; 
