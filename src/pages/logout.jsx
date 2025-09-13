// pages/Logout.js
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Logout = () => {
  useEffect(() => {
    // Clear authentication dat
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
  }, []);

  return <Navigate to="/login" replace />;
};

export default Logout;