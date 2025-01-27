import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

/* -------------------------------------------
   1) 100%-Stacked Likert Chart
---------------------------------------------*/
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
  const x = d3
    .scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right]);

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

/* -------------------------------------------
   2) Likert Response Heatmap
---------------------------------------------*/
function plotLikertHeatmap(container, allResponses) {
  // Instead of "Likert 1..5" text, we'll have "1: Strongly Disagree," etc.
  const ratingLabels = {
    "1": "1: Strongly Disagree",
    "2": "2: Disagree",
    "3": "3: Neutral",
    "4": "4: Agree",
    "5": "5: Strongly Agree",
  };

  // We'll still treat the domain as ["1","2","3","4","5"]
  const likertValues = Object.keys(ratingLabels);

  // Find a sample to identify questions
  const sample = allResponses.find((r) => r.data?.form3Data);
  if (!sample) return;

  const questions = Object.keys(sample.data.form3Data);

  // 1) Aggregate counts
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

  // 2) Convert to proportions & build a matrix
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

  // 3) Dimensions
  const containerWidth = container.getBoundingClientRect().width || 700;
  const width = containerWidth;
  const margin = { top: 80, right: 40, bottom: 60, left: 200 };
  const cellSize = 40; // height for each row
  const height = questions.length * cellSize + margin.top + margin.bottom;

  // Clear any existing
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
  const x = d3
    .scaleBand()
    .domain(likertValues) // "1","2","3","4","5"
    .range([margin.left, width - margin.right])
    .padding(0.05);

  const y = d3
    .scaleBand()
    .domain(questions)
    .range([margin.top, height - margin.bottom])
    .padding(0.05);

  // Color scale
  const colorScale = d3
    .scaleSequential(d3.interpolateBlues)
    .domain([0, maxProp]);

  // 6) Draw cells
  matrix.forEach((row) => {
    row.forEach((cell) => {
      svg
        .append("rect")
        .attr("x", x(cell.rating))
        .attr("y", y(cell.question))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("fill", colorScale(cell.proportion));

      if (cell.proportion > 0) {
        svg
          .append("text")
          .attr("x", x(cell.rating) + x.bandwidth() / 2)
          .attr("y", y(cell.question) + y.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .style("font-size", "12px")
          // Switch text color if background is too dark
          .style("fill", cell.proportion < 0.5 * maxProp ? "#000" : "#fff")
          .text(`${(cell.proportion * 100).toFixed(1)}%`);
      }
    });
  });

  // 7) Axes
  // Top axis with custom tick labels from ratingLabels dictionary
  const xAxis = d3
    .axisTop(x)
    .tickFormat((d) => ratingLabels[d]); // <-- use the dictionary

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
  const legendWidth = 200;
  const legendHeight = 10;
  const legendX = (width - legendWidth) / 2;
  const legendY = height - margin.bottom + 30;

  const legendScale = d3
    .scaleLinear()
    .domain([0, maxProp])
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

  const numStops = 10;
  d3.range(numStops + 1).forEach((i) => {
    const t = i / numStops;
    const val = t * maxProp; // from 0..maxProp
    gradient
      .append("stop")
      .attr("offset", `${t * 100}%`)
      .attr("stop-color", colorScale(val));
  });

  svg
    .append("rect")
    .attr("x", legendX)
    .attr("y", legendY)
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", `url(#${gradientId})`);

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

  // Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Likert Response Heatmap (Percentage)");
}

/* -------------------------------------------
   Main component: show both charts
---------------------------------------------*/
const Form3ComparisonBoth = ({ allResponses }) => {
  const stackedRef = useRef(null);
  const heatmapRef = useRef(null);

  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      // (A) 100%-Stacked Chart
      plotLikertScaleStacked(stackedRef.current, allResponses);

      // (B) Heatmap with custom x-axis labels
      plotLikertHeatmap(heatmapRef.current, allResponses);
    }
  }, [allResponses]);

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Form3 Likert: Stacked + Heatmap
      </h2>

      {/* Chart A: 100%-Stacked Likert */}
      <div
        ref={stackedRef}
        style={{
          background: "#f0f0f0",
          padding: "1rem",
          marginBottom: "2rem",
          borderRadius: "5px",
        }}
      />

      {/* Chart B: Heatmap */}
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

export default Form3ComparisonBoth;
