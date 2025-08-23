import React from "react";

const Chart = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 mt-4">
      <h3 className="text-gray-700 font-medium">Current Month</h3>
      <p className="text-yellow-500 text-sm mb-3">₹4,637 under budget</p>
      <div className="h-24 w-full bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-lg flex items-end">
        {/* This will later become a real chart */}
        <div className="h-20 w-1/2 bg-transparent"></div>
      </div>
    </div>
  );
};

export default Chart;
