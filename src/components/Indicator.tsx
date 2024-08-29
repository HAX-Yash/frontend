import React from 'react';

interface IndicatorProps {
  label: string;
  isActive: boolean; // Boolean to determine active/inactive state
}

const Indicator: React.FC<IndicatorProps> = ({ label, isActive }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto p-2">
      {/* Rectangle Container with Rounded Corners */}
      <div className="w-full h-10 flex border border-gray-400 rounded-md overflow-hidden shadow-md">
        {/* Conditional Background Color with Rounded Corners */}
        <div
          className={`w-1/2 h-full ${isActive ? 'bg-green-500' : 'bg-white'} transition-all duration-300 ease-in-out`}
        ></div>
        <div
          className={`w-1/2 h-full ${isActive ? 'bg-white' : 'bg-red-700'} transition-all duration-300 ease-in-out`}
        ></div>
      </div>
      {/* Label Text with Styling */}
      <span className="mt-2 text-sm sm:text-md text-gray-900 font-medium">{label}</span>
    </div>
  );
};

export default Indicator;
