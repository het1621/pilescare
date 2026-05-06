// MainLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Navbar from "./Navbar";
import Footer from "./Footer";

export function MainLayout() {
  const mainRef = useRef(null);
  const { pathname } = useLocation();

  // Page transition on route change
  useEffect(() => {
    gsap.fromTo(mainRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
  }, [pathname]);

  return (
    <>
      {/* Custom cursor (desktop only) */}
      <div className="cursor-dot hidden lg:block" id="cursorDot" />
      <div className="cursor-ring hidden lg:block" id="cursorRing" />

      <Navbar />
      <main ref={mainRef}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
