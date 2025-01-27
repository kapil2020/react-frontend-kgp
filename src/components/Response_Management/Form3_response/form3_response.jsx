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
    aggregated[q].total = likertValues.reduce(
      (sum, v) => sum + aggregated[q][v],
      0
    );
  });

  // Sizing
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

  // Draw stacked bars
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
  const xAxis = d3.axisBottom(x).tickFormat(d3.format(".0%")).tickValues([0, 0.25, 0.5, 0.75, 1]);
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
   2) Bar chart for average Likert (1..5)
-----------------------------------------*/
function plotAverageLikertBarChart(container, allResponses) {
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
  const margin = { top: 60, right: 40, bottom: 80, left: 200 };
  const height = data.length * 40 + margin.top + margin.bottom;

  // Clear any existing SVG
  d3.select(container).select("svg").remove();

  // Create SVG
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // Y scale: Each question is a band
  const y = d3
    .scaleBand()
    .domain(data.map((d) => d.question))
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  // X scale: From 0..5 (since Likert average is in [1..5])
  const x = d3.scaleLinear().domain([0, 5]).range([margin.left, width - margin.right]);

  // Color scale from red (1) → green (5)
  const color = d3
    .scaleSequential(d3.interpolateRdYlGn)
    .domain([1, 5]);

  // Bars
  svg
    .append("g")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (d) => y(d.question))
    .attr("x", x(0))
    .attr("width", (d) => x(d.avg) - x(0))
    .attr("height", y.bandwidth())
    .attr("fill", (d) => color(d.avg));

  // Value labels on each bar (optional)
  svg
    .append("g")
    .selectAll("text.avg-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "avg-label")
    .attr("x", (d) => x(d.avg) + 5)
    .attr("y", (d) => y(d.question) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .style("font-size", "12px")
    .text((d) => d.avg.toFixed(2));

  // Y-axis (question labels)
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(0))
    .selectAll("text")
    .style("font-size", "12px");
  svg.selectAll(".domain, .tick line").remove();

  // X-axis
  const xAxis = d3.axisBottom(x).ticks(5).tickFormat(d3.format(".1f"));
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  // X-axis label
  svg
    .append("text")
    .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
    .attr("y", height - 30)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Average Likert Score (1 = Disagree, 5 = Agree)");

  // Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Bar Chart: Average Likert Scores");
}

/* ---------------------------------------
   Main component with both plots
-----------------------------------------*/
const Form3Comparison = ({ allResponses }) => {
  const stackedRef = useRef();
  const avgBarRef = useRef();

  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      // 1) 100%-stacked Likert chart
      plotLikertScaleStacked(stackedRef.current, allResponses);

      // 2) Horizontal bar chart for average Likert
      plotAverageLikertBarChart(avgBarRef.current, allResponses);
    }
  }, [allResponses]);

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Form3 Likert: Stacked & Avg Bar Chart
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

      {/* Average bar chart */}
      <div
        ref={avgBarRef}
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
