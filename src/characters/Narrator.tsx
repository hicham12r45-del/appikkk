import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {PAL} from '../art/palette';
import {clamp, degToRad, fbm1D, lerp} from '../anim/math';
import {envelopeAt, mouthShapeAt, smoothEnvelopeAt} from '../anim/envelope';
import {NarratorFace} from './NarratorFace';
import {narratorLargeness, narratorPresence} from './narratorSchedule';
import {poseAt, type ArmPose} from './poses';

const SHOULDER_R: [number, number] = [388, 352];
const SHOULDER_L: [number, number] = [132, 352];
const UPPER = 138;
const FORE = 128;

const arm = (shoulder: [number, number], pose: ArmPose, mirror: boolean) => {
  const a1 = degToRad(mirror ? 180 - pose.shoulder : pose.shoulder);
  const a2 = degToRad(mirror ? 180 - (pose.shoulder + pose.elbow) : pose.shoulder + pose.elbow);
  const elbow: [number, number] = [shoulder[0] + Math.cos(a1) * UPPER, shoulder[1] + Math.sin(a1) * UPPER];
  const hand: [number, number] = [elbow[0] + Math.cos(a2) * FORE, elbow[1] + Math.sin(a2) * FORE];
  return {elbow, hand, foreAngle: a2};
};

const Hand: React.FC<{x: number; y: number; angle: number}> = ({x, y, angle}) => (
  <g transform={`translate(${x} ${y}) rotate(${(angle * 180) / Math.PI})`}>
    <rect x={-6} y={-13} width={32} height={26} rx={12} fill={PAL.skin} />
    <ellipse cx={14} cy={-14} rx={10} ry={5} fill={PAL.skin} transform="rotate(-24 14 -14)" />
    {[-8, -2, 4, 10].map((o) => (
      <line key={o} x1={14} y1={o} x2={26} y2={o} stroke={PAL.skinDark} strokeWidth={1.2} opacity={0.45} />
    ))}
  </g>
);

const Sleeve: React.FC<{from: [number, number]; elbow: [number, number]; hand: [number, number]}> = ({from, elbow, hand}) => (
  <g>
    <line x1={from[0]} y1={from[1]} x2={elbow[0]} y2={elbow[1]} stroke={PAL.coat} strokeWidth={52} strokeLinecap="round" />
    <line x1={elbow[0]} y1={elbow[1]} x2={hand[0]} y2={hand[1]} stroke={PAL.coat} strokeWidth={44} strokeLinecap="round" />
    <circle cx={elbow[0]} cy={elbow[1]} r={25} fill={PAL.coat} />
    {/* حاشية الكمّ */}
    <circle cx={hand[0]} cy={hand[1]} r={23} fill={PAL.coatDark} />
    <circle cx={hand[0]} cy={hand[1]} r={14} fill="#efe9de" opacity={0.9} />
  </g>
);

const blinkAt = (frame: number): number => {
  const a = frame % 137;
  const b = (frame + 61) % 223;
  const va = a < 6 ? Math.sin((a / 6) * Math.PI) : 0;
  const vb = b < 5 ? Math.sin((b / 5) * Math.PI) : 0;
  return clamp(Math.max(va, vb));
};

export const NARRATOR_WIDTH = 520;
export const NARRATOR_HEIGHT = 760;

interface Props {
  /** موضع الزاوية السفلية اليسرى للمعلّق */
  baseX?: number;
  baseY?: number;
  scale?: number;
  largeScale?: number;
}

