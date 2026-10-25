import React from 'react';
import {PAL} from './palette';
import {degToRad, polar} from '../anim/math';

/** نجمة خماسية */
export const Star: React.FC<{cx: number; cy: number; r: number; fill?: string; rotate?: number; inner?: number}> = ({
  cx,
  cy,
  r,
  fill = PAL.redBright,
  rotate = -90,
  inner = 0.4,
}) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * inner;
    const [px, py] = polar(cx, cy, rad, rotate + i * 36);
    pts.push(`${px.toFixed(2)},${py.toFixed(2)}`);
  }
  return <polygon points={pts.join(' ')} fill={fill} />;
};

/** المطرقة والمنجل — رمز هندسي مبسط مرسوم من الأشكال الأساسية */
export const HammerSickle: React.FC<{cx: number; cy: number; size: number; fill?: string}> = ({
  cx,
  cy,
  size,
  fill = PAL.gold,
}) => {
  const s = size / 100;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`} fill={fill}>
      {/* مقبض المطرقة */}
      <g transform="rotate(38)">
        <rect x={-5} y={-48} width={10} height={104} rx={4} />
        <rect x={-26} y={-58} width={52} height={22} rx={4} />
      </g>
      {/* المنجل */}
      <g transform="rotate(-35)">
        <rect x={-4} y={-6} width={8} height={62} rx={3} />
        <path d="M 0 -6 C -50 -14 -62 -62 -18 -86 C -44 -62 -30 -34 4 -26 Z" />
      </g>
    </g>
  );
};

/** تاج إمبراطوري مبسط */
export const Crown: React.FC<{cx: number; cy: number; size: number; crack?: number; opacity?: number}> = ({
  cx,
  cy,
  size,
  crack = 0,
  opacity = 1,
}) => {
  const s = size / 100;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`} opacity={opacity}>
      <path d="M -60 40 L -66 -22 L -34 8 L -14 -40 L 0 6 L 14 -40 L 34 8 L 66 -22 L 60 40 Z" fill={PAL.gold} stroke={PAL.goldDeep} strokeWidth={3} />
      <rect x={-62} y={34} width={124} height={22} rx={6} fill={PAL.goldDeep} />
      <circle cx={-66} cy={-26} r={7} fill={PAL.gold} />
      <circle cx={66} cy={-26} r={7} fill={PAL.gold} />
      <circle cx={0} cy={-44} r={8} fill={PAL.redBright} />
      <circle cx={-14} cy={-44} r={6} fill={PAL.gold} />
      <circle cx={14} cy={-44} r={6} fill={PAL.gold} />
      {[-36, -12, 12, 36].map((gx) => (
        <circle key={gx} cx={gx} cy={45} r={5} fill={PAL.redBright} stroke={PAL.goldDeep} strokeWidth={1.5} />
      ))}
      {crack > 0 && (
        <path
          d={`M 4 -42 L ${-6 * crack} ${-10 * crack} L ${8 * crack} ${14 * crack} L ${-4 * crack} ${34 * crack} L ${6 * crack} ${58 * crack}`}
          fill="none"
          stroke={PAL.ink}
          strokeWidth={3.4}
          strokeLinejoin="round"
        />
      )}
    </g>
  );
};

/** رغيف خبز */
export const Loaf: React.FC<{cx: number; cy: number; size: number; rotate?: number}> = ({cx, cy, size, rotate = 0}) => {
  const s = size / 100;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={50} ry={28} fill="#b27c3a" />
      <ellipse cx={0} cy={-6} rx={44} ry={19} fill="#c68f4b" />
      {[-24, -8, 8, 24].map((lx) => (
        <path key={lx} d={`M ${lx - 6} -16 Q ${lx} -4 ${lx + 6} -16`} stroke="#8a5a22" strokeWidth={3} fill="none" strokeLinecap="round" />
      ))}
    </g>
  );
};

