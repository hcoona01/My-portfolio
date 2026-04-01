'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';

const LEAF_TYPES = [
  { src: '/assets/leaves/branch.png', size: 120, weight: 1.5 },
  { src: '/assets/leaves/leaf-small.png', size: 40, weight: 0.8 },
  { src: '/assets/leaves/leaf-large.png', size: 80, weight: 1.2 },
];

const LEAF_COUNT = 25;

interface LeafProps {
  type: typeof LEAF_TYPES[0];
  initialX: number;
  duration: number;
  delay: number;
  swayAmplitude: number;
  rotationSpeed: number;
  mouseX: any;
  mouseY: any;
  clickX: any;
  clickY: any;
  clickTime: any;
}

function Leaf({ 
  type, 
  initialX, 
  duration, 
  delay, 
  swayAmplitude, 
  rotationSpeed,
  mouseX,
  mouseY,
  clickX,
  clickY,
  clickTime
}: LeafProps) {
  const leafRef = useRef<HTMLDivElement>(null);
  
  // Motion values for interactivity
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const extraRotation = useMotionValue(0);
  
  // Spring for smooth physics
  const springX = useSpring(offsetX, { stiffness: 60, damping: 20 });
  const springY = useSpring(offsetY, { stiffness: 60, damping: 20 });
  const springRot = useSpring(extraRotation, { stiffness: 40, damping: 15 });

  useAnimationFrame(() => {
    if (!leafRef.current) return;
    
    // Get current position of the leaf relative to viewport
    const rect = leafRef.current.getBoundingClientRect();
    const leafCenterX = rect.left + rect.width / 2;
    const leafCenterY = rect.top + rect.height / 2;
    
    // ── 1. MOUSE REPULSION ──
    const mDx = leafCenterX - mouseX.get();
    const mDy = leafCenterY - mouseY.get();
    const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
    
    let totalPushX = 0;
    let totalPushY = 0;
    let totalExtraRot = 0;

    const mThreshold = 250; 
    if (mDist < mThreshold) {
      const force = (mThreshold - mDist) / mThreshold;
      totalPushX += (mDx / mDist) * 80 * force;
      totalPushY += (mDy / mDist) * 80 * force;
      totalExtraRot += rotationSpeed * 5 * force;
    }

    // ── 2. CLICK BURST (WIND BLOW) ──
    const timeSinceClick = Date.now() - clickTime.get();
    const burstDuration = 1200; // Total effect time in ms
    
    if (timeSinceClick < burstDuration) {
      const cDx = leafCenterX - clickX.get();
      const cDy = leafCenterY - clickY.get();
      const cDist = Math.sqrt(cDx * cDx + cDy * cDy);
      const cThreshold = 700; // Radius of wind blow
      
      if (cDist < cThreshold) {
        // Time decay: strongest at 0ms, fades by burstDuration
        const timeDecay = Math.pow(1 - timeSinceClick / burstDuration, 2);
        // Distance decay: strongest at center
        const distFactor = (cThreshold - cDist) / cThreshold;
        
        const burstForce = 600 * distFactor * timeDecay;
        totalPushX += (cDx / cDist) * burstForce;
        totalPushY += (cDy / cDist) * burstForce;
        totalExtraRot += rotationSpeed * 30 * distFactor * timeDecay;
      }
    }

    offsetX.set(totalPushX);
    offsetY.set(totalPushY);
    extraRotation.set(totalExtraRot);
  });

  return (
    <motion.div
      ref={leafRef}
      initial={{ 
        y: '-20vh', 
        rotate: 0,
        opacity: 0 
      }}
      animate={{ 
        y: '120vh',
        rotate: 360 * rotationSpeed,
        opacity: [0, 0.6, 0.6, 0] // Fade in and out
      }}
      transition={{ 
        y: { duration, repeat: Infinity, ease: 'linear', delay },
        rotate: { duration: duration * 0.8, repeat: Infinity, ease: 'linear', delay },
        opacity: { duration, repeat: Infinity, ease: 'linear', delay }
      }}
      style={{
        position: 'fixed',
        left: `${initialX}%`,
        top: 0,
        zIndex: 1,
        pointerEvents: 'none',
        width: type.size,
        height: 'auto',
        willChange: 'transform',
      }}
    >
      <motion.div
        style={{
          x: springX,
          y: springY,
          rotate: springRot,
        }}
      >
        <motion.div
          animate={{ x: [-swayAmplitude, swayAmplitude] }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            repeatType: 'reverse', 
            ease: 'easeInOut',
            delay: delay
          }}
        >
          <img 
            src={type.src} 
            alt="Falling leaf" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              filter: 'sepia(40%) contrast(90%) brightness(1.1) blur(0.4px)', // Aesthetic adjustment
              opacity: 0.7 
            }} 
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function FallingLeaves() {
  const mouseX = useMotionValue(-1000); 
  const mouseY = useMotionValue(-1000);
  const clickX = useMotionValue(-1000);
  const clickY = useMotionValue(-1000);
  const clickTime = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    const handleClick = (e: MouseEvent) => {
      clickX.set(e.clientX);
      clickY.set(e.clientY);
      clickTime.set(Date.now());
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClick); // mousedown feels more responsive for burst
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
    };
  }, [mouseX, mouseY, clickX, clickY, clickTime]);

  const leaves = useMemo(() => {
    return Array.from({ length: LEAF_COUNT }).map((_, i) => {
      // Weighted selection to reduce maple leaf count (index 2)
      // indices: 0 (branch), 1 (small leaf), 2 (maple)
      const weights = [0.44, 0.52, 0.04]; // Only 4% maple leaves
      const random = Math.random();
      let typeIndex = 0;
      let sum = 0;
      for (let j = 0; j < weights.length; j++) {
        sum += weights[j];
        if (random < sum) {
          typeIndex = j;
          break;
        }
      }

      return {
        id: i,
        type: LEAF_TYPES[typeIndex],
        initialX: Math.random() * 100,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 25,
        swayAmplitude: 20 + Math.random() * 60,
        rotationSpeed: (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 1.5),
      };
    });
  }, []);

  return (
    <div className="falling-leaves-container" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {leaves.map((leaf) => (
        <Leaf 
          key={leaf.id} 
          {...leaf} 
          mouseX={mouseX} 
          mouseY={mouseY}
          clickX={clickX}
          clickY={clickY}
          clickTime={clickTime}
        />
      ))}
    </div>
  );
}
