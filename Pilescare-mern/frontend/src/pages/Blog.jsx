import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Clock } from "lucide-react";
import api from "../lib/api";
import { BlogCardSkeleton, BlogFeaturedSkeleton } from "../components/Skeleton";

gsap.registerPlugin(ScrollTrigger);

const FALLBACK = [
  {
    _id: "1",
    slug: "what-are-piles",
    category: "Symptoms",
    read_time: "6 min read",
    title: "What Are Piles? Symptoms, Causes, and When to See a Doctor",
    excerpt:
      "Piles (haemorrhoids) affect 1 in 3 adults at some point. Learn to recognise the signs early and understand why timely treatment makes all the difference.",
    cover:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
  },
  {
    _id: "2",
    slug: "laser-vs-surgery",
    category: "Treatment",
    read_time: "8 min read",
    title:
      "Laser Piles Treatment vs Traditional Surgery: What You Need to Know",
    excerpt:
      "Modern laser procedures have changed the game for piles treatment. Here's an evidence-based comparison of laser versus conventional surgical approaches.",
    cover:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
  },
  {
    _id: "3",
    slug: "fissure-fistula-diff",
    category: "Education",
    read_time: "5 min read",
    title: "Fissure vs Fistula: Understanding the Difference",
    excerpt:
      "Anal fissure and fistula are often confused. This guide explains what each condition is, how they feel, and why treatment is completely different.",
    cover:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
  },
  {
    _id: "4",
    slug: "diet-after-piles",
    category: "Recovery",
    read_time: "4 min read",
    title: "Best Diet After Piles Surgery: A Complete Recovery Guide",
    excerpt:
      "What you eat in the two weeks after laser piles surgery determines how fast and smoothly you recover. Here's a practical, easy-to-follow meal plan.",
    cover:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
  },
  {
    _id: "5",
    slug: "pilonidal-sinus",
    category: "Education",
    read_time: "5 min read",
    title: "Pilonidal Sinus: Causes, Symptoms, and Modern Treatment Options",
    excerpt:
      "Pilonidal sinus is common in young adults and frequently misunderstood. Learn about EPSIT — the minimally invasive treatment that avoids open wounds.",
    cover:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  },
  {
    _id: "6",
    slug: "online-consult-tips",
    category: "Tips",
    read_time: "3 min read",
    title: "How to Prepare for Your Online Proctology Consultation",
    excerpt:
      "Getting the most out of a video consultation requires a little preparation. Here's exactly what to have ready so Dr. Vishva can help you effectively.",
    cover:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
  },
];

const CATEGORY_COLORS = {
  Symptoms: "text-rose-600 bg-rose-50",
  Treatment: "text-sky-600 bg-sky-50",
  Education: "text-violet-600 bg-violet-50",
  Recovery: "text-emerald-600 bg-emerald-50",
  Tips: "text-amber-600 bg-amber-50",
  News: "text-brand-primary bg-brand-secondary",
};

