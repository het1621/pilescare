import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { formatApiError } from "../../lib/api";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // No gsap import needed - simple CSS animation via class
    const el = rootRef.current;
    if (el) {
      el.style.opacity = 0;
      el.style.transform = "translateY(20px)";
    }
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (el) {
          el.style.transition = "opacity .6s ease, transform .6s ease";
          el.style.opacity = 1;
          el.style.transform = "translateY(0)";
        }
      }, 50);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      toast.success("Welcome back, Doctor.");
      navigate("/admin");
    } catch (err) {
      const msg = formatApiError(err.response?.data?.detail) || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-6 relative overflow-hidden">
      {/* Background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[200, 380, 560, 740].map((s) => (
          <div
            key={s}
            className="absolute rounded-full border border-white/5"
            style={{ width: s, height: s }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-darkSurface to-[#0A2E2B] opacity-80" />

      <div ref={rootRef} className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-serif text-xl font-semibold">
              P
            </div>
            <div>
              <div className="font-serif text-xl text-white font-semibold">
                ProctoCare
              </div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 -mt-0.5">
                by Vishva
              </div>
            </div>
          </Link>

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-brand-primary/20 border border-brand-primary/30 text-brand-primary flex items-center justify-center mb-5">
            <Lock size={20} strokeWidth={1.5} />
          </div>

          <h1 className="font-serif text-3xl text-white font-semibold">
            Admin Sign In
          </h1>
          <p className="text-sm text-white/45 mt-2">
            Manage appointments, content & settings.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/40 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="adm-input"
                placeholder="admin@proctocarebyvishva.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/40 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="adm-input"
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primaryHover text-white rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 shadow-[0_6px_20px_rgba(26,91,94,0.4)]"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
