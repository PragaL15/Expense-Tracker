import React from "react";

const Card = ({ label, value, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-[#dad7cd] rounded-2xl shadow p-4 w-full">
      {icon && <div className="text-2xl mb-1">{icon}</div>}
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-yellow-500 font-bold text-lg">{value}</p>
    </div>
  );
};

export default Card;
