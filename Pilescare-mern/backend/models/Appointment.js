import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient_name:      { type: String, required: true, trim: true },
  contact_number:    { type: String, required: true },
  email:             { type: String, lowercase: true },
  service:           { type: String, default: "General Consultation" },
  preferred_date:    { type: String, required: true },
  time_slot:         { type: String, required: true },
  consultation_type: { type: String, enum: ["in-clinic", "online"], default: "in-clinic" },
  notes:             { type: String, maxlength: 1000 },
  status:            { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
  admin_notes:       { type: String },
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
