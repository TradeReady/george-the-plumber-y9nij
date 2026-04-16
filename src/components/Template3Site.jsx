import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, CheckCircle2, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function Template3Site({ site, imagePack }) {
  const gc = site.generated_content || {};
  const primary = gc.primary_color || '#2d6a4f';
  const bg = gc.background_color || '#f9f6f0';
  const textColor = gc.text_color || '#1a2e1f';
  const buttonRadius = gc.button_radius || '8px';
  const businessName = site.business_name || 'Business';
  const heroImg = (site.hero_image_url && site.hero_image_url !== 'none' ? site.hero_image_url : null) || imagePack?.hero_image_url || 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80&auto=format&fit=crop';
  const bannerImg = imagePack?.banner_image_url || 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=1400&q=80&auto=format&fit=crop';
  const logoUrl = site.logo_url || '';
  const services = (gc.services || []).slice(0, 6);
  const testimonials = (gc.testimonials || []).slice(0, 3);
  const benefits = (gc.benefits || []).slice(0, 4);
  const [open, setOpen] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', email:'', message:'' });
  const [submitted, setSubmitted] = useState(false);

  function CountUp({ value, duration = 2000 }) {
    const ref = useRef(null);
    const [display, setDisplay] = useState('0');
    const rafRef = useRef(null);
    const observerRef = useRef(null);
    useEffect(() => {
      const str = String(value);
      const match = str.match(/^([^0-9]*)(d+\.?d*)([^0-9]*)$/);
      if (!match) { setDisplay(str); return; }
      const prefix = match[1], num = parseFloat(match[2]), suffix = match[3];
      const isFloat = match[2].includes('.');
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setDisplay(`${prefix}0${suffix}`);
      const easeOut = t => 1 - Math.pow(1 - t, 3);
      const startAnimation = () => {
        const startTime = performance.now();
        const tick = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = num * easeOut(progress);
          if (progress < 1) {
            setDisplay(`${prefix}${isFloat ? current.toFixed(1) : Math.floor(current)}${suffix}`);
            rafRef.current = requestAnimationFrame(tick);
          } else {
            setDisplay(`${prefix}${isFloat ? num.toFixed(1) : Math.round(num)}${suffix}`);
          }
        };
        rafRef.current = requestAnimationFrame(tick);
      };
      if (observerRef.current) observerRef.current.disconnect();
      const el = ref.current;
      if (!el) return;
      observerRef.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { observerRef.current.disconnect(); startAnimation(); }
      }, { threshold: 0.2 });
      observerRef.current.observe(el);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (observerRef.current) observerRef.current.disconnect();
      };
    }, [value, duration]);
    return <span ref={ref}>{display}</span>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try { await fetch(`https://api.base44.com/api/apps/${site.app_id||''}/functions/submitPublicLead`,{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...form,website_id:site.id}) }); } catch(_) {}
  };

  return (
    <div style={{ fontFamily:'system-ui,sans-serif', backgroundColor:bg, color:textColor }}>
      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, backgroundColor:textColor, height:56, display:'flex', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%' }}>
          {logoUrl ? <img src={logoUrl} alt={businessName} style={{ height:32, objectFit:'contain' }} /> : <span style={{ fontWeight:900, color:'#fff', fontSize:'1.15rem' }}>{businessName}</span>}
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            {[['Services','#services'],['About','#about'],['Reviews','#testimonials'],['Contact','#contact']].map(([l,h])=>(
              <a key={h} href={h} style={{ padding:'8px 16px', fontSize:'0.875rem', fontWeight:600, color:'rgba(255,255,255,0.6)' }}>{l}</a>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {gc.phone && <a href={`tel:${gc.phone}`} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', fontSize:'0.875rem', fontWeight:900, color:'#fff', backgroundColor:primary, borderRadius:buttonRadius }}><Phone size={14} /> Call Now</a>}
            <a href="#contact" style={{ padding:'8px 20px', fontSize:'0.875rem', fontWeight:900, color:'rgba(255,255,255,0.8)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:buttonRadius }}>Free Quote →</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ display:'flex', flexDirection:'row', minHeight:420, paddingTop:56, backgroundColor:bg }}>
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'48px 64px' }}>
          <div>
            {gc.tagline && <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:'#6b7280', marginBottom:20 }}>{gc.tagline}</motion.p>}
            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} style={{ fontSize:'clamp(2rem,5vw,3.2rem)', fontWeight:900, color:'#111827', lineHeight:1.05, letterSpacing:'-0.02em', marginBottom:20 }}>{gc.headline||businessName}</motion.h1>
            <motion.p initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={{ fontSize:'1rem', color:'#6b7280', lineHeight:1.6, maxWidth:380, marginBottom:32 }}>{gc.subheadline}</motion.p>
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <a href="#contact" style={{ display:'inline-flex', alignItems:'center', padding:'12px 24px', backgroundColor:primary, color:'#fff', fontSize:'0.875rem', fontWeight:700, borderRadius:buttonRadius }}>{gc.cta_text||'Get a Free Quote'}</a>
              {gc.phone && <a href={`tel:${gc.phone}`} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 24px', backgroundColor:'#fff', color:'#1f2937', border:'2px solid #ccc', fontSize:'0.875rem', fontWeight:700, borderRadius:buttonRadius }}><Phone size={16} /> Call Now</a>}
            </motion.div>
          </div>
          <div style={{ display:'flex', gap:40, paddingTop:32, borderTop:'1px solid #d1d5db', marginTop:40 }}>
            {[{ n: gc.years_in_business ? gc.years_in_business+'+' : '10+', l:'Years' },{ n:gc.rating||'4.9', l:'Star Rating' },{ n:gc.review_count ? gc.review_count+'+' : '50+', l:'Reviews' }].map((s,i)=>(
              <div key={i}>
                <div style={{ fontSize:'1.5rem', fontWeight:900, color:'#111827', letterSpacing:'-0.02em' }}><CountUp value={s.n} /></div>
                <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#9ca3af', marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position:'relative', width:'45%' }}>
          <img src={heroImg} alt={businessName} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', top:0, left:0, bottom:0, width:6, backgroundColor:primary }} />
          <div style={{ position:'absolute', bottom:0, left:6, right:0, padding:20, background:'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
            <div style={{ color:'#fff', fontWeight:700, fontSize:'0.9rem' }}>{businessName}</div>
            {gc.address && <div style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.8rem', marginTop:2 }}>{gc.address}</div>}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ backgroundColor:bg }}>
        <div style={{ backgroundColor:'#fff', borderBottom:'1px solid #e5e7eb', padding:'20px 64px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={{ fontSize:'1.5rem', fontWeight:900, color:'#111827', textTransform:'uppercase', letterSpacing:'-0.01em' }}>Our Services</h2>
          <a href="#contact" style={{ fontSize:'0.75rem', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', color:primary }}>Book Any Service →</a>
        </div>
        <div style={{ borderTop:'1px solid #e5e7eb' }}>
          <AnimatePresence>
            {(showAllServices ? services : services.slice(0,3)).map((svc, i) => {
              const uploadedImg = site.service_image_urls?.[i];
              const imgUrl = (uploadedImg && uploadedImg !== 'none') ? uploadedImg : imagePack?.service_image_urls?.[i];
              return (
                <motion.div key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} viewport={{ once:true }} transition={{ delay:i*0.05 }}
                  style={{ display:'flex', alignItems:'center', backgroundColor:'#fff', borderBottom:'1px solid #e5e7eb', cursor:'pointer', transition:'background-color 0.3s' }}
                  onMouseEnter={e=>e.currentTarget.style.backgroundColor=primary}
                  onMouseLeave={e=>e.currentTarget.style.backgroundColor='#fff'}>
                  <div style={{ width:96, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 0', borderRight:'1px solid #f3f4f6' }}>
                    <span style={{ fontSize:'2rem', fontWeight:900, color:'#e5e7eb', letterSpacing:'-0.04em' }}>{String(i+1).padStart(2,'0')}</span>
                  </div>
                  <div style={{ flex:1, padding:32 }}>
                    <h3 style={{ fontSize:'1.1rem', fontWeight:900, color:'#111827', margin:'0 0 6px' }}>{svc.title}</h3>
                    <p style={{ fontSize:'0.875rem', color:'#6b7280', margin:0, lineHeight:1.6, maxWidth:480 }}>{svc.description}</p>
                  </div>
                  {imgUrl && <div style={{ width:128, flexShrink:0, overflow:'hidden' }}><img src={imgUrl} alt={svc.title} style={{ width:128, height:96, objectFit:'cover' }} /></div>}
                  <div style={{ width:64, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:'1.25rem', color:'#d1d5db' }}>→</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        {services.length > 3 && (
          <div style={{ textAlign:'center', padding:'32px 0', backgroundColor:'#fff', borderTop:'1px solid #e5e7eb' }}>
            <button onClick={() => setShowAllServices(v => !v)}
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 28px', borderRadius:9999, border:`2px solid ${primary}`, backgroundColor:'transparent', color:primary, fontWeight:700, fontSize:'0.875rem', cursor:'pointer' }}>
              {showAllServices
                ? <><ChevronUp size={16} />Show Less</>
                : <><ChevronDown size={16} />See All Services</>}
            </button>
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section id="about" style={{ backgroundColor:bg }}>
        <div style={{ display:'flex', flexDirection:'row', minHeight:500 }}>
          <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} style={{ width:'40%', display:'flex', flexDirection:'column', justifyContent:'center', padding:'64px', backgroundColor:primary }}>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.7rem', fontWeight:900, letterSpacing:'0.3em', textTransform:'uppercase', marginBottom:24 }}>About Us</div>
            <h2 style={{ fontSize:'clamp(1.8rem,3vw,3rem)', fontWeight:900, color:'#fff', lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:32 }}>Built on trust.<br />Backed by results.</h2>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'1rem', lineHeight:1.7 }}>{gc.about_text}</p>
          </motion.div>
          <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} style={{ flex:1, display:'flex', flexDirection:'column', divideY:'1px solid #f3f4f6' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:24, padding:'40px 64px', borderBottom:'1px solid #f3f4f6' }}>
                <CheckCircle2 size={24} style={{ flexShrink:0, marginTop:2, color:primary }} />
                <p style={{ color:'#1f2937', fontWeight:600, fontSize:'1rem', lineHeight:1.6 }}>{b}</p>
              </div>
            ))}
            <div style={{ padding:'40px 64px' }}>
              <a href="#contact" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'16px 32px', backgroundColor:primary, color:'#fff', fontSize:'0.875rem', fontWeight:900 }}>Work With Us →</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ backgroundColor:bg }}>
        <div style={{ backgroundColor:'#fff', borderBottom:'1px solid #e5e7eb', padding:'20px 64px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={{ fontSize:'1.5rem', fontWeight:900, color:'#111827', textTransform:'uppercase', letterSpacing:'-0.01em' }}>Customer Reviews</h2>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ display:'flex', gap:2 }}>
              {Array.from({length:5}).map((_,i)=><div key={i} style={{ width:10, height:10, borderRadius:'50%', backgroundColor: i<4 ? primary : `${primary}40` }} />)}
            </div>
            <span style={{ fontSize:'0.875rem', fontWeight:900, color:'#374151' }}>{gc.rating||'4.9'}/5</span>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', borderTop:'1px solid #e5e7eb' }}>
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7, delay:i*0.12, ease:[0.2,0.8,0.2,1] }}
              style={{ padding:'40px 64px', backgroundColor:bg, borderRight: i<2 ? '1px solid #e5e7eb' : 'none' }}>
              <div style={{ fontSize:'7rem', fontWeight:900, lineHeight:1, marginBottom:16, color:`${primary}20` }}>"</div>
              <p style={{ color:'#374151', fontSize:'1rem', lineHeight:1.7, marginBottom:28, fontStyle:'italic' }}>"{t.text}"</p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid #f3f4f6', paddingTop:20 }}>
                <div>
                  <div style={{ fontWeight:900, color:'#111827', fontSize:'0.875rem' }}>{t.name}</div>
                  <div style={{ fontSize:'0.75rem', color:'#9ca3af', marginTop:2 }}>Verified Customer</div>
                </div>
                <div style={{ fontSize:'1.25rem', fontWeight:900, color:primary }}>{t.rating||5}.0</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position:'relative', minHeight:256, display:'flex', alignItems:'center', overflow:'hidden' }}>
        <img src={bannerImg} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, backgroundColor:textColor, opacity:0.88 }} />
        <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:1280, margin:'0 auto', padding:'80px 64px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:40, flexWrap:'wrap' }}>
          <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
            <div style={{ marginBottom:16, fontSize:'0.7rem', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.3em', color:'#fff' }}>Don't Wait</div>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, color:'#fff', lineHeight:1.05, letterSpacing:'-0.03em' }}>Need Help Today?<br />We're Ready.</h2>
          </motion.div>
          <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <a href="#contact" style={{ display:'inline-flex', alignItems:'center', padding:'16px 32px', backgroundColor:'#fff', color:primary, fontSize:'0.875rem', fontWeight:900, borderRadius:buttonRadius, whiteSpace:'nowrap' }}>{gc.cta_text||'GET A FREE QUOTE'} →</a>
            {gc.phone && <a href={`tel:${gc.phone}`} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'16px 32px', color:'#fff', border:'2px solid rgba(255,255,255,0.3)', fontSize:'0.875rem', fontWeight:900, borderRadius:buttonRadius, whiteSpace:'nowrap' }}><Phone size={16} /> {gc.phone}</a>}
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ display:'flex', flexDirection:'row', minHeight:600 }}>
        <motion.div initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} style={{ width:'40%', backgroundColor:'#030712', padding:'64px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:'0.7rem', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.3em', color:primary, marginBottom:24 }}>Contact</div>
            <h2 style={{ fontSize:'2.5rem', fontWeight:900, color:'#fff', lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:24 }}>Get Your<br />Free Quote</h2>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.875rem', lineHeight:1.6, marginBottom:48 }}>Fill in the form and we'll respond within the hour. No obligation, no hard sell.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              {[gc.phone&&{Icon:Phone,label:'Phone',val:gc.phone,href:`tel:${gc.phone}`},gc.email&&{Icon:Mail,label:'Email',val:gc.email,href:`mailto:${gc.email}`},gc.address&&{Icon:MapPin,label:'Location',val:gc.address,href:null}].filter(Boolean).map((c,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{ width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:`${primary}20`, color:primary }}><c.Icon size={16} /></div>
                  <div>
                    <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:700, marginBottom:2 }}>{c.label}</div>
                    <div style={{ fontWeight:900, color:'#fff', fontSize:'0.9rem' }}>{c.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} style={{ flex:1, backgroundColor:'#fff', padding:'64px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          {submitted ? (
            <div style={{ textAlign:'center', padding:64 }}>
              <div style={{ fontSize:'4rem', fontWeight:900, color:primary, marginBottom:16 }}>✓</div>
              <h3 style={{ fontSize:'1.5rem', fontWeight:900, color:'#111827', marginBottom:8 }}>Message Received!</h3>
              <p style={{ color:'#9ca3af', fontSize:'0.875rem' }}>We'll be in touch within the hour.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:24 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
                {[['name','Full Name','text',true],['phone','Phone Number','tel',true]].map(([k,l,t,req])=>(
                  <div key={k}>
                    <label style={{ display:'block', fontSize:'0.7rem', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', color:'#9ca3af', marginBottom:8 }}>{l}</label>
                    <input type={t} required={req} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={`Enter your ${l.toLowerCase()}`}
                      style={{ width:'100%', padding:'12px 0', border:0, borderBottom:'2px solid #e5e7eb', fontSize:'0.875rem', fontWeight:600, color:'#111827', backgroundColor:'transparent', fontFamily:'inherit', outline:'none' }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ display:'block', fontSize:'0.7rem', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', color:'#9ca3af', marginBottom:8 }}>Email Address</label>
                <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com"
                  style={{ width:'100%', padding:'12px 0', border:0, borderBottom:'2px solid #e5e7eb', fontSize:'0.875rem', fontWeight:600, color:'#111827', backgroundColor:'transparent', fontFamily:'inherit', outline:'none' }} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:'0.7rem', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', color:'#9ca3af', marginBottom:8 }}>Tell Us About Your Job</label>
                <textarea rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Describe the problem or job..."
                  style={{ width:'100%', padding:'12px 0', border:0, borderBottom:'2px solid #e5e7eb', fontSize:'0.875rem', fontWeight:600, color:'#111827', backgroundColor:'transparent', fontFamily:'inherit', outline:'none', resize:'none' }} />
              </div>
              <button type="submit" style={{ width:'100%', padding:16, backgroundColor:primary, color:'#fff', fontSize:'0.875rem', fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', border:'none', borderRadius:buttonRadius, cursor:'pointer' }}>Send Message →</button>
            </form>
          )}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor:'#fff', borderTop:`4px solid ${primary}`, padding:'48px 64px' }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:48, justifyContent:'space-between', marginBottom:40 }}>
          <div style={{ maxWidth:280 }}>
            <span style={{ fontWeight:900, color:'#111827', fontSize:'1.25rem', display:'block', marginBottom:12 }}>{businessName}</span>
            <p style={{ color:'#9ca3af', fontSize:'0.875rem', lineHeight:1.6 }}>{gc.tagline}</p>
          </div>
          <div>
            <h4 style={{ fontWeight:900, color:'#111827', fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:20 }}>Services</h4>
            <ul style={{ listStyle:'none', margin:0, padding:0 }}>
              {(gc.services||[]).slice(0,5).map((s,i)=><li key={i} style={{ marginBottom:10 }}><a href="#services" style={{ color:'#9ca3af', fontSize:'0.875rem' }}>{s.title}</a></li>)}
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight:900, color:'#111827', fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:20 }}>Get In Touch</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {gc.phone && <a href={`tel:${gc.phone}`} style={{ display:'flex', alignItems:'center', gap:8, color:'#9ca3af', fontSize:'0.875rem' }}><Phone size={14} style={{ color:primary }} /> {gc.phone}</a>}
              {gc.email && <a href={`mailto:${gc.email}`} style={{ display:'flex', alignItems:'center', gap:8, color:'#9ca3af', fontSize:'0.875rem' }}><Mail size={14} style={{ color:primary }} /> {gc.email}</a>}
              {gc.address && <div style={{ display:'flex', alignItems:'start', gap:8, color:'#9ca3af', fontSize:'0.875rem' }}><MapPin size={14} style={{ color:primary, flexShrink:0 }} /> {gc.address}</div>}
            </div>
          </div>
        </div>
        <div style={{ borderTop:'1px solid #f3f4f6', paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <p style={{ color:'#d1d5db', fontSize:'0.75rem' }}>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          <a href="#contact" style={{ fontSize:'0.75rem', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', color:primary }}>Free Quote →</a>
        </div>
      </footer>
    </div>
  );
}
