import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// Updated color scheme (ggplot-like / "Dark2"-inspired)
const colorScheme = [
  "#1B9E77",
  "#D95F02",
  "#7570B3",
  "#E7298A",
  "#66A61E",
  "#E6AB02",
  "#A6761D",
  "#666666",
];

/**
 * Aggregates data by the specified attribute from form6Data.
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
 * Uncomment in plotBarChart if you want text wrapping on x-axis ticks.
 */
function wrap(text, width) {
  text.each(function () {
    const textEl = d3.select(this),
      words = textEl.text().split(/\s+/).reverse();
    let line = [],
      lineNumber = 0,
      lineHeight = 1.1, // em
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
 * Plots a Pie Chart with:
 *  - New color palette
 *  - Legend showing both count and percentage
 *  - Slightly bigger radius for clarity
 */
function plotPieChart(container, data, title) {
  d3.select(container).select("svg").remove();

  // Dimensions
  const width = 340;
  const height = 340;
  const radius = Math.min(width, height) / 2;

  // Prepare color scale
  const color = d3.scaleOrdinal().domain(Object.keys(data)).range(colorScheme);

  // Create arc & pie
  const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);

  const pie = d3
    .pie()
    .value((d) => d.value)
    .sort(null); // keep order stable

  // Convert data object -> array
  const dataset = Object.entries(data).map(([key, value]) => ({
    label: key,
    value,
  }));

  // Calculate total for percentages
  const total = d3.sum(dataset, (d) => d.value);

  // Create SVG
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + 180) // extra space for legend
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${radius}, ${radius})`);

  // Title
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", -radius - 15)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-size", "14px")
    .text(title);

  // Draw arcs
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

  // Legend (to the right)
  const legend = svg
    .append("g")
    .attr("transform", `translate(${radius + 20},${-radius + 10})`);

  dataset.forEach((d, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendRow
      .append("rect")
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", color(d.label));

    const percentage = ((d.value / total) * 100).toFixed(1);
    // Show count & percentage
    legendRow
      .append("text")
      .attr("x", 24)
      .attr("y", 8)
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .text(`${d.label}: ${d.value} (${percentage}%)`);
  });
}

/**
 * Plots a Bar Chart with:
 *  - Updated color palette
 *  - Larger margin
 *  - Percentage label above each bar, also showing count
 */
function plotBarChart(container, data, title) {
  d3.select(container).select("svg").remove();

  const keys = Object.keys(data);
  const values = Object.values(data);
  const total = d3.sum(values);

  // Larger margins for better label spacing
  const margin = { top: 60, right: 40, bottom: 100, left: 70 };
  const width = 640;
  const height = 420;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // x scale
  const x = d3
    .scaleBand()
    .domain(keys)
    .range([margin.left, width - margin.right])
    .padding(0.1);

  // y scale
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

  // Labels above bars: "xx% (count: X)"
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
      const percentage = ((data[d] / total) * 100).toFixed(1);
      return `${percentage}% (count: ${data[d]})`;
    });

  // X-axis
  const xAxis = d3
    .axisBottom(x)
    .tickSizeOuter(0);

  const xAxisGroup = svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  xAxisGroup
    .selectAll("text")
    .attr("transform", "rotate(-60) translate(-5, -5)")
    .style("text-anchor", "end");

  // Uncomment to wrap if needed
  // xAxisGroup.selectAll(".tick text").call(wrap, x.bandwidth());

  // Y-axis
  const yAxis = d3.axisLeft(y).ticks(6);
  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis);

  // Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-size", "15px")
    .text(title);
}

const Form6Charts = ({ allResponses }) => {
  // The form6 attributes we want to visualize
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

  // Create a ref for each attribute
  const chartsRef = useRef({});
  attributes.forEach((attr) => {
    if (!chartsRef.current[attr]) {
      chartsRef.current[attr] = React.createRef();
    }
  });

  useEffect(() => {
    if (!allResponses || allResponses.length === 0) return;

    // For each attribute, gather data and plot
    attributes.forEach((attribute, index) => {
      const data = aggregateAttributeData(allResponses, attribute);
      const container = chartsRef.current[attribute].current;
      if (!container) return;

      // Even index -> Pie Chart, Odd index -> Bar Chart
      const attrLabel = attribute.charAt(0).toUpperCase() + attribute.slice(1);
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
            style={{ minHeight: "360px" }}
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
