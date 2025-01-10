import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// Generic function to plot a grouped stacked bar chart
function plotGroupedStacked(container, nestedData, title) {
  // ... [existing implementation remains unchanged] ...
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

  // Implement plotDemographics to display a demographics chart
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

  return (
    <div className="my-10 scale-90 bg-slate-50 rounded-md p-4">
      <h2 className="font-serif font-bold text-xl mb-4">Form1 Information</h2>

      {/* Demographics section */}
      <div className="mb-8 flex flex-col items-center">
        <h3 className="font-serif font-semibold text-lg mb-2 text-center">
          Demographics Overview
        </h3>
        <div
          ref={demographicsRef}
          className="bg-slate-200 rounded-md shadow-lg m-2 w-full max-w-[550px]"
        ></div>
      </div>

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
