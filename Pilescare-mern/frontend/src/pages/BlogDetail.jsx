import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import api from "../lib/api";

gsap.registerPlugin(ScrollTrigger);

export default function BlogDetail() {
  const { slug } = useParams();
  const rootRef = useRef(null);
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    setPost(null); setError(false);
    api.get(`/blog/${slug}`)
      .then(({ data }) => {
        setPost(data);
        // fetch related posts
        api.get("/blog").then(({ data: all }) => {
          setRelated(all.filter(p => p.slug !== slug && p.category === data.category).slice(0, 3));
        }).catch(() => {});
      })
      .catch(() => setError(true));
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const ctx = gsap.context(() => {
      gsap.from(".bd-eyebrow",  { y: 20, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.1 });
      gsap.from(".bd-title",    { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.2 });
      gsap.from(".bd-cover",    { scale: 1.04, opacity: 0, duration: 1.1, ease: "power3.out", delay: 0.35 });
      gsap.from(".bd-body",     { y: 30, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.5 });
      gsap.from(".bd-related",  {
        y: 40, opacity: 0, duration: 0.75, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: ".bd-related-sec", start: "top 80%", once: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [post]);

  if (error) return (
    <div className="container-page py-28 text-center">
      <h1 className="font-serif text-3xl text-brand-text">Article not found</h1>
      <Link to="/blog" className="btn-primary mt-6">← Back to Journal</Link>
    </div>
  );

  if (!post) return (
    <div className="container-page py-28 flex justify-center">
      <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <article ref={rootRef} className="container-page py-16 lg:py-24 max-w-3xl" data-testid="blog-detail">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-brand-primary hover:underline mb-10">
        <ArrowLeft size={14} /> All articles
      </Link>

      <div className="bd-eyebrow flex items-center gap-3 mb-4">
        <span className="label-eyebrow">{post.category}</span>
        <span className="text-brand-textMuted text-xs">·</span>
        <span className="flex items-center gap-1 text-xs text-brand-textMuted"><Clock size={11} /> {post.read_time}</span>
      </div>

      <h1 className="bd-title font-serif text-4xl lg:text-6xl text-brand-text font-medium tracking-tight leading-[1.05]">
        {post.title}
      </h1>
      <p className="mt-5 text-lg text-brand-textSecondary leading-relaxed">{post.excerpt}</p>

      <div className="bd-cover aspect-[16/9] rounded-3xl overflow-hidden my-10 bg-brand-subtle">
        <img src={post.cover} alt={post.title} className="w-full h-full object-cover"
          onError={e => { e.target.style.background = "linear-gradient(135deg,#E8F4F4,#1A5B5E33)"; e.target.src = ""; }} />
      </div>

      <div className="bd-body prose-content text-brand-text leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content_html }} />

      {/* CTA block */}
      <div className="mt-16 p-8 lg:p-10 bg-brand-dark rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-white" />
        </div>
        <div className="relative z-10">
          <h3 className="font-serif text-2xl text-white font-semibold">Have questions about your symptoms?</h3>
          <p className="text-white/55 mt-2 text-sm leading-relaxed">
            A 15-minute private consultation is often enough to get complete clarity.
          </p>
          <Link to="/book" className="btn-primary mt-6 shadow-lg">Book a Consultation <ArrowRight size={13} /></Link>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="bd-related-sec mt-20">
          <h3 className="font-serif text-2xl text-brand-text font-semibold mb-8">More from {post.category}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map(p => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="bd-related group block">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-brand-subtle mb-4">
                  <img src={p.cover} alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={e => { e.target.style.background="#E8F4F4"; e.target.src=""; }} />
                </div>
                <h4 className="font-serif text-base font-semibold text-brand-text group-hover:text-brand-primary transition-colors leading-snug">{p.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .prose-content h2{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.75rem;color:#1B2421;margin:2rem 0 1rem;font-weight:600}
        .prose-content p{margin-bottom:1rem;color:#51625D;font-size:1rem;line-height:1.75}
        .prose-content ol,.prose-content ul{margin:1rem 0 1.5rem 1.5rem}
        .prose-content li{margin-bottom:.5rem;color:#51625D}
        .prose-content b{color:#1B2421}
        .prose-content a{color:#1A5B5E;text-decoration:underline}
      `}</style>
    </article>
  );
}
