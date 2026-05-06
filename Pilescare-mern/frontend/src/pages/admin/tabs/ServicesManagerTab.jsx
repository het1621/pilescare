import { useEffect, useState, useCallback } from "react";
import { Loader2, Save, Plus, Trash2, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "../../../lib/api";

const ICONS = ["Stethoscope","HeartPulse","ShieldPlus","Sparkles","Calendar","Video"];
const empty = { title:"", icon:"Sparkles", image:"", summary:"", details:[""], slug:"" };

const Field = ({ label, full, children }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-textSecondary mb-2">{label}</label>
    {children}
  </div>
);

export default function ServicesManagerTab() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(empty);
  const [saving, setSaving]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get("/services"); setItems(data); }
    catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const startNew  = () => { setForm(empty); setEditing("new"); };
  const startEdit = (s) => { setForm({ title:s.title, icon:s.icon||"Sparkles", image:s.image||"", summary:s.summary, details:s.details?.length?s.details:[""], slug:s.slug }); setEditing(s); };
  const cancel    = () => { setEditing(null); setForm(empty); };

  const save = async () => {
    if (!form.title || !form.summary) return toast.error("Title and summary required");
    const payload = { ...form, details: form.details.map(d=>d.trim()).filter(Boolean) };
    setSaving(true);
    try {
      editing === "new" ? await api.post("/services", payload) : await api.patch(`/services/${editing._id}`, payload);
      toast.success(editing === "new" ? "Service added" : "Service updated");
      await load(); cancel();
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail) || "Failed"); }
    finally { setSaving(false); }
  };

  const remove = async (s) => {
    if (!window.confirm(`Delete "${s.title}"?`)) return;
    try { await api.delete(`/services/${s._id}`); toast.success("Deleted"); load(); }
    catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };

  const updateDetail = (i, v) => { const d=[...form.details]; d[i]=v; setForm({...form,details:d}); };
  const addDetail    = () => setForm({...form, details:[...form.details,""]});
  const removeDetail = (i) => setForm({...form, details:form.details.filter((_,idx)=>idx!==i)});

  if (editing) return (
    <div className="mt-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-brand-text font-semibold">{editing==="new"?"New Service":`Edit: ${editing.title}`}</h2>
        <div className="flex gap-2">
          <button onClick={cancel} className="btn-secondary !py-2 !px-4 text-xs"><X size={14}/>Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary !py-2 !px-4 text-xs">
            {saving?<><Loader2 size={14} className="animate-spin"/>Saving…</>:<><Save size={14}/>Save</>}
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-brand-primary/10 p-6 lg:p-8 grid md:grid-cols-2 gap-5">
        <Field label="Title *"><input className="m-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></Field>
        <Field label="Slug (auto if empty)"><input className="m-input" value={form.slug} placeholder="auto" onChange={e=>setForm({...form,slug:e.target.value})}/></Field>
        <Field label="Icon">
          <select className="m-input" value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})}>
            {ICONS.map(i=><option key={i} value={i}>{i}</option>)}
          </select>
        </Field>
        <Field label="Image URL"><input className="m-input" value={form.image} placeholder="https://images.unsplash.com/…" onChange={e=>setForm({...form,image:e.target.value})}/></Field>
        <Field full label="Summary *"><textarea rows={2} className="m-input resize-none" value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})}/></Field>
        <Field full label="Detail bullet points">
          <div className="space-y-2">
            {form.details.map((d,i)=>(
              <div key={i} className="flex gap-2">
                <input className="m-input flex-1" value={d} placeholder={`Bullet ${i+1}`} onChange={e=>updateDetail(i,e.target.value)}/>
                {form.details.length>1&&<button type="button" onClick={()=>removeDetail(i)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"><Trash2 size={14}/></button>}
              </div>
            ))}
            <button type="button" onClick={addDetail} className="btn-secondary !py-2 !px-4 text-xs"><Plus size={14}/>Add bullet</button>
          </div>
        </Field>
        {form.image&&<div className="md:col-span-2"><img src={form.image} alt="preview" className="aspect-video w-64 object-cover rounded-xl border border-brand-primary/10"/></div>}
      </div>
      <MInputStyles/>
    </div>
  );

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-brand-textSecondary">{items.length} services</p>
        <button onClick={startNew} className="btn-primary !py-2 !px-5 text-xs"><Plus size={14}/>New Service</button>
      </div>
      <div className="bg-white rounded-2xl border border-brand-primary/10 overflow-hidden">
        {loading?<div className="p-12 text-center text-brand-textMuted"><Loader2 size={20} className="animate-spin inline mr-2"/>Loading…</div>
        :items.length===0?<div className="p-12 text-center text-brand-textMuted">No services yet.</div>
        :<ul className="divide-y divide-brand-primary/5">
          {items.map(s=>(
            <li key={s._id} className="p-5 flex items-center gap-5">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-secondary shrink-0">
                {s.image?<img src={s.image} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-brand-primary text-xs font-semibold">{s.icon}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-lg text-brand-text font-semibold truncate">{s.title}</div>
                <div className="text-xs text-brand-textMuted mt-1 line-clamp-1">{s.summary}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={()=>startEdit(s)} className="p-2 rounded-lg text-sky-600 hover:bg-sky-50"><Pencil size={15}/></button>
                <button onClick={()=>remove(s)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"><Trash2 size={15}/></button>
              </div>
            </li>
          ))}
        </ul>}
      </div>
    </div>
  );
}

export const MInputStyles = () => (
  <style>{`.m-input{width:100%;background:#fff;border:1px solid rgba(26,91,94,.15);border-radius:.625rem;padding:.6rem .9rem;font-size:.85rem;color:#1B2421;outline:none;transition:border-color .2s;font-family:inherit}.m-input:focus{border-color:#1A5B5E;box-shadow:0 0 0 3px rgba(26,91,94,.08)}`}</style>
);
