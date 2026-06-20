import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Quote, ArrowRight } from "lucide-react";
import api from "../lib/api";
import { TestimonialCardSkeleton } from "../components/Skeleton";

// Deterministic avatar colors from name
const AVATAR_COLORS = [
  "bg-teal-500", "bg-violet-500", "bg-amber-500",
  "bg-rose-500", "bg-sky-500", "bg-emerald-500", "bg-orange-500",
];
function avatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

gsap.registerPlugin(ScrollTrigger);

const FALLBACK = [
  {
    _id: "1",
    name: "Rahul M.",
    city: "Vadodara",
    rating: 5,
    service: "Laser Piles",
    text: "I had been suffering for 3 years. Dr. Vishva solved it in one day. The procedure was completely painless. Highly recommended to anyone facing this problem.",
  },
  {
    _id: "2",
    name: "Priya S.",
    city: "Surat",
    rating: 5,
    service: "Fissure",
    text: "Very professional and kind doctor. I was embarrassed to discuss my condition but Dr. Vishva made me feel completely at ease right from the first consultation.",
  },
  {
    _id: "3",
    name: "Amit K.",
    city: "Baroda",
    rating: 5,
    service: "VAAFT Fistula",
    text: "Went in the morning, was home by lunch. No cuts, no stitches, no pain. Zero complications. I wish I had done this years earlier instead of suffering in silence.",
  },
  {
    _id: "4",
    name: "Neha R.",
    city: "Anand",
    rating: 5,
    service: "Online Consult",
    text: "The online consultation was incredibly convenient. Clear diagnosis, proper prescription, detailed follow-up plan — all from the comfort of home. 5 stars.",
  },
  {
    _id: "5",
    name: "Suresh P.",
    city: "Vadodara",
    rating: 5,
    service: "Piles",
    text: "Post-surgery care was exceptional. The team called me twice a day for the first week. That level of personal attention is rare anywhere, let alone in Vadodara.",
  },
  {
    _id: "6",
    name: "Kavita D.",
    city: "Rajkot",
    rating: 5,
    service: "Fissure",
    text: "I was very scared before the surgery. Dr. Vishva explained everything so clearly and patiently. No pain at all, and back to normal work in just 2 days.",
  },
  {
    _id: "7",
    name: "Mohan T.",
    city: "Ahmedabad",
    rating: 5,
    service: "Pilonidal",
    text: "Trusted this clinic based on online reviews and they far exceeded my expectations. Modern operation theatre, experienced team, and genuinely painless results.",
  },
  {
    _id: "8",
    name: "Ritu A.",
    city: "Vadodara",
    rating: 5,
    service: "Consultation",
    text: "Dr Vishva explains in simple, clear language. No jargon, no pressure. Very reassuring for first-time patients who are nervous about proctology issues.",
  },
  {
    _id: "9",
    name: "Dinesh V.",
    city: "Surat",
    rating: 5,
    service: "Fistula",
    text: "Entire experience was world-class. From the seamless booking process to the follow-up calls — it genuinely feels like a premium metro-city clinic.",
  },
];

