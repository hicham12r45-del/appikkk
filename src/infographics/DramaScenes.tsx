import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, easeInOutCubic, easeOutBack, easeOutCubic, fbm1D, invLerp, lerp, mulberry32, pulse} from '../anim/math';
import {Figure} from '../art/Figure';
import {CitySkyline, PalaceSilhouette} from '../art/Buildings';
import {ClockFace, Dove, HammerSickle, Loaf, Rays, Star, Torch, WheatEar} from '../art/Props';
import {PAL} from '../art/palette';
import {ARABIC_FONT} from '../fonts';
import {FullArt, Panel} from './Panel';

interface CueProps {
  duration: number;
  width?: number;
}

/** هجوم قصر الشتاء ليلاً: كشّاف، نوافذ تضيء، الحرس الأحمر يتقدمون، ومضات مدفع */
export const PalaceNight: React.FC<CueProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const lit = clamp(invLerp(10, 150, frame));
  const rand = mulberry32(55);
  const guards = Array.from({length: 14}, (_, i) => {
    const row = i % 3;
    const delay = i * 6 + rand() * 20;
    const t = easeOutCubic(clamp(invLerp(delay, delay + 150, frame)));
    const x = lerp(-120 + (i % 5) * -30, 140 + i * 78, t);
    return <Figure key={i} kind={i % 4 === 0 ? 'sailor' : 'redGuard'} x={x} y={650 + row * 22} scale={0.72 + row * 0.1} tint="#06070a" walkPhase={frame * 0.38 + i * 1.3} walkAmount={t < 0.97 ? 1 : 0} bobAmount={3} />;
  });
  const beamAngle = Math.sin(frame * 0.035) * 0.45 + 0.4;
  const flashAt = [70, 118, 164, 205];
  const flash = flashAt.reduce((acc, f) => Math.max(acc, pulse(clamp(invLerp(f, f + 8, frame)), 0.2)), 0);
  const flag = easeOutBack(clamp(invLerp(190, 230, frame)));
  return (
    <FullArt duration={duration} dim={0.15}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <defs>
          <linearGradient id="pn-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#05070c" />
            <stop offset="1" stopColor="#1b2230" />
          </linearGradient>
          <radialGradient id="pn-flash">
            <stop offset="0" stopColor="#fff3c4" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ff7a2a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={1280} height={720} fill="url(#pn-sky)" />
        {Array.from({length: 70}, (_, i) => (
          <circle key={i} cx={(i * 211) % 1280} cy={(i * 97) % 300} r={1.2} fill="#fff" opacity={0.25 + 0.4 * Math.sin(frame * 0.06 + i)} />
        ))}
        <circle cx={1060} cy={110} r={46} fill="#e9e2c8" opacity={0.85} />
        <circle cx={1074} cy={100} r={44} fill="#0d121a" opacity={0.9} />
        {/* أفق المدينة البعيد */}
        <CitySkyline width={1280} baseY={470} height={150} seed={8} color="#0a0d14" frame={frame} litAmount={0.12} />
        {/* القصر */}
        <PalaceSilhouette x={110} baseY={560} width={1060} height={190} frame={frame} lit={lit} />
        {/* راية حمراء ترتفع على القصر */}
        <g transform={`translate(0 ${(1 - flag) * 160})`} opacity={flag}>
          <line x1={640} y1={150} x2={640} y2={250} stroke="#222" strokeWidth={4} />
          <path d={`M 640 152 L 704 ${160 + Math.sin(frame * 0.2) * 5} L 640 ${186 + Math.sin(frame * 0.2 + 1) * 4} Z`} fill={PAL.redBright} />
        </g>
        {/* كشافات */}
        <polygon points={`80,720 ${lerp(300, 820, beamAngle)},120 ${lerp(480, 1000, beamAngle)},120`} fill={PAL.parchment} opacity={0.06} />
        <polygon points={`1200,720 ${lerp(980, 460, beamAngle)},140 ${lerp(820, 280, beamAngle)},140`} fill={PAL.parchment} opacity={0.05} />
        {/* ساحة */}
        <rect x={0} y={560} width={1280} height={160} fill="#0a0c10" />
        <rect x={0} y={560} width={1280} height={5} fill="#1c212b" />
        {/* أضواء مشاعل على جانبي الساحة */}
        <Torch cx={90} cy={560} size={80} frame={frame} />
        <Torch cx={1190} cy={560} size={80} frame={frame} seed={3} />
        {guards}
        {/* ومضات المدفع */}
        {flash > 0.01 && <circle cx={flashAt.findIndex((f) => frame >= f && frame < f + 10) % 2 ? 220 : 1050} cy={520} r={160} fill="url(#pn-flash)" opacity={flash} />}
        <rect width={1280} height={720} fill="#fff" opacity={flash * 0.12} />
        <text x={640} y={660} textAnchor="middle" fill={PAL.offWhite} fontFamily={ARABIC_FONT} fontSize={60} fontWeight={700} direction="rtl" opacity={clamp(invLerp(30, 70, frame)) * (1 - clamp(invLerp(duration - 50, duration - 20, frame)))} style={{paintOrder: 'stroke', stroke: '#000', strokeWidth: 8}}>
          قصر الشتاء
        </text>
      </svg>
    </FullArt>
  );
};

