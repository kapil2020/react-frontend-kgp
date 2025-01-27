import React, { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";

const MetaData_info = ({ allResponses }) => {
  const containerRef = useRef();

  useEffect(() => {
    let isMount = true;

    function loadAndRenderPlot() {
      if (!allResponses || allResponses.length === 0) return;

      // Prepare data: gather minutes/seconds from each response
      const plotData = allResponses
        .map((eachres) => {
          const m = eachres?.data?.metadata?.timeTaken?.minutes;
          const s = eachres?.data?.metadata?.timeTaken?.seconds;
          if (m == null || s == null) return null;
          return { minutes: +m, seconds: +s };
        })
        .filter(Boolean);

      // Build the Plot
      const plot = Plot.plot({
        width: 600,
        height: 420,
        marginLeft: 60,
        marginBottom: 50,
        marginTop: 40,
        marginRight: 40,
        grid: true,
        style: {
          background: "#fafafa",
          color: "#333",
          fontFamily: "sans-serif",
        },
        // Manually constrain the x-axis to [0..10] minutes
        x: {
          label: "Minutes Spent (0–10) →",
          domain: [0, 10],
          tickFormat: (d) => `${d} min`,
        },
        // Manually constrain the y-axis to [0..60] seconds
        y: {
          label: "Seconds Spent (0–60) ↑",
          domain: [0, 60],
          tickFormat: (d) => `${d} sec`,
        },
        color: {
          type: "linear",
          scheme: "spectral",
          label: "Minutes",
          domain: [0, 10], // color-coded from 0..10 minutes
        },
        marks: [
          // Optional origin lines
          Plot.ruleX([0], { stroke: "#999", strokeWidth: 0.6 }),
          Plot.ruleY([0], { stroke: "#999", strokeWidth: 0.6 }),

          // Grid lines
          Plot.gridX({ stroke: "#ccc" }),
          Plot.gridY({ stroke: "#ccc" }),

          // Scatter points, sized bigger for clarity
          Plot.dot(plotData, {
            x: "minutes",
            y: "seconds",
            r: 6,
            fill: "minutes",  // color scale by minutes
            stroke: "#333",
            strokeWidth: 0.5,
            title: (d) => `Time: ${d.minutes}m ${d.seconds}s`,
          }),
        ],
        caption: "Scatter: 0–10 min / 0–60 sec (Manual Axes Domains)",
      });

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
      <h3 className="font-semibold text-gray-700">Metadata Information</h3>
      <h2 className="mb-2">Time Spent on Survey (Under 10 Minutes)</h2>
      <div
        ref={containerRef}
        className="max-w-[650px] w-full mx-8 py-4 mt-4 bg-pink-50 shadow-md rounded"
      />
    </div>
  );
};

export default MetaData_info;
