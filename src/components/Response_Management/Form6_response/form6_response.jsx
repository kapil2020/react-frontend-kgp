import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// Updated "Dark2"-like color palette
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
 * A dictionary mapping each attribute to a more descriptive title.
 * Feel free to rename or add more text.
 */
const attributeLabels = {
  age: "Age",
  gender: "Gender",
  income: "Monthly Income",
  car_count: "Car Count",
  education: "Education Level",
  occupation: "Occupation",
  household_size: "Household Size",
  household_income: "Household Income",
};

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
 * Utility function to wrap text onto multiple lines if it's too long.
 * (Optional usage below)
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
 * Plots a Pie Chart with bigger margins, centered title,
 * and legend to the right.
 */
function plotPieChart(container, data, title) {
  d3.select(container).select("svg").remove();

  // Dimensions
  const width = 360;
  const height = 360;
  const margin = 20;
  const radius = Math.min(width, height) / 2 - margin;

  // Create SVG and allow overflow to ensure labels aren't clipped
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + 180) // extra space for legend
    .attr("height", height + 60) // extra space for top title
    .style("overflow", "visible")
    .append("g")
    .attr("transform", `translate(${(width + 180) / 2}, ${(height + 60) / 2})`);

  // Color scale
  const color = d3.scaleOrdinal().domain(Object.keys(data)).range(colorScheme);

  // Convert data object -> array
  const dataset = Object.entries(data).map(([key, value]) => ({
    label: key,
    value,
  }));
  const total = d3.sum(dataset, (d) => d.value);

  // Pie / Arc generators
  const pie = d3
    .pie()
    .value((d) => d.value)
    .sort(null);
  const arc = d3.arc().outerRadius(radius).innerRadius(0);

  // Title (above the chart)
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", -(height / 2))
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-size", "16px")
    .text(title);

  // Draw arcs
  svg
    .selectAll(".arc")
    .data(pie(dataset))
    .enter()
    .append("path")
    .attr("class", "arc")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.label))
    .style("stroke", "#fff")
    .style("stroke-width", "1px");

  // Legend (on the right side)
  const legend = svg
    .append("g")
    .attr("transform", `translate(${radius + 40}, ${-radius})`);

  dataset.forEach((d, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 24})`);

    legendRow
      .append("rect")
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", color(d.label));

    legendRow
      .append("text")
      .attr("x", 24)
      .attr("y", 8)
      .attr("dy", "0.35em")
      .style("font-size", "13px")
      .text(() => {
        const percentage = ((d.value / total) * 100).toFixed(1);
        return `${d.label}: ${percentage}%`;
      });
  });
}

/**
 * Plots a Bar Chart with bigger margins and visible overflow
 * to prevent label clipping.
 */
function plotBarChart(container, data, title) {
  d3.select(container).select("svg").remove();

  const keys = Object.keys(data);
  const values = Object.values(data);
  const total = d3.sum(values);

  // Large margins to avoid clipping
  const margin = { top: 80, right: 60, bottom: 120, left: 90 };
  const width = 700;
  const height = 500;

  // Create SVG with overflow visible
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("overflow", "visible");

  // Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-size", "16px")
    .text(title);

  // X scale
  const x = d3
    .scaleBand()
    .domain(keys)
    .range([margin.left, width - margin.right])
    .padding(0.2);

  // Y scale
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(values) || 0])
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

  // Percentage labels above each bar
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
      return `${percentage}%`;
    });

  // X-axis
  const xAxis = d3.axisBottom(x).tickSizeOuter(0);

  const xAxisGroup = svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  // Slight rotation to prevent overlap
  xAxisGroup
    .selectAll("text")
    .attr("transform", "rotate(-35) translate(-5, -5)")
    .style("text-anchor", "end");

  // (Optional) If your text is long, you could wrap it:
  // xAxisGroup.selectAll(".tick text").call(wrap, x.bandwidth());

  // Y-axis
  const yAxis = d3.axisLeft(y).ticks(6);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  // Y-axis label
  svg
    .append("text")
    .attr("x", -(height / 2))
    .attr("y", margin.left / 3)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Count of Responses");
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

    // For each attribute, gather data and decide which chart to draw
    attributes.forEach((attribute, index) => {
      const data = aggregateAttributeData(allResponses, attribute);
      const container = chartsRef.current[attribute].current;
      if (!container) return;

      // Lookup descriptive label from our dictionary
      const attrLabel = attributeLabels[attribute] || attribute;

      // Even index -> Pie Chart, Odd index -> Bar Chart
      if (index % 2 === 0) {
        plotPieChart(container, data, attrLabel);
      } else {
        plotBarChart(container, data, attrLabel);
      }
    });
  }, [allResponses]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-serif font-bold text-2xl mb-4">Form6 Demographics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attributes.map((attribute) => (
          <div
            key={attribute}
            className="bg-slate-100 rounded-md shadow-md p-4 w-full flex flex-col items-center"
            style={{ minHeight: "520px" }} // Adjust if needed
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
