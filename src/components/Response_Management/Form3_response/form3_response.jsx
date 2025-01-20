import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

/**
 * Plot a 100%-stacked Likert scale chart for form3Data in allResponses.
 */
function plotLikertScale(container, allResponses) {
  // We define the numeric values (1..5)
  const likertValues = ["1", "2", "3", "4", "5"];

  // Provide descriptive labels for each Likert score in the legend
  const likertLegend = [
    { value: "1", label: "Strongly Disagree" },
    { value: "2", label: "Disagree" },
    { value: "3", label: "Neutral" },
    { value: "4", label: "Agree" },
    { value: "5", label: "Strongly Agree" },
  ];

  // Find a sample response that has form3Data to determine which questions are present
  const sample = allResponses.find((r) => r.data?.form3Data);
  if (!sample) return; // no form3Data found

  const questions = Object.keys(sample.data.form3Data);

  // Initialize aggregator
  const aggregated = {};
  questions.forEach((q) => {
    aggregated[q] = {};
    likertValues.forEach((v) => {
      aggregated[q][v] = 0;
    });
  });

  // Count how many respondents selected each value for each question
  allResponses.forEach((response) => {
    const form3 = response.data?.form3Data;
    if (form3) {
      questions.forEach((q) => {
        const val = form3[q];
        if (val && likertValues.includes(val)) {
          aggregated[q][val] += 1;
        }
      });
    }
  });

  // Compute total for each question
  questions.forEach((q) => {
    const total = likertValues.reduce((sum, v) => sum + aggregated[q][v], 0);
    aggregated[q].total = total;
  });

  // Container size & margins
  const containerWidth = container.getBoundingClientRect().width || 800;
  const width = containerWidth;
  const barHeight = 40;
  const margin = {
    top: 70,
    right: 30,
    bottom: 50,
    left: Math.min(containerWidth * 0.3, 250),
  };
  const height = questions.length * barHeight + margin.top + margin.bottom;

  // Remove old chart
  d3.select(container).select("svg").remove();

  // Create responsive SVG
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // X scale for 0..1 => 0..100% (since we want a 100% stacked bar)
  const x = d3.scaleLinear().domain([0, 1]).range([margin.left, width - margin.right]);

  // Y scale for each question
  const y = d3
    .scaleBand()
    .domain(questions)
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  // Color scale (red→green)
  const colorScale = d3
    .scaleOrdinal()
    .domain(likertValues)
    .range(["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#1a9850"]);

  // Legend
  const legendGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top - 40})`);

  legendGroup
    .append("text")
    .attr("x", 0)
    .attr("y", -10)
    .style("font-weight", "bold")
    .style("fill", "#333")
    .text("Likert Scale Legend:");

  likertLegend.forEach((item, i) => {
    const row = legendGroup
      .append("g")
      .attr("transform", `translate(${i * 130},0)`);

    row
      .append("rect")
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", colorScale(item.value));

    row
      .append("text")
      .attr("x", 22)
      .attr("y", 8)
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .text(item.label);
  });

  // For each question, draw a single horizontal bar subdivided by Likert values
  questions.forEach((q) => {
    const total = aggregated[q].total || 1; // avoid /0
    let cumulative = 0; // track the left edge of each sub-bar

    likertValues.forEach((lv) => {
      const count = aggregated[q][lv];
      const proportion = count / total; // fraction for this Likert value
      if (proportion > 0) {
        const xStart = x(cumulative);
        const xEnd = x(cumulative + proportion);

        svg
          .append("rect")
          .attr("y", y(q))
          .attr("x", xStart)
          .attr("width", xEnd - xStart)
          .attr("height", y.bandwidth())
          .attr("fill", colorScale(lv));

        // Label if wide enough
        const segWidth = xEnd - xStart;
        if (segWidth > 30) {
          svg
            .append("text")
            .attr("x", (xStart + xEnd) / 2)
            .attr("y", y(q) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#000")
            .text(`${(proportion * 100).toFixed(1)}%`);
        }
      }
      cumulative += proportion;
    });
  });

  // Y Axis (question labels)
  const yAxis = d3.axisLeft(y).tickSize(0);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .selectAll("text")
    .style("font-size", Math.min(containerWidth * 0.018, 14))
    .style("fill", "#333")
    .call((g) => g.selectAll(".domain, .tick line").remove()); // remove lines

  // X Axis in percentages (0%..100%)
  const xAxis = d3
    .axisBottom(x)
    .tickFormat(d3.format(".0%"))
    .tickValues([0, 0.25, 0.5, 0.75, 1]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .selectAll("text")
    .style("font-size", "12px");

  // Title or X-axis label
  svg
    .append("text")
    .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
    .attr("y", height - margin.bottom / 4)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#333")
    .text("Distribution of Responses (100% stacked)");
}

const Form3_info = ({ allResponses }) => {
  const likertRef = useRef();

  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      plotLikertScale(likertRef.current, allResponses);
    }
  }, [allResponses]);

  return (
    <div className="mb-8 flex flex-col items-center">
      <h3
        className="font-serif font-semibold text-lg mb-4 text-center"
        style={{ fontSize: "clamp(14px, 4vw, 20px)" }}
      >
        Form3 Likert Scale Overview
      </h3>
      <div
        ref={likertRef}
        className="rounded-md shadow-lg w-full bg-slate-200 flex justify-center scale-90 p-4"
        style={{ maxWidth: "100%" }}
      ></div>
    </div>
  );
};

export default Form3_info;
