// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Menu, X } from "lucide-react"; // hamburger icons

// const Sidebar = () => {
//   const [open, setOpen] = useState(false);
//   const [showHamburger, setShowHamburger] = useState(true); // ✅ track visibility
//   const location = useLocation();

//   const navItems = [
//     { name: "Home", path: "/" },
//     { name: "Add Expense", path: "/add-expense" },
//     { name: "Add Income", path: "/add-income" },
//     { name: "Transaction History", path: "/transactionHistory" },


//   ];
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY === 0) {
//         setShowHamburger(true);
//       } else {
//         setShowHamburger(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div>
//       {showHamburger && (
//         <button
//           className="fixed top-4 left-4 z-50 p-2 bg-yellow-400 text-white rounded-lg shadow-lg md:hidden"
//           onClick={() => setOpen(!open)}
//         >
//           {open ? <X size={24} /> : <Menu size={40} />}
//         </button>
//       )}

//       <div
//         className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40
//         ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
//       >
//         <div className="px-6 py-4 border-b">
//           <h1 className="text-lg ml-12 font-bold text-gray-800">
//             Expense Tracker
//           </h1>
//         </div>
//         <nav className="flex flex-col space-y-2 p-4">
//           {navItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`px-4 py-2 rounded-lg font-medium transition ${
//                 location.pathname === item.path
//                   ? "bg-yellow-400 text-white"
//                   : "text-gray-700 hover:bg-gray-100"
//               }`}
//               onClick={() => setOpen(false)} 
//             >
//               {item.name}
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


// components/NavBar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Navigate to logout page which will clear storage and redirect
    navigate('/logout');
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white fixed left-0 top-0 p-4">
      <h2 className="text-xl font-bold mb-6">Finance Tracker</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link to="/" className="block py-2 px-4 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/add-income" className="block py-2 px-4 rounded hover:bg-gray-700">
              Add Income
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/add-expense" className="block py-2 px-4 rounded hover:bg-gray-700">
              Add Expense
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/transactionHistory" className="block py-2 px-4 rounded hover:bg-gray-700">
              History
            </Link>
          </li>
          <li className="mt-6 border-t border-gray-700 pt-4">
            <button 
              onClick={handleLogout}
              className="w-full text-left py-2 px-4 rounded hover:bg-gray-700"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;