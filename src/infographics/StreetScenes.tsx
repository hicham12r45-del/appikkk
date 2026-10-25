import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, easeInOutCubic, easeOutBack, easeOutCubic, fbm1D, invLerp, lerp, mulberry32} from '../anim/math';
import {Figure} from '../art/Figure';
import {Flag, BannerCloth} from '../art/Flag';
import {Bridge, CitySkyline, Factory, Station} from '../art/Buildings';
import {Crown, Loaf, Locomotive, SmokeColumn, Star, Torch} from '../art/Props';
import {PAL} from '../art/palette';
import {ARABIC_FONT} from '../fonts';
import {Panel} from './Panel';

interface CueProps {
  duration: number;
  width?: number;
}

const Sky: React.FC<{id: string; top: string; bottom: string}> = ({id, top, bottom}) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
    </defs>
    <rect width={1280} height={720} fill={`url(#${id})`} />
  </>
);

const Snowfall: React.FC<{frame: number; count?: number; seed?: number}> = ({frame, count = 80, seed = 2}) => {
  const rand = mulberry32(seed);
  const items: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const depth = 0.3 + rand() * 0.7;
    const bx = rand() * 1280;
    const by = rand() * 720;
    const y = (by + frame * (0.8 + depth * 2)) % 730;
    const x = (bx + Math.sin(frame * 0.03 + i) * 16 * depth + frame * 0.4 * depth) % 1290;
    items.push(<circle key={i} cx={x} cy={y} r={1 + depth * 2.4} fill="#eef3f7" opacity={0.3 + depth * 0.5} />);
  }
  return <g>{items}</g>;
};

/** طابور الخبز في بتروغراد: الناس يصلون ويقفون أمام مخبز مغلق، والثلج يتساقط */
export const BreadQueue: React.FC<CueProps> = ({duration, width = 900}) => {
  const frame = useCurrentFrame();
  const people: Array<{kind: 'woman' | 'worker' | 'peasant' | 'soldier'; slot: number; delay: number}> = [
    {kind: 'woman', slot: 0, delay: 0},
    {kind: 'worker', slot: 1, delay: 14},
    {kind: 'peasant', slot: 2, delay: 30},
    {kind: 'woman', slot: 3, delay: 48},
    {kind: 'soldier', slot: 4, delay: 64},
    {kind: 'woman', slot: 5, delay: 80},
    {kind: 'worker', slot: 6, delay: 96},
  ];
  const figs = people.map((p, i) => {
    const targetX = 300 + p.slot * 118;
    const t = easeOutCubic(clamp(invLerp(p.delay, p.delay + 70, frame)));
    const x = lerp(1400, targetX, t);
    const walking = t < 0.995;
    const fidget = Math.sin(frame * 0.07 + i) * 1.4;
    return (
      <Figure
        key={i}
        kind={p.kind}
        x={x + (walking ? 0 : fidget)}
        y={600 + (i % 2) * 6}
        scale={1.05 - (i % 3) * 0.04}
        flip
        walkPhase={frame * 0.28 + i}
        walkAmount={walking ? 1 : 0}
      />
    );
  });
  const shutter = easeOutCubic(clamp(invLerp(0, 40, frame)));
  return (
    <Panel anchor="right" width={width} duration={duration} rotate={0.4}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <Sky id="bq-sky" top="#1a2028" bottom="#2c3138" />
        <CitySkyline width={1280} baseY={560} height={260} seed={4} color="#14161b" frame={frame} litAmount={0.28} />
        {/* المخبز */}
        <g transform="translate(40 330)">
          <rect x={0} y={0} width={230} height={270} fill="#2a2420" />
          <rect x={-10} y={-18} width={250} height={26} fill="#18130f" />
          <rect x={30} y={60} width={170} height={150} fill="#17120e" />
          <rect x={30} y={60} width={170} height={150 * (1 - shutter * 0.1)} fill="#3a3028" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1={30} y1={60 + i * 27} x2={200} y2={60 + i * 27} stroke="#241c16" strokeWidth={3} />
          ))}
          <text x={115} y={14} textAnchor="middle" fill={PAL.parchment} fontFamily={ARABIC_FONT} fontSize={38} fontWeight={700} direction="rtl">
            مخبز
          </text>
          <Loaf cx={115} cy={44} size={46} />
        </g>
        {/* الأرض والثلج */}
        <rect x={0} y={600} width={1280} height={120} fill="#c9d1d8" opacity={0.18} />
        <rect x={0} y={600} width={1280} height={4} fill="#d8dee3" opacity={0.3} />
        {figs}
        {/* مصباح الشارع */}
        <g transform="translate(1160 360)">
          <rect x={-4} y={0} width={8} height={240} fill="#111" />
          <circle cx={0} cy={-6} r={16} fill={PAL.gold} opacity={0.85 + 0.1 * Math.sin(frame * 0.2)} />
          <circle cx={0} cy={-6} r={80} fill={PAL.gold} opacity={0.08} />
        </g>
        <Snowfall frame={frame} />
      </svg>
    </Panel>
  );
};

