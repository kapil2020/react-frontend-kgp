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
}

const Form1_info = ({ allResponses }) => {
  const accessModeRef = useRef();
  const distanceRef = useRef();
  const purposeRef = useRef();
  const travelModeRef = useRef();

  const [form1AccessMode, setForm1AccessMode] = useState({});
  const [form1Distance, setForm1Distance] = useState({});
  const [form1Purpose, setForm1Purpose] = useState({});
  const [form1TravelMode, setForm1TravelMode] = useState({});

  const updateNestCount = (currentState, key, gender, ageGroup) => {
    const newState = { ...currentState };
    if (!newState[key]) newState[key] = {};
    if (!newState[key][gender]) newState[key][gender] = {};
    if (!newState[key][gender][ageGroup]) newState[key][gender][ageGroup] = 0;
    newState[key][gender][ageGroup] += 1;
    return newState;
  };

  useEffect(() => {
    if (!allResponses || allResponses.length === 0) return;

    let accessMode = {};
    let distance = {};
    let purpose = {};
    let travelMode = {};

    allResponses.forEach((response) => {
      const form1 = response.data.form1Data;
      const form6 = response.data.form6Data;
      if (form1 && form6) {
        const { accessMode: am, distance: dist, purpose: purp, travelMode: tm } = form1;
        const gender = form6.gender;
        const ageGroup = form6.age;

        accessMode = updateNestCount(accessMode, am, gender, ageGroup);
        distance = updateNestCount(distance, dist, gender, ageGroup);
        purpose = updateNestCount(purpose, purp, gender, ageGroup);
        travelMode = updateNestCount(travelMode, tm, gender, ageGroup);
      }
    });

    setForm1AccessMode(accessMode);
    setForm1Distance(distance);
    setForm1Purpose(purpose);
    setForm1TravelMode(travelMode);
  }, [allResponses]);

  useEffect(() => {
    if (Object.keys(form1AccessMode).length && accessModeRef.current) {
      plotGroupedStacked(accessModeRef.current, form1AccessMode, "Access Mode");
    }
  }, [form1AccessMode]);

  useEffect(() => {
    if (Object.keys(form1Distance).length && distanceRef.current) {
      plotGroupedStacked(distanceRef.current, form1Distance, "Distance");
    }
  }, [form1Distance]);

  useEffect(() => {
    if (Object.keys(form1Purpose).length && purposeRef.current) {
      plotGroupedStacked(purposeRef.current, form1Purpose, "Purpose");
    }
  }, [form1Purpose]);

  useEffect(() => {
    if (Object.keys(form1TravelMode).length && travelModeRef.current) {
      plotGroupedStacked(travelModeRef.current, form1TravelMode, "Travel Mode");
    }
  }, [form1TravelMode]);

  return (
    <div className="my-10 scale-90 bg-slate-50 rounded-md p-4">
      <h2 className="font-serif font-bold text-xl mb-4">Form1 Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div ref={accessModeRef} className="bg-slate-200 rounded-md shadow-lg"></div>
        <div ref={distanceRef} className="bg-slate-200 rounded-md shadow-lg"></div>
        <div ref={purposeRef} className="bg-slate-200 rounded-md shadow-lg"></div>
        <div ref={travelModeRef} className="bg-slate-200 rounded-md shadow-lg"></div>
      </div>
    </div>
  );
};

export default Form1_info;
