const Doctor = require('../models/Doctor');
const User = require('../models/User');

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const { specialization, availableDays, slots } = req.body;
    
    let doctor = await Doctor.findOne({ userId: req.user.userId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    doctor.specialization = specialization || doctor.specialization;
    doctor.availableDays = availableDays || doctor.availableDays;
    doctor.slots = slots || doctor.slots;

    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDoctors, getDoctorById, updateDoctorProfile };
