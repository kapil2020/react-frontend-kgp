import React, { useEffect, useRef, useState } from "react";
import MetaData_info from "./MetaData_response/metadata";
import LazyForm1Response from "./Form1_response/LazyForm1Response";
import LazyForm3Response from "./Form3_response/LazyForm3Response";
import LazyForm6Response from "./Form6_response/LazyForm6Response";
import LazyForm2Response from "./Form2_response/LazyForm2Response";

// import Form1_info from "./Form1_response/form1_response";
// import * as d3 from "d3";

const ResponseCounter = () => {
  const [responses, setResponses] = useState(null);
  const [allresponses, setAllResponses] = useState([]); // Ensure this is an array
  const [error, setError] = useState(null);

  const cachedResponses = useRef([]); // Cache the responses

  // Metadata counts

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        console.log("Fetching the responses...");
        const res = await fetch(
          "https://x8ki-letl-twmt.n7.xano.io/api:MQ5XQ7S7/main_survey",
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const jsonData = await res.json();

        console.log("All responses are: ", jsonData);
        console.log("1st response is: ", jsonData[0]);

        const previousDataString = JSON.stringify(cachedResponses.current);
        const newDataString = JSON.stringify(jsonData);

        if (previousDataString !== newDataString) {
          console.log("Data has changed. Update the cache.");
          cachedResponses.current = jsonData;
          setAllResponses(jsonData);
          setResponses(jsonData.length); // Set the total number of responses
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    fetchResponses();

    // const interval = setInterval(fetchResponses, 3000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center w-auto bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl w-full text-center lg:m-10">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : responses !== null ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Responses</h1>
            <MetaData_info allResponses={allresponses} />
            {/* <Form1_info allResponses={allresponses} /> */}
            <LazyForm1Response allResponses={allresponses} />
            <LazyForm2Response allResponses={allresponses} />
            <LazyForm3Response allResponses={allresponses} />
            <LazyForm6Response allResponses={allresponses} />
          </>
        ) : (
          <p className="w-96 text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ResponseCounter;
