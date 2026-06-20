import { Link, useLocation } from "react-router-dom";
import { Home, Stethoscope, Calendar, Phone, Menu } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/services", label: "Services", Icon: Stethoscope },
  { to: "/book", label: "Book", Icon: Calendar, primary: true },
  { to: "/contact", label: "Contact", Icon: Phone },
];

export default function MobileBottomNav() {
  const { pathname } = useLocation();

  const isActive = (to) => {
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-xl border-t border-brand-primary/8 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ to, label, Icon, primary }) =>
          primary ? (
            /* Book CTA — prominent center button */
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center -mt-5"
            >
              <div className="w-14 h-14 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-[0_4px_20px_rgba(26,91,94,0.4)] hover:bg-brand-primaryHover transition-colors">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] text-brand-primary font-semibold mt-1 uppercase tracking-wider">
                {label}
              </span>
            </Link>
          ) : (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors min-w-0
                ${isActive(to) ? "text-brand-primary" : "text-brand-textMuted hover:text-brand-primary"}`}
            >
              <div className="relative">
                <Icon
                  size={20}
                  strokeWidth={isActive(to) ? 2 : 1.5}
                />
                {/* Active dot */}
                {isActive(to) && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary" />
                )}
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider leading-none">
                {label}
              </span>
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
