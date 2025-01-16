import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const colorScheme = [
  "#F8766D",
  "#C49A00",
  "#53B400",
  "#00C094",
  "#00B6EB",
  "#A58AFF",
  "#FB61D",
];

function aggregateAttributeData(allResponses, attribute) {
  const counts = {};
  allResponses.forEach((response) => {
    const form6 = response.data?.form6Data;
    if (form6 && form6[attribute] !== undefined) {
      const value = form6[attribute];
      counts[value] = (counts[value] || 0) + 1;
    }
  });
  return counts;
}

function plotPieChart(container, data, title) {
  // Remove any existing SVG to allow re-rendering
  d3.select(container).select("svg").remove();

  // Dimensions
  const width = 320;
  const height = 320;
  const radius = Math.min(width, height) / 2;

  // Prepare color scale
  const color = d3
    .scaleOrdinal()
    .domain(Object.keys(data))
    .range(colorScheme);

  // Create an arc generator
  const arc = d3
    .arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  // Create a pie generator
  const pie = d3
    .pie()
    .value((d) => d.value);

  // Prepare data array
  const dataset = Object.entries(data).map(([key, value]) => ({
    label: key,
    value,
  }));

  // Compute total for percentage calculation
  const total = d3.sum(dataset, (d) => d.value);

  // Create SVG
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + 150) // extra space for legend
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${radius},${radius})`);

  // Create arcs
  const arcs = svg
    .selectAll(".arc")
    .data(pie(dataset))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.label));

  // Title
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", -radius - 10)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .text(title);

  // Legend
  const legend = svg
    .append("g")
    .attr("transform", `translate(${radius + 20},${-radius})`);

  dataset.forEach((d, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendRow
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", color(d.label));

    // Show count and percentage
    const percentage = ((d.value / total) * 100).toFixed(2);
    legendRow
      .append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .text(`${d.label}: ${d.value} (${percentage}%)`);
  });
}

function plotBarChart(container, data, title) {
  // Remove any existing SVG to allow re-rendering
  d3.select(container).select("svg").remove();

  // Prepare data
  const keys = Object.keys(data);
  const values = Object.values(data);
  const total = d3.sum(values);

  // Dimensions
  const margin = { top: 40, right: 20, bottom: 60, left: 50 };
  const width = 440;
  const height = 300;

  // Create SVG
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Scales
  const x = d3
    .scaleBand()
    .domain(keys)
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(values)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const color = d3.scaleOrdinal().domain(keys).range(colorScheme);

  // Bars
  svg
    .append("g")
    .selectAll("rect")
    .data(keys)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d))
    .attr("y", (d) => y(data[d]))
    .attr("width", x.bandwidth())
    .attr("height", (d) => y(0) - y(data[d]))
    .attr("fill", (d) => color(d));

  // Numeric labels above bars (showing percentage)
  svg
    .append("g")
    .selectAll("text.bar-label")
    .data(keys)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", (d) => x(d) + x.bandwidth() / 2)
    .attr("y", (d) => y(data[d]) - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text((d) => {
      const percentage = ((data[d] / total) * 100).toFixed(2);
      return `${percentage}%`;
    });

  // X-axis
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Y-axis
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  // Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .text(title);
}

const Form6Charts = ({ allResponses }) => {
  const attributes = [
    "age",
    "gender",
    "income",
    "car_count",
    "education",
    "occupation",
    "household_size",
    "household_income",
  ];
  const chartsRef = useRef({});

  // Initialize refs for each attribute container
  attributes.forEach((attr) => {
    if (!chartsRef.current[attr]) {
      chartsRef.current[attr] = React.createRef();
    }
  });

  useEffect(() => {
    if (!allResponses || allResponses.length === 0) return;

    attributes.forEach((attribute, index) => {
      const data = aggregateAttributeData(allResponses, attribute);
      const container = chartsRef.current[attribute].current;
      if (!container) return;

      // Alternate between pie and bar: even index -> pie, odd index -> bar
      if (index % 2 === 0) {
        plotPieChart(
          container,
          data,
          `${attribute.charAt(0).toUpperCase() + attribute.slice(1)} (Pie Chart)`
        );
      } else {
        plotBarChart(
          container,
          data,
          `${attribute.charAt(0).toUpperCase() + attribute.slice(1)} (Bar Chart)`
        );
      }
    });
  }, [allResponses]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-serif font-bold text-xl mb-4">Form6 Demographics</h2>
      <div className="grid grid-cols-2 gap-4">
        {attributes.map((attribute) => (
          <div
            key={attribute}
            className="bg-slate-200 rounded-md shadow-lg p-4 w-full flex flex-col items-center"
            style={{ minHeight: "340px" }}
          >
            <div
              ref={chartsRef.current[attribute]}
              className="w-full flex justify-center items-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Form6Charts;
