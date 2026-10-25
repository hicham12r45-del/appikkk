import React from 'react';
import {PAL} from './palette';
import {mulberry32} from '../anim/math';

/** أفق مدينة (بتروغراد) بصورة ظلية متدرجة مع نوافذ مضاءة */
export const CitySkyline: React.FC<{
  width: number;
  baseY: number;
  height: number;
  seed?: number;
  color?: string;
  windows?: boolean;
  frame?: number;
  litAmount?: number;
}> = ({width, baseY, height, seed = 1, color = '#101014', windows = true, frame = 0, litAmount = 0.35}) => {
  const rand = mulberry32(seed);
  const blocks: React.ReactNode[] = [];
  let x = -20;
  let idx = 0;
  while (x < width + 20) {
    const w = 60 + rand() * 120;
    const h = height * (0.35 + rand() * 0.65);
    const roof = rand();
    blocks.push(<rect key={`b${idx}`} x={x} y={baseY - h} width={w} height={h} fill={color} />);
    if (roof > 0.7) {
      blocks.push(
        <polygon key={`r${idx}`} points={`${x},${baseY - h} ${x + w / 2},${baseY - h - 34} ${x + w},${baseY - h}`} fill={color} />,
      );
    } else if (roof > 0.45) {
      blocks.push(<rect key={`t${idx}`} x={x + w * 0.4} y={baseY - h - 38} width={w * 0.14} height={38} fill={color} />);
      blocks.push(<circle key={`c${idx}`} cx={x + w * 0.47} cy={baseY - h - 44} r={9} fill={color} />);
    }
    if (windows) {
      const cols = Math.max(2, Math.floor(w / 24));
      const rows = Math.max(2, Math.floor(h / 36));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lit = rand() < litAmount;
          if (!lit) continue;
          const flicker = 0.7 + 0.3 * Math.sin(frame * 0.05 + idx * 3 + r * 1.7 + c);
          blocks.push(
            <rect
              key={`w${idx}-${r}-${c}`}
              x={x + 10 + c * ((w - 20) / cols)}
              y={baseY - h + 14 + r * ((h - 28) / rows)}
              width={8}
              height={12}
              fill={PAL.gold}
              opacity={0.55 * flicker}
            />,
          );
        }
      }
    }
    x += w - 4;
    idx++;
  }
  return <g>{blocks}</g>;
};

/** قصر الشتاء بصورة ظلية مبسطة: واجهة طويلة بأعمدة وقبّة وأجنحة، مع نوافذ تضيء تدريجياً */
export const PalaceSilhouette: React.FC<{
  x: number;
  baseY: number;
  width: number;
  height: number;
  frame: number;
  lit: number; // 0..1 نسبة النوافذ المضاءة
  color?: string;
}> = ({x, baseY, width, height, frame, lit, color = '#0f0f13'}) => {
  const cols = 22;
  const rows = 3;
  const wins: React.ReactNode[] = [];
  const rand = mulberry32(77);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const threshold = rand();
      const on = threshold < lit;
      const wx = x + 40 + c * ((width - 80) / cols);
      const wy = baseY - height * 0.78 + r * (height * 0.22);
      wins.push(
        <g key={`${r}-${c}`}>
          <rect x={wx} y={wy} width={(width - 80) / cols - 12} height={height * 0.14} fill="#1b1b20" />
          {on && (
            <rect
              x={wx}
              y={wy}
              width={(width - 80) / cols - 12}
              height={height * 0.14}
              fill={PAL.gold}
              opacity={0.55 + 0.25 * Math.sin(frame * 0.2 + c + r)}
            />
          )}
        </g>,
      );
    }
  }
  const columns: React.ReactNode[] = [];
  for (let i = 0; i < 26; i++) {
    columns.push(<rect key={i} x={x + 30 + i * ((width - 60) / 26)} y={baseY - height * 0.84} width={7} height={height * 0.84} fill="#1a1a20" />);
  }
  return (
    <g>
      <rect x={x} y={baseY - height} width={width} height={height} fill={color} />
      <rect x={x - 10} y={baseY - height - 14} width={width + 20} height={16} fill={color} />
      {columns}
      {wins}
      {/* القبّة المركزية */}
      <rect x={x + width * 0.44} y={baseY - height - 90} width={width * 0.12} height={80} fill={color} />
      <path
        d={`M ${x + width * 0.43} ${baseY - height - 90} Q ${x + width * 0.5} ${baseY - height - 190} ${x + width * 0.57} ${baseY - height - 90} Z`}
        fill={color}
      />
      <line x1={x + width * 0.5} y1={baseY - height - 176} x2={x + width * 0.5} y2={baseY - height - 210} stroke={color} strokeWidth={4} />
      {/* تماثيل السطح */}
      {Array.from({length: 14}, (_, i) => (
        <rect key={i} x={x + 40 + i * ((width - 80) / 14)} y={baseY - height - 34} width={6} height={20} fill={color} />
      ))}
    </g>
  );
};

