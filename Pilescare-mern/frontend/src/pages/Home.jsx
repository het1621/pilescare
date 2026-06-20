import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import {
  ArrowRight,
  Star,
  Calendar,
  Video,
  Stethoscope,
  HeartPulse,
  ShieldPlus,
  Sparkles,
  ChevronDown,
  Check,
  Phone,
} from "lucide-react";
import api from "../lib/api";
import { ServiceCardSkeleton } from "../components/Skeleton";

gsap.registerPlugin(ScrollTrigger);

// ─── Data (fallbacks while loading) ──────────────────────────────────────────
const SERVICES_FALLBACK = [
  {
    icon: HeartPulse,
    title: "Laser Piles (Hemorrhoids)",
    summary:
      "Painless, bloodless day-care procedure using 1470nm diode laser. Back to normal life within 48 hours.",
    slug: "laser-piles",
  },
  {
    icon: Stethoscope,
    title: "Anal Fissure Treatment",
    summary:
      "Chronic fissures treated with BOTOX or LIS. Zero risk of incontinence, rapid healing.",
    slug: "fissure",
  },
  {
    icon: ShieldPlus,
    title: "Fistula Surgery (VAAFT)",
    summary:
      "Video-assisted sphincter-saving fistula treatment. High cure rate, no sphincter damage.",
    slug: "fistula",
  },
  {
    icon: Sparkles,
    title: "Pilonidal Sinus",
    summary:
      "Minimally invasive EPSIT technique for pilonidal disease. Outpatient procedure, fast recovery.",
    slug: "pilonidal",
  },
  {
    icon: Video,
    title: "Online Consultation",
    summary:
      "Confidential video consultation with Dr. Vishva from the privacy of your home.",
    slug: "online",
  },
  {
    icon: Calendar,
    title: "Follow-up Care",
    summary:
      "Structured post-procedure care plans to ensure complete healing and prevent recurrence.",
    slug: "followup",
  },
];

const PROCESS_STEPS = [
  {
    n: "01",
    t: "Book Online",
    d: "Choose a date and slot that works for you. Instant confirmation.",
  },
  {
    n: "02",
    t: "Consultation",
    d: "Private 1-on-1 with Dr. Vishva. Diagnosis, Q&A, treatment plan.",
  },
  {
    n: "03",
    t: "Day-Care Procedure",
    d: "Laser procedure in our modern OT. Arrive at 9 AM, home by noon.",
  },
  {
    n: "04",
    t: "Recovery & Care",
    d: "Dedicated follow-up calls, diet plan, and emergency support line.",
  },
];

const STATS = [
  { value: 5000, suffix: "+", label: "Procedures Done" },
  { value: 12, suffix: "+", label: "Years Focused Experience" },
  { value: 98, suffix: "%", label: "Patient Satisfaction" },
  { value: 10, suffix: "k+", label: "Patients Treated" },
];

