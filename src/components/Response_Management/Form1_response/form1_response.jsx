import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// Function to plot demographics pie chart
function plotDemographics(container, data) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const width = 300;
  const height = 300;
  const radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  d3.select(container).select("svg").remove();

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
    .text((d) => `${d.data.label}: ${(d.data.value / total * 100).toFixed(1)}%`);
}

// Function to plot grouped stacked bar chart
function plotGroupedStacked(container, nestedData, title) {
  const categories = Object.keys(nestedData).sort();
  const genders = Array.from(
    new Set(categories.flatMap((cat) => Object.keys(nestedData[cat])))
  ).sort();
  const ageGroups = Array.from(
    new Set(
      categories.flatMap((cat) =>
        genders.flatMap((g) => Object.keys(nestedData[cat][g] || {}))
      )
    )
  ).sort();

  const width = container.getBoundingClientRect().width || 800;
  const height = 400;
  const margin = { top: 50, right: 200, bottom: 100, left: 80 };

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

  const yMax = Math.max(
    ...categories.map((cat) =>
      genders.map((g) =>
        Object.values(nestedData[cat][g] || {}).reduce((sum, v) => sum + v, 0)
      )
    ).flat()
  );

  const y = d3
    .scaleLinear()
    .domain([0, yMax])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const color = d3.scaleOrdinal().domain(genders).range(d3.schemeSet2);

  // Axes
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x0))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(title);

  // Bars
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
        if (value > 0) {
          catGroup
            .append("rect")
            .attr("x", xPos)
            .attr("y", y(cumulative + value))
            .attr("width", x1.bandwidth())
            .attr("height", y(cumulative) - y(cumulative + value))
            .attr("fill", color(g));

          catGroup
            .append("text")
            .attr("x", xPos + x1.bandwidth() / 2)
            .attr("y", y(cumulative + value / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .style("fill", "#000")
            .text(`${((value / yMax) * 100).toFixed(1)}%`);

          cumulative += value;
        }
      });
    });
  });
}

const Form1Info = ({ allResponses }) => {
  const demographicsRef = useRef();
  const accessModeRef = useRef();
  const distanceRef = useRef();
  const purposeRef = useRef();
  const travelModeRef = useRef();

  const [nestedData, setNestedData] = useState({
    demographics: [],
    accessMode: {},
    distance: {},
    purpose: {},
    travelMode: {},
  });

  useEffect(() => {
    const demographicsData = [];
    const accessModeData = {};
    const distanceData = {};
    const purposeData = {};
    const travelModeData = {};

    allResponses.forEach((response) => {
      const form6 = response.data.form6Data;
      const form1 = response.data.form1Data;

      if (form6) {
        demographicsData.push(form6.gender);
      }

      if (form1) {
        const { accessMode, distance, purpose, travelMode } = form1;
        if (accessMode) accessModeData[accessMode] = form6 || {};
        if (distance) distanceData[distance] = form6 || {};
        if (purpose) purposeData[purpose] = form6 || {};
        if (travelMode) travelModeData[travelMode] = form6 || {};
      }
    });

    setNestedData({
      demographics: demographicsData,
      accessMode: accessModeData,
      distance: distanceData,
      purpose: purposeData,
      travelMode: travelModeData,
    });
  }, [allResponses]);

  useEffect(() => {
    if (demographicsRef.current) {
      const genderCounts = nestedData.demographics.reduce((acc, g) => {
        acc[g] = (acc[g] || 0) + 1;
        return acc;
      }, {});
      const demographicsData = Object.entries(genderCounts).map(([label, value]) => ({ label, value }));
      plotDemographics(demographicsRef.current, demographicsData);
    }

    if (accessModeRef.current) {
      plotGroupedStacked(accessModeRef.current, nestedData.accessMode, "Access Mode");
    }

    if (distanceRef.current) {
      plotGroupedStacked(distanceRef.current, nestedData.distance, "Distance");
    }

    if (purposeRef.current) {
      plotGroupedStacked(purposeRef.current, nestedData.purpose, "Purpose");
    }

    if (travelModeRef.current) {
      plotGroupedStacked(travelModeRef.current, nestedData.travelMode, "Travel Mode");
    }
  }, [nestedData]);

  return (
    <div className="my-10 p-4 bg-slate-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Form1 Information</h2>
      <div className="mb-6" ref={demographicsRef}></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div ref={accessModeRef} className="rounded-lg bg-gray-100 shadow-md p-4"></div>
        <div ref={distanceRef} className="rounded-lg bg-gray-100 shadow-md p-4"></div>
        <div ref={purposeRef} className="rounded-lg bg-gray-100 shadow-md p-4"></div>
        <div ref="{travelModeRef}" className="rounded-lg bg-gray-100 shadow-md p-4"></div> </div> </div> ); };

export default Form1Info;
