import TravelDetails from "./survey_sections/section1/section1";
import AirQualityAwareness from "./survey_sections/section2/section2";
import Section3 from "./survey_sections/section3/section3";
import Section4 from "./survey_sections/section4/section4";
import Section5 from "./survey_sections/section5/section5";
import Section6 from "./survey_sections/section6/section6";
import { useEffect, useState } from "react";
import { TransportProvider } from "./transportContext/TransportContext";

function AllSurvey() {
  const [activeSection, setActiveSection] = useState(0);
  const [form1Data, setForm1Data] = useState({});
  const [form2Data, setForm2Data] = useState({});
  const [form3Data, setForm3Data] = useState({});
  const [form4Data, setForm4Data] = useState({});
  const [form5Data, setForm5Data] = useState({});
  const [form6Data, setForm6Data] = useState({});
  const [allData, setAllData] = useState({});
  const [starttime, setStartTime] = useState(null);
  const [endtime, setEndTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const now = new Date();
    setStartTime(now);
    console.log("Survey started at ", now);
  }, []);

  useEffect(() => {
    setAllData({
      form1Data,
      form2Data,
      form3Data,
      form4Data,
      form5Data,
      form6Data,
    });
    console.log(allData);
  }, [form1Data, form2Data, form3Data, form4Data, form5Data, form6Data]);

  const submitSurvey = async () => {
    if (
      Object.keys(form1Data).length === 0 ||
      Object.keys(form2Data).length === 0 ||
      Object.keys(form3Data).length === 0 ||
      Object.keys(form4Data).length === 0 ||
      Object.keys(form5Data).length === 0 ||
      Object.keys(form6Data).length === 0
    ) {
      alert(
        "All Sections are compulsory. Please fill it to submit the survey."
      );
      return;
    }

    const endTimeValue = new Date();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 5000);

    setEndTime(endTimeValue);
    console.log("Survey ended at ", endTimeValue);

    const timeTakenSeconds = Math.round((endTimeValue - starttime) / 1000);
    const minutes = Math.floor(timeTakenSeconds / 60);
    const seconds = timeTakenSeconds % 60;
    console.log(`Time Taken: ${minutes} minutes and ${seconds} seconds`);

    // Ensure starttime and endTimeValue are valid Date objects
    if (!(starttime instanceof Date) || isNaN(starttime)) {
      alert("Start time is invalid. Please refresh the page and try again.");
      return;
    }
    if (!(endTimeValue instanceof Date) || isNaN(endTimeValue)) {
      alert("End time is invalid. Please try again.");
      return;
    }

    // Prepare the payload
    const payload = {
      data: {
        metadata: {
          starttime: starttime.toISOString(),
          endtime: endTimeValue.toISOString(),
          timeTaken: {
            minutes,
            seconds,
          },
        },
        form1Data,
        form2Data,
        form3Data,
        form4Data,
        form5Data,
        form6Data,
      },
    };

    console.log("Payload to be sent:", payload);

    try {
      const response = await fetch(
        // "https://x8ki-letl-twmt.n7.xano.io/api:dk41aEwM/data",
       // "https://x8ki-letl-twmt.n7.xano.io/api:obmd9-Mc/survey", previous sample pilot data
              "https://x8ki-letl-twmt.n7.xano.io/api:MQ5XQ7S7/main_survey",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
          const jsonResponse = await response.json();
          console.log("Success (JSON):", jsonResponse);
          alert("Data submitted successfully!");
        } else {
          const textResponse = await response.text();
          console.log("Success (Text):", textResponse);
          alert("Data submitted successfully!");
        }

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        const errorText = await response.text();
        console.error(`Failed with status code: ${response.status}`, errorText);
        alert(`Error: Failed to submit data. ${errorText}`);
      }
    } catch (err) {
      console.log(err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <TransportProvider>
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
          <Section6
            thisFormData={form6Data}
            setThisFormData={setForm6Data}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
          <br />
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={submitSurvey}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </button>
          </div>
          <br />
        </body>
      </div>
    </TransportProvider>
  );
}

export default AllSurvey;
