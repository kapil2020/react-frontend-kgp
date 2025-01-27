import React, { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";

/**
 * ECDF chart to see "What fraction of people finished the survey by time T?"
 */
const MetaData_info_ECDF = ({ allResponses }) => {
  const containerRef = useRef();

  useEffect(() => {
    let isMount = true;

    function loadAndRenderPlot() {
      if (!allResponses || allResponses.length === 0) return;

      // Combine (minutes * 60 + seconds) => totalSeconds
      const data = allResponses
        .map((resp) => {
          const m = resp?.data?.metadata?.timeTaken?.minutes;
          const s = resp?.data?.metadata?.timeTaken?.seconds;
          if (m == null || s == null) return null;
          return m * 60 + s; // total time in seconds
        })
        .filter((val) => val !== null);

      // No valid data => skip
      if (data.length === 0) return;

      // Build the ECDF Plot
      const plot = Plot.plot({
        width: 640,
        height: 400,
        marginLeft: 60,
        marginRight: 30,
        marginTop: 40,
        marginBottom: 50,
        grid: true,
        style: {
          background: "#fafafa",
          color: "#333",
          fontFamily: "sans-serif",
        },
        x: {
          label: "Total Time (seconds) →",
        },
        y: {
          label: "Proportion of Participants ↑",
          // We know it's an ECDF, so y will range from 0 to 1 automatically
          tickFormat: d3.format(".0%"),
        },
        marks: [
          // The ECDF line
          Plot.ecdf(data, {
            x: (d) => d,
            // stroke, fill, and style
            stroke: "#1B9E77",
            strokeWidth: 2,
          }),
        ],
        caption: "Cumulative Distribution of Survey Completion Times",
      });

      // Render
      if (isMount && containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(plot);
      }
    }

    loadAndRenderPlot();

    return () => {
      isMount = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [allResponses]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-semibold text-gray-700">Survey Time ECDF</h3>
      <div
        ref={containerRef}
        className="max-w-[700px] w-full py-4 mt-4 bg-pink-50 shadow-md rounded"
      />
    </div>
  );
};

export default MetaData_info_ECDF;