/** رتل جنود يسير بطبقات عمق مع غبار ومرور راية */
export const MarchingSoldiers: React.FC<CueProps> = ({duration, width = 900}) => {
  const frame = useCurrentFrame();
  const rows: Array<{y: number; scale: number; tint?: string; speed: number; count: number; opacity: number}> = [
    {y: 520, scale: 0.7, tint: '#1d1f1c', speed: 2.2, count: 9, opacity: 0.9},
    {y: 580, scale: 0.9, tint: '#161815', speed: 2.8, count: 7, opacity: 0.95},
    {y: 660, scale: 1.2, speed: 3.4, count: 5, opacity: 1},
  ];
  const groups = rows.map((row, ri) => {
    const figs: React.ReactNode[] = [];
    for (let i = 0; i < row.count; i++) {
      const spacing = 190 * row.scale + 40;
      const raw = i * spacing + frame * row.speed;
      const x = ((raw % (row.count * spacing)) - spacing) * 1;
      figs.push(
        <Figure
          key={`${ri}-${i}`}
          kind={i % 4 === 3 ? 'officer' : 'soldier'}
          x={x}
          y={row.y}
          scale={row.scale}
          tint={row.tint}
          walkPhase={frame * 0.24 + i * 0.9}
          walkAmount={1}
          opacity={row.opacity}
          bobAmount={4}
        />,
      );
    }
    return <g key={ri}>{figs}</g>;
  });
  const dust = Array.from({length: 18}, (_, i) => {
    const life = ((frame * 0.8 + i * 14) % 90) / 90;
    return <circle key={i} cx={160 + i * 60 + life * 90} cy={640 - life * 40} r={18 + life * 38} fill="#8b7d68" opacity={(1 - life) * 0.16} />;
  });
  return (
    <Panel anchor="right" width={width} duration={duration} rotate={-0.5}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <Sky id="ms-sky" top="#2b2620" bottom="#6b5a46" />
        <circle cx={940} cy={250} r={90} fill="#e9d8a8" opacity={0.28} />
        <path d="M 0 480 Q 300 420 600 470 T 1280 450 L 1280 720 L 0 720 Z" fill="#241f19" />
        {dust}
        {groups}
      </svg>
    </Panel>
  );
};

