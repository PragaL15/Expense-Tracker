import React from "react";

const Header = ({ title }) => {
  return (
    <header className="bg-[#3a5a40] text-[#fefae0] text-center py-4 shadow-md">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
};

export default Header;
