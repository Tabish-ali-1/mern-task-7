import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const DoctorDashboard = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState({ specialization: '', availableDays: [], slots: [] });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchProfile();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments/me', { withCredentials: true });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
      if (res.data.doctorId) {
         const docRes = await axios.get(`http://localhost:5000/api/doctors/${res.data.doctorId}`);
         setProfile({
           specialization: docRes.data.specialization || '',
           availableDays: docRes.data.availableDays || [],
           slots: docRes.data.slots || []
         });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/status`, { status }, { withCredentials: true });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const saveProfile = async () => {
    try {
      // In a real app we'd map string arrays from inputs, but here we'll assume comma-separated 
      const updatedProfile = {
        specialization: profile.specialization,
        availableDays: typeof profile.availableDays === 'string' ? profile.availableDays.split(',').map(s=>s.trim()) : profile.availableDays,
        slots: typeof profile.slots === 'string' ? profile.slots.split(',').map(s=>s.trim()) : profile.slots,
      };
      await axios.put('http://localhost:5000/api/doctors/profile', updatedProfile, { withCredentials: true });
      setIsEditing(false);
      fetchProfile();
      alert('Profile updated');
    } catch (err) {
      alert('Error updating profile');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Management */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">My Profile</h2>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                <input type="text" value={profile.specialization} onChange={e => setProfile({...profile, specialization: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Available Days (comma separated)</label>
                <input type="text" value={Array.isArray(profile.availableDays) ? profile.availableDays.join(', ') : profile.availableDays} onChange={e => setProfile({...profile, availableDays: e.target.value})} placeholder="Monday, Wednesday" className="w-full mt-1 px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slots (comma separated)</label>
                <input type="text" value={Array.isArray(profile.slots) ? profile.slots.join(', ') : profile.slots} onChange={e => setProfile({...profile, slots: e.target.value})} placeholder="09:00, 10:00" className="w-full mt-1 px-3 py-2 border rounded-md" />
              </div>
              <div className="flex gap-2">
                <button onClick={saveProfile} className="bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-md text-sm">Save</button>
                <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p><strong>Specialization:</strong> {profile.specialization || 'Not set'}</p>
              <p><strong>Days:</strong> {Array.isArray(profile.availableDays) ? profile.availableDays.join(', ') : ''}</p>
              <p><strong>Slots:</strong> {Array.isArray(profile.slots) ? profile.slots.join(', ') : ''}</p>
              <button onClick={() => setIsEditing(true)} className="mt-4 border border-[hsl(var(--primary))] text-[hsl(var(--primary))] px-4 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors">Edit Profile</button>
            </div>
          )}
        </div>

        {/* Appointments List */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
          {appointments.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 border border-gray-100 uppercase tracking-widest text-sm">No appointments yet</div>
          ) : (
            <div className="space-y-4">
              {appointments.map(apt => (
                <div key={apt._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 card-hover">
                  <div>
                    <h3 className="font-semibold text-lg">{apt.patientId?.name || 'Unknown Patient'}</h3>
                    <div className="flex gap-3 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {apt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {apt.timeSlot}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      apt.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                      apt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {apt.status}
                    </span>
                    {apt.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(apt._id, 'Approved')} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button onClick={() => updateStatus(apt._id, 'Rejected')} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    {apt.status === 'Approved' && (
                       <button onClick={() => updateStatus(apt._id, 'Completed')} className="text-sm bg-[hsl(var(--primary))] text-white px-3 py-1 rounded-md hover:bg-blue-700 transition">
                         Mark Completed
                       </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
