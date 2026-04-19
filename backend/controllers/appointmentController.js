const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;
    const patientId = req.user.userId;

    // Check if slot is already booked and not rejected
    const existingAppointment = await Appointment.findOne({ doctorId, date, timeSlot, status: { $ne: 'Rejected' } });
    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    const appointment = new Appointment({
      doctorId,
      patientId,
      date,
      timeSlot,
      status: 'Pending'
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const { role, userId } = req.user;
    let appointments;

    if (role === 'patient') {
      appointments = await Appointment.find({ patientId: userId })
        .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } })
        .sort({ date: 1, timeSlot: 1 });
    } else if (role === 'doctor') {
      const doctor = await Doctor.findOne({ userId });
      if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
      
      appointments = await Appointment.find({ doctorId: doctor._id })
        .populate('patientId', 'name email')
        .sort({ date: 1, timeSlot: 1 });
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved', 'Completed', 'Rejected'

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Validate that the logged-in doctor is the one for this appointment
    const doctor = await Doctor.findOne({ userId: req.user.userId });
    if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this appointment' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: `Appointment ${status.toLowerCase()}`, appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { bookAppointment, getMyAppointments, updateAppointmentStatus };
