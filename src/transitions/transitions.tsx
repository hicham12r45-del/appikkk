import React from 'react';
import type {CSSProperties} from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp, easeInOutCubic, easeOutCubic, pulse, smoothstep} from '../anim/math';
import {PAL} from '../art/palette';
import type {Transition} from '../types';

/** عدد إطارات المزج لكل نوع انتقال (يبدأ المشهد الجديد قبل نقطة القطع بهذا العدد) */
export const transitionLead = (t: Transition): number => {
  switch (t) {
    case 'fade':
      return 24;
    case 'dissolve':
      return 20;
    case 'dipBlack':
      return 30;
    case 'wipeRight':
    case 'wipeLeft':
      return 28;
    case 'iris':
      return 34;
    case 'blinds':
      return 30;
    case 'slideRed':
      return 32;
    case 'filmBurn':
      return 26;
    case 'inkBlot':
      return 38;
  }
};

const blindsPolygon = (p: number, strips: number): string => {
  const h = 100 / strips;
  const pts: string[] = [];
  for (let i = 0; i < strips; i++) {
    const y0 = i * h;
    const y1 = y0 + h * p;
    pts.push(`0% ${y0}%`, `100% ${y0}%`, `100% ${y1}%`, `0% ${y1}%`);
  }
  return `polygon(${pts.join(',')})`;
};

/** نمط CSS للمشهد القادم أثناء الانتقال؛ p من 0 إلى 1 */
export const transitionStyle = (t: Transition, pIn: number): CSSProperties => {
  const p = clamp(pIn);
  switch (t) {
    case 'fade':
    case 'dissolve':
      return {opacity: smoothstep(p)};
    case 'dipBlack':
      // المشهد الجديد يظهر في النصف الثاني فقط، والنصف الأول يعتّم القديم
      return {opacity: p < 0.5 ? 0 : smoothstep((p - 0.5) * 2)};
    case 'wipeRight': {
      const k = easeInOutCubic(p) * 100;
      return {clipPath: `inset(0 ${100 - k}% 0 0)`};
    }
    case 'wipeLeft': {
      const k = easeInOutCubic(p) * 100;
      return {clipPath: `inset(0 0 0 ${100 - k}%)`};
    }
    case 'iris': {
      const r = easeInOutCubic(p) * 80;
      return {clipPath: `circle(${r}% at 50% 50%)`};
    }
    case 'blinds':
      return {clipPath: blindsPolygon(easeInOutCubic(p), 8)};
    case 'slideRed': {
      const k = easeInOutCubic(p) * 100;
      return {clipPath: `inset(0 0 0 ${100 - k}%)`};
    }
    case 'filmBurn':
      return {opacity: smoothstep((p - 0.35) / 0.65)};
    case 'inkBlot': {
      const r = easeOutCubic(p) * 95;
      return {clipPath: `circle(${r}% at 22% 78%)`};
    }
  }
};

/** عناصر مرئية فوق المشهد الجديد أثناء الانتقال (شريط أحمر، وميض حرق الفيلم، حواف الحبر ...) */
export const TransitionOverlay: React.FC<{type: Transition; progress: number}> = ({type, progress}) => {
  const p = clamp(progress);
  if (p <= 0 || p >= 1) return null;
  switch (type) {
    case 'dipBlack':
      return <AbsoluteFill style={{backgroundColor: '#000', opacity: pulse(p, 0.5), pointerEvents: 'none'}} />;
    case 'slideRed': {
      const k = easeInOutCubic(p) * 100;
      return (
        <AbsoluteFill style={{pointerEvents: 'none'}}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${100 - k - 3}%`,
              width: '3%',
              background: `linear-gradient(90deg, ${PAL.redDeep}, ${PAL.redBright}, ${PAL.redDeep})`,
              boxShadow: '0 0 40px rgba(209,46,43,0.7)',
            }}
          />
        </AbsoluteFill>
      );
    }
    case 'wipeRight':
    case 'wipeLeft': {
      const k = easeInOutCubic(p) * 100;
      const left = type === 'wipeRight' ? `${k - 0.4}%` : `${100 - k - 0.4}%`;
      return (
        <AbsoluteFill style={{pointerEvents: 'none'}}>
          <div style={{position: 'absolute', top: 0, bottom: 0, left, width: '0.8%', backgroundColor: 'rgba(241,233,218,0.8)'}} />
        </AbsoluteFill>
      );
    }
    case 'iris': {
      const r = easeInOutCubic(p) * 80;
      return (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) ${Math.max(0, r - 4)}%, rgba(0,0,0,0.55) ${r}%, rgba(0,0,0,0) ${r + 6}%)`,
          }}
        />
      );
    }
    case 'filmBurn': {
      const o = pulse(p, 0.45);
      return (
        <AbsoluteFill style={{pointerEvents: 'none'}}>
          <AbsoluteFill
            style={{
              opacity: o,
              mixBlendMode: 'screen',
              background:
                'radial-gradient(ellipse at 30% 40%, rgba(255,240,200,1), rgba(255,160,60,0.95) 35%, rgba(200,50,20,0.7) 65%, rgba(60,0,0,0) 100%)',
            }}
          />
        </AbsoluteFill>
      );
    }
    case 'inkBlot': {
      const r = easeOutCubic(p) * 95;
      return (
        <AbsoluteFill
          style={{
            pointerEvents: 'none',
            background: `radial-gradient(circle at 22% 78%, rgba(0,0,0,0) ${Math.max(0, r - 3)}%, rgba(8,6,6,0.9) ${r}%, rgba(0,0,0,0) ${r + 5}%)`,
          }}
        />
      );
    }
    default:
      return null;
  }
};