/** جمهور يرفع الرايات: صف أشخاص يهتفون وبينهم رايات تتموج */
export const CrowdFlags: React.FC<CueProps & {banner?: string}> = ({duration, width = 940, banner}) => {
  const frame = useCurrentFrame();
  const rand = mulberry32(19);
  const kinds = ['worker', 'woman', 'soldier', 'peasant', 'sailor', 'worker'] as const;
  const crowd: React.ReactNode[] = [];
  for (let row = 0; row < 3; row++) {
    const y = 560 + row * 52;
    const count = 11 - row;
    for (let i = 0; i < count; i++) {
      const x = 70 + i * (1140 / (count - 1)) + (rand() - 0.5) * 30;
      const cheer = Math.max(0, Math.sin(frame * 0.12 + i * 1.7 + row * 2.3)) * (row === 0 ? 0.6 : 1);
      crowd.push(
        <Figure
          key={`${row}-${i}`}
          kind={kinds[(i + row) % kinds.length]}
          x={x}
          y={y}
          scale={0.9 + row * 0.14}
          tint={row === 0 ? '#101114' : row === 1 ? '#17181b' : undefined}
          cheer={cheer}
          bobAmount={2}
          walkPhase={0}
          walkAmount={0}
        />,
      );
    }
  }
  const rise = easeOutBack(clamp(invLerp(8, 60, frame)));
  const flags = [
    {x: 220, y: 140, w: 250, h: 150, seed: 0},
    {x: 560, y: 90, w: 300, h: 170, seed: 1.6},
    {x: 940, y: 160, w: 230, h: 140, seed: 3.1},
  ].map((f, i) => (
    <g key={i} transform={`translate(0 ${(1 - rise) * 260})`}>
      <Flag x={f.x} y={f.y} width={f.w} height={f.h} frame={frame} seed={f.seed} amplitude={12} poleHeight={560} />
    </g>
  ));
  return (
    <Panel anchor="right" width={width} duration={duration} rotate={0.3}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <Sky id="cf-sky" top="#241a1a" bottom="#5a3d34" />
        <CitySkyline width={1280} baseY={560} height={300} seed={11} color="#150f0f" frame={frame} litAmount={0.2} />
        {flags}
        {banner && (
          <g transform={`translate(0 ${(1 - rise) * 200})`}>
            <BannerCloth x={330} y={330} width={620} height={110} frame={frame} text={banner} fontFamily={ARABIC_FONT} fontSize={62} />
          </g>
        )}
        {crowd}
      </svg>
    </Panel>
  );
};

/** تاج القيصر يتشقق ثم ينكسر ويسقط، مع عدّاد "أكثر من ثلاثمائة عام" */
export const CrownBreak: React.FC<CueProps> = ({duration, width = 880}) => {
  const frame = useCurrentFrame();
  const crack = clamp(invLerp(30, 80, frame));
  const fall = easeInOutCubic(clamp(invLerp(95, 150, frame)));
  const shake = frame > 60 && frame < 95 ? Math.sin(frame * 2.2) * 4 : 0;
  const leftY = fall * 380;
  const rightY = fall * 420;
  const counter = Math.round(lerp(0, 300, easeOutCubic(clamp(invLerp(10, 90, frame)))));
  const rays = clamp(invLerp(0, 40, frame));
  return (
    <Panel anchor="right" width={width} duration={duration} rotate={0.6}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <Sky id="cb-sky" top="#14100f" bottom="#2a1d1b" />
        {Array.from({length: 18}, (_, i) => (
          <line
            key={i}
            x1={640}
            y1={290}
            x2={640 + Math.cos((i / 18) * Math.PI * 2 + frame * 0.004) * 700}
            y2={290 + Math.sin((i / 18) * Math.PI * 2 + frame * 0.004) * 700}
            stroke={PAL.gold}
            strokeWidth={14}
            opacity={0.06 * rays}
          />
        ))}
        <g transform={`translate(${shake} 0)`}>
          {/* النصف الأيسر */}
          <g transform={`translate(${-fall * 70} ${leftY}) rotate(${-fall * 38} 640 300)`}>
            <clipPath id="cb-left">
              <polygon points="0,0 640,0 650,200 630,330 640,720 0,720" />
            </clipPath>
            <g clipPath="url(#cb-left)">
              <Crown cx={640} cy={300} size={300} crack={crack} />
            </g>
          </g>
          {/* النصف الأيمن */}
          <g transform={`translate(${fall * 80} ${rightY}) rotate(${fall * 46} 640 300)`}>
            <clipPath id="cb-right">
              <polygon points="1280,0 640,0 650,200 630,330 640,720 1280,720" />
            </clipPath>
            <g clipPath="url(#cb-right)">
              <Crown cx={640} cy={300} size={300} crack={crack} />
            </g>
          </g>
        </g>
        {/* غبار الانكسار */}
        {fall > 0.05 &&
          Array.from({length: 22}, (_, i) => {
            const a = (i / 22) * Math.PI * 2;
            const d = fall * (60 + (i % 5) * 26);
            return <circle key={i} cx={640 + Math.cos(a) * d} cy={310 + Math.sin(a) * d * 0.7 + fall * 90} r={4 + (i % 3) * 2} fill={PAL.gold} opacity={(1 - fall) * 0.8} />;
          })}
        <g transform="translate(640 600)">
          <text textAnchor="middle" fill={PAL.offWhite} fontFamily={ARABIC_FONT} fontSize={120} fontWeight={700} style={{paintOrder: 'stroke', stroke: '#000', strokeWidth: 6}}>
            {counter}
            <tspan fill={PAL.redBright}>+</tspan>
          </text>
          <text y={64} textAnchor="middle" direction="rtl" fill={PAL.sepia} fontFamily={ARABIC_FONT} fontSize={44}>
            عام من الحكم الملكي
          </text>
        </g>
      </svg>
    </Panel>
  );
};

