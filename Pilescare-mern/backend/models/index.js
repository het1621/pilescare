import mongoose from "mongoose";
import slugify from "slugify";

// ─── Service ─────────────────────────────────────────────────────────────────
const serviceSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  slug:       { type: String, unique: true },
  icon:       { type: String, default: "Sparkles" },
  image:      { type: String },
  summary:    { type: String, required: true },
  details:    [String],
  sort_order: { type: Number, default: 0 },
}, { timestamps: true });
serviceSchema.pre("save", function (next) {
  if (!this.slug) this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});
export const Service = mongoose.model("Service", serviceSchema);

// ─── Testimonial ─────────────────────────────────────────────────────────────
const testimonialSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  city:    String,
  rating:  { type: Number, min: 1, max: 5, default: 5 },
  service: String,
  text:    { type: String, required: true },
  visible: { type: Boolean, default: true },
}, { timestamps: true });
export const Testimonial = mongoose.model("Testimonial", testimonialSchema);

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faqSchema = new mongoose.Schema({
  category:   { type: String, default: "General" },
  question:   { type: String, required: true },
  answer:     { type: String, required: true },
  sort_order: { type: Number, default: 0 },
}, { timestamps: true });
export const FAQ = mongoose.model("FAQ", faqSchema);

// ─── Clinic Settings (singleton) ─────────────────────────────────────────────
const clinicSettingsSchema = new mongoose.Schema({
  clinic_name:    { type: String, default: "ProctoCare by Vishva" },
  tagline:        String,
  address_line1:  String,
  address_line2:  String,
  landmark:       String,
  city:           String,
  state:          String,
  pincode:        String,
  hours:          String,
  contact_email:  String,
  maps_link:      String,
  maps_embed_url: String,
}, { timestamps: true });
export const ClinicSettings = mongoose.model("ClinicSettings", clinicSettingsSchema);

// ─── Contact Message ─────────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   String,
  message: { type: String, required: true },
  read:    { type: Boolean, default: false },
}, { timestamps: true });
export const Contact = mongoose.model("Contact", contactSchema);
