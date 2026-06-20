import { useEffect, useState } from "react";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "../../../lib/api";
import ImageUpload from "../../../components/admin/ImageUpload";

const Field = ({ label, children, hint }) => (
  <div>
    <label className="block text-xs uppercase tracking-[0.15em] text-brand-textSecondary font-semibold mb-2">
      {label}
    </label>
    {children}
    {hint && <p className="text-[10px] text-brand-textMuted mt-1">{hint}</p>}
  </div>
);

const Input = ({ value, onChange, placeholder, className = "" }) => (
  <input
    type="text"
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`bk-input ${className}`}
  />
);

const Textarea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="bk-input resize-none"
  />
);

export default function AboutManagerTab() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/about")
      .then(({ data }) => setData(data))
      .catch(() => toast.error("Failed to load About data"))
      .finally(() => setLoading(false));
  }, []);

  const update = (key, val) => setData((prev) => ({ ...prev, [key]: val }));

  const save = async () => {
    setSaving(true);
    try {
      const { data: saved } = await api.patch("/about", data);
      setData(saved);
      toast.success("About page saved!");
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
      {/* ── Profile Section ─── */}
      <section className="bg-white rounded-2xl border border-brand-primary/8 p-6 space-y-5">
        <h3 className="font-serif text-lg text-brand-text font-semibold">Doctor Profile</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Name">
            <Input value={data.name} onChange={(v) => update("name", v)} placeholder="Dr. Vishva Patel" />
          </Field>
          <Field label="Title">
            <Input value={data.title} onChange={(v) => update("title", v)} placeholder="Consultant Proctologist" />
          </Field>
          <Field label="Location">
            <Input value={data.location} onChange={(v) => update("location", v)} placeholder="Vadodara" />
          </Field>
        </div>
        <ImageUpload
          label="Doctor Photo"
          value={data.image_url}
          onChange={(v) => update("image_url", v)}
        />
      </section>

      {/* ── Bio Section ─── */}
      <section className="bg-white rounded-2xl border border-brand-primary/8 p-6 space-y-4">
        <h3 className="font-serif text-lg text-brand-text font-semibold">Biography</h3>
        <Field label="Bio (use blank lines to separate paragraphs)">
          <Textarea value={data.bio} onChange={(v) => update("bio", v)} rows={8} placeholder="Doctor's biography..." />
        </Field>
      </section>

      {/* ── Features List ─── */}
      <section className="bg-white rounded-2xl border border-brand-primary/8 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-brand-text font-semibold">Key Features</h3>
          <button
            type="button"
            onClick={() => update("features", [...(data.features || []), ""])}
            className="btn-secondary text-xs px-3 py-1.5"
          >
            <Plus size={12} /> Add
          </button>
        </div>
        {(data.features || []).map((f, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={f}
              onChange={(v) => {
                const arr = [...data.features];
                arr[i] = v;
                update("features", arr);
              }}
              placeholder="e.g. 5000+ procedures performed"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => update("features", data.features.filter((_, j) => j !== i))}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </section>

      {/* ── Credentials ─── */}
      <section className="bg-white rounded-2xl border border-brand-primary/8 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-brand-text font-semibold">Credentials</h3>
          <button
            type="button"
            onClick={() => update("credentials", [...(data.credentials || []), { label: "", body: "" }])}
            className="btn-secondary text-xs px-3 py-1.5"
          >
            <Plus size={12} /> Add
          </button>
        </div>
        {(data.credentials || []).map((c, i) => (
          <div key={i} className="flex gap-2 items-start">
            <Input
              value={c.label}
              onChange={(v) => {
                const arr = [...data.credentials];
                arr[i] = { ...arr[i], label: v };
                update("credentials", arr);
              }}
              placeholder="MBBS"
              className="w-24"
            />
            <Input
              value={c.body}
              onChange={(v) => {
                const arr = [...data.credentials];
                arr[i] = { ...arr[i], body: v };
                update("credentials", arr);
              }}
              placeholder="Baroda Medical College"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => update("credentials", data.credentials.filter((_, j) => j !== i))}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </section>

      {/* ── Info Cards ─── */}
      <section className="bg-white rounded-2xl border border-brand-primary/8 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-brand-text font-semibold">Info Cards</h3>
          <button
            type="button"
            onClick={() => update("cards", [...(data.cards || []), { title: "", description: "" }])}
            className="btn-secondary text-xs px-3 py-1.5"
          >
            <Plus size={12} /> Add
          </button>
        </div>
        {(data.cards || []).map((card, i) => (
          <div key={i} className="bg-brand-subtle rounded-xl p-4 space-y-3">
            <div className="flex gap-2 items-center">
              <Input
                value={card.title}
                onChange={(v) => {
                  const arr = [...data.cards];
                  arr[i] = { ...arr[i], title: v };
                  update("cards", arr);
                }}
                placeholder="Card title"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => update("cards", data.cards.filter((_, j) => j !== i))}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <Textarea
              value={card.description}
              onChange={(v) => {
                const arr = [...data.cards];
                arr[i] = { ...arr[i], description: v };
                update("cards", arr);
              }}
              placeholder="Card description..."
              rows={2}
            />
          </div>
        ))}
      </section>

      {/* ── Mission ─── */}
      <section className="bg-white rounded-2xl border border-brand-primary/8 p-6 space-y-4">
        <h3 className="font-serif text-lg text-brand-text font-semibold">Mission Statement</h3>
        <Field label="Title">
          <Input value={data.mission_title} onChange={(v) => update("mission_title", v)} placeholder="Our Patient-First Mission" />
        </Field>
        <Field label="Body">
          <Textarea value={data.mission_text} onChange={(v) => update("mission_text", v)} rows={5} placeholder="Mission statement..." />
        </Field>
      </section>

      {/* ── Stats ─── */}
      <section className="bg-white rounded-2xl border border-brand-primary/8 p-6 space-y-4">
        <h3 className="font-serif text-lg text-brand-text font-semibold">Stats (About Page)</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Procedures">
            <Input value={data.stats?.procedures} onChange={(v) => update("stats", { ...data.stats, procedures: v })} placeholder="5000+" />
          </Field>
          <Field label="Experience">
            <Input value={data.stats?.experience} onChange={(v) => update("stats", { ...data.stats, experience: v })} placeholder="12+" />
          </Field>
          <Field label="Satisfaction">
            <Input value={data.stats?.satisfaction} onChange={(v) => update("stats", { ...data.stats, satisfaction: v })} placeholder="98%" />
          </Field>
          <Field label="Patients">
            <Input value={data.stats?.patients} onChange={(v) => update("stats", { ...data.stats, patients: v })} placeholder="10k+" />
          </Field>
        </div>
      </section>

      {/* Save button */}
      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="btn-primary px-8 py-3 shadow-lg"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving…" : "Save About Page"}
        </button>
      </div>
    </div>
  );
}