/** سنبلة قمح */
export const WheatEar: React.FC<{cx: number; cy: number; size: number; rotate?: number; sway?: number}> = ({
  cx,
  cy,
  size,
  rotate = 0,
  sway = 0,
}) => {
  const s = size / 100;
  const grains: React.ReactNode[] = [];
  for (let i = 0; i < 7; i++) {
    const gy = -60 + i * 14;
    grains.push(<ellipse key={`l${i}`} cx={-9} cy={gy} rx={5} ry={10} transform={`rotate(-25 -9 ${gy})`} fill={PAL.gold} />);
    grains.push(<ellipse key={`r${i}`} cx={9} cy={gy} rx={5} ry={10} transform={`rotate(25 9 ${gy})`} fill={PAL.gold} />);
  }
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate + sway}) scale(${s})`}>
      <line x1={0} y1={-70} x2={0} y2={90} stroke={PAL.goldDeep} strokeWidth={4} strokeLinecap="round" />
      {grains}
      <ellipse cx={0} cy={-78} rx={5} ry={10} fill={PAL.gold} />
    </g>
  );
};

/** حمامة سلام مبسطة (للشعار: السلام) */
export const Dove: React.FC<{cx: number; cy: number; size: number; flap: number; fill?: string}> = ({
  cx,
  cy,
  size,
  flap,
  fill = PAL.offWhite,
}) => {
  const s = size / 100;
  const wing = Math.sin(flap) * 24;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`} fill={fill}>
      <ellipse cx={0} cy={0} rx={34} ry={15} />
      <circle cx={34} cy={-8} r={11} />
      <path d="M 44 -8 L 58 -4 L 44 -2 Z" fill={PAL.gold} />
      <path d="M -30 2 L -62 14 L -58 -2 L -28 -6 Z" />
      <path d={`M -4 -6 Q -18 ${-42 - wing} -52 ${-40 - wing} Q -30 ${-22 - wing * 0.4} -6 6 Z`} />
      <path d={`M 6 -6 Q 22 ${-34 - wing} 52 ${-32 - wing} Q 30 ${-14 - wing * 0.4} 10 6 Z`} opacity={0.85} />
      <circle cx={38} cy={-10} r={2} fill={PAL.ink} />
    </g>
  );
};

/** شعلة مشعل */
export const Torch: React.FC<{cx: number; cy: number; size: number; frame: number; seed?: number}> = ({
  cx,
  cy,
  size,
  frame,
  seed = 0,
}) => {
  const s = size / 100;
  const flick = Math.sin(frame * 0.7 + seed) * 5 + Math.sin(frame * 1.3 + seed * 2) * 3;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <rect x={-5} y={0} width={10} height={90} rx={3} fill="#4a3322" />
      <path d={`M -14 4 L 14 4 L 10 -10 L -10 -10 Z`} fill="#2d2118" />
      <path d={`M 0 ${-70 - flick} C 24 -40 22 -18 0 -10 C -22 -18 -24 -40 0 ${-70 - flick} Z`} fill={PAL.redBright} />
      <path d={`M 0 ${-52 - flick * 0.6} C 14 -34 12 -20 0 -12 C -12 -20 -14 -34 0 ${-52 - flick * 0.6} Z`} fill="#f0a73a" />
      <path d={`M 0 ${-36 - flick * 0.3} C 7 -26 6 -18 0 -14 C -6 -18 -7 -26 0 ${-36 - flick * 0.3} Z`} fill="#ffe29a" />
    </g>
  );
};

/** ساعة حائط بعقارب متحركة */
export const ClockFace: React.FC<{cx: number; cy: number; r: number; hour: number; minute: number}> = ({
  cx,
  cy,
  r,
  hour,
  minute,
}) => {
  const ticks: React.ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    const [x1, y1] = polar(cx, cy, r * 0.84, i * 30 - 90);
    const [x2, y2] = polar(cx, cy, r * 0.94, i * 30 - 90);
    ticks.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={PAL.parchment} strokeWidth={i % 3 === 0 ? 4 : 2} />);
  }
  const hDeg = ((hour % 12) + minute / 60) * 30 - 90;
  const mDeg = minute * 6 - 90;
  const [hx, hy] = polar(cx, cy, r * 0.5, hDeg);
  const [mx, my] = polar(cx, cy, r * 0.76, mDeg);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={PAL.charcoal} stroke={PAL.gold} strokeWidth={r * 0.05} />
      {ticks}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke={PAL.offWhite} strokeWidth={r * 0.06} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={mx} y2={my} stroke={PAL.offWhite} strokeWidth={r * 0.04} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r * 0.05} fill={PAL.redBright} />
    </g>
  );
};

/** قاطرة بخارية جانبية مع دخان وعجلات دوّارة */
export const Locomotive: React.FC<{x: number; y: number; scale?: number; frame: number; flip?: boolean}> = ({
  x,
  y,
  scale = 1,
  frame,
  flip = false,
}) => {
  const wheelAngle = frame * 9;
  const spokes = (cx: number, cy: number, r: number) =>
    [0, 60, 120].map((a) => {
      const [x1, y1] = polar(cx, cy, r, a + wheelAngle);
      const [x2, y2] = polar(cx, cy, r, a + 180 + wheelAngle);
      return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={PAL.ash} strokeWidth={3} />;
    });
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {/* المرجل */}
      <rect x={-120} y={-92} width={170} height={64} rx={30} fill="#1b1b1f" />
      <rect x={-130} y={-96} width={40} height={20} rx={4} fill="#101013" />
      {/* المدخنة */}
      <path d="M -108 -92 L -96 -92 L -92 -128 L -112 -128 Z" fill="#101013" />
      <rect x={-118} y={-134} width={30} height={9} rx={3} fill="#101013" />
      {/* المقصورة */}
      <rect x={50} y={-130} width={74} height={100} rx={4} fill="#25252b" />
      <rect x={62} y={-116} width={26} height={26} fill={PAL.gold} opacity={0.55} />
      <rect x={44} y={-136} width={86} height={10} rx={3} fill="#101013" />
      {/* قبة البخار */}
      <ellipse cx={-34} cy={-98} rx={14} ry={9} fill="#2b2b31" />
      {/* القاعدة والعجلات */}
      <rect x={-130} y={-30} width={260} height={12} fill="#0e0e11" />
      {[-84, -36, 12].map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy={-8} r={22} fill="#15151a" stroke="#3b3b44" strokeWidth={4} />
          {spokes(wx, -8, 18)}
        </g>
      ))}
      <circle cx={92} cy={-4} r={14} fill="#15151a" stroke="#3b3b44" strokeWidth={3} />
      <line x1={-84} y1={-8} x2={12} y2={-8} stroke={PAL.ash} strokeWidth={5} strokeLinecap="round" transform={`rotate(0)`} />
      {/* مصباح أمامي */}
      <circle cx={-128} cy={-60} r={9} fill={PAL.parchment} />
    </g>
  );
};

/** سلسلة سحب دخان تتصاعد وتتلاشى */
export const SmokeColumn: React.FC<{
  x: number;
  y: number;
  frame: number;
  count?: number;
  rise?: number;
  color?: string;
  seed?: number;
  drift?: number;
}> = ({x, y, frame, count = 9, rise = 260, color = '#3b3b42', seed = 0, drift = 60}) => {
  const puffs: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const offset = (i / count) * 120;
    const life = ((frame + offset + seed * 13) % 120) / 120;
    const px = x + life * drift + Math.sin(life * 6 + i) * 10;
    const py = y - life * rise;
    const r = 12 + life * 46;
    puffs.push(<circle key={i} cx={px} cy={py} r={r} fill={color} opacity={(1 - life) * 0.5} />);
  }
  return <g>{puffs}</g>;
};

/** كتاب مفتوح */
export const OpenBook: React.FC<{cx: number; cy: number; width: number; open: number}> = ({cx, cy, width, open}) => {
  const w = width * open;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <path d={`M 0 0 L ${-w / 2} -${width * 0.08} L ${-w / 2} ${width * 0.55} L 0 ${width * 0.6} Z`} fill={PAL.parchment} stroke={PAL.sepiaDark} strokeWidth={2} />
      <path d={`M 0 0 L ${w / 2} -${width * 0.08} L ${w / 2} ${width * 0.55} L 0 ${width * 0.6} Z`} fill="#f2e7cd" stroke={PAL.sepiaDark} strokeWidth={2} />
      {[0.15, 0.25, 0.35, 0.45].map((k) => (
        <g key={k}>
          <line x1={-w * 0.4} y1={width * k} x2={-w * 0.06} y2={width * (k + 0.02)} stroke={PAL.sepiaDark} strokeWidth={1.5} opacity={0.5} />
          <line x1={w * 0.06} y1={width * (k + 0.02)} x2={w * 0.4} y2={width * k} stroke={PAL.sepiaDark} strokeWidth={1.5} opacity={0.5} />
        </g>
      ))}
    </g>
  );
};

/** إشعاعات خلفية (sunburst) */
export const Rays: React.FC<{cx: number; cy: number; inner: number; outer: number; count: number; rotation: number; fill: string; opacity?: number}> = ({
  cx,
  cy,
  inner,
  outer,
  count,
  rotation,
  fill,
  opacity = 1,
}) => {
  const wedges: React.ReactNode[] = [];
  const step = 360 / count;
  for (let i = 0; i < count; i += 2) {
    const a0 = rotation + i * step;
    const a1 = a0 + step;
    const [x1, y1] = polar(cx, cy, inner, a0);
    const [x2, y2] = polar(cx, cy, outer, a0);
    const [x3, y3] = polar(cx, cy, outer, a1);
    const [x4, y4] = polar(cx, cy, inner, a1);
    wedges.push(<path key={i} d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`} fill={fill} />);
  }
  return <g opacity={opacity}>{wedges}</g>;
};

export const degToRadExport = degToRad;
