import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={user ? <Navigate to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'} /> : <Home />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
            
            <Route 
              path="/patient-dashboard" 
              element={
                <ProtectedRoute user={user} role="patient">
                  <PatientDashboard user={user} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/doctor-dashboard" 
              element={
                <ProtectedRoute user={user} role="doctor">
                  <DoctorDashboard user={user} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
