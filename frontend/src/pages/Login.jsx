import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData, { withCredentials: true });
      setUser(res.data.user);
      if (res.data.user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)]">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-[hsl(var(--primary))] mb-6">Welcome Back</h2>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] transition-colors" placeholder="doctor@mediconnect.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:ring-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] transition-colors" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-[hsl(var(--primary))] hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors mt-2">
            Log In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="text-[hsl(var(--primary))] font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
