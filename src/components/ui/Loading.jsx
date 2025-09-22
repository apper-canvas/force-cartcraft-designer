import React from "react";

const Loading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
        >
          {/* Image skeleton */}
          <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300" />
          
          {/* Content skeleton */}
          <div className="p-6">
            {/* Title skeleton */}
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md mb-3" />
            
            {/* Price skeleton */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-7 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md" />
              <div className="h-5 w-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md" />
            </div>
            
            {/* Rating skeleton */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded-full" />
                ))}
              </div>
              <div className="h-4 w-12 bg-gray-200 rounded-md" />
            </div>
            
            {/* Button skeleton */}
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;