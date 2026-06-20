import { useEffect, useState } from "react";
import { Loader2, Save, Plus, Trash2, Palette } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "../../../lib/api";

const Field = ({ label, children, hint }) => (
  <div>
    <label className="block text-xs uppercase tracking-[0.15em] text-brand-textSecondary font-semibold mb-2">
      {label}
    </label>
    {children}
    {hint && <p className="text-[10px] text-brand-textMuted mt-1">{hint}</p>}
  </div>
);

const Input = ({ value, onChange, placeholder, type = "text", className = "" }) => (
  <input
    type={type}
    value={value ?? ""}
    onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
    placeholder={placeholder}
    className={`bk-input ${className}`}
  />
);

const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="bk-input resize-none"
  />
);

const ColorInput = ({ value, onChange, label }) => (
  <div className="flex items-center gap-3">
    <input
      type="color"
      value={value || "#000000"}
      onChange={(e) => onChange(e.target.value)}
      className="w-10 h-10 rounded-lg border border-brand-primary/15 cursor-pointer"
    />
    <div className="flex-1">
      <div className="text-xs text-brand-textSecondary font-medium">{label}</div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="bk-input mt-1 text-xs"
        placeholder="#1A5B5E"
      />
    </div>
  </div>
);

export default function HomeContentTab() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/home-content")
      .then(({ data }) => setData(data))
      .catch(() => toast.error("Failed to load Home content"))
      .finally(() => setLoading(false));
  }, []);

  const update = (key, val) => setData((prev) => ({ ...prev, [key]: val }));

  const save = async () => {
    setSaving(true);
    try {
      const { data: saved } = await api.patch("/home-content", data);
      setData(saved);
      toast.success("Home page saved!");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-6 flex justify-center py-20">
        <Loader2 className="animate-spin text-brand-primary" size={28} />
      </div>
    );
  }

  if (!data) return <div className="mt-6 text-brand-textMuted text-center py-20">Failed to load</div>;

  return (
    <div className="mt-4 space-y-8 max-w-3xl">
      {/* ── Hero Section ─── */}
      <section className="bg-white rounded-2xl border border-brand-primary/8 p-6 space-y-5">
        <h3 className="font-serif text-lg text-brand-text font-semibold">Hero Section</h3>
        <Field label="Headline">
          <Input value={data.hero_headline} onChange={(v) => update("hero_headline", v)} placeholder="Advanced Laser Proctology" />
        </Field>
        <Field label="Subheadline">
          <Textarea value={data.hero_subheadline} onChange={(v) => update("hero_subheadline", v)} placeholder="Painless, precise, private..." />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="CTA Button Text">
            <Input value={data.hero_cta_text} onChange={(v) => update("hero_cta_text", v)} placeholder="Book a Consultation" />
          </Field>
          <Field label="CTA Link">
            <Input value={data.hero_cta_link} onChange={(v) => update("hero_cta_link", v)} placeholder="/book" />
          </Field>
        </div>
      </section>

      {/* ── Hero Visual Config ─── */}
      <section className="bg-white rounded-2xl border border-brand-primary/8 p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Palette size={18} className="text-brand-primary" />
          <h3 className="font-serif text-lg text-brand-text font-semibold">Hero Visual Settings</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <ColorInput label="Particle Color" value={data.hero_particle_color} onChange={(v) => update("hero_particle_color", v)} />
          <Field label="Particle Count">
            <Input type="number" value={data.hero_particle_count} onChange={(v) => update("hero_particle_count", v)} placeholder="80" />
          </Field>
          <ColorInput label="Background Gradient From" value={data.hero_bg_gradient_from} onChange={(v) => update("hero_bg_gradient_from", v)} />
          <ColorInput label="Background Gradient To" value={data.hero_bg_gradient_to} onChange={(v) => update("hero_bg_gradient_to", v)} />
        </div>
        {/* Live preview */}
        <div
          className="h-20 rounded-xl border border-brand-primary/10 flex items-center justify-center text-xs text-white/60 font-medium"
          style={{
            background: `linear-gradient(135deg, ${data.hero_bg_gradient_from || "#0e1b19"}, ${data.hero_bg_gradient_to || "#122a27"})`,
          }}
        >
          Gradient Preview
        </div>
      </section>

      {/* ── Contact Info ─── */}
      <section className="bg-white rounded-2xl border border-brand-primary/8 p-6 space-y-5">
        <h3 className="font-serif text-lg text-brand-text font-semibold">Contact Numbers</h3>
        <p className="text-xs text-brand-textMuted">These numbers are used across the entire website (navbar, footer, contact page, WhatsApp button).</p>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Phone Number (display)">
            <Input value={data.phone_number} onChange={(v) => update("phone_number", v)} placeholder="+91 99999 99999" />
          </Field>
          <Field label="WhatsApp Number (no +, no spaces)" hint="e.g. 919876543210">
            <Input value={data.whatsapp_number} onChange={(v) => update("whatsapp_number", v)} placeholder="919999999999" />
          </Field>
        </div>
      </section>

      {/* ── Stats Bar ─── */}
      <section className="bg-white rounded-2xl border border-brand-primary/8 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-brand-text font-semibold">Stats Bar</h3>
          <button
            type="button"
            onClick={() => update("stats", [...(data.stats || []), { value: 0, suffix: "+", label: "" }])}
            className="btn-secondary text-xs px-3 py-1.5"
          >
            <Plus size={12} /> Add Stat
          </button>
        </div>
        {(data.stats || []).map((s, i) => (
          <div key={i} className="flex gap-2 items-center bg-brand-subtle rounded-xl p-3">
            <Input
              type="number"
              value={s.value}
              onChange={(v) => {
                const arr = [...data.stats];
                arr[i] = { ...arr[i], value: v };
                update("stats", arr);
              }}
              placeholder="5000"
              className="w-24"
            />
            <Input
              value={s.suffix}
              onChange={(v) => {
                const arr = [...data.stats];
                arr[i] = { ...arr[i], suffix: v };
                update("stats", arr);
              }}
              placeholder="+"
              className="w-16"
            />
            <Input
              value={s.label}
              onChange={(v) => {
                const arr = [...data.stats];
                arr[i] = { ...arr[i], label: v };
                update("stats", arr);
              }}
              placeholder="Procedures Done"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => update("stats", data.stats.filter((_, j) => j !== i))}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </section>

      {/* ── Process Steps ─── */}
      <section className="bg-white rounded-2xl border border-brand-primary/8 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-brand-text font-semibold">How It Works — Steps</h3>
          <button
            type="button"
            onClick={() =>
              update("process_steps", [
                ...(data.process_steps || []),
                { number: String((data.process_steps?.length || 0) + 1).padStart(2, "0"), title: "", description: "" },
              ])
            }
            className="btn-secondary text-xs px-3 py-1.5"
          >
            <Plus size={12} /> Add Step
          </button>
        </div>
        {(data.process_steps || []).map((step, i) => (
          <div key={i} className="bg-brand-subtle rounded-xl p-4 space-y-3">
            <div className="flex gap-2 items-center">
              <Input
                value={step.number}
                onChange={(v) => {
                  const arr = [...data.process_steps];
                  arr[i] = { ...arr[i], number: v };
                  update("process_steps", arr);
                }}
                placeholder="01"
                className="w-16"
              />
              <Input
                value={step.title}
                onChange={(v) => {
                  const arr = [...data.process_steps];
                  arr[i] = { ...arr[i], title: v };
                  update("process_steps", arr);
                }}
                placeholder="Step title"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => update("process_steps", data.process_steps.filter((_, j) => j !== i))}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <Textarea
              value={step.description}
              onChange={(v) => {
                const arr = [...data.process_steps];
                arr[i] = { ...arr[i], description: v };
                update("process_steps", arr);
              }}
              placeholder="Step description..."
              rows={2}
            />
          </div>
        ))}
      </section>

      {/* Save button */}
      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="btn-primary px-8 py-3 shadow-lg"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving…" : "Save Home Page"}
        </button>
      </div>
    </div>
  );
}
