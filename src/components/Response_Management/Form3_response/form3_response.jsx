import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

/* ---------------------------------------
   1) Standard 100%-stacked Likert chart
-----------------------------------------*/
function plotLikertScaleStacked(container, allResponses) {
  // Likert values 1..5
  const likertValues = ["1", "2", "3", "4", "5"];

  // Find a sample response to see which questions exist
  const sample = allResponses.find((r) => r.data?.form3Data);
  if (!sample) return;
  const questions = Object.keys(sample.data.form3Data);

  // Aggregate: for each question, how many times 1..5
  const aggregated = {};
  questions.forEach((q) => {
    aggregated[q] = {};
    likertValues.forEach((v) => {
      aggregated[q][v] = 0;
    });
  });

  // Fill aggregator
  allResponses.forEach((resp) => {
    const form3 = resp.data?.form3Data;
    if (!form3) return;
    questions.forEach((q) => {
      const val = form3[q];
      if (val && likertValues.includes(val)) {
        aggregated[q][val] += 1;
      }
    });
  });

  // Compute total for each question
  questions.forEach((q) => {
    aggregated[q].total = likertValues.reduce((sum, v) => sum + aggregated[q][v], 0);
  });

  // Sizing
  const containerWidth = container.getBoundingClientRect().width || 800;
  const width = containerWidth;
  const barHeight = 40;
  const margin = { top: 70, right: 30, bottom: 50, left: Math.min(containerWidth * 0.3, 250) };
  const height = questions.length * barHeight + margin.top + margin.bottom;

  // Clear old
  d3.select(container).select("svg").remove();

  // Create SVG
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // X scale: 0..1 => 0..100%
  const x = d3.scaleLinear().domain([0, 1]).range([margin.left, width - margin.right]);

  // Y scale: each question is a row
  const y = d3
    .scaleBand()
    .domain(questions)
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  // Color scale (red→green) for Likert 1..5
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

  const legendLabels = [
    "1: Strongly Disagree",
    "2: Disagree",
    "3: Neutral",
    "4: Agree",
    "5: Strongly Agree",
  ];
  legendLabels.forEach((lbl, i) => {
    const row = legendGroup.append("g").attr("transform", `translate(${i * 130},0)`);
    row
      .append("rect")
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", colorScale((i + 1).toString()));
    row
      .append("text")
      .attr("x", 22)
      .attr("y", 8)
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .text(lbl);
  });

  // Draw bars
  questions.forEach((q) => {
    const total = aggregated[q].total || 1;
    let cumulative = 0;
    likertValues.forEach((v) => {
      const count = aggregated[q][v];
      const proportion = count / total;
      if (proportion > 0) {
        const xStart = x(cumulative);
        const xEnd = x(cumulative + proportion);

        svg
          .append("rect")
          .attr("y", y(q))
          .attr("x", xStart)
          .attr("width", xEnd - xStart)
          .attr("height", y.bandwidth())
          .attr("fill", colorScale(v));

        // Label if wide enough
        if (xEnd - xStart > 30) {
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

  // Y-axis: question text
  const yAxis = d3.axisLeft(y).tickSize(0);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "12px")
    .style("fill", "#333");
  svg.selectAll(".domain, .tick line").remove();

  // X-axis: 0..100%
  const xAxis = d3
    .axisBottom(x)
    .tickFormat(d3.format(".0%"))
    .tickValues([0, 0.25, 0.5, 0.75, 1]);
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  // X-axis label
  svg
    .append("text")
    .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
    .attr("y", height - margin.bottom / 4)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#333")
    .text("% of count");
}

/* ---------------------------------------
   2) Radar chart for average Likert
-----------------------------------------*/
function plotRadarLikert(container, allResponses) {
  // Find the question set
  const sample = allResponses.find((r) => r.data?.form3Data);
  if (!sample) return;
  const questions = Object.keys(sample.data.form3Data);

  // For each question, sum numeric values 1..5, and count
  const sums = {};
  questions.forEach((q) => {
    sums[q] = { totalScore: 0, count: 0 };
  });

  allResponses.forEach((resp) => {
    const form3 = resp.data?.form3Data;
    if (!form3) return;
    questions.forEach((q) => {
      const val = parseFloat(form3[q]);
      if (!isNaN(val) && val >= 1 && val <= 5) {
        sums[q].totalScore += val;
        sums[q].count += 1;
      }
    });
  });

  // Build array: {question, avg}
  const data = questions.map((q) => {
    const { totalScore, count } = sums[q];
    const avg = count > 0 ? totalScore / count : 0;
    return { question: q, avg };
  });

  // Dimensions
  const containerWidth = container.getBoundingClientRect().width || 600;
  const width = containerWidth;
  const height = Math.min(600, containerWidth);
  const margin = 50;
  const radius = Math.min(width, height) / 2 - margin;

  d3.select(container).select("svg").remove();

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const centerX = width / 2;
  const centerY = height / 2;

  // Scale from 0..5 => radial 0..radius
  const radialScale = d3.scaleLinear().domain([0, 5]).range([0, radius]);
  const angleSlice = (2 * Math.PI) / questions.length; // each question's angle

  // Draw background circles for scores 1..5
  const levels = d3.range(1, 6);
  svg
    .selectAll(".levels")
    .data(levels)
    .enter()
    .append("circle")
    .attr("cx", centerX)
    .attr("cy", centerY)
    .attr("r", (d) => radialScale(d))
    .style("fill", "#ccc")
    .style("fill-opacity", 0.1)
    .style("stroke", "#999")
    .style("stroke-dasharray", "2,2");

  // Label each ring
  svg
    .selectAll(".level-label")
    .data(levels)
    .enter()
    .append("text")
    .attr("x", centerX)
    .attr("y", (d) => centerY - radialScale(d))
    .attr("dy", "-0.3em")
    .style("font-size", "12px")
    .style("fill", "#666")
    .attr("text-anchor", "middle")
    .text((d) => d);

  // Axes for each question
  questions.forEach((q, i) => {
    const angle = i * angleSlice - Math.PI / 2;
    // End of axis
    const xEnd = centerX + radialScale(5) * Math.cos(angle);
    const yEnd = centerY + radialScale(5) * Math.sin(angle);

    // Axis line
    svg
      .append("line")
      .attr("x1", centerX)
      .attr("y1", centerY)
      .attr("x2", xEnd)
      .attr("y2", yEnd)
      .style("stroke", "#999")
      .style("stroke-width", 1);

    // Question label
    const labelOffset = 15;
    const lx = centerX + (radialScale(5) + labelOffset) * Math.cos(angle);
    const ly = centerY + (radialScale(5) + labelOffset) * Math.sin(angle);
    svg
      .append("text")
      .attr("x", lx)
      .attr("y", ly)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#333")
      .text(q);
  });

  // Build polygon
  const points = data.map((d, i) => {
    const angle = i * angleSlice - Math.PI / 2;
    const r = radialScale(d.avg);
    const xPos = centerX + r * Math.cos(angle);
    const yPos = centerY + r * Math.sin(angle);
    return [xPos, yPos];
  });

  // Draw polygon
  svg
    .append("polygon")
    .attr("points", points.map((p) => p.join(",")).join(" "))
    .style("fill", "#1a9850")
    .style("fill-opacity", 0.2)
    .style("stroke", "#1a9850")
    .style("stroke-width", 2);

  // Circles for each data point
  svg
    .selectAll(".radar-circle")
    .data(points)
    .enter()
    .append("circle")
    .attr("class", "radar-circle")
    .attr("cx", (d) => d[0])
    .attr("cy", (d) => d[1])
    .attr("r", 4)
    .style("fill", "#1a9850");

  // Title
  svg
    .append("text")
    .attr("x", centerX)
    .attr("y", margin / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Radar Chart: Average Likert Scores");
}

/* ---------------------------------------
   Main component with both plots
-----------------------------------------*/
const Form3Comparison = ({ allResponses }) => {
  const stackedRef = useRef();
  const radarRef = useRef();

  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      // 1) standard 100%-stacked
      plotLikertScaleStacked(stackedRef.current, allResponses);

      // 2) radar chart (average Likert)
      plotRadarLikert(radarRef.current, allResponses);
    }
  }, [allResponses]);

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Form3 Likert: Stacked & Radar
      </h2>

      {/* Stacked chart */}
      <div
        ref={stackedRef}
        style={{
          background: "#f0f0f0",
          padding: "1rem",
          marginBottom: "2rem",
          borderRadius: "5px",
        }}
      />

      {/* Radar chart */}
      <div
        ref={radarRef}
        style={{
          background: "#f0f0f0",
          padding: "1rem",
          borderRadius: "5px",
        }}
      />
    </div>
  );
};

export default Form3Comparison;
