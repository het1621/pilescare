import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  GraduationCap,
  Award,
  Heart,
  ShieldCheck,
  Stethoscope,
  Check,
} from "lucide-react";
import api from "../lib/api";

gsap.registerPlugin(ScrollTrigger);

// Map of card titles to icons (fallback matching)
const getIconForCard = (title) => {
  const t = title.toLowerCase();
  if (t.includes("qualif")) return GraduationCap;
  if (t.includes("experi")) return Award;
  if (t.includes("special")) return Stethoscope;
  if (t.includes("philosop")) return Heart;
  return Check;
};

export default function AboutDoctor() {
  const rootRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/about").then((res) => {
      setData(res.data);
    }).catch((err) => {
      console.error("Failed to load about data", err);
    });
  }, []);

  useEffect(() => {
    if (!data) return;

    // Small delay to ensure DOM is fully painted before GSAP measures heights
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Parallax hero image
        gsap.to(".about-hero-img", {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-hero-wrap",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        // Intro lines – play immediately on load (they are above the fold)
        gsap.from(".about-intro-line", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.2,
          scrollTrigger: {
            trigger: ".about-intro",
            start: "top 95%",
            once: true,
          },
        });

        // Credential pills
        gsap.from(".cred-pill", {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".cred-row", start: "top 95%", once: true },
        });

        // Cards
        gsap.from(".about-card", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".about-cards",
            start: "top 85%",
            once: true,
          },
        });

        // Mission block
        gsap.from(".mission-block", {
          scale: 0.96,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".mission-block",
            start: "top 85%",
            once: true,
          },
        });

        ScrollTrigger.refresh();
      }, rootRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, [data]);

  if (!data) return null; // Wait for data to load

  return (
    <div ref={rootRef} data-testid="about-page">
      {/* ── Hero banner ───────────────────────────────────────────── */}
      <div className="about-hero-wrap relative h-[55vh] min-h-[380px] overflow-hidden bg-brand-dark">
        <img
          src={data.image_url}
          alt={data.name}
          className="about-hero-img absolute inset-0 w-full h-[130%] object-cover opacity-40"
          style={{ objectPosition: "center 15%" }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/60 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-page pb-14">
            <span className="label-eyebrow text-brand-accent/80">
              About The Doctor
            </span>
            <h1 className="font-serif text-5xl lg:text-7xl text-white font-medium tracking-tight mt-3 leading-[1.02]">
              {data.name}
            </h1>
            <p className="text-white/60 mt-2 text-lg">
              {data.title} {data.location ? `· ${data.location}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* ── Intro section ─────────────────────────────────────────── */}
      <section className="about-intro container-page py-20 grid lg:grid-cols-12 gap-14 items-start">
        {/* Sticky image column */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="relative">
            <div className="absolute -inset-3 bg-brand-accent/10 rounded-3xl -rotate-1" />
            <div className="relative w-full h-[480px] rounded-3xl shadow-2xl overflow-hidden bg-brand-dark flex items-center justify-center">
              <img
                src={data.image_url}
                alt={data.name}
                className="w-full h-full object-cover"
                style={{ objectPosition: "center 20%" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Credential pills */}
          <div className="cred-row flex flex-wrap gap-2 mt-6">
            {(data.credentials || []).map(({ label, body }) => (
              <div
                key={label}
                className="cred-pill bg-brand-secondary rounded-full px-4 py-2 flex items-center gap-2"
              >
                <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-primary">
                  {label}
                </span>
                <span className="text-xs text-brand-textSecondary">{body}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Text column */}
        <div className="lg:col-span-8">
          {(data.bio || "").split("\n\n").map((para, idx) => (
            <p key={idx} className={`about-intro-line ${idx === 0 ? "text-xl text-brand-textSecondary leading-relaxed" : "mt-5 text-base text-brand-textSecondary leading-relaxed"}`}>
              {para}
            </p>
          ))}

          {/* Inline feature list */}
          <ul className="about-intro-line mt-8 grid sm:grid-cols-2 gap-3">
            {(data.features || []).map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-brand-textSecondary"
              >
                <Check
                  size={15}
                  className="text-brand-primary shrink-0 mt-0.5"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Info cards ────────────────────────────────────────────── */}
      <section className="about-cards bg-brand-subtle py-20">
        <div className="container-page grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(data.cards || []).map(({ title, description }) => {
            const Icon = getIconForCard(title);
            return (
              <div key={title} className="about-card card-soft p-7">
                <div className="w-11 h-11 rounded-xl bg-brand-secondary text-brand-primary flex items-center justify-center mb-5">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-brand-text mb-2">
                  {title}
                </h3>
                <p className="text-sm text-brand-textSecondary leading-relaxed">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────── */}
      <section className="container-page py-20">
        <div className="mission-block bg-brand-dark rounded-3xl p-10 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-primary/8 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <ShieldCheck
              size={36}
              className="text-brand-primary mb-6"
              strokeWidth={1.5}
            />
            <h2 className="font-serif text-3xl lg:text-5xl text-white font-semibold leading-tight">
              {data.mission_title}
            </h2>
            <p className="mt-5 text-white/60 text-base leading-relaxed">
              {data.mission_text}
            </p>
            <Link
              to="/book"
              className="btn-primary mt-8 shadow-[0_8px_30px_rgba(26,91,94,0.4)]"
            >
              Book a Consultation <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