export default function Home() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const heroTextRef = useRef(null);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [homeData, setHomeData] = useState(null);

  // ── Hardcoded fallback testimonials ────────────────────────────────────────
  const TESTI_FALLBACK = [
    {
      name: "Rahul M.",
      city: "Vadodara",
      text: "I had been suffering for 3 years. Dr. Vishva solved it in one day. The procedure was completely painless. Highly recommended.",
      rating: 5,
      service: "Laser Piles",
    },
    {
      name: "Priya S.",
      city: "Surat",
      text: "Very professional and kind doctor. I was embarrassed to discuss my problem but Dr. Vishva made me feel completely at ease.",
      rating: 5,
      service: "Fissure",
    },
    {
      name: "Amit K.",
      city: "Baroda",
      text: "Went in the morning, was home by lunch. No cuts, no stitches, no pain. I wish I had done this years earlier.",
      rating: 5,
      service: "VAAFT Fistula",
    },
    {
      name: "Neha R.",
      city: "Anand",
      text: "The online consultation was incredibly convenient. Clear diagnosis, proper prescription, all from home.",
      rating: 5,
      service: "Online",
    },
    {
      name: "Suresh P.",
      city: "Vadodara",
      text: "Post-surgery care was exceptional. The team called me twice a day for the first week. That level of care is rare anywhere.",
      rating: 5,
      service: "Piles",
    },
    {
      name: "Kavita D.",
      city: "Rajkot",
      text: "I was very scared before the surgery. Dr. Vishva explained everything so clearly. No pain at all, back to work in 2 days.",
      rating: 5,
      service: "Fissure",
    },
    {
      name: "Mohan T.",
      city: "Ahmedabad",
      text: "Trusted this clinic based on reviews and they exceeded expectations. Modern OT, experienced team, painless results.",
      rating: 5,
      service: "Pilonidal",
    },
    {
      name: "Ritu A.",
      city: "Vadodara",
      text: "Dr Vishva is extremely knowledgeable and explains things in simple language. Very reassuring for first-time patients.",
      rating: 5,
      service: "Consultation",
    },
  ];

  // ── Fetch services ────────────────────────────────────────────────────────
  useEffect(() => {
    api
      .get("/services")
      .then(({ data }) => setServices(data.length ? data : SERVICES_FALLBACK))
      .catch(() => setServices(SERVICES_FALLBACK))
      .finally(() => setLoadingServices(false));
    api
      .get("/testimonials")
      .then(({ data }) => setTestimonials(data.length ? data : TESTI_FALLBACK))
      .catch(() => setTestimonials(TESTI_FALLBACK));
    api
      .get("/home-content")
      .then(({ data }) => setHomeData(data))
      .catch((err) => console.error(err));
  }, []);

  // ── Canvas particle background ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Respect reduced-motion preference for accessibility
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: homeData?.hero_particle_count || 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        
        // Use custom color but apply opacity, fallback to existing logic if custom is missing.
        // Quick parsing hex to rgba isn't strictly needed if we just use fillStyle with globalAlpha, 
        // but let's just use the hex if provided, or default.
        ctx.fillStyle = homeData?.hero_particle_color ? homeData.hero_particle_color : "rgba(210,168,92,0.35)";
        ctx.globalAlpha = 0.35;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });
      // Connect nearby particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x,
            dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = homeData?.hero_particle_color ? homeData.hero_particle_color : "rgba(210,168,92,1)";
            ctx.globalAlpha = 0.12 * (1 - dist / 110);
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── GSAP animations ───────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title split is now handled in a separate useEffect

      // ─ Hero sub-elements entrance ──────────────────────────────────────────
      gsap.from(".hero-sub", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.9,
      });

      // ─ Trust bar ───────────────────────────────────────────────────────────
      gsap.from(".trust-bar", { opacity: 0, duration: 0.6, delay: 1.4 });

      // ─ Service cards — simple batch reveal (NO pin, NO scrub) ─────────────
      ScrollTrigger.batch(".svc-card", {
        onEnter: (els) =>
          gsap.from(els, {
            y: 40,
            opacity: 0,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.08,
            overwrite: true,
          }),
        start: "top 88%",
        once: true,
      });

      // ─ About section — fade/slide only, NO scrub parallax on image ─────────
      gsap.from(".about-text-item", {
        x: 36,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 72%",
          once: true,
        },
      });
      gsap.from(".about-img-col", {
        x: -36,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 72%",
          once: true,
        },
      });

      // ─ Stats count-up ──────────────────────────────────────────────────────
      gsap.utils.toArray(".stat-value").forEach((el) => {
        const target = +el.dataset.target;
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 2,
              ease: "power2.out",
              onUpdate() {
                el.textContent = Math.round(obj.val).toLocaleString();
              },
            });
          },
        });
      });

      // ─ Process steps ───────────────────────────────────────────────────────
      ScrollTrigger.batch(".process-step", {
        onEnter: (els) =>
          gsap.from(els, {
            y: 40,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
            overwrite: true,
          }),
        start: "top 85%",
        once: true,
      });

      // ─ Blog cards ──────────────────────────────────────────────────────────
      ScrollTrigger.batch(".blog-card", {
        onEnter: (els) =>
          gsap.from(els, {
            y: 36,
            opacity: 0,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.09,
            overwrite: true,
          }),
        start: "top 88%",
        once: true,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // ── Hero Title Split Animation ────────────────────────────────────────────
  // Must be in a separate effect so it can revert before React re-renders the text
  useEffect(() => {
    let split;
    const ctx = gsap.context(() => {
      if (heroTextRef.current) {
        split = new SplitType(heroTextRef.current, {
          types: "chars,words",
        });
        gsap.set(split.chars, { willChange: "transform, opacity" });
        gsap.from(split.chars, {
          y: 70,
          opacity: 0,
          rotationX: -35,
          duration: 0.9,
          ease: "power4.out",
          stagger: { each: 0.022, from: "start" },
          delay: 0.3,
          clearProps: "willChange",
        });
      }
    });

    return () => {
      if (split) split.revert();
      ctx.revert();
    };
  }, [homeData?.hero_headline]);

  const displayServices = services.length ? services : SERVICES_FALLBACK;

  return (
    <div ref={rootRef}>
      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <section className="hero-section relative min-h-screen flex items-center overflow-hidden bg-brand-dark">
        {/* Particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-60"
        />

        {/* Gradient overlays */}
        <div 
          className="absolute inset-0" 
          style={{ background: `linear-gradient(135deg, ${homeData?.hero_bg_gradient_from || '#0e1b19'} 0%, #0c201e 50%, ${homeData?.hero_bg_gradient_to || '#122a27'} 100%)` }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark to-transparent" />

        {/* Static decorative elements — no JS scrub */}
        <div className="absolute top-24 right-[12%] w-72 h-72 rounded-full bg-brand-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-[5%] w-40 h-40 rounded-full border border-brand-accent/15 pointer-events-none" />
        <div className="absolute bottom-24 left-[8%] w-56 h-56 rounded-full bg-brand-accent/5 blur-2xl pointer-events-none" />

        {/* Vertical line accent */}
        <div className="absolute left-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent hidden lg:block" />

        <div className="container-page relative z-10 pt-28 pb-20">
          <div className="max-w-4xl">
            <div className="hero-sub inline-flex items-center gap-3 bg-brand-primary/15 border border-brand-primary/25 rounded-full px-5 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
              <span className="text-xs uppercase tracking-[0.22em] font-semibold text-brand-accent">
                Laser Proctology · Vadodara, Gujarat
              </span>
            </div>

            <h1
              ref={heroTextRef}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white font-medium leading-[1.02] tracking-tight"
              style={{ perspective: "800px" }}
              dangerouslySetInnerHTML={{
                __html: homeData?.hero_headline || "Advanced <em class='not-italic text-brand-accent'>Proctology.</em><br/>Extraordinary Care."
              }}
            />

            <p className="hero-sub mt-7 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl">
              {homeData?.hero_subheadline || "Fellowship-trained laser surgeon Dr. Vishva Patel delivers day-care precision treatment for piles, fissure, fistula — with zero compromise on dignity."}
            </p>

            <div className="hero-sub flex flex-wrap items-center gap-4 mt-10">
              <Link
                to={homeData?.hero_cta_link || "/book"}
                className="btn-primary text-base !px-8 !py-4 shadow-[0_8px_30px_rgba(26,91,94,0.45)] hover:shadow-[0_12px_40px_rgba(26,91,94,0.55)] hover:-translate-y-0.5"
              >
                {homeData?.hero_cta_text || "Book Consultation"} <ArrowRight size={16} />
              </Link>
              <Link
                to="/services"
                className="btn-ghost-white text-base !px-8 !py-4"
              >
                View Services
              </Link>
            </div>

            {/* Trust badges */}
            <div className="hero-sub flex flex-wrap items-center gap-6 mt-12">
              {[
                "5,000+ Laser Procedures",
                "12 Years Experience",
                "98% Success Rate",
              ].map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <Check size={14} className="text-brand-accent" />
                  <span className="text-sm text-white/55">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] uppercase tracking-[0.25em]">
            Scroll
          </span>
          <ChevronDown size={18} className="animate-bounce" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TRUST MARQUEE
      ════════════════════════════════════════════════════════ */}
      <div className="trust-bar bg-brand-primary py-4 overflow-hidden">
        <div className="marquee-track marquee-fwd select-none">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-0 shrink-0">
              {[
                "5,000+ Procedures",
                "12 Years Focused",
                "Laser Surgery Expert",
                "98% Success Rate",
                "Day-Care Procedures",
                "Zero Complication Policy",
                "Confidential Care",
              ].map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-4 px-8 text-sm font-medium text-white/80 uppercase tracking-[0.18em] whitespace-nowrap"
                >
                  <span className="text-brand-accent">✦</span> {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          SERVICES — CSS SNAP SCROLL (no GSAP pin)
      ════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="container-page">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="label-eyebrow">What We Treat</span>
              <h2 className="font-serif text-4xl lg:text-6xl text-brand-text font-medium mt-3 tracking-tight">
                Services built around{" "}
                <em className="text-brand-primary italic">your life.</em>
              </h2>
            </div>
            <Link
              to="/services"
              className="hidden lg:flex btn-outline shrink-0"
            >
              All Services <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Scrollable track — CSS only, no GSAP pin */}
        <div
          className="pl-6 md:pl-14 lg:pl-20 overflow-x-auto pb-6 hide-scrollbar"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="flex gap-5 w-max pr-6 md:pr-14 lg:pr-20">
            {loadingServices
              ? [1, 2, 3, 4].map((n) => <ServiceCardSkeleton key={n} />)
              : displayServices.map((s, i) => {
              const Icon =
                typeof s.icon === "string"
                  ? {
                      Stethoscope,
                      HeartPulse,
                      ShieldPlus,
                      Sparkles,
                      Calendar,
                      Video,
                    }[s.icon] || Sparkles
                  : s.icon;
              return (
                <div
                  key={s.slug || i}
                  className="svc-card w-72 lg:w-80 shrink-0 bg-white rounded-3xl border border-brand-primary/8 p-8
                    shadow-[0_8px_30px_rgba(26,91,94,0.06)]
                    hover:shadow-[0_20px_60px_rgba(26,91,94,0.13)]
                    hover:-translate-y-2 transition-[transform,box-shadow,border-color,background-color] duration-500 cursor-pointer group"
                  style={{ scrollSnapAlign: "start", willChange: "transform" }}
                >
                  <div
                    className="svc-icon-wrap w-14 h-14 rounded-2xl bg-brand-secondary flex items-center justify-center mb-6
                    group-hover:bg-brand-primary transition-colors duration-300"
                  >
                    <Icon
                      size={24}
                      className="text-brand-primary group-hover:text-white transition-colors duration-300"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-brand-textMuted mb-3">
                    Service 0{i + 1}
                  </div>
                  <h3
                    className="font-serif text-xl text-brand-text font-semibold mb-3
                    group-hover:text-brand-primary transition-colors leading-snug"
                  >
                    {s.title}
                  </h3>
                  <p className="text-sm text-brand-textSecondary leading-relaxed">
                    {s.summary}
                  </p>
                  <Link
                    to={`/services#${s.slug}`}
                    className="mt-6 flex items-center gap-2 text-sm font-medium text-brand-primary
                      opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0
                      transition-all duration-300"
                  >
                    Learn more <ArrowRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          ABOUT DOCTOR
      ════════════════════════════════════════════════════════ */}
      <section className="about-section container-page py-24 grid lg:grid-cols-12 gap-16 items-center">
        {/* Image column */}
        <div
          className="about-img-col lg:col-span-5 relative overflow-hidden rounded-3xl"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="absolute -inset-4 bg-brand-accent/10 rounded-3xl -rotate-2" />
          <div className="relative overflow-hidden rounded-3xl h-[520px]">
            <img
              src="https://customer-assets.emergentagent.com/job_vishva-proctology/artifacts/k64gpu3c_WhatsApp%20Image%202026-04-25%20at%209.09.47%20PM.jpeg"
              alt="Dr. Vishva Patel"
              className="about-img w-full h-full object-cover"
              style={{ objectPosition: "center 20%" }}
              loading="lazy"
            />
            {/* Stat overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-5 flex items-center justify-between shadow-lg">
              {[
                { n: "5k+", l: "Procedures" },
                { n: "12+", l: "Years" },
                { n: "98%", l: "Success" },
              ].map(({ n, l }) => (
                <div key={l} className="text-center">
                  <div className="font-serif text-2xl text-brand-primary font-semibold">
                    {n}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-brand-textMuted">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <span className="label-eyebrow about-text-item">
            About The Doctor
          </span>
          <h2 className="about-text-item font-serif text-4xl lg:text-6xl text-brand-text font-medium mt-4 tracking-tight leading-[1.05]">
            Dr. Vishva Patel
            <br />
            <em className="text-brand-primary not-italic font-normal text-2xl lg:text-3xl">
              Specialist Proctologist & Laser Surgeon
            </em>
          </h2>
          <p className="about-text-item mt-6 text-base text-brand-textSecondary leading-relaxed">
            Fellowship-trained with a decade of exclusive proctology practice.
            Dr. Vishva has performed over 5,000 laser procedures, pioneering
            minimal-pain, same-day care that gets patients back to their lives
            faster.
          </p>

          <div className="about-text-item mt-8 grid sm:grid-cols-2 gap-4">
            {[
              {
                t: "MBBS + MS (Surgery)",
                s: "Fellowship in Minimal Access Surgery (FMAS)",
              },
              {
                t: "1470nm Diode Laser",
                s: "Advanced Laser Proctology certification",
              },
              {
                t: "VAAFT & FiLaC",
                s: "Sphincter-preserving fistula techniques",
              },
              {
                t: "Patient-First",
                s: "Zero-judgement, fully confidential consultations",
              },
            ].map(({ t, s }) => (
              <div
                key={t}
                className="flex items-start gap-3 p-4 bg-brand-subtle rounded-xl border border-brand-primary/5"
              >
                <Check
                  size={16}
                  className="text-brand-primary mt-0.5 shrink-0"
                />
                <div>
                  <div className="text-sm font-semibold text-brand-text">
                    {t}
                  </div>
                  <div className="text-xs text-brand-textMuted mt-0.5">{s}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="about-text-item flex gap-4 mt-8">
            <Link to="/about" className="btn-primary">
              Full Profile <ArrowRight size={14} />
            </Link>
            <Link to="/book" className="btn-secondary">
              Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STATS
      ════════════════════════════════════════════════════════ */}
      <section className="bg-brand-dark py-20">
        <div className="container-page">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {(homeData?.stats?.length ? homeData.stats : STATS).map(({ value, suffix, label }) => (
              <div key={label} className="text-center">
                <div className="font-serif text-5xl lg:text-6xl text-white font-medium">
                  <span className="stat-value" data-target={value}>
                    0
                  </span>
                  <span className="text-brand-accent">{suffix}</span>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/40 mt-3">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PROCESS
      ════════════════════════════════════════════════════════ */}
      <section className="process-section container-page py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="label-eyebrow">Your Journey</span>
          <h2 className="font-serif text-4xl lg:text-5xl text-brand-text font-medium mt-4 tracking-tight">
            From booking to{" "}
            <em className="text-brand-primary italic">complete recovery.</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent hidden lg:block" />

          {(homeData?.process_steps?.length ? homeData.process_steps : PROCESS_STEPS.map(s => ({ number: s.n, title: s.t, description: s.d }))).map(({ number, title, description }, i) => (
            <div key={number || i} className="process-step text-center relative">
              <div className="w-16 h-16 rounded-full bg-brand-secondary border-2 border-brand-primary/15 flex items-center justify-center mx-auto mb-5 relative z-10">
                <span className="font-serif text-xl text-brand-primary font-semibold">
                  {number}
                </span>
              </div>
              <h3 className="font-serif text-xl text-brand-text font-semibold mb-2">
                {title}
              </h3>
              <p className="text-sm text-brand-textSecondary leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TESTIMONIALS MARQUEE
      ════════════════════════════════════════════════════════ */}
      <section className="bg-brand-dark py-20 overflow-hidden">
        <div className="container-page mb-12 text-center">
          <span className="label-eyebrow text-brand-accent/70">
            Patient Stories
          </span>
          <h2 className="font-serif text-4xl lg:text-5xl text-white font-medium mt-4 tracking-tight">
            Real voices,{" "}
            <em className="text-brand-accent italic">real outcomes.</em>
          </h2>
        </div>

        {/* Row 1 — forward */}
        <div className="marquee-track marquee-fwd mb-4 select-none">
          {[...Array(2)].map((_, ri) => (
            <div key={ri} className="flex gap-4 shrink-0">
              {(testimonials.length ? testimonials : TESTI_FALLBACK)
                .slice(
                  0,
                  Math.ceil((testimonials.length || TESTI_FALLBACK.length) / 2),
                )
                .map((t) => (
                  <TestiCard
                    key={t.name || t._id}
                    name={t.name}
                    city={t.city}
                    text={t.text}
                    rating={t.rating}
                    svc={t.service}
                  />
                ))}
            </div>
          ))}
        </div>

        {/* Row 2 — reverse */}
        <div className="marquee-track marquee-rev select-none">
          {[...Array(2)].map((_, ri) => (
            <div key={ri} className="flex gap-4 shrink-0">
              {(testimonials.length ? testimonials : TESTI_FALLBACK)
                .slice(
                  Math.ceil((testimonials.length || TESTI_FALLBACK.length) / 2),
                )
                .map((t) => (
                  <TestiCard
                    key={t.name || t._id}
                    name={t.name}
                    city={t.city}
                    text={t.text}
                    rating={t.rating}
                    svc={t.service}
                  />
                ))}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/testimonials" className="btn-ghost-white">
            Read All Stories <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          BLOG PREVIEW
      ════════════════════════════════════════════════════════ */}
      <BlogPreview />

      {/* ════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-primary py-24">
        <div className="absolute inset-0 opacity-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width: `${(i + 1) * 120}px`,
                height: `${(i + 1) * 120}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            />
          ))}
        </div>
        <div className="container-page relative z-10 text-center max-w-3xl mx-auto">
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-white/60 mb-6">
            Take the first step
          </span>
          <h2 className="font-serif text-4xl lg:text-6xl text-white font-medium tracking-tight leading-[1.05]">
            You deserve to live
            <br />
            <em className="italic text-brand-accent">without the pain.</em>
          </h2>
          <p className="mt-6 text-white/65 text-lg leading-relaxed">
            A 15-minute consultation with Dr. Vishva is often enough for
            complete clarity — diagnosis, treatment plan, and all your questions
            answered.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link
              to="/book"
              className="bg-white text-brand-primary hover:bg-brand-accent hover:text-white rounded-full px-8 py-4 text-sm font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2"
            >
              Book a Private Consultation <ArrowRight size={14} />
            </Link>
            <a
              href="tel:+919999999999"
              className="btn-ghost-white !py-4 !px-8 text-sm font-semibold"
            >
              <Phone size={14} /> Call Clinic Directly
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function TestiCard({ name, city, text, rating, svc }) {
  return (
    <div className="w-80 shrink-0 bg-white/5 border border-white/8 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/8 transition-colors">
      <div className="flex gap-0.5 mb-3">
        {[...Array(rating)].map((_, i) => (
          <Star
            key={i}
            size={12}
            fill="#D4A85C"
            className="text-brand-accent"
          />
        ))}
      </div>
      <p className="text-sm text-white/70 leading-relaxed italic">"{text}"</p>
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] uppercase tracking-wider">
        <span className="font-semibold text-white/60">
          {name}, {city}
        </span>
        <span className="text-brand-accent/70">{svc}</span>
      </div>
    </div>
  );
}

function BlogPreview() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    api
      .get("/blog")
      .then(({ data }) => setPosts(data.slice(0, 3)))
      .catch(() => {});
  }, []);
  if (!posts.length) return null;

  return (
    <section className="blog-section container-page py-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <span className="label-eyebrow">The Journal</span>
          <h2 className="font-serif text-4xl lg:text-5xl text-brand-text font-medium mt-3 tracking-tight">
            Insights & education.
          </h2>
        </div>
        <Link to="/blog" className="hidden md:flex btn-outline">
          All Articles <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((p) => (
          <Link
            key={p.slug}
            to={`/blog/${p.slug}`}
            className="blog-card group block"
          >
            <div className="overflow-hidden rounded-2xl aspect-[4/3] bg-brand-subtle mb-5">
              <img
                src={p.cover}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <span className="label-eyebrow text-[10px]">
              {p.category} · {p.read_time}
            </span>
            <h3 className="font-serif text-xl text-brand-text font-semibold mt-2 group-hover:text-brand-primary transition-colors leading-snug">
              {p.title}
            </h3>
            <p className="text-sm text-brand-textSecondary mt-2 leading-relaxed line-clamp-2">
              {p.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
