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
    { name: "Logout", path: "/" }
  ];

  return (
    <div>
      {!open && (
        <button
          className="fixed top-5 left-4 z-50 p-2 bg-[#c17014] text-white rounded-lg shadow-lg md:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu size={28} />
        </button>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#c17014] text-white shadow-lg transform transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <button
          className="absolute top-2 right-2 p-2 bg-white text-[#c17014] rounded-lg md:hidden"
          onClick={() => setOpen(false)}
        >
          <X size={28} />
        </button>

        <h2 className="text-xl font-bold p-4">Finance Tracker</h2>

        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link
                  to={item.path}
                  className={`block py-2 px-4 rounded transition-colors ${
                    location.pathname === item.path
                      ? "bg-white text-[#c17014]" 
                      : "hover:bg-white hover:text-[#c17014]"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
