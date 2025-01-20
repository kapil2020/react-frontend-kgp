import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

/** 
 * We'll store *all* responses in a single 4D nested object:
 *   nestedData[ dimension ][ gender ][ age ][ income ] = count
 * where `dimension` can be "car", "bus", etc. (Access Mode),
 * or any other of your categories.
 *
 * Later we "flatten" it differently depending on aggregator:
 *   aggregator = "gender" => sum across age & income
 *   aggregator = "age"    => sum across gender & income
 *   aggregator = "income" => sum across gender & age
 */

/** 
 * Make sure you have a safe getter to increment counts:
 *    nested[ dim ][ g ][ a ][ i ]++
 */
function updateNestedCount(nested, dim, g, a, inc) {
  if (!nested[dim]) nested[dim] = {};
  if (!nested[dim][g]) nested[dim][g] = {};
  if (!nested[dim][g][a]) nested[dim][g][a] = {};
  if (!nested[dim][g][a][inc]) nested[dim][g][a][inc] = 0;
  nested[dim][g][a][inc] += 1;
}

/**
 * Flatten data for aggregator = "gender" | "age" | "income".
 * This produces an object: flat[ category ][ sub ] = totalCount,
 * where "sub" depends on aggregator:
 *   - aggregator="gender" => sub in {male, female, ...}
 *   - aggregator="age"    => sub in {18-25, 26-40, ...}
 *   - aggregator="income" => sub in {low, medium, high, ...}
 */
