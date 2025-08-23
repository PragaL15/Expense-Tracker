import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import Chart from "../components/Chart";
import TransactionList from "../components/TransactionList";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import API from "../utils/api";

const Home = () => {
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryRes = await API.get("/summary");
        const txRes = await API.get("/transactions");
        setSummary(summaryRes.data);
        setTransactions(txRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Home" />
      <div className="p-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card
            label="Total Income"
            value={`₹${summary.income.toLocaleString()}`}
            icon={<ArrowUpCircle className="text-green-500" />}
          />
          <Card
            label="Total Expenses"
            value={`₹${summary.expenses.toLocaleString()}`}
            icon={<ArrowDownCircle className="text-red-500" />}
          />
        </div>

        <Card
          label="Current Balance"
          value={`₹${summary.balance.toLocaleString()}`}
          icon={<Wallet className="text-yellow-500" />}
        />

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Spending Overview</h2>
          <Chart />
        </div>

        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
};

export default Home;
