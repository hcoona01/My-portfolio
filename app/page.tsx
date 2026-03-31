'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  motion, useScroll, useTransform, useInView,
  useMotionValue, useSpring, AnimatePresence
} from 'framer-motion';
import Lenis from 'lenis';
import CustomCursor from './components/CustomCursor';

/* ── DATA ──────────────────────────────────────────────────────────── */
const NAV = ['about','projects','skills','certifications','achievements','education','contact'];

const PROJECTS = [
  {
    name: 'Serenity',
    subtitle: 'AI-Powered Health Triage & Mental Wellness Companion',
    points: [
      'Full-stack wellness platform with AI-driven symptom triage, mood tracking, and empathetic chatbot using LLM-based backend logic.',
      'Interactive UI with mindfulness exercises and mood-based recommendations; Firebase for secure data storage.',
    ],
    tags: ['Python','LLM','Firebase','AI/ML','Full-Stack'],
    accent: '#b026ff',
  },
  {
    name: 'Certificate Generator',
    subtitle: 'Automated Bulk Certificate Tool — Python',
    points: [
      'Automated Python tool for generating personalized certificates at scale with consistent formatting, eliminating manual workload.',
      'Integrated automated email delivery for seamless distribution across events and training programs.',
    ],
    tags: ['Python','Automation','SMTP','PDF'],
    accent: '#7b2fff',
  },
];

const SKILLS = [
  { name:'Python',          pct: 90 },
  { name:'JavaScript',      pct: 82 },
  { name:'HTML5 / CSS',     pct: 88 },
  { name:'Flask',           pct: 76 },
  { name:'SQL',             pct: 74 },
  { name:'AI / ML',         pct: 80 },
  { name:'Firebase',        pct: 72 },
  { name:'LLM Integration', pct: 77 },
];

const CERTS = [
  { name:'Elements of AI',                org:'University of Helsinki',   c:'#b026ff' },
  { name:'Intro to Programming (Python)', org:'CS50 Harvard',             c:'#7b2fff' },
  { name:'Introduction to Generative AI', org:'Amazon Web Services',      c:'#b026ff' },
  { name:'Introduction to AI Concepts',   org:'Microsoft',                c:'#7b2fff' },
  { name:'Generative AI Mastermind',      org:'Outskill × Moneycontrol',  c:'#b026ff' },
  { name:'AWS Foundations ML Basics',    org:'Amazon Web Services',      c:'#7b2fff' },
  { name:'Introduction to ML',            org:'AWS',                      c:'#b026ff' },
  { name:'Fundamentals of ML & AI',       org:'Amazon Web Services',      c:'#7b2fff' },
];

const ACHIEVEMENTS = [
  '97.29 %ile · JEE Mains 2025 (99.21 %ile in Physics)',
  'AIR-22491 · JEE Advanced 2024',
  'STSE Rajasthan Scholar-2022 — State Rank 12',
  'CBSE Merit Certificate 2022 — Top 0.1% in Science',
  'District Rank 1, Vidyarthi Vigyan Manthan — 3 consecutive years (2020–22)',
  'State Rank 5, 14, 10 — Vidyarthi Vigyan Manthan (2020–22)',
  'AISSEE SSS Merit List Rank 1 · 2020',
  'APS South Western Command Best Student in Academics · 2023',
  'Student Of The Year 2024 — APS Bikaner',
];

const EDUCATION = [
  { deg:'B.Tech CSE — AI/ML', school:'Lovely Professional University', period:'2025 – 2029', note:'Specialising in Artificial Intelligence & Machine Learning' },
  { deg:'Class XII — PCM',    school:'Army Public School Bikaner',      period:'2024',       note:'92.8%' },
  { deg:'Class X',            school:'Army Public School Bikaner',      period:'2022',       note:'95.8%' },
];

/* ── VARIANTS ──────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden:  { opacity:0, y:40 },
  visible: (i: number = 0) => ({ opacity:1, y:0, transition:{ duration:0.7, ease:[0.22,1,0.36,1], delay: i*0.08 } }),
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const staggerParent: any = {
  hidden:  {},
  visible: { transition:{ staggerChildren:0.09 } },
};

/* ── HELPERS ───────────────────────────────────────────────────────── */
function SectionHead({ label, title }: { label:string; title:string }) {
  return (
    <motion.div variants={fadeUp} style={{ marginBottom:'3rem' }}>
      <span className="space-mono" style={{ fontSize:'0.65rem', letterSpacing:'0.25em', color:'rgba(123,47,255,0.5)' }}>
        // {label}
      </span>
      <h2 className="section-title lustrous" style={{ marginTop:'0.4rem' }}>{title}</h2>
      <div className="section-line" style={{ width:56 }} />
    </motion.div>
  );
}

