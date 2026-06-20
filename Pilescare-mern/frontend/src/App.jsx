import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import { Toaster } from "sonner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { AuthProvider } from "./contexts/AuthContext";
import { MainLayout } from "./components/Layout/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Home from "./pages/Home";
import AboutDoctor from "./pages/AboutDoctor";
import Services from "./pages/Services";
import BookAppointment from "./pages/BookAppointment";
import Testimonials from "./pages/Testimonials";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import WhatsAppButton from "./components/WhatsAppButton";
import BackToTop from "./components/BackToTop";
import MobileBottomNav from "./components/MobileBottomNav";

gsap.registerPlugin(ScrollTrigger);

const NotFoundPage = () => (
  <div className="container-page py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
    {/* Medical-themed SVG illustration */}
    <div className="relative mb-8">
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
        {/* Stethoscope body */}
        <circle cx="100" cy="100" r="90" stroke="#1A5B5E" strokeWidth="2" strokeDasharray="6 4" opacity="0.15" />
        <circle cx="100" cy="100" r="65" stroke="#1A5B5E" strokeWidth="1.5" opacity="0.08" />
        {/* Stethoscope head */}
        <circle cx="100" cy="130" r="22" stroke="#1A5B5E" strokeWidth="3" fill="#E8F4F4" />
        <circle cx="100" cy="130" r="10" fill="#1A5B5E" opacity="0.15" />
        {/* Tube */}
        <path d="M78 130 C78 90, 65 70, 75 50" stroke="#1A5B5E" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M122 130 C122 90, 135 70, 125 50" stroke="#1A5B5E" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Earpieces */}
        <circle cx="75" cy="48" r="6" fill="#1A5B5E" opacity="0.8" />
        <circle cx="125" cy="48" r="6" fill="#1A5B5E" opacity="0.8" />
        {/* Question mark */}
        <text x="100" y="108" textAnchor="middle" fill="#D4A85C" fontSize="40" fontFamily="serif" fontWeight="bold" opacity="0.7">?</text>
      </svg>
      {/* Floating pulse ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 rounded-full border-2 border-brand-primary/10 animate-ping" style={{ animationDuration: "3s" }} />
      </div>
    </div>

    <h1 className="font-serif text-8xl lg:text-9xl font-bold tracking-tight" style={{
      background: "linear-gradient(135deg, #1A5B5E 0%, #D4A85C 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>404</h1>
    <h2 className="font-serif text-2xl lg:text-3xl text-brand-text font-semibold mt-4">
      This page went off for a check-up
    </h2>
    <p className="text-brand-textSecondary mt-3 max-w-md text-sm leading-relaxed">
      The page you're looking for doesn't exist or has been moved.
      Don't worry — let's get you back on track.
    </p>
    <div className="flex gap-4 mt-8">
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
      <Link to="/contact" className="btn-secondary">
        Contact Us
      </Link>
    </div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
};

function AppInner() {
  useEffect(() => {
    // ── Smooth scroll with Lenis ─────────────────────────────────────────
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    const onLenisScroll = () => ScrollTrigger.update();
    const onTick = (t) => lenis.raf(t * 1000);
    lenis.on("scroll", onLenisScroll);
    gsap.ticker.add(onTick);

    // ── Custom cursor ────────────────────────────────────────────────────
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    let onMouseMove;
    if (dot && ring) {
      const setDotX = gsap.quickSetter(dot, "x", "px");
      const setDotY = gsap.quickSetter(dot, "y", "px");
      const setRingX = gsap.quickTo(ring, "x", {
        duration: 0.45,
        ease: "power2.out",
      });
      const setRingY = gsap.quickTo(ring, "y", {
        duration: 0.45,
        ease: "power2.out",
      });

      onMouseMove = (e) => {
        setDotX(e.clientX);
        setDotY(e.clientY);
        setRingX(e.clientX);
        setRingY(e.clientY);
      };
      document.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    return () => {
      if (onMouseMove) document.removeEventListener("mousemove", onMouseMove);
      lenis.off?.("scroll", onLenisScroll);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" richColors closeButton />
      <WhatsAppButton />
      <BackToTop />
      <MobileBottomNav />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutDoctor />} />
          <Route path="/services" element={<Services />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AuthProvider>
  );
}
