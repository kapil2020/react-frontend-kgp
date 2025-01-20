import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

/**
 * Plot a Likert scale distribution for form3Data within allResponses.
 */
function plotLikertScale(container, allResponses) {
  // 1..5 scale
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

  // Compute total responses for each question
  questions.forEach((q) => {
    const total = likertValues.reduce((sum, v) => sum + aggregated[q][v], 0);
    aggregated[q].total = total;
  });

  // Container size
  const containerWidth = container.getBoundingClientRect().width || 800;
  const width = containerWidth;

  const barHeight = 40;
  const margin = {
    top: 60,
    right: 20,
    bottom: 60,
    left: Math.min(containerWidth * 0.3, 250), // dynamic left margin
  };
  const height = questions.length * barHeight + margin.top + margin.bottom;

  // Remove any old chart
  d3.select(container).select("svg").remove();

  // Create the SVG, with responsive scaling
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  // X scale: domain based on the largest total across questions
  const maxTotal = d3.max(questions, (q) => aggregated[q].total);
  const x = d3.scaleLinear().range([margin.left, width - margin.right]);
  x.domain([0, maxTotal || 1]); // fallback if maxTotal=0

  // Color scale: red→green gradient
  const colorScale = d3
    .scaleOrdinal()
    .domain(likertValues)
    .range(["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#1a9850"]);

  // -----------
  // Draw Legend
  // -----------
  const legendGroup = svg
    .append("g")
    // Shift the legend above the bars
    .attr("transform", `translate(${margin.left}, ${margin.top - 30})`);

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
      .attr("transform", `translate(${i * 120},0)`); // spacing between each legend item

    row
      .append("rect")
      .attr("width", 14)
      .attr("height", 14)
      .attr("fill", colorScale(item.value));

    row
      .append("text")
      .attr("x", 20)
      .attr("y", 7)
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .text(item.label);
  });

  // -----------
  // Draw Bars
  // -----------
  const questionGroups = svg
    .selectAll(".question")
    .data(questions)
    .enter()
    .append("g")
    .attr("class", "question")
    .attr("transform", (d, i) => `translate(0, ${margin.top + i * barHeight})`);

  // Question label
  questionGroups
    .append("text")
    .attr("x", margin.left - 10)
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .style("font-size", Math.min(containerWidth * 0.02, 14))
    .style("fill", "#333")
    .text((d) => d);

  // For each question, create sub-rectangles for each Likert value
  questionGroups.each(function (q) {
    const group = d3.select(this);
    let xStart = margin.left;

    likertValues.forEach((lv) => {
      const count = aggregated[q][lv];
      const total = aggregated[q].total;
      const percentage = total ? ((count / total) * 100).toFixed(1) : 0;
      // width for this sub-segment
      const segmentWidth = x(count) - x(0);

      if (segmentWidth > 0) {
        // Rect for this sub-segment
        group
          .append("rect")
          .attr("x", xStart)
          .attr("y", 5)
          .attr("height", barHeight - 10)
          .attr("width", segmentWidth)
          .attr("fill", colorScale(lv));

        // Label the segment with a percentage if > 0
        if (percentage > 0) {
          group
            .append("text")
            .attr("x", xStart + segmentWidth / 2)
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("font-size", Math.min(containerWidth * 0.02, 12))
            .style("fill", "#000")
            .text(`${percentage}%`);
        }
        xStart += segmentWidth;
      }
    });
  });

  // -----------
  // X-axis Label
  // -----------
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - margin.bottom / 2)
    .attr("text-anchor", "middle")
    .style("font-size", Math.min(containerWidth * 0.03, 16))
    .style("fill", "#333")
    .text("Percentage of Responses (Proportional Bar Width by Count)");
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
