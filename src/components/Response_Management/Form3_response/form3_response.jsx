import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

/**
 * Example: Diverging Likert Chart
 * 
 * By default, we combine:
 *   negative: 1,2
 *   neutral:  3
 *   positive: 4,5
 *
 * If you prefer each Likert item separate, you'd adapt the logic
 * for the domain [-1, +1], etc.
 */
function plotDivergingLikert(container, allResponses) {
  // Identify all question keys from a sample
  const sample = allResponses.find((r) => r.data?.form3Data);
  if (!sample) return;

  const questions = Object.keys(sample.data.form3Data);

  // We'll aggregate into { question: { negativeCount, neutralCount, positiveCount, total } }
  const aggregated = {};
  questions.forEach((q) => {
    aggregated[q] = { neg: 0, neu: 0, pos: 0, total: 0 };
  });

  // Tally responses
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

  // Sum up total
  questions.forEach((q) => {
    aggregated[q].total = aggregated[q].neg + aggregated[q].neu + aggregated[q].pos;
  });

  // For each question, find percentage negative, neutral, positive
  // negative%  = -(negCount / total * 100)   (negative side)
  // neutral%   = neuCount / total * 100
  // positive%  = posCount / total * 100      (positive side)
  // We'll place them so that 0 is in the center of the axis.

  // -----------
  // Dimensions
  // -----------
  const containerWidth = container.getBoundingClientRect().width || 800;
  const width = containerWidth;
  const barHeight = 40;
  const margin = { top: 60, right: 20, bottom: 40, left: 200 };
  const height = questions.length * barHeight + margin.top + margin.bottom;

  d3.select(container).select("svg").remove(); // Clear old

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // X scale from -100% to +100%
  const x = d3.scaleLinear().domain([-100, 100]).range([margin.left, width - margin.right]);

  // Y scale: each question is a row
  const y = d3
    .scaleBand()
    .domain(questions)
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  // Color scheme for negative / neutral / positive segments
  const color = {
    neg: "#d73027", // red
    neu: "#f7f7f7", // light gray or something
    pos: "#1a9850", // green
  };

  // -----------
  // Legend
  // -----------
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
    const row = legendGroup.append("g").attr("transform", `translate(${i * 120}, 0)`);
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

  // -----------
  // Draw bars
  // -----------
  // For each question, we'll place a bar that extends left for negative,
  // a segment in the middle for neutral, and right for positive.

  questions.forEach((q) => {
    const { neg, neu, pos, total } = aggregated[q];
    const negPct = total ? (-neg / total) * 100 : 0;  // negative side
    const neuPct = total ? (neu / total) * 100 : 0;
    const posPct = total ? (pos / total) * 100 : 0;

    // The center of the bar is at x(0).
    // negative goes from x(negPct) to x(0).
    // neutral is in the center around x(0).
    // positive goes from x(0) to x(posPct).

    // Y position for this question
    const yPos = y(q);

    // Negative rectangle
    if (negPct < 0) {
      svg
        .append("rect")
        .attr("y", yPos)
        .attr("x", x(negPct)) // because negPct is negative, x(negPct) < x(0)
        .attr("width", x(0) - x(negPct))
        .attr("height", y.bandwidth())
        .attr("fill", color.neg);

      // Label if wide enough
      const negWidth = x(0) - x(negPct);
      if (negWidth > 30) {
        svg
          .append("text")
          .attr("x", x(negPct) + negWidth / 2)
          .attr("y", yPos + y.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .style("fill", "#fff")
          .style("font-size", "12px")
          .text(`${Math.abs(negPct).toFixed(1)}%`);
      }
    }

    // Positive rectangle
    if (posPct > 0) {
      svg
        .append("rect")
        .attr("y", yPos)
        .attr("x", x(0))
        .attr("width", x(posPct) - x(0))
        .attr("height", y.bandwidth())
        .attr("fill", color.pos);

      // Label if wide enough
      const posWidth = x(posPct) - x(0);
      if (posWidth > 30) {
        svg
          .append("text")
          .attr("x", x(0) + posWidth / 2)
          .attr("y", yPos + y.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .style("fill", "#fff")
          .style("font-size", "12px")
          .text(`${posPct.toFixed(1)}%`);
      }
    }

    // Neutral rectangle: we'll center it at 0.
    // e.g. if neutral is 20%, it will occupy 10% to the left, 10% to the right
    // But you might choose to just stack it on the positive side or negative side.
    // There's no single standard for how to place "neutral" in a diverging chart, so let's
    // place it to the right of negative. So the left edge is at x(negPct), the right edge is x(negPct + neuPct).
    const neuLeft = negPct;
    const neuRight = negPct + neuPct;
    // if neuPct > 0 => we draw it
    if (neuPct > 0) {
      const barX = x(neuLeft);
      const barW = x(neuRight) - barX;

      svg
        .append("rect")
        .attr("y", yPos)
        .attr("x", barX)
        .attr("width", barW)
        .attr("height", y.bandwidth())
        .attr("fill", color.neu);

      // label if wide enough
      if (barW > 30) {
        svg
          .append("text")
          .attr("x", barX + barW / 2)
          .attr("y", yPos + y.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .style("fill", "#000")
          .style("font-size", "12px")
          .text(`${neuPct.toFixed(1)}%`);
      }
    }
  });

  // -----------
  // Y-axis: question labels
  // -----------
  const yAxis = d3.axisLeft(y).tickSize(0);
  svg
    .append("g")
    .attr("transform", `translate(${x(0)},0)`) // normally left, but let's keep them aligned at x(0)? or margin.left
    // If you prefer them flush on the left, do `translate(${margin.left},0)`.
    .call(yAxis)
    .selectAll("text")
    .style("font-size", "12px")
    .style("text-anchor", "end")
    .attr("dx", "-0.5em");

  svg.selectAll(".domain, .tick line").remove(); // remove lines

  // -----------
  // X-axis: -100% to +100%
  // -----------
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

/**
 * React component
 */
const Form3Diverging = ({ allResponses }) => {
  const ref = useRef();

  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      plotDivergingLikert(ref.current, allResponses);
    }
  }, [allResponses]);

  return (
    <div style={{ width: "100%" }}>
      <h3>Diverging Likert Example</h3>
      <div
        ref={ref}
        style={{
          background: "#f0f0f0",
          padding: "1rem",
          borderRadius: "6px",
          overflowX: "auto",
        }}
      />
    </div>
  );
};

export default Form3Diverging;
