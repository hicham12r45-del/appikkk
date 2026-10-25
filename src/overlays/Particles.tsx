import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {mulberry32} from '../anim/math';

interface BaseProps {
  /** شدة الظهور 0..1 */
  amount?: number;
  seed?: number;
}

/** ثلج متساقط بطبقات عمق مختلفة */
export const Snow: React.FC<BaseProps & {count?: number; wind?: number}> = ({amount = 1, seed = 3, count = 140, wind = 0.6}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const rand = mulberry32(seed);
  const flakes: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const depth = 0.3 + rand() * 0.7;
    const baseX = rand() * width;
    const baseY = rand() * height;
    const speed = 0.8 + depth * 2.4;
    const size = 1.2 + depth * 3.2;
    const phase = rand() * 6.28;
    const y = (baseY + frame * speed) % (height + 20);
    const x = (baseX + Math.sin(frame * 0.02 + phase) * 24 * depth + frame * wind * depth) % (width + 20);
    flakes.push(<circle key={i} cx={x} cy={y - 10} r={size} fill="#eef3f7" opacity={(0.25 + depth * 0.5) * amount} />);
  }
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {flakes}
      </svg>
    </AbsoluteFill>
  );
};

/** شرر وجمر صاعد (للمعارك والمشاعل) */
export const Embers: React.FC<BaseProps & {count?: number}> = ({amount = 1, seed = 8, count = 70}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const rand = mulberry32(seed);
  const items: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const baseX = rand() * width;
    const speed = 0.9 + rand() * 2.2;
    const size = 1 + rand() * 2.8;
    const phase = rand() * 100;
    const life = ((frame * speed * 0.01 + phase) % 1 + 1) % 1;
    const y = height - life * (height * 0.9);
    const x = baseX + Math.sin(frame * 0.04 + phase) * 30 + life * 60;
    const o = Math.sin(life * Math.PI) * 0.9 * amount;
    items.push(<circle key={i} cx={x} cy={y} r={size} fill={i % 3 === 0 ? '#ffd27a' : '#e0561f'} opacity={o} />);
  }
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {items}
      </svg>
    </AbsoluteFill>
  );
};

/** غبار ضوئي عائم */
export const DustMotes: React.FC<BaseProps & {count?: number}> = ({amount = 1, seed = 21, count = 60}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const rand = mulberry32(seed);
  const items: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const x0 = rand() * width;
    const y0 = rand() * height;
    const r = 1 + rand() * 2.4;
    const ph = rand() * 10;
    const x = x0 + Math.sin(frame * 0.013 + ph) * 40;
    const y = y0 + Math.cos(frame * 0.011 + ph * 1.3) * 30;
    const tw = 0.35 + 0.35 * Math.sin(frame * 0.05 + ph * 3);
    items.push(<circle key={i} cx={x} cy={y} r={r} fill="#f5ecd4" opacity={tw * 0.5 * amount} />);
  }
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {items}
      </svg>
    </AbsoluteFill>
  );
};

/** قصاصات ورق تتطاير (للمراسيم والبيانات) */
export const PaperScraps: React.FC<BaseProps & {count?: number}> = ({amount = 1, seed = 5, count = 26}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const rand = mulberry32(seed);
  const items: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const speed = 1.2 + rand() * 2.4;
    const baseX = rand() * width;
    const baseY = rand() * height;
    const rot = rand() * 360;
    const w = 14 + rand() * 22;
    const h = 10 + rand() * 18;
    const y = (baseY + frame * speed) % (height + 60);
    const x = baseX + Math.sin(frame * 0.03 + i) * 60;
    const r = rot + frame * (1 + (i % 4));
    items.push(
      <rect
        key={i}
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        fill="#e9dcc0"
        opacity={0.55 * amount}
        transform={`translate(${x} ${y - 30}) rotate(${r})`}
      />,
    );
  }
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {items}
      </svg>
    </AbsoluteFill>
  );
};
