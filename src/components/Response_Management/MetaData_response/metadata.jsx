import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const MetaData_info_ECDF_D3 = ({ allResponses }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!allResponses || allResponses.length === 0) return;

    // 1) Gather total time for each participant, in seconds
    let times = allResponses
      .map((resp) => {
        const m = resp?.data?.metadata?.timeTaken?.minutes;
        const s = resp?.data?.metadata?.timeTaken?.seconds;
        if (m == null || s == null) return null;
        return m * 60 + s; // total time in seconds
      })
      .filter((val) => val !== null);

    // If no valid data, exit
    if (times.length === 0) return;

    // 2) Sort times ascending
    times.sort((a, b) => a - b);

    // 3) Build ECDF data: For each sorted time, the fraction of participants <= that time
    //    i-th point => x = times[i], y = (i+1)/n  (for i=0..n-1)
    const n = times.length;
    const ecdfData = times.map((time, i) => ({
      time,
      fraction: (i + 1) / n, // fraction from 1/n up to n/n
    }));

    // 4) Setup chart dimensions
    const width = 640;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };

    // Clear any old chart
    d3.select(containerRef.current).select("svg").remove();

    // 5) Create SVG
    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", "#fafafa")
      .style("font-family", "sans-serif");

    // 6) Scales
    // X scale from [0..maxTime], Y scale from [0..1]
    const maxTime = d3.max(ecdfData, (d) => d.time) || 0;
    const x = d3
      .scaleLinear()
      .domain([0, maxTime])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear().domain([0, 1]).range([height - margin.bottom, margin.top]);

    // 7) Axes
    const xAxis = d3.axisBottom(x).ticks(6);
    const yAxis = d3
      .axisLeft(y)
      .ticks(5)
      .tickFormat(d3.format(".0%")); // show as percentages

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .append("text")
      .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
      .attr("y", 40)
      .attr("fill", "#333")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("text-anchor", "middle")
      .text("Total Time (seconds)");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .append("text")
      .attr("x", -(height - margin.top - margin.bottom) / 2)
      .attr("y", -50)
      .attr("fill", "#333")
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Proportion of Participants");

    // 8) Grid lines (optional)
    // Horizontal grid lines
    svg
      .append("g")
      .attr("stroke", "#ccc")
      .attr("stroke-opacity", 0.5)
      .selectAll("line.y-grid")
      .data(y.ticks(5))
      .join("line")
      .attr("class", "y-grid")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d));

    // Vertical grid lines
    svg
      .append("g")
      .attr("stroke", "#ccc")
      .attr("stroke-opacity", 0.5)
      .selectAll("line.x-grid")
      .data(x.ticks(6))
      .join("line")
      .attr("class", "x-grid")
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("x1", (d) => x(d))
      .attr("x2", (d) => x(d));

    // 9) ECDF line generator: we use a “step” so it stays flat until next data point
    const lineGenerator = d3
      .line()
      .x((d) => x(d.time))
      .y((d) => y(d.fraction))
      .curve(d3.curveStepAfter);

    // 10) Draw the ECDF line
    svg
      .append("path")
      .datum(ecdfData)
      .attr("fill", "none")
      .attr("stroke", "#1B9E77")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);

    // 11) Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 1.3)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Cumulative Distribution of Survey Completion Times");

    // If you need a tooltip or percentile lines, you could implement them here.
  }, [allResponses]);

  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ marginBottom: "0.5rem" }}>Survey Time ECDF (Pure D3)</h3>
      <div ref={containerRef} />
    </div>
  );
};

export default MetaData_info_ECDF_D3;
