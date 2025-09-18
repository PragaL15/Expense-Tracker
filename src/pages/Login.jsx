// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api"; // import your axios instance

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/v1/auth/login", { email, password });

      // Save token if backend returns it
      if (data.token) {
        localStorage.setItem("token", data.token);

        navigate("/budgetTracking");
      } else {
        setError("No token received. Login failed.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
