import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
import MetaData_info from "./MetaData_response/metadata";
import Form1_info from "./Form1_response/form1_response";
import LazyForm1Response from "./Form1_response/LazyForm1Response";

const ResponseCounter = () => {
  const [responses, setResponses] = useState(null);
  const [allresponses, setAllResponses] = useState([]); // Ensure this is an array
  const [error, setError] = useState(null);

  // Metadata counts

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

  useEffect(() => {
    if (allresponses && allresponses.length > 0) {
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

      // Generate Plot using Plot library
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
            <MetaData_info allResponses={allresponses} />
            {/* <Form1_info allResponses={allresponses} /> */}
            <LazyForm1Response allResponses={allresponses} />
          </>
        ) : (
          <p className="w-96 text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ResponseCounter;
