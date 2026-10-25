import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, fbm1D, mulberry32} from '../anim/math';

/** خدوش عمودية وغبار على شريط الفيلم القديم */
export const FilmScratches: React.FC<{amount?: number}> = ({amount = 1}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const step = Math.floor(frame / 2);
  const rand = mulberry32(step * 9973 + 13);
  const items: React.ReactNode[] = [];
  const scratchCount = rand() < 0.35 ? 1 + Math.floor(rand() * 2) : 0;
  for (let i = 0; i < scratchCount; i++) {
    const x = rand() * width;
    const len = height * (0.3 + rand() * 0.7);
    const y0 = rand() * (height - len);
    items.push(<line key={`s${i}`} x1={x} y1={y0} x2={x + (rand() - 0.5) * 6} y2={y0 + len} stroke="#f2ead7" strokeWidth={1 + rand() * 1.2} opacity={0.18 * amount} />);
  }
  const specks = 6 + Math.floor(rand() * 8);
  for (let i = 0; i < specks; i++) {
    items.push(<circle key={`d${i}`} cx={rand() * width} cy={rand() * height} r={0.6 + rand() * 2.2} fill={rand() < 0.5 ? '#0a0a0a' : '#f2ead7'} opacity={(0.25 + rand() * 0.35) * amount} />);
  }
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {items}
      </svg>
    </AbsoluteFill>
  );
};

/** ومضة خفيفة كمصباح العارض القديم */
export const ProjectorFlicker: React.FC<{amount?: number}> = ({amount = 1}) => {
  const frame = useCurrentFrame();
  const v = fbm1D(frame * 0.35, 12, 2) * 0.5 + 0.5;
  const o = clamp((v - 0.5) * 0.12, 0, 0.1) * amount;
  return <AbsoluteFill style={{backgroundColor: '#fff3d6', opacity: o, mixBlendMode: 'overlay', pointerEvents: 'none'}} />;
};

/** تسرّب ضوء دافئ يتحرك من الحافة */
export const LightLeak: React.FC<{amount?: number; hue?: 'warm' | 'red'}> = ({amount = 1, hue = 'warm'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const drift = Math.sin(frame * 0.01) * 0.5 + 0.5;
  const c1 = hue === 'warm' ? 'rgba(255,170,70,0.55)' : 'rgba(210,40,35,0.5)';
  const c2 = hue === 'warm' ? 'rgba(255,90,40,0)' : 'rgba(120,10,10,0)';
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        opacity: 0.35 * amount,
        background: `radial-gradient(ellipse ${width * 0.5}px ${height * 0.7}px at ${drift * 25}% ${30 + drift * 20}%, ${c1}, ${c2} 70%)`,
      }}
    />
  );
};

/** شريطان سينمائيان أعلى وأسفل الشاشة */
export const Letterbox: React.FC<{size?: number; progress?: number}> = ({size = 70, progress = 1}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: size * progress, backgroundColor: '#000'}} />
    <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: size * progress, backgroundColor: '#000'}} />
  </AbsoluteFill>
);

/** اهتزاز طفيف جداً للكاميرا اليدوية على المحتوى المغلّف */
export const useHandheld = (amount = 1): {x: number; y: number; r: number} => {
  const frame = useCurrentFrame();
  return {
    x: fbm1D(frame * 0.03, 31) * 3.2 * amount,
    y: fbm1D(frame * 0.027, 47) * 2.6 * amount,
    r: fbm1D(frame * 0.02, 63) * 0.12 * amount,
  };
};
