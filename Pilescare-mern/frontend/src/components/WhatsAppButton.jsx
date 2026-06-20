import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import api from "../lib/api";

const DEFAULT_MESSAGE = "Hi Dr. Vishva, I'd like to book a consultation at ProctoCare.";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [visible, setVisible] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("919999999999");

  useEffect(() => {
    api.get("/home-content")
      .then(({ data }) => setWhatsappNumber(data.whatsapp_number || "919999999999"))
      .catch((err) => console.error("Failed to load WhatsApp number", err));
  }, []);

  // Show after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Show tooltip after 8 seconds (only once)
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="wa-tooltip animate-fadeSlideUp bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-4 pr-10 max-w-[260px] relative border border-gray-100">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={12} className="text-gray-500" />
          </button>
          <p className="text-sm text-brand-text font-medium leading-snug">
            Have a question? 💬
          </p>
          <p className="text-xs text-brand-textSecondary mt-1 leading-relaxed">
            Chat with us on WhatsApp for quick help or to book an appointment.
          </p>
        </div>
      )}

      {/* WhatsApp button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-button group relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.55)] transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <MessageCircle size={26} fill="white" strokeWidth={0} className="relative z-10" />
      </a>
    </div>
  );
}
