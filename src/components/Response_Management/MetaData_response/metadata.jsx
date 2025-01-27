import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";

const MetaData_info = ({ allResponses }) => {
  const containerRef = useRef();

  useEffect(() => {
    let isMount = true;

    function loadAndRenderPlot() {
      if (!allResponses || allResponses.length === 0) return;

      // Prepare data: gather seconds/minutes from each response
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
        grid: true, // turn on default grid lines
        style: {
          background: "#fafafa",
          color: "#333",
          fontFamily: "sans-serif",
        },
        // Define a color scale for "minutes"
        color: {
          type: "linear",
          scheme: "spectral", // try "blues", "greens", "reds", etc.
          label: "Minutes",
          // If you want to clamp or expand domain, do domain: [0, d3.max(...)],
          // or let Plot infer from your data.
        },
        x: {
          label: "Minutes Spent →",
          tickFormat: (d) => `${d} min`,
          nice: true,
        },
        y: {
          label: "↑ Seconds Spent",
          tickFormat: (d) => `${d} sec`,
          nice: true,
        },
        marks: [
          // Grid lines
          Plot.gridX({ stroke: "#ccc" }),
          Plot.gridY({ stroke: "#ccc" }),

          // Optional origin lines
          Plot.ruleX([0], { stroke: "#999", strokeWidth: 0.6 }),
          Plot.ruleY([0], { stroke: "#999", strokeWidth: 0.6 }),

          // Scatter points colored by "minutes"
          Plot.dot(plotData, {
            x: "minutes",
            y: "seconds",
            fill: "minutes",
            r: 6,
            stroke: "#333", // outline
            strokeWidth: 0.5,
            title: (d) => `Time: ${d.minutes} min ${d.seconds} sec`,
          }),
        ],
        // Subtitle (optional), displayed below the chart
        caption: "Time Spent on Survey (minutes vs seconds) with Color Encoding",
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
      <h2 className="mb-2">Time Spent on Survey</h2>
      <div
        ref={containerRef}
        className="max-w-[650px] w-full mx-8 py-4 mt-4 bg-pink-50 shadow-md rounded"
      />
    </div>
  );
};

export default MetaData_info;
