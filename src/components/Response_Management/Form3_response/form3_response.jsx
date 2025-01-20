import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// ---------------------------------------------
// 1) The standard 100%-stacked Likert chart
// ---------------------------------------------
function plotLikertScaleStacked(container, allResponses) {
  // Likert values 1..5
  const likertValues = ["1", "2", "3", "4", "5"];

  // Find a sample response to see which questions exist
  const sample = allResponses.find((r) => r.data?.form3Data);
  if (!sample) return;
  const questions = Object.keys(sample.data.form3Data);

  // Aggregate: for each question, how many times did we see 1..5
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

  // Container
  const containerWidth = container.getBoundingClientRect().width || 800;
  const width = containerWidth;
  const barHeight = 40;
  const margin = { top: 70, right: 30, bottom: 50, left: Math.min(containerWidth * 0.3, 250) };
  const height = questions.length * barHeight + margin.top + margin.bottom;

  d3.select(container).select("svg").remove(); // remove old

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // x scale for 0..1 => 0..100% (each question is 100% wide)
  const x = d3.scaleLinear().domain([0, 1]).range([margin.left, width - margin.right]);

  // y scale for question rows
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

  // We'll label them 1..5 as well
  const legendLabels = ["1: Strongly Disagree", "2: Disagree", "3: Neutral", "4: Agree", "5: Strongly Agree"];
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
    let cumulative = 0; // from 0..1

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

        // If wide enough, label in center
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

  // y-axis for question text
  const yAxis = d3.axisLeft(y).tickSize(0);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "12px")
    .style("fill", "#333");

  svg.selectAll(".domain, .tick line").remove();

  // x-axis from 0..1 => 0..100%
  const xAxis = d3
    .axisBottom(x)
    .tickFormat(d3.format(".0%"))
    .tickValues([0, 0.25, 0.5, 0.75, 1]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  // Title
  svg
    .append("text")
    .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-size", "16px")
    .text("Simple 100%-Stacked Likert Plot");
}