function SkillBar({ name, pct, delay }: { name:string; pct:number; delay:number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true });
  return (
    <motion.div ref={ref} variants={fadeUp} custom={delay} style={{ marginBottom:'1.25rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem' }}>
        <span className="space-mono" style={{ fontSize:'0.72rem', color:'#1b1b1b', fontWeight:700, letterSpacing:'0.05em' }}>{name}</span>
        <span className="space-mono" style={{ fontSize:'0.65rem', color:'rgba(176,38,255,0.7)' }}>{pct}%</span>
      </div>
      <div className="skill-bar-track">
        <motion.div className="skill-bar-fill"
          initial={{ width:0 }}
          animate={ inView ? { width:`${pct}%` } : { width:0 } }
          transition={{ duration:1.3, ease:[0.22,1,0.36,1], delay: delay*0.07 + 0.15 }}
        />
      </div>
    </motion.div>
  );
}

function SectionWrap({ id, children, style={} }: { id:string; children:React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-80px' });
  return (
    <section id={id} ref={ref} style={{ padding:'96px 0', position:'relative', ...style }}>
      <motion.div initial="hidden" animate={inView?'visible':'hidden'} variants={staggerParent}>
        {children}
      </motion.div>
    </section>
  );
}

function Container({ children }: { children:React.ReactNode }) {
  return <div style={{ maxWidth:1180, margin:'0 auto', padding:'0 48px' }}>{children}</div>;
}

/* ── PAGE ─────────────────────────────────────────────────────────── */
export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [splineDragging, setSplineDragging] = useState(false);
  const iframeOverlayRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0,600], [0,100]);

  useEffect(() => {
    setMounted(true);
    const lenis = new Lenis({ duration:1.2 });
    let rid: number;
    function raf(t:number) { lenis.raf(t); rid = requestAnimationFrame(raf); }
    rid = requestAnimationFrame(raf);
    return () => { lenis.destroy(); cancelAnimationFrame(rid); };
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const overlay = iframeOverlayRef.current;
    if (!overlay) return;
    const onDown = () => { overlay.style.pointerEvents = 'none'; setSplineDragging(true); };
    const onUp = () => { setTimeout(() => { if(overlay) overlay.style.pointerEvents = 'all'; setSplineDragging(false); }, 80); };
    overlay.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => { overlay.removeEventListener('mousedown', onDown); window.removeEventListener('mouseup', onUp); };
  }, []);

  return (
    <div ref={rootRef} style={{ background:'transparent', minHeight:'100vh', position:'relative' }}>
        
        {/* BG ACCENTS */}
        <motion.div animate={{ left:['-110%', '110%'], opacity:[0, 1, 1, 0] }}
          transition={{ duration:4.5, repeat:Infinity, repeatDelay:2, ease:'easeInOut' }}
          style={{ position:'fixed', top:'38%', width:'100%', height:1, pointerEvents:'none', zIndex:2,
            background:'linear-gradient(90deg,transparent,#1b1b1b,rgba(140,110,80,0.4),#1b1b1b,transparent)',
            filter:'blur(0.5px)' }}
        />
        <motion.div animate={{ top:['-110%', '110%'], opacity:[0, 1, 1, 0] }}
          transition={{ duration:6, repeat:Infinity, repeatDelay:3, ease:'easeInOut', delay:2 }}
          style={{ position:'fixed', left:'68%', height:'100%', width:1, pointerEvents:'none', zIndex:2,
            background:'linear-gradient(180deg,transparent,#8c6e50,rgba(140,110,80,0.3),#8c6e50,transparent)',
            filter:'blur(0.5px)' }}
        />

        {mounted && <CustomCursor />}

        <div style={{ position:'relative', zIndex:10 }}>
          {/* NAVBAR */}
          <nav className={`cyber-nav ${scrolled?'scrolled':''}`}>
            <motion.button initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:3.2, duration:0.6 }}
              className="orbitron" onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
              style={{ background:'none', border:'none', cursor:'none', fontSize:'0.88rem', fontWeight:700, letterSpacing:'0.2em', color:'#050510' }}
            >
              ODK<span style={{ color:'#b026ff' }}>.</span>
            </motion.button>
            <div style={{ display:'flex', gap:'2rem', alignItems:'center' }}>
              {NAV.map(n => (
                <a key={n} href={`#${n}`} className="space-mono"
                  style={{ fontSize:'0.62rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(0,0,0,0.5)', textDecoration:'none', transition:'color 0.2s' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.color='#b026ff'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.color='rgba(0,0,0,0.5)'; }}
                >{n}</a>
              ))}
            </div>
          </nav>

          {/* HERO */}
          <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', overflow:'hidden', paddingTop:80 }} className="cyber-grid-bg scanline-container">
            <motion.div style={{ position:'absolute', inset:0, y:heroParallax, background:'radial-gradient(ellipse 70% 70% at 60% 50%, rgba(123,47,255,0.09) 0%, transparent 70%)', pointerEvents:'none' }} />
            <div style={{ maxWidth:1180, margin:'0 auto', padding:'0 48px', display:'grid', gridTemplateColumns:'1fr 1fr', alignItems:'center', gap:'3rem', width:'100%' }}>
              <div>
                <div className="space-mono" style={{ fontSize:'0.65rem', letterSpacing:'0.3em', color:'#7b2fff', marginBottom:'1.2rem', display:'flex', alignItems:'center', gap:8 }}>
                  <motion.span animate={{ opacity:[0,1,0] }} transition={{ duration:1.2, repeat:Infinity }} style={{ width:6, height:6, borderRadius:'50%', background:'#b026ff' }} />
                  ONLINE // PORTFOLIO v2.5
                </div>
                <h1 className="orbitron lustrous" style={{ fontSize:'clamp(2.2rem,4.5vw,4rem)', fontWeight:900, lineHeight:1.12, color:'#050510', letterSpacing:'0.02em', marginBottom:'0.8rem' }}>
                  Om Dipak<br />Kanase
                </h1>
                <div style={{ display:'flex', alignItems:'center', gap:'0.8rem', marginBottom:'1.2rem' }}>
                  <span className="space-mono" style={{ fontSize:'1.05rem', color:'#1b1b1b', fontWeight:900, letterSpacing:'0.1em' }}>@HCOONA01</span>
                  <span style={{ width:36, height:2, background:'#8c6e50' }} />
                  <span className="space-mono" style={{ fontSize:'0.65rem', color:'rgba(0,0,0,0.55)', letterSpacing:'0.15em' }}>AI/ML ENGINEER</span>
                </div>
                <p style={{ fontSize:'0.92rem', color:'#1b1b1b', opacity:0.8, lineHeight:1.7, maxWidth:400, marginBottom:'2rem' }}>
                  CSE student at Lovely Professional University specialising in AI & ML. Passionate about building intelligent systems that solve real-world problems.
                </p>
                <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                  <a href="#projects" className="cyber-btn cyber-btn-solid">View Projects</a>
                  <a href="mailto:projectcertificate01@gmail.com" className="cyber-btn">Contact Me</a>
                </div>
              </div>
              <motion.div initial={{ opacity:0, x:80 }} animate={{ opacity:1, x:0 }} transition={{ delay:3.3, duration:1 }}>
                <div style={{ width:'100%', maxWidth:520, aspectRatio:'1/1', position:'relative', border:'1px solid rgba(140,110,80,0.3)', borderRadius:4, overflow:'hidden', background:'transparent' }}>
                  {/* Seamless Unbranded Iframe — Clipped to remove "Built with Spline" watermark */}
                  <div style={{ width:'100%', height:'calc(100% + 50px)', position:'absolute', top:0, left:0, overflow:'hidden' }}>
                    <iframe 
                        src="https://my.spline.design/quantum-cLxKL40BLVEwgU509oqheYvY/" 
                        frameBorder="0" 
                        style={{ width:'100%', height:'100%', border:'none' }} 
                    />
                  </div>
                  {/* Custom Cursor Capture Overlay */}
                  <div ref={iframeOverlayRef} style={{ position:'absolute', inset:0, zIndex:10, cursor:'none' }} />
                </div>
              </motion.div>
            </div>
          </section>

          {/* ABOUT */}
          <SectionWrap id="about">
            <Container>
              <div style={{ display:'grid', gridTemplateColumns:'1.2fr 0.8fr', gap:'5rem', alignItems:'center' }}>
                <div>
                  <SectionHead label="ABOUT_ME" title="About" />
                  <p style={{ color:'rgba(0,0,0,0.65)', lineHeight:1.85, fontSize:'0.95rem', marginBottom:'1.5rem' }}>
                    Detail-oriented Computer Science Engineering student at Lovely Professional University, specialising in Artificial Intelligence and Machine Learning.
                  </p>
                  <p style={{ color:'rgba(0,0,0,0.65)', lineHeight:1.85, fontSize:'0.95rem' }}>
                    Passionate about solving real-world problems through data-driven approaches and continually learning new technologies. Seeking opportunities to apply technical expertise in AI/ML and contribute to impactful projects.
                  </p>
                </div>
                <div className="cyber-card" style={{ padding:'2rem' }}>
                    <div className="space-mono" style={{ fontSize:'0.6rem', color:'rgba(123,47,255,0.7)', marginBottom:'1.25rem' }}>// STATS</div>
                    { ACHIEVEMENTS.slice(0,4).map((a,i) => (
                      <div key={i} style={{ padding:'0.75rem 0', borderBottom:'1px solid rgba(0,0,0,0.03)', fontSize:'0.82rem', color:'rgba(0,0,0,0.85)' }}>
                        {a}
                      </div>
                    ))}
                </div>
              </div>
            </Container>
          </SectionWrap>

          {/* PROJECTS */}
          <SectionWrap id="projects" style={{ background:'rgba(0,0,0,0.02)' }}>
            <Container>
              <SectionHead label="PROJECTS" title="Projects" />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
                {PROJECTS.map((p,i) => (
                  <div key={p.name} className="cyber-card" style={{ padding:'2rem' }}>
                    <h3 className="orbitron lustrous" style={{ color:'#050510', marginBottom:'0.5rem' }}>{p.name}</h3>
                    <p style={{ fontSize:'0.75rem', color:p.accent, marginBottom:'1rem' }}>{p.subtitle}</p>
                    <ul style={{ listStyle:'none', padding:0, fontSize:'0.82rem', color:'rgba(0,0,0,0.6)', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                      {p.points.map((pt,j) => <li key={j}>{pt}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </Container>
          </SectionWrap>

          {/* SKILLS */}
          <SectionWrap id="skills">
            <Container>
                <SectionHead label="SKILLS" title="Skills" />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem' }}>
                <div> {SKILLS.map((s,i) => <SkillBar key={s.name} name={s.name} pct={s.pct} delay={i} />)} </div>
                <div className="cyber-card" style={{ padding:'2rem' }}>
                  <div className="space-mono" style={{ fontSize:'0.6rem', color:'rgba(123,47,255,0.7)', marginBottom:'1rem' }}>// SPECIALISATIONS</div>
                  {['Artificial Intelligence','Machine Learning','NLP','Data Science'].map(f => <div key={f} style={{ padding:'0.5rem 0', borderBottom:'1px solid rgba(0,0,0,0.02)', color:'rgba(0,0,0,0.85)' }}>{f}</div>)}
                </div>
              </div>
            </Container>
          </SectionWrap>

          {/* ACHIEVEMENTS */}
          <SectionWrap id="achievements">
            <Container>
              <SectionHead label="ACHIEVEMENTS" title="Academic Milestones" />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                { ACHIEVEMENTS.map((a,i) => (
                  <div key={i} className="cyber-card" style={{ padding:'1rem', color:'rgba(0,0,0,0.8)', fontSize:'0.85rem' }}>{a}</div>
                ))}
              </div>
            </Container>
          </SectionWrap>

          {/* EDUCATION */}
          <SectionWrap id="education" style={{ background:'rgba(0,0,0,0.02)' }}>
            <Container>
              <SectionHead label="EDUCATION" title="Education" />
                <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                  { EDUCATION.map((e,i) => (
                    <div key={i} className="cyber-card" style={{ padding:'1.5rem' }}>
                      <h4 className="orbitron" style={{ color:'#050510' }}>{e.deg}</h4>
                      <p style={{ color:'#b026ff', fontSize:'0.85rem' }}>{e.school}</p>
                      <p style={{ color:'rgba(0,0,0,0.35)', fontSize:'0.7rem' }} className="space-mono">{e.period}</p>
                    </div>
                  ))}
                </div>
            </Container>
          </SectionWrap>

          {/* CONTACT */}
          <SectionWrap id="contact">
            <Container>
                <div style={{ textAlign:'center' }}>
                  <SectionHead label="CONTACT" title="Get In Touch" />
                  <p style={{ color:'rgba(0,0,0,0.5)', marginBottom:'2.5rem' }}>Have a project idea or just want to connect?</p>
                  <div style={{ display:'flex', gap:'1rem', justifyContent:'center' }}>
                    <a href="mailto:omkanase01@gmail.com" className="cyber-btn cyber-btn-solid">Email Me</a>
                    <a href="https://github.com/hcoona01" target="_blank" rel="noopener noreferrer" className="cyber-btn">GitHub</a>
                  </div>
                </div>
            </Container>
          </SectionWrap>

          <footer style={{ padding:'4rem 48px', textAlign:'center', fontSize:'0.65rem', color:'#1b1b1b', opacity:0.6 }}>
            OM DIPAK KANASE · PORTFOLIO v2.5 · 2025
          </footer>
        </div>
      </div>
  );
}
