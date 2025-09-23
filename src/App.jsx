import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AddExpense from "./pages/AddExpense";
import Login from "./pages/Login"; 
import SignUp from "./pages/signinPage"; 
import AddIncome from "./pages/AddIncome";
import TransactionHistory from "./pages/TransactionHistory";
import BudgetTracking from "./pages/BudgetTracking";
import Sidebar from "./components/NavBar";
import Logout from "./pages/logout";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const hideSidebar = ["/", "/register", "/logout"].includes(location.pathname);
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
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<SignUp />} />

        {/* Protected Routes inside Layout */}
        <Route
          path="/budgetTracking"
          element={
            <ProtectedRoute>
              <Layout>
                <BudgetTracking />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-expense"
          element={
            <ProtectedRoute>
              <Layout>
                <AddExpense />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-income"
          element={
            <ProtectedRoute>
              <Layout>
                <AddIncome />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactionHistory"
          element={
            <ProtectedRoute>
              <Layout>
                <TransactionHistory />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Logout page */}
        <Route path="/logout" element={<Layout><Logout /></Layout>} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
