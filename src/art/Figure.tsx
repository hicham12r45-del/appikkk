import React from 'react';
import {PAL} from './palette';

export type FigureKind = 'worker' | 'woman' | 'soldier' | 'redGuard' | 'noble' | 'peasant' | 'officer' | 'sailor';

export interface FigureProps {
  kind: FigureKind;
  x: number;
  y: number; // موضع القدمين
  scale?: number;
  flip?: boolean;
  /** طور المشي بالراديان؛ 0 للوقوف */
  walkPhase?: number;
  /** سعة المشي: 0 وقوف، 1 مشي عادي */
  walkAmount?: number;
  /** رفع اليد اليمنى للأعلى (0..1) كما في الهتاف */
  cheer?: number;
  /** إظهار العلم/الراية على العمود */
  flagColor?: string | null;
  /** تعتيم اللون العام (للظلال البعيدة) */
  tint?: string;
  opacity?: number;
  bobAmount?: number;
}

interface Look {
  coat: string;
  coatDark: string;
  trousers: string;
  skin: string;
  hat: 'cap' | 'ushanka' | 'scarf' | 'top' | 'peaked' | 'sailor' | 'none';
  hatColor: string;
  carries: 'none' | 'rifle' | 'bundle' | 'bread' | 'book' | 'cane';
  armband: boolean;
  longCoat: boolean;
  skirt: boolean;
}

const LOOKS: Record<FigureKind, Look> = {
  worker: {
    coat: '#4a463d',
    coatDark: '#2f2c26',
    trousers: '#2b2a28',
    skin: PAL.skin,
    hat: 'cap',
    hatColor: '#2b2824',
    carries: 'none',
    armband: false,
    longCoat: false,
    skirt: false,
  },
  woman: {
    coat: '#5a4a44',
    coatDark: '#3a2f2c',
    trousers: '#3a2f2c',
    skin: PAL.skin,
    hat: 'scarf',
    hatColor: '#7d6a5a',
    carries: 'bread',
    armband: false,
    longCoat: true,
    skirt: true,
  },
  soldier: {
    coat: PAL.khaki,
    coatDark: PAL.khakiDark,
    trousers: '#3d3b2a',
    skin: PAL.skin,
    hat: 'ushanka',
    hatColor: '#4f4d38',
    carries: 'rifle',
    armband: false,
    longCoat: true,
    skirt: false,
  },
  redGuard: {
    coat: '#3f3b34',
    coatDark: '#26231e',
    trousers: '#262421',
    skin: PAL.skin,
    hat: 'cap',
    hatColor: '#24211d',
    carries: 'rifle',
    armband: true,
    longCoat: false,
    skirt: false,
  },
  noble: {
    coat: '#26252a',
    coatDark: '#16151a',
    trousers: '#1a191d',
    skin: '#e1c6ab',
    hat: 'top',
    hatColor: '#141318',
    carries: 'cane',
    armband: false,
    longCoat: true,
    skirt: false,
  },
  peasant: {
    coat: '#6a5a46',
    coatDark: '#46392b',
    trousers: '#3b3328',
    skin: PAL.skinShade,
    hat: 'cap',
    hatColor: '#4a3e30',
    carries: 'bundle',
    armband: false,
    longCoat: true,
    skirt: false,
  },
  officer: {
    coat: '#5c5c46',
    coatDark: '#3a3a2b',
    trousers: '#2e2d22',
    skin: '#e1c6ab',
    hat: 'peaked',
    hatColor: '#4d4d3a',
    carries: 'none',
    armband: false,
    longCoat: true,
    skirt: false,
  },
  sailor: {
    coat: '#1d2431',
    coatDark: '#121722',
    trousers: '#1b212c',
    skin: PAL.skin,
    hat: 'sailor',
    hatColor: '#171c26',
    carries: 'rifle',
    armband: true,
    longCoat: false,
    skirt: false,
  },
};

const limb = (x1: number, y1: number, x2: number, y2: number, w: number, color: string): React.ReactNode => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" />
);