/** المعلّق: شخصية متحركة؛ الفم من شدة الصوت الحقيقية، والذراعان تتبعان جدول الإيماءات */
export const Narrator: React.FC<Props> = ({baseX = 20, baseY = 1080, scale = 0.78, largeScale = 1.12}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const sec = frame / fps;

  const presence = narratorPresence(frame);
  if (presence <= 0.001) return null;
  const largeness = narratorLargeness(frame);

  const env = smoothEnvelopeAt(frame, 2);
  const rawEnv = envelopeAt(frame);
  const pose = poseAt(sec);

  // حركة دقيقة تتبع الكلام
  const talk = clamp(env * 1.6);
  const breathe = Math.sin(frame * 0.06) * 3;
  const nod = Math.sin(frame * 0.27) * 2.4 * talk;
  const sway = fbm1D(frame * 0.012, 4) * 6;
  const armJitterR = Math.sin(frame * 0.33) * 6 * talk + fbm1D(frame * 0.02, 9) * 4;
  const armJitterL = Math.sin(frame * 0.29 + 1) * 3 * talk;

  const armR = arm(SHOULDER_R, {shoulder: pose.armR.shoulder + armJitterR, elbow: pose.armR.elbow + armJitterR * 0.5}, false);
  const armL = arm(SHOULDER_L, {shoulder: pose.armL.shoulder + armJitterL, elbow: pose.armL.elbow}, true);

  const brow = clamp(rawEnv * 1.2 - 0.25 + fbm1D(frame * 0.015, 2) * 0.35, -0.6, 1);
  const gazeX = clamp(0.55 + fbm1D(frame * 0.01, 5) * 0.5, -1, 1);
  const gazeY = clamp(fbm1D(frame * 0.013, 8) * 0.5, -1, 1);

  const s = lerp(scale, largeScale, largeness);
  // ينزلق من اليسار عند الظهور، ويتوسط الشاشة قليلاً عند الخاتمة
  const slide = (1 - presence) * -320;
  const x = lerp(baseX, width / 2 - (NARRATOR_WIDTH * s) / 2 - 360, largeness) + slide;
  const y = baseY - NARRATOR_HEIGHT * s + 46 + (1 - presence) * 40;

  const chainSwing = Math.sin(frame * 0.05) * 5;

  return (
    <g opacity={presence} transform={`translate(${x} ${y}) scale(${s}) rotate(${pose.lean + sway * 0.1} 260 760)`}>
      {/* ظل أرضي ناعم خلف الشخصية */}
      <ellipse cx={260} cy={758} rx={230} ry={22} fill="rgba(0,0,0,0.4)" />

      {/* الذراع الخلفية (اليسرى على الشاشة) */}
      <Sleeve from={SHOULDER_L} elbow={armL.elbow} hand={armL.hand} />
      {pose.book && (
        <g transform={`translate(${armL.hand[0]} ${armL.hand[1]}) rotate(-12)`}>
          <rect x={-46} y={-70} width={96} height={118} rx={5} fill={PAL.redDeep} stroke={PAL.gold} strokeWidth={3} />
          <rect x={-38} y={-62} width={80} height={102} fill="none" stroke={PAL.gold} strokeWidth={1.6} opacity={0.7} />
          <circle cx={2} cy={-12} r={16} fill="none" stroke={PAL.gold} strokeWidth={2} />
        </g>
      )}
      <Hand x={armL.hand[0]} y={armL.hand[1]} angle={armL.foreAngle} />

      {/* الجذع */}
      <g transform={`translate(0 ${breathe * 0.5})`}>
        <path d="M 118 352 Q 118 322 170 312 L 350 312 Q 402 322 402 352 L 430 760 L 90 760 Z" fill={PAL.coat} />
        <path d="M 260 312 L 260 760" stroke={PAL.coatDark} strokeWidth={3} />
        {/* السترة الداخلية والقميص */}
        <path d="M 214 312 L 260 520 L 306 312 Z" fill="#d8d1c3" />
        <path d="M 214 312 L 232 312 L 260 430 L 246 520 Z" fill={PAL.coatDark} opacity={0.5} />
        {/* ربطة العنق */}
        <path d="M 252 330 L 268 330 L 274 372 L 260 480 L 246 372 Z" fill={PAL.redDeep} />
        <path d="M 253 330 L 267 330 L 262 346 L 258 346 Z" fill={PAL.red} />
        {/* طية الياقة */}
        <path d="M 170 312 L 214 312 L 244 392 L 196 414 Z" fill="#23221e" />
        <path d="M 350 312 L 306 312 L 276 392 L 324 414 Z" fill="#23221e" />
        {/* جيب وسلسلة ساعة */}
        <path d={`M 200 440 Q ${230 + chainSwing} 470 ${262} 448`} fill="none" stroke={PAL.gold} strokeWidth={3} />
        <circle cx={200} cy={440} r={4} fill={PAL.gold} />
        <circle cx={262} cy={448} r={8} fill={PAL.gold} stroke={PAL.goldDeep} strokeWidth={2} />
        {/* أزرار */}
        {[540, 610, 680].map((by) => (
          <circle key={by} cx={254} cy={by} r={6} fill="#14130f" />
        ))}
      </g>

      {/* العنق والياقة البيضاء */}
      <rect x={232} y={282} width={56} height={48} fill={PAL.skinShade} />
      <path d="M 218 318 L 236 296 L 260 330 L 284 296 L 302 318 L 260 346 Z" fill="#efe9de" />

      {/* الرأس */}
      <g transform={`translate(0 ${breathe * 0.4 + nod})`}>
        <NarratorFace
          mouth={mouthShapeAt(frame)}
          blink={blinkAt(frame)}
          gazeX={gazeX}
          gazeY={gazeY}
          brow={brow}
          tilt={pose.lean * 0.8 + Math.sin(frame * 0.02) * 1.2}
        />
      </g>

      {/* الذراع الأمامية (اليمنى على الشاشة) */}
      <Sleeve from={SHOULDER_R} elbow={armR.elbow} hand={armR.hand} />
      {pose.pointer && (
        <g transform={`translate(${armR.hand[0]} ${armR.hand[1]}) rotate(${(armR.foreAngle * 180) / Math.PI})`}>
          <line x1={-10} y1={0} x2={240} y2={0} stroke="#3b2a1a" strokeWidth={6} strokeLinecap="round" />
          <circle cx={244} cy={0} r={6} fill={PAL.redBright} />
        </g>
      )}
      <Hand x={armR.hand[0]} y={armR.hand[1]} angle={armR.foreAngle} />
    </g>
  );
};
