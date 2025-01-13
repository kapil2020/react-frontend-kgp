import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function plotLikertScale(container, allResponses) {
  const likertValues = ["1", "2", "3", "4", "5"];

  const sample = allResponses.find((r) => r.data && r.data.form3Data);
  if (!sample) return;
  const questions = Object.keys(sample.data.form3Data);

  const aggregated = {};
  questions.forEach((q) => {
    aggregated[q] = {};
    likertValues.forEach((v) => {
      aggregated[q][v] = 0;
    });
  });

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

  const containerWidth = container.getBoundingClientRect().width || 800;
  const width = containerWidth;
  const barHeight = 40;
  const margin = {
    top: 40,
    right: 20,
    bottom: 60,
    left: Math.min(containerWidth * 0.3, 250), // Dynamic margin for labels
  };
  const height = questions.length * barHeight + margin.top + margin.bottom;

  d3.select(container).select("svg").remove();

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const x = d3.scaleLinear().range([margin.left, width - margin.right]);

  questions.forEach((q) => {
    const total = likertValues.reduce((sum, v) => sum + aggregated[q][v], 0);
    aggregated[q].total = total;
  });
  const maxTotal = d3.max(questions, (q) => aggregated[q].total);
  x.domain([0, maxTotal]);

  const colorScale = d3
    .scaleOrdinal()
    .domain(likertValues)
    .range(["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#1a9850"]);

  const questionGroups = svg
    .selectAll(".question")
    .data(questions)
    .enter()
    .append("g")
    .attr("class", "question")
    .attr("transform", (d, i) => `translate(0, ${margin.top + i * barHeight})`);

  questionGroups
    .append("text")
    .attr("x", margin.left - 10)
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .style("font-size", Math.min(containerWidth * 0.02, 14)) // Dynamic font size
    .style("fill", "#333")
    .text((d) => d);

  questionGroups.each(function (q) {
    const group = d3.select(this);
    let xStart = margin.left;

    likertValues.forEach((lv) => {
      const count = aggregated[q][lv];
      const percentage = aggregated[q].total
        ? ((count / aggregated[q].total) * 100).toFixed(1)
        : 0;
      const segmentWidth = x(count) - x(0);
      if (segmentWidth > 0) {
        group
          .append("rect")
          .attr("x", xStart)
          .attr("y", 5)
          .attr("height", barHeight - 10)
          .attr("width", segmentWidth)
          .attr("fill", colorScale(lv));

        group
          .append("text")
          .attr("x", xStart + segmentWidth / 2)
          .attr("y", barHeight / 2)
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .style("font-size", Math.min(containerWidth * 0.02, 12)) // Dynamic font size
          .style("fill", "#000")
          .text(percentage > 0 ? `${percentage}%` : "");

        xStart += segmentWidth;
      }
    });
  });

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - margin.bottom / 2)
    .attr("text-anchor", "middle")
    .style("font-size", Math.min(containerWidth * 0.03, 16)) // Dynamic font size
    .style("fill", "#333")
    .text("Percentage of Responses");
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
        style={{ fontSize: "clamp(14px, 4vw, 20px)" }} // Responsive font size
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
