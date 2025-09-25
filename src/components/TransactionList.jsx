import React from "react";

const TransactionList = ({ transactions }) => {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
      {transactions.map((tx, index) => (
        <div
          key={index}
          className="flex justify-between bg-[#dcf9ab] rounded-xl shadow p-3 mb-2"
        >
          <div>
            <p className="font-medium">{tx.title}</p>
            <p className="text-xs text-gray-500">{tx.subtitle}</p>
          </div>
          <p
            className={`font-semibold ${
              tx.amount < 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            ₹{Math.abs(tx.amount)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