const Hat: React.FC<{look: Look}> = ({look}) => {
  const c = look.hatColor;
  switch (look.hat) {
    case 'cap':
      return (
        <g>
          <path d="M -17 -190 Q -16 -207 0 -207 Q 16 -207 17 -190 Z" fill={c} />
          <path d="M -3 -190 L 21 -189 L 21 -186 L -3 -186 Z" fill={c} />
        </g>
      );
    case 'ushanka':
      return (
        <g>
          <path d="M -19 -188 Q -20 -212 0 -212 Q 20 -212 19 -188 Q 14 -194 0 -194 Q -14 -194 -19 -188 Z" fill={c} />
          <path d="M -19 -190 L -22 -170 L -14 -172 Z" fill={c} />
          <path d="M 19 -190 L 22 -170 L 14 -172 Z" fill={c} />
          <circle cx={0} cy={-200} r={2.6} fill={PAL.redBright} />
        </g>
      );
    case 'scarf':
      return (
        <g>
          <path d="M -18 -186 Q -20 -208 0 -208 Q 20 -208 18 -186 Q 22 -170 12 -164 L -12 -164 Q -22 -170 -18 -186 Z" fill={c} />
          <path d="M -9 -188 Q 0 -178 9 -188 Q 6 -176 0 -174 Q -6 -176 -9 -188 Z" fill={PAL.skin} />
        </g>
      );
    case 'top':
      return (
        <g>
          <rect x={-12} y={-222} width={24} height={30} rx={2} fill={c} />
          <rect x={-20} y={-194} width={40} height={5} rx={2} fill={c} />
          <rect x={-12} y={-198} width={24} height={4} fill={PAL.charcoal} />
        </g>
      );
    case 'peaked':
      return (
        <g>
          <path d="M -18 -190 Q -18 -208 0 -208 Q 18 -208 18 -190 Z" fill={c} />
          <path d="M -20 -190 L 22 -190 L 24 -186 L -20 -186 Z" fill="#1d1d15" />
          <circle cx={0} cy={-196} r={2.4} fill={PAL.gold} />
        </g>
      );
    case 'sailor':
      return (
        <g>
          <ellipse cx={0} cy={-197} rx={19} ry={8} fill="#e8e6df" />
          <rect x={-19} y={-194} width={38} height={4} fill={c} />
          <path d="M 14 -192 L 24 -176 L 20 -176 L 12 -190 Z" fill={c} />
        </g>
      );
    default:
      return (
        <path d="M -15 -190 Q -16 -203 0 -203 Q 16 -203 15 -190 Q 8 -196 0 -196 Q -8 -196 -15 -190 Z" fill={PAL.hair} />
      );
  }
};

const Carried: React.FC<{look: Look; handX: number; handY: number; flagColor: string | null}> = ({look, handX, handY, flagColor}) => {
  if (flagColor) {
    return (
      <g>
        <line x1={handX} y1={handY + 40} x2={handX} y2={handY - 130} stroke={PAL.sepiaDark} strokeWidth={4} strokeLinecap="round" />
        <path d={`M ${handX} ${handY - 128} L ${handX + 70} ${handY - 118} L ${handX + 64} ${handY - 92} L ${handX} ${handY - 98} Z`} fill={flagColor} />
      </g>
    );
  }
  switch (look.carries) {
    case 'rifle':
      return (
        <g>
          <line x1={handX - 6} y1={handY + 34} x2={handX + 12} y2={handY - 90} stroke="#2a2118" strokeWidth={5} strokeLinecap="round" />
          <line x1={handX + 12} y1={handY - 90} x2={handX + 15} y2={handY - 118} stroke="#9aa0a4" strokeWidth={2.5} />
          <path d={`M ${handX - 6} ${handY + 34} L ${handX - 14} ${handY + 52} L ${handX - 4} ${handY + 50} Z`} fill="#3a2a1c" />
        </g>
      );
    case 'bread':
      return (
        <g>
          <ellipse cx={handX + 6} cy={handY + 10} rx={16} ry={9} fill="#b07c3d" />
          <path d={`M ${handX - 4} ${handY + 6} L ${handX} ${handY + 12} M ${handX + 4} ${handY + 4} L ${handX + 8} ${handY + 11}`} stroke="#7a521f" strokeWidth={1.6} />
        </g>
      );
    case 'bundle':
      return (
        <g>
          <path d={`M ${handX - 14} ${handY + 14} Q ${handX} ${handY - 12} ${handX + 18} ${handY + 14} Z`} fill="#8a7352" />
          <circle cx={handX + 2} cy={handY - 2} r={2} fill="#4a3e30" />
        </g>
      );
    case 'cane':
      return <line x1={handX} y1={handY + 70} x2={handX + 6} y2={handY - 6} stroke="#0e0d11" strokeWidth={4} strokeLinecap="round" />;
    case 'book':
      return <rect x={handX - 8} y={handY - 4} width={22} height={16} fill={PAL.redDeep} />;
    default:
      return null;
  }
};

