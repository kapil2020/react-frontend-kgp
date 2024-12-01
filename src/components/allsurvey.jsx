import TravelDetails from "./survey_sections/section1/section1";
import AirQualityAwareness from "./survey_sections/section2/section2";
import Section3 from "./survey_sections/section3/section3";
import Section4 from "./survey_sections/section4/section4";
import Section5 from "./survey_sections/section5/section5";
import { useEffect, useState } from "react";

function AllSurvey() {
  const [activeSection, setActiveSection] = useState(0);
  const [form1Data, setForm1Data] = useState({});
  const [form2Data, setForm2Data] = useState({});
  const [form3Data, setForm3Data] = useState({});
  const [form4Data, setForm4Data] = useState({});
  const [form5Data, setForm5Data] = useState({});
  const [allData, setAllData] = useState({});

  useEffect(() => {
    setAllData({
      form1Data,
      form2Data,
      form3Data,
      form4Data,
      form5Data,
    });
    console.log(allData);
  }, [form1Data, form2Data, form3Data, form4Data, form5Data]);

  const submitSurvey = async () => {
    const surveyData = {
      form1Data,
      form2Data,
      form3Data,
      form4Data,
      form5Data,
    };
    console.log("Survey Data:", surveyData);

    try {
      const response = await fetch("http://localhost:5000/api/survey/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Survey Submitted successfully: ", data);
        alert("Survey submitted successfully!");
      } else {
        console.log("Failed to submit survey: ", response.status);
        alert("Failed to submit survey. Please try again.");
      }
    } catch (err) {
      console.log(err);
      alert("An error occurred. Please try again.");
    }

    // setTimeout(() => {
    //   window.location.href = "/";
    // }, 5000);
  };

  return (
    <div className="">
      <header className="">
        <h3 className=" text-center p-4 text-4xl font-bold">Survey</h3>
      </header>
      <body>
        <TravelDetails
          thisFormData={form1Data}
          setThisFormData={setForm1Data}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        {/* Section 2 */}
        <AirQualityAwareness
          thisFormData={form2Data}
          setThisFormData={setForm2Data}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <Section3
          thisFormData={form3Data}
          setThisFormData={setForm3Data}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <Section4
          thisFormData={form4Data}
          setThisFormData={setForm4Data}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <Section5
          thisSection5FormData={form5Data}
          setThisSection5FormData={setForm5Data}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <br />
        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={submitSurvey}
          >
            Submit Survey
          </button>
        </div>
        <br />
      </body>
    </div>
  );
}

export default AllSurvey;
