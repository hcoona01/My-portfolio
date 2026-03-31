'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setCoords({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('lustrous')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="custom-cursor" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 99999 }}>
      {/* ── Main Transform Group ── */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          position: 'absolute',
          translateX: '-50%',
          translateY: '-50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* ── Outer Tech Ring ── */}
        <motion.div
           animate={{ scale: isHovered ? 1.2 : 1, rotate: 360 }}
           transition={{ rotate: { repeat: Infinity, duration: 10, ease: 'linear' } }}
           style={{
             position: 'absolute',
             width: 48,
             height: 48,
             borderRadius: '50%',
             border: '1px dashed rgba(140, 110, 80, 0.3)',
           }}
        />

        {/* ── Dynamic Diamond Core ── */}
        <motion.div
            animate={{
              rotate: isHovered ? 135 : 45,
              scale: isHovered ? 1.5 : 1,
            }}
            style={{
              position: 'absolute',
              width: 16,
              height: 16,
              background: '#1b1b1b', /* Carbon Ink */
              borderRadius: 2,
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            }}
        />

        {/* ── Central Bronze Dot ── */}
        <motion.div
           animate={{ scale: isHovered ? 2 : 1 }}
           style={{
             position: 'absolute',
             width: 4,
             height: 4,
             borderRadius: '50%',
             background: '#8c6e50', /* Antique Bronze */
             zIndex: 2,
           }}
        />

        {/* ── Brackets (Strict Centering) ── */}
        <div style={{ position: 'absolute', width: 40, height: 40 }}>
           {/* Top Left */}
           <motion.div 
             animate={{ x: isHovered ? -4 : 0, y: isHovered ? -4 : 0 }}
             style={{ position:'absolute', top:0, left:0, width:10, height:10, borderTop:'1.5px solid #8c6e50', borderLeft:'1.5px solid #8c6e50' }} 
           />
           {/* Bottom Right */}
           <motion.div 
             animate={{ x: isHovered ? 4 : 0, y: isHovered ? 4 : 0 }}
             style={{ position:'absolute', bottom:0, right:0, width:10, height:10, borderBottom:'1.5px solid #8c6e50', borderRight:'1.5px solid #8c6e50' }} 
           />
        </div>

        {/* ── Floating Tech Info (Offset) ── */}
        <motion.div
           animate={{ opacity: isHovered ? 0 : 1, x: 20, y: 20 }}
           className="cursor-coord"
           style={{ 
             position: 'absolute',
             fontSize: '0.45rem', 
             color: '#1b1b1b', 
             fontWeight: 700,
             whiteSpace: 'nowrap',
             fontFamily: 'Space Mono, monospace'
           }}
        >
          LOC: {Math.round(coords.x)},{Math.round(coords.y)}<br />
          SYS_ACTIVE
        </motion.div>
      </motion.div>
    </div>
  );
}
