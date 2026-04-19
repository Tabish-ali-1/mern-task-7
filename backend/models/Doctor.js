const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  availableDays: [{ type: String }], // e.g., ['Monday', 'Wednesday']
  slots: [{ type: String }], // e.g., ['09:00', '10:00', '11:00']
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
