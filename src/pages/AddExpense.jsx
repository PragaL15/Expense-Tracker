import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import API from "../utils/api";
import CategoryDropdown from "../components/CategoryDropdown"

/**
 * Assumptions:
 * - API baseURL is already /api/v1 in ../utils/api
 * - GET /categories returns [{ id, name }] (adjust mapping if different)
 * - POST /transactions expects { amount:number, category:string|id, date:string(YYYY-MM-DD), notes:string }
 *   (If your backend expects category_id, change payload accordingly.)
 */

const formatISODate = (d = new Date()) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

const AddExpense = () => {
  const [amountRaw, setAmountRaw] = useState(""); 
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState(formatISODate());
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pretty number (0.00) but keep raw state editable
  const amount = useMemo(() => {
    const n = parseFloat((amountRaw || "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [amountRaw]);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/v1/categories?type=Expense");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    })();
  }, []);

  const onAmountChange = (e) => {
    // Allow digits + one dot, limit to 2 decimals visually
    const v = e.target.value;
    const cleaned = v.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    const safe =
      parts.length > 2
        ? `${parts[0]}.${parts.slice(1).join("")}`
        : cleaned;
    const [intPart, decPart] = safe.split(".");
    const final =
      decPart && decPart.length > 2
        ? `${intPart}.${decPart.slice(0, 2)}`
        : safe;
    setAmountRaw(final);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return alert("Please enter a valid amount.");
    if (!category) return alert("Please select a category.");
    if (!date) return alert("Please pick a date.");
  
    setSubmitting(true);
    try {
      await API.post("v1/transactions/expense", {
        amount: parseFloat(Number(amount).toFixed(2)), // ensure numeric
        category_id: category,                        // match backend
        transaction_type: "Expense",                  // or a state value
        date: date,                                   // YYYY-MM-DD
        notes: notes || null,                         // optional
      });
  
      alert("Expense added successfully!");
  
      // Reset form
      setAmountRaw("");
      setCategory("");
      setDate(formatISODate());
      setNotes("");
    } catch (error) {
      console.error(error);
      alert("Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Add Expense" />

      {/* Page container (mobile width) */}
      <div className="mx-auto max-w-md px-4 pb-28 pt-4">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Amount Card */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="text-gray-500 text-sm mb-2">Amount</div>
            <div className="flex items-end gap-2">
              <div className="text-3xl sm:text-4xl leading-none">₹</div>
              <input
                inputMode="decimal"
                type="text"
                value={amountRaw}
                onChange={onAmountChange}
                placeholder="0.00"
                className="w-full text-3xl sm:text-4xl leading-none outline-none border-0 focus:ring-0 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Category Card */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-500 text-sm">Category</div>
            </div>
            <CategoryDropdown
  categories={categories}
  category={category}
  setCategory={setCategory}
/>

          </div>

          {/* Date Card */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="text-gray-500 text-sm mb-2">Date</div>
            <div className="relative">
              <input
                type="date"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M8 7V3m8 4V3M4 11h16M5 20h14a1 1 0 0 0 1-1V7H4v12a1 1 0 0 0 1 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="text-gray-500 text-sm mb-2">Notes (Optional)</div>
            <textarea
              rows={4}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400"
              placeholder="Add any specific details about this expense..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed inset-x-0 bottom-0">
        <div className="mx-auto max-w-md px-4 pb-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-black font-semibold rounded-xl py-3 shadow-md transition"
          >
            {submitting ? "Adding..." : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
