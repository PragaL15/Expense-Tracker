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
      <Layout>
        <Routes>
          {/* Login page as root path */}
          <Route path="/" element={<Login />} />
          
          <Route path="/register" element={<SignUp />} />
          
          {/* Updated budget tracking route */}
          <Route
            path="/budgetTracking"
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
          
          <Route path="/logout" element={<Logout />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;