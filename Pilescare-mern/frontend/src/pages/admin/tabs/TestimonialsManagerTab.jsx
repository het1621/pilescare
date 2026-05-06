import { useEffect, useState, useCallback } from "react";
import { Loader2, Save, Plus, Trash2, Pencil, X, Star } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "../../../lib/api";
import { MInputStyles } from "./ServicesManagerTab";

const empty = { name:"", city:"", rating:5, service:"", text:"" };
const Field = ({label,full,children}) => <div className={full?"md:col-span-2":""}><label className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-textSecondary mb-2">{label}</label>{children}</div>;

export function TestimonialsManagerTab() {
  const [items,setItems]=useState([]); const [loading,setLoading]=useState(true);
  const [editing,setEditing]=useState(null); const [form,setForm]=useState(empty); const [saving,setSaving]=useState(false);

  const load=useCallback(async()=>{
    setLoading(true);
    try{const{data}=await api.get("/testimonials");setItems(data);}
    catch(err){toast.error(formatApiError(err.response?.data?.detail));}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const startNew=()=>{setForm(empty);setEditing("new");};
  const startEdit=t=>{setForm({name:t.name,city:t.city||"",rating:t.rating||5,service:t.service||"",text:t.text});setEditing(t);};
  const cancel=()=>{setEditing(null);setForm(empty);};

  const save=async()=>{
    if(!form.name||!form.text)return toast.error("Name and review text required");
    setSaving(true);
    try{
      editing==="new"?await api.post("/testimonials",form):await api.patch(`/testimonials/${editing._id}`,form);
      toast.success(editing==="new"?"Added":"Updated");
      await load();cancel();
    }catch(err){toast.error(formatApiError(err.response?.data?.detail)||"Failed");}
    finally{setSaving(false);}
  };
  const remove=async t=>{
    if(!window.confirm(`Delete review by ${t.name}?`))return;
    try{await api.delete(`/testimonials/${t._id}`);toast.success("Deleted");load();}
    catch(err){toast.error(formatApiError(err.response?.data?.detail));}
  };

  if(editing) return(
    <div className="mt-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-brand-text font-semibold">{editing==="new"?"New Testimonial":`Edit: ${editing.name}`}</h2>
        <div className="flex gap-2">
          <button onClick={cancel} className="btn-secondary !py-2 !px-4 text-xs"><X size={14}/>Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary !py-2 !px-4 text-xs">{saving?<><Loader2 size={14} className="animate-spin"/>Saving…</>:<><Save size={14}/>Save</>}</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-brand-primary/10 p-6 lg:p-8 grid md:grid-cols-2 gap-5">
        <Field label="Patient Name *"><input className="m-input" value={form.name} placeholder="e.g. Rahul M." onChange={e=>setForm({...form,name:e.target.value})}/></Field>
        <Field label="City"><input className="m-input" value={form.city} placeholder="e.g. Vadodara" onChange={e=>setForm({...form,city:e.target.value})}/></Field>
        <Field label="Treatment"><input className="m-input" value={form.service} placeholder="e.g. Laser Piles" onChange={e=>setForm({...form,service:e.target.value})}/></Field>
        <Field label="Rating">
          <select className="m-input" value={form.rating} onChange={e=>setForm({...form,rating:parseInt(e.target.value)})}>
            {[5,4,3,2,1].map(r=><option key={r} value={r}>{r} stars</option>)}
          </select>
        </Field>
        <Field full label="Review Text *"><textarea rows={5} className="m-input resize-none" value={form.text} placeholder="Patient's experience…" onChange={e=>setForm({...form,text:e.target.value})}/></Field>
      </div>
      <MInputStyles/>
    </div>
  );

  return(
    <div className="mt-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-brand-textSecondary">{items.length} reviews</p>
        <button onClick={startNew} className="btn-primary !py-2 !px-5 text-xs"><Plus size={14}/>New Review</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {loading?<div className="md:col-span-2 p-12 text-center text-brand-textMuted"><Loader2 size={20} className="animate-spin inline mr-2"/>Loading…</div>
        :items.length===0?<div className="md:col-span-2 p-12 text-center text-brand-textMuted">No testimonials yet.</div>
        :items.map(t=>(
          <div key={t._id} className="bg-white rounded-2xl border border-brand-primary/10 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-0.5 text-brand-accent">{[...Array(t.rating||5)].map((_,i)=><Star key={i} size={13} fill="currentColor"/>)}</div>
              <div className="flex gap-1">
                <button onClick={()=>startEdit(t)} className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50"><Pencil size={13}/></button>
                <button onClick={()=>remove(t)} className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"><Trash2 size={13}/></button>
              </div>
            </div>
            <p className="text-sm text-brand-text leading-relaxed italic line-clamp-3">"{t.text}"</p>
            <div className="text-xs uppercase tracking-wider text-brand-textMuted mt-4 pt-3 border-t border-brand-primary/5">
              <span className="font-semibold text-brand-textSecondary">{t.name}</span>{t.city&&`, ${t.city}`}{t.service&&` · ${t.service}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
