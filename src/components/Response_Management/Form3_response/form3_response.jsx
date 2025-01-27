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
   2) Diverging Likert Chart
-----------------------------------------*/
function plotDivergingLikertChart(container, allResponses) {
  // We treat Likert "1" & "2" as negative, "3" as neutral, "4" & "5" as positive.
  const likertValues = ["1", "2", "3", "4", "5"];
  const sample = allResponses.find((r) => r.data?.form3Data);
  if (!sample) return;
  const questions = Object.keys(sample.data.form3Data);

  // Aggregate
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

  // We'll plot from negative to positive around 0.
  // For each question, we have up to 5 segments: 1,2 (negative), 3 (neutral), 4,5 (positive).
  // Each segment's "width" is its proportion of the total.

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

  // X scale: -1..1 (for proportions), with 0 in the center
  // We'll plot negative categories to the left, positive to the right
  const x = d3
    .scaleLinear()
    .domain([-1, 1]) // -100% to +100%
    .range([margin.left, width - margin.right]);

  // Y scale
  const y = d3
    .scaleBand()
    .domain(questions)
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  // Create color scale for the 5 categories
  // Negative categories (1,2) => reds
  // Neutral (3) => gray
  // Positive (4,5) => greens
  const colorScale = {
    "1": "#d73027", // strongly disagree
    "2": "#fc8d59", // disagree
    "3": "#f0f0f0", // neutral
    "4": "#d9ef8b", // agree
    "5": "#1a9850", // strongly agree
  };

  // Legend
  const legendGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top - 40})`);

  legendGroup
    .append("text")
    .attr("x", 0)
    .attr("y", -10)
    .style("font-weight", "bold")
    .text("Diverging Likert Legend:");

  const legendData = [
    { key: "1", label: "Strongly Disagree" },
    { key: "2", label: "Disagree" },
    { key: "3", label: "Neutral" },
    { key: "4", label: "Agree" },
    { key: "5", label: "Strongly Agree" },
  ];

  legendData.forEach((d, i) => {
    const g = legendGroup.append("g").attr("transform", `translate(${i * 120}, 0)`);
    g.append("rect").attr("width", 16).attr("height", 16).attr("fill", colorScale[d.key]);
    g.append("text")
      .attr("x", 22)
      .attr("y", 8)
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .text(d.label);
  });

  // For each question, we create up to 5 segments:
  //  - negative side: categories "1" and "2"
  //  - neutral: "3"
  //  - positive side: "4" and "5"
  // We'll track cumulative negative from left->0, positive from 0->right.

  questions.forEach((q) => {
    const total = aggregated[q].total || 1;
    // negative categories: [1,2]
    let negCumulative = 0; // proportion
    ["1", "2"].forEach((v) => {
      const count = aggregated[q][v];
      if (count > 0) {
        const proportion = count / total;
        // This bar goes from x(-negCumulative - proportion) to x(-negCumulative)
        const startVal = -(negCumulative + proportion);
        const endVal = -negCumulative;

        const xStart = x(startVal);
        const xEnd = x(endVal);

        svg
          .append("rect")
          .attr("y", y(q))
          .attr("x", xStart)
          .attr("width", Math.abs(xEnd - xStart))
          .attr("height", y.bandwidth())
          .attr("fill", colorScale[v]);

        // Optional label if large enough
        if (Math.abs(xEnd - xStart) > 30) {
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

        negCumulative += proportion;
      }
    });

    // neutral category: "3"
    const neutralCount = aggregated[q]["3"];
    if (neutralCount > 0) {
      const proportion = neutralCount / total;
      const xStart = x(-negCumulative);
      const xEnd = x(-negCumulative + proportion);

      svg
        .append("rect")
        .attr("y", y(q))
        .attr("x", xStart)
        .attr("width", Math.abs(xEnd - xStart))
        .attr("height", y.bandwidth())
        .attr("fill", colorScale["3"]);

      // Label if wide enough
      if (Math.abs(xEnd - xStart) > 30) {
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

      // We update negCumulative by adding neutral proportion
      negCumulative += proportion;
    }

    // positive categories: [4,5]
    let posCumulative = 0; // proportion from the center outward
    ["4", "5"].forEach((v) => {
      const count = aggregated[q][v];
      if (count > 0) {
        const proportion = count / total;
        // This bar goes from x(posCumulative) to x(posCumulative + proportion)
        const xStart = x(posCumulative);
        const xEnd = x(posCumulative + proportion);

        svg
          .append("rect")
          .attr("y", y(q))
          .attr("x", xStart)
          .attr("width", xEnd - xStart)
          .attr("height", y.bandwidth())
          .attr("fill", colorScale[v]);

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

        posCumulative += proportion;
      }
    });
  });

  // Y-axis
  const yAxis = d3.axisLeft(y).tickSize(0);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "12px");
  svg.selectAll(".domain, .tick line").remove();

  // X-axis: from -100%..+100%
  const xAxis = d3
    .axisBottom(x)
    .tickFormat((d) => `${(d * 100).toFixed(0)}%`)
    .tickValues([-1, -0.5, 0, 0.5, 1]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  // Vertical reference line at 0
  svg
    .append("line")
    .attr("x1", x(0))
    .attr("x2", x(0))
    .attr("y1", margin.top - 10)
    .attr("y2", height - margin.bottom + 5)
    .style("stroke", "#333")
    .style("stroke-width", 1)
    .style("stroke-dasharray", "2,2");

  // X-axis label
  svg
    .append("text")
    .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
    .attr("y", height - margin.bottom / 4)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#333")
    .text("← Disagree            % of Responses            Agree →");
}

/* ---------------------------------------
   Main component with both charts
-----------------------------------------*/
const Form3ComparisonDiverging = ({ allResponses }) => {
  const stackedRef = useRef(null);
  const divergingRef = useRef(null);

  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      // 1) Standard 100%-stacked Likert
      plotLikertScaleStacked(stackedRef.current, allResponses);

      // 2) Diverging Likert
      plotDivergingLikertChart(divergingRef.current, allResponses);
    }
  }, [allResponses]);

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Form3 Likert Examples: Stacked & Diverging
      </h2>

      {/* 100%-Stacked Chart */}
      <div
        ref={stackedRef}
        style={{
          background: "#f0f0f0",
          padding: "1rem",
          marginBottom: "2rem",
          borderRadius: "5px",
        }}
      />

      {/* Diverging Chart */}
      <div
        ref={divergingRef}
        style={{
          background: "#f0f0f0",
          padding: "1rem",
          borderRadius: "5px",
        }}
      />
    </div>
  );
};

export default Form3ComparisonDiverging;
