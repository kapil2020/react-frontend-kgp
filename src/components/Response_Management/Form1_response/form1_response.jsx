import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

function plotHorizontalStackedBar(container, nestedData, title) {
  const categories = Object.keys(nestedData).sort();
  const genders = [...new Set(
    Object.values(nestedData).flatMap(cat => Object.keys(cat))
  )].sort();
  const ageGroups = [...new Set(
    Object.values(nestedData).flatMap(cat => 
      Object.values(cat).flatMap(g => Object.keys(g))
    )
  )].sort();

  // Dark theme colors
  const backgroundColor = "#2a2a2a";
  const textColor = "#ffffff";
  const axisColor = "#cccccc";
  const gridColor = "#666666";
  
  // Dark ggplot-inspired color palette
  const colorMap = {
    male: "#1f77b4",
    female: "#ff7f0e",
    other: "#2ca02c",
    unknown: "#d62728"
  };

  const width = 800;
  const height = 400;
  const margin = { top: 50, right: 200, bottom: 50, left: 150 };

  d3.select(container).select("svg").remove();

  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", backgroundColor);

  // X scale (percentage)
  const x = d3.scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right]);

  // Y scale (categories)
  const y = d3.scaleBand()
    .domain(categories)
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  // Subgroup scale (genders)
  const ySubgroup = d3.scaleBand()
    .domain(genders)
    .range([0, y.bandwidth()])
    .padding(0.1);

  // Create stacked bars
  categories.forEach(category => {
    genders.forEach(gender => {
      const data = nestedData[category][gender] || {};
      const total = d3.sum(Object.values(data));
      if (total === 0) return;

      let cumulative = 0;
      ageGroups.forEach((ageGroup, i) => {
        const value = data[ageGroup] || 0;
        const proportion = value / total;
        
        svg.append("rect")
          .attr("x", x(cumulative))
          .attr("y", y(category) + ySubgroup(gender))
          .attr("width", x(proportion) - x(0))
          .attr("height", ySubgroup.bandwidth())
          .attr("fill", colorMap[gender] || colorMap.unknown)
          .attr("opacity", 0.6 + (0.4 * (i + 1) / ageGroups.length));

        cumulative += proportion;
      });
    });
  });

  // Add X axis
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(5, ".0%"))
    .style("color", axisColor)
    .call(g => g.select(".domain").attr("stroke", gridColor))
    .call(g => g.selectAll(".tick line").attr("stroke", gridColor));

  // Add Y axis
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .style("color", axisColor)
    .call(g => g.select(".domain").attr("stroke", gridColor))
    .call(g => g.selectAll(".tick line").attr("stroke", gridColor));

  // Add grid lines
  svg.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x)
      .ticks(5)
      .tickSize(-height + margin.top + margin.bottom)
      .tickFormat(""))
    .style("color", gridColor)
    .style("opacity", 0.3);

  // Add chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("fill", textColor)
    .style("font-size", "16px")
    .text(title);

  // Add legend
  const legend = svg.append("g")
    .attr("transform", `translate(${width - margin.right + 20},${margin.top})`);

  let legendY = 0;
  genders.forEach(gender => {
    const genderGroup = legend.append("g");
    
    genderGroup.append("text")
      .attr("x", 0)
      .attr("y", legendY)
      .style("fill", textColor)
      .style("font-weight", "bold")
      .text(gender);
    
    legendY += 20;
    
    ageGroups.forEach((ageGroup, i) => {
      genderGroup.append("rect")
        .attr("x", 0)
        .attr("y", legendY)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", colorMap[gender])
        .attr("opacity", 0.6 + (0.4 * (i + 1) / ageGroups.length));
      
      genderGroup.append("text")
        .attr("x", 20)
        .attr("y", legendY + 8)
        .style("fill", textColor)
        .text(ageGroup);
      
      legendY += 20;
    });
    legendY += 10;
  });
}

// Updated Form1_info component with horizontal layout
const Form1_info = ({ allResponses }) => {
  // ... [keep the same state and ref declarations as before] ...

  // Update all plotGroupedStacked calls to plotHorizontalStackedBar
  useEffect(() => {
    if (Object.keys(form1_accessmode).length && accessModeRef.current) {
      plotHorizontalStackedBar(accessModeRef.current, form1_accessmode, "Access Mode");
    }
  }, [form1_accessmode]);

  // Repeat similar updates for other useEffect hooks
  // ... [rest of the component remains the same] ...

  return (
    <div className="my-10 scale-90 bg-gray-800 rounded-md p-4">
      <h2 className="font-serif font-bold text-xl mb-4 text-white">Form1 Information</h2>

      {/* Demographics Overview */}
      <div className="mb-8 flex flex-col items-center">
        <h3 className="font-serif font-semibold text-lg mb-2 text-center text-white">
          Demographics Overview
        </h3>
        <div
          ref={demographicsRef}
          className="bg-gray-700 rounded-md shadow-lg m-2 w-full max-w-[300px]"
        ></div>
      </div>

      {/* Grid layout for charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-md p-2">
          <div ref={accessModeRef}></div>
        </div>
        <div className="bg-gray-700 rounded-md p-2">
          <div ref={distanceRef}></div>
        </div>
        <div className="bg-gray-700 rounded-md p-2">
          <div ref={purposeRef}></div>
        </div>
        <div className="bg-gray-700 rounded-md p-2">
          <div ref={travelModeRef}></div>
        </div>
      </div>
    </div>
  );
};

export default Form1_info;