/** السيطرة على الجسور: جسر يضيء، حرس أحمر يعبرون، مشاعل ومنارة */
export const BridgesSeize: React.FC<CueProps> = ({duration, width = 940}) => {
  const frame = useCurrentFrame();
  const open = easeInOutCubic(clamp(invLerp(80, 130, frame))) * 0;
  const runners = [0, 1, 2, 3, 4].map((i) => {
    const t = clamp(invLerp(20 + i * 18, 150 + i * 18, frame));
    const x = lerp(-80, 1340, t);
    return <Figure key={i} kind={i % 2 ? 'sailor' : 'redGuard'} x={x} y={470 + (i % 2) * 10} scale={0.78} walkPhase={frame * 0.4 + i} walkAmount={t > 0 && t < 1 ? 1 : 0} tint="#0d0e11" />;
  });
  const beam = Math.sin(frame * 0.04) * 0.5 + 0.5;
  return (
    <Panel anchor="right" width={width} duration={duration} rotate={-0.4}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <Sky id="br-sky" top="#0c1118" bottom="#1d2733" />
        {Array.from({length: 40}, (_, i) => (
          <circle key={i} cx={(i * 197) % 1280} cy={(i * 83) % 260} r={1.3} fill="#fff" opacity={0.3 + 0.4 * Math.sin(frame * 0.05 + i)} />
        ))}
        {/* المنارة */}
        <polygon points={`120,300 ${lerp(300, 900, beam)},120 ${lerp(420, 1020, beam)},260`} fill={PAL.parchment} opacity={0.07} />
        <CitySkyline width={1280} baseY={470} height={230} seed={21} color="#07090d" frame={frame} litAmount={0.18} />
        {/* الماء */}
        <rect x={0} y={480} width={1280} height={240} fill="#0b1219" />
        {Array.from({length: 14}, (_, i) => (
          <line key={i} x1={(i * 120 + frame * 1.4) % 1400 - 60} y1={520 + (i % 5) * 36} x2={(i * 120 + frame * 1.4) % 1400 + 40} y2={520 + (i % 5) * 36} stroke="#2a3948" strokeWidth={2} opacity={0.5} />
        ))}
        <Bridge x={120} y={470} width={1040} frame={frame} open={open} />
        {runners}
        <Torch cx={200} cy={380} size={90} frame={frame} />
        <Torch cx={1060} cy={380} size={90} frame={frame} seed={2} />
      </svg>
    </Panel>
  );
};