function flattenData(nestedData, aggregator) {
  const categories = Object.keys(nestedData).sort(); // e.g. bus, car, etc.
  const subSet = new Set();
  const finalData = {};

  categories.forEach((cat) => {
    finalData[cat] = {};
    const catObj = nestedData[cat]; // { g1: { a1: {inc1: count} } }

    // For each gender & age & income, add up to the aggregator dimension
    Object.keys(catObj).forEach((gender) => {
      Object.keys(catObj[gender]).forEach((age) => {
        Object.keys(catObj[gender][age]).forEach((income) => {
          const count = catObj[gender][age][income];
          if (!count) return;

          let subKey;
          if (aggregator === "gender") {
            subKey = gender;
          } else if (aggregator === "age") {
            subKey = age;
          } else {
            // aggregator = "income"
            subKey = income;
          }

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
 * Plot a horizontal 100%-stacked bar chart:
 *   - Each "category" is a row on the y-axis
 *   - Sub-categories (e.g. gender/age/income) are stacked left->right
 *   - Each sub-segment labeled in % if wide enough
 */
function plotHorizontalStacked(container, nestedData, aggregator, title) {
  // 1) Flatten
  const { categories, subCategories, finalData } = flattenData(
    nestedData,
    aggregator
  );

  // 2) Remove old SVG
  d3.select(container).select("svg").remove();

  // 3) Dimensions & scales
  const width = 600;
  const height = 40 * categories.length + 80;
  const margin = { top: 40, right: 150, bottom: 40, left: 120 };

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const x = d3
    .scaleLinear()
    .domain([0, 1]) // 0..100%
    .range([margin.left, width - margin.right]);

  const y = d3
    .scaleBand()
    .domain(categories)
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  // Use a D3 categorical scheme for subCategories
  const color = d3
    .scaleOrdinal()
    .domain(subCategories)
    .range(d3.schemeDark2);

  // 4) Draw the stacks
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

      // Bar segment
      svg
        .append("rect")
        .attr("x", xStart)
        .attr("y", y(cat))
        .attr("width", xEnd - xStart)
        .attr("height", y.bandwidth())
        .attr("fill", color(sub));

      // Optional: label with % if there's enough space
      const segmentWidth = xEnd - xStart;
      if (segmentWidth > 30) {
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

  // 5) Axes
  const xAxis = d3.axisBottom(x).tickFormat(d3.format(".0%")).ticks(5);
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(y);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  // 6) Title
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

  // 7) Legend
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

// ------------------------------------------------------------------
// The Form1_info component
// ------------------------------------------------------------------
const Form1_info = ({ allResponses }) => {
  // A single big nested object:
  // form1Data[ dimension ][ gender ][ age ][ income ] = count
  const [form1Data, setForm1Data] = useState({});

  // We want 4 "dimensions" (Access Mode, Distance, Purpose, Travel Mode),
  // each shown 3 ways: aggregator='gender','age','income'.
  // That yields 12 total charts -> 3 for each dimension.

  // Refs for each dimension (3 aggregator types):
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

  const demographicsRef = useRef(); // for the pie chart

  // 1) Build the big nested object from all responses
  useEffect(() => {
    if (!allResponses || !allResponses.length) return;

    const nested = {}; // nested[dim][g][a][inc] = count

    allResponses.forEach((response) => {
      const form1 = response.data.form1Data;
      const form6 = response.data.form6Data;
      if (!form1 || !form6) return;

      const {
        accessMode,
        distance,
        purpose,
        travelMode,
      } = form1; // dimension values
      const gender = form6.gender || "unknown";
      const ageGroup = form6.age || "unknown";
      const income = form6.income || "unknown";

      // For each dimension, increment nested[ dimensionVal ][ g ][ a ][ inc ]
      updateNestedCount(nested, accessMode, gender, ageGroup, income);
      updateNestedCount(nested, distance, gender, ageGroup, income);
      updateNestedCount(nested, purpose, gender, ageGroup, income);
      updateNestedCount(nested, travelMode, gender, ageGroup, income);
    });

    // Store into state
    setForm1Data(nested);
  }, [allResponses]);

  // 2) Plot overall demographics (Pie by gender, same as previous)
  const plotDemographics = (container, allResponses) => {
    if (!container) return;
    d3.select(container).selectAll("*").remove();

    // Simple gender counts
    const genderCount = {};
    allResponses.forEach((resp) => {
      const g = resp.data.form6Data?.gender || "unknown";
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
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text((d) => d.data.label);
  };

  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      plotDemographics(demographicsRef.current, allResponses);
    }
  }, [allResponses]);

  // 3) Once form1Data is built, create sub-datasets for each dimension.
  //    Then render each aggregator: 'gender','age','income'.
  useEffect(() => {
    // If empty, do nothing
    if (!Object.keys(form1Data).length) return;

    // We'll filter out just the categories belonging to Access Mode, Distance, etc.
    // Because in nested form, "car"/"bus"/"walk" might be from AccessMode or TravelMode.
    // There's no inherent difference in the nested structure, so we rely on your domain knowledge.
    //
    // For demonstration, let's do a helper that extracts only the relevant categories
    // for each dimension.  In your real code, you might store them separately or
    // rely on enumerations. For simplicity, we'll do something naive here.

    // Helper to pick just the categories relevant to a dimension
    function filterDimension(dimKeys) {
      // Return a mini-object from form1Data with only keys in dimKeys
      // e.g. if dimKeys = ['car', 'bus', 'metro'], we keep those
      const subObj = {};
      dimKeys.forEach((k) => {
        if (form1Data[k]) subObj[k] = form1Data[k];
      });
      return subObj;
    }

    // Suppose your known categories for each dimension are:
    // (Adjust as needed.)
    const accessModeCats = ["car", "bus", "metro", "walk", "bicycle", "auto"];
    const distanceCats = ["<1km", "1-5km", "5-10km", ">10km"];
    const purposeCats = ["work", "school", "shopping", "other"];
    const travelModeCats = ["car", "bus", "metro", "walk", "bicycle", "auto"];

    // Filter out each dimension
    const accessModeData = filterDimension(accessModeCats);
    const distanceData = filterDimension(distanceCats);
    const purposeData = filterDimension(purposeCats);
    const travelModeData = filterDimension(travelModeCats);

    // Now plot 3 times for each dimension
    // AccessMode
    plotHorizontalStacked(
      accessModeRefGender.current,
      accessModeData,
      "gender",
      "Access Mode by Gender"
    );
    plotHorizontalStacked(
      accessModeRefAge.current,
      accessModeData,
      "age",
      "Access Mode by Age"
    );
    plotHorizontalStacked(
      accessModeRefIncome.current,
      accessModeData,
      "income",
      "Access Mode by Income"
    );

    // Distance
    plotHorizontalStacked(
      distanceRefGender.current,
      distanceData,
      "gender",
      "Distance by Gender"
    );
    plotHorizontalStacked(
      distanceRefAge.current,
      distanceData,
      "age",
      "Distance by Age"
    );
    plotHorizontalStacked(
      distanceRefIncome.current,
      distanceData,
      "income",
      "Distance by Income"
    );

    // Purpose
    plotHorizontalStacked(
      purposeRefGender.current,
      purposeData,
      "gender",
      "Purpose by Gender"
    );
    plotHorizontalStacked(
      purposeRefAge.current,
      purposeData,
      "age",
      "Purpose by Age"
    );
    plotHorizontalStacked(
      purposeRefIncome.current,
      purposeData,
      "income",
      "Purpose by Income"
    );

    // TravelMode
    plotHorizontalStacked(
      travelModeRefGender.current,
      travelModeData,
      "gender",
      "Travel Mode by Gender"
    );
    plotHorizontalStacked(
      travelModeRefAge.current,
      travelModeData,
      "age",
      "Travel Mode by Age"
    );
    plotHorizontalStacked(
      travelModeRefIncome.current,
      travelModeData,
      "income",
      "Travel Mode by Income"
    );
  }, [form1Data]);

  // Render layout
  return (
    <div className="my-10 bg-white text-black p-4">
      <h2 className="font-serif font-bold text-xl mb-4">Form1 Information</h2>

      {/* Demographics Pie */}
      <div className="mb-8 flex flex-col items-center">
        <h3 className="font-serif font-semibold text-lg mb-2 text-center">
          Overall Gender Distribution
        </h3>
        <div
          ref={demographicsRef}
          className="rounded-md shadow-lg m-2 w-full max-w-[300px]"
        ></div>
      </div>

      {/* Access Mode */}
      <h3 className="font-semibold text-lg mt-6">Access Mode</h3>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div ref={accessModeRefGender} className="rounded-md shadow-lg" />
        <div ref={accessModeRefAge} className="rounded-md shadow-lg" />
        <div ref={accessModeRefIncome} className="rounded-md shadow-lg" />
      </div>

      {/* Distance */}
      <h3 className="font-semibold text-lg mt-6">Distance</h3>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div ref={distanceRefGender} className="rounded-md shadow-lg" />
        <div ref={distanceRefAge} className="rounded-md shadow-lg" />
        <div ref={distanceRefIncome} className="rounded-md shadow-lg" />
      </div>

      {/* Purpose */}
      <h3 className="font-semibold text-lg mt-6">Purpose</h3>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div ref={purposeRefGender} className="rounded-md shadow-lg" />
        <div ref={purposeRefAge} className="rounded-md shadow-lg" />
        <div ref={purposeRefIncome} className="rounded-md shadow-lg" />
      </div>

      {/* Travel Mode */}
      <h3 className="font-semibold text-lg mt-6">Travel Mode</h3>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div ref={travelModeRefGender} className="rounded-md shadow-lg" />
        <div ref={travelModeRefAge} className="rounded-md shadow-lg" />
        <div ref={travelModeRefIncome} className="rounded-md shadow-lg" />
      </div>
    </div>
  );
};

export default Form1_info;
