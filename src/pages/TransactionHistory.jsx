import React, { useState, useEffect } from "react";
import API from "../utils/api";
import Header from "../components/Header";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [sortOption, setSortOption] = useState("date-desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const sortOptions = [
    { value: "date-desc", label: "Newest First" },
    { value: "date-asc", label: "Oldest First" },
    { value: "amount-desc", label: "Highest Amount" },
    { value: "amount-asc", label: "Lowest Amount" },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get("v1/transactionHistory");
        setTransactions(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    switch (sortOption) {
      case "date-asc":
        return dateA - dateB;
      case "amount-desc":
        return Math.abs(b.amount) - Math.abs(a.amount);
      case "amount-asc":
        return Math.abs(a.amount) - Math.abs(b.amount);
      default:
        return dateB - dateA;
    }
  });

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-2xl">
        <Header title= "Transaction History"/>
        <div className="flex justify-between items-center mb-4 mt-3 ml-56">
        <div className="relative w-40">
          <div
            onClick={() => setOpen(!open)}
            className="bg-white border border-gray-300 rounded-xl py-2 px-3 flex justify-between items-center cursor-pointer focus:ring-2 focus:ring-yellow-400"
          >
            <span className="text-sm text-gray-700">
              {sortOptions.find((opt) => opt.value === sortOption)?.label}
            </span>
            <svg
              className={`w-4 h-4 transform transition-transform ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {open && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
              {sortOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    setSortOption(opt.value);
                    setOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100 cursor-pointer"
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {!loading && !error && sortedTransactions.length === 0 && (
        <p className="text-gray-500 text-sm">No transactions found.</p>
      )}

      <div className="space-y-3">
        {sortedTransactions.map((txn, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-xl shadow-sm"
          >
            <div>
              <p className="text-gray-800 font-medium">
                {txn.title || txn.notes || "No Title"}
              </p>
              <p className="text-gray-400 text-xs">
                {new Date(txn.date).toLocaleDateString()}
              </p>
            </div>
            <p
              className={`font-semibold ${
                txn.amount > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {txn.amount > 0
                ? `₹${txn.amount.toLocaleString()}`
                : `- ₹${Math.abs(txn.amount).toLocaleString()}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