/** ساعة تتسارع من الليل إلى الصباح مع قلب التاريخ */
export const ClockDate: React.FC<CueProps & {fromDay: string; toDay: string; month: string; year: string}> = ({duration, width = 560, fromDay, toDay, month, year}) => {
  const frame = useCurrentFrame();
  const t = easeInOutCubic(clamp(invLerp(10, duration - 20, frame)));
  const totalMinutes = lerp(22 * 60, 30 * 60 + 40, t); // من ١٠ ليلاً حتى ٦:٤٠ صباحاً
  const hour = Math.floor(totalMinutes / 60) % 24;
  const minute = Math.floor(totalMinutes % 60);
  const flip = clamp(invLerp(duration * 0.45, duration * 0.55, frame));
  const dayText = flip < 0.5 ? fromDay : toDay;
  const flipScale = Math.abs(Math.cos(flip * Math.PI));
  const dawn = clamp(invLerp(duration * 0.55, duration - 20, frame));
  return (
    <Panel anchor="topLeft" width={width} duration={duration} rotate={-0.6}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <defs>
          <linearGradient id="cl-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={`rgb(${lerp(8, 70, dawn)},${lerp(10, 50, dawn)},${lerp(18, 60, dawn)})`} />
            <stop offset="1" stopColor={`rgb(${lerp(25, 190, dawn)},${lerp(30, 90, dawn)},${lerp(45, 60, dawn)})`} />
          </linearGradient>
        </defs>
        <rect width={1280} height={720} fill="url(#cl-sky)" />
        <Rays cx={640} cy={720} inner={0} outer={1000} count={24} rotation={frame * 0.2} fill={PAL.gold} opacity={0.09 * dawn} />
        <circle cx={640} cy={lerp(900, 640, dawn)} r={120} fill={PAL.gold} opacity={0.5 * dawn} />
        <ClockFace cx={640} cy={290} r={190} hour={hour} minute={minute} />
        <g transform={`translate(640 600) scale(${flipScale} 1)`}>
          <rect x={-330} y={-100} width={660} height={160} rx={14} fill="#15151a" stroke={PAL.gold} strokeWidth={4} />
          <text textAnchor="middle" y={4} fill={PAL.offWhite} fontFamily={ARABIC_FONT} fontSize={82} fontWeight={700} direction="rtl">
            {dayText} {month}
          </text>
          <text textAnchor="middle" y={46} fill={PAL.sepia} fontFamily={ARABIC_FONT} fontSize={34} direction="rtl">
            {year}
          </text>
        </g>
      </svg>
    </Panel>
  );
};

/** مرسوم يُفرد كلفافة مع ختم أحمر وخطوط كتابة مجرّدة (بلا نص مختلق) */
export const DecreeScroll: React.FC<CueProps> = ({duration, width = 760}) => {
  const frame = useCurrentFrame();
  const open = easeOutCubic(clamp(invLerp(0, 60, frame)));
  const h = lerp(40, 520, open);
  const lines = Array.from({length: 9}, (_, i) => {
    const w = [440, 500, 470, 520, 400, 510, 480, 430, 300][i];
    const reveal = clamp(invLerp(40 + i * 8, 62 + i * 8, frame));
    return <line key={i} x1={640 - w / 2} y1={190 + i * 46} x2={640 - w / 2 + w * reveal} y2={190 + i * 46} stroke="#4a3b24" strokeWidth={5} strokeLinecap="round" opacity={0.7} />;
  });
  const seal = easeOutBack(clamp(invLerp(120, 150, frame)));
  return (
    <Panel anchor="right" width={width} duration={duration} rotate={0.7}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <rect width={1280} height={720} fill="#1a1411" />
        <Rays cx={640} cy={360} inner={120} outer={900} count={30} rotation={frame * 0.15} fill={PAL.gold} opacity={0.05} />
        <g transform={`translate(0 ${360 - h / 2 - 30})`}>
          <rect x={300} y={0} width={680} height={h + 60} rx={10} fill={PAL.parchment} stroke={PAL.sepiaDark} strokeWidth={4} />
          <rect x={270} y={-14} width={740} height={34} rx={17} fill="#8a6a3c" />
          <rect x={270} y={h + 40} width={740} height={34} rx={17} fill="#8a6a3c" />
        </g>
        <g transform={`translate(0 ${360 - h / 2 - 180})`} opacity={open}>
          {lines}
        </g>
        <g transform={`translate(860 560) scale(${seal})`}>
          <circle r={58} fill={PAL.redDeep} />
          <circle r={48} fill="none" stroke={PAL.redBright} strokeWidth={3} />
          <Star cx={0} cy={0} r={28} fill={PAL.redBright} />
        </g>
      </svg>
    </Panel>
  );
};

