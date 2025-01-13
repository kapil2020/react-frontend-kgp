import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// Generic function to plot a grouped stacked bar chart
function plotGroupedStacked(container, nestedData, title) {
  const categories = Object.keys(nestedData).sort();
  const gendersSet = new Set();
  const ageGroupsSet = new Set();

  // Gather unique genders and age groups across all categories
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

  // Create grouped stacked bars
  categories.forEach((cat) => {
    const catGroup = svg
      .append("g")
      .attr("transform", `translate(${x0(cat)},0)`);

    genders.forEach((g) => {
      const data = nestedData[cat][g] || {};
      const xPos = x1(g);
      let cumulative = 0;

      ageGroups.forEach((ag, i) => {
        const value = data[ag] || 0;
        if (value > 0) {
          const yStart = y(cumulative + value);
          const yEnd = y(cumulative);
          catGroup
            .append("rect")
            .attr("x", xPos)
            .attr("y", yStart)
            .attr("width", x1.bandwidth())
            .attr("height", yEnd - yStart)
            .attr("fill", colorScale(g))
            .attr("fill-opacity", 0.4 + (0.6 * (i + 1)) / ageGroups.length)
            .on("mouseover", function () {
              d3.select(this).attr("fill-opacity", 1);
            })
            .on("mouseout", function () {
              d3.select(this).attr("fill-opacity", 0.4 + (0.6 * (i + 1)) / ageGroups.length);
            });
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
    .style("font-size", Math.min(containerWidth * 0.03, 16))
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

const Form1_info = ({ allResponses }) => {
  const accessModeRef = useRef();

  const [form1_accessmode, setForm1_AccessMode] = useState({});

  // Helper to update nested counts
  function updateNestCount(currentState, key, gender, ageGroup) {
    const newState = { ...currentState };
    if (!newState[key]) newState[key] = {};
    if (!newState[key][gender]) newState[key][gender] = {};
    if (!newState[key][gender][ageGroup]) newState[key][gender][ageGroup] = 0;
    newState[key][gender][ageGroup] += 1;
    return newState;
  }

  useEffect(() => {
    if (!allResponses || allResponses.length === 0) return;

    let accessModeObj = {};
    allResponses.forEach((response) => {
      const form1 = response.data.form1Data;
      const form6 = response.data.form6Data;
      if (form1 && form6) {
        const { accessMode } = form1;
        const gender = form6.gender;
        const ageGroup = form6.age;

        accessModeObj = updateNestCount(
          accessModeObj,
          accessMode,
          gender,
          ageGroup
        );
      }
    });

    setForm1_AccessMode(accessModeObj);
  }, [allResponses]);

  useEffect(() => {
    if (Object.keys(form1_accessmode).length && accessModeRef.current) {
      plotGroupedStacked(accessModeRef.current, form1_accessmode, "Access Mode");
    }
  }, [form1_accessmode]);

  return (
    <div className="my-10 scale-90 bg-slate-50 rounded-md p-4">
      <h2 className="font-serif font-bold text-xl mb-4">Form1 Information</h2>
      <div ref={accessModeRef} className="rounded-md shadow-lg bg-slate-200"></div>
    </div>
  );
};

export default Form1_info;
