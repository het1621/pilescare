import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, Minus, ArrowRight, Search, X } from "lucide-react";
import api from "../lib/api";
import { FAQSkeleton } from "../components/Skeleton";

gsap.registerPlugin(ScrollTrigger);

const FALLBACK = [
  {
    _id: "1",
    category: "Concerns",
    question: "Is piles surgery painful?",
    answer:
      "With modern laser surgery, there is virtually no pain during or after the procedure. Most patients report only mild discomfort for 1–2 days, well-managed with simple painkillers. The old 'open' haemorrhoidectomy was painful — laser is not.",
  },
  {
    _id: "2",
    category: "Concerns",
    question: "How do I know if I need surgery or not?",
    answer:
      "A consultation with Dr. Vishva will determine this. Grade 1 and 2 piles often respond to medication and dietary changes. Grade 3 and 4 generally benefit from laser. Many patients avoid surgery entirely with early treatment.",
  },
  {
    _id: "3",
    category: "Treatments",
    question: "What is laser piles surgery?",
    answer:
      "Laser piles (hemorrhoidoplasty) uses a 1470nm diode laser fibre inserted into the pile mass. The laser energy shrinks the tissue from inside without cutting or stitching. It is performed under local anaesthesia, takes 20–30 minutes, and you go home the same day.",
  },
  {
    _id: "4",
    category: "Treatments",
    question: "What is VAAFT for fistula?",
    answer:
      "VAAFT (Video-Assisted Anal Fistula Treatment) uses a miniature video scope to visualise the fistula track, destroy the lining under direct vision, and close the internal opening — all without cutting the sphincter muscle. This preserves full continence.",
  },
  {
    _id: "5",
    category: "Appointment",
    question: "How do I book an appointment?",
    answer:
      "Click 'Book Appointment' on this website, choose your preferred date and time slot, and fill in your details. Our care coordinator will call you within a few hours to confirm. You can also call the clinic directly.",
  },
  {
    _id: "6",
    category: "Appointment",
    question: "Is online consultation available?",
    answer:
      "Yes. Dr. Vishva offers video consultations via a secure platform. This is ideal for initial assessment, follow-up visits, or if you are not in Vadodara. You will receive a prescription and detailed plan by email after the call.",
  },
  {
    _id: "7",
    category: "Recovery",
    question: "How long does recovery take after laser?",
    answer:
      "Most patients return to desk work within 48 hours. Full recovery (no restrictions) is typically within 1–2 weeks. Physical labour jobs may require 1 week of rest. You will receive a personalised diet and activity plan on discharge.",
  },
  {
    _id: "8",
    category: "Recovery",
    question: "Will piles come back after laser surgery?",
    answer:
      "Laser surgery has a very low recurrence rate (under 5%) compared to conventional methods. Following the post-procedure dietary advice, staying hydrated, and avoiding straining are the key factors that prevent recurrence.",
  },
  {
    _id: "9",
    category: "General",
    question: "Is my consultation completely confidential?",
    answer:
      "Absolutely. All consultations — in-clinic and online — are strictly private. No information is shared with anyone. Our team is trained to handle every case with maximum discretion and empathy.",
  },
  {
    _id: "10",
    category: "General",
    question: "What should I bring to my first appointment?",
    answer:
      "Bring any previous reports (ultrasound, proctoscopy, colonoscopy) if available, a list of medications you are currently taking, and your UHID/patient ID if you have visited before. For a first visit, nothing specific is needed — just come as you are.",
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (isOpen) {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power3.out" },
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: "power3.in" });
    }
  }, [isOpen]);

  return (
    <div className="bg-white rounded-2xl border border-brand-primary/6 overflow-hidden transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(26,91,94,0.07)]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-6 text-left"
      >
        <span className="font-serif text-lg text-brand-text font-semibold leading-snug pr-4">
          {faq.question}
        </span>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300
          ${isOpen ? "bg-brand-primary text-white" : "bg-brand-secondary text-brand-primary"}`}
        >
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </div>
      </button>
      <div ref={bodyRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <p className="px-6 pb-6 text-sm text-brand-textSecondary leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const rootRef = useRef(null);
  const [faqs, setFaqs] = useState([]);
  const [active, setActive] = useState("All");
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    api
      .get("/faqs")
      .then(({ data }) => setFaqs(data.length ? data : FALLBACK))
      .catch(() => setFaqs(FALLBACK))
      .finally(() => setLoading(false));

    api
      .get("/faq-content")
      .then(({ data }) => setPageData(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".faq-hero-txt", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.15,
      });
      gsap.from(".faq-filter-btn", {
        y: 16,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.05,
        delay: 0.5,
      });
      gsap.from(".faq-item", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".faq-list", start: "top 80%", once: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [faqs]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(faqs.map((f) => f.category)))],
    [faqs],
  );
  const filtered =
    active === "All" ? faqs : faqs.filter((f) => f.category === active);
  const searched = searchQuery.trim()
    ? filtered.filter(
        (f) =>
          f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filtered;
  const list = searched.length
    ? searched
    : active === "All" && !searchQuery
      ? FALLBACK
      : [];

  return (
    <div ref={rootRef} data-testid="faq-page">
      {/* Hero */}
      <section className="bg-brand-dark py-20 lg:py-28">
        <div className="container-page max-w-3xl">
          <span className="faq-hero-txt label-eyebrow !text-brand-accent/80">
            {pageData?.hero_eyebrow || "Answers & Info"}
          </span>
          <h1 className="faq-hero-txt font-serif text-5xl lg:text-7xl text-white font-medium tracking-tight mt-4 leading-[1.04]"
            dangerouslySetInnerHTML={{ __html: pageData?.hero_headline ? pageData.hero_headline.replace(/no medical jargon/gi, '<em class="text-brand-accent italic">no medical jargon.</em>') : "Commonly asked questions." }}
          />
          <p className="faq-hero-txt mt-6 text-white/55 text-lg leading-relaxed">
            {pageData?.hero_subheadline || "Find quick answers to common queries about our procedures, preparation, and recovery timelines."}
          </p>
        </div>
      </section>

      {/* Filters + List */}
      <section className="container-page py-16">
        {/* Search bar */}
        <div className="relative mb-6 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-textMuted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setOpenId(null); }}
            placeholder="Search questions…"
            className="w-full pl-10 pr-10 py-3 rounded-full border border-brand-primary/15 bg-white text-sm text-brand-text placeholder:text-brand-textMuted focus:outline-none focus:border-brand-primary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X size={12} className="text-gray-500" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10" data-testid="faq-filters">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setActive(c);
                setOpenId(null);
              }}
              className={`faq-filter-btn rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200
                ${active === c ? "bg-brand-primary text-white shadow-md" : "bg-white border border-brand-primary/15 text-brand-textSecondary hover:border-brand-primary"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <FAQSkeleton />
        ) : list.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-brand-textMuted text-sm">No questions found matching "<strong>{searchQuery}</strong>".</p>
            <button onClick={() => { setSearchQuery(""); setActive("All"); }} className="btn-secondary mt-4 text-xs">Clear search</button>
          </div>
        ) : (
          <div className="faq-list grid lg:grid-cols-2 gap-4">
            {list.map((f) => (
              <div key={f._id || f.question} className="faq-item">
                <FAQItem
                  faq={f}
                  isOpen={openId === (f._id || f.question)}
                  onToggle={() =>
                    setOpenId(
                      openId === (f._id || f.question)
                        ? null
                        : f._id || f.question,
                    )
                  }
                />
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 bg-brand-dark rounded-3xl p-10 lg:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white" />
          </div>
          <div className="relative z-10">
            <h2 className="font-serif text-2xl lg:text-3xl text-white font-semibold">
              Still have questions?
            </h2>
            <p className="text-white/55 mt-3 text-sm">
              Reach out privately — every message is read personally.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-7">
              <Link to="/contact" className="btn-primary shadow-lg">
                Ask Your Question <ArrowRight size={13} />
              </Link>
              <Link to="/book" className="btn-ghost-white !border-white/20">
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