/** المصنع والعمال: مداخن تدخّن، تروس تدور، عمال يتدفقون إلى البوابة */
export const FactoryWorkers: React.FC<CueProps> = ({duration, width = 900}) => {
  const frame = useCurrentFrame();
  const gear = (cx: number, cy: number, r: number, dir: number, teeth = 12) => {
    const pts: string[] = [];
    for (let i = 0; i < teeth * 2; i++) {
      const rr = i % 2 === 0 ? r : r * 0.82;
      const a = ((i / (teeth * 2)) * 360 + frame * 1.2 * dir) * (Math.PI / 180);
      pts.push(`${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`);
    }
    return (
      <g>
        <polygon points={pts.join(' ')} fill="#2c2c33" stroke="#4a4a54" strokeWidth={3} />
        <circle cx={cx} cy={cy} r={r * 0.3} fill="#15151a" />
      </g>
    );
  };
  const workers = Array.from({length: 8}, (_, i) => {
    const t = clamp(invLerp(i * 12, i * 12 + 140, frame));
    const x = lerp(-60 - i * 40, 520, t);
    return <Figure key={i} kind={i % 3 === 0 ? 'woman' : 'worker'} x={x} y={620} scale={1} walkPhase={frame * 0.3 + i} walkAmount={t < 1 ? 1 : 0.0} flip={false} />;
  });
  return (
    <Panel anchor="right" width={width} duration={duration} rotate={0.5}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <Sky id="fw-sky" top="#262320" bottom="#5c4b3a" />
        <Factory x={480} baseY={620} scale={2.1} frame={frame} />
        <SmokeColumn x={540} y={160} frame={frame} seed={1} />
        {gear(1030, 250, 120, 1)}
        {gear(1180, 410, 80, -1, 10)}
        {gear(930, 440, 56, -1, 8)}
        <rect x={0} y={620} width={1280} height={100} fill="#0e0d0c" />
        {workers}
      </svg>
    </Panel>
  );
};

/** المجلس (السوفييت): صف يضم عمالاً وجنوداً يرفعون أيديهم للتصويت */
export const SovietAssembly: React.FC<CueProps> = ({duration, width = 900}) => {
  const frame = useCurrentFrame();
  const kinds = ['worker', 'soldier', 'woman', 'sailor', 'peasant', 'worker', 'soldier'] as const;
  const people = kinds.map((k, i) => {
    const vote = clamp(invLerp(30 + i * 10, 55 + i * 10, frame));
    const raised = vote * (0.85 + 0.15 * Math.sin(frame * 0.1 + i));
    return <Figure key={i} kind={k} x={160 + i * 160} y={560 + (i % 2) * 26} scale={1.15} cheer={raised} walkAmount={0} />;
  });
  const table = easeOutCubic(clamp(invLerp(0, 24, frame)));
  return (
    <Panel anchor="right" width={width} duration={duration} rotate={0.3}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <Sky id="sa-sky" top="#1c1816" bottom="#3a2e26" />
        {/* قاعة */}
        <rect x={0} y={560} width={1280} height={160} fill="#120e0c" />
        {[100, 340, 580, 820, 1060].map((cx) => (
          <rect key={cx} x={cx} y={120} width={30} height={440} fill="#2a2320" />
        ))}
        <g transform={`translate(0 ${(1 - table) * -80})`}>
          <Flag x={620} y={90} width={300} height={170} frame={frame} amplitude={9} poleHeight={420} />
          <Star cx={640} cy={60} r={30} />
        </g>
        {people}
        <text x={640} y={110} textAnchor="middle" fill={PAL.offWhite} fontFamily={ARABIC_FONT} fontSize={54} fontWeight={700} direction="rtl" opacity={clamp(invLerp(20, 50, frame))} style={{paintOrder: 'stroke', stroke: '#000', strokeWidth: 6}}>
          السوفييتات
        </text>
      </svg>
    </Panel>
  );
};

