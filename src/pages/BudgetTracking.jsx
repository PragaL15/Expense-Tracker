import React, { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import api from "../utils/api";
import Header from "../components/Header";

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
        const summaryRes = await api.get("/v1/budgets/summary", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const incomeRes = await api.get("/v1/transactions/income", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const incomeTotal =
          incomeRes?.data?.total_amount ||
          incomeRes?.data?.total ||
          (Array.isArray(incomeRes?.data)
            ? incomeRes.data.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0)
            : 0);

        setSummary({
          ...summaryRes.data,
          total_budget: incomeTotal,
        });
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading budget summary...</p>
      </div>
    );

  if (error || !summary)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">Error: {error || "No data available"}</p>
      </div>
    );

  const total_budget = summary?.total_budget || 0;
  const total_income = summary?.total_income || 0;
  const total_expenses = summary?.total_spent || 0;
  const total_investments = summary?.total_investments || 0;
  const leftToSpend = total_budget - total_expenses; // Budget left before investments

  const category_budgets = summary?.category_budgets || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Budget Tracking" />

      <div className="flex items-center justify-center py-6">
        <div className="w-[360px] bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Progress Circle */}
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
                  strokeDasharray={`${total_budget > 0 ? ((total_expenses + total_investments) / total_budget) * 283 : 0}, 283`}
                  strokeLinecap="round"
                  fill="none"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-500">Left to spend</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  ₹{leftToSpend.toLocaleString()}
                </h2>
              </div>
            </div>

            {/* Totals */}
            <div className="flex flex-col w-full mt-4 text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <p>Total Budget</p>
                <p className="font-medium">₹{total_budget.toLocaleString()}</p>
              </div>
              <div className="flex justify-between">
                <p>Total Income</p>
                <p className="font-medium">₹{total_income.toLocaleString()}</p>
              </div>
              <div className="flex justify-between">
                <p>Total Expenses</p>
                <p className="font-medium">₹{(total_expenses - total_investments).toLocaleString()}</p>
              </div>
              <div className="flex justify-between">
                <p>Total Investments</p>
                <p className="font-medium">₹{total_investments.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Category Budgets</h3>
            <div className="space-y-3">
              {category_budgets.length > 0 ? (
                category_budgets.map((cat, idx) => {
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
                          <p className="text-gray-800 font-medium">{cat?.category_name || "Unknown"}</p>
                          <CustomProgress
                            variant="determinate"
                            value={progress > 100 ? 100 : progress}
                            style={{ width: 130, marginTop: 6 }}
                          />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-700">₹{spent.toLocaleString()}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">No category budgets set.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default budgetTracking;
