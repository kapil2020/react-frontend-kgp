import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// --- Updated function to create a 100% grouped stacked chart with ggplot-like colors ---
function plotGroupedStacked(container, nestedData, title) {
  // Gather the "categories" (x-axis groups), "genders" (sub-groups), and "ageGroups" (stack layers).
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

  // Instead of finding a max sum, for 100%-stacked we fix y-domain to [0, 1].
  const yMax = 1;

  // Dimensions & margins
  const width = 800;
  const height = 400;
  const margin = { top: 40, right: 200, bottom: 80, left: 50 };

  // Remove any existing chart in container
  d3.select(container).select("svg").remove();

  // Append the SVG
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // X scales: 
  //   x0 for the main categories 
  //   x1 for the sub-group (genders) within each category
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

  // Y scale from [0,1] for proportions
  const y = d3
    .scaleLinear()
    .domain([0, yMax])
    .range([height - margin.bottom, margin.top]);

  // ggplot-like color palette for each GENDER
  // (You can adjust these as desired.)
  const genderColors = {
    male: "#00BFC4",
    female: "#F8766D",
    other: "#7CAE00",
    unknown: "#C77CFF", // fallback if needed
  };

  // Create grouped + 100% stacked bars
  categories.forEach((cat) => {
    const catGroup = svg
      .append("g")
      .attr("transform", `translate(${x0(cat)}, 0)`);

    genders.forEach((g) => {
      const data = nestedData[cat][g] || {};
      // Sum all age groups for this category+gender
      const total = ageGroups.reduce((sum, ag) => sum + (data[ag] || 0), 0);

      // If total is 0, skip to avoid division by zero
      if (!total) return;

      let cumulative = 0; // track cumulative proportion

      ageGroups.forEach((ag, i) => {
        const value = data[ag] || 0;
        if (value > 0) {
          const proportion = value / total; // portion of the 100%
          const yStart = y(cumulative + proportion);
          const yEnd = y(cumulative);

          catGroup
            .append("rect")
            .attr("x", x1(g))
            .attr("y", yStart)
            .attr("width", x1.bandwidth())
            .attr("height", yEnd - yStart)
            // Use the gender color as base
            .attr("fill", genderColors[g] || genderColors.unknown)
            // Slightly vary the opacity with the index for visual distinction
            .attr("fill-opacity", 0.3 + (0.7 * (i + 1)) / ageGroups.length);

          cumulative += proportion;
        }
      });
    });
  });

  // Add X axis
  const xAxis = d3.axisBottom(x0);
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis (in percentages for 100%-stacked)
  const yAxis = d3.axisLeft(y).tickFormat(d3.format(".0%"));
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  // Chart title
  svg
    .append("text")
    .attr("x", (width - margin.right) / 2 + margin.left)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(title);

  // ----- Legend -----
  // We'll keep a gender-based legend with sub-entries for age groups (opacity).
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
      genderGroup
        .append("rect")
        .attr("x", 0)
        .attr("y", legendYOffset)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", genderColors[g] || genderColors.unknown)
        .attr("fill-opacity", 0.3 + (0.7 * (i + 1)) / ageGroups.length);

      genderGroup
        .append("text")
        .attr("x", 24)
        .attr("y", legendYOffset + 9)
        .attr("dy", "0.35em")
        .text(ag);

      legendYOffset += 20;
    });
    legendYOffset += 10; // extra spacing
  });
}

// ----------------------------------------------------------------------
// Sample usage in your Form1_info component
// ----------------------------------------------------------------------
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

    d3.select(container).selectAll("*").remove();

    // Example: Plot a quick Pie of genders
    const genderCount = {};
    allResponses.forEach((response) => {
      const form6 = response.data.form6Data;
      if (form6) {
        const gender = form6.gender || "unknown";
        genderCount[gender] = (genderCount[gender] || 0) + 1;
      }
    });

    const data = Object.entries(genderCount).map(([g, count]) => ({
      label: g,
      value: count,
    }));

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(d3.schemeSet2);
    const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
    const pie = d3.pie().value((d) => d.value);

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

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

  // Aggregate nested data
  useEffect(() => {
    if (!allResponses || allResponses.length === 0) return;

    function updateNestCount(currentState, key, gender, ageGroup) {
      const newState = { ...currentState };
      if (!newState[key]) newState[key] = {};
      if (!newState[key][gender]) newState[key][gender] = {};
      if (!newState[key][gender][ageGroup]) newState[key][gender][ageGroup] = 0;
      newState[key][gender][ageGroup] += 1;
      return newState;
    }

    let accessModeObj = {};
    let distanceObj = {};
    let purposeObj = {};
    let travelModeObj = {};

    allResponses.forEach((response) => {
      const form1 = response.data.form1Data;
      const form6 = response.data.form6Data;
      if (form1 && form6) {
        const { accessMode, distance, purpose, travelMode } = form1;
        const gender = form6.gender || "unknown";
        const ageGroup = form6.age || "unknown";

        accessModeObj = updateNestCount(accessModeObj, accessMode, gender, ageGroup);
        distanceObj = updateNestCount(distanceObj, distance, gender, ageGroup);
        purposeObj = updateNestCount(purposeObj, purpose, gender, ageGroup);
        travelModeObj = updateNestCount(travelModeObj, travelMode, gender, ageGroup);
      }
    });

    setForm1_AccessMode(accessModeObj);
    setForm1_Distance(distanceObj);
    setForm1_Purpose(purposeObj);
    setForm1_TravelMode(travelModeObj);
  }, [allResponses]);

  // Plot demographics (pie) once data is ready
  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      plotDemographics(demographicsRef.current, allResponses);
    }
  }, [allResponses]);

  // Plot each 100%-stacked grouped bar chart
  useEffect(() => {
    if (Object.keys(form1_accessmode).length && accessModeRef.current) {
      plotGroupedStacked(accessModeRef.current, form1_accessmode, "Access Mode");
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
      plotGroupedStacked(travelModeRef.current, form1_travel_mode, "Travel Mode");
    }
  }, [form1_travel_mode]);

  // Render
  return (
    <div className="my-10 scale-90 bg-slate-50 rounded-md p-4">
      <h2 className="font-serif font-bold text-xl mb-4">Form1 Information</h2>

      {/* Demographics Overview (Pie) */}
      <div className="mb-8 flex flex-col items-center">
        <h3 className="font-serif font-semibold text-lg mb-2 text-center">
          Demographics Overview
        </h3>
        <div
          ref={demographicsRef}
          className="bg-slate-200 rounded-md shadow-lg m-2 w-full max-w-[300px]"
        ></div>
      </div>

      {/* Grid layout for the 100%-stacked grouped bar charts */}
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
            className="bg-slate-200 rounded-md shadow-lg m-2"
          ></div>
        </div>
        <div>
          <div
            ref={purposeRef}
            className="bg-slate-200 rounded-md shadow-lg m-2"
          ></div>
        </div>
        <div>
          <div
            ref={travelModeRef}
            className="bg-slate-200 rounded-md shadow-lg m-2"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Form1_info;