/** شعارات: السلام والأرض والخبز — ثلاثة رموز تتوالى (حمامة، سنبلة، رغيف) مع الكلمات من النص حرفياً */
export const SloganTrio: React.FC<CueProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const items = [
    {label: 'السلام', delay: 6},
    {label: 'الأرض', delay: 34},
    {label: 'الخبز', delay: 62},
  ];
  const cols = items.map((it, i) => {
    const t = easeOutBack(clamp(invLerp(it.delay, it.delay + 26, frame)));
    const cx = 330 + i * 310;
    return (
      <g key={it.label} transform={`translate(0 ${(1 - t) * 90})`} opacity={clamp(t)}>
        <circle cx={cx} cy={320} r={118} fill="rgba(0,0,0,0.45)" stroke={PAL.gold} strokeWidth={4} />
        {i === 0 && <Dove cx={cx} cy={324} size={150} flap={frame * 0.25} />}
        {i === 1 && <WheatEar cx={cx} cy={326} size={150} sway={Math.sin(frame * 0.07) * 4} />}
        {i === 2 && <Loaf cx={cx} cy={330} size={170} rotate={Math.sin(frame * 0.05) * 3} />}
        <text x={cx} y={510} textAnchor="middle" direction="rtl" fill={PAL.offWhite} fontFamily={ARABIC_FONT} fontSize={74} fontWeight={700} style={{paintOrder: 'stroke', stroke: '#000', strokeWidth: 8}}>
          {it.label}
        </text>
        <rect x={cx - 60} y={532} width={120 * t} height={5} fill={PAL.redBright} />
      </g>
    );
  });
  return (
    <FullArt duration={duration} dim={0.62}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <Rays cx={640} cy={360} inner={0} outer={1000} count={36} rotation={frame * 0.25} fill={PAL.red} opacity={0.12} />
        {cols}
      </svg>
    </FullArt>
  );
};

/** شعار الاتحاد السوفييتي: حلقة قمح ونجمة ومطرقة ومنجل مع أشعة */
export const SovietEmblem: React.FC<CueProps> = ({duration, width = 760}) => {
  const frame = useCurrentFrame();
  const build = easeOutBack(clamp(invLerp(0, 50, frame)));
  const ring = Array.from({length: 18}, (_, i) => {
    const a = (i / 18) * 360;
    const rad = (a * Math.PI) / 180;
    return <WheatEar key={i} cx={640 + Math.cos(rad) * 250} cy={360 + Math.sin(rad) * 250} size={86} rotate={a + 90} sway={Math.sin(frame * 0.05 + i) * 3} />;
  });
  return (
    <Panel anchor="right" width={width} duration={duration} rotate={-0.4}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <rect width={1280} height={720} fill="#1c1210" />
        <Rays cx={640} cy={360} inner={0} outer={1100} count={32} rotation={frame * 0.3} fill={PAL.red} opacity={0.22} />
        <g transform={`translate(640 360) scale(${build}) translate(-640 -360)`}>
          {ring}
          <circle cx={640} cy={360} r={190} fill={PAL.redDeep} stroke={PAL.gold} strokeWidth={6} />
          <HammerSickle cx={640} cy={372} size={250} />
          <Star cx={640} cy={134} r={50} fill={PAL.redBright} />
        </g>
      </svg>
    </Panel>
  );
};

