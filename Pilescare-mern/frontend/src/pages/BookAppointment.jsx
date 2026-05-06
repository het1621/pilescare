import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CalendarIcon, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "../lib/api";

gsap.registerPlugin(ScrollTrigger);

function MiniCalendar({ selected, onSelect }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date(); d.setDate(1); return d;
  });
  const today = new Date(); today.setHours(0,0,0,0);
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const prev = () => setCursor(new Date(year, month - 1, 1));
  const next = () => setCursor(new Date(year, month + 1, 1));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-white rounded-2xl border border-brand-primary/10 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-1.5 rounded-lg hover:bg-brand-subtle text-brand-textSecondary transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="font-serif text-base font-semibold text-brand-text">{MONTHS[month]} {year}</span>
        <button onClick={next} className="p-1.5 rounded-lg hover:bg-brand-subtle text-brand-textSecondary transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-wider text-brand-textMuted py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const date = new Date(year, month, d);
          const isPast = date < today;
          const isSel = selected && format(selected, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
          const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
          return (
            <button
              key={d}
              onClick={() => !isPast && onSelect(date)}
              disabled={isPast}
              className={`w-full aspect-square rounded-lg text-sm font-medium transition-all duration-200
                ${isPast ? "text-brand-textMuted cursor-not-allowed opacity-40" : "cursor-pointer"}
                ${isSel ? "bg-brand-primary text-white shadow-md" : ""}
                ${!isSel && isToday ? "border border-brand-primary text-brand-primary" : ""}
                ${!isSel && !isPast && !isToday ? "text-brand-text hover:bg-brand-secondary" : ""}
              `}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div>
    <label className="book-form-label block text-xs uppercase tracking-[0.18em] mb-2">{label}</label>
    {children}
  </div>
);

export default function BookAppointment() {
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [form, setForm] = useState({
    patient_name: "", contact_number: "", email: "",
    time_slot: "", consultation_type: "in-clinic", notes: "",
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".book-hero-text", { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.15 });
      gsap.from(".book-form-wrap", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.4 });
      gsap.from(".book-side-card", { x: 30, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, delay: 0.5 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!date) return;
    const dStr = format(date, "yyyy-MM-dd");
    setLoadingSlots(true);
    setForm(f => ({ ...f, time_slot: "" }));
    api.get(`/time-slots?date=${dStr}`)
      .then(({ data }) => setSlots(data))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) return toast.error("Please select a date");
    if (!form.time_slot) return toast.error("Please select a time slot");
    setSubmitting(true);
    try {
      const service = form.consultation_type === "online" ? "Online Consultation" : "In-Clinic Consultation";
      const payload = { ...form, service, preferred_date: format(date, "yyyy-MM-dd") };
      if (!payload.email) delete payload.email;
      const { data } = await api.post("/appointments", payload);
      setConfirmation(data);
      toast.success("Appointment requested successfully");
    } catch (err) {
      const msg = formatApiError(err.response?.data?.detail) || err.response?.data?.detail || err.response?.data?.message || err.message || "Booking failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <div className="container-page py-24" ref={rootRef}>
        <div className="max-w-xl mx-auto card-soft p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-brand-success/12 text-brand-success mx-auto flex items-center justify-center mb-6">
            <Check size={36} strokeWidth={2} />
          </div>
          <span className="label-eyebrow block mb-3">Appointment Received</span>
          <h1 className="font-serif text-3xl text-brand-text font-semibold">Thank you, {confirmation.patient_name}.</h1>
          <p className="text-brand-textSecondary mt-4 leading-relaxed text-sm">
            Your request for <strong>{confirmation.service}</strong> on <strong>{confirmation.preferred_date}</strong> at <strong>{confirmation.time_slot}</strong> has been received. Our care coordinator will call you on <strong>{confirmation.contact_number}</strong> to confirm.
          </p>
          {confirmation.email && (
            <p className="text-xs text-brand-textMuted mt-3">A confirmation has been sent to {confirmation.email}.</p>
          )}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <button onClick={() => navigate("/")} className="btn-secondary">Back to Home</button>
            <button onClick={() => { setConfirmation(null); setDate(null); setForm({ patient_name: "", contact_number: "", email: "", time_slot: "", consultation_type: "in-clinic", notes: "" }); }} className="btn-primary">
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} data-testid="booking-page">
      {/* Hero */}
      <section className="bg-brand-dark py-16 lg:py-20">
        <div className="container-page text-center max-w-3xl mx-auto">
          <span className="book-hero-text label-eyebrow !text-brand-accent/80">Book An Appointment</span>
          <h1 className="book-hero-text font-serif text-4xl lg:text-6xl text-white font-medium tracking-tight mt-4 leading-[1.05]">
            Reserve your private consultation.
          </h1>
          <p className="book-hero-text mt-5 text-white/55 text-base leading-relaxed max-w-xl mx-auto">
            Fill in your details below. Slots are confirmed by our care coordinator within a few working hours.
          </p>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="container-page py-16 grid lg:grid-cols-3 gap-10 items-start">
        {/* Main form */}
        <form onSubmit={handleSubmit} className="book-form-wrap lg:col-span-2 card-soft p-8 lg:p-10 space-y-6 opacity-100">
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Patient Name *">
              <input type="text" required value={form.patient_name} onChange={e => setForm({ ...form, patient_name: e.target.value })}
                className="bk-input" placeholder="Your full name" />
            </Field>
            <Field label="Contact Number *">
              <input type="tel" required value={form.contact_number} onChange={e => setForm({ ...form, contact_number: e.target.value })}
                className="bk-input" placeholder="+91 90000 00000" />
            </Field>
          </div>

          <Field label="Email (optional — for confirmation copy)">
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="bk-input" placeholder="you@example.com" />
          </Field>

          <Field label="Consultation Type *">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "in-clinic", label: "In-Clinic", sub: "Visit us in Vadodara" },
                { id: "online",   label: "Online",     sub: "Video call from home" },
              ].map(opt => (
                <button key={opt.id} type="button" onClick={() => setForm({ ...form, consultation_type: opt.id })}
                  className={`rounded-xl border p-4 text-left transition-all duration-200
                    ${form.consultation_type === opt.id
                      ? "bg-brand-primary text-white border-brand-primary shadow-md"
                      : "bg-white text-brand-text border-brand-primary/15 hover:border-brand-primary/40"
                    }`}>
                  <div className="text-sm font-semibold">{opt.label}</div>
                  <div className={`text-xs mt-0.5 ${form.consultation_type === opt.id ? "text-white/70" : "text-brand-textMuted"}`}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </Field>

          <Field label="Preferred Date *">
            <MiniCalendar selected={date} onSelect={setDate} />
          </Field>

          {date && (
            <Field label={`Time Slots for ${format(date, "d MMM yyyy")} *`}>
              {loadingSlots ? (
                <div className="flex items-center gap-2 text-sm text-brand-textMuted py-2">
                  <Loader2 size={14} className="animate-spin" /> Fetching available slots…
                </div>
              ) : slots.length === 0 ? (
                <p className="text-sm text-brand-textMuted">No slots available for this date.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map(s => (
                    <button key={s.slot} type="button" disabled={!s.available}
                      onClick={() => setForm({ ...form, time_slot: s.slot })}
                      className={`rounded-full px-3 py-2 text-xs font-medium transition-all duration-200
                        ${!s.available ? "bg-brand-subtle text-brand-textMuted line-through cursor-not-allowed" :
                          form.time_slot === s.slot ? "bg-brand-primary text-white shadow-sm" :
                          "bg-white border border-brand-primary/20 text-brand-text hover:border-brand-primary hover:shadow-sm"
                        }`}>
                      {s.slot}
                    </button>
                  ))}
                </div>
              )}
            </Field>
          )}

          <Field label="Additional Notes (optional)">
            <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              className="bk-input resize-none" placeholder="Anything you'd like the doctor to know in advance…" />
          </Field>

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center !py-4 text-base shadow-[0_6px_20px_rgba(26,91,94,0.3)]">
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : "Confirm Appointment Request"}
          </button>
          <p className="text-xs text-brand-textMuted text-center">
            By submitting, you agree to be contacted by our care coordinator. Your information is fully confidential.
          </p>
        </form>

        {/* Sidebar info */}
        <div className="space-y-4 lg:sticky lg:top-28">
          {[
            { icon: "🕒", title: "Clinic Hours", body: "Mon–Sat: 10 AM – 1 PM & 4 PM – 7:30 PM\nSunday: Closed" },
            { icon: "📍", title: "Clinic Location", body: "3rd Floor, Sterling Centre\nRace Course Circle, Vadodara 390007" },
            { icon: "📞", title: "Quick Call", body: "+91 99999 99999\nFor urgent queries or same-day slots" },
            { icon: "💬", title: "WhatsApp", body: "Message us any time for faster responses" },
          ].map(({ icon, title, body }) => (
            <div key={title} className="book-side-card card-soft p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-secondary flex items-center justify-center text-xl shrink-0">{icon}</div>
                <div>
                  <div className="font-serif text-base font-semibold text-brand-text">{title}</div>
                  <p className="text-xs text-brand-textSecondary mt-1 leading-relaxed whitespace-pre-line">{body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .book-form-label { color: #000 !important; font-weight: 700 !important; opacity: 1 !important; letter-spacing: 0.04em; }
        form.book-form-wrap { opacity: 1 !important; }
        .bk-input{width:100%;background:#fff;border:1px solid rgba(26,91,94,.15);border-radius:.75rem;padding:.75rem 1rem;font-size:.9rem;color:#1B2421;outline:none;transition:border-color .2s,box-shadow .2s;font-family:inherit;opacity:1}.bk-input::placeholder{color:#8FA89F;opacity:0.7}.bk-input:focus{border-color:#1A5B5E;box-shadow:0 0 0 3px rgba(26,91,94,.08)}
      `}</style>
    </div>
  );
}
