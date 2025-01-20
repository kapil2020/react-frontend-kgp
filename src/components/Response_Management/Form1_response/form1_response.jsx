import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

/** Safely increment nested[dim][gender][age][income] = count */
function updateNestedCount(nested, dim, g, a, inc) {
  if (!nested[dim]) nested[dim] = {};
  if (!nested[dim][g]) nested[dim][g] = {};
  if (!nested[dim][g][a]) nested[dim][g][a] = {};
  if (!nested[dim][g][a][inc]) nested[dim][g][a][inc] = 0;
  nested[dim][g][a][inc] += 1;
}

/**
 * Flatten the 4D nested object into a 2D structure:
 * finalData[category][sub] = count
 * where sub depends on aggregator = "gender"|"age"|"income".
 */
function flattenData(nestedData, aggregator) {
  const categories = Object.keys(nestedData).sort();
  const subSet = new Set();
  const finalData = {};

  categories.forEach((cat) => {
    finalData[cat] = {};
    const catObj = nestedData[cat]; // => { g: { a: { inc: count } } }

    Object.keys(catObj).forEach((g) => {
      Object.keys(catObj[g]).forEach((a) => {
        Object.keys(catObj[g][a]).forEach((inc) => {
          const count = catObj[g][a][inc] || 0;
          if (!count) return;
          let subKey;
          if (aggregator === "gender") subKey = g;
          else if (aggregator === "age") subKey = a;
          else subKey = inc; // aggregator === "income"

          finalData[cat][subKey] = (finalData[cat][subKey] || 0) + count;
          subSet.add(subKey);
        });
      });
    });
  });

  const subCategories = Array.from(subSet).sort();
  return { categories, subCategories, finalData };
}

/**
 * Draw a responsive, horizontal 100%-stacked chart with extra base size
 * so labels won't be cut off. If there are no categories, it shows an empty axis.
 */
function plotHorizontalStacked(container, nestedData, aggregator, title) {
  // Flatten
  const { categories, subCategories, finalData } = flattenData(
    nestedData,
    aggregator
  );

  // Clear old
  d3.select(container).select("svg").remove();

  // If no categories, optionally warn
  if (!categories.length) {
    console.warn(`No data found for "${title}" (aggregator: ${aggregator}).`);
  }

  // Larger base dims
  const baseWidth = 1200;
  // Use # of categories to scale height, ensure at least 250
  const baseHeight = Math.max(60 * categories.length + 150, 250);
  const margin = { top: 50, right: 250, bottom: 60, left: 180 };

  // Responsive SVG
  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${baseWidth} ${baseHeight}`)
    .style("width", "100%")
    .style("height", "auto")
    // Optional: ensure there's some minimum height in CSS
    .style("min-height", "300px");

  // Scales
  const x = d3.scaleLinear().domain([0, 1]).range([
    margin.left,
    baseWidth - margin.right,
  ]);

  const y = d3.scaleBand()
    .domain(categories)
    .range([margin.top, baseHeight - margin.bottom])
    .padding(0.2);

  // Color scale
  const color = d3
    .scaleOrdinal()
    .domain(subCategories)
    .range(d3.schemeDark2);

  // Draw
  categories.forEach((cat) => {
    const rowObj = finalData[cat];
    const total = Object.values(rowObj).reduce((acc, v) => acc + v, 0);
    if (!total) return;

    let cumulative = 0;
    subCategories.forEach((sub) => {
      const val = rowObj[sub] || 0;
      if (!val) return;

      const proportion = val / total;
      const xStart = x(cumulative);
      const xEnd = x(cumulative + proportion);

      svg
        .append("rect")
        .attr("x", xStart)
        .attr("y", y(cat))
        .attr("width", xEnd - xStart)
        .attr("height", y.bandwidth())
        .attr("fill", color(sub));

      // Put a label if wide enough
      if (xEnd - xStart > 45) {
        svg
          .append("text")
          .attr("x", (xStart + xEnd) / 2)
          .attr("y", y(cat) + y.bandwidth() / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("fill", "#fff")
          .text(d3.format(".0%")(proportion));
      }
      cumulative += proportion;
    });
  });

  // Axes
  const xAxis = d3.axisBottom(x).tickFormat(d3.format(".0%")).ticks(8);
  svg
    .append("g")
    .attr("transform", `translate(0,${baseHeight - margin.bottom})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(y);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  // Title
  svg
    .append("text")
    .attr(
      "x",
      (baseWidth - margin.left - margin.right) / 2 + margin.left
    )
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text(title);

  // Legend
  const legend = svg
    .append("g")
    .attr("transform", `translate(${baseWidth - margin.right + 15},${margin.top})`);

  let legendY = 0;
  subCategories.forEach((sub) => {
    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", legendY)
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", color(sub));

    legend
      .append("text")
      .attr("x", 24)
      .attr("y", legendY + 8)
      .attr("dy", "0.35em")
      .style("font-size", "13px")
      .text(sub);

    legendY += 22;
  });
}