/** مصنع بمداخن تدخّن */
export const Factory: React.FC<{x: number; baseY: number; scale?: number; frame: number; color?: string}> = ({
  x,
  baseY,
  scale = 1,
  frame,
  color = '#121216',
}) => {
  const smoke = (cx: number, cy: number, seed: number) => {
    const puffs: React.ReactNode[] = [];
    for (let i = 0; i < 8; i++) {
      const life = ((frame + i * 15 + seed * 31) % 120) / 120;
      puffs.push(
        <circle
          key={i}
          cx={cx + life * 70 + Math.sin(life * 5 + i) * 8}
          cy={cy - life * 220}
          r={14 + life * 40}
          fill="#2e2e36"
          opacity={(1 - life) * 0.55}
        />,
      );
    }
    return puffs;
  };
  return (
    <g transform={`translate(${x} ${baseY}) scale(${scale})`}>
      {smoke(40, -340, 0)}
      {smoke(130, -300, 1)}
      <rect x={0} y={-200} width={300} height={200} fill={color} />
      <path d="M 0 -200 L 60 -250 L 60 -200 Z M 60 -200 L 120 -250 L 120 -200 Z M 120 -200 L 180 -250 L 180 -200 Z M 180 -200 L 240 -250 L 240 -200 Z" fill={color} />
      <rect x={30} y={-340} width={26} height={140} fill={color} />
      <rect x={120} y={-300} width={22} height={100} fill={color} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={24 + i * 54} y={-150} width={30} height={40} fill={PAL.gold} opacity={0.35 + 0.2 * Math.sin(frame * 0.07 + i)} />
      ))}
    </g>
  );
};

/** جسر معدني (للسيطرة على الجسور) مع إضاءة متحركة */
export const Bridge: React.FC<{x: number; y: number; width: number; frame: number; open?: number}> = ({x, y, width, frame, open = 0}) => {
  const trusses: React.ReactNode[] = [];
  const n = 12;
  for (let i = 0; i < n; i++) {
    const x0 = (i / n) * width;
    const x1 = ((i + 1) / n) * width;
    trusses.push(<line key={`a${i}`} x1={x0} y1={0} x2={x1} y2={-70} stroke="#16161b" strokeWidth={5} />);
    trusses.push(<line key={`b${i}`} x1={x1} y1={-70} x2={x1} y2={0} stroke="#16161b" strokeWidth={5} />);
  }
  const lamps: React.ReactNode[] = [];
  for (let i = 0; i <= 6; i++) {
    const lx = (i / 6) * width;
    lamps.push(
      <g key={i}>
        <line x1={lx} y1={0} x2={lx} y2={-110} stroke="#16161b" strokeWidth={4} />
        <circle cx={lx} cy={-116} r={9} fill={PAL.gold} opacity={0.6 + 0.3 * Math.sin(frame * 0.1 + i)} />
        <circle cx={lx} cy={-116} r={30} fill={PAL.gold} opacity={0.08} />
      </g>,
    );
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`rotate(${-open * 40} 0 0)`}>
        <rect x={0} y={0} width={width} height={14} fill="#16161b" />
        {trusses}
        {lamps}
      </g>
      <rect x={-18} y={0} width={30} height={160} fill="#0e0e12" />
      <rect x={width - 12} y={0} width={30} height={160} fill="#0e0e12" />
    </g>
  );
};

/** محطة سكة حديد بسقف مقوّس */
export const Station: React.FC<{x: number; baseY: number; width: number; frame: number}> = ({x, baseY, width, frame}) => {
  const ribs: React.ReactNode[] = [];
  for (let i = 0; i <= 10; i++) {
    const rx = x + (i / 10) * width;
    ribs.push(<path key={i} d={`M ${rx} ${baseY} Q ${rx} ${baseY - 220} ${x + width / 2} ${baseY - 260}`} stroke="#1c1c22" strokeWidth={4} fill="none" />);
  }
  return (
    <g>
      <path d={`M ${x} ${baseY} Q ${x + width / 2} ${baseY - 330} ${x + width} ${baseY} Z`} fill="#0f0f13" />
      {ribs}
      <circle cx={x + width / 2} cy={baseY - 130} r={44} fill={PAL.charcoal} stroke={PAL.gold} strokeWidth={4} />
      <line x1={x + width / 2} y1={baseY - 130} x2={x + width / 2 + Math.cos(frame * 0.02) * 28} y2={baseY - 130 + Math.sin(frame * 0.02) * 28} stroke={PAL.offWhite} strokeWidth={4} />
      <rect x={x} y={baseY - 10} width={width} height={10} fill="#07070a" />
    </g>
  );
};