export default function Testimonials() {
  const rootRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    api
      .get("/testimonials")
      .then(({ data }) => setItems(data.length ? data : FALLBACK))
      .catch(() => setItems(FALLBACK))
      .finally(() => setLoading(false));

    api
      .get("/testimonial-content")
      .then(({ data }) => setPageData(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!items.length) return;
    const ctx = gsap.context(() => {
      gsap.from(".testi-hero-txt", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.15,
      });
      gsap.from(".testi-stat", {
        scale: 0.85,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.5)",
        stagger: 0.08,
        delay: 0.5,
      });
      gsap.from(".t-card-item", {
        y: 50,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ".testi-grid", start: "top 78%", once: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [items]);

  const list = items.length ? items : FALLBACK;

  // Compute star rating distribution
  const totalReviews = list.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: list.filter((t) => (t.rating || 5) === star).length,
    pct: totalReviews > 0
      ? Math.round((list.filter((t) => (t.rating || 5) === star).length / totalReviews) * 100)
      : 0,
  }));

  return (
    <div ref={rootRef} data-testid="testimonials-page">
      {/* Hero */}
      <section className="bg-brand-dark py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {[200, 380, 560].map((s) => (
            <div
              key={s}
              className="absolute rounded-full border border-white"
              style={{
                width: s,
                height: s,
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            />
          ))}
        </div>
        <div className="container-page relative z-10 text-center max-w-3xl mx-auto">
          <span className="testi-hero-txt label-eyebrow !text-brand-accent/80">
            {pageData?.hero_eyebrow || "Patient Stories"}
          </span>
          <h1 className="testi-hero-txt font-serif text-5xl lg:text-7xl text-white font-medium tracking-tight mt-4 leading-[1.04]"
            dangerouslySetInnerHTML={{ __html: pageData?.hero_headline ? pageData.hero_headline.replace(/real outcomes/gi, '<em class="text-brand-accent italic">real outcomes.</em>') : "Real voices,<br/><em class=\"text-brand-accent italic\">real outcomes.</em>" }}
          />
          <p className="testi-hero-txt mt-6 text-white/55 text-lg leading-relaxed">
            {pageData?.hero_subheadline || "Each review comes from a verified patient. We are honoured to have earned their trust during a sensitive time."}
          </p>
        </div>

        {/* Stats bar */}
        <div className="container-page mt-14 grid grid-cols-3 gap-6 max-w-2xl mx-auto relative z-10">
          {[
            { val: "4.9", label: "Average Rating" },
            { val: "2,800+", label: "Verified Reviews" },
            { val: "98%", label: "Would Recommend" },
          ].map(({ val, label }) => (
            <div key={label} className="testi-stat text-center">
              <div className="font-serif text-4xl lg:text-5xl text-white font-medium">
                {val}
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/35 mt-2">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rating Distribution */}
      {!loading && (
        <section className="bg-brand-subtle py-12">
          <div className="container-page max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Average big number */}
              <div className="text-center">
                <div className="font-serif text-8xl text-brand-primary font-semibold">4.9</div>
                <div className="flex justify-center gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={20} fill="#D4A85C" className="text-brand-accent" />
                  ))}
                </div>
                <p className="text-sm text-brand-textMuted mt-2">Based on {totalReviews.toLocaleString()}+ verified reviews</p>
              </div>
              {/* Distribution bars */}
              <div className="space-y-2.5">
                {ratingCounts.map(({ star, count, pct }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-brand-textSecondary w-4 shrink-0">{star}</span>
                    <Star size={12} fill="#D4A85C" className="text-brand-accent shrink-0" />
                    <div className="flex-1 h-2.5 rounded-full bg-brand-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-accent transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-brand-textMuted w-8 text-right shrink-0">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="container-page py-20">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <TestimonialCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="testi-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((t) => (
            <div
              key={t._id || t.name}
              className="t-card-item card-soft p-7 relative group"
              data-testid={`testimonial-card-${(t.name || "").replace(/\W/g, "")}`}
            >
              <Quote
                size={32}
                className="text-brand-accent absolute top-6 right-6 opacity-20 group-hover:opacity-35 transition-opacity"
              />
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="#D4A85C"
                    className="text-brand-accent"
                  />
                ))}
              </div>
              <p className="text-sm text-brand-text leading-relaxed italic mb-6">
                "{t.text}"
              </p>
              <div className="border-t border-brand-primary/5 pt-4 flex items-center gap-3">
                {/* Avatar initial */}
                <div className={`w-9 h-9 rounded-full ${avatarColor(t.name)} flex items-center justify-center text-white text-xs font-bold uppercase shrink-0`}>
                  {(t.name || "?")[0]}
                </div>
                <div className="flex-1 flex items-center justify-between text-xs text-brand-textMuted uppercase tracking-wider">
                  <span className="font-semibold text-brand-textSecondary">
                    {t.name}{t.city ? `, ${t.city}` : ""}
                  </span>
                  <span className="text-brand-primary/70">{t.service}</span>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-brand-secondary py-16">
        <div className="container-page text-center max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-brand-text font-semibold">
            Ready to write your own story?
          </h2>
          <p className="mt-3 text-brand-textSecondary text-sm leading-relaxed">
            Join thousands of patients who chose expert care and got their life
            back.
          </p>
          <Link to="/book" className="btn-primary mt-7 shadow-md">
            Book a Consultation <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
