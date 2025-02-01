import React, { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";

const MetaData_info = ({ allResponses }) => {
  // Refs for both charts
  const zoomedContainerRef = useRef(null);
  const defaultContainerRef = useRef(null);

  useEffect(() => {
    if (!allResponses || allResponses.length === 0) return;

    // 1) Data Extraction
    const plotData = allResponses
      .map((resp) => {
        const m = resp?.data?.metadata?.timeTaken?.minutes;
        const s = resp?.data?.metadata?.timeTaken?.seconds;
        if (m == null || s == null) return null;
        return { minutes: +m, seconds: +s };
      })
      .filter(Boolean);

    // 2) "Zoomed" Plot: 0..10 minutes, 0..60 seconds
    (() => {
      // Clear old
      if (zoomedContainerRef.current) {
        zoomedContainerRef.current.innerHTML = "";
      }
      // Build the Plot
      const zoomedPlot = Plot.plot({
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
        // Constrain the axes
        x: {
          label: "Minutes Spent (0–10) →",
          domain: [0, 10],
          tickFormat: (d) => `${d} min`,
        },
        y: {
          label: "Seconds Spent (0–60) ↑",
          domain: [0, 60],
          tickFormat: (d) => `${d} sec`,
        },
        color: {
          type: "linear",
          scheme: "spectral",
          label: "Minutes",
          domain: [0, 10],
        },
        marks: [
          Plot.ruleX([0], { stroke: "#999", strokeWidth: 0.6 }),
          Plot.ruleY([0], { stroke: "#999", strokeWidth: 0.6 }),

          Plot.gridX({ stroke: "#ccc" }),
          Plot.gridY({ stroke: "#ccc" }),

          Plot.dot(plotData, {
            x: "minutes",
            y: "seconds",
            r: 6,
            fill: "minutes", // color-coded by minutes
            stroke: "#333",
            strokeWidth: 0.5,
            title: (d) => `Time: ${d.minutes}m ${d.seconds}s`,
          }),
        ],
        caption: "Zoomed Scatter: 0–10 min / 0–60 sec",
      });

      if (zoomedContainerRef.current) {
        zoomedContainerRef.current.appendChild(zoomedPlot);
      }
    })();

    // 3) "Default" Plot: automatic domain, simpler style
    (() => {
      // Clear old
      if (defaultContainerRef.current) {
        defaultContainerRef.current.innerHTML = "";
      }
      // Build the Plot
      const defaultPlot = Plot.plot({
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
          Plot.gridX({ stroke: "#ccc" }),
          Plot.gridY({ stroke: "#ccc" }),

          Plot.ruleX([0], { stroke: "gray", strokeWidth: 0.7 }),
          Plot.ruleY([0], { stroke: "gray", strokeWidth: 0.7 }),

          Plot.dot(plotData, {
            x: "minutes",
            y: "seconds",
            r: 4,
            fill: "#1B9E77",
            fillOpacity: 0.8,
          }),
        ],
        caption: "Scatter of Time Spent on Survey (auto domain)",
      });

      if (defaultContainerRef.current) {
        defaultContainerRef.current.appendChild(defaultPlot);
      }
    })();
  }, [allResponses]);

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-semibold text-lg mb-4">Metadata Information</h2>

      {/* Plot A: Zoomed (Top) */}
      <div className="flex flex-col items-center mb-8">
        <h3 className="mb-2">Time Spent (Zoomed View)</h3>
        <div
          ref={zoomedContainerRef}
          className="max-w-[650px] w-full bg-pink-50 shadow-md rounded p-4"
        />
      </div>

      {/* Plot B: Default (Bottom) */}
      <div className="flex flex-col items-center">
        <h3 className="mb-2">Time Spent (Full Range)</h3>
        <div
          ref={defaultContainerRef}
          className="max-w-[650px] w-full bg-pink-50 shadow-md rounded p-4"
        />
      </div>
    </div>
  );
};

export default MetaData_info;
