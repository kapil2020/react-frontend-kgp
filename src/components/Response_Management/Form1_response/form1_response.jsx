import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

/**
 * Flatten nested data from shape:
 *   nestedData[ category ][ gender ][ ageGroup ] = count
 *
 * Into a shape:
 *   flatData[ category ][ sub ] = total_count
 *
 * Where sub is either 'gender' or 'ageGroup' depending on aggregator.
 */
function flattenData(nestedData, aggregator) {
  // aggregator is either 'gender' or 'age'
  const finalData = {};
  const categories = Object.keys(nestedData).sort();
  const subSet = new Set();

  categories.forEach((cat) => {
    finalData[cat] = {};
    const catObj = nestedData[cat] || {};

    // catObj is {male: {18-25: X, 26-40: Y, ...}, female: {...}, ...}
    Object.keys(catObj).forEach((gender) => {
      const ageObj = catObj[gender] || {};
      Object.keys(ageObj).forEach((age) => {
        const count = ageObj[age] || 0;
        if (aggregator === "gender") {
          // aggregator=gender => sub is "male"/"female"/"unknown" etc.
          finalData[cat][gender] = (finalData[cat][gender] || 0) + count;
          subSet.add(gender);
        } else {
          // aggregator=age => sub is the age group "18-25","26-40", etc.
          finalData[cat][age] = (finalData[cat][age] || 0) + count;
          subSet.add(age);
        }
      });
    });
  });

  const subCategories = Array.from(subSet).sort();
  return { categories, subCategories, finalData };
}

/**
 * Draw a horizontal 100%‐stacked chart (no dark background),
 * with sub-segments labeled in percentages.
 */