// ---------------------------------------------
// 2) Diverging Likert chart
// ---------------------------------------------
function plotLikertScaleDiverging(container, allResponses) {
  // We'll combine (1,2) as negative, (3) as neutral, (4,5) as positive
  const sample = allResponses.find((r) => r.data?.form3Data);
  if (!sample) return;
  const questions = Object.keys(sample.data.form3Data);

  const aggregated = {};
  questions.forEach((q) => {
    aggregated[q] = { neg: 0, neu: 0, pos: 0, total: 0 };
  });

  allResponses.forEach((resp) => {
    const form3 = resp.data?.form3Data;
    if (!form3) return;
    questions.forEach((q) => {
      const val = form3[q];
      if (val === "1" || val === "2") aggregated[q].neg += 1;
      else if (val === "3") aggregated[q].neu += 1;
      else if (val === "4" || val === "5") aggregated[q].pos += 1;
    });
  });

  questions.forEach((q) => {
    aggregated[q].total = aggregated[q].neg + aggregated[q].neu + aggregated[q].pos;
  });

  const containerWidth = container.getBoundingClientRect().width || 800;
  const width = containerWidth;
  const barHeight = 40;
  const margin = { top: 60, right: 20, bottom: 40, left: 200 };
  const height = questions.length * barHeight + margin.top + margin.bottom;

  d3.select(container).select("svg").remove();

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // Diverging scale: -100..+100
  const x = d3.scaleLinear().domain([-100, 100]).range([margin.left, width - margin.right]);
  const y = d3
    .scaleBand()
    .domain(questions)
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  // Colors for negative, neutral, positive
  const color = {
    neg: "#d73027", // red
    neu: "#f7f7f7", // light gray
    pos: "#1a9850", // green
  };

  // Legend
  const legendGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top - 40})`);
  legendGroup
    .append("text")
    .attr("x", 0)
    .attr("y", -10)
    .style("font-weight", "bold")
    .text("Diverging Likert Legend:");
  const items = [
    { key: "neg", label: "Disagree (1,2)", color: color.neg },
    { key: "neu", label: "Neutral (3)", color: color.neu },
    { key: "pos", label: "Agree (4,5)", color: color.pos },
  ];
  items.forEach((item, i) => {
    const row = legendGroup.append("g").attr("transform", `translate(${i * 130}, 0)`);
    row
      .append("rect")
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", item.color);
    row
      .append("text")
      .attr("x", 24)
      .attr("y", 8)
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .text(item.label);
  });

  // Plot bars for each question
  questions.forEach((q) => {
    const { neg, neu, pos, total } = aggregated[q];
    const negPct = total ? -(neg / total) * 100 : 0;
    const neuPct = total ? (neu / total) * 100 : 0;
    const posPct = total ? (pos / total) * 100 : 0;
    const yPos = y(q);

    // Negative
    if (negPct < 0) {
      const xLeft = x(negPct);
      const xZero = x(0);
      const negWidth = xZero - xLeft; // positive distance
      svg
        .append("rect")
        .attr("x", xLeft)
        .attr("y", yPos)
        .attr("width", negWidth)
        .attr("height", y.bandwidth())
        .attr("fill", color.neg);

      if (negWidth > 30) {
        svg
          .append("text")
          .attr("x", xLeft + negWidth / 2)
          .attr("y", yPos + y.bandwidth() / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .style("fill", "#fff")
          .style("font-size", "12px")
          .text(`${Math.abs(negPct).toFixed(1)}%`);
      }
    }

    // Positive
    if (posPct > 0) {
      const xZero = x(0);
      const xRight = x(posPct);
      const posWidth = xRight - xZero;
      svg
        .append("rect")
        .attr("x", xZero)
        .attr("y", yPos)
        .attr("width", posWidth)
        .attr("height", y.bandwidth())
        .attr("fill", color.pos);

      if (posWidth > 30) {
        svg
          .append("text")
          .attr("x", xZero + posWidth / 2)
          .attr("y", yPos + y.bandwidth() / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .style("fill", "#fff")
          .style("font-size", "12px")
          .text(`${posPct.toFixed(1)}%`);
      }
    }

    // Neutral
    if (neuPct > 0) {
      // We'll place neutral just to the right of negative
      // left edge: negPct, right edge: negPct+neuPct
      const leftPct = negPct;
      const rightPct = negPct + neuPct;
      const barX = x(leftPct);
      const barW = x(rightPct) - barX;
      svg
        .append("rect")
        .attr("x", barX)
        .attr("y", yPos)
        .attr("width", barW)
        .attr("height", y.bandwidth())
        .attr("fill", color.neu);

      if (barW > 30) {
        svg
          .append("text")
          .attr("x", barX + barW / 2)
          .attr("y", yPos + y.bandwidth() / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .style("fill", "#000")
          .style("font-size", "12px")
          .text(`${neuPct.toFixed(1)}%`);
      }
    }
  });

  // y-axis for question labels
  const yAxis = d3.axisLeft(y).tickSize(0);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "12px")
    .style("text-anchor", "end");
  svg.selectAll(".domain, .tick line").remove();

  // x-axis from -100..+100
  const xAxis = d3
    .axisBottom(x)
    .tickFormat((d) => `${d}%`)
    .tickValues([-100, -50, 0, 50, 100]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  // Title
  svg
    .append("text")
    .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Diverging Likert Responses (Negative ← 0% → Positive)");
}

// ---------------------------------------------
// The main component showing both plots
// ---------------------------------------------
const Form3Comparison = ({ allResponses }) => {
  const stackedRef = useRef();
  const divergingRef = useRef();

  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      // 1) standard 100%-stacked
      plotLikertScaleStacked(stackedRef.current, allResponses);

      // 2) diverging
      plotLikertScaleDiverging(divergingRef.current, allResponses);
    }
  }, [allResponses]);

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Likert Scale Comparison
      </h2>
      {/* Stacked 100% */}
      <div
        ref={stackedRef}
        style={{
          background: "#f0f0f0",
          padding: "1rem",
          marginBottom: "2rem",
          borderRadius: "5px",
        }}
      />

      {/* Diverging */}
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

export default Form3Comparison;
