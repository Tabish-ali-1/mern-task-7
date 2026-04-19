import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, ShieldCheck, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Modern Healthcare, <span className="text-[hsl(var(--primary))]">Simplified.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          Book appointments with top specialists seamlessly. Manage your schedule, view availability, and take control of your health journey.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/signup" className="bg-[hsl(var(--primary))] hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
            Get Started
          </Link>
          <Link to="/login" className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-8 py-3 rounded-full text-lg font-semibold shadow-sm hover:shadow transition-all">
            Log In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 card-hover">
            <Calendar className="h-12 w-12 text-[hsl(var(--primary))] mb-4" />
            <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
            <p className="text-gray-600">Find available time slots and book your appointment in just a few clicks.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 card-hover">
            <Clock className="h-12 w-12 text-[hsl(var(--primary))] mb-4" />
            <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
            <p className="text-gray-600">Get immediate status updates on your appointments from pending to approved.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 card-hover">
            <ShieldCheck className="h-12 w-12 text-[hsl(var(--primary))] mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
            <p className="text-gray-600">Your health records and appointments are encrypted and securely stored.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