/** كيرينسكي يغادر: سيارة تعبر الشارع الليلي وتتوارى، غبار وأضواء */
export const CarDeparture: React.FC<CueProps> = ({duration, width = 880}) => {
  const frame = useCurrentFrame();
  const t = easeInOutCubic(clamp(invLerp(10, 150, frame)));
  const x = lerp(-300, 1500, t);
  const wob = fbm1D(frame * 0.2, 7) * 3;
  const wheel = frame * 14;
  return (
    <Panel anchor="right" width={width} duration={duration} rotate={0.4}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <Sky id="cd-sky" top="#0b0e14" bottom="#232b38" />
        <CitySkyline width={1280} baseY={500} height={260} seed={31} color="#07080c" frame={frame} litAmount={0.22} />
        <rect x={0} y={500} width={1280} height={220} fill="#101318" />
        <line x1={0} y1={600} x2={1280} y2={600} stroke="#2a313c" strokeWidth={5} strokeDasharray="40 36" strokeDashoffset={-frame * 6} />
        {/* السيارة */}
        <g transform={`translate(${x} ${560 + wob})`}>
          <path d="M -150 0 L -150 -42 L -105 -50 L -78 -92 L 20 -92 L 52 -50 L 150 -42 L 150 0 Z" fill="#161820" stroke="#2c303c" strokeWidth={3} />
          <path d="M -70 -50 L -52 -84 L -6 -84 L -6 -50 Z M 6 -50 L 6 -84 L 16 -84 L 40 -50 Z" fill="#2a3544" />
          {[-90, 80].map((wx) => (
            <g key={wx}>
              <circle cx={wx} cy={4} r={30} fill="#0a0a0c" stroke="#3a3c46" strokeWidth={4} />
              {[0, 90].map((a) => (
                <line key={a} x1={wx + Math.cos(((a + wheel) * Math.PI) / 180) * 24} y1={4 + Math.sin(((a + wheel) * Math.PI) / 180) * 24} x2={wx - Math.cos(((a + wheel) * Math.PI) / 180) * 24} y2={4 - Math.sin(((a + wheel) * Math.PI) / 180) * 24} stroke="#5a5c66" strokeWidth={3} />
              ))}
            </g>
          ))}
          <polygon points="150,-30 520,-70 520,10" fill={PAL.parchment} opacity={0.14} />
          <circle cx={146} cy={-28} r={9} fill={PAL.parchment} />
        </g>
        {/* غبار خلف السيارة */}
        {Array.from({length: 12}, (_, i) => {
          const life = ((frame * 1.6 + i * 9) % 60) / 60;
          return <circle key={i} cx={x - 170 - life * 160} cy={590 - life * 30} r={14 + life * 40} fill="#6c6a68" opacity={(1 - life) * 0.3} />;
        })}
      </svg>
    </Panel>
  );
};

/** محطة قطار بتروغراد: وصول لينين — القاطرة تدخل المحطة وحشد ينتظر */
export const StationArrival: React.FC<CueProps> = ({duration, width = 900}) => {
  const frame = useCurrentFrame();
  const t = easeOutCubic(clamp(invLerp(0, 110, frame)));
  const trainX = lerp(-300, 760, t);
  const people = Array.from({length: 9}, (_, i) => (
    <Figure key={i} kind={['worker', 'soldier', 'woman', 'sailor'][i % 4] as 'worker'} x={820 + i * 52} y={650} scale={0.82} cheer={clamp(invLerp(110, 140, frame)) * (0.5 + 0.5 * Math.sin(frame * 0.2 + i))} tint={i % 2 ? '#14141a' : undefined} />
  ));
  return (
    <Panel anchor="right" width={width} duration={duration} rotate={-0.5}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <Sky id="st-sky" top="#161a22" bottom="#2d3240" />
        <Station x={100} baseY={640} width={1080} frame={frame} />
        <rect x={0} y={640} width={1280} height={80} fill="#09090c" />
        <line x1={0} y1={664} x2={1280} y2={664} stroke="#3a3a46" strokeWidth={4} />
        <SmokeColumn x={trainX + 120} y={440} frame={frame} count={7} rise={190} seed={4} />
        <g transform={`translate(${trainX} 648) scale(1.35)`}>
          <Locomotive x={0} y={0} frame={frame} flip />
        </g>
        {people}
        <Flag x={1090} y={220} width={150} height={90} frame={frame} amplitude={8} poleHeight={420} />
      </svg>
    </Panel>
  );
};
