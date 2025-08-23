import React from "react";

const Header = ({ title }) => {
  return (
    <header className="bg-yellow-400 text-black text-center py-4 shadow-md">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
};

export default Header;
