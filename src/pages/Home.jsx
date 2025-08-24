import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import Chart from "../components/Chart";
import TransactionList from "../components/TransactionList";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import API from "../utils/api";

const Home = () => {
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    income_by_category: [],
    expense_by_category: []
  });
  const [incomeTransactions, setIncomeTransactions] = useState([]);
  const [expenseTransactions, setExpenseTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Summary
        const summaryRes = await API.get("v1/summary");
        setSummary(summaryRes.data);

        // Income transactions
        const incomeRes = await API.get("v1/transactions/income");
        setIncomeTransactions(incomeRes.data);

        // Expense transactions
        const expenseRes = await API.get("v1/transactions/expense");
        setExpenseTransactions(expenseRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Combine transactions for displaying in TransactionList
  const allTransactions = [
    ...incomeTransactions.map((t) => ({ ...t, type: "Income" })),
    ...expenseTransactions.map((t) => ({ ...t, type: "Expense" }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Home" />
      <div className="p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card
            label="Total Income"
            value={`₹${(summary.income || 0).toLocaleString()}`}
            icon={<ArrowUpCircle className="text-green-500" />}
          />
          <Card
            label="Total Expenses"
            value={`₹${(summary.expenses || 0).toLocaleString()}`}
            icon={<ArrowDownCircle className="text-red-500" />}
          />
        </div>

        <Card
          label="Current Balance"
          value={`₹${(summary.balance || 0).toLocaleString()}`}
          icon={<Wallet className="text-yellow-500" />}
        />

        {/* Spending Overview */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Spending Overview</h2>
          <Chart
            incomeData={summary.income_by_category}
            expenseData={summary.expense_by_category}
          />
        </div>

        {/* Recent Transactions */}
        <TransactionList transactions={allTransactions} />
      </div>
    </div>
  );
};

export default Home;
