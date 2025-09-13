// pages/Logout.js
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Logout = () => {
  useEffect(() => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // You can add any additional cleanup here
  }, []);

  // Redirect to login page immediately
  return <Navigate to="/login" replace />;
};

export default Logout;