import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, GraduationCap, Award, Heart, ShieldCheck, Stethoscope, Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CREDENTIALS = [
  { label: "MBBS",    body: "Baroda Medical College, MS University" },
  { label: "MS",      body: "General Surgery — Gold Medalist" },
  { label: "FMAS",    body: "Fellowship in Minimal Access Surgery" },
  { label: "FIAGES",  body: "Fellow, Indian Association of GI Endoscopic Surgeons" },
];

const CARDS = [
  { Icon: GraduationCap, t: "Qualifications",   d: "MBBS, MS (General Surgery), Fellowship in Minimal Access Surgery (FMAS), Advanced Laser Proctology Training." },
  { Icon: Award,         t: "Experience",        d: "12+ years dedicated to proctology. Performed 5,000+ laser procedures with industry-leading outcomes." },
  { Icon: Stethoscope,   t: "Specialisations",   d: "Laser hemorrhoidoplasty, FiLaC, VAAFT, sphincter-preserving fistula surgery, and chronic fissure care." },
  { Icon: Heart,         t: "Philosophy",        d: "Patient-first, unhurried, judgement-free. Your privacy and dignity are non-negotiable." },
];

export default function AboutDoctor() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Parallax hero image
      gsap.to(".about-hero-img", {
        yPercent: -15, ease: "none",
        scrollTrigger: { trigger: ".about-hero-wrap", start: "top top", end: "bottom top", scrub: 1 },
      });

      // Eyebrow + heading stagger
      gsap.from(".about-intro-line", {
        y: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: ".about-intro", start: "top 80%", once: true },
      });

      // Credential pills
      gsap.from(".cred-pill", {
        y: 24, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: ".cred-row", start: "top 85%", once: true },
      });

      // Cards
      gsap.from(".about-card", {
        y: 50, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: ".about-cards", start: "top 75%", once: true },
      });

      // Mission block
      gsap.from(".mission-block", {
        scale: 0.96, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".mission-block", start: "top 80%", once: true },
      });

    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} data-testid="about-page">

      {/* ── Hero banner ───────────────────────────────────────────── */}
      <div className="about-hero-wrap relative h-[55vh] min-h-[380px] overflow-hidden bg-brand-dark">
        <img
          src="https://customer-assets.emergentagent.com/job_vishva-proctology/artifacts/k64gpu3c_WhatsApp%20Image%202026-04-25%20at%209.09.47%20PM.jpeg"
          alt="Dr. Vishva Patel"
          className="about-hero-img absolute inset-0 w-full h-[130%] object-cover opacity-40"
          style={{ objectPosition: "center 15%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/60 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-page pb-14">
            <span className="label-eyebrow text-brand-accent/80 about-intro-line">About The Doctor</span>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-medium tracking-tight mt-3 leading-[1.02]">
              Dr. Vishva Patel
            </h1>
            <p className="text-white/60 mt-2 text-lg">Specialist Proctologist & Laser Surgeon · Vadodara</p>
          </div>
        </div>
      </div>

      {/* ── Intro section ─────────────────────────────────────────── */}
      <section className="about-intro container-page py-20 grid lg:grid-cols-12 gap-14 items-start">
        {/* Sticky image column */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="relative">
            <div className="absolute -inset-3 bg-brand-accent/10 rounded-3xl -rotate-1" />
            <img
              src="https://customer-assets.emergentagent.com/job_vishva-proctology/artifacts/k64gpu3c_WhatsApp%20Image%202026-04-25%20at%209.09.47%20PM.jpeg"
              alt="Dr. Vishva Patel"
              className="relative w-full h-[480px] object-cover rounded-3xl shadow-2xl"
              style={{ objectPosition: "center 20%" }}
            />
          </div>

          {/* Credential pills */}
          <div className="cred-row flex flex-wrap gap-2 mt-6">
            {CREDENTIALS.map(({ label, body }) => (
              <div key={label} className="cred-pill bg-brand-secondary rounded-full px-4 py-2 flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-primary">{label}</span>
                <span className="text-xs text-brand-textSecondary">{body}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Text column */}
        <div className="lg:col-span-8">
          <p className="about-intro-line text-xl text-brand-textSecondary leading-relaxed">
            Dr. Vishva is a fellowship-trained proctology specialist with over a decade of focused
            experience in modern laser-assisted treatments for piles, fissure, fistula, and complex
            ano-rectal conditions. Trusted by thousands of patients for clarity, kindness, and
            clinical excellence.
          </p>
          <p className="about-intro-line mt-5 text-base text-brand-textSecondary leading-relaxed">
            After completing his post-graduation from MS University Baroda, Dr. Vishva pursued a
            Fellowship in Minimal Access Surgery and went on to receive advanced training in
            1470nm diode laser proctology — one of fewer than 200 surgeons in Gujarat with this
            specialisation.
          </p>
          <p className="about-intro-line mt-5 text-base text-brand-textSecondary leading-relaxed">
            His clinic was built on a single conviction: metro-quality specialist care should be
            accessible in tier-2 cities — delivered with empathy, transparency, and zero stigma.
          </p>

          {/* Inline feature list */}
          <ul className="about-intro-line mt-8 grid sm:grid-cols-2 gap-3">
            {[
              "5,000+ laser procedures performed",
              "Day-care surgery — home same day",
              "Zero-complication streak on routine piles",
              "Offers both in-clinic and video consults",
              "Speaks Gujarati, Hindi & English",
              "Post-op emergency support hotline",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-brand-textSecondary">
                <Check size={15} className="text-brand-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Info cards ────────────────────────────────────────────── */}
      <section className="about-cards bg-brand-subtle py-20">
        <div className="container-page grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CARDS.map(({ Icon, t, d }) => (
            <div key={t} className="about-card card-soft p-7">
              <div className="w-11 h-11 rounded-xl bg-brand-secondary text-brand-primary flex items-center justify-center mb-5">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl font-semibold text-brand-text mb-2">{t}</h3>
              <p className="text-sm text-brand-textSecondary leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────── */}
      <section className="container-page py-20">
        <div className="mission-block bg-brand-dark rounded-3xl p-10 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-primary/8 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <ShieldCheck size={36} className="text-brand-primary mb-6" strokeWidth={1.5} />
            <h2 className="font-serif text-3xl lg:text-5xl text-white font-semibold leading-tight">
              Our Patient-First Mission
            </h2>
            <p className="mt-5 text-white/60 text-base leading-relaxed">
              Proctology problems are among the most stigmatised in healthcare — yet they affect
              millions silently. Our mission is simple: bring metro-grade specialist care to
              tier-2 cities, deliver it with empathy, and remove the awkwardness that keeps
              people from seeking help. Every consultation, every procedure, every follow-up is
              designed around <em className="text-brand-accent not-italic">you</em>.
            </p>
            <Link to="/book" className="btn-primary mt-8 shadow-[0_8px_30px_rgba(26,91,94,0.4)]">
              Book a Consultation <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
