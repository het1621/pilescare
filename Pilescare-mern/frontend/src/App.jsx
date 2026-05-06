import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { AuthProvider } from "./contexts/AuthContext";
import { MainLayout } from "./components/Layout/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Home          from "./pages/Home";
import AboutDoctor   from "./pages/AboutDoctor";
import Services      from "./pages/Services";
import BookAppointment from "./pages/BookAppointment";
import Testimonials  from "./pages/Testimonials";
import FAQ           from "./pages/FAQ";
import Blog          from "./pages/Blog";
import BlogDetail    from "./pages/BlogDetail";
import Contact       from "./pages/Contact";
import AdminLogin    from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

gsap.registerPlugin(ScrollTrigger);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [pathname]);
  return null;
};

function AppInner() {
  useEffect(() => {
    // ── Smooth scroll with Lenis ─────────────────────────────────────────
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 0.9 });
    const onLenisScroll = () => ScrollTrigger.update();
    const onTick = (t) => lenis.raf(t * 1000);
    lenis.on("scroll", onLenisScroll);
    gsap.ticker.add(onTick);

    // ── Custom cursor ────────────────────────────────────────────────────
    const dot  = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    let onMouseMove;
    if (dot && ring) {
      const setDotX = gsap.quickSetter(dot, "x", "px");
      const setDotY = gsap.quickSetter(dot, "y", "px");
      const setRingX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power2.out" });
      const setRingY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power2.out" });

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
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/"              element={<Home />} />
          <Route path="/about"         element={<AboutDoctor />} />
          <Route path="/services"      element={<Services />} />
          <Route path="/book"          element={<BookAppointment />} />
          <Route path="/testimonials"  element={<Testimonials />} />
          <Route path="/faq"           element={<FAQ />} />
          <Route path="/blog"          element={<Blog />} />
          <Route path="/blog/:slug"    element={<BlogDetail />} />
          <Route path="/contact"       element={<Contact />} />
        </Route>
        <Route path="/admin/login"   element={<AdminLogin />} />
        <Route path="/admin/*"       element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
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
