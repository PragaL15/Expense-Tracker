import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import API from "../utils/api";

// Format YYYY-MM-DD (for <input type="date" />)
const formatISODate = (d = new Date()) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

const AddInvestment = () => {
  const [amountRaw, setAmountRaw] = useState("");
  const [currentValueRaw, setCurrentValueRaw] = useState("");
  const [investmentType, setInvestmentType] = useState(""); // Stocks, Crypto, etc.
  const [dateInvested, setDateInvested] = useState(formatISODate());
  const [reminderDate, setReminderDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ✅ Clean number parsing
  const amountInvested = useMemo(() => {
    const n = parseFloat((amountRaw || "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [amountRaw]);

  const currentValue = useMemo(() => {
    const n = parseFloat((currentValueRaw || "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [currentValueRaw]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amountInvested || amountInvested <= 0) {
      return alert("Please enter a valid invested amount.");
    }
    if (!investmentType) {
      return alert("Please select an investment type.");
    }
    if (!dateInvested) {
      return alert("Please pick a date of investment.");
    }

    setSubmitting(true);
    try {
      await API.post("v1/investments", {
        type: investmentType,
        amount_invested: parseFloat(Number(amountInvested).toFixed(2)),
        current_value: currentValue
          ? parseFloat(Number(currentValue).toFixed(2))
          : null,
        date_invested: new Date(dateInvested).toISOString(), // ✅ backend wants ISO
        reminder_date: reminderDate ? new Date(reminderDate).toISOString() : null,
        notes: notes || null,
      });

      alert("Investment added successfully!");

      // ✅ Reset form
      setAmountRaw("");
      setCurrentValueRaw("");
      setInvestmentType("");
      setDateInvested(formatISODate());
      setReminderDate("");
      setNotes("");
    } catch (err) {
      console.error("Error adding investment:", err);
      alert("Failed to add investment");
    } finally {
      setSubmitting(false);
    }
  };

  const investmentTypes = [
    "Stocks",
    "Mutual Funds",
    "Crypto",
    "Bonds",
    "Fixed Deposit",
    "Real Estate",
    "Gold",
    "Others",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Add Investment" />

      <div className="mx-auto max-w-md px-4 pb-28 pt-4">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Amount Invested */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="text-gray-500 text-sm mb-2">Amount Invested</div>
            <input
              inputMode="decimal"
              type="text"
              value={amountRaw}
              onChange={(e) => setAmountRaw(e.target.value)}
              placeholder="e.g., 25000.50"
              className="w-full text-3xl sm:text-4xl outline-none border-0 focus:ring-0 placeholder-gray-400"
            />
          </div>

          {/* Current Value */}
          {/* <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="text-gray-500 text-sm mb-2">Current Value</div>
            <input
              inputMode="decimal"
              type="text"
              value={currentValueRaw}
              onChange={(e) => setCurrentValueRaw(e.target.value)}
              placeholder="e.g., 27000.75"
              className="w-full text-xl outline-none border-0 focus:ring-0 placeholder-gray-400"
            />
          </div> */}

          {/* Investment Type */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="text-gray-500 text-sm mb-2">Investment Type</div>
            <select
              value={investmentType}
              onChange={(e) => setInvestmentType(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3"
              required
            >
              <option value="">Select type</option>
              {investmentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Date of Investment */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="text-gray-500 text-sm mb-2">Date of Investment</div>
            <input
              type="date"
              value={dateInvested}
              onChange={(e) => setDateInvested(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3"
              required
            />
          </div>

          {/* Reminder Date */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="text-gray-500 text-sm mb-2">Reminder Date</div>
            <input
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3"
            />
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="text-gray-500 text-sm mb-2">Notes (Optional)</div>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Long-term investment in blue-chip stocks"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3"
            />
          </div>
        </form>
      </div>

      {/* CTA */}
      <div className="fixed inset-x-0 bottom-0">
        <div className="mx-auto max-w-md px-4 pb-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-[#3a5a40] hover:bg-[#3d7147] disabled:opacity-60 text-[#FEFAE0] font-semibold rounded-xl py-3 shadow-md transition"
          >
            {submitting ? "Adding..." : "Add Investment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInvestment;
