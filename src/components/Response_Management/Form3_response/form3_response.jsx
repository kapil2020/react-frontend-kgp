import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

function plotLikertScale(container, allResponses) {
  const likertValues = ["1", "2", "3", "4", "5"];

  // Find questions from the first valid response
  const sample = allResponses.find((r) => r.data && r.data.form3Data);
  if (!sample) return;
  const questions = Object.keys(sample.data.form3Data);

  // Initialize aggregation structure
  const aggregated = {};
  questions.forEach((q) => {
    aggregated[q] = {};
    likertValues.forEach((v) => {
      aggregated[q][v] = 0;
    });
  });

  // Aggregate counts for each question and Likert value
  allResponses.forEach((response) => {
    const form3 = response.data && response.data.form3Data;
    if (form3) {
      questions.forEach((q) => {
        const val = form3[q];
        if (val && likertValues.includes(val)) {
          aggregated[q][val] += 1;
        }
      });
    }
  });

  // Use container's width for the chart width
  const containerWidth = container.getBoundingClientRect().width || 800;
  const width = containerWidth;
  const barHeight = 30;
  // Increase left margin for longer labels
  const margin = { top: 20, right: 20, bottom: 20, left: 250 };
  const height = questions.length * barHeight + margin.top + margin.bottom;

  // Clear previous chart content
  d3.select(container).select("svg").remove();

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const x = d3.scaleLinear().range([margin.left, width - margin.right]);

  // Compute totals and find max total for scaling
  questions.forEach((q) => {
    const total = likertValues.reduce((sum, v) => sum + aggregated[q][v], 0);
    aggregated[q].total = total;
  });
  const maxTotal = d3.max(questions, (q) => aggregated[q].total);
  x.domain([0, maxTotal]);

  const colorScale = d3
    .scaleOrdinal()
    .domain(likertValues)
    .range(d3.schemeBrBG[5]);

  // Create a group for each question's bar chart row
  const questionGroups = svg
    .selectAll(".question")
    .data(questions)
    .enter()
    .append("g")
    .attr("class", "question")
    .attr("transform", (d, i) => `translate(0, ${margin.top + i * barHeight})`);

  // Add question labels on the left
  questionGroups
    .append("text")
    .attr("x", margin.left - 10)
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text((d) => d);

  // Draw horizontal stacked bars for each question
  questionGroups.each(function (q) {
    const group = d3.select(this);
    let xStart = margin.left;

    likertValues.forEach((lv) => {
      const count = aggregated[q][lv];
      const segmentWidth = x(count) - x(0);
      if (segmentWidth > 0) {
        group
          .append("rect")
          .attr("x", xStart)
          .attr("y", 0)
          .attr("height", barHeight - 5)
          .attr("width", segmentWidth)
          .attr("fill", colorScale(lv));
        xStart += segmentWidth;
      }
    });
  });
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
      <h3 className="font-serif font-semibold text-lg mb-2 text-center">
        Form3 Likert Scale Overview
      </h3>
      <div
        ref={likertRef}
        className="rounded-md shadow-lg w-full bg-slate-200 flex justify-center scale-90"
      ></div>
    </div>
  );
};

export default Form3_info;
