import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

/**
 * Plots a heatmap of Likert frequencies (1..5) by question.
 * Each cell shows the percentage of responses that chose that rating.
 */
function plotLikertHeatmap(container, allResponses) {
  // 1..5 Likert values
  const likertValues = ["1", "2", "3", "4", "5"];

  // Find a sample response to identify the question set
  const sample = allResponses.find((r) => r.data?.form3Data);
  if (!sample) return;

  const questions = Object.keys(sample.data.form3Data);

  // 1) Aggregate counts
  // aggregated[question][likertValue] = count
  // plus aggregated[question].total
  const aggregated = {};
  questions.forEach((q) => {
    aggregated[q] = { total: 0 };
    likertValues.forEach((v) => {
      aggregated[q][v] = 0;
    });
  });

  allResponses.forEach((resp) => {
    const form3 = resp.data?.form3Data;
    if (!form3) return;
    questions.forEach((q) => {
      const val = form3[q];
      if (likertValues.includes(val)) {
        aggregated[q][val]++;
        aggregated[q].total++;
      }
    });
  });

  // 2) Convert to proportion: 0..1
  // We'll store them in a 2D array-like structure for easy plotting
  // Also track the maximum proportion in case you want a narrower color domain
  let maxProp = 0;
  const matrix = [];
  questions.forEach((q) => {
    const rowData = [];
    const total = aggregated[q].total || 1;
    likertValues.forEach((v) => {
      const count = aggregated[q][v];
      const prop = count / total;
      rowData.push({
        question: q,
        rating: v,
        proportion: prop,
      });
      if (prop > maxProp) maxProp = prop;
    });
    matrix.push(rowData);
  });

  // 3) Setup chart dimensions
  const containerWidth = container.getBoundingClientRect().width || 700;
  const width = containerWidth;
  const margin = { top: 80, right: 40, bottom: 60, left: 200 };
  const cellSize = 40; // Height of each row
  const height = questions.length * cellSize + margin.top + margin.bottom;

  d3.select(container).select("svg").remove();

  // 4) Create SVG
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // 5) Scales
  // X: each Likert rating is a band
  const x = d3
    .scaleBand()
    .domain(likertValues)
    .range([margin.left, width - margin.right])
    .padding(0.05);

  // Y: each question is a band
  const y = d3
    .scaleBand()
    .domain(questions)
    .range([margin.top, height - margin.bottom])
    .padding(0.05);

  // Color scale for proportion 0..1 (up to maxProp, but usually that is 1 if a single question had only one rating)
  // You can also use smaller domain if you don't want the darkest color to be 100%.
  const colorScale = d3
    .scaleSequential(d3.interpolateBlues)
    .domain([0, maxProp]); // or use [0, 1] for full range

  // 6) Draw cells
  // matrix is an array of rows, each is an array of {question, rating, proportion}
  matrix.forEach((row) => {
    row.forEach((cell) => {
      svg
        .append("rect")
        .attr("x", x(cell.rating))
        .attr("y", y(cell.question))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("fill", colorScale(cell.proportion));

      // Optional label with percentage if you like
      // We'll only display if proportion > 0
      if (cell.proportion > 0) {
        svg
          .append("text")
          .attr("x", x(cell.rating) + x.bandwidth() / 2)
          .attr("y", y(cell.question) + y.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .style("font-size", "12px")
          .style("fill", cell.proportion < 0.5 * maxProp ? "#000" : "#fff")
          .text(`${(cell.proportion * 100).toFixed(1)}%`);
      }
    });
  });

  // 7) Axes
  // Top axis for rating labels or bottom axis
  const xAxis = d3.axisTop(x).tickFormat((d) => `Likert ${d}`);
  svg
    .append("g")
    .attr("transform", `translate(0, ${margin.top - 5})`)
    .call(xAxis)
    .selectAll("text")
    .style("font-size", "12px");

  // Y-axis for questions
  const yAxis = d3.axisLeft(y).tickSize(0);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "12px");

  svg.selectAll(".domain, .tick line").remove();

  // 8) Color Legend
  // We'll place a small gradient scale at the bottom
  const legendWidth = 200;
  const legendHeight = 10;
  const legendX = (width - legendWidth) / 2;
  const legendY = height - margin.bottom + 30;

  const legendScale = d3
    .scaleLinear()
    .domain(colorScale.domain())
    .range([0, legendWidth]);

  const defs = svg.append("defs");
  const gradientId = "heatmap-gradient";

  const gradient = defs
    .append("linearGradient")
    .attr("id", gradientId)
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

  // Create color stops from 0..100% in 10 steps or so
  const numStops = 10;
  d3.range(numStops + 1).forEach((i) => {
    const t = i / numStops;
    const val = colorScale.domain()[0] + t * (colorScale.domain()[1] - colorScale.domain()[0]);
    gradient
      .append("stop")
      .attr("offset", `${t * 100}%`)
      .attr("stop-color", colorScale(val));
  });

  // Draw the legend rect
  svg
    .append("rect")
    .attr("x", legendX)
    .attr("y", legendY)
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", `url(#${gradientId})`);

  // Legend axis (0..maxProp)
  const legendAxis = d3
    .axisBottom(legendScale)
    .ticks(5)
    .tickFormat((d) => `${Math.round(d * 100)}%`);

  svg
    .append("g")
    .attr("transform", `translate(${legendX}, ${legendY + legendHeight})`)
    .call(legendAxis)
    .selectAll("text")
    .style("font-size", "10px");

  // 9) Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Likert Response Heatmap (Percentage)");
}

const Form3ComparisonHeatmap = ({ allResponses }) => {
  const heatmapRef = useRef();

  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      // Render the heatmap
      plotLikertHeatmap(heatmapRef.current, allResponses);
    }
  }, [allResponses]);

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Form3 Likert Heatmap
      </h2>
      <div
        ref={heatmapRef}
        style={{
          background: "#f0f0f0",
          padding: "1rem",
          borderRadius: "5px",
        }}
      />
    </div>
  );
};

export default Form3ComparisonHeatmap;
