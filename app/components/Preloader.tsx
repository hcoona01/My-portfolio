'use client';

import { useEffect, useState, Component } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

/* ── Error Boundary (silently catches Spline parse errors) ── */
class SplineEB extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  componentDidCatch() {}
  render() { return this.state.err ? null : this.props.children; }
}

interface Props { children: ReactNode; }

const BOOT = [
  { at: 15, msg: '> Initializing quantum renderer...' },
  { at: 35, msg: '> Loading neural assets...' },
  { at: 55, msg: '> Compiling cyber shaders...' },
  { at: 75, msg: '> Establishing uplink...' },
  { at: 92, msg: '> Portfolio ONLINE ▮' },
];

export default function Preloader({ children }: Props) {
  const [pct, setPct]         = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const TOTAL = 3000, TICK = 30, STEPS = TOTAL / TICK;
    let step = 0;
    const id = setInterval(() => {
      step++;
      setPct(Math.min(100, Math.round((step / STEPS) * 100)));
      if (step >= STEPS) { clearInterval(id); setTimeout(() => setLoading(false), 200); }
    }, TICK);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="preloader"
            className="preloader-overlay scanline-container"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Grid + ambient */}
            <div className="preloader-grid" style={{ 
              backgroundImage: 'linear-gradient(rgba(123, 47, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(123, 47, 255, 0.08) 1px, transparent 1px)' 
            }} />
            <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(123,73,255,0.1) 0%, transparent 70%)',pointerEvents:'none' }} />

            {/* Corners */}
            <div className="corner-tl" /><div className="corner-tr" />
            <div className="corner-bl" /><div className="corner-br" />

            {/* Top dots */}
            <div style={{ position:'absolute',top:48,left:'50%',transform:'translateX(-50%)',display:'flex',gap:8,alignItems:'center' }}>
              {[0,1,2].map(i => (
                <motion.div key={i} style={{ width:6,height:6,borderRadius:'50%',background:'#7b2fff' }}
                  animate={{ opacity:[0.2,1,0.2] }} transition={{ duration:1.2,repeat:Infinity,delay:i*0.4 }}
                />
              ))}
            </div>

            {/* Spinner */}
            <div style={{ position:'relative',width:200,height:200,display:'flex',alignItems:'center',justifyContent:'center' }}>
              <div className="hex-ring hex-ring-1" />
              <div className="hex-ring hex-ring-2" />
              <div className="hex-ring hex-ring-3" />
              <div className="preloader-percent" style={{ color: '#b026ff', textShadow: '0 0 20px rgba(176, 38, 255, 0.6)' }}>
                {pct}<span style={{ fontSize:'0.65em', opacity:0.55 }}>%</span>
              </div>
            </div>

            {/* Name */}
            <div style={{ textAlign:'center',marginTop:28 }}>
              <div className="orbitron" style={{ fontSize:'1.05rem',fontWeight:700,letterSpacing:'0.3em',color:'#e0e0ee',textTransform:'uppercase' }}>
                Om Dipak Kanase
              </div>
              <div className="space-mono" style={{ fontSize:'0.6rem',letterSpacing:'0.25em',color:'rgba(176,38,255,0.55)',marginTop:6 }}>
                PORTFOLIO SYSTEM // BOOT SEQUENCE
              </div>
            </div>

            {/* Progress bar */}
            <div className="preloader-progress-track">
              <motion.div className="preloader-progress-fill" style={{ background: 'linear-gradient(90deg, #7b2fff, #b026ff)' }}
                initial={{ width:'0%' }}
                animate={{ width:`${pct}%` }}
                transition={{ ease:'linear' }}
              />
            </div>

            {/* Boot messages */}
            <div style={{ marginTop:16,minHeight:80,fontFamily:'Space Mono,monospace',fontSize:'0.62rem',color:'rgba(123,47,255,0.6)',width:280,textAlign:'left' }}>
              {BOOT.filter(b => pct >= b.at).map((b, i) => (
                <p key={i} className="boot-msg" style={{ color: 'rgba(176,38,255,0.7)' }}>{b.msg}</p>
              ))}
            </div>

            {/* Bottom label */}
            <div className="space-mono" style={{ position:'absolute',bottom:36,left:'50%',transform:'translateX(-50%)',fontSize:'0.55rem',color:'rgba(123,47,255,0.3)',letterSpacing:'0.2em',whiteSpace:'nowrap' }}>
              SYS // v2.5.0 // SECURE CONNECTION ESTABLISHED
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