// Simple Pie Chart for overall gender
function plotDemographics(container, allResponses) {
  if (!container) return;
  d3.select(container).selectAll("*").remove();

  const genderCount = {};
  allResponses.forEach((resp) => {
    const g = resp.data?.form6Data?.gender || "unknown";
    genderCount[g] = (genderCount[g] || 0) + 1;
  });

  const data = Object.entries(genderCount).map(([label, value]) => ({
    label,
    value,
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
}

// Main component
const Form1_info = ({ allResponses }) => {
  const [form1Data, setForm1Data] = useState({});

  // Aggregators: "gender", "age", "income"
  // We have 4 dimensions => 3 aggregator plots each => total 12 charts

  // Refs
  const accessModeRefGender = useRef();
  const accessModeRefAge = useRef();
  const accessModeRefIncome = useRef();

  const distanceRefGender = useRef();
  const distanceRefAge = useRef();
  const distanceRefIncome = useRef();

  const purposeRefGender = useRef();
  const purposeRefAge = useRef();
  const purposeRefIncome = useRef();

  const travelModeRefGender = useRef();
  const travelModeRefAge = useRef();
  const travelModeRefIncome = useRef();

  const demographicsRef = useRef();

  // Build nested data
  useEffect(() => {
    if (!allResponses || !allResponses.length) return;

    const nested = {};
    allResponses.forEach((response) => {
      const form1 = response.data?.form1Data;
      const form6 = response.data?.form6Data;
      if (!form1 || !form6) return;

      const { accessMode, distance, purpose, travelMode } = form1;
      const gender = form6.gender || "unknown";
      const ageGroup = form6.age || "unknown";
      const income = form6.income || "unknown";

      // Increment
      updateNestedCount(nested, accessMode, gender, ageGroup, income);
      updateNestedCount(nested, distance, gender, ageGroup, income);
      updateNestedCount(nested, purpose, gender, ageGroup, income);
      updateNestedCount(nested, travelMode, gender, ageGroup, income);
    });

    setForm1Data(nested);
  }, [allResponses]);

  // Plot demographics pie
  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      plotDemographics(demographicsRef.current, allResponses);
    }
  }, [allResponses]);

  // For your dimension categories, be sure they match your actual data keys:
  const accessModeCats = ["car", "bus", "metro", "walk", "bicycle", "auto"];
  const distanceCats = ["<1km", "1-5km", "5-10km", ">10km"];
  const purposeCats = ["work", "school", "shopping", "other"];
  const travelModeCats = ["car", "bus", "metro", "walk", "bicycle", "auto"];

  // Filter dimension from form1Data
  function filterDimension(catKeys) {
    const subObj = {};
    catKeys.forEach((k) => {
      if (form1Data[k]) {
        subObj[k] = form1Data[k];
      }
    });
    return subObj;
  }

  // Plot once form1Data is ready
  useEffect(() => {
    if (!Object.keys(form1Data).length) return;

    // Access mode data => aggregator=gender, age, income
    const accessModeData = filterDimension(accessModeCats);
    plotHorizontalStacked(accessModeRefGender.current, accessModeData, "gender", "Access Mode by Gender");
    plotHorizontalStacked(accessModeRefAge.current,    accessModeData, "age",    "Access Mode by Age");
    plotHorizontalStacked(accessModeRefIncome.current, accessModeData, "income", "Access Mode by Income");

    // Distance data
    const distanceData = filterDimension(distanceCats);
    plotHorizontalStacked(distanceRefGender.current, distanceData, "gender", "Distance by Gender");
    plotHorizontalStacked(distanceRefAge.current,    distanceData, "age",    "Distance by Age");
    plotHorizontalStacked(distanceRefIncome.current, distanceData, "income", "Distance by Income");

    // Purpose
    const purposeData = filterDimension(purposeCats);
    plotHorizontalStacked(purposeRefGender.current, purposeData, "gender", "Purpose by Gender");
    plotHorizontalStacked(purposeRefAge.current,    purposeData, "age",    "Purpose by Age");
    plotHorizontalStacked(purposeRefIncome.current, purposeData, "income", "Purpose by Income");

    // Travel Mode
    const travelModeData = filterDimension(travelModeCats);
    plotHorizontalStacked(travelModeRefGender.current, travelModeData, "gender", "Travel Mode by Gender");
    plotHorizontalStacked(travelModeRefAge.current,    travelModeData, "age",    "Travel Mode by Age");
    plotHorizontalStacked(travelModeRefIncome.current, travelModeData, "income", "Travel Mode by Income");
  }, [form1Data]);

  return (
    <div className="my-10 bg-white text-black p-4 w-full">
      <h2 className="font-serif font-bold text-xl mb-4">Form1 Information</h2>

      {/* Demographics Pie */}
      <div className="mb-8 flex flex-col items-center">
        <h3 className="font-serif font-semibold text-lg mb-2 text-center">
          Overall Gender Distribution
        </h3>
        <div ref={demographicsRef} className="rounded-md shadow-lg m-2 w-full max-w-[300px]" />
      </div>

      {/* Access Mode: 3 charts */}
      <h3 className="font-semibold text-lg mt-6">Access Mode</h3>
      <div className="grid grid-cols-1 gap-4 mt-2">
        <div ref={accessModeRefGender} className="rounded-md shadow-lg" />
        <div ref={accessModeRefAge} className="rounded-md shadow-lg" />
        <div ref={accessModeRefIncome} className="rounded-md shadow-lg" />
      </div>

      {/* Distance: 3 charts */}
      <h3 className="font-semibold text-lg mt-6">Distance</h3>
      <div className="grid grid-cols-1 gap-4 mt-2">
        <div ref={distanceRefGender} className="rounded-md shadow-lg" />
        <div ref={distanceRefAge} className="rounded-md shadow-lg" />
        <div ref={distanceRefIncome} className="rounded-md shadow-lg" />
      </div>

      {/* Purpose: 3 charts */}
      <h3 className="font-semibold text-lg mt-6">Purpose</h3>
      <div className="grid grid-cols-1 gap-4 mt-2">
        <div ref={purposeRefGender} className="rounded-md shadow-lg" />
        <div ref={purposeRefAge} className="rounded-md shadow-lg" />
        <div ref={purposeRefIncome} className="rounded-md shadow-lg" />
      </div>

      {/* Travel Mode: 3 charts */}
      <h3 className="font-semibold text-lg mt-6">Travel Mode</h3>
      <div className="grid grid-cols-1 gap-4 mt-2">
        <div ref={travelModeRefGender} className="rounded-md shadow-lg" />
        <div ref={travelModeRefAge} className="rounded-md shadow-lg" />
        <div ref={travelModeRefIncome} className="rounded-md shadow-lg" />
      </div>
    </div>
  );
};

export default Form1_info;
