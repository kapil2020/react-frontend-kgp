import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// Generic function to plot a grouped stacked bar chart
function plotGroupedStacked(container, nestedData, title) {
  const categories = Object.keys(nestedData).sort();
  const gendersSet = new Set();
  const ageGroupsSet = new Set();

  categories.forEach((cat) => {
    const genders = Object.keys(nestedData[cat]);
    genders.forEach((g) => {
      gendersSet.add(g);
      const ageGroups = Object.keys(nestedData[cat][g]);
      ageGroups.forEach((ag) => ageGroupsSet.add(ag));
    });
  });

  const genders = Array.from(gendersSet).sort();
  const ageGroups = Array.from(ageGroupsSet).sort();

  let yMax = 0;
  categories.forEach((cat) => {
    genders.forEach((g) => {
      const data = nestedData[cat][g] || {};
      const total = ageGroups.reduce((sum, ag) => sum + (data[ag] || 0), 0);
      if (total > yMax) yMax = total;
    });
  });

  const containerWidth = container.getBoundingClientRect().width || 800;
  const width = containerWidth;
  const height = 400;
  const margin = { top: 40, right: 200, bottom: 80, left: Math.min(150, containerWidth * 0.3) };

  d3.select(container).select("svg").remove();

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const x0 = d3
    .scaleBand()
    .domain(categories)
    .range([margin.left, width - margin.right])
    .paddingInner(0.2);

  const x1 = d3
    .scaleBand()
    .domain(genders)
    .range([0, x0.bandwidth()])
    .padding(0.05);

  const y = d3
    .scaleLinear()
    .domain([0, yMax])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const colorScale = d3
    .scaleOrdinal()
    .domain(genders)
    .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

  categories.forEach((cat) => {
    const catGroup = svg
      .append("g")
      .attr("transform", `translate(${x0(cat)},0)`);

    genders.forEach((g) => {
      const data = nestedData[cat][g] || {};
      const xPos = x1(g);
      let cumulative = 0;

      ageGroups.forEach((ag) => {
        const value = data[ag] || 0;
        const percentage = yMax ? ((value / yMax) * 100).toFixed(1) : 0;
        if (value > 0) {
          const yStart = y(cumulative + value);
          const yEnd = y(cumulative);
          catGroup
            .append("rect")
            .attr("x", xPos)
            .attr("y", yStart)
            .attr("width", x1.bandwidth())
            .attr("height", yEnd - yStart)
            .attr("fill", colorScale(g));

          // Add percentage label
          catGroup
            .append("text")
            .attr("x", xPos + x1.bandwidth() / 2)
            .attr("y", (yStart + yEnd) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .style("fill", "#000")
            .text(`${percentage}%`);
          cumulative += value;
        }
      });
    });
  });

  // Axes and Title
  const xAxis = d3.axisBottom(x0);
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  const yAxis = d3.axisLeft(y);
  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis);

  svg
    .append("text")
    .attr("x", (width - margin.right) / 2 + margin.left)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(title);

  // Legend
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - margin.right + 20},${margin.top})`);

  genders.forEach((g, i) => {
    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", i * 20)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", colorScale(g));

    legend
      .append("text")
      .attr("x", 24)
      .attr("y", i * 20 + 9)
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .text(g);
  });
}

// Demographics pie chart
function plotDemographics(container, data) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const width = 300;
  const height = 300;
  const radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const pie = d3.pie().value((d) => d.value);
  const arc = d3.arc().outerRadius(radius).innerRadius(0);
  const labelArc = d3.arc().outerRadius(radius + 10).innerRadius(radius + 10);

  const arcs = svg
    .selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.label));

  arcs
    .append("text")
    .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
    .attr("dy", ".35em")
    .style("font-size", "10px")
    .style("text-anchor", "middle")
    .text(
      (d) =>
        `${d.data.label}: ${((d.data.value / total) * 100).toFixed(1)}%`
    );
}

export default function Form1_info({ allResponses }) {
  //... Rest of the code remains the same with hooks to render Access Mode, Distance, Purpose, Travel Mode, and Demographics.
}