function plotHorizontalStacked(container, nestedData, aggregator, title) {
  // Flatten the data according to aggregator = 'gender' or 'age'
  const { categories, subCategories, finalData } = flattenData(
    nestedData,
    aggregator
  );

  // Remove any existing SVG
  d3.select(container).select("svg").remove();

  // Dimensions
  const width = 600;
  const height = 40 * categories.length + 80;
  const margin = { top: 40, right: 150, bottom: 40, left: 120 };

  // Create SVG
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // X scale: 0..1 => 0..100%
  const x = d3
    .scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right]);

  // Y scale: each category is a row
  const y = d3
    .scaleBand()
    .domain(categories)
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  // A color scale for subCategories
  // For 'gender', these might be "male"/"female"/"unknown".
  // For 'age', these might be "18-25","26-40", etc.
  const color = d3
    .scaleOrdinal()
    .domain(subCategories)
    .range(d3.schemeDark2); // or any palette you like

  // For each category, stack subCategories horizontally
  categories.forEach((cat) => {
    const rowObj = finalData[cat];
    const totalCount = Object.values(rowObj).reduce((sum, v) => sum + v, 0);
    if (!totalCount) return;

    let cumulative = 0;
    subCategories.forEach((sub) => {
      const val = rowObj[sub] || 0;
      if (!val) return;
      const proportion = val / totalCount;
      const xStart = x(cumulative);
      const xEnd = x(cumulative + proportion);

      // Draw the rectangle
      svg
        .append("rect")
        .attr("x", xStart)
        .attr("y", y(cat))
        .attr("width", xEnd - xStart)
        .attr("height", y.bandwidth())
        .attr("fill", color(sub));

      // Optionally, label the sub-segment with % if wide enough
      const segmentWidth = xEnd - xStart;
      if (segmentWidth > 20) {
        svg
          .append("text")
          .attr("x", (xStart + xEnd) / 2)
          .attr("y", y(cat) + y.bandwidth() / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .style("font-size", "11px")
          .style("fill", "white")
          .text(d3.format(".0%")(proportion));
      }
      cumulative += proportion;
    });
  });

  // X Axis (percent)
  const xAxis = d3.axisBottom(x).tickFormat(d3.format(".0%")).ticks(5);
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  // Y Axis (category labels)
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
      (width - margin.left - margin.right) / 2 + margin.left
    )
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(title);

  // Legend (top-right)
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - margin.right + 10},${margin.top})`);

  let legendY = 0;
  subCategories.forEach((sub) => {
    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", legendY)
      .attr("width", 14)
      .attr("height", 14)
      .attr("fill", color(sub));

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", legendY + 7)
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .text(sub);

    legendY += 20;
  });
}

const Form1_info = ({ allResponses }) => {
  // We still create four nestedData objects as you did before
  const [form1_accessmode, setForm1_AccessMode] = useState({});
  const [form1_distance, setForm1_Distance] = useState({});
  const [form1_purpose, setForm1_Purpose] = useState({});
  const [form1_travel_mode, setForm1_TravelMode] = useState({});

  // Refs for charts
  // We'll create EIGHT refs (two for each dimension: one by gender, one by age)
  const accessModeRefGender = useRef();
  const accessModeRefAge = useRef();

  const distanceRefGender = useRef();
  const distanceRefAge = useRef();

  const purposeRefGender = useRef();
  const purposeRefAge = useRef();

  const travelModeRefGender = useRef();
  const travelModeRefAge = useRef();

  const demographicsRef = useRef();

  // Pie Chart of overall gender (same as before)
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

  // Same aggregator logic as before
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

  // Build nested data objects once
  useEffect(() => {
    if (!allResponses || !allResponses.length) return;

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

  // Plot the pie chart once we have data
  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      plotDemographics(demographicsRef.current, allResponses);
    }
  }, [allResponses]);

  // Plot each dimension in two ways: aggregator='gender' & aggregator='age'
  useEffect(() => {
    if (!Object.keys(form1_accessmode).length) return;

    plotHorizontalStacked(
      accessModeRefGender.current,
      form1_accessmode,
      "gender",
      "Access Mode by Gender"
    );
    plotHorizontalStacked(
      accessModeRefAge.current,
      form1_accessmode,
      "age",
      "Access Mode by Age Group"
    );
  }, [form1_accessmode]);

  useEffect(() => {
    if (!Object.keys(form1_distance).length) return;

    plotHorizontalStacked(
      distanceRefGender.current,
      form1_distance,
      "gender",
      "Distance by Gender"
    );
    plotHorizontalStacked(
      distanceRefAge.current,
      form1_distance,
      "age",
      "Distance by Age Group"
    );
  }, [form1_distance]);

  useEffect(() => {
    if (!Object.keys(form1_purpose).length) return;

    plotHorizontalStacked(
      purposeRefGender.current,
      form1_purpose,
      "gender",
      "Purpose by Gender"
    );
    plotHorizontalStacked(
      purposeRefAge.current,
      form1_purpose,
      "age",
      "Purpose by Age Group"
    );
  }, [form1_purpose]);

  useEffect(() => {
    if (!Object.keys(form1_travel_mode).length) return;

    plotHorizontalStacked(
      travelModeRefGender.current,
      form1_travel_mode,
      "gender",
      "Travel Mode by Gender"
    );
    plotHorizontalStacked(
      travelModeRefAge.current,
      form1_travel_mode,
      "age",
      "Travel Mode by Age Group"
    );
  }, [form1_travel_mode]);

  // Render
  return (
    <div className="my-10 bg-white text-black rounded-md p-4">
      <h2 className="font-serif font-bold text-xl mb-4">Form1 Information</h2>

      {/* Demographics (Pie Chart) */}
      <div className="mb-8 flex flex-col items-center">
        <h3 className="font-serif font-semibold text-lg mb-2 text-center">
          Overall Gender Distribution
        </h3>
        <div
          ref={demographicsRef}
          className="rounded-md shadow-lg m-2 w-full max-w-[300px]"
        ></div>
      </div>

      {/* Each dimension: two horizontal charts (by gender, by age group) */}
      <h3 className="font-semibold text-lg mt-8">Access Mode</h3>
      <div className="grid grid-cols-2 gap-4">
        <div ref={accessModeRefGender} className="rounded-md shadow-lg" />
        <div ref={accessModeRefAge} className="rounded-md shadow-lg" />
      </div>

      <h3 className="font-semibold text-lg mt-8">Distance</h3>
      <div className="grid grid-cols-2 gap-4">
        <div ref={distanceRefGender} className="rounded-md shadow-lg" />
        <div ref={distanceRefAge} className="rounded-md shadow-lg" />
      </div>

      <h3 className="font-semibold text-lg mt-8">Purpose</h3>
      <div className="grid grid-cols-2 gap-4">
        <div ref={purposeRefGender} className="rounded-md shadow-lg" />
        <div ref={purposeRefAge} className="rounded-md shadow-lg" />
      </div>

      <h3 className="font-semibold text-lg mt-8">Travel Mode</h3>
      <div className="grid grid-cols-2 gap-4">
        <div ref={travelModeRefGender} className="rounded-md shadow-lg" />
        <div ref={travelModeRefAge} className="rounded-md shadow-lg" />
      </div>
    </div>
  );
};

export default Form1_info;
