import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AddExpense from "./pages/AddExpense";
import Login from "./pages/Login"; 
import SignUp from "./pages/signinPage"; 
import AddIncome from "./pages/AddIncome";
import TransactionHistory from "./pages/TransactionHistory";
import BudgetTracking from "./pages/BudgetTracking";
import Sidebar from "./components/NavBar";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const hideSidebar = ["/login", "/register"].includes(location.pathname);
  return (
    <div className="flex">
      {!hideSidebar && <Sidebar />} 
      <div className={`${!hideSidebar ? "flex-1 md:ml-64 p-4" : "w-full"}`}>
        {children}
      </div>
    </div>
  );
};
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/register" element={<SignUp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <BudgetTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-expense"
            element={
              <ProtectedRoute>
                <AddExpense />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-income"
            element={
              <ProtectedRoute>
                <AddIncome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactionHistory"
            element={
              <ProtectedRoute>
                <TransactionHistory />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;