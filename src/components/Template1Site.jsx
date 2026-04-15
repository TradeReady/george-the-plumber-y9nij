import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

const SVG_PHONE = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z"/></svg>;

export default function Template1Site({ site, imagePack }) {
  const gc = site.generated_content || {};
  const primary = gc.primary_color || '#6366f1';
  const bg = gc.background_color || '#f8f9fa';
  const textColor = gc.text_color || '#1a1a2e';
  const buttonRadius = gc.button_radius || '6px';
  const businessName = site.business_name || 'Business';
  const heroImage = site.hero_image_url || imagePack?.hero_image_url || '';
  const logoUrl = site.logo_url || '';
  const font = gc.hero_font ? gc.hero_font.replace(/['"]/g, '').trim() : null;

  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch(`https://api.base44.com/api/apps/${site.app_id || ''}/functions/submitPublicLead`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website_id: site.id })
      });
    } catch(_) {}
  };

  const services = gc.services || [];
  const testimonials = gc.testimonials || [];
  const benefits = gc.benefits || [];
  const stats = [
    gc.years_in_business && { label: 'Years Experience', val: gc.years_in_business },
    gc.rating && { label: 'Star Rating', val: gc.rating },
    gc.review_count && { label: 'Reviews', val: gc.review_count },
  ].filter(Boolean);

  return (
    <div style={{ fontFamily: font ? `'${font}', sans-serif` : 'system-ui, sans-serif', backgroundColor: bg, color: textColor }}>
      {/* NAV */}
      <nav style={{ background:'#fff', boxShadow:'0 2px 12px rgba(0,0,0,0.07)', padding:'0 40px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'68px', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ fontSize:'1.25rem', fontWeight:800, color:primary }}>
          {logoUrl ? <img src={logoUrl} alt={businessName} style={{ height:'42px', objectFit:'contain' }} /> : businessName}
        </div>
        {gc.phone && <a href={`tel:${gc.phone}`} style={{ display:'inline-flex', alignItems:'center', gap:8, fontWeight:700, color:textColor, background:`${primary}12`, padding:'8px 20px', borderRadius:buttonRadius }}>{SVG_PHONE} {gc.phone}</a>}
      </nav>

      {/* HERO */}
      <div style={{ position:'relative', minHeight:560, display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'100px 20px', background: heroImage ? `url('${heroImage}') center/cover no-repeat` : primary }}>
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)' }} />
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ position:'relative', zIndex:1, maxWidth:760 }}>
          {gc.tagline && <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.85rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:16 }}>{gc.tagline}</p>}
          <h1 style={{ fontSize:'clamp(2rem,5vw,3.8rem)', fontWeight:900, color:'#fff', marginBottom:20, lineHeight:1.1 }}>{gc.headline || businessName}</h1>
          {gc.subheadline && <p style={{ fontSize:'1.15rem', color:'rgba(255,255,255,0.88)', marginBottom:36, lineHeight:1.6 }}>{gc.subheadline}</p>}
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="#contact" style={{ display:'inline-flex', alignItems:'center', gap:8, background:primary, color:'#fff', padding:'14px 36px', borderRadius:buttonRadius, fontWeight:700, fontSize:'1rem' }}>{gc.cta_text || 'Get a Free Quote'}</a>
            {gc.phone && <a href={`tel:${gc.phone}`} style={{ display:'inline-flex', alignItems:'center', gap:8, background:'transparent', color:'#fff', border:'2px solid rgba(255,255,255,0.6)', padding:'14px 28px', borderRadius:buttonRadius, fontWeight:700 }}>{SVG_PHONE} Call Now</a>}
          </div>
        </motion.div>
      </div>

      {/* STATS */}
      {stats.length > 0 && (
        <section style={{ background:primary, padding:'48px 40px' }}>
          <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', flexWrap:'wrap', justifyContent:'center', gap:48 }}>
            {stats.map((s,i) => (
              <div key={i} style={{ textAlign:'center', color:'#fff' }}>
                <div style={{ fontSize:'2.5rem', fontWeight:900 }}>{s.val}</div>
                <div style={{ fontSize:'0.85rem', opacity:0.8, textTransform:'uppercase', letterSpacing:'0.1em', marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SERVICES */}
      {services.length > 0 && (
        <section style={{ background:bg, padding:'80px 0' }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 40px' }}>
            <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ fontSize:'2rem', fontWeight:800, color:textColor, marginBottom:12 }}>Our Services</motion.h2>
            <p style={{ color:'#777', marginBottom:40 }}>Quality workmanship you can rely on</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(290px, 1fr))', gap:28 }}>
              {services.map((svc, i) => {
                const img = (site.service_image_urls||[])[i] || (imagePack?.service_image_urls||[])[i];
                return (
                  <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.07 }}
                    style={{ background:'#fff', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 16px rgba(0,0,0,0.07)' }}>
                    {img ? <img src={img} alt={svc.title} style={{ width:'100%', height:200, objectFit:'cover' }} /> :
                      <div style={{ width:'100%', height:120, background:`${primary}18`, display:'flex', alignItems:'center', justifyContent:'center', color:primary }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                      </div>}
                    <div style={{ padding:24 }}>
                      <h3 style={{ margin:'0 0 10px', color:textColor, fontSize:'1.1rem', fontWeight:700 }}>{svc.title}</h3>
                      <p style={{ margin:0, color:'#666', fontSize:'0.9rem', lineHeight:1.6 }}>{svc.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* WHY US */}
      {benefits.length > 0 && (
        <section style={{ background:'#fff', padding:'80px 0' }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 40px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <div>
              <motion.h2 initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} style={{ fontSize:'2rem', fontWeight:800, color:textColor, marginBottom:12 }}>Why Choose Us</motion.h2>
              <p style={{ color:'#777', marginBottom:24 }}>{gc.about_text || 'Trusted by hundreds of satisfied customers.'}</p>
              <ul style={{ listStyle:'none', margin:0, padding:0 }}>
                {benefits.map((b, i) => (
                  <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
                    <span style={{ color:primary, fontSize:'1.2rem', flexShrink:0 }}>✓</span>
                    <span style={{ color:'#555', lineHeight:1.6 }}>{b}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" style={{ display:'inline-flex', marginTop:32, background:primary, color:'#fff', padding:'14px 36px', borderRadius:buttonRadius, fontWeight:700 }}>Get a Free Quote</a>
            </div>
            <motion.div initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} style={{ borderRadius:20, overflow:'hidden', aspectRatio:'4/3', background:`${primary}18` }}>
              {heroImage && <img src={heroImage} alt={businessName} style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
            </motion.div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section style={{ background:bg, padding:'80px 0' }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 40px' }}>
            <h2 style={{ fontSize:'2rem', fontWeight:800, color:textColor, marginBottom:40 }}>What Our Customers Say</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(290px, 1fr))', gap:28 }}>
              {testimonials.map((t, i) => (
                <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                  style={{ background:'#fff', borderRadius:16, padding:28, boxShadow:'0 2px 16px rgba(0,0,0,0.07)' }}>
                  <div style={{ fontSize:'3rem', color:`${primary}30`, lineHeight:1, marginBottom:8 }}>"</div>
                  <p style={{ margin:'0 0 20px', color:textColor, fontStyle:'italic', lineHeight:1.7 }}>"{t.text}"</p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <strong style={{ color:primary }}>{t.name}</strong>
                    {t.rating && <div style={{ color:'#f59e0b' }}>{'★'.repeat(Math.round(t.rating))}</div>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <div style={{ background:primary, padding:'64px 40px', textAlign:'center' }}>
        <h2 style={{ color:'#fff', fontSize:'2rem', fontWeight:900, marginBottom:12 }}>Ready to get started?</h2>
        <p style={{ color:'rgba(255,255,255,0.8)', marginBottom:28 }}>Contact us today for a free, no-obligation quote.</p>
        <a href="#contact" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#fff', color:primary, padding:'14px 36px', borderRadius:buttonRadius, fontWeight:800 }}>{gc.cta_text || 'Get a Free Quote'} →</a>
      </div>

      {/* CONTACT */}
      <section id="contact" style={{ padding:'80px 40px', background:'#fff' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <h2 style={{ fontSize:'2rem', fontWeight:800, color:textColor, marginBottom:40 }}>Get In Touch</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48 }}>
            <div>
              {gc.phone && <div style={{ display:'flex', alignItems:'center', gap:14, padding:18, background:'#fff', borderRadius:14, boxShadow:'0 2px 10px rgba(0,0,0,0.06)', marginBottom:14 }}><Phone size={18} style={{ color:primary }} /><a href={`tel:${gc.phone}`} style={{ fontWeight:700, color:textColor }}>{gc.phone}</a></div>}
              {gc.email && <div style={{ display:'flex', alignItems:'center', gap:14, padding:18, background:'#fff', borderRadius:14, boxShadow:'0 2px 10px rgba(0,0,0,0.06)', marginBottom:14 }}><Mail size={18} style={{ color:primary }} /><a href={`mailto:${gc.email}`} style={{ fontWeight:700, color:textColor }}>{gc.email}</a></div>}
              {gc.address && <div style={{ display:'flex', alignItems:'center', gap:14, padding:18, background:'#fff', borderRadius:14, boxShadow:'0 2px 10px rgba(0,0,0,0.06)' }}><MapPin size={18} style={{ color:primary }} /><span style={{ fontWeight:700, color:textColor }}>{gc.address}</span></div>}
            </div>
            <div style={{ background:'#fff', borderRadius:20, padding:40, boxShadow:'0 4px 24px rgba(0,0,0,0.09)' }}>
              {submitted ? (
                <div style={{ textAlign:'center', padding:32, color:primary, fontWeight:700 }}>Message received! We'll be in touch shortly. ✓</div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {[['name','Your Name *','text',true],['phone','Phone Number *','tel',true],['email','Email Address','email',false]].map(([k,ph,t,req])=>(
                    <input key={k} type={t} placeholder={ph} required={req} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
                      style={{ width:'100%', padding:'14px 16px', border:'1.5px solid #e5e7eb', borderRadius:10, fontSize:'1rem', fontFamily:'inherit' }} />
                  ))}
                  <textarea placeholder="Tell us about your project..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={3}
                    style={{ width:'100%', padding:'14px 16px', border:'1.5px solid #e5e7eb', borderRadius:10, fontSize:'1rem', fontFamily:'inherit', resize:'vertical' }} />
                  <button type="submit" style={{ background:primary, color:'#fff', padding:'14px', borderRadius:buttonRadius, fontWeight:700, border:'none', cursor:'pointer' }}>{gc.cta_text || 'Get a Free Quote'}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:textColor, color:'#fff', padding:'48px 40px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ fontWeight:900, fontSize:'1.2rem', marginBottom:12 }}>{businessName}</div>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.9rem' }}>{gc.tagline}</p>
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', marginTop:24, paddingTop:16 }}>
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.8rem' }}>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
