import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Stethoscope, HeartPulse, ShieldPlus, Sparkles, Calendar, Video, Check, ArrowRight } from "lucide-react";
import api from "../lib/api";

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP = { Stethoscope, HeartPulse, ShieldPlus, Sparkles, Calendar, Video };

const FALLBACK = [
  { _id: "1", icon: "HeartPulse",  title: "Laser Piles",             slug: "laser-piles",  summary: "Painless, bloodless day-care laser procedure. Back to normal life within 48 hours.", details: ["1470nm diode laser", "No cuts or stitches", "Same-day discharge", "99% success rate"] },
  { _id: "2", icon: "Stethoscope", title: "Anal Fissure Treatment",   slug: "fissure",       summary: "Chronic and acute fissures treated with BOTOX or LIS. Zero incontinence risk.", details: ["BOTOX injection therapy", "Lateral internal sphincterotomy", "Rapid healing", "Pain-free recovery"] },
  { _id: "3", icon: "ShieldPlus",  title: "Fistula Surgery (VAAFT)",  slug: "fistula",       summary: "Video-assisted sphincter-saving fistula treatment — highest cure rate, no sphincter damage.", details: ["Sphincter preservation", "Video-guided precision", "Low recurrence", "Day-care procedure"] },
  { _id: "4", icon: "Sparkles",    title: "Pilonidal Sinus",          slug: "pilonidal",     summary: "Minimally invasive EPSIT technique. No open wound, fast return to work.", details: ["EPSIT technique", "No open wound", "2–3 days rest only", "High cure rate"] },
  { _id: "5", icon: "Video",       title: "Online Consultation",      slug: "online",        summary: "Confidential video consultation with Dr. Vishva from the privacy of your home.", details: ["Secure video platform", "Prescription provided", "Lab review included", "Follow-up support"] },
  { _id: "6", icon: "Calendar",    title: "Follow-up Care",           slug: "followup",      summary: "Structured post-procedure care to ensure complete healing and prevent recurrence.", details: ["Personalised diet plan", "Wound dressing guidance", "Emergency helpline", "Medication review"] },
];

export default function Services() {
  const rootRef  = useRef(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/services")
      .then(({ data }) => setServices(data.length ? data : FALLBACK))
      .catch(() => setServices(FALLBACK));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title
      gsap.from(".svc-hero-text", {
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.2,
      });

      // Each service card alternates from left / right
      gsap.utils.toArray(".service-row").forEach((row, i) => {
        gsap.from(row, {
          x: i % 2 === 0 ? -60 : 60,
          opacity: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 78%", once: true },
        });
      });

    }, rootRef);
    return () => ctx.revert();
  }, [services]);

  const list = services.length ? services : FALLBACK;

  return (
    <div ref={rootRef} data-testid="services-page">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="container-page pt-20 pb-16 max-w-4xl">
        <span className="label-eyebrow svc-hero-text">Treatments & Services</span>
        <h1 className="svc-hero-text font-serif text-5xl lg:text-7xl text-brand-text font-medium tracking-tight mt-5 leading-[1.04]">
          Modern proctology,<br />
          <em className="text-brand-primary italic">delivered with precision.</em>
        </h1>
        <p className="svc-hero-text mt-7 text-lg text-brand-textSecondary leading-relaxed max-w-2xl">
          Every treatment we offer prioritises minimal pain, faster recovery, and preservation
          of normal function. Most procedures are day-care — you arrive, get treated, go home.
        </p>
      </section>

      {/* ── Service list ──────────────────────────────────────────── */}
      <section className="container-page pb-28 space-y-8">
        {list.map((s, idx) => {
          const Icon = ICON_MAP[s.icon] || Sparkles;
          const flip = idx % 2 === 1;
          return (
            <div
              key={s._id || s.slug}
              id={s.slug}
              className="service-row card-soft p-8 lg:p-12 grid md:grid-cols-12 gap-8 items-center"
              data-testid={`service-detail-${s.slug}`}
            >
              {/* Image / icon column */}
              <div className={`md:col-span-5 ${flip ? "md:order-2" : ""}`}>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-secondary group">
                  {s.image ? (
                    <>
                      <img
                        src={s.image} alt={s.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-5 left-5 w-12 h-12 rounded-xl bg-white/90 backdrop-blur text-brand-primary flex items-center justify-center shadow-md">
                        <Icon size={22} strokeWidth={1.5} />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
                      <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                        <Icon size={44} className="text-brand-primary" strokeWidth={1} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Text column */}
              <div className="md:col-span-7">
                <span className="label-eyebrow">Service · 0{idx + 1}</span>
                <h2 className="font-serif text-3xl lg:text-4xl text-brand-text font-semibold mt-3">{s.title}</h2>
                <p className="text-base text-brand-textSecondary mt-4 leading-relaxed">{s.summary}</p>

                {s.details?.length > 0 && (
                  <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                    {s.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-brand-text">
                        <Check size={15} className="text-brand-primary mt-0.5 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Link to="/book" className="btn-primary mt-8" data-testid={`book-${s.slug}-btn`}>
                  Book for {s.title} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────── */}
      <section className="bg-brand-secondary py-16">
        <div className="container-page text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl lg:text-4xl text-brand-text font-semibold">
            Not sure which treatment you need?
          </h2>
          <p className="mt-4 text-brand-textSecondary">
            Book a consultation — Dr. Vishva will diagnose and explain everything in plain language, with no pressure.
          </p>
          <Link to="/book" className="btn-primary mt-7 shadow-md">
            Book a Consultation <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
