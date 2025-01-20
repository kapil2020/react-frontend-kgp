import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";

const MetaData_info = ({ allResponses }) => {
  const containerRef = useRef();

  useEffect(() => {
    let isMount = true;

    async function loadAndRenderPlot() {
      if (allResponses && allResponses.length > 0) {
        // Prepare data: gather seconds/minutes from each response
        const plotData = allResponses
          .map((eachres) => {
            const m = eachres?.data?.metadata?.timeTaken?.minutes;
            const s = eachres?.data?.metadata?.timeTaken?.seconds;
            if (m == null || s == null) return null;
            return { minutes: m, seconds: s };
          })
          .filter(Boolean);

        console.log("Plot data:", plotData);

        // Build the Plot
        const plot = Plot.plot({
          width: 600,
          height: 400,
          marginLeft: 50,
          marginBottom: 50,
          marginTop: 40,
          marginRight: 30,
          grid: true, // turn on default grid lines
          style: {
            background: "#fafafa",
            color: "#333",
            fontFamily: "sans-serif",
          },
          x: {
            label: "Minutes Spent →",
            type: "linear",
            tickFormat: (d) => `${d} min`,
          },
          y: {
            label: "↑ Seconds Spent",
            type: "linear",
            tickFormat: (d) => `${d} sec`,
          },
          marks: [
            // Light grid lines across entire chart
            Plot.gridX({ stroke: "#ccc" }),
            Plot.gridY({ stroke: "#ccc" }),

            // Zero/Origin lines (optional)
            Plot.ruleX([0], { stroke: "gray", strokeWidth: 0.7 }),
            Plot.ruleY([0], { stroke: "gray", strokeWidth: 0.7 }),

            // Scatter points for each response
            Plot.dot(plotData, {
              x: "minutes",
              y: "seconds",
              r: 4,
              fill: "#1B9E77",
              fillOpacity: 0.8,
            }),
          ],
          // Title or “subtitle” inside the chart
          caption: "Scatter of Time Spent on Survey (minutes vs seconds)",
        });

        if (isMount && containerRef.current) {
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(plot);
        }
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
        className="max-w-[650px] w-full mx-8 py-4 flex content-center mt-4 bg-pink-50 shadow-md rounded"
      />
    </div>
  );
};

export default MetaData_info;
