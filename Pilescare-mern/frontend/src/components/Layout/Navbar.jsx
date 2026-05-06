import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { to: "/about",        label: "About" },
  { to: "/services",     label: "Services" },
  { to: "/testimonials", label: "Patients" },
  { to: "/faq",          label: "FAQ" },
  { to: "/blog",         label: "Journal" },
  { to: "/contact",      label: "Contact" },
];

export default function Navbar() {
  const navRef   = useRef(null);
  const logoRef  = useRef(null);
  const linksRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const { pathname } = useLocation();

  // ── Entrance animation (runs once on mount) ──────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, { y: -20, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });
      gsap.from(".nav-link-item", {
        y: -16, opacity: 0, duration: 0.7, ease: "power3.out",
        stagger: 0.07, delay: 0.35,
      });
      gsap.from(".nav-cta-btn", { y: -16, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.7 });
    }, navRef);
    return () => ctx.revert();
  }, []);

  // ── Scroll shrink effect ──────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  const isDark = pathname === "/" || pathname === "/testimonials";

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500
          ${scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-brand-primary/8 shadow-[0_4px_30px_rgba(26,91,94,0.06)] py-3"
            : isDark
              ? "bg-transparent py-5"
              : "bg-brand-bg/80 backdrop-blur-md py-5"
          }`}
      >
        <div className="container-page flex items-center justify-between">
          {/* Logo */}
          <Link ref={logoRef} to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-serif text-xl font-semibold shadow-md group-hover:scale-105 transition-transform">
              P
            </div>
            <div className="leading-tight">
              <div className={`font-serif text-xl font-semibold transition-colors ${scrolled || !isDark ? "text-brand-text" : "text-white"}`}>
                ProctoCare
              </div>
              <div className={`text-[10px] tracking-[0.22em] uppercase -mt-0.5 transition-colors ${scrolled || !isDark ? "text-brand-textMuted" : "text-white/60"}`}>
                by Vishva
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div ref={linksRef} className="hidden lg:flex items-center gap-4">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to} to={to}
                className={({ isActive }) =>
                  // FIX: Forced transition-colors instead of transition-all so it doesn't fight GSAP
                  `nav-link-item relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 group opacity-100
                   ${isActive
                     ? "text-brand-primary font-semibold"
                     : scrolled || !isDark
                       ? "text-brand-text hover:text-brand-primary"
                       : "text-white hover:text-white/90"
                   }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    <span className={`block mt-1 h-0.5 rounded-full bg-brand-primary transition-transform duration-300 origin-center mx-auto w-10
                      ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+919999999999"
              // FIX: Forced transition-colors here too
              className={`nav-cta-btn flex items-center gap-2 text-sm font-medium transition-colors duration-300 opacity-100
                ${scrolled || !isDark ? "text-brand-text hover:text-brand-primary" : "text-white hover:text-white/90"}`}
            >
              <Phone size={14} /> +91 99999 99999
            </a>
            <Link
              to="/book"
              // FIX: Explicitly defined transitions to stop it getting stuck at a weird vertical height
              className="nav-cta-btn btn-primary !py-2.5 !px-5 text-xs shadow-[0_4px_14px_rgba(26,91,94,0.3)] hover:shadow-[0_6px_20px_rgba(26,91,94,0.4)] !transition-[background-color,box-shadow,color,border-color]"
            >
              Book Now <ArrowRight size={13} />
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled || !isDark ? "text-brand-text" : "text-white"}`}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className={`absolute top-0 right-0 bottom-0 w-72 bg-brand-dark z-50 flex flex-col pt-24 px-8 pb-10
            transition-transform duration-300 translate-x-0`}>
            <div className="space-y-1 flex-1">
              {LINKS.map(({ to, label }, i) => (
                <Link
                  key={to} to={to}
                  style={{ transitionDelay: `${i * 60}ms` }}
                  className={`block py-3 text-lg font-serif font-medium text-white/80 hover:text-white border-b border-white/5
                    transition-colors duration-300 opacity-100`}
                >
                  {label}
                </Link>
              ))}
            </div>
            <Link to="/book" className="btn-primary justify-center mt-6 shadow-lg !transition-[background-color,box-shadow,color,border-color]">
              Book Appointment <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}