import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar, LayoutDashboard, BookOpen, Stethoscope,
  Star, HelpCircle, Settings, LogOut, Menu, X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import AppointmentsTab               from "./tabs/AppointmentsTab";
import ServicesManagerTab            from "./tabs/ServicesManagerTab";
import { BlogManagerTab }            from "./tabs/BlogManagerTab";
import { TestimonialsManagerTab }    from "./tabs/TestimonialsManagerTab";
import { FAQsManagerTab }            from "./tabs/FAQsManagerTab";
import { ClinicSettingsTab }         from "./tabs/ClinicSettingsTab";

const TABS = [
  { id:"appointments", label:"Appointments", Icon:Calendar },
  { id:"services",     label:"Services",     Icon:Stethoscope },
  { id:"blog",         label:"Blog",         Icon:BookOpen },
  { id:"testimonials", label:"Reviews",      Icon:Star },
  { id:"faqs",         label:"FAQs",         Icon:HelpCircle },
  { id:"settings",     label:"Settings",     Icon:Settings },
];

export default function AdminDashboard() {
  const { user, logout }    = useAuth();
  const navigate            = useNavigate();
  const [tab, setTab]       = useState("appointments");
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const renderTab = () => {
    switch (tab) {
      case "appointments": return <AppointmentsTab />;
      case "services":     return <ServicesManagerTab />;
      case "blog":         return <BlogManagerTab />;
      case "testimonials": return <TestimonialsManagerTab />;
      case "faqs":         return <FAQsManagerTab />;
      case "settings":     return <ClinicSettingsTab />;
      default:             return null;
    }
  };

  const currentTab = TABS.find(t => t.id === tab);

  return (
    <div className="min-h-screen bg-brand-subtle flex" data-testid="admin-dashboard">

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <>
        {/* Mobile backdrop */}
        {sideOpen && (
          <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSideOpen(false)} />
        )}

        <aside className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-brand-dark flex flex-col
          transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
          ${sideOpen ? "translate-x-0" : "-translate-x-full"}`}>

          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-serif text-lg font-semibold">P</div>
              <div>
                <div className="font-serif text-base text-white font-semibold leading-tight">ProctoCare</div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-white/35">Admin Panel</div>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {TABS.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => { setTab(id); setSideOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${tab === id
                    ? "bg-brand-primary text-white shadow-[0_4px_14px_rgba(26,91,94,0.4)]"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                  }`}>
                <Icon size={17} strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </nav>

          {/* User + Logout */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
              <div className="w-8 h-8 rounded-full bg-brand-primary/30 flex items-center justify-center text-brand-primary text-xs font-bold uppercase">
                {user?.email?.[0] || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">{user?.email}</div>
                <div className="text-[10px] text-white/35 uppercase tracking-wider">Administrator</div>
              </div>
            </div>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/45 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>
      </>

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Top bar */}
        <header className="bg-white border-b border-brand-primary/8 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-[0_2px_12px_rgba(26,91,94,0.05)]">
          <div className="flex items-center gap-4">
            <button onClick={() => setSideOpen(!sideOpen)} className="lg:hidden p-1.5 rounded-lg text-brand-textSecondary hover:bg-brand-subtle transition-colors">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-serif text-xl text-brand-text font-semibold">{currentTab?.label}</h1>
              <p className="text-xs text-brand-textMuted hidden sm:block">ProctoCare Admin Panel</p>
            </div>
          </div>
          <Link to="/" target="_blank" rel="noreferrer"
            className="hidden sm:flex items-center gap-2 text-xs text-brand-textSecondary hover:text-brand-primary transition-colors">
            View Website ↗
          </Link>
        </header>

        {/* Tab content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}
