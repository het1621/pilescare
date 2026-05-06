import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Clock, Navigation, Check, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "../lib/api";

gsap.registerPlugin(ScrollTrigger);

const Field = ({ label, children }) => (
  <div>
    <label className="contact-form-label block text-xs uppercase tracking-[0.18em] mb-2">{label}</label>
    {children}
  </div>
);

export default function Contact() {
  const rootRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get("/clinic-settings")
      .then(({ data }) => setSettings(data))
      .catch(() => setSettings({}));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ct-hero-txt",  { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.1 });
      gsap.from(".ct-info-card", {
        x: -30, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: ".ct-grid", start: "top 78%", once: true },
      });
      gsap.from(".ct-form-wrap", {
        x: 30, opacity: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".ct-grid", start: "top 78%", once: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/contact", form);
      setDone(true);
      toast.success("Message sent — we'll respond shortly");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Failed to send");
    } finally {
      setSubmitting(false);
    }
  };

  const s = settings || {};
  const addr = [s.address_line1, s.address_line2, s.landmark, [s.city, s.state, s.pincode].filter(Boolean).join(", ")].filter(Boolean);

  // Added a default fallback map so the user never just sees a blank gray box
  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118106.70010221669!2d73.17308625!3d22.32210265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8ab91a3ddab%3A0xac39d3bfe1473fb8!2sVadodara%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1714392472439!5m2!1sen!2sin";
  const mapSrc = s.maps_embed_url || defaultMapUrl;

  return (
    <div ref={rootRef} data-testid="contact-page">
      {/* Hero */}
      <section className="bg-brand-dark py-20 lg:py-28">
        <div className="container-page max-w-3xl">
          <span className="ct-hero-txt label-eyebrow !text-brand-accent/80">Contact</span>
          <h1 className="ct-hero-txt font-serif text-5xl lg:text-7xl text-white font-medium tracking-tight mt-4 leading-[1.04]">
            We'd love to<br /><em className="text-brand-accent italic">hear from you.</em>
          </h1>
          <p className="ct-hero-txt mt-6 text-white/55 text-lg leading-relaxed">
            Every message is read and responded to personally. Expect a reply within one working day.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="ct-grid container-page py-16 grid lg:grid-cols-12 gap-10">

        {/* Info column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Email */}
          <a href={`mailto:${s.contact_email || "drvishvapatel6298@gmail.com"}`}
            className="ct-info-card card-soft p-6 flex items-start gap-4 hover:border-brand-primary/20 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-brand-secondary text-brand-primary flex items-center justify-center shrink-0">
              <Mail size={20} strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-brand-textMuted mb-1">Email</div>
              <div className="font-serif text-base text-brand-text font-semibold break-all">
                {s.contact_email || "drvishvapatel6298@gmail.com"}
              </div>
            </div>
          </a>

          {/* Phone */}
          <a href="tel:+919999999999" className="ct-info-card card-soft p-6 flex items-start gap-4 hover:border-brand-primary/20 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-brand-secondary text-brand-primary flex items-center justify-center shrink-0">
              <Phone size={20} strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-brand-textMuted mb-1">Phone</div>
              <div className="font-serif text-base text-brand-text font-semibold">+91 99999 99999</div>
            </div>
          </a>

          {/* Hours */}
          {s.hours && (
            <div className="ct-info-card card-soft p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-brand-secondary text-brand-primary flex items-center justify-center shrink-0">
                <Clock size={20} strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-brand-textMuted mb-1">Clinic Hours</div>
                <div className="text-sm text-brand-text leading-relaxed whitespace-pre-line">{s.hours}</div>
              </div>
            </div>
          )}

          {/* Location */}
          <div className="ct-info-card card-soft p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 rounded-xl bg-brand-secondary text-brand-primary flex items-center justify-center shrink-0">
                <MapPin size={20} strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-brand-textMuted mb-1">Clinic Location</div>
                {s.clinic_name && <div className="font-serif text-base text-brand-primary font-semibold">{s.clinic_name}</div>}
                {addr.map((line, i) => <div key={i} className="text-sm text-brand-textSecondary leading-relaxed">{line}</div>)}
                {s.maps_link && (
                  <a href={s.maps_link} target="_blank" rel="noreferrer"
                    className="btn-secondary !py-2 !px-4 text-xs mt-4 inline-flex">
                    <Navigation size={13} /> Get Directions
                  </a>
                )}
              </div>
            </div>
            
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-brand-primary/10">
              <iframe title="Clinic location" src={mapSrc}
                width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="ct-form-wrap lg:col-span-7">
          {done ? (
            <div className="card-soft p-12 text-center h-full flex flex-col items-center justify-center" data-testid="contact-success">
              <div className="w-16 h-16 rounded-full bg-brand-success/12 text-brand-success flex items-center justify-center mb-5">
                <Check size={32} />
              </div>
              <h2 className="font-serif text-3xl text-brand-text font-semibold">Message Received</h2>
              <p className="text-sm text-brand-textSecondary mt-3 max-w-xs">
                Thank you, {form.name || "friend"}. We'll get back to you within one working day.
              </p>
              <button onClick={() => { setDone(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                className="btn-primary mt-7">Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={submit} className="card-soft p-8 lg:p-10 space-y-5">
              <h2 className="font-serif text-2xl text-brand-text font-semibold mb-2">Send a Message</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Name *">
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="ct-input" placeholder="Your full name" />
                </Field>
                <Field label="Email *">
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="ct-input" placeholder="you@example.com" />
                </Field>
              </div>
              <Field label="Phone (optional)">
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="ct-input" placeholder="+91 90000 00000" />
              </Field>
              <Field label="Message *">
                <textarea required rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  className="ct-input resize-none" placeholder="Tell us how we can help…" />
              </Field>
              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center !py-4">
                {submitting ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : "Send Message"}
              </button>
              <p className="text-xs text-brand-textMuted text-center">
                Your message is private and will only be seen by our team.
              </p>
            </form>
          )}
        </div>
      </section>

      <style>{`
        .contact-form-label { color: #000 !important; font-weight: 700 !important; opacity: 1 !important; letter-spacing: 0.04em; }
        .ct-input{width:100%;background:#fff;border:1px solid rgba(26,91,94,.15);border-radius:.75rem;padding:.75rem 1rem;font-size:.9rem;color:#1B2421;outline:none;transition:border-color .2s,box-shadow .2s;font-family:inherit}
        .ct-input:focus{border-color:#1A5B5E;box-shadow:0 0 0 3px rgba(26,91,94,.08)}
      `}</style>
    </div>
  );
}