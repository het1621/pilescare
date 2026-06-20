import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, ArrowRight } from "lucide-react";
import api from "../../lib/api";

const SERVICES = [
  "Laser Piles",
  "Fissure Treatment",
  "Fistula Surgery",
  "Pilonidal Sinus",
  "Online Consultation",
  "Follow-up Care",
];
const PAGES = [
  { to: "/about", l: "About Doctor" },
  { to: "/services", l: "Services" },
  { to: "/testimonials", l: "Patient Stories" },
  { to: "/faq", l: "FAQs" },
  { to: "/blog", l: "Journal" },
  { to: "/contact", l: "Contact" },
];

export default function Footer() {
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    api.get("/home-content").then(({ data }) => setHomeData(data)).catch(() => {});
  }, []);

  return (
    <footer className="bg-brand-dark text-white">
      {/* CTA strip */}
      <div className="bg-brand-primary">
        <div className="container-page py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-3xl text-white font-semibold">
              Ready for pain-free living?
            </p>
            <p className="text-white/70 mt-1 text-sm">
              Specialist care, laser precision, same-day procedure.
            </p>
          </div>
          <Link to="/book" className="btn-ghost-white shrink-0 shadow-lg">
            Book a Consultation <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="container-page py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-serif text-xl font-semibold">
              P
            </div>
            <div>
              <div className="font-serif text-lg font-semibold">ProctoCare</div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-white/40 -mt-0.5">
                by Vishva
              </div>
            </div>
          </div>
          <p className="text-sm text-white/55 leading-relaxed">
            Advanced proctology and laser surgery. Compassionate, confidential,
            and cutting-edge care in Vadodara, Gujarat.
          </p>
          <div className="flex gap-3 mt-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Instagram size={16} />
            </a>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5">
            Services
          </h4>
          <ul className="space-y-2.5">
            {SERVICES.map((s) => (
              <li key={s}>
                <Link
                  to="/services"
                  className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-brand-primary group-hover:w-3 transition-all duration-300" />
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Pages */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5">
            Navigate
          </h4>
          <ul className="space-y-2.5">
            {PAGES.map(({ to, l }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-brand-primary group-hover:w-3 transition-all duration-300" />
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5">
            Contact
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-white/60">
              <MapPin
                size={16}
                className="text-brand-primary mt-0.5 shrink-0"
              />
              <span>
                3rd Floor, Sterling Centre, Race Course Circle, Vadodara,
                Gujarat 390007
              </span>
            </li>
            <li>
              <a
                href={`tel:${homeData?.phone_number?.replace(/\s/g, '') || "+919999999999"}`}
                className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Phone size={16} className="text-brand-primary shrink-0" /> {homeData?.phone_number || "+91 99999 99999"}
              </a>
            </li>
            <li>
              <a
                href="mailto:drvishvapatel6298@gmail.com"
                className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors break-all"
              >
                <Mail size={16} className="text-brand-primary shrink-0" />{" "}
                drvishvapatel6298@gmail.com
              </a>
            </li>
          </ul>
          {/* Mini map embed */}
          <div className="mt-5 rounded-xl overflow-hidden border border-white/8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118106.70010221669!2d73.17308625!3d22.32210265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8ab91a3ddab%3A0xac39d3bfe1473fb8!2sVadodara%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1714392472439!5m2!1sen!2sin"
              width="100%"
              height="130"
              style={{ border: 0, display: "block", filter: "grayscale(0.4) invert(0.9) hue-rotate(180deg)", opacity: 0.75 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ProctoCare Clinic Location"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>
            © {new Date().getFullYear()} ProctoCare by Vishva. All rights
            reserved.
          </p>
          <Link
            to="/admin/login"
            className="hover:text-white/60 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
