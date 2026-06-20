// MainLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Navbar from "./Navbar";
import Footer from "./Footer";

export function MainLayout() {
  const mainRef = useRef(null);
  const { pathname } = useLocation();

  // Page transition on route change — smooth fade + slight rise
  useEffect(() => {
    if (!mainRef.current) return;
    // Kill any in-progress tween first
    gsap.killTweensOf(mainRef.current);
    gsap.fromTo(
      mainRef.current,
      { opacity: 0, y: 18, filter: "blur(2px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.55,
        ease: "power3.out",
        clearProps: "filter,transform",
      }
    );
  }, [pathname]);

  return (
    <>
      {/* Custom cursor (desktop only) */}
      <div className="cursor-dot hidden lg:block" id="cursorDot" />
      <div className="cursor-ring hidden lg:block" id="cursorRing" />

      <Navbar />
      <main ref={mainRef} className="pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
