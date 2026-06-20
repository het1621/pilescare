import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ServiceRowSkeleton } from "../components/Skeleton";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Stethoscope,
  HeartPulse,
  ShieldPlus,
  Sparkles,
  Calendar,
  Video,
  Check,
  ArrowRight,
} from "lucide-react";
import api from "../lib/api";

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP = {
  Stethoscope,
  HeartPulse,
  ShieldPlus,
  Sparkles,
  Calendar,
  Video,
};

const FALLBACK = [
  {
    _id: "1",
    icon: "HeartPulse",
    title: "Laser Piles",
    slug: "laser-piles",
    summary:
      "Painless, bloodless day-care laser procedure. Back to normal life within 48 hours.",
    details: [
      "1470nm diode laser",
      "No cuts or stitches",
      "Same-day discharge",
      "99% success rate",
    ],
  },
  {
    _id: "2",
    icon: "Stethoscope",
    title: "Anal Fissure Treatment",
    slug: "fissure",
    summary:
      "Chronic and acute fissures treated with BOTOX or LIS. Zero incontinence risk.",
    details: [
      "BOTOX injection therapy",
      "Lateral internal sphincterotomy",
      "Rapid healing",
      "Pain-free recovery",
    ],
  },
  {
    _id: "3",
    icon: "ShieldPlus",
    title: "Fistula Surgery (VAAFT)",
    slug: "fistula",
    summary:
      "Video-assisted sphincter-saving fistula treatment — highest cure rate, no sphincter damage.",
    details: [
      "Sphincter preservation",
      "Video-guided precision",
      "Low recurrence",
      "Day-care procedure",
    ],
  },
  {
    _id: "4",
    icon: "Sparkles",
    title: "Pilonidal Sinus",
    slug: "pilonidal",
    summary:
      "Minimally invasive EPSIT technique. No open wound, fast return to work.",
    details: [
      "EPSIT technique",
      "No open wound",
      "2–3 days rest only",
      "High cure rate",
    ],
  },
  {
    _id: "5",
    icon: "Video",
    title: "Online Consultation",
    slug: "online",
    summary:
      "Confidential video consultation with Dr. Vishva from the privacy of your home.",
    details: [
      "Secure video platform",
      "Prescription provided",
      "Lab review included",
      "Follow-up support",
    ],
  },
  {
    _id: "6",
    icon: "Calendar",
    title: "Follow-up Care",
    slug: "followup",
    summary:
      "Structured post-procedure care to ensure complete healing and prevent recurrence.",
    details: [
      "Personalised diet plan",
      "Wound dressing guidance",
      "Emergency helpline",
      "Medication review",
    ],
  },
];

