import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

/** 
 * Flatten nestedData from shape:
 *    nestedData[category][gender][ageGroup] = count
 * into shape:
 *    flattenedData[category][gender] = total_count (summed across ageGroups)
 *
 * That way, each category becomes one horizontal bar,
 * stacked by "gender" as the sub-categories. If you
 * prefer to split by (gender+ageGroup), see the notes below.
 */
function flattenDataByGender(nestedData) {
  const finalData = {};
  const categories = Object.keys(nestedData).sort();

  const genderSet = new Set();

  categories.forEach((cat) => {
    finalData[cat] = {};
    const catObj = nestedData[cat] || {};
    Object.keys(catObj).forEach((gender) => {
      const ageObj = catObj[gender] || {};
      const totalForGender = Object.values(ageObj).reduce((a, b) => a + b, 0);
      finalData[cat][gender] = (finalData[cat][gender] || 0) + totalForGender;
      genderSet.add(gender);
    });
  });

  const subCategories = Array.from(genderSet).sort();

  return { categories, subCategories, finalData };
}

/**
 * Draw a horizontal 100%-stacked bar chart:
 *    - Each "category" is a horizontal row.
 *    - Each row is split among subCategories (e.g., genders).
 *    - x-axis is 0..100% and uses .0% formatting.
 *    - y-axis lists the categories top-to-bottom.
 *    - Dark color palette for subCategories.
 */
