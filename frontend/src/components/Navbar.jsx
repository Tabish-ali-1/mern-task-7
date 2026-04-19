import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Stethoscope } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="glassmorphism sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-[hsl(var(--primary))]">
        <Stethoscope className="h-8 w-8" />
        MediConnect
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm font-medium">Hello, {user.name}</span>
            <Link 
              to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'} 
              className="text-sm font-medium hover:text-[hsl(var(--primary))] transition-colors"
            >
              Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium hover:text-[hsl(var(--primary))] transition-colors">
              Log in
            </Link>
            <Link 
              to="/signup" 
              className="bg-[hsl(var(--primary))] hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
