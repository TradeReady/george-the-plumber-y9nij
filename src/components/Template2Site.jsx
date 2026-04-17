import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowRight, CheckCircle, Star, Quote, Award, Users, Clock, ChevronRight, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';

export default function Template2Site({ site, imagePack }) {
  const gc = site.generated_content || {};
  const primary = gc.primary_color || '#0ea5e9';
  const bg = gc.background_color || '#f8f9fa';
  const textColor = gc.text_color || '#0f172a';
  const buttonRadius = gc.button_radius || '9999px';
  const businessName = site.business_name || 'Business';
  const heroImage = (site.hero_image_url && site.hero_image_url !== 'none' ? site.hero_image_url : null) || imagePack?.hero_image_url || 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=900&q=80&auto=format&fit=crop';
  const logoUrl = site.logo_url || '';
  const services = gc.services || [];
  const testimonials = gc.testimonials || [];
  const benefits = gc.benefits || [];
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', email:'', message:'' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function CountUp({ value, duration = 2000 }) {
    const ref = useRef(null);
    const [display, setDisplay] = useState('0');
    const rafRef = useRef(null);
    const observerRef = useRef(null);
    useEffect(() => {
      const str = String(value);
      const match = str.match(/^([^0-9]*)(d+.?d*)([^0-9]*)$/);
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
    if (window.gtag) window.gtag('event','form_submission',{event_category:'conversion',event_label:'contact_form',business_name:businessName});
    try { await fetch(`https://api.base44.com/api/apps/${site.app_id||''}/functions/submitPublicLead`,{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...form,website_id:site.id}) }); } catch(_) {}
  };

  const navLinks = [['Services','#services'],['About','#about'],['Reviews','#testimonials'],['Contact','#contact']];

  return (
    <div style={{ fontFamily:'system-ui,sans-serif', backgroundColor:'#fafafa', color:textColor }}>
      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'#fff', borderBottom:'1px solid #f3f4f6', boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', height:64 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {logoUrl ? <img src={logoUrl} alt={businessName} style={{ height:36, objectFit:'contain' }} /> : <>
              <div style={{ width:32, height:32, borderRadius:8, background:primary, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700 }}>{businessName.charAt(0)}</div>
              <span style={{ fontWeight:700, color:'#111827' }}>{businessName}</span>
            </>}
          </div>
          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display:'flex', alignItems:'center', gap:32 }}>
              {navLinks.map(([l,h])=><a key={h} href={h} style={{ fontSize:'0.875rem', fontWeight:500, color:'#4b5563', textDecoration:'none' }}>{l}</a>)}
            </div>
          )}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {!isMobile && gc.phone && <a href={`tel:${gc.phone}`} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 20px', background:primary, color:'#fff', fontSize:'0.875rem', fontWeight:600, borderRadius:buttonRadius, textDecoration:'none' }}><Phone size={14} /> Call Now</a>}
            {!isMobile && <a href="#contact" style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'8px 20px', border:`1.5px solid ${primary}`, color:primary, fontSize:'0.875rem', fontWeight:600, borderRadius:buttonRadius, textDecoration:'none' }}>{gc.cta_text||'Get a Quote'} <ChevronRight size={14} /></a>}
            {/* Mobile Call Now + Hamburger */}
            {isMobile && gc.phone && (
              <a href={`tel:${gc.phone}`} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'7px 14px', background:primary, color:'#fff', fontSize:'0.8rem', fontWeight:600, borderRadius:buttonRadius, textDecoration:'none' }}><Phone size={12} /> Call Now</a>
            )}
            {isMobile && (
              <button onClick={() => setMenuOpen(v => !v)} style={{ background:'none', border:'none', cursor:'pointer', padding:8, display:'flex', alignItems:'center', color:'#374151' }}>
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>
        {/* Mobile dropdown */}
        {isMobile && menuOpen && (
          <div style={{ backgroundColor:'#fff', borderTop:'1px solid #f3f4f6', padding:'16px 24px', display:'flex', flexDirection:'column', gap:4 }}>
            {navLinks.map(([l,h]) => (
              <a key={h} href={h} onClick={() => setMenuOpen(false)}
                style={{ fontSize:'1rem', color:'#374151', textDecoration:'none', padding:'12px 0', borderBottom:'1px solid #f3f4f6', fontWeight:500 }}>{l}</a>
            ))}
            <div style={{ paddingTop:12, display:'flex', flexDirection:'column', gap:8 }}>
              {gc.phone && <a href={`tel:${gc.phone}`} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'12px', background:primary, color:'#fff', fontSize:'0.875rem', fontWeight:600, borderRadius:buttonRadius, textDecoration:'none' }}><Phone size={14} /> Call Now</a>}
              <a href="#contact" onClick={() => setMenuOpen(false)} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4, padding:'12px', border:`1.5px solid ${primary}`, color:primary, fontSize:'0.875rem', fontWeight:600, borderRadius:buttonRadius, textDecoration:'none' }}>{gc.cta_text||'Get a Quote'}</a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ paddingTop:64, minHeight:'100vh', display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', background:'#fafafa' }}>
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding: isMobile ? '60px 20px 40px' : '80px 64px' }}>
          {gc.tagline && (
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:24 }}>
              <div style={{ width:24, height:2, background:primary }} />
              <span style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:primary }}>{gc.tagline}</span>
            </motion.div>
          )}
          <motion.h1 initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8, delay:0.1, ease:[0.2,0.8,0.2,1] }} style={{ fontSize:'clamp(2rem,4vw,3.5rem)', fontWeight:800, color:textColor, lineHeight:1.1, marginBottom:24 }}>{gc.headline||businessName}</motion.h1>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }} style={{ fontSize:'1rem', color:'#6b7280', lineHeight:1.6, maxWidth:420, marginBottom:32 }}>{gc.subheadline}</motion.p>
          {benefits.slice(0,3).length > 0 && (
            <ul style={{ listStyle:'none', margin:'0 0 32px', padding:0 }}>
              {benefits.slice(0,3).map((b,i)=><li key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.875rem', color:'#374151', marginBottom:8 }}><span style={{ color:primary }}>✓</span>{b}</li>)}
            </ul>
          )}
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }} style={{ display:'flex', flexDirection: isMobile ? 'column' : 'row', gap:12, width: isMobile ? '100%' : 'auto' }}>
            <a href="#contact" style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, padding:'12px 24px', background:primary, color:'#fff', fontSize:'0.875rem', fontWeight:600, borderRadius:buttonRadius, width: isMobile ? '100%' : 'auto' }}>{gc.cta_text||'Get a Free Quote'} <ArrowRight size={14} /></a>
            {gc.phone && <a href={`tel:${gc.phone}`} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, padding:'12px 24px', border:`1.5px solid ${primary}`, color:primary, fontSize:'0.875rem', fontWeight:600, borderRadius:buttonRadius, width: isMobile ? '100%' : 'auto' }}><Phone size={14} /> Call Us</a>}
          </motion.div>
          {gc.rating && (
            <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:32 }}>
              <div style={{ display:'flex' }}>
                {['https://i.pravatar.cc/32?img=1','https://i.pravatar.cc/32?img=2','https://i.pravatar.cc/32?img=3'].map((src,i)=>(
                  <img key={i} src={src} alt="" style={{ width:32, height:32, borderRadius:'50%', border:'2px solid #fff', objectFit:'cover', marginLeft:i?-8:0 }} />
                ))}
              </div>
              <div>
                <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#111827' }}>{gc.rating}/5 Rating</div>
                <div style={{ fontSize:'0.75rem', color:'#9ca3af' }}>{gc.review_count||'200'}+ happy customers</div>
              </div>
            </div>
          )}
        </div>
        {!isMobile && <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ position:'relative' }}>
          <img src={heroImage} alt={businessName} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', bottom:32, left:32, right:32, background:'#fff', borderRadius:16, padding:20, boxShadow:'0 10px 40px rgba(0,0,0,0.12)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:'0.75rem', color:'#9ca3af', textTransform:'uppercase', marginBottom:4 }}>Available Now</div>
                <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#111827' }}>Fast Response Guaranteed</div>
              </div>
              <div style={{ width:40, height:40, borderRadius:'50%', background:primary, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}><Phone size={16} /></div>
            </div>
          </div>
        </motion.div>}
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: isMobile ? '60px 0' : '96px 0', background:'#fff' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:56 }}>
            <div>
              <span style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:primary, display:'block', marginBottom:8 }}>What We Do</span>
              <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.5rem)', fontWeight:800, color:'#111827' }}>Our Services</h2>
            </div>
            <a href="#contact" style={{ color:primary, fontSize:'0.875rem', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>View all <ArrowRight size={14} /></a>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
            <AnimatePresence>
              {(showAllServices ? services : services.slice(0,3)).map((svc,i)=>{
                const img=(site.service_image_urls||[])[i]||(imagePack?.service_image_urls||[])[i];
                return (
                  <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }} viewport={{ once:true }} transition={{ duration:0.7, delay:i*0.1, ease:[0.2,0.8,0.2,1] }}
                    style={{ background:'#f9fafb', borderRadius:20, padding:24, position:'relative', overflow:'hidden' }}>
                    {img ? <div style={{ height:200, borderRadius:16, overflow:'hidden', marginBottom:16 }}><img src={img} alt={svc.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} /></div>
                      : <div style={{ width:48, height:48, borderRadius:12, background:primary, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, color:'#fff' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                        </div>}
                    <h3 style={{ fontWeight:700, color:'#111827', marginBottom:8 }}>{svc.title}</h3>
                    <p style={{ fontSize:'0.875rem', color:'#6b7280', lineHeight:1.6 }}>{svc.description}</p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          {services.length > 3 && (
            <div style={{ textAlign:'center', marginTop:40 }}>
              <button onClick={() => { setShowAllServices(v => !v); if(window.gtag)window.gtag('event','view_all_services',{event_category:'engagement',event_label:'services_expand',business_name:businessName}); }}
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 28px', borderRadius:9999, border:`2px solid ${primary}`, backgroundColor:'transparent', color:primary, fontWeight:600, fontSize:'0.875rem', cursor:'pointer' }}>
                {showAllServices ? <><ChevronUp size={16} />Show Less</> : <><ChevronDown size={16} />See All Services</>}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: isMobile ? '60px 0' : '96px 0', background:bg }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 64, alignItems:'center' }}>
            <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:32 }}>
                {[{Icon:Award,val:gc.years_in_business ? gc.years_in_business+'+' : '10+',sub:'Experience'},{Icon:Users,val:(gc.review_count||'500')+'+',sub:'Happy Clients'},{Icon:Clock,val:'<1hr',sub:'Response'}].map(({Icon,val,sub},i)=>(
                  <div key={i} style={{ textAlign:'center', padding:20, background:'#fff', borderRadius:16, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
                    <Icon size={20} style={{ color:primary, margin:'0 auto 8px' }} />
                    <div style={{ fontSize:'1.5rem', fontWeight:800, color:'#111827' }}><CountUp value={val} /></div>
                    <div style={{ fontSize:'0.75rem', color:'#9ca3af', marginTop:2 }}>{sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'#fff', borderRadius:16, padding:24, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
                <p style={{ color:'#4b5563', lineHeight:1.7 }}>{gc.about_text}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
              <span style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:primary, display:'block', marginBottom:8 }}>Why Choose Us</span>
              <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.5rem)', fontWeight:800, color:'#111827', marginBottom:32 }}>The Experts You Can Trust</h2>
              {benefits.map((b,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:16, background:'#fff', borderRadius:12, border:'1px solid #f3f4f6', marginBottom:12 }}>
                  <div style={{ width:24, height:24, borderRadius:'50%', background:`${primary}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:primary }}>✓</div>
                  <span style={{ fontSize:'0.875rem', fontWeight:500, color:'#374151' }}>{b}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ padding:'96px 0', background:'#fff' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <span style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:primary, display:'block', marginBottom:8 }}>Client Stories</span>
            <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.5rem)', fontWeight:800, color:'#111827' }}>What Our Clients Say</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
            {testimonials.map((t,i)=>(
              <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7, delay:i*0.12, ease:[0.2,0.8,0.2,1] }}
                style={{ background:'#f9fafb', borderRadius:20, padding:24, border:'1px solid #f3f4f6' }}>
                <Quote size={32} style={{ color:primary, opacity:0.2, marginBottom:16 }} />
                <p style={{ fontSize:'0.875rem', color:'#4b5563', lineHeight:1.7, marginBottom:24 }}>"{t.text}"</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:primary, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'0.8rem', fontWeight:700 }}>{t.name?.charAt(0)}</div>
                    <div>
                      <div style={{ fontSize:'0.875rem', fontWeight:700, color:'#111827' }}>{t.name}</div>
                      <div style={{ fontSize:'0.75rem', color:'#9ca3af' }}>Verified Client</div>
                    </div>
                  </div>
                  <div style={{ color:'#fbbf24', fontSize:'0.875rem' }}>{'★'.repeat(t.rating||5)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px 0', position:'relative', overflow:'hidden', background:`linear-gradient(135deg,${textColor} 0%, ${primary} 100%)` }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:256, height:256, borderRadius:'50%', background:'rgba(255,255,255,0.1)' }} />
        <div style={{ position:'absolute', bottom:-80, left:-80, width:192, height:192, borderRadius:'50%', background:'rgba(255,255,255,0.1)' }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:1000, margin:'0 auto', padding:'0 24px', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:32 }}>
          <div>
            <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.5rem)', fontWeight:800, color:'#fff', marginBottom:8 }}>Ready for a free quote?</h2>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.875rem' }}>Same-day response. No obligation. Expert advice.</p>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:12, flexShrink:0 }}>
            {gc.phone && <a href={`tel:${gc.phone}`} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 24px', background:'#fff', fontSize:'0.875rem', fontWeight:600, color:primary, borderRadius:buttonRadius }}><Phone size={14} /> {gc.phone}</a>}
            <a href="#contact" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 24px', border:'2px solid rgba(255,255,255,0.4)', color:'#fff', fontSize:'0.875rem', fontWeight:600, borderRadius:buttonRadius }}>Get a Quote →</a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding:'80px 0', background:bg, overflow:'hidden' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 16px' }}>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 64, alignItems:'start' }}>
            <motion.div initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
              <span style={{ fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:primary, display:'block', marginBottom:8 }}>Get In Touch</span>
              <h2 style={{ fontSize:'clamp(1.8rem,3vw,2.5rem)', fontWeight:800, color:'#111827', marginBottom:16 }}>Ready to Get Started?</h2>
              <p style={{ color:'#6b7280', fontSize:'0.875rem', marginBottom:40, lineHeight:1.6 }}>Contact us today for a free, no-obligation quote. We'll get back to you fast.</p>
              {[gc.phone&&{Icon:Phone,label:'Phone',val:gc.phone,href:`tel:${gc.phone}`},gc.email&&{Icon:Mail,label:'Email',val:gc.email,href:`mailto:${gc.email}`},gc.address&&{Icon:MapPin,label:'Address',val:gc.address,href:null}].filter(Boolean).map((c,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:16, padding:16, background:'#fff', borderRadius:12, border:'1px solid #f3f4f6', boxShadow:'0 1px 3px rgba(0,0,0,0.05)', marginBottom:12 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:primary, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 }}><c.Icon size={16} /></div>
                  <div>
                    <div style={{ fontSize:'0.75rem', color:'#9ca3af', fontWeight:500 }}>{c.label}</div>
                    {c.href ? <a href={c.href} style={{ fontSize:'0.9rem', fontWeight:600, color:'#111827' }}>{c.val}</a> : <div style={{ fontSize:'0.9rem', fontWeight:600, color:'#111827' }}>{c.val}</div>}
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} style={{ background:'#fff', borderRadius:20, padding:32, boxShadow:'0 1px 3px rgba(0,0,0,0.06)', border:'1px solid #f3f4f6' }}>
              {submitted ? (
                <div style={{ textAlign:'center', padding:40 }}>
                  <div style={{ fontSize:'3rem', color:primary, marginBottom:16 }}>✓</div>
                  <h3 style={{ fontWeight:700, color:'#111827', marginBottom:8 }}>Message Received!</h3>
                  <p style={{ color:'#6b7280', fontSize:'0.875rem' }}>We'll be in touch very soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize:'1.1rem', fontWeight:700, color:'#111827', marginBottom:20 }}>Send Us a Message</h3>
                  {[['name','Full Name *','text',true],['phone','Phone','tel',false],['email','Email','email',false]].map(([k,l,t,req])=>(
                    <div key={k} style={{ marginBottom:16 }}>
                      <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#4b5563', marginBottom:4 }}>{l}</label>
                      <input type={t} required={req} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={{ width:'100%', padding:'10px 16px', borderRadius:12, border:'1.5px solid #e5e7eb', fontSize:'0.875rem', fontFamily:'inherit' }} />
                    </div>
                  ))}
                  <div style={{ marginBottom:20 }}>
                    <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'#4b5563', marginBottom:4 }}>Message</label>
                    <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={3} style={{ width:'100%', padding:'10px 16px', borderRadius:12, border:'1.5px solid #e5e7eb', fontSize:'0.875rem', fontFamily:'inherit', resize:'none' }} />
                  </div>
                  <button type="submit" style={{ width:'100%', padding:12, background:primary, color:'#fff', fontWeight:600, fontSize:'0.9rem', border:'none', borderRadius:buttonRadius, cursor:'pointer' }}>Send Message</button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:'#030712', color:'#9ca3af', padding:'56px 0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 16px' }}>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '5fr 3fr 2fr 3fr', gap: isMobile ? 24 : 32, marginBottom:40 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:primary, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700 }}>{businessName.charAt(0)}</div>
                <span style={{ fontWeight:700, color:'#fff' }}>{businessName}</span>
              </div>
              <p style={{ fontSize:'0.875rem', lineHeight:1.6 }}>{gc.tagline}</p>
            </div>
            <div>
              <h4 style={{ color:'#fff', fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:16 }}>Services</h4>
              <ul style={{ listStyle:'none', margin:0, padding:0 }}>
                {(gc.services||[]).slice(0,4).map((s,i)=><li key={i} style={{ marginBottom:8 }}><a href="#services" style={{ fontSize:'0.875rem', color:'#9ca3af' }}>{s.title}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 style={{ color:'#fff', fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:16 }}>Company</h4>
              <ul style={{ listStyle:'none', margin:0, padding:0 }}>
                {['Services','About','Reviews','Contact'].map(l=><li key={l} style={{ marginBottom:8 }}><a href={`#${l.toLowerCase()}`} style={{ fontSize:'0.875rem', color:'#9ca3af' }}>{l}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 style={{ color:'#fff', fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:16 }}>Contact</h4>
              {gc.phone && <p style={{ marginBottom:12 }}><a href={`tel:${gc.phone}`} style={{ fontSize:'0.875rem', color:'#9ca3af', display:'flex', alignItems:'center', gap:8 }}><Phone size={14} /> {gc.phone}</a></p>}
              {gc.email && <p style={{ marginBottom:12 }}><a href={`mailto:${gc.email}`} style={{ fontSize:'0.875rem', color:'#9ca3af', display:'flex', alignItems:'center', gap:8 }}><Mail size={14} /> {gc.email}</a></p>}
              {gc.address && <p style={{ fontSize:'0.875rem', color:'#9ca3af', display:'flex', alignItems:'center', gap:8 }}><MapPin size={14} /> {gc.address}</p>}
            </div>
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:24, textAlign:'center' }}>
            <p style={{ fontSize:'0.75rem' }}>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
