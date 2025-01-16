import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// Update these colors to match your preferences or brand
const colorScheme = [
  "#F8766D",
  "#C49A00",
  "#53B400",
  "#00C094",
  "#00B6EB",
  "#A58AFF",
  "#FB61D",
];

/**
 * Aggregates data by the specified attribute.
 */
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

/**
 * A utility function to wrap text onto multiple lines if it's too long.
 * Feel free to uncomment its usage where indicated below if you want text wrapping.
 */
function wrap(text, width) {
  text.each(function () {
    const textEl = d3.select(this),
      words = textEl.text().split(/\s+/).reverse();
    let line = [],
      lineNumber = 0,
      lineHeight = 1.1, // em units
      x = textEl.attr("x"),
      y = textEl.attr("y"),
      dy = parseFloat(textEl.attr("dy") || 0);

    let tspan = textEl
      .text(null)
      .append("tspan")
      .attr("x", x)
      .attr("y", y)
      .attr("dy", dy + "em");

    let word;
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = textEl
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}

/**
 * Plots a Pie Chart with percentage labels in the legend.
 */
function plotPieChart(container, data, title) {
  // Remove any existing SVG in the container
  d3.select(container).select("svg").remove();

  // Dimensions
  const width = 320;
  const height = 320;
  const radius = Math.min(width, height) / 2;

  // Prepare color scale
  const color = d3.scaleOrdinal().domain(Object.keys(data)).range(colorScheme);

  // Create arc & pie generators
  const arc = d3
    .arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  const pie = d3
    .pie()
    .value((d) => d.value);

  // Prepare data as an array of objects
  const dataset = Object.entries(data).map(([key, value]) => ({
    label: key,
    value,
  }));

  // Total used for percentage calculation
  const total = d3.sum(dataset, (d) => d.value);

  // Create SVG
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + 150) // extra space for legend
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${radius}, ${radius})`);

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
    .attr("transform", `translate(${radius + 20},${-radius + 10})`);

  dataset.forEach((d, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendRow
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", color(d.label));

    // Show count and percentage in the legend text
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

/**
 * Plots a Bar Chart with percentage labels above each bar.
 */
function plotBarChart(container, data, title) {
  // Remove existing SVG
  d3.select(container).select("svg").remove();

  const keys = Object.keys(data);
  const values = Object.values(data);
  const total = d3.sum(values);

  // Larger margins to prevent overlap
  const margin = { top: 60, right: 40, bottom: 100, left: 60 };
  const width = 600;
  const height = 400;

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

  // Bar labels (showing % above bars)
  svg
    .append("g")
    .selectAll("text.bar-label")
    .data(keys)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", (d) => x(d) + x.bandwidth() / 2)
    .attr("y", (d) => y(data[d]) - 8)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text((d) => {
      const percentage = ((data[d] / total) * 100).toFixed(2);
      return `${percentage}%`;
    });

  // X-axis with rotated labels
  const xAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  xAxis
    .selectAll("text")
    .attr("transform", "rotate(-60) translate(-5, -5)")
    .style("text-anchor", "end");

  // If rotation is not enough or you have extremely long labels, 
  // you can wrap them (uncomment the line below).
  // xAxis.selectAll(".tick text").call(wrap, x.bandwidth());

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

/**
 * Main component that displays a grid of charts
 * (pie or bar depending on the attribute index).
 */
const Form6Charts = ({ allResponses }) => {
  // List of attributes
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

  // Create a ref for each attribute's container
  const chartsRef = useRef({});
  attributes.forEach((attr) => {
    if (!chartsRef.current[attr]) {
      chartsRef.current[attr] = React.createRef();
    }
  });

  useEffect(() => {
    if (!allResponses || allResponses.length === 0) return;

    // For each attribute, gather data and render chart
    attributes.forEach((attribute, index) => {
      const data = aggregateAttributeData(allResponses, attribute);
      const container = chartsRef.current[attribute].current;
      if (!container) return;

      // Even index -> Pie Chart, Odd index -> Bar Chart
      const attrLabel =
        attribute.charAt(0).toUpperCase() + attribute.slice(1);
      if (index % 2 === 0) {
        plotPieChart(container, data, `${attrLabel} (Pie Chart)`);
      } else {
        plotBarChart(container, data, `${attrLabel} (Bar Chart)`);
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
            {/* Container for the chart */}
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
