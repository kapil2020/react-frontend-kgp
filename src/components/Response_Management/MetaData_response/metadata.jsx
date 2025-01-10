import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";

const MetaData_info = ({ allResponses }) => {
  const containerRef = useRef();

  useEffect(() => {
    let isMount = true;
    let plot;

    async function loadandReanderPlot() {
      if (allResponses && allResponses.length > 0) {
        // Plots data of time taken to complete the survey
        const plotData = allResponses.map((eachres) => ({
          seconds: eachres.data.metadata.timeTaken.seconds,
          minutes: eachres.data.metadata.timeTaken.minutes,
        }));
        console.log("Plot data:", plotData);

        // Plotting the data
        plot = Plot.plot({
          x: {
            label: "Minutes Spent",
            type: "linear",
            tickFormat: (d) => `${d} min`,
          },
          y: {
            label: "Seconds Spent",
            type: "linear",
            tickFormat: (d) => `${d} sec`,
          },
          // margin: { top: 10, right: 10, bottom: 20, left: 30 },
          marks: [
            Plot.ruleX([0]),
            Plot.ruleY([0]),
            Plot.dot(plotData, {
              x: "minutes",
              y: "seconds",
              fill: "blue",
              r: 3,
            }),
          ],
        });

        if (isMount && containerRef.current) {
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(plot);
        }
      }
      // Plot data collected by each numerator named 'eachResponse'
    }

    loadandReanderPlot();

    // cleanup on component unmount
    return () => {
      isMount = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [allResponses]);

  return (
    <div className="flex flex-col items-center ">
      <h3 className="font-semibold text-gray-700">Metadata Information</h3>
      <h2>Time Spent on Survey:</h2>

      <div
        ref={containerRef}
        className="max-w-[550px] mx-8 py-4 flex content-center mt-4 bg-pink-50 shadow-md"
      />
    </div>
  );
};

export default MetaData_info;
