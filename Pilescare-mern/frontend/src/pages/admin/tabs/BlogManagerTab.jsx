// BlogManagerTab.jsx
import { useEffect, useState, useCallback } from "react";
import { Loader2, Save, Plus, Trash2, Pencil, X, Eye } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "../../../lib/api";
import { MInputStyles } from "./ServicesManagerTab";

const emptyBlog = { title:"", excerpt:"", category:"Symptoms", read_time:"5 min read", cover:"", content_html:"", slug:"" };
const CATS = ["Symptoms","Treatment","Education","Prevention","Recovery","Tips","News"];
const Field = ({label,full,children}) => <div className={full?"md:col-span-2":""}><label className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-textSecondary mb-2">{label}</label>{children}</div>;

export function BlogManagerTab() {
  const [posts,setPosts]=useState([]); const [loading,setLoading]=useState(true);
  const [editing,setEditing]=useState(null); const [form,setForm]=useState(emptyBlog);
  const [saving,setSaving]=useState(false); const [preview,setPreview]=useState(false);

  const load = useCallback(async()=>{
    setLoading(true);
    try{const{data}=await api.get("/blog/admin/all");setPosts(data);}
    catch{try{const{data}=await api.get("/blog");setPosts(data);}catch(e){toast.error("Failed to load");}}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const startNew=()=>{setForm(emptyBlog);setEditing("new");setPreview(false);};
  const startEdit=p=>{setForm({title:p.title,excerpt:p.excerpt,category:p.category,read_time:p.read_time,cover:p.cover,content_html:p.content_html,slug:p.slug});setEditing(p);setPreview(false);};
  const cancel=()=>{setEditing(null);setForm(emptyBlog);setPreview(false);};

  const save=async()=>{
    if(!form.title||!form.excerpt||!form.cover||!form.content_html)return toast.error("Title, excerpt, cover and content are required");
    setSaving(true);
    try{
      editing==="new"?await api.post("/blog",form):await api.patch(`/blog/${editing._id}`,form);
      toast.success(editing==="new"?`"${form.title}" published`:`"${form.title}" updated`);
      await load();cancel();
    }catch(err){toast.error(formatApiError(err.response?.data?.detail)||"Failed");}
    finally{setSaving(false);}
  };
  const remove=async p=>{
    if(!window.confirm(`Delete "${p.title}"?`))return;
    try{await api.delete(`/blog/${p._id}`);toast.success("Deleted");load();}
    catch(err){toast.error(formatApiError(err.response?.data?.detail));}
  };

  if(editing) return(
    <div className="mt-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-brand-text font-semibold">{editing==="new"?"New Post":`Edit: ${editing.title}`}</h2>
        <div className="flex gap-2">
          <button onClick={()=>setPreview(!preview)} className="btn-secondary !py-2 !px-4 text-xs"><Eye size={14}/>{preview?"Hide":"Preview"}</button>
          <button onClick={cancel} className="btn-secondary !py-2 !px-4 text-xs"><X size={14}/>Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary !py-2 !px-4 text-xs">{saving?<><Loader2 size={14} className="animate-spin"/>Saving…</>:<><Save size={14}/>{editing==="new"?"Publish":"Save"}</>}</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-brand-primary/10 p-6 lg:p-8 grid md:grid-cols-2 gap-5">
        <Field label="Title *" full><input className="m-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></Field>
        <Field label="Slug (auto from title)"><input className="m-input" value={form.slug} placeholder="auto" onChange={e=>setForm({...form,slug:e.target.value})}/></Field>
        <Field label="Category">
          <select className="m-input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
            {CATS.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Read Time"><input className="m-input" value={form.read_time} placeholder="5 min read" onChange={e=>setForm({...form,read_time:e.target.value})}/></Field>
        <Field label="Cover Image URL *" full>
          <input className="m-input" value={form.cover} placeholder="https://images.unsplash.com/…" onChange={e=>setForm({...form,cover:e.target.value})}/>
          {form.cover&&<img src={form.cover} alt="preview" className="mt-3 w-full max-w-sm aspect-video object-cover rounded-xl border border-brand-primary/10"/>}
        </Field>
        <Field label="Excerpt *" full><textarea rows={2} className="m-input resize-none" value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})}/></Field>
        <Field label="Content HTML *" full>
          <textarea rows={14} className="m-input resize-y font-mono text-xs" value={form.content_html} onChange={e=>setForm({...form,content_html:e.target.value})} placeholder="<h2>Heading</h2><p>Content…</p>"/>
        </Field>
      </div>
      {preview&&form.content_html&&(
        <div className="bg-white rounded-2xl border border-brand-primary/10 p-8">
          <h3 className="font-serif text-3xl text-brand-text font-medium">{form.title}</h3>
          {form.cover&&<img src={form.cover} alt="" className="mt-5 w-full aspect-video object-cover rounded-2xl"/>}
          <div className="prose-content mt-6" dangerouslySetInnerHTML={{__html:form.content_html}}/>
          <style>{`.prose-content h2{font-family:'Cormorant Garamond',serif;font-size:1.5rem;color:#1B2421;margin:1.5rem 0 .75rem;font-weight:600}.prose-content p{margin-bottom:.75rem;color:#51625D;font-size:.95rem;line-height:1.65}`}</style>
        </div>
      )}
      <MInputStyles/>
    </div>
  );

  return(
    <div className="mt-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-brand-textSecondary">{posts.length} posts published</p>
        <button onClick={startNew} className="btn-primary !py-2 !px-5 text-xs"><Plus size={14}/>New Post</button>
      </div>
      <div className="bg-white rounded-2xl border border-brand-primary/10 overflow-hidden">
        {loading?<div className="p-12 text-center text-brand-textMuted"><Loader2 size={20} className="animate-spin inline mr-2"/>Loading…</div>
        :posts.length===0?<div className="p-12 text-center text-brand-textMuted">No posts yet.</div>
        :<ul className="divide-y divide-brand-primary/5">
          {posts.map(p=>(
            <li key={p._id} className="p-5 flex items-center gap-5">
              <img src={p.cover} alt="" className="w-24 h-16 object-cover rounded-lg shrink-0" onError={e=>{e.target.style.background="#E8F4F4";e.target.src="";}}/>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-primary font-semibold">{p.category}</span>
                <div className="font-serif text-lg text-brand-text font-semibold truncate">{p.title}</div>
                <div className="text-xs text-brand-textMuted mt-0.5">/{p.slug}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-brand-textSecondary hover:bg-brand-subtle"><Eye size={15}/></a>
                <button onClick={()=>startEdit(p)} className="p-2 rounded-lg text-sky-600 hover:bg-sky-50"><Pencil size={15}/></button>
                <button onClick={()=>remove(p)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"><Trash2 size={15}/></button>
              </div>
            </li>
          ))}
        </ul>}
      </div>
    </div>
  );
}
