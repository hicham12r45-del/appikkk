import React from 'react';
import {PAL} from '../art/palette';
import {ARABIC_FONT} from '../fonts';
import {
  BALTIC,
  BLACK_SEA,
  CITIES,
  MAP_VIEW,
  RUSSIAN_EMPIRE,
  SCANDINAVIA,
  WESTERN_EUROPE,
  lonLatOf,
  project,
  projectAll,
} from './mapData';
import {pointsToPath} from '../anim/math';

/** خلفية الخريطة: بحار، يابسة، حدود الإمبراطورية، شبكة إحداثيات، عنوان تخطيطي */
export const MapBase: React.FC<{
  frame: number;
  empireFill?: string;
  empireOpacity?: number;
  title?: string;
  showCities?: string[];
  highlight?: string[];
  children?: React.ReactNode;
}> = ({frame, empireFill = '#4a3f2e', empireOpacity = 1, title, showCities = [], highlight = [], children}) => {
  const grid: React.ReactNode[] = [];
  for (let lon = 10; lon <= 60; lon += 10) {
    const [x0, y0] = project(lon, MAP_VIEW.latMax);
    const [x1, y1] = project(lon, MAP_VIEW.latMin);
    grid.push(<line key={`lo${lon}`} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#fff" strokeOpacity={0.05} strokeWidth={1} />);
  }
  for (let lat = 45; lat <= 70; lat += 5) {
    const [x0, y0] = project(MAP_VIEW.lonMin, lat);
    const [x1, y1] = project(MAP_VIEW.lonMax, lat);
    grid.push(<line key={`la${lat}`} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#fff" strokeOpacity={0.05} strokeWidth={1} />);
  }
  const marks = showCities.map((id) => {
    const c = CITIES[id];
    const [x, y] = lonLatOf(id);
    const hl = highlight.includes(id);
    const pulse = hl ? 1 + 0.5 * Math.sin(frame * 0.18) : 1;
    return (
      <g key={id}>
        {hl && <circle cx={x} cy={y} r={14 * pulse} fill="none" stroke={PAL.redBright} strokeWidth={2.4} opacity={0.8 / pulse} />}
        <circle cx={x} cy={y} r={hl ? 7 : 5} fill={hl ? PAL.redBright : PAL.parchment} stroke={PAL.ink} strokeWidth={1.6} />
        <text
          x={x + (c.labelDx ?? 12)}
          y={y + (c.labelDy ?? -10)}
          fill={PAL.parchment}
          fontFamily={ARABIC_FONT}
          fontSize={25}
          fontWeight={700}
          style={{paintOrder: 'stroke', stroke: '#0b0b0d', strokeWidth: 4}}
        >
          {c.name}
        </text>
      </g>
    );
  });
  return (
    <svg width={1280} height={720} viewBox="0 0 1280 720">
      <defs>
        <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14202a" />
          <stop offset="1" stopColor="#0d141b" />
        </linearGradient>
      </defs>
      <rect width={1280} height={720} fill="url(#seaGrad)" />
      {grid}
      <path d={pointsToPath(projectAll(WESTERN_EUROPE), true)} fill="#2a2a2f" stroke="#444450" strokeWidth={1.5} />
      <path d={pointsToPath(projectAll(SCANDINAVIA), true)} fill="#2a2a2f" stroke="#444450" strokeWidth={1.5} />
      <path d={pointsToPath(projectAll(RUSSIAN_EMPIRE), true)} fill={empireFill} fillOpacity={empireOpacity} stroke={PAL.sepia} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={pointsToPath(projectAll(BALTIC), true)} fill="#101a22" />
      <path d={pointsToPath(projectAll(BLACK_SEA), true)} fill="#101a22" stroke="#25323d" strokeWidth={1.4} />
      {children}
      {marks}
      {title && (
        <g>
          <rect x={28} y={24} width={300} height={54} fill="rgba(0,0,0,0.55)" />
          <rect x={28} y={24} width={6} height={54} fill={PAL.redBright} />
          <text x={318} y={60} textAnchor="end" direction="rtl" fill={PAL.offWhite} fontFamily={ARABIC_FONT} fontSize={30} fontWeight={700}>
            {title}
          </text>
        </g>
      )}
      <text x={1250} y={702} textAnchor="end" direction="rtl" fill={PAL.ash} fontFamily={ARABIC_FONT} fontSize={18}>
        خريطة تخطيطية غير دقيقة
      </text>
    </svg>
  );
};
