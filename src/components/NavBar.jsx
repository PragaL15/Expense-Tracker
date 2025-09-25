import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; 

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/logout");
  };

  const navItems = [
    { name: "Dashboard", path: "/BudgetTracking" },
    { name: "Add Income", path: "/add-income" },
    { name: "Add Expense", path: "/add-expense" },
    { name: "History", path: "/transactionHistory" },
  ];

  return (
    <div>
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-yellow-400 text-white rounded-lg shadow-lg md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-yellow-400 text-white shadow-lg transform transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-xl font-bold p-4">Finance Tracker</h2>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link
                  to={item.path}
                  className={`block py-2 px-4 rounded transition-colors ${
                    location.pathname === item.path
                      ? "bg-yellow-600 text-white" // Active page
                      : "hover:bg-yellow-300 hover:text-black"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}

            <li className="mt-6 border-t border-yellow-300 pt-4">
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 px-4 rounded transition-colors hover:bg-yellow-300 hover:text-black"
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
