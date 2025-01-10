import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

function updateNestCount(currentState, key, gender, ageGroup) {
  const newState = { ...currentState };
  if (!newState[key]) {
    newState[key] = {};
  }
  if (!newState[key][gender]) {
    newState[key][gender] = {};
  }
  if (!newState[key][gender][ageGroup]) {
    newState[key][gender][ageGroup] = 0;
  }
  newState[key][gender][ageGroup] += 1;
  return newState;
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

  // Data Processing: Aggregate responses for all four categories
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
        const ageGroup = form6.age; // Ensure this matches the actual property for age group

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
    console.log("Access mode data is", accessModeObj);

    setForm1_Distance(distanceObj);
    console.log("Distance mode data is", distanceObj);

    setForm1_Purpose(purposeObj);
    console.log("Purpose mode data is", purposeObj);

    setForm1_TravelMode(travelModeObj);
    console.log("Travel mode data is", travelModeObj);
  }, [allResponses]);

  // Generic plotting function for nested data
  const plotNestedData = (container, nestedData, title) => {
    // Restructure data for stacking
    const stackedData = [];
    const categories = Object.keys(nestedData);
    const genderOrder = ["male", "female", "other"];
    const ageGroups = new Set();

    // Collect all age groups
    categories.forEach((category) => {
      Object.values(nestedData[category]).forEach((genderData) => {
        Object.keys(genderData).forEach((age) => ageGroups.add(age));
      });
    });

    // Create data structure for stacking
    Array.from(ageGroups).forEach((age) => {
      const dataPoint = { age };
      genderOrder.forEach((gender) => {
        categories.forEach((category) => {
          const key = `${gender}-${category}`;
          dataPoint[key] = nestedData[category]?.[gender]?.[age] || 0;
        });
      });
      stackedData.push(dataPoint);
    });

    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 120, bottom: 80, left: 60 };

    // Clear previous svg
    d3.select(container).select("svg").remove();

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Create stack generator
    const stackKeys = genderOrder.flatMap((gender) =>
      categories.map((category) => `${gender}-${category}`)
    );

    const stack = d3.stack().keys(stackKeys);
    const stackedValues = stack(stackedData);

    // Create scales
    const x = d3
      .scaleBand()
      .domain(Array.from(ageGroups))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(stackedValues, (d) => d3.max(d, (d) => d[1]))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Color scales for each gender
    const colorScales = {
      male: d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0, categories.length]),
      female: d3
        .scaleSequential(d3.interpolateReds)
        .domain([0, categories.length]),
      other: d3
        .scaleSequential(d3.interpolateGreens)
        .domain([0, categories.length]),
    };

    // Draw stacked bars
    svg
      .selectAll("g.stack")
      .data(stackedValues)
      .enter()
      .append("g")
      .attr("class", "stack")
      .each(function (series) {
        const gender = series.key.split("-")[0];
        const category = series.key.split("-")[1];
        const categoryIndex = categories.indexOf(category);

        d3.select(this)
          .selectAll("rect")
          .data(series)
          .enter()
          .append("rect")
          .attr("x", (d) => x(d.data.age))
          .attr("y", (d) => y(d[1]))
          .attr("height", (d) => y(d[0]) - y(d[1]))
          .attr("width", x.bandwidth())
          .attr("fill", colorScales[gender](categoryIndex))
          .attr("opacity", 0.8);
      });

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Add legend
    const legend = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "start")
      .attr(
        "transform",
        `translate(${width - margin.right + 10},${margin.top})`
      );

    genderOrder.forEach((gender, gIndex) => {
      categories.forEach((category, cIndex) => {
        const legendGroup = legend
          .append("g")
          .attr(
            "transform",
            `translate(0,${(gIndex * categories.length + cIndex) * 20})`
          );

        legendGroup
          .append("rect")
          .attr("x", 0)
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", colorScales[gender](cIndex))
          .attr("opacity", 0.8);

        legendGroup
          .append("text")
          .attr("x", 20)
          .attr("y", 12)
          .text(`${gender} - ${category}`);
      });
    });

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(title);
  };

  const plotDemographics = (container, allResponses) => {
    if (!allResponses || allResponses.length === 0) return;

    // Process demographic data
    const demographics = {};
    allResponses.forEach((response) => {
      const form6 = response.data.form6Data;
      if (form6) {
        const gender = form6.gender;
        const age = form6.age;
        if (!demographics[gender]) demographics[gender] = {};
        if (!demographics[gender][age]) demographics[gender][age] = 0;
        demographics[gender][age]++;
      }
    });

    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 120, bottom: 80, left: 60 };

    // Clear previous svg
    d3.select(container).select("svg").remove();

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Process data for visualization
    const data = [];
    Object.entries(demographics).forEach(([gender, ages]) => {
      Object.entries(ages).forEach(([age, count]) => {
        data.push({ gender, age, count });
      });
    });

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => `${d.gender}-${d.age}`))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Color scale
    const colorScale = d3
      .scaleOrdinal()
      .domain(["male", "female", "other"])
      .range(["#4477AA", "#EE6677", "#228833"]);

    // Draw bars
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(`${d.gender}-${d.age}`))
      .attr("y", (d) => y(d.count))
      .attr("height", (d) => y(0) - y(d.count))
      .attr("width", x.bandwidth())
      .attr("fill", (d) => colorScale(d.gender))
      .attr("opacity", 0.8);

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Demographics Distribution");
  };

  // Plotting effects for each category
  useEffect(() => {
    if (Object.keys(form1_accessmode).length !== 0) {
      plotNestedData(accessModeRef.current, form1_accessmode, "Access Mode");
    }
  }, [form1_accessmode]);

  useEffect(() => {
    if (Object.keys(form1_distance).length !== 0) {
      plotNestedData(distanceRef.current, form1_distance, "Distance");
    }
  }, [form1_distance]);

  useEffect(() => {
    if (Object.keys(form1_purpose).length !== 0) {
      plotNestedData(purposeRef.current, form1_purpose, "Purpose");
    }
  }, [form1_purpose]);

  useEffect(() => {
    if (Object.keys(form1_travel_mode).length !== 0) {
      plotNestedData(travelModeRef.current, form1_travel_mode, "Travel Mode");
    }
  }, [form1_travel_mode]);

  useEffect(() => {
    if (allResponses && allResponses.length > 0) {
      plotDemographics(demographicsRef.current, allResponses);
    }
  }, [allResponses]);

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
          className="bg-slate-200 rounded-md shadow-lg m-2 w-full max-w-[550px]"
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
