import { useState, useEffect } from "react";
import { Save, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "../../../lib/api";

const Input = ({ label, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-xs uppercase tracking-widest text-brand-textMuted mb-2">
      {label}
    </label>
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-brand-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/40 focus:ring-1 focus:ring-brand-primary/40 transition-all"
      placeholder={placeholder}
    />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-xs uppercase tracking-widest text-brand-textMuted mb-2">
      {label}
    </label>
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full bg-white border border-brand-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/40 focus:ring-1 focus:ring-brand-primary/40 transition-all resize-none"
      placeholder={placeholder}
    />
  </div>
);

export default function FaqContentTab() {
  const [data, setData] = useState({
    hero_eyebrow: "",
    hero_headline: "",
    hero_subheadline: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/faq-content");
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load FAQ content");
    } finally {
      setLoading(false);
    }
  };

  const update = (key, val) => setData((d) => ({ ...d, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch("/faq-content", data);
      setData(res.data);
      toast.success("FAQ page content updated");
    } catch (err) {
      toast.error(formatApiError(err) || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-brand-textMuted">
        <Loader2 size={32} className="animate-spin mb-4" />
        <p className="text-sm">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-brand-text font-medium">
            FAQ Page Content
          </h2>
          <p className="text-sm text-brand-textSecondary mt-1">
            Manage the hero text displayed on the Frequently Asked Questions page.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            disabled={saving}
            className="p-2.5 rounded-xl border border-brand-primary/20 text-brand-text hover:bg-brand-secondary transition-colors"
            title="Reload"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary py-2.5 px-5 flex items-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-primary/10 shadow-sm p-6 lg:p-8">
        <h3 className="text-lg font-serif text-brand-text font-medium mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-brand-secondary text-brand-primary flex items-center justify-center text-sm">
            1
          </span>
          Hero Section
        </h3>
        
        <div className="grid md:grid-cols-2 gap-x-6">
          <Input
            label="Hero Eyebrow Label"
            value={data.hero_eyebrow}
            onChange={(v) => update("hero_eyebrow", v)}
            placeholder="Answers & Info"
          />
          <Input
            label="Hero Headline"
            value={data.hero_headline}
            onChange={(v) => update("hero_headline", v)}
            placeholder="Commonly asked questions."
          />
          <div className="md:col-span-2">
            <Textarea
              label="Hero Subheadline"
              value={data.hero_subheadline}
              onChange={(v) => update("hero_subheadline", v)}
              placeholder="Find quick answers to common queries..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