function plotHorizontalStacked(container, nestedData, title) {
  // Flatten to: finalData[category][subCategory] = count
  const { categories, subCategories, finalData } = flattenDataByGender(nestedData);

  // Remove any existing chart inside container
  d3.select(container).select("svg").remove();

  // Dimensions & margins
  const width = 700;
  // 40 px per category row, plus top/bottom margin
  const height = 40 * categories.length + 100;
  const margin = { top: 50, right: 180, bottom: 50, left: 120 };

  // Create SVG
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // X scale (0..1 => 0..100%)
  const x = d3.scaleLinear().domain([0, 1]).range([margin.left, width - margin.right]);

  // Y scale for categories (top-to-bottom)
  const y = d3
    .scaleBand()
    .domain(categories)
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  // Dark color palette for subCategories (ggplot-like "Dark2" vibes)
  const color = d3
    .scaleOrdinal()
    .domain(subCategories)
    .range([
      "#1B9E77",
      "#D95F02",
      "#7570B3",
      "#E7298A",
      "#66A61E",
      "#E6AB02",
      "#A6761D",
      "#666666",
      // add more if you have many sub-categories
    ]);

  // For each category (row), stack subCategories from left to right
  categories.forEach((cat) => {
    const rowData = finalData[cat];
    const totalCount = Object.values(rowData).reduce((a, b) => a + b, 0);
    if (totalCount <= 0) return;

    let cumulative = 0;
    subCategories.forEach((sub) => {
      const value = rowData[sub] || 0;
      if (!value) return;
      const proportion = value / totalCount;

      const xStart = x(cumulative);
      const xEnd = x(cumulative + proportion);

      svg
        .append("rect")
        .attr("x", xStart)
        .attr("y", y(cat))
        .attr("width", xEnd - xStart)
        .attr("height", y.bandwidth())
        .attr("fill", color(sub));
      cumulative += proportion;
    });
  });

  // X Axis in percentages
  const xAxis = d3.axisBottom(x).tickFormat(d3.format(".0%")).ticks(5);
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  // Y Axis with category labels
  const yAxis = d3.axisLeft(y);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  // Title at top center
  svg
    .append("text")
    .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", "#ccc")
    .text(title);

  // Legend in top-right corner
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - margin.right + 10},${margin.top})`);

  let legendYOffset = 0;
  subCategories.forEach((sub) => {
    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", legendYOffset)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color(sub));

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", legendYOffset + 7.5)
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .style("fill", "#ccc")
      .text(sub);

    legendYOffset += 20;
  });

  // Optional: Set a darker background to give a "dark theme" look
  // (You can remove or customize this if you don't want a dark BG.)
  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "#2b2b2b")
    .lower(); // send to back

  // Re-color axis text and lines for dark background
  svg.selectAll(".domain, .tick line").attr("stroke", "#ccc");
  svg.selectAll("text").attr("fill", "#ccc");
}

/**
 * Example "Form1_info" component that:
 *  1) Aggregates data from allResponses into nested objects.
 *  2) Plots a demographics pie chart (by gender).
 *  3) Plots four horizontal 100%-stacked charts for:
 *     Access Mode, Distance, Purpose, Travel Mode
 */
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

  // Simple Pie Chart to show overall gender distribution
  const plotDemographics = (container, allResponses) => {
    if (!container) return;

    d3.select(container).selectAll("*").remove();
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

  /**
   * Helper to increment the nested counts:
   *   currentState[ key ][ gender ][ ageGroup ] += 1
   */
  function updateNestCount(currentState, key, gender, ageGroup) {
    const newState = { ...currentState };
    if (!newState[key]) newState[key] = {};
    if (!newState[key][gender]) newState[key][gender] = {};
    if (!newState[key][gender][ageGroup]) {
      newState[key][gender][ageGroup] = 0;
    }
    newState[key][gender][ageGroup] += 1;
    return newState;
  }

  // Gather nested data
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

  // Once we have data, draw the small demographics Pie
  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      plotDemographics(demographicsRef.current, allResponses);
    }
  }, [allResponses]);

  // Draw horizontal 100%-stacked for each dimension
  useEffect(() => {
    if (Object.keys(form1_accessmode).length && accessModeRef.current) {
      plotHorizontalStacked(accessModeRef.current, form1_accessmode, "Access Mode");
    }
  }, [form1_accessmode]);

  useEffect(() => {
    if (Object.keys(form1_distance).length && distanceRef.current) {
      plotHorizontalStacked(distanceRef.current, form1_distance, "Distance");
    }
  }, [form1_distance]);

  useEffect(() => {
    if (Object.keys(form1_purpose).length && purposeRef.current) {
      plotHorizontalStacked(purposeRef.current, form1_purpose, "Purpose");
    }
  }, [form1_purpose]);

  useEffect(() => {
    if (Object.keys(form1_travel_mode).length && travelModeRef.current) {
      plotHorizontalStacked(travelModeRef.current, form1_travel_mode, "Travel Mode");
    }
  }, [form1_travel_mode]);

  // Render layout
  return (
    <div className="my-10 scale-90 bg-slate-800 text-white rounded-md p-4">
      <h2 className="font-serif font-bold text-xl mb-4">Form1 Information</h2>

      {/* Demographics (Pie) */}
      <div className="mb-8 flex flex-col items-center">
        <h3 className="font-serif font-semibold text-lg mb-2 text-center">
          Demographics Overview
        </h3>
        <div
          ref={demographicsRef}
          className="rounded-md shadow-lg m-2 w-full max-w-[300px] bg-gray-100"
        ></div>
      </div>

      {/* Four horizontal stacked charts */}
      <div className="grid grid-cols-2 gap-4">
        <div
          ref={accessModeRef}
          className="rounded-md shadow-lg bg-gray-100"
          style={{ minHeight: "300px" }}
        ></div>
        <div
          ref={distanceRef}
          className="rounded-md shadow-lg bg-gray-100"
          style={{ minHeight: "300px" }}
        ></div>
        <div
          ref={purposeRef}
          className="rounded-md shadow-lg bg-gray-100"
          style={{ minHeight: "300px" }}
        ></div>
        <div
          ref={travelModeRef}
          className="rounded-md shadow-lg bg-gray-100"
          style={{ minHeight: "300px" }}
        ></div>
      </div>
    </div>
  );
};

export default Form1_info;
