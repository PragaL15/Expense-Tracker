import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // hamburger icons

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Add Expense", path: "/add-expense" },
    { name: "Add Income", path: "/add-income" },
    { name: "Transaction History", path: "/transactionHistory" },
    { name: "Budget Tracking", path: "/budgetTracking" },
    { name: "Sign Up", path: "/register" },
    { name: "Login", path: "/login" },
  ];

  return (
    <div>
      {/* Hamburger button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-yellow-400 text-white rounded-lg shadow-lg md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="px-6 py-4 border-b">
          <h1 className="text-lg font-bold text-gray-800">Expense Tracker</h1>
        </div>
        <nav className="flex flex-col space-y-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                location.pathname === item.path
                  ? "bg-yellow-400 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setOpen(false)} // auto close when clicked
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
