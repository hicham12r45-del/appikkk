import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, easeInOutCubic, easeOutCubic, invLerp, lerp, pointsToPath} from '../anim/math';
import {PAL} from '../art/palette';
import {Locomotive} from '../art/Props';
import {ARABIC_FONT} from '../fonts';
import {MapBase} from './MapBase';
import {Panel} from './Panel';
import {LENIN_ROUTE, lonLatOf} from './mapData';

interface CueProps {
  duration: number;
  width?: number;
}

const segLengths = (pts: Array<[number, number]>): number[] => {
  const out: number[] = [];
  for (let i = 1; i < pts.length; i++) {
    out.push(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  return out;
};

const pointAlong = (pts: Array<[number, number]>, t: number): {x: number; y: number; angle: number; done: number} => {
  const lens = segLengths(pts);
  const total = lens.reduce((a, b) => a + b, 0);
  let target = clamp(t) * total;
  for (let i = 0; i < lens.length; i++) {
    if (target <= lens[i] || i === lens.length - 1) {
      const k = lens[i] === 0 ? 0 : target / lens[i];
      const x = lerp(pts[i][0], pts[i + 1][0], k);
      const y = lerp(pts[i][1], pts[i + 1][1], k);
      const angle = (Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0]) * 180) / Math.PI;
      return {x, y, angle, done: i + k};
    }
    target -= lens[i];
  }
  return {x: pts[0][0], y: pts[0][1], angle: 0, done: 0};
};

/** طريق عودة لينين إلى بتروغراد: خط يُرسم تدريجياً مع قطار يتحرك على المسار */
export const LeninRouteMap: React.FC<CueProps> = ({duration, width = 940}) => {
  const frame = useCurrentFrame();
  const pts = LENIN_ROUTE.map((id) => lonLatOf(id));
  const progress = easeInOutCubic(clamp(invLerp(24, duration - 50, frame)));
  const cur = pointAlong(pts, progress);
  const drawn: Array<[number, number]> = [];
  for (let i = 0; i <= Math.floor(cur.done); i++) drawn.push(pts[i]);
  drawn.push([cur.x, cur.y]);
  const visibleCities = LENIN_ROUTE.filter((_, i) => i <= Math.floor(cur.done) + (progress >= 0.999 ? 1 : 0));

  return (
    <Panel anchor="right" width={width} duration={duration} rotate={-0.6}>
      <MapBase frame={frame} title="عودة لينين · أبريل ١٩١٧" showCities={visibleCities} highlight={['petrograd']}>
        <path d={pointsToPath(pts)} fill="none" stroke={PAL.ash} strokeWidth={3} strokeDasharray="4 10" opacity={0.6} />
        <path d={pointsToPath(drawn)} fill="none" stroke={PAL.redBright} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        <g transform={`translate(${cur.x} ${cur.y - 6})`}>
          <g transform={`rotate(${Math.abs(cur.angle) > 90 ? 180 : 0}) scale(0.22)`}>
            <Locomotive x={0} y={0} frame={frame} />
          </g>
        </g>
      </MapBase>
    </Panel>
  );
};

