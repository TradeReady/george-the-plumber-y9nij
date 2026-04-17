import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Template1Site({ site, imagePack }) {
  const gc = site.generated_content || {};
  const primary = gc.primary_color || '#6366f1';
  const bg = gc.background_color || '#f8f9fa';
  const textColor = gc.text_color || '#1a1a2e';
  const accent = gc.accent_color || primary;
  const buttonRadius = gc.button_radius || '8px';
  const businessName = site.business_name || 'Business';
  const logoUrl = site.logo_url || '';
  const font = gc.hero_font ? gc.hero_font.replace(/['"]/g, '').trim() : null;
  const fontStyle = font ? `'${font}', system-ui, sans-serif` : 'system-ui, sans-serif';

  const getHeroImage = () => {
    if (site.hero_image_url && site.hero_image_url !== 'none') return site.hero_image_url;
    if (imagePack?.hero_image_url) return imagePack.hero_image_url;
    const q = (gc.hero_image_query || '').toLowerCase();
    if (q.includes('plumb')) return 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=1400&q=80&auto=format&fit=crop';
    if (q.includes('kitchen') || q.includes('restaurant')) return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80&auto=format&fit=crop';
    if (q.includes('electric')) return 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1400&q=80&auto=format&fit=crop';
    if (q.includes('landscap') || q.includes('garden')) return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1400&q=80&auto=format&fit=crop';
    if (q.includes('clean')) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&q=80&auto=format&fit=crop';
    if (q.includes('construct') || q.includes('build')) return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=80&auto=format&fit=crop';
  };
  const heroImage = getHeroImage();

  // FIX 1: isMobile initialised correctly on first render — prevents desktop flash on mobile
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // FIX 2: CountUp regex — backslashes restored so number animation works
  function CountUp({ value, duration = 2000 }) {
    const ref = useRef(null);
    const [display, setDisplay] = useState('0');
    const rafRef = useRef(null);
    const observerRef = useRef(null);
    useEffect(() => {
      const str = String(value);
      const match = str.match(/^([^0-9]*)(\d+\.?\d*)([^0-9]*)$/);
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

  const [showAllServices, setShowAllServices] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch(`https://api.base44.com/api/apps/${site.app_id || ''}/functions/submitPublicLead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website_id: site.id })
      });
    } catch (_) {}
  };

  const services = gc.services || [];
  const testimonials = gc.testimonials || [];
  const benefits = gc.benefits || [];
  const navLinks = [['Services', '#services'], ['About', '#about'], ['Reviews', '#testimonials'], ['Contact', '#contact']];

  const statsData = [
    { value: gc.years_in_business ? `${gc.years_in_business}+` : '10+', label: 'Years Experience' },
    { value: gc.review_count ? `${gc.review_count}+` : '500+', label: 'Happy Clients' },
    { value: gc.rating || '4.9', label: 'Average Rating' },
    { value: '24/7', label: 'Emergency Support' },
  ];

  return (
    <div style={{ fontFamily: fontStyle, backgroundColor: bg, color: textColor }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, transition: 'all 0.3s', backgroundColor: (scrolled || menuOpen) ? textColor : 'transparent', boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.15)' : 'none' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
            {logoUrl ? <img src={logoUrl} alt={businessName} style={{ height: 32, objectFit: 'contain' }} /> : businessName}
          </div>
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {navLinks.map(([l, h]) => <a key={h} href={h} style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{l}</a>)}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {!isMobile && gc.phone && (
              <a href={`tel:${gc.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', backgroundColor: primary, color: '#fff', fontSize: '0.875rem', fontWeight: 600, borderRadius: buttonRadius, textDecoration: 'none' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z" /></svg>
                Call Now
              </a>
            )}
            {!isMobile && (
              <a href="#contact" style={{ display: 'inline-flex', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.875rem', fontWeight: 600, borderRadius: buttonRadius, textDecoration: 'none' }}>
                {gc.cta_text || 'Get a Quote'}
              </a>
            )}
            {/* FIX: on mobile show Call Now button AND hamburger in nav */}
            {isMobile && gc.phone && (
              <a href={`tel:${gc.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', backgroundColor: primary, color: '#fff', fontSize: '0.8rem', fontWeight: 600, borderRadius: buttonRadius, textDecoration: 'none' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z" /></svg>
                Call Now
              </a>
            )}
            {isMobile && (
              <button onClick={() => setMenuOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#fff', display: 'flex', alignItems: 'center' }}>
                {menuOpen
                  ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                }
              </button>
            )}
          </div>
        </div>
        {isMobile && menuOpen && (
          <div style={{ backgroundColor: textColor, borderTop: '1px solid rgba(255,255,255,0.1)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(([l, h]) => (
              <a key={h} href={h} onClick={() => setMenuOpen(false)} style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: 500 }}>{l}</a>
            ))}
            <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {gc.phone && (
                <a href={`tel:${gc.phone}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', backgroundColor: primary, color: '#fff', fontSize: '0.875rem', fontWeight: 600, borderRadius: buttonRadius, textDecoration: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z" /></svg>
                  Call Now
                </a>
              )}
              <a href="#contact" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.875rem', fontWeight: 600, borderRadius: buttonRadius, textDecoration: 'none' }}>
                {gc.cta_text || 'Get a Quote'}
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', backgroundColor: textColor }}>
        {heroImage && <img src={heroImage} alt="Hero" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(120deg, ${textColor}ee 0%, ${textColor}99 50%, transparent 100%)` }} />
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1152, margin: '0 auto', padding: isMobile ? '100px 20px 60px' : '128px 24px 80px', width: '100%' }}>
          <div style={{ maxWidth: 640 }}>
            {gc.tagline && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 24 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)' }}>{gc.tagline}</span>
                <div style={{ height: 2, width: 40, marginTop: 6, borderRadius: 2, backgroundColor: primary }} />
              </motion.div>
            )}
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ fontSize: 'clamp(1.8rem,6vw,3.75rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 16, fontFamily: fontStyle }}>
              {gc.headline || businessName}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', marginBottom: 16, lineHeight: 1.6 }}>
              {gc.subheadline}
            </motion.p>
            {gc.rating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <div style={{ display: 'flex' }}>
                  {[1, 2, 3, 4, 5].map(s => <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>{gc.rating}/5 · {gc.review_count || '200'}+ reviews</span>
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {['Fully Licensed', 'Insured', 'Local Experts'].map(badge => (
                <span key={badge} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.75rem', padding: '6px 12px', borderRadius: 9999 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  {badge}
                </span>
              ))}
            </motion.div>
            {/* FIX: hero buttons stack vertically on mobile, full width */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, width: isMobile ? '100%' : 'auto' }}>
              {gc.phone && (
                <a href={`tel:${gc.phone}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 20px', color: '#fff', fontWeight: 600, fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: buttonRadius, textDecoration: 'none', backdropFilter: 'blur(4px)', width: isMobile ? '100%' : 'auto' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z" /></svg>
                  Call Now
                </a>
              )}
              <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 20px', backgroundColor: primary, color: '#fff', fontWeight: 600, fontSize: '0.875rem', borderRadius: buttonRadius, textDecoration: 'none', width: isMobile ? '100%' : 'auto' }}>
                {gc.cta_text || 'Get a Free Quote'}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS — FIX: 2 cols on mobile, 4 on desktop */}
      <section style={{ backgroundColor: '#fff', padding: '48px 0' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isMobile ? 16 : 24 }}>
          {statsData.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.12, ease: [0.2, 0.8, 0.2, 1] }} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: 800, color: primary, marginBottom: 4 }}>
                <CountUp value={s.value} />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      {services.length > 0 && (
        <section id="services" style={{ padding: '80px 0', backgroundColor: bg }}>
          <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: primary, marginBottom: 8 }}>What We Offer</p>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, color: textColor, marginBottom: 12 }}>Our Services</h2>
              <p style={{ color: '#6b7280', maxWidth: 480, margin: '0 auto', fontSize: '0.9rem' }}>From emergency repairs to major installations — we handle it all.</p>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
              <AnimatePresence>
                {(showAllServices ? services : services.slice(0, 3)).map((svc, i) => {
                  const img = (site.service_image_urls || [])[i] || (imagePack?.service_image_urls || [])[i];
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4 }}
                      style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #f3f4f6', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      {img ? <img src={img} alt={svc.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} /> :
                        <div style={{ width: '100%', height: 160, backgroundColor: `${primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={primary} strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                        </div>}
                      <div style={{ padding: 16 }}>
                        <h3 style={{ margin: '0 0 8px', color: textColor, fontSize: '1rem', fontWeight: 600 }}>{svc.title}</h3>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6 }}>{svc.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            {services.length > 3 && (
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <button onClick={() => setShowAllServices(v => !v)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 9999, border: `2px solid ${primary}`, backgroundColor: 'transparent', color: primary, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                  {showAllServices
                    ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>Show Less</>
                    : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>See All Services</>
                  }
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* WHY US — FIX: single column on mobile */}
      {benefits.length > 0 && (
        <section id="about" style={{ padding: '80px 0', backgroundColor: '#fff' }}>
          <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 48, alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: primary, marginBottom: 8 }}>Why Choose Us</p>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, color: textColor, marginBottom: 16 }}>The {businessName} Difference</h2>
              <p style={{ color: '#6b7280', marginBottom: 24, lineHeight: 1.7 }}>{gc.about_text}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {benefits.map((b, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={primary} strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.6 }}>{b}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { value: gc.years_in_business ? `${gc.years_in_business}+` : '10+', label: 'Years in Business' },
                { value: gc.review_count ? `${gc.review_count}+` : '200+', label: 'Happy Clients' },
                { value: gc.rating || '4.9', label: 'Average Rating' },
                { value: '24/7', label: 'Emergency Support' },
              ].map((stat, i) => (
                <div key={i} style={{ borderRadius: 12, padding: isMobile ? 16 : 24, textAlign: 'center', backgroundColor: i % 2 === 0 ? primary : `${primary}15`, color: i % 2 === 0 ? '#fff' : textColor }}>
                  <div style={{ fontSize: isMobile ? '1.5rem' : '1.875rem', fontWeight: 800, marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section id="testimonials" style={{ padding: '80px 0', backgroundColor: bg }}>
          <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: primary, marginBottom: 8 }}>Client Stories</p>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, color: textColor }}>What Clients Say</h2>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
              {testimonials.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', marginBottom: 12 }}>
                    {[1, 2, 3, 4, 5].map(s => <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= (t.rating || 5) ? '#f59e0b' : '#e5e7eb'} stroke={s <= (t.rating || 5) ? '#f59e0b' : '#e5e7eb'} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
                  </div>
                  <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 }}>
                      {t.name?.[0] || 'A'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: textColor }}>{t.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Verified Customer</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: isMobile ? '60px 0' : '96px 0', backgroundColor: textColor }}>
        <div style={{ position: 'absolute', top: -96, left: -96, width: 384, height: 384, borderRadius: '50%', backgroundColor: primary, opacity: 0.15, filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: -96, right: -96, width: 384, height: 384, borderRadius: '50%', backgroundColor: accent, opacity: 0.15, filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: `repeating-linear-gradient(45deg, ${primary} 0px, ${primary} 1px, transparent 1px, transparent 40px)` }} />
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 960, margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 32 }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 9999, backgroundColor: `${primary}25`, color: accent, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              Available 24/7
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
              Ready to fix it<br /><span style={{ color: accent }}>right now?</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: 400 }}>Don't wait — our team responds fast. Whether it's an emergency or a quote, we're one call away.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: isMobile ? '100%' : 260 }}>
            {gc.phone && (
              <a href={`tel:${gc.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, backgroundColor: primary, borderRadius: 16, textDecoration: 'none' }}>
                <div style={{ width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z" /></svg>
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>Call us now</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>{gc.phone}</div>
                </div>
              </a>
            )}
            <a href="#contact" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, textDecoration: 'none' }}>
              <div style={{ width: 48, height: 48, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>Free Quote</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Get in touch online</div>
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" style={{ padding: '80px 0', backgroundColor: '#fff', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 16px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 48, alignItems: 'start' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: primary, marginBottom: 8 }}>Contact Us</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 800, color: textColor, marginBottom: 16 }}>Get In Touch</h2>
            <p style={{ color: '#6b7280', marginBottom: 32, lineHeight: 1.7 }}>We're here to help with any questions. Reach out and we'll respond as quickly as possible.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                gc.phone && { icon: 'phone', label: 'Phone', val: gc.phone, href: `tel:${gc.phone}` },
                gc.email && { icon: 'mail', label: 'Email', val: gc.email, href: `mailto:${gc.email}` },
                gc.address && { icon: 'pin', label: 'Address', val: gc.address, href: null }
              ].filter(Boolean).map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, backgroundColor: '#fff', borderRadius: 12, border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {c.icon === 'phone' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z" /></svg>}
                    {c.icon === 'mail' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>}
                    {c.icon === 'pin' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 500, marginBottom: 2 }}>{c.label}</div>
                    {c.href
                      ? <a href={c.href} style={{ fontSize: '0.9rem', fontWeight: 600, color: textColor, textDecoration: 'none' }}>{c.val}</a>
                      : <div style={{ fontSize: '0.9rem', fontWeight: 600, color: textColor }}>{c.val}</div>
                    }
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ backgroundColor: '#fff', borderRadius: 20, padding: isMobile ? 24 : 40, boxShadow: '0 4px 24px rgba(0,0,0,0.09)', border: '1px solid #f3f4f6' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: 32 }}>
                <div style={{ fontSize: '3rem', color: primary, marginBottom: 16 }}>✓</div>
                <h3 style={{ fontWeight: 700, color: textColor, marginBottom: 8 }}>Message Received!</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>We'll be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[['name', 'Your Name *', 'text', true], ['phone', 'Phone Number *', 'tel', true], ['email', 'Email Address', 'email', false]].map(([k, ph, t, req]) => (
                  <div key={k}>
                    <input type={t} placeholder={ph} required={req} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                      style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: '0.95rem', fontFamily: fontStyle, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <textarea placeholder="Tell us about your project..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4}
                  style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: '0.95rem', fontFamily: fontStyle, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
                <button type="submit" style={{ backgroundColor: primary, color: '#fff', padding: 14, borderRadius: buttonRadius, fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                  {gc.cta_text || 'Get a Free Quote'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* FOOTER — FIX: single column on mobile */}
      <footer style={{ backgroundColor: textColor, color: 'rgba(255,255,255,0.7)', padding: '48px 0' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr', gap: isMobile ? 24 : 32, marginBottom: 32 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff', marginBottom: 12 }}>{businessName}</div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{gc.tagline}</p>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Services</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {(gc.services || []).slice(0, 4).map((s, i) => <li key={i} style={{ marginBottom: 8 }}><a href="#services" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{s.title}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Company</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {[['Services', '#services'], ['About Us', '#about'], ['Reviews', '#testimonials'], ['Contact', '#contact']].map(([l, h]) => <li key={h} style={{ marginBottom: 8 }}><a href={h} style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{l}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {gc.address && <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.875rem' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>{gc.address}</div>}
                {gc.phone && <a href={`tel:${gc.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z" /></svg>{gc.phone}</a>}
                {gc.email && <a href={`mailto:${gc.email}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>{gc.email}</a>}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: '0.75rem', margin: 0 }}>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z', 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z', 'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z'].map((d, i) => (
                <a key={i} href="#" style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d={d} /></svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
