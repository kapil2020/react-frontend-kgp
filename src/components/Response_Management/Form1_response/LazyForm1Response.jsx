import React, { Suspense } from "react";

const Form1_info = React.lazy(() => import("./form1_response"));

const LoadingFallback = () => (
  <div className="my-10 scale-90">
    <div className="animate-pulse">
      <div className="h-8 bg-slate-300 w-48 mb-4 rounded"></div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-slate-300 h-[400px] rounded-md shadow-lg"
          ></div>
        ))}
      </div>
    </div>
  </div>
);

const LazyForm1Response = ({ allResponses }) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Form1_info allResponses={allResponses} />
    </Suspense>
  );
};

export default LazyForm1Response;