export default function Services() {
  const rootRef = useRef(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    api
      .get("/services")
      .then(({ data }) => setServices(data.length ? data : FALLBACK))
      .catch(() => setServices(FALLBACK))
      .finally(() => setLoading(false));
      
    api
      .get("/service-content")
      .then(({ data }) => setPageData(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title
      gsap.from(".svc-hero-text", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.2,
      });

      // Each service card alternates from left / right
      gsap.utils.toArray(".service-row").forEach((row, i) => {
        gsap.from(row, {
          x: i % 2 === 0 ? -60 : 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 78%", once: true },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [services]);

  const list = services.length ? services : FALLBACK;

  return (
    <div ref={rootRef} data-testid="services-page">
      <section className="container-page pt-20 pb-16 max-w-4xl">
        <span className="label-eyebrow svc-hero-text">
          {pageData?.hero_eyebrow || "Treatments & Services"}
        </span>
        <h1 className="svc-hero-text font-serif text-5xl lg:text-7xl text-brand-text font-medium tracking-tight mt-5 leading-[1.04]"
          dangerouslySetInnerHTML={{ __html: pageData?.hero_headline ? pageData.hero_headline.replace(/precision/g, '<em class="text-brand-primary italic">precision</em>') : "Modern proctology,<br/><em class=\"text-brand-primary italic\">delivered with precision.</em>" }}
        />
        <p className="svc-hero-text mt-7 text-lg text-brand-textSecondary leading-relaxed max-w-2xl">
          {pageData?.hero_subheadline || "Every treatment we offer prioritises minimal pain, faster recovery, and preservation of normal function. Most procedures are day-care — you arrive, get treated, go home."}
        </p>
      </section>

      {/* ── Service list ──────────────────────────────────────────── */}
      <section className="container-page pb-28 space-y-8">
        {loading ? (
          // Skeleton loaders while fetching
          <>
            {[1, 2, 3].map((n) => (
              <ServiceRowSkeleton key={n} />
            ))}
          </>
        ) : (
          list.map((s, idx) => {
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
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-5 left-5 w-12 h-12 rounded-xl bg-white/90 backdrop-blur text-brand-primary flex items-center justify-center shadow-md">
                        <Icon size={22} strokeWidth={1.5} />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
                      <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                        <Icon
                          size={44}
                          className="text-brand-primary"
                          strokeWidth={1}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Text column */}
              <div className="md:col-span-7">
                <span className="label-eyebrow">Service · 0{idx + 1}</span>
                <h2 className="font-serif text-3xl lg:text-4xl text-brand-text font-semibold mt-3">
                  {s.title}
                </h2>
                <p className="text-base text-brand-textSecondary mt-4 leading-relaxed">
                  {s.summary}
                </p>

                {s.details?.length > 0 && (
                  <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                    {s.details.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2 text-sm text-brand-text"
                      >
                        <Check
                          size={15}
                          className="text-brand-primary mt-0.5 shrink-0"
                        />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  to="/book"
                  className="btn-primary mt-8"
                  data-testid={`book-${s.slug}-btn`}
                >
                  Book for {s.title} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            );
          })
        )}
      </section>

      {/* ── Laser vs Traditional Comparison ───────────────────────── */}
      <section className="bg-brand-dark py-20">
        <div className="container-page max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="label-eyebrow !text-brand-accent/80">Why Laser?</span>
            <h2 className="font-serif text-3xl lg:text-5xl text-white font-semibold mt-4 tracking-tight">
              Laser vs Traditional Surgery
            </h2>
            <p className="mt-4 text-white/55 max-w-xl mx-auto">
              See why thousands of patients across Gujarat choose laser procedures over conventional surgery.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Traditional column */}
            <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="bg-rose-900/40 px-6 py-4 text-center">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-rose-300">Traditional Surgery</span>
              </div>
              <ul className="px-6 py-5 space-y-4">
                {[
                  "Long hospital stay (2–5 days)",
                  "Open cuts & stitches",
                  "Painful recovery (4–6 weeks)",
                  "High risk of bleeding",
                  "Risk of incontinence",
                  "Expensive ICU costs",
                  "Visible external scar",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/55">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 text-xs font-bold">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* VS divider */}
            <div className="flex flex-col items-center justify-center py-8 md:py-0 gap-3">
              <div className="w-14 h-14 rounded-full bg-brand-primary flex items-center justify-center shadow-[0_0_30px_rgba(26,91,94,0.5)]">
                <span className="font-serif text-lg font-bold text-white">VS</span>
              </div>
              <div className="hidden md:block w-px h-64 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            </div>

            {/* Laser column */}
            <div className="rounded-2xl bg-brand-primary/15 border border-brand-primary/30 overflow-hidden">
              <div className="bg-brand-primary px-6 py-4 text-center">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-white">Laser Treatment</span>
              </div>
              <ul className="px-6 py-5 space-y-4">
                {[
                  "Day-care — home same day",
                  "No cuts, no stitches",
                  "Back to work in 48 hours",
                  "Virtually bloodless",
                  "Zero incontinence risk",
                  "Significantly lower cost",
                  "No external scars",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                    <span className="w-5 h-5 rounded-full bg-brand-primary/40 text-white flex items-center justify-center shrink-0 text-xs font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link to="/book" className="btn-primary shadow-[0_8px_30px_rgba(26,91,94,0.4)]">
              Book Laser Consultation <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────── */}
      <section className="bg-brand-secondary py-16">
        <div className="container-page text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl lg:text-4xl text-brand-text font-semibold">
            Not sure which treatment you need?
          </h2>
          <p className="mt-4 text-brand-textSecondary">
            Book a consultation — Dr. Vishva will diagnose and explain
            everything in plain language, with no pressure.
          </p>
          <Link to="/book" className="btn-primary mt-7 shadow-md">
            Book a Consultation <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </div>
  );
}