/** معاهدة بريست ليتوفسك: الحدود الغربية تتراجع شرقاً مع سهم تقدّم ألماني */
export const BrestMap: React.FC<CueProps> = ({duration, width = 940}) => {
  const frame = useCurrentFrame();
  const [bx, by] = lonLatOf('brest');
  const [berx, bery] = lonLatOf('berlin');
  const shift = easeOutCubic(clamp(invLerp(30, 140, frame))) * 70;
  const arrowP = easeInOutCubic(clamp(invLerp(10, 100, frame)));
  const ax = lerp(berx + 40, bx - 10, arrowP);
  const ay = lerp(bery, by, arrowP);
  const borderPts: Array<[number, number]> = [
    [bx + 6, by - 150],
    [bx + 14, by - 70],
    [bx + 4, by],
    [bx + 24, by + 70],
    [bx + 52, by + 150],
  ];
  const moved = borderPts.map((p) => [p[0] + shift, p[1]] as [number, number]);
  return (
    <Panel anchor="right" width={width} duration={duration} rotate={0.5}>
      <MapBase frame={frame} title="معاهدة بريست ليتوفسك" showCities={['berlin', 'brest', 'petrograd', 'moscow']} highlight={['brest']}>
        <path d={pointsToPath(borderPts)} fill="none" stroke={PAL.ash} strokeWidth={3} strokeDasharray="8 8" />
        <path d={pointsToPath(moved)} fill="none" stroke={PAL.redBright} strokeWidth={5} strokeLinecap="round" />
        <path
          d={`M ${bx + 6} ${by - 150} L ${bx + 6 + shift} ${by - 150} L ${moved[4][0]} ${moved[4][1]} L ${bx + 52} ${by + 150} Z`}
          fill={PAL.redBright}
          opacity={0.18}
        />
        <line x1={berx + 30} y1={bery} x2={ax} y2={ay} stroke={PAL.steel} strokeWidth={6} strokeLinecap="round" />
        <polygon points={`${ax},${ay} ${ax - 18},${ay - 11} ${ax - 18},${ay + 11}`} fill={PAL.steel} transform={`rotate(${(Math.atan2(by - bery, bx - berx) * 180) / Math.PI} ${ax} ${ay})`} />
        <text x={bx + 150} y={by - 120} fill={PAL.offWhite} fontFamily={ARABIC_FONT} fontSize={30} fontWeight={700} direction="rtl" opacity={clamp(invLerp(60, 100, frame))} style={{paintOrder: 'stroke', stroke: '#000', strokeWidth: 5}}>
          خسائر إقليمية كبيرة
        </text>
      </MapBase>
    </Panel>
  );
};

interface Front {
  from: string;
  to: string;
  color: string;
  delay: number;
  label?: string;
}

const FRONTS: Front[] = [
  {from: 'moscow', to: 'crimea', color: PAL.redBright, delay: 10},
  {from: 'moscow', to: 'omsk', color: PAL.redBright, delay: 24},
  {from: 'moscow', to: 'archangel', color: PAL.redBright, delay: 38},
  {from: 'crimea', to: 'kiev', color: PAL.snow, delay: 6},
  {from: 'omsk', to: 'moscow', color: PAL.snow, delay: 20},
  {from: 'archangel', to: 'petrograd', color: PAL.snow, delay: 34},
];

/** الحرب الأهلية: أسهم حمراء (الجيش الأحمر) وبيضاء (الجيش الأبيض) تتقدّم من مواقعها */
export const CivilWarMap: React.FC<CueProps> = ({duration, width = 940}) => {
  const frame = useCurrentFrame();
  const arrows = FRONTS.map((f, i) => {
    const [x1, y1] = lonLatOf(f.from);
    const [x2, y2] = lonLatOf(f.to);
    const t = easeInOutCubic(clamp(invLerp(f.delay, f.delay + 90, frame)));
    const x = lerp(x1, x2, t);
    const y = lerp(y1, y2, t);
    const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    return (
      <g key={i}>
        <line x1={x1} y1={y1} x2={x} y2={y} stroke={f.color} strokeWidth={7} strokeLinecap="round" opacity={0.85} />
        <polygon points="0,0 -20,-12 -20,12" fill={f.color} transform={`translate(${x} ${y}) rotate(${ang})`} />
      </g>
    );
  });
  const clash = clamp(invLerp(110, 150, frame));
  const [mx, my] = lonLatOf('moscow');
  return (
    <Panel anchor="right" width={width} duration={duration} rotate={-0.4}>
      <MapBase frame={frame} title="الحرب الأهلية" showCities={['petrograd', 'moscow', 'kiev', 'crimea']} highlight={['moscow']}>
        {arrows}
        {clash > 0 && <circle cx={mx} cy={my} r={30 + Math.sin(frame * 0.3) * 6} fill="none" stroke={PAL.gold} strokeWidth={3} opacity={clash * 0.9} />}
        <g transform="translate(60 590)">
          <rect width={290} height={92} fill="rgba(0,0,0,0.6)" />
          <rect x={14} y={20} width={30} height={10} fill={PAL.redBright} />
          <text x={276} y={32} textAnchor="end" direction="rtl" fill={PAL.offWhite} fontFamily={ARABIC_FONT} fontSize={26}>
            الجيش الأحمر
          </text>
          <rect x={14} y={58} width={30} height={10} fill={PAL.snow} />
          <text x={276} y={70} textAnchor="end" direction="rtl" fill={PAL.offWhite} fontFamily={ARABIC_FONT} fontSize={26}>
            الجيش الأبيض
          </text>
        </g>
      </MapBase>
    </Panel>
  );
};
