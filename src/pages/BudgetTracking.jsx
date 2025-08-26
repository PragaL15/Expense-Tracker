import React, { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import api from "../utils/api";

const CustomProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: "#e5e7eb",
  "& .MuiLinearProgress-bar": {
    borderRadius: 4,
    backgroundColor: "#facc15",
  },
}));

const BudgetTracking = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const today = new Date();
        const period = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

        const summaryRes = await api.get("/v1/budgets/summary", {
          params: { period },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        // Fetch income (total budget)
        const incomeRes = await api.get("/v1/transactions/income", {
          params: { period },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        console.log("Income API response:", incomeRes.data);

        // Adjust key according to your API structure
        const incomeTotal =
          incomeRes?.data?.total_amount ||
          incomeRes?.data?.total ||
          (Array.isArray(incomeRes?.data)
            ? incomeRes.data.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0)
            : 0);

        const mergedData = {
          ...summaryRes.data,
          total_budget: incomeTotal,
        };

        setSummary(mergedData);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Loading budget summary...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500">Error: {error || "No data available"}</p>
      </div>
    );
  }

  const total_budget = summary?.total_budget || 0;
  const total_spent = summary?.total_spent || 0;
  const category_budgets = summary?.category_budgets || [];
  const leftToSpend = total_budget - total_spent;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-[360px] bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h1 className="text-center text-lg font-semibold text-gray-800">
            Budget Tracking
          </h1>
        </div>

        <div className="flex flex-col items-center p-6">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="absolute inset-0" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="10" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#facc15"
                strokeWidth="10"
                strokeDasharray={`${total_budget > 0 ? (total_spent / total_budget) * 283 : 0}, 283`}
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500">Left to spend</p>
              <h2 className="text-2xl font-bold text-gray-900">
                ₹{(leftToSpend || 0).toLocaleString()}
              </h2>
            </div>
          </div>

          <button className="mt-4 px-6 py-2 bg-yellow-400 rounded-xl font-medium text-white hover:bg-yellow-500">
            Set Budget
          </button>

          <div className="flex flex-col w-full mt-4 text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <p>Total Budget</p>
              <p className="font-medium">₹{total_budget.toLocaleString()}</p>
            </div>
            <div className="flex justify-between">
              <p>Total Spent</p>
              <p className="font-medium">₹{total_spent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Category Budgets</h3>
          <div className="space-y-3">
            {category_budgets.map((cat, idx) => {
              const spent = cat?.spent || 0;
              const limit = cat?.budget_limit || 0;
              const progress = limit > 0 ? (spent / limit) * 100 : 0;
              return (
                <div
                  key={cat?.category_id || idx}
                  className="flex items-center justify-between bg-gray-50 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📁</span>
                    <div>
                      <p className="text-gray-800 font-medium">
                        {cat?.category_name || "Unknown"}
                      </p>
                      <CustomProgress
                        variant="determinate"
                        value={progress > 100 ? 100 : progress}
                        style={{ width: 130, marginTop: 6 }}
                      />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    ₹{spent.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracking;
