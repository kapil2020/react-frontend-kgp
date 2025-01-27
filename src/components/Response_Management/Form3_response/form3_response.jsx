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

/* ---------------------------------------
  2) "Strip Plot" of Individual Likert Responses
-----------------------------------------*/
function plotLikertStripPlot(container, allResponses) {
  // 1..5 possible
  // We'll treat them as numeric for plotting.
  // We'll gather an array of { question, value } for each response
  const data = [];
  const sample = allResponses.find((r) => r.data?.form3Data);
  if (!sample) return;
  const questions = Object.keys(sample.data.form3Data);

  allResponses.forEach((resp) => {
    const form3 = resp.data?.form3Data;
    if (!form3) return;

    questions.forEach((q) => {
      const val = parseFloat(form3[q]);
      if (!isNaN(val) && val >= 1 && val <= 5) {
        // Push each individual response
        data.push({ question: q, value: val });
      }
    });
  });

  // Dimensions
  const containerWidth = container.getBoundingClientRect().width || 700;
  const width = containerWidth;
  const margin = { top: 70, right: 30, bottom: 60, left: 200 };
  const height = questions.length * 60 + margin.top + margin.bottom;

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

  // Y scale: each question => a horizontal band
  const y = d3
    .scaleBand()
    .domain(questions)
    .range([margin.top, height - margin.bottom])
    .padding(0.4); // extra padding so dots have space

  // X scale: 1..5 => [ left..right ]
  const x = d3
    .scaleLinear()
    .domain([1, 5])
    .range([margin.left, width - margin.right]);

  // We'll randomly jitter the dots in the vertical direction
  // within each question's band to avoid overlap.
  function jitter(question) {
    // pick a random offset within bandheight/2
    const band = y.bandwidth();
    return y(question) + band / 2 + (Math.random() - 0.5) * (band * 0.8);
  }

  // Color scale from red (1) -> green (5)
  const color = d3.scaleSequential(d3.interpolateRdYlGn).domain([1, 5]);

  // Add dots
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => x(d.value))
    .attr("cy", (d) => jitter(d.question))
    .attr("r", 6)
    .attr("fill", (d) => color(d.value))
    .attr("fill-opacity", 0.8);

  // (Optional) Show a mean or median line for each question
  // ----------
  // 1) Group data by question
  // const grouped = d3.group(data, d => d.question);
  // grouped.forEach((arr, question) => {
  //   const values = arr.map(d => d.value).sort((a,b) => a-b);
  //   // Example: compute median
  //   const mid = Math.floor(values.length / 2);
  //   let median;
  //   if (values.length % 2 === 1) {
  //     median = values[mid];
  //   } else {
  //     median = (values[mid - 1] + values[mid]) / 2;
  //   }
  //   // Draw a small line at x(median), y(question)
  //   svg.append("line")
  //     .attr("x1", x(median))
  //     .attr("x2", x(median))
  //     .attr("y1", y(question) + y.bandwidth()*0.2)
  //     .attr("y2", y(question) + y.bandwidth()*0.8)
  //     .style("stroke", "#333")
  //     .style("stroke-width", 2);
  // });

  // Y-axis
  const yAxis = d3.axisLeft(y).tickSize(0);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "13px");
  svg.selectAll(".domain, .tick line").remove();

  // X-axis
  const xAxis = d3.axisBottom(x).ticks(5).tickFormat(d3.format(".0f"));
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  // X-axis label
  svg
    .append("text")
    .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
    .attr("y", height - margin.bottom + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Likert Scale (1 = Disagree, 5 = Agree)");

  // Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Strip Plot: Individual Likert Responses");
}

/* ---------------------------------------
   Main component with both plots
-----------------------------------------*/
const Form3Comparison = ({ allResponses }) => {
  const stackedRef = useRef();
  const stripRef = useRef();

  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      // 1) Standard 100%-stacked
      plotLikertScaleStacked(stackedRef.current, allResponses);

      // 2) Strip plot for individual responses
      plotLikertStripPlot(stripRef.current, allResponses);
    }
  }, [allResponses]);

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Form3 Likert: Stacked & Strip Plot
      </h2>

      {/* Stacked Chart */}
      <div
        ref={stackedRef}
        style={{
          background: "#f0f0f0",
          padding: "1rem",
          marginBottom: "2rem",
          borderRadius: "5px",
        }}
      />

      {/* Strip Plot */}
      <div
        ref={stripRef}
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
