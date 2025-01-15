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

  const width = 800;
  const height = 400;
  const margin = { top: 40, right: 200, bottom: 80, left: 50 };

  d3.select(container).select("svg").remove();

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

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

  const baseColors = {
    male: "blue",
    female: "#F8766D",
    other: "green",
  };

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
            .attr("fill", baseColors[g] || "grey")
            .attr("fill-opacity", 0.3 + (0.7 * (i + 1)) / ageGroups.length);
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

  // Refined Legend: Grouped by gender with age groups listed
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - margin.right + 20},${margin.top})`);

  let legendYOffset = 0;

  genders.forEach((g) => {
    const genderGroup = legend.append("g");

    // Gender label header
    genderGroup
      .append("text")
      .attr("x", 0)
      .attr("y", legendYOffset)
      .style("font-weight", "bold")
      .text(g);
    legendYOffset += 20;

    ageGroups.forEach((ag, i) => {
      // Colored rectangle for age group under the current gender
      genderGroup
        .append("rect")
        .attr("x", 0)
        .attr("y", legendYOffset)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", baseColors[g])
        .attr("fill-opacity", 0.3 + (0.7 * (i + 1)) / ageGroups.length);

      // Label text for the age group
      genderGroup
        .append("text")
        .attr("x", 24)
        .attr("y", legendYOffset + 9)
        .attr("dy", "0.35em")
        .text(ag);

      legendYOffset += 20;
    });

    legendYOffset += 10; // Extra spacing after each gender group
  });
}

const Form1_info = ({ allResponses }) => {
  const [form1_accessmode, setForm1_AccessMode] = useState({});
  const [form1_distance, setForm1_Distance] = useState({});
  const [form1_purpose, setForm1_Purpose] = useState({});
  const [form1_travel_mode, setForm1_TravelMode] = useState({});

  const accessModeRef = useRef();
  const distanceRef = useRef();
  const purposeRef = useRef();
  const travelModeRef = useRef();
  const demographicsRef = useRef();

  const plotDemographics = (container, allResponses) => {
    if (!container) return;

    // Clear any existing content
    d3.select(container).selectAll("*").remove();

    // Aggregate gender distribution
    const genderCount = {};
    allResponses.forEach((response) => {
      const form6 = response.data.form6Data;
      if (form6) {
        const gender = form6.gender || "unknown";
        genderCount[gender] = (genderCount[gender] || 0) + 1;
      }
    });

    const data = Object.keys(genderCount).map((g) => ({
      label: g,
      value: genderCount[g],
    }));

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const arc = d3
      .arc()
      .outerRadius(radius - 10)
      .innerRadius(0);
    const pie = d3.pie().value((d) => d.value);

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

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
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("dy", ".35em")
      .style("font-size", "12px")
      .style("text-anchor", "middle")
      .text((d) => d.data.label);
  };

  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      plotDemographics(demographicsRef.current, allResponses);
    }
  }, [allResponses]);

  // Helper to update nested counts for given variable
  function updateNestCount(currentState, key, gender, ageGroup) {
    const newState = { ...currentState };
    if (!newState[key]) newState[key] = {};
    if (!newState[key][gender]) newState[key][gender] = {};
    if (!newState[key][gender][ageGroup]) newState[key][gender][ageGroup] = 0;
    newState[key][gender][ageGroup] += 1;
    return newState;
  }

  // Aggregate data for each variable on mount/update
  useEffect(() => {
    if (!allResponses || allResponses.length === 0) return;

    let accessModeObj = {};
    let distanceObj = {};
    let purposeObj = {};
    let travelModeObj = {};

    allResponses.forEach((response) => {
      const form1 = response.data.form1Data;
      const form6 = response.data.form6Data;
      if (form1 && form6) {
        const { accessMode, distance, purpose, travelMode } = form1;
        const gender = form6.gender;
        const ageGroup = form6.age;

        accessModeObj = updateNestCount(
          accessModeObj,
          accessMode,
          gender,
          ageGroup
        );
        distanceObj = updateNestCount(distanceObj, distance, gender, ageGroup);
        purposeObj = updateNestCount(purposeObj, purpose, gender, ageGroup);
        travelModeObj = updateNestCount(
          travelModeObj,
          travelMode,
          gender,
          ageGroup
        );
      }
    });

    setForm1_AccessMode(accessModeObj);
    setForm1_Distance(distanceObj);
    setForm1_Purpose(purposeObj);
    setForm1_TravelMode(travelModeObj);
  }, [allResponses]);

  // Plot each chart when data is ready
  useEffect(() => {
    if (Object.keys(form1_accessmode).length && accessModeRef.current) {
      plotGroupedStacked(
        accessModeRef.current,
        form1_accessmode,
        "Access Mode"
      );
    }
  }, [form1_accessmode]);

  useEffect(() => {
    if (Object.keys(form1_distance).length && distanceRef.current) {
      plotGroupedStacked(distanceRef.current, form1_distance, "Distance");
    }
  }, [form1_distance]);

  useEffect(() => {
    if (Object.keys(form1_purpose).length && purposeRef.current) {
      plotGroupedStacked(purposeRef.current, form1_purpose, "Purpose");
    }
  }, [form1_purpose]);

  useEffect(() => {
    if (Object.keys(form1_travel_mode).length && travelModeRef.current) {
      plotGroupedStacked(
        travelModeRef.current,
        form1_travel_mode,
        "Travel Mode"
      );
    }
  }, [form1_travel_mode]);

  return (
    <div className="my-10 scale-90 bg-slate-50 rounded-md p-4">
      <h2 className="font-serif font-bold text-xl mb-4">Form1 Information</h2>

      {/* Add Demographics section first */}
      <div className="mb-8 flex flex-col items-center">
        <h3 className="font-serif font-semibold text-lg mb-2 text-center">
          Demographics Overview
        </h3>
        <div
          ref={demographicsRef}
          className="bg-slate-200 rounded-md shadow-lg m-2 w-full max-w-[300px]"
        ></div>
      </div>

      {/* Existing grid layout */}
      <div className="grid grid-cols-2">
        <div>
          <div
            ref={accessModeRef}
            className="bg-slate-200 rounded-md shadow-lg m-2"
          ></div>
        </div>
        <div>
          <div
            ref={distanceRef}
            // className="bg-slate-200 rounded-md shadow-lg"
            className="bg-slate-200 rounded-md shadow-lg m-2"
          ></div>
        </div>
        <div>
          <div
            ref={purposeRef}
            // className="bg-slate-200 rounded-md shadow-lg"
            className="bg-slate-200 rounded-md shadow-lg m-2"
          ></div>
        </div>
        <div>
          <div
            ref={travelModeRef}
            className="bg-slate-200 rounded-md shadow-lg m-2"
            // className="bg-slate-200 rounded-md shadow-lg"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Form1_info;
