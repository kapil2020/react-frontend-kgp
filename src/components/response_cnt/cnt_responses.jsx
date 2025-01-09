import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as Plot from "@observablehq/plot";

const ResponseCounter = () => {
  const [responses, setResponses] = useState(null);
  const [allresponses, setAllResponses] = useState([]);
  const [error, setError] = useState(null);
  const [form1_accessmode, setForm1_accessmode] = useState({
    metro: 0,
    bus: 0,
  });
  const [form1_distance, setForm1_distance] = useState(null);
  const [form1_purpose, setForm1_purpose] = useState(null);
  const [form1_travel_mode, setForm1_travel_mode] = useState(null);
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
        setAllResponses(jsonData);
        setResponses(jsonData.length);
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
        chartWidth = 300,
        chartHeight = 300
      ) => {
        const existingChart = d3.select(elementId).select("svg");
        if (!existingChart.empty()) return;

        const radius = Math.min(chartWidth, chartHeight) / 2;
        const color = d3.scaleOrdinal()
          .domain(data.map(d => d.label))
          .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]);

        const arc = d3.arc()
          .outerRadius(radius - 10)
          .innerRadius(0);

        const pie = d3.pie().value(d => d.value);

        const svg = d3.select(elementId)
          .append("svg")
          .attr("width", chartWidth)
          .attr("height", chartHeight);

        const g = svg.append("g")
          .attr("transform", `translate(${chartWidth / 2},${chartHeight / 2})`);

        const gData = g.selectAll(".arc")
          .data(pie(data))
          .enter()
          .append("g")
          .attr("class", "arc");

        gData.append("path")
          .attr("d", arc)
          .style("fill", d => color(d.data.label));

        gData.append("text")
          .attr("transform", d => `translate(${arc.centroid(d)})`)
          .attr("dy", ".35em")
          .text(d => d.data.label);

        // Add legend
        const legend = svg.append("g")
          .attr("transform", `translate(${chartWidth - 100}, 20)`);

        data.forEach((d, i) => {
          legend.append("rect")
            .attr("y", i * 20)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color(d.label));

          legend.append("text")
            .attr("x", 24)
            .attr("y", i * 20 + 14)
            .text(d.label);
        });
      };

      const distanceData = aggregateData("distance");
      createPiechart(distanceData, "#distance-chart");

      const accessModeData = aggregateData("accessMode");
      createPiechart(accessModeData, "#access-mode-chart");

      const purposeData = aggregateData("purpose");
      createPiechart(purposeData, "#purpose-chart");

      const travelModeData = aggregateData("travelMode");
      createPiechart(travelModeData, "#travel-mode-chart");

      const plot = Plot.plot({
        x: {
          label: "Minutes Spent",
          type: "linear",
          tickFormat: d => `${d} min`,
        },
        y: {
          label: "Seconds Spent",
          type: "linear",
          tickFormat: d => `${d} sec`,
        },
        marks: [
          Plot.ruleX([0]),
          Plot.ruleY([0]),
          Plot.dot(plotData, {
            x: "minutes",
            y: "seconds",
            fill: "steelblue",
            r: 5,
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
              className="w-auto py-4 flex justify-center mt-4"
            />
            <div className="mt-4">plots</div>
            <div className="flex mt-20 p-10 justify-between mx-20">
              <div
                id="distance-chart"
                className="chart-container rounded-lg shadow-lg p-4"
              />
              <div
                id="access-mode-chart"
                className="chart-container rounded-lg shadow-lg p-4"
              />
              <div
                id="purpose-chart"
                className="chart-container rounded-lg shadow-lg p-4"
              />
              <div
                id="travel-mode-chart"
                className="chart-container rounded-lg shadow-lg p-4"
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