export const Figure: React.FC<FigureProps> = ({
  kind,
  x,
  y,
  scale = 1,
  flip = false,
  walkPhase = 0,
  walkAmount = 0,
  cheer = 0,
  flagColor = null,
  tint,
  opacity = 1,
  bobAmount = 3,
}) => {
  const look = LOOKS[kind];
  const swing = Math.sin(walkPhase) * 26 * walkAmount;
  const bob = Math.abs(Math.sin(walkPhase)) * bobAmount * walkAmount;
  const coat = tint ?? look.coat;
  const coatDark = tint ?? look.coatDark;
  const trousers = tint ?? look.trousers;
  const skin = tint ?? look.skin;
  const dir = flip ? -1 : 1;

  const hipY = -92;
  const shoulderY = -162;
  const legLen = 90;
  const legA = (swing * Math.PI) / 180;
  const legB = (-swing * Math.PI) / 180;
  const footA: [number, number] = [Math.sin(legA) * legLen, hipY + Math.cos(legA) * legLen];
  const footB: [number, number] = [Math.sin(legB) * legLen, hipY + Math.cos(legB) * legLen];

  const armSwing = (-swing * Math.PI) / 180;
  const holdsItem = look.carries === 'rifle' || flagColor !== null;
  // اليد الأمامية (اليمنى في اتجاه النظر)
  const frontHandX = holdsItem ? 22 : Math.sin(armSwing) * 52 + 10;
  const frontHandY = holdsItem ? shoulderY + 38 : shoulderY + Math.cos(armSwing) * 52;
  const cheerLift = cheer * 70;
  const frontHand: [number, number] = [frontHandX + cheer * 8, frontHandY - cheerLift];
  const backHand: [number, number] = [-Math.sin(armSwing) * 52 - 10, shoulderY + Math.cos(armSwing) * 52];

  const hemY = look.longCoat ? -40 : -78;
  const hemW = look.skirt ? 44 : 33;

  return (
    <g transform={`translate(${x} ${y - bob}) scale(${scale * dir} ${scale})`} opacity={opacity}>
      {/* ظل أرضي */}
      <ellipse cx={0} cy={bob + 2} rx={34} ry={6} fill="rgba(0,0,0,0.35)" />
      {/* الساقان */}
      {!look.skirt && (
        <>
          {limb(0, hipY, footB[0], footB[1], 15, trousers)}
          <ellipse cx={footB[0] + 5} cy={footB[1] + 3} rx={12} ry={5} fill="#15130f" />
          {limb(0, hipY, footA[0], footA[1], 15, trousers)}
          <ellipse cx={footA[0] + 5} cy={footA[1] + 3} rx={12} ry={5} fill="#15130f" />
        </>
      )}
      {look.skirt && (
        <>
          <ellipse cx={Math.sin(legB) * 14 + 4} cy={-3} rx={11} ry={5} fill="#15130f" />
          <ellipse cx={Math.sin(legA) * 14 + 4} cy={-3} rx={11} ry={5} fill="#15130f" />
        </>
      )}
      {/* اليد الخلفية */}
      {limb(-20, shoulderY + 4, backHand[0], backHand[1], 11, coatDark)}
      {/* الجذع */}
      <path
        d={`M -24 ${shoulderY} Q -27 ${hipY} -${hemW} ${hemY} L ${hemW} ${hemY} Q 27 ${hipY} 24 ${shoulderY} Q 0 ${shoulderY - 10} -24 ${shoulderY} Z`}
        fill={coat}
      />
      <path d={`M 0 ${shoulderY - 4} L 0 ${hemY}`} stroke={coatDark} strokeWidth={2} />
      <path d={`M -${hemW} ${hemY} L ${hemW} ${hemY} L ${hemW} ${hemY - 5} L -${hemW} ${hemY - 5} Z`} fill={coatDark} opacity={0.6} />
      {look.armband && <rect x={14} y={shoulderY + 14} width={10} height={9} fill={PAL.redBright} />}
      {/* عنق ورأس */}
      <rect x={-6} y={-178} width={12} height={16} fill={skin} />
      <circle cx={0} cy={-187} r={15} fill={skin} />
      {tint === undefined && <circle cx={5} cy={-187} r={1.8} fill="#2a2018" />}
      <Hat look={look} />
      {/* اليد الأمامية والعنصر المحمول */}
      {limb(20, shoulderY + 4, frontHand[0], frontHand[1], 11, coat)}
      <circle cx={frontHand[0]} cy={frontHand[1]} r={5.5} fill={skin} />
      <Carried look={look} handX={frontHand[0]} handY={frontHand[1]} flagColor={flagColor} />
    </g>
  );
};
