import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";

const ResponseCounter = () => {
  const [responses, setResponses] = useState(null);
  const [allresponses, setAllResponses] = useState([]); // Ensure this is an array
  const [error, setError] = useState(null);
  const [form1_accessmode, setForm1_accessmode] = useState({
    metro: 0,
    bus: 0,
  });
  const [form1_distance, setForm1_distance] = useState(null);
  const [form1_purpose, setForm1_purpose] = useState(null);
  const [form1_travel_mode, setForm1_travel_mode] = useState(null);

  // Metadata counts
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchResponses = async () => {
      try {
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

        // Set the full array of responses
        setAllResponses(jsonData);
        setResponses(jsonData.length); // Set the total number of responses
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    fetchResponses();
  }, []);

  const containerRef = useRef();

  useEffect(() => {
    if (allresponses && allresponses.length > 0) {
      const plotData = allresponses.map((eachResponse) => ({
        seconds: eachResponse.data.metadata.timeTaken.seconds,
        minutes: eachResponse.data.metadata.timeTaken.minutes,
      }));

      const aggregateData = (field) => {
        const count = {};
        allresponses.forEach((response) => {
          const val = response.data.form1Data[field];
          count[val] = (count[val] || 0) + 1;
        });
        return Object.keys(count).map((key) => ({
          label: key,
          value: count[key],
        }));
      };

      const createPiechart = (
        data,
        elementId,
        chartWidth = 200,
        chartHeight = 200
      ) => {
        // Check if the chart already exists
        const existingChart = d3.select(elementId).select("svg");
        if (!existingChart.empty()) return; // Exit if the chart already exists
        const radius = Math.min(chartWidth, chartHeight) / 2;
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const arc = d3
          .arc()
          .outerRadius(radius - 10)
          .innerRadius(0);
        const pie = d3.pie().value((d) => d.value);

        const svg = d3
          .select(elementId)
          .append("svg")
          .attr("width", chartWidth)
          .attr("height", chartHeight);

        const g = svg
          .append("g")
          .attr("transform", `translate(${chartWidth / 2},${chartHeight / 2})`);

        const gData = g
          .selectAll(".arc")
          .data(pie(data))
          .enter()
          .append("g")
          .attr("class", "arc");

        gData
          .append("path")
          .attr("d", arc)
          .style("fill", (d) => color(d.data.label));

        gData
          .append("text")
          .attr("transform", (d) => `translate(${arc.centroid(d)})`)
          .attr("dy", ".35em")
          .text((d) => d.data.label);
      };

      // Create pie charts for different fields
      const distanceData = aggregateData("distance");
      createPiechart(distanceData, "#distance-chart");

      const accessModeData = aggregateData("accessMode");
      createPiechart(accessModeData, "#accessMode-chart");

      const purposeData = aggregateData("purpose");
      createPiechart(purposeData, "#purpose-chart");

      const travelModeData = aggregateData("travelMode");

      createPiechart(travelModeData, "#travel-mode-chart");

      console.log("Plot data:", plotData);

      // Generate Plot using Plot library
      const plot = Plot.plot({
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

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(plot);
      }
    }
  }, [allresponses]);

  return (
    <div className="flex items-center justify-center w-auto bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full text-center m-10">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : responses !== null ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Responses</h1>
            <h3 className="font-semibold text-gray-700">
              Time Spent on Survey:
            </h3>
            <div
              ref={containerRef}
              className="w-auto py-4 flex justify-center mt-4 "
            />
            <div className="mt-4">plots</div>
            <div className="flex mt-20 p-10 justify-between mx-20">
              <div
                id="distance-chart"
                className="scale-150 rounded-lg shadow-lg p-4"
              />
              <div
                id="access-mode-chart"
                className="rounded-lg shadow-lg p-4 scale-150"
              />
              <div
                id="purpose-chart"
                className="rounded-lg shadow-lg p-4 scale-150"
              />
              <div
                id="travel-mode-chart"
                className="rounded-lg shadow-lg p-4 scale-150"
              />
            </div>
          </>
        ) : (
          <p className="w-96 text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ResponseCounter;
