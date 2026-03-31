'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useVelocity, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the cursor follow
  const springConfig = { damping: 25, stiffness: 300 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Velocity for flash effect
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setCoords({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check velocity for flash (if moving fast)
      const speed = Math.sqrt(Math.pow(velocityX.get(), 2) + Math.pow(velocityY.get(), 2));
      if (speed > 2500 && !isFlashing) {
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 200);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        ['A', 'BUTTON'].includes(target.tagName) ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cyber-btn') ||
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
  }, [mounted, mouseX, mouseY, isVisible, velocityX, velocityY, isFlashing]);

  if (!mounted) return null;

  return (
    <div className="custom-cursor" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s' }}>
      {/* ── Main Follower Container ── */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: smoothX,
          y: smoothY,
          pointerEvents: 'none',
        }}
      >

        {/* ── Intense Core Glow (Diamond) ── */}
        <motion.div
           animate={{
             scale: isHovered ? 1.8 : 1,
             opacity: isHovered ? 0.9 : 0.6,
           }}
           transition={{
             scale: { type: 'spring', stiffness: 200 }
           }}
           style={{
             position: 'absolute',
             width: '20px',
             height: '20px',
             borderRadius: '2px',
             rotate: '45deg',
             background: '#b026ff',
             boxShadow: '0 0 15px 3px #b026ff',
             transform: 'translate(-50%, -50%)',
             pointerEvents: 'none',
             zIndex: -1,
           }}
        />

        {/* ── Central White Diamond ── */}
        <motion.div
          animate={{
            scale: isHovered ? 1.4 : 1,
            rotate: isHovered ? 135 : 45,
          }}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: '#fff',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Central White Dot (Offset) ── */}
        <motion.div
           className="cursor-dot"
           style={{ width: 3, height: 3, position:'absolute', top: -10, left: -10 }}
           animate={{
             scale: isHovered ? 1.5 : 1,
             backgroundColor: '#fff',
           }}
           transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />

        {/* ── Rotating Tech Ring (SVG) ── */}
        <motion.div
          animate={{
            rotate: 360,
            scale: isHovered ? 1.4 : 1,
          }}
          transition={{
            rotate: { repeat: Infinity, duration: 8, ease: 'linear' },
            scale: { type: 'spring', stiffness: 200 }
          }}
          style={{ position: 'absolute' }}
        >
          <svg width="28" height="28" viewBox="0 0 60 60" style={{ transform: 'translate(-50%,-50%)' }}>
            <circle cx="30" cy="30" r="28" stroke="rgba(176, 38, 255, 0.4)" strokeWidth="1" fill="none" strokeDasharray="4 4" />
            <path d="M 30 2 A 28 28 0 0 1 58 30" stroke="#b026ff" strokeWidth="2" fill="none" strokeDasharray="15 10" />
          </svg>
        </motion.div>

        {/* ── Brackets ── */}
        <motion.div
          animate={{
            width: isHovered ? 24 : 18,
            height: isHovered ? 24 : 18,
            opacity: isHovered ? 0.8 : 0.5,
          }}
          className="cursor-bracket"
          style={{ 
             border: 'none',
             borderTop: '1px solid #7b2fff',
             borderLeft: '1px solid #7b2fff',
             borderRadius: '1px 0 0 0',
             left: isHovered ? -12 : -9,
             top: isHovered ? -12 : -9,
             transform: 'none'
          }}
        />
        <motion.div
          animate={{
            width: isHovered ? 24 : 18,
            height: isHovered ? 24 : 18,
            opacity: isHovered ? 0.8 : 0.5,
          }}
          className="cursor-bracket"
          style={{ 
             border: 'none',
             borderBottom: '1px solid #b026ff',
             borderRight: '1px solid #b026ff',
             borderRadius: '0 0 1px 0',
             left: isHovered ? -12 : -9,
             top: isHovered ? -12 : -9,
             transform: 'translate(100%, 100%)',
             marginLeft: isHovered ? 24 : 18,
             marginTop: isHovered ? 24 : 18
          }}
        />

        {/* ── Coordinate Display ── */}
        <AnimatePresence>
          {!isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="cursor-coord"
              style={{ fontSize: '0.42rem', left: 8, top: 8 }}
            >
              LOC: {coords.x},{coords.y}<br />
              SYS_ACTIVE
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Flash Effect ── */}
        <AnimatePresence>
          {isFlashing && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: -30,
                left: -30,
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(123, 47, 255, 0.4)',
                filter: 'blur(10px)',
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
