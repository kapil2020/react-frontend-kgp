import React, { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";

const MetaData_info_Histogram = ({ allResponses }) => {
  const containerRef = useRef();

  useEffect(() => {
    let isMount = true;

    function loadAndRenderHistogram() {
      if (!allResponses || allResponses.length === 0) return;

      // Combine (minutes * 60 + seconds) => totalSeconds
      const data = allResponses
        .map((eachres) => {
          const m = eachres?.data?.metadata?.timeTaken?.minutes;
          const s = eachres?.data?.metadata?.timeTaken?.seconds;
          if (m == null || s == null) return null;
          return (m * 60) + s;
        })
        .filter((val) => val !== null);

      if (data.length === 0) return;

      // Create the histogram
      const plot = Plot.plot({
        width: 600,
        height: 400,
        grid: true,
        marginLeft: 50,
        marginBottom: 50,
        marginTop: 40,
        marginRight: 30,
        style: {
          background: "#fafafa",
          color: "#333",
          fontFamily: "sans-serif",
        },
        x: {
          label: "Total Seconds Spent →",
        },
        y: {
          label: "↑ Count of People",
        },
        marks: [
          // Basic histogram
          Plot.rectY(data, {
            x: (d) => d,         // total seconds as x
            // set number of bins or extent if needed
            // e.g. bin: 20 for 20 bins
            fill: "#1B9E77",
            fillOpacity: 0.7,
          }),
        ],
        caption: "Distribution of Time Spent (in total seconds)",
      });

      if (isMount && containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(plot);
      }
    }

    loadAndRenderHistogram();

    return () => {
      isMount = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [allResponses]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-semibold text-gray-700">Metadata: Histogram</h3>
      <div
        ref={containerRef}
        className="max-w-[650px] w-full mx-8 py-4 flex content-center mt-4 bg-pink-50 shadow-md rounded"
      />
    </div>
  );
};

export default MetaData_info_Histogram;
