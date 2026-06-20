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

// ─── About Profile (singleton) ───────────────────────────────────────────────
const aboutProfileSchema = new mongoose.Schema({
  name:          { type: String, default: "Dr. Vishva Patel" },
  title:         { type: String, default: "Consultant Proctologist" },
  location:      { type: String, default: "Vadodara" },
  image_url:     { type: String, default: "" },
  bio:           { type: String, default: "" },
  features:      [{ type: String }],
  credentials:   [{
    label: { type: String },
    body:  { type: String },
  }],
  cards:         [{
    title:       { type: String },
    description: { type: String },
  }],
  mission_title: { type: String, default: "Our Patient-First Mission" },
  mission_text:  { type: String, default: "" },
  stats: {
    procedures:   { type: String, default: "5000+" },
    experience:   { type: String, default: "12+" },
    satisfaction: { type: String, default: "98%" },
    patients:     { type: String, default: "10k+" },
  },
}, { timestamps: true });
export const AboutProfile = mongoose.model("AboutProfile", aboutProfileSchema);

// ─── Home Content (singleton) ────────────────────────────────────────────────
const homeContentSchema = new mongoose.Schema({
  hero_headline:    { type: String, default: "Advanced Laser Proctology" },
  hero_subheadline: { type: String, default: "" },
  hero_cta_text:    { type: String, default: "Book a Consultation" },
  hero_cta_link:    { type: String, default: "/book" },
  stats: [{
    value:  { type: Number },
    suffix: { type: String },
    label:  { type: String },
  }],
  process_steps: [{
    number:      { type: String },
    title:       { type: String },
    description: { type: String },
  }],
  phone_number:    { type: String, default: "+91 99999 99999" },

  whatsapp_number: { type: String, default: "919999999999" },
  // Hero visual config
  hero_particle_color:   { type: String, default: "#1A5B5E" },
  hero_particle_count:   { type: Number, default: 80 },
  hero_bg_gradient_from: { type: String, default: "#0e1b19" },
  hero_bg_gradient_to:   { type: String, default: "#122a27" },
}, { timestamps: true });
export const HomeContent = mongoose.model("HomeContent", homeContentSchema);

const appointmentContentSchema = new mongoose.Schema({
  hero_eyebrow: { type: String, default: "Book An Appointment" },
  hero_headline: { type: String, default: "Reserve your private consultation." },
  hero_subheadline: { type: String, default: "Fill in your details below. Slots are confirmed by our care coordinator within a few working hours." },
}, { timestamps: true });
export const AppointmentContent = mongoose.model("AppointmentContent", appointmentContentSchema);

const serviceContentSchema = new mongoose.Schema({
  hero_eyebrow: { type: String, default: "Treatments & Services" },
  hero_headline: { type: String, default: "Modern proctology, delivered with precision." },
  hero_subheadline: { type: String, default: "Every treatment we offer prioritises minimal pain, faster recovery, and preservation of normal function. Most procedures are day-care — you arrive, get treated, go home." },
}, { timestamps: true });
export const ServiceContent = mongoose.model("ServiceContent", serviceContentSchema);

const blogContentSchema = new mongoose.Schema({
  hero_eyebrow: { type: String, default: "The Journal" },
  hero_headline: { type: String, default: "Articles, insights & patient education." },
  hero_subheadline: { type: String, default: "Evidence-based reading on proctology — written to help you understand your symptoms, treatment options, and recovery." },
}, { timestamps: true });
export const BlogContent = mongoose.model("BlogContent", blogContentSchema);

const testimonialContentSchema = new mongoose.Schema({
  hero_eyebrow: { type: String, default: "Patient Stories" },
  hero_headline: { type: String, default: "Real voices, real outcomes." },
  hero_subheadline: { type: String, default: "Each review comes from a verified patient. We are honoured to have earned their trust during a sensitive time." },
}, { timestamps: true });
export const TestimonialContent = mongoose.model("TestimonialContent", testimonialContentSchema);

const faqContentSchema = new mongoose.Schema({
  hero_eyebrow: { type: String, default: "Answers & Info" },
  hero_headline: { type: String, default: "Commonly asked questions." },
  hero_subheadline: { type: String, default: "Find quick answers to common queries about our procedures, preparation, and recovery timelines." },
}, { timestamps: true });
export const FaqContent = mongoose.model("FaqContent", faqContentSchema);
