import React, { Suspense } from "react";

const Form6_info = React.lazy(() => import("./form6_response"));

/**
 * Enhanced Loading Fallback
 * ----------------------------------------------------------
 * 1. Adds a subtle heading or text to indicate loading state.
 * 2. Uses 'bg-gradient-to-r' classes for a gradient shimmer effect.
 * 3. Slightly changes the layout to look more balanced and appealing.
 * 4. Adds some Tailwind utility classes (such as flex-center) for better alignment.
 * 5. You can further customize colors, sizes, or arrangement.
 */

const LoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-10">
      {/* Subtle loading text or heading */}
      <h2 className="text-lg font-semibold text-gray-600 mb-8">
        Loading your data...
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4 animate-pulse">
        {/* A loop to generate skeleton cards */}
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300
                       rounded-xl shadow-md p-5 h-60
                       flex flex-col justify-between"
          >
            {/* Top bar for title placeholder */}
            <div className="w-3/4 h-5 mb-4 rounded bg-gray-300"></div>

            {/* Middle section for text lines placeholder */}
            <div className="space-y-2">
              <div className="w-full h-4 rounded bg-gray-300"></div>
              <div className="w-5/6 h-4 rounded bg-gray-300"></div>
              <div className="w-2/3 h-4 rounded bg-gray-300"></div>
            </div>

            {/* Bottom bar for e.g., button placeholder */}
            <div className="w-1/3 h-5 mt-4 rounded bg-gray-300 self-end"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LazyForm6Response = ({ allResponses }) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Form6_info allResponses={allResponses} />
    </Suspense>
  );
};

export default LazyForm6Response;
