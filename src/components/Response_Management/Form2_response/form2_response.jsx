import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

/**
 * Safely increment the 4D structure:
 *   nested[ category ][ gender ][ ageGroup ][ income ]++
 */
function updateNestCount(nested, category, gender, age, inc) {
  if (!nested[category]) nested[category] = {};
  if (!nested[category][gender]) nested[category][gender] = {};
  if (!nested[category][gender][age]) nested[category][gender][age] = {};
  if (!nested[category][gender][age][inc])
    nested[category][gender][age][inc] = 0;
  nested[category][gender][age][inc] += 1;
}

/**
 * Flatten from 4D → 2D, based on an aggregator:
 *   aggregator in {"gender", "age", "income"}
 *
 * After flattening, we'll have:
 *   finalData[category][sub] = total_count
 *
 * Where "sub" depends on the aggregator:
 *   - aggregator = "gender"  => sub ∈ {male, female, unknown, ...}
 *   - aggregator = "age"     => sub ∈ {18-25, 26-40, ...}
 *   - aggregator = "income"  => sub ∈ {low, medium, high, ...}
 */
function flattenData(nestedData, aggregator) {
  const categories = Object.keys(nestedData).sort();
  const subSet = new Set();
  const finalData = {};

  categories.forEach((cat) => {
    finalData[cat] = {};
    const catObj = nestedData[cat]; // => { gender: { ageGroup: { income: count } } }

    Object.keys(catObj).forEach((g) => {
      Object.keys(catObj[g]).forEach((a) => {
        Object.keys(catObj[g][a]).forEach((inc) => {
          const count = catObj[g][a][inc] || 0;
          if (!count) return;

          let subKey;
          if (aggregator === "gender") {
            subKey = g; // sum across all ages + incomes
          } else if (aggregator === "age") {
            subKey = a; // sum across all genders + incomes
          } else {
            subKey = inc; // aggregator="income" => sum across all genders + ages
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
 * Draw a horizontal 100%-stacked bar chart:
 *  - Each "category" is a row on the y-axis.
 *  - Sub-categories (gender/age/income) stacked left→right in %.
 *  - Labeled sub-segments, color-coded legend.
 */
function plotHorizontalStacked(container, nestedData, aggregator, title) {
  // Flatten 4D data to 2D for aggregator
  const { categories, subCategories, finalData } = flattenData(
    nestedData,
    aggregator
  );

  // Remove old chart
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

  // X scale => 0..100%
  const x = d3
    .scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right]);

  // Y scale => each category is a row
  const y = d3
    .scaleBand()
    .domain(categories)
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  // Color for sub-categories
  const color = d3.scaleOrdinal().domain(subCategories).range(d3.schemeDark2);

  // Draw each stacked bar
  categories.forEach((cat) => {
    const rowObj = finalData[cat];
    const totalCount = Object.values(rowObj).reduce((acc, v) => acc + v, 0);
    if (!totalCount) return;

    let cumulative = 0;
    subCategories.forEach((sub) => {
      const val = rowObj[sub] || 0;
      if (!val) return;

      const proportion = val / totalCount;
      const xStart = x(cumulative);
      const xEnd = x(cumulative + proportion);

      // rectangle
      svg
        .append("rect")
        .attr("x", xStart)
        .attr("y", y(cat))
        .attr("width", xEnd - xStart)
        .attr("height", y.bandwidth())
        .attr("fill", color(sub));

      // label if wide enough
      if (xEnd - xStart > 20) {
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

  // X axis
  const xAxis = d3.axisBottom(x).tickFormat(d3.format(".0%")).ticks(5);
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  // Y axis
  const yAxis = d3.axisLeft(y);
  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis);

  // Title
  svg
    .append("text")
    .attr("x", (width - margin.left - margin.right) / 2 + margin.left)
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

/** Small Pie Chart for overall gender distribution */
function plotDemographics(container, allResponses) {
  if (!container) return;
  d3.select(container).selectAll("*").remove();

  const genderCount = {};
  allResponses.forEach((response) => {
    const g = response.data.form6Data?.gender || "unknown";
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
}

/**
 * Plot the Form2 (section 2) data.
 *
 * For each question in form2Data we count the frequency of each answer.
 * For the "symptoms" field (an array), each symptom is counted separately.
 */
function plotForm2Section(container, allResponses) {
  if (!container) return;
  // Clear any previous content.
  d3.select(container).selectAll("*").remove();

  // Define the questions we want to plot.
  // The "symptoms" field is an array so we mark it with isArray: true.
  const questions = [
    { key: "symptoms", label: "Symptoms", isArray: true },
    { key: "aqiActions", label: "AQI Actions", isArray: false },
    { key: "aqiExposure", label: "AQI Exposure", isArray: false },
    { key: "aqiAwareness", label: "AQI Awareness", isArray: false },
    { key: "aqiFrequency", label: "AQI Frequency", isArray: false },
    { key: "healthIssues", label: "Health Issues", isArray: false },
    { key: "aqiInfoSource", label: "AQI Info Source", isArray: false },
    {
      key: "healthEffectsAwareness",
      label: "Health Effects Awareness",
      isArray: false,
    },
  ];

  // For each question, build a frequency map.
  questions.forEach((question) => {
    const counts = {};
    allResponses.forEach((response) => {
      const form2 = response.data?.form2Data;
      if (!form2) return;
      const value = form2[question.key];
      if (question.isArray) {
        // value should be an array.
        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (!v) return;
            counts[v] = (counts[v] || 0) + 1;
          });
        }
      } else {
        if (!value) return;
        counts[value] = (counts[value] || 0) + 1;
      }
    });

    const data = Object.entries(counts).map(([k, v]) => ({ key: k, value: v }));
    if (!data.length) return; // Skip if no data

    // Set dimensions for each question's chart.
    const margin = { top: 30, right: 50, bottom: 30, left: 150 };
    const barHeight = 25;
    const height = data.length * barHeight + margin.top + margin.bottom;
    const width = 500;

    // Create an SVG container for this question.
    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("margin-bottom", "20px");

    // Title for the question.
    svg
      .append("text")
      .attr("x", margin.left)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "start")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(question.label);

    // x scale: from 0 to maximum count.
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([margin.left, width - margin.right]);

    // y scale: each answer as a band.
    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.key))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    // Draw bars.
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", margin.left)
      .attr("y", (d) => y(d.key))
      .attr("width", (d) => x(d.value) - margin.left)
      .attr("height", y.bandwidth())
      .attr("fill", "#69b3a2");

    // Add labels (counts) inside the bars.
    svg
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.value) + 5)
      .attr("y", (d) => y(d.key) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .text((d) => d.value);

    // Add y-axis labels.
    const yAxis = d3.axisLeft(y);
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);
  });
}

/**
 * The main component:
 *   - Builds 4D data: nestedData[dimension][gender][ageGroup][income] = count
 *   - Draws a pie chart for overall gender distribution
 *   - For each dimension (Access Mode, Distance, Purpose, Travel Mode),
 *     plots 3 horizontal 100%-stacked charts:
 *       (1) aggregator="gender"
 *       (2) aggregator="age"
 *       (3) aggregator="income"
 *   - Additionally, plots a new section (Section 2) for form2Data.
 */
const Form2_info = ({ allResponses }) => {
  // For each dimension, we store a 4D nested object.
  // Example: form1_accessmode[ 'car' ][ 'male' ][ '18-25' ][ 'highIncome' ] = 3
  const [form1_accessmode, setForm1_AccessMode] = useState({});
  const [form1_distance, setForm1_Distance] = useState({});
  const [form1_purpose, setForm1_Purpose] = useState({});
  const [form1_travel_mode, setForm1_TravelMode] = useState({});

  // We'll have 3 references per dimension => 12 total
  // aggregator in { "gender", "age", "income" }
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

  // Pie chart ref
  const demographicsRef = useRef();

  // New ref for Form2 (Section 2) visualization.
  const form2SectionRef = useRef();

  // 1) Build the 4D objects from responses
  useEffect(() => {
    if (!allResponses || !allResponses.length) return;

    let accessModeObj = {};
    let distanceObj = {};
    let purposeObj = {};
    let travelModeObj = {};

    allResponses.forEach((response) => {
      const form1 = response.data?.form1Data;
      const form6 = response.data?.form6Data;
      if (!form1 || !form6) return;

      const { accessMode, distance, purpose, travelMode } = form1;
      const gender = form6.gender || "unknown";
      const ageGroup = form6.age || "unknown";
      const income = form6.income || "unknown"; // <-- new field for income

      // Increment each dimension
      updateNestCount(accessModeObj, accessMode, gender, ageGroup, income);
      updateNestCount(distanceObj, distance, gender, ageGroup, income);
      updateNestCount(purposeObj, purpose, gender, ageGroup, income);
      updateNestCount(travelModeObj, travelMode, gender, ageGroup, income);
    });

    setForm1_AccessMode(accessModeObj);
    setForm1_Distance(distanceObj);
    setForm1_Purpose(purposeObj);
    setForm1_TravelMode(travelModeObj);
  }, [allResponses]);

  // 2) Once we have data, plot a gender pie
  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      plotDemographics(demographicsRef.current, allResponses);
    }
  }, [allResponses]);

  // 3) For each dimension, create 3 plots (gender, age, income)
  useEffect(() => {
    if (Object.keys(form1_accessmode).length) {
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
      plotHorizontalStacked(
        accessModeRefIncome.current,
        form1_accessmode,
        "income",
        "Access Mode by Income"
      );
    }
  }, [form1_accessmode]);

  useEffect(() => {
    if (Object.keys(form1_distance).length) {
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
      plotHorizontalStacked(
        distanceRefIncome.current,
        form1_distance,
        "income",
        "Distance by Income"
      );
    }
  }, [form1_distance]);

  useEffect(() => {
    if (Object.keys(form1_purpose).length) {
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
      plotHorizontalStacked(
        purposeRefIncome.current,
        form1_purpose,
        "income",
        "Purpose by Income"
      );
    }
  }, [form1_purpose]);

  useEffect(() => {
    if (Object.keys(form1_travel_mode).length) {
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
      plotHorizontalStacked(
        travelModeRefIncome.current,
        form1_travel_mode,
        "income",
        "Travel Mode by Income"
      );
    }
  }, [form1_travel_mode]);

  // 4) Plot the Form2 (section 2) data
  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      plotForm2Section(form2SectionRef.current, allResponses);
    }
  }, [allResponses]);

  // Render
  return (
    <div className="my-10 bg-white text-black rounded-md p-4">
      <h2 className="font-serif font-bold text-xl mb-4">Form1 Information</h2>

      {/* Overall Gender Pie */}
      <div className="mb-8 grid grid-cols-3 items-center">
        <h3 className="font-serif font-semibold text-lg mb-2 text-center">
          Overall Gender Distribution
        </h3>
        <div
          ref={demographicsRef}
          className="rounded-md shadow-lg m-2 w-full max-w-[300px]"
        ></div>
      </div>

      {/* Access Mode: aggregator = gender, age, income */}
      <h3 className="font-semibold text-lg mt-8">Access Mode</h3>
      <div className="grid grid-cols-3 gap-3 mt-2">
        <div
          ref={accessModeRefGender}
          className="rounded-md shadow-lg col-span-1"
        />
        <div
          ref={accessModeRefAge}
          className="rounded-md shadow-lg col-span-1"
        />
        <div
          ref={accessModeRefIncome}
          className="rounded-md shadow-lg col-span-1"
        />
      </div>

      {/* Distance */}
      <h3 className="font-semibold text-lg mt-8">Distance</h3>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div
          ref={distanceRefGender}
          className="rounded-md shadow-lg col-span-1"
        />
        <div ref={distanceRefAge} className="rounded-md shadow-lg col-span-1" />
        <div
          ref={distanceRefIncome}
          className="rounded-md shadow-lg col-span-1"
        />
      </div>

      {/* Purpose */}
      <h3 className="font-semibold text-lg mt-8">Purpose</h3>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div
          ref={purposeRefGender}
          className="rounded-md shadow-lg col-span-1"
        />
        <div ref={purposeRefAge} className="rounded-md shadow-lg col-span-1" />
        <div
          ref={purposeRefIncome}
          className="rounded-md shadow-lg col-span-1"
        />
      </div>

      {/* Travel Mode */}
      <h3 className="font-semibold text-lg mt-8">Travel Mode</h3>
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div
          ref={travelModeRefGender}
          className="rounded-md shadow-lg col-span-1"
        />
        <div
          ref={travelModeRefAge}
          className="rounded-md shadow-lg col-span-1"
        />
        <div
          ref={travelModeRefIncome}
          className="rounded-md shadow-lg col-span-1"
        />
      </div>

      {/* Form2 (Section 2) Data Visualization */}
      <h3 className="font-semibold text-lg mt-8">Form2 Data</h3>
      <div ref={form2SectionRef} className="mt-4 grid grid-cols-3 gap-4"></div>
    </div>
  );
};

export default Form2_info;