export default function Blog() {
  const rootRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    api
      .get("/blog")
      .then(({ data }) => setPosts(data.length ? data : FALLBACK))
      .catch(() => setPosts(FALLBACK))
      .finally(() => setLoading(false));

    api
      .get("/blog-content")
      .then(({ data }) => setPageData(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!posts.length) return;
    const ctx = gsap.context(() => {
      gsap.from(".blog-hero-txt", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.1,
      });
      gsap.from(".blog-featured", {
        scale: 0.97,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.4,
      });
      gsap.from(".blog-card-item", {
        y: 45,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".blog-grid", start: "top 78%", once: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [posts]);

  const list = posts.length ? posts : FALLBACK;
  const categories = [
    "All",
    ...Array.from(new Set(list.map((p) => p.category))),
  ];
  const filtered =
    active === "All" ? list : list.filter((p) => p.category === active);
  const [featured, ...rest] = filtered;

  return (
    <div ref={rootRef} data-testid="blog-page">
      {/* Hero */}
      <section className="container-page pt-20 pb-14 max-w-3xl">
        <span className="blog-hero-txt label-eyebrow">
          {pageData?.hero_eyebrow || "The Journal"}
        </span>
        <h1 className="blog-hero-txt font-serif text-5xl lg:text-7xl text-brand-text font-medium tracking-tight mt-4 leading-[1.04]"
          dangerouslySetInnerHTML={{ __html: pageData?.hero_headline ? pageData.hero_headline.replace(/patient education/gi, '<em class="text-brand-primary italic">patient education.</em>') : "Articles, insights &<br/><em class=\"text-brand-primary italic\">patient education.</em>" }}
        />
        <p className="blog-hero-txt mt-6 text-lg text-brand-textSecondary leading-relaxed">
          {pageData?.hero_subheadline || "Evidence-based reading on proctology — written to help you understand your symptoms, treatment options, and recovery."}
        </p>
      </section>

      {/* Category filters */}
      <div className="container-page pb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const count = c === "All" ? list.length : list.filter((p) => p.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5
                  ${active === c ? "bg-brand-primary text-white shadow-md" : "bg-white border border-brand-primary/15 text-brand-textSecondary hover:border-brand-primary"}`}
              >
                {c}
                <span className={`text-[10px] rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-bold
                  ${active === c ? "bg-white/20 text-white" : "bg-brand-primary/8 text-brand-primary/60"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured post */}
      {loading ? (
        <section className="container-page pb-10">
          <BlogFeaturedSkeleton />
        </section>
      ) : featured && (
        <section className="container-page pb-10">
          <Link
            to={`/blog/${featured.slug}`}
            className="blog-featured group grid lg:grid-cols-12 gap-8 items-center card-soft p-6 lg:p-8"
            data-testid="featured-post"
          >
            <div className="lg:col-span-7 overflow-hidden rounded-2xl">
              <img
                src={featured.cover}
                alt={featured.title}
                className="w-full h-64 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg,#1A5B5E,#0E1B19)";
                  e.target.src = "";
                }}
              />
            </div>
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`text-[10px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[featured.category] || "text-brand-primary bg-brand-secondary"}`}
                >
                  {featured.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-brand-textMuted">
                  <Clock size={11} /> {featured.read_time}
                </span>
              </div>
              <h2 className="font-serif text-2xl lg:text-3xl text-brand-text font-semibold leading-tight group-hover:text-brand-primary transition-colors">
                {featured.title}
              </h2>
              <p className="text-sm text-brand-textSecondary mt-4 leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="inline-flex items-center text-sm text-brand-primary font-medium mt-5 gap-1.5">
                Read article{" "}
                <ArrowRight
                  size={13}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Grid */}
      {loading ? (
        <section className="container-page pb-24 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5].map((n) => (
            <BlogCardSkeleton key={n} />
          ))}
        </section>
      ) : rest.length > 0 && (
        <section className="container-page pb-24 blog-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((p) => (
            <Link
              key={p._id || p.slug}
              to={`/blog/${p.slug}`}
              className="blog-card-item group block"
              data-testid={`blog-card-${p.slug}`}
            >
              <div className="overflow-hidden rounded-2xl mb-5 aspect-[4/3] bg-brand-subtle">
                <img
                  src={p.cover}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.style.background =
                      "linear-gradient(135deg,#E8F4F4,#1A5B5E22)";
                    e.target.src = "";
                  }}
                />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`text-[10px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[p.category] || "text-brand-primary bg-brand-secondary"}`}
                >
                  {p.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-brand-textMuted">
                  <Clock size={11} /> {p.read_time}
                </span>
              </div>
              <h3 className="font-serif text-xl text-brand-text font-semibold group-hover:text-brand-primary transition-colors leading-snug">
                {p.title}
              </h3>
              <p className="text-sm text-brand-textSecondary mt-3 leading-relaxed line-clamp-2">
                {p.excerpt}
              </p>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
