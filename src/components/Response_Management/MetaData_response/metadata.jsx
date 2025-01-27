import React, { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";

const MetaData_info_Hexbin = ({ allResponses }) => {
  const containerRef = useRef();

  useEffect(() => {
    let isMount = true;

    function loadAndRenderHexPlot() {
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

      // Only proceed if we actually have data
      if (plotData.length === 0) return;

      // Create the Plot
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
          label: "Minutes Spent →",
          tickFormat: (d) => `${d} min`,
        },
        y: {
          label: "↑ Seconds Spent",
          tickFormat: (d) => `${d} sec`,
        },
        // “Hexbin” mark: bins the data in 2D hexagons, coloring by count
        marks: [
          Plot.hexbin(plotData, {
            x: "minutes",
            y: "seconds",
            fill: "count",
            // The radius of each hex cell; adjust for your data range
            // so it doesn't look too chunky or too granular.
            r: 10,
            // White outline around each hex cell for clarity
            stroke: "#fff",
            // You can also set a color scheme or range:
            // e.g. fillScale: d3.scaleSequential([0, maxCount], d3.interpolateBlues)
          }),
        ],
        caption: "Time Spent on Survey (Hexbin of minutes vs. seconds)",
      });

      if (isMount && containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(plot);
      }
    }

    loadAndRenderHexPlot();

    return () => {
      isMount = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [allResponses]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-semibold text-gray-700">Metadata: Hexbin Plot</h3>
      <div
        ref={containerRef}
        className="max-w-[650px] w-full mx-8 py-4 flex content-center mt-4 bg-pink-50 shadow-md rounded"
      />
    </div>
  );
};

export default MetaData_info_Hexbin;
