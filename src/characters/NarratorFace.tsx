import React from 'react';
import {PAL} from '../art/palette';

export interface FaceProps {
  /** 0 مغلق، 1 صغير، 2 متوسط، 3 واسع */
  mouth: 0 | 1 | 2 | 3;
  /** 0 مفتوحة، 1 مغمضة تماماً */
  blink: number;
  gazeX: number; // -1..1
  gazeY: number; // -1..1
  /** رفع الحاجبين (-1 عابس، 0 محايد، 1 مندهش) */
  brow: number;
  /** ميل الرأس بالدرجات */
  tilt: number;
}

const GLASS = '#1d1a17';

const Eye: React.FC<{cx: number; cy: number; blink: number; gx: number; gy: number}> = ({cx, cy, blink, gx, gy}) => {
  const openH = 15 * (1 - blink) + 1.5;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={13} ry={openH} fill="#efe9de" />
      <ellipse cx={cx + gx * 4} cy={cy + gy * 3} rx={6.2} ry={Math.min(6.2, openH)} fill="#2c2118" />
      <circle cx={cx + gx * 4 - 1.6} cy={cy + gy * 3 - 1.8} r={1.6} fill="#fff" opacity={0.9} />
      {/* الجفن العلوي */}
      <path
        d={`M ${cx - 14} ${cy - 1} Q ${cx} ${cy - 14 - (1 - blink) * 2} ${cx + 14} ${cy - 1}`}
        fill="none"
        stroke={PAL.skinDark}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </g>
  );
};

const Mouth: React.FC<{shape: 0 | 1 | 2 | 3; cx: number; cy: number}> = ({shape, cx, cy}) => {
  switch (shape) {
    case 0:
      return <path d={`M ${cx - 17} ${cy} Q ${cx} ${cy + 4} ${cx + 17} ${cy}`} fill="none" stroke="#4a2a22" strokeWidth={3.2} strokeLinecap="round" />;
    case 1:
      return (
        <g>
          <ellipse cx={cx} cy={cy + 2} rx={14} ry={5} fill="#3a1a16" />
          <rect x={cx - 9} y={cy - 1.5} width={18} height={3} rx={1.4} fill="#f1ece4" />
        </g>
      );
    case 2:
      return (
        <g>
          <ellipse cx={cx} cy={cy + 4} rx={16} ry={10} fill="#2f1411" />
          <rect x={cx - 11} y={cy - 4} width={22} height={4.5} rx={2} fill="#f1ece4" />
          <ellipse cx={cx} cy={cy + 9} rx={9} ry={4} fill="#a04a45" />
        </g>
      );
    default:
      return (
        <g>
          <ellipse cx={cx} cy={cy + 7} rx={18} ry={15} fill="#2a100e" />
          <rect x={cx - 12} y={cy - 7} width={24} height={5} rx={2} fill="#f1ece4" />
          <ellipse cx={cx} cy={cy + 14} rx={11} ry={6} fill="#a04a45" />
        </g>
      );
  }
};

/** رأس المعلّق: رجل في الخمسينات بشعر رمادي وشارب ولحية مشذبة ونظارة مستديرة */
export const NarratorFace: React.FC<FaceProps> = ({mouth, blink, gazeX, gazeY, brow, tilt}) => {
  const browY = -6 * brow;
  return (
    <g transform={`rotate(${tilt} 260 270)`}>
      {/* الأذنان */}
      <ellipse cx={176} cy={196} rx={11} ry={20} fill={PAL.skinShade} />
      <ellipse cx={344} cy={196} rx={11} ry={20} fill={PAL.skinShade} />
      {/* الشعر خلف الرأس */}
      <path d="M 172 168 Q 168 96 260 92 Q 352 96 348 168 Q 340 128 260 124 Q 180 128 172 168 Z" fill={PAL.hairGrey} />
      {/* الوجه */}
      <path
        d="M 178 160 Q 178 100 260 98 Q 342 100 342 160 L 340 214 Q 336 280 260 296 Q 184 280 180 214 Z"
        fill={PAL.skin}
      />
      {/* ظل جانبي */}
      <path d="M 178 160 Q 178 100 260 98 Q 210 110 202 190 Q 200 250 236 288 Q 184 280 180 214 Z" fill={PAL.skinShade} opacity={0.35} />
      {/* الجبهة والتجاعيد */}
      <path d="M 214 138 Q 260 128 306 138" fill="none" stroke={PAL.skinDark} strokeWidth={2} opacity={0.35} strokeLinecap="round" />
      <path d="M 220 150 Q 260 142 300 150" fill="none" stroke={PAL.skinDark} strokeWidth={1.6} opacity={0.25} strokeLinecap="round" />
      {/* الحاجبان */}
      <path d={`M 205 ${166 + browY} Q 224 ${156 + browY} 246 ${164 + browY * 0.6}`} fill="none" stroke={PAL.hairGrey} strokeWidth={7} strokeLinecap="round" />
      <path d={`M 274 ${164 + browY * 0.6} Q 296 ${156 + browY} 315 ${166 + browY}`} fill="none" stroke={PAL.hairGrey} strokeWidth={7} strokeLinecap="round" />
      {/* العينان */}
      <Eye cx={226} cy={190} blink={blink} gx={gazeX} gy={gazeY} />
      <Eye cx={294} cy={190} blink={blink} gx={gazeX} gy={gazeY} />
      {/* النظارة الدائرية */}
      <circle cx={226} cy={190} r={25} fill="rgba(255,255,255,0.06)" stroke={GLASS} strokeWidth={4} />
      <circle cx={294} cy={190} r={25} fill="rgba(255,255,255,0.06)" stroke={GLASS} strokeWidth={4} />
      <path d="M 251 188 Q 260 182 269 188" fill="none" stroke={GLASS} strokeWidth={4} />
      <line x1={201} y1={186} x2={178} y2={182} stroke={GLASS} strokeWidth={3.4} />
      <line x1={319} y1={186} x2={342} y2={182} stroke={GLASS} strokeWidth={3.4} />
      {/* الأنف */}
      <path d="M 260 190 Q 250 224 244 236 Q 260 246 276 236 Q 270 224 260 190" fill={PAL.skinShade} opacity={0.7} />
      <ellipse cx={252} cy={237} rx={4} ry={2.6} fill={PAL.skinDark} opacity={0.6} />
      <ellipse cx={268} cy={237} rx={4} ry={2.6} fill={PAL.skinDark} opacity={0.6} />
      {/* اللحية المشذبة */}
      <path d="M 184 214 Q 188 292 260 306 Q 332 292 336 214 Q 322 262 260 270 Q 198 262 184 214 Z" fill={PAL.hairGrey} />
      {/* الفم داخل فجوة اللحية */}
      <Mouth shape={mouth} cx={260} cy={266} />
      {/* الشارب */}
      <path d="M 218 252 Q 236 240 260 250 Q 284 240 302 252 Q 290 266 260 258 Q 230 266 218 252 Z" fill={PAL.hairGrey} />
      <path d="M 232 250 Q 260 258 288 250" fill="none" stroke="#6a6662" strokeWidth={1.6} opacity={0.6} />
      {/* الشعر الأمامي */}
      <path d="M 176 150 Q 190 98 260 96 Q 330 98 344 150 Q 330 118 260 114 Q 190 118 176 150 Z" fill={PAL.hairGrey} />
      <path d="M 196 118 Q 226 104 258 108" fill="none" stroke="#b3b0ab" strokeWidth={3} opacity={0.6} strokeLinecap="round" />
    </g>
  );
};
