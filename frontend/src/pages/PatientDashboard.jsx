import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User as UserIcon } from 'lucide-react';

const PatientDashboard = ({ user }) => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bookingForm, setBookingForm] = useState(null); // { doctorId, date, timeSlot }
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors');
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments/me', { withCredentials: true });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/appointments/book', bookingForm, { withCredentials: true });
      setBookingForm(null);
      setError('');
      fetchAppointments();
      alert('Appointment booked successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Patient Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Available Doctors</h2>
          <div className="space-y-4">
            {doctors.map(doctor => (
              <div key={doctor._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 card-hover flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-[hsl(var(--primary))]" /> {doctor.userId?.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 mb-2 ml-7">{doctor.specialization}</p>
                  <div className="text-xs text-gray-500 ml-7 space-y-1">
                    <p><strong>Days:</strong> {doctor.availableDays?.join(', ') || 'N/A'}</p>
                    <p><strong>Slots:</strong> {doctor.slots?.join(', ') || 'N/A'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setBookingForm({ doctorId: doctor._id, date: '', timeSlot: '' })}
                  className="bg-blue-50 text-[hsl(var(--primary))] border border-blue-100 hover:bg-[hsl(var(--primary))] hover:text-white transition-colors px-4 py-2 rounded-md font-medium text-sm"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">My Appointments</h2>
          {appointments.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 border border-gray-100 uppercase tracking-widest text-sm">No appointments right now</div>
          ) : (
            <div className="space-y-4">
              {appointments.map(apt => (
                <div key={apt._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 card-hover">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">Dr. {apt.doctorId?.userId?.name || 'Unknown'}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      apt.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                      apt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 border-t pt-3">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-[hsl(var(--primary))]" /> {apt.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-[hsl(var(--primary))]" /> {apt.timeSlot}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {bookingForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
            {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
            {(() => {
               const doc = doctors.find(d => d._id === bookingForm.doctorId);
               return (
                 <form onSubmit={handleBooking} className="space-y-4">
                   <p className="text-sm text-gray-600 mb-4">Booking with <strong>Dr. {doc?.userId?.name}</strong></p>
                   <div>
                     <label className="block text-sm font-medium mb-1">Date (YYYY-MM-DD)</label>
                     <input type="date" required value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} className="w-full border px-3 py-2 rounded-md" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium mb-1">Time Slot</label>
                     <select required value={bookingForm.timeSlot} onChange={e => setBookingForm({...bookingForm, timeSlot: e.target.value})} className="w-full border px-3 py-2 rounded-md">
                       <option value="">Select a slot</option>
                       {doc?.slots?.map(slot => (
                         <option key={slot} value={slot}>{slot}</option>
                       ))}
                     </select>
                   </div>
                   <div className="flex gap-3 justify-end mt-6">
                     <button type="button" onClick={() => setBookingForm(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors">Cancel</button>
                     <button type="submit" className="px-4 py-2 bg-[hsl(var(--primary))] hover:bg-blue-700 text-white rounded-md font-medium transition-colors">Confirm Booking</button>
                   </div>
                 </form>
               );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