/** جبهة الحرب العالمية: خنادق، أسلاك شائكة، ومضات بعيدة وجنود يتقدمون ببطء */
export const TrenchFront: React.FC<CueProps> = ({duration, width = 900}) => {
  const frame = useCurrentFrame();
  const flashes = [24, 58, 83, 121, 160];
  const flash = flashes.reduce((a, f) => Math.max(a, pulse(clamp(invLerp(f, f + 9, frame)), 0.2)), 0);
  const soldiers = Array.from({length: 6}, (_, i) => {
    const t = clamp(invLerp(i * 8, 200 + i * 8, frame));
    return <Figure key={i} kind="soldier" x={120 + i * 150 + t * 60} y={600 + (i % 2) * 18} scale={0.9} tint="#0c0d0b" walkPhase={frame * 0.22 + i} walkAmount={0.7} />;
  });
  const wire: React.ReactNode[] = [];
  for (let i = 0; i < 28; i++) {
    const x = i * 48;
    wire.push(<line key={`p${i}`} x1={x} y1={560} x2={x} y2={520} stroke="#0b0b0b" strokeWidth={4} />);
    wire.push(<path key={`w${i}`} d={`M ${x} 530 Q ${x + 24} ${552} ${x + 48} 530`} stroke="#1a1a1a" strokeWidth={2.4} fill="none" />);
    wire.push(<path key={`x${i}`} d={`M ${x + 8} 524 l 8 8 m 0 -8 l -8 8`} stroke="#222" strokeWidth={2} />);
  }
  return (
    <Panel anchor="right" width={width} duration={duration} rotate={0.5}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <defs>
          <linearGradient id="tf-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#181716" />
            <stop offset="1" stopColor="#4a3c2c" />
          </linearGradient>
        </defs>
        <rect width={1280} height={720} fill="url(#tf-sky)" />
        <rect width={1280} height={720} fill="#ffcf80" opacity={flash * 0.35} />
        {Array.from({length: 5}, (_, i) => (
          <circle key={i} cx={(i * 310 + frame * 0.6) % 1500 - 100} cy={140 + (i % 3) * 38} r={70 + (i % 2) * 30} fill="#2a2724" opacity={0.5} />
        ))}
        <path d="M 0 470 Q 160 430 340 470 T 700 460 T 1060 480 T 1280 450 L 1280 720 L 0 720 Z" fill="#171310" />
        {wire}
        <rect x={0} y={640} width={1280} height={80} fill="#0b0907" />
        {soldiers}
        {Array.from({length: 10}, (_, i) => {
          const life = ((frame * 0.7 + i * 11) % 80) / 80;
          return <circle key={i} cx={100 + i * 120 + fbm1D(frame * 0.02 + i, 3) * 40} cy={470 - life * 150} r={20 + life * 30} fill="#2c2825" opacity={(1 - life) * 0.35} />;
        })}
      </svg>
    </Panel>
  );
};

/** الخريطة التي تتبدل: كتل جغرافية مجردة تتبدّل ألوانها وتتحرك الحدود — الخاتمة */
export const WorldShift: React.FC<CueProps> = ({duration}) => {
  const frame = useCurrentFrame();
  const shift = easeInOutCubic(clamp(invLerp(8, duration - 30, frame)));
  const blocks = [
    {pts: '90,200 330,150 420,260 300,360 120,330', c0: '#4a3f2e', c1: '#8a1f1c'},
    {pts: '360,120 640,100 700,230 560,300 420,260', c0: '#3a3a40', c1: '#3a3a40'},
    {pts: '440,300 700,260 760,420 620,540 480,470', c0: '#52483a', c1: '#6b2a22'},
    {pts: '730,130 1120,110 1180,300 960,360 760,260', c0: '#4a3f2e', c1: '#a3201f'},
    {pts: '800,380 1100,350 1180,520 940,600 780,520', c0: '#3a3a40', c1: '#5b6770'},
    {pts: '150,440 360,400 420,560 260,640 130,580', c0: '#52483a', c1: '#3a3a40'},
  ];
  const mix = (a: string, b: string, t: number): string => {
    const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
    const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
    return `rgb(${Math.round(lerp(pa[0], pb[0], t))},${Math.round(lerp(pa[1], pb[1], t))},${Math.round(lerp(pa[2], pb[2], t))})`;
  };
  return (
    <FullArt duration={duration} dim={0.5}>
      <svg width={1280} height={720} viewBox="0 0 1280 720">
        <rect width={1280} height={720} fill="#0b0f14" />
        {Array.from({length: 13}, (_, i) => (
          <line key={`g${i}`} x1={i * 106} y1={0} x2={i * 106} y2={720} stroke="#fff" strokeOpacity={0.04} />
        ))}
        {blocks.map((b, i) => {
          const local = clamp(shift * 1.5 - i * 0.12);
          return (
            <g key={i} transform={`translate(${Math.sin(frame * 0.02 + i) * 4} ${Math.cos(frame * 0.017 + i) * 4})`}>
              <polygon points={b.pts} fill={mix(b.c0, b.c1, local)} stroke={PAL.parchment} strokeOpacity={0.35} strokeWidth={2.4} strokeLinejoin="round" />
            </g>
          );
        })}
        {/* خطوط تماس تنبض بين الكتل */}
        {[
          [330, 260, 440, 300],
          [700, 230, 760, 260],
          [700, 360, 800, 400],
          [420, 400, 460, 460],
        ].map((l, i) => (
          <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={PAL.gold} strokeWidth={4} strokeLinecap="round" opacity={0.3 + 0.4 * Math.sin(frame * 0.15 + i * 1.5)} />
        ))}
      </svg>
    </FullArt>
  );
};
