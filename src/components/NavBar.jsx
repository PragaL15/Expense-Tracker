import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; 

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <div>
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-yellow-400 text-white rounded-lg shadow-lg md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-yellow-400 text-white shadow-lg transform transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-xl font-bold p-4">Finance Tracker</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link
                to="/"
                className="block py-2 px-4 rounded hover:bg-yellow-500"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/add-income"
                className="block py-2 px-4 rounded hover:bg-yellow-500"
                onClick={() => setOpen(false)}
              >
                Add Income
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/add-expense"
                className="block py-2 px-4 rounded hover:bg-yellow-500"
                onClick={() => setOpen(false)}
              >
                Add Expense
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/transactionHistory"
                className="block py-2 px-4 rounded hover:bg-yellow-500"
                onClick={() => setOpen(false)}
              >
                History
              </Link>
            </li>
            <li className="mt-6 border-t border-yellow-300 pt-4">
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 px-4 rounded hover:bg-yellow-500"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
