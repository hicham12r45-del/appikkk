import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {clamp, easeOutBack, easeOutCubic, invLerp, lerp, fadeWindow} from '../anim/math';
import {PAL} from '../art/palette';
import {COLORS, FPS, TOTAL_FRAMES} from '../config';
import {ARABIC_FONT} from '../fonts';

/** شريط تعريف باسم شخصية (يظهر من الجانب مع شريط أحمر) */
export const NameLowerThird: React.FC<{name: string; role: string; duration: number}> = ({name, role, duration}) => {
  const frame = useCurrentFrame();
  const inP = easeOutCubic(clamp(invLerp(0, 26, frame)));
  const outP = easeOutCubic(clamp(invLerp(duration - 20, duration, frame)));
  const x = lerp(-700, 0, inP) + outP * -700;
  const bar = easeOutCubic(clamp(invLerp(4, 34, frame)));
  return (
    <AbsoluteFill style={{pointerEvents: 'none', justifyContent: 'flex-end', alignItems: 'flex-end', direction: 'rtl', fontFamily: ARABIC_FONT}}>
      <div style={{transform: `translateX(${-x}px)`, margin: '0 100px 150px 0', textAlign: 'right'}}>
        <div style={{fontSize: 30, color: PAL.sepia, letterSpacing: 1, marginBottom: 4}}>{role}</div>
        <div style={{fontSize: 78, fontWeight: 700, color: COLORS.offWhite, textShadow: '0 4px 24px rgba(0,0,0,0.95)', lineHeight: 1.1}}>{name}</div>
        <div style={{height: 6, width: 420 * bar, marginTop: 10, background: `linear-gradient(270deg, ${PAL.redBright}, ${PAL.redDeep})`, marginLeft: 'auto'}} />
      </div>
    </AbsoluteFill>
  );
};

/** عبارة منطوقة حرفياً تظهر كلمة كلمة بحركة نابضة */
export const KineticPhrase: React.FC<{
  words: string[];
  duration: number;
  position?: 'center' | 'top' | 'bottom';
  size?: number;
  stagger?: number;
  accentIndex?: number;
}> = ({words, duration, position = 'center', size = 110, stagger = 14, accentIndex = -1}) => {
  const frame = useCurrentFrame();
  const out = easeOutCubic(clamp(invLerp(duration - 18, duration, frame)));
  const justify = position === 'center' ? 'center' : position === 'top' ? 'flex-start' : 'flex-end';
  return (
    <AbsoluteFill style={{pointerEvents: 'none', justifyContent: justify, alignItems: 'center', padding: position === 'center' ? 0 : '140px 0', direction: 'rtl', fontFamily: ARABIC_FONT}}>
      <div style={{display: 'flex', gap: size * 0.3, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1600, opacity: 1 - out}}>
        {words.map((w, i) => {
          const t = easeOutBack(clamp(invLerp(i * stagger, i * stagger + 22, frame)));
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                fontSize: size,
                fontWeight: 700,
                color: i === accentIndex ? PAL.redBright : COLORS.offWhite,
                textShadow: '0 6px 30px rgba(0,0,0,0.95)',
                transform: `translateY(${(1 - t) * 60}px) scale(${0.7 + 0.3 * t})`,
                opacity: clamp(t),
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** عدّاد رقمي كبير بتسمية */
export const CounterNumber: React.FC<{to: number; label: string; suffix?: string; duration: number}> = ({to, label, suffix = '', duration}) => {
  const frame = useCurrentFrame();
  const inP = easeOutCubic(clamp(invLerp(0, 70, frame)));
  const fade = fadeWindow(frame, 0, duration, 16, 18);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', justifyContent: 'center', alignItems: 'center', direction: 'rtl', fontFamily: ARABIC_FONT, opacity: fade}}>
      <div style={{textAlign: 'center', textShadow: '0 6px 30px rgba(0,0,0,0.95)'}}>
        <div style={{fontSize: 240, fontWeight: 700, color: COLORS.offWhite, lineHeight: 1}}>
          {Math.round(to * inP)}
          <span style={{color: PAL.redBright}}>{suffix}</span>
        </div>
        <div style={{fontSize: 64, color: PAL.sepia}}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

interface Milestone {
  sec: number;
  label: string;
}

export const TIMELINE_MILESTONES: Milestone[] = [
  {sec: 76, label: '١٩١٤'},
  {sec: 169, label: 'فبراير ١٩١٧'},
  {sec: 206, label: 'مارس ١٩١٧'},
  {sec: 287, label: 'أبريل ١٩١٧'},
  {sec: 435, label: 'أكتوبر ١٩١٧'},
  {sec: 511, label: '١٩١٨'},
  {sec: 554, label: '١٩٢٢'},
];

/** شريط زمني رفيع أسفل الشاشة يتقدم مع الفيلم، وتظهر عليه محطات التواريخ المذكورة في النص */
export const TimelineBar: React.FC<{totalSec: number}> = ({totalSec}) => {
  const frame = useCurrentFrame();
  const sec = frame / FPS;
  const progress = clamp(sec / totalSec);
  const width = 1500;
  const left = (1920 - width) / 2;
  const fadeIn = clamp(invLerp(5, 8, sec));
  const fadeOut = 1 - clamp(invLerp(totalSec - 6, totalSec - 2, sec));
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.9 * fadeIn * fadeOut}}>
      <div style={{position: 'absolute', left, bottom: 28, width, height: 4, backgroundColor: 'rgba(241,233,218,0.2)'}} />
      <div style={{position: 'absolute', left, bottom: 28, width: width * progress, height: 4, background: `linear-gradient(90deg, ${PAL.redDeep}, ${PAL.redBright})`}} />
      {TIMELINE_MILESTONES.map((m) => {
        const x = left + (m.sec / totalSec) * width;
        const reached = sec >= m.sec;
        return (
          <div key={m.sec} style={{position: 'absolute', left: x - 5, bottom: 24, width: 10, height: 12, borderRadius: 6, backgroundColor: reached ? PAL.redBright : '#5a5750'}}>
            <div style={{position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontFamily: ARABIC_FONT, fontSize: 22, color: reached ? COLORS.offWhite : '#7d7a73', direction: 'rtl'}}>{m.label}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: left + width * progress - 8, bottom: 20, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.offWhite, boxShadow: '0 0 14px rgba(209,46,43,0.9)'}} />
    </AbsoluteFill>
  );
};

/** مؤشر الفصل في الزاوية العليا: ستة نقاط تضيء بحسب الفصل الحالي */
export const ChapterIndicator: React.FC<{chapter: number}> = ({chapter}) => {
  const frame = useCurrentFrame();
  if (chapter <= 0) return null;
  const pop = easeOutBack(clamp(invLerp(0, 20, frame % 100000)));
  return (
    <AbsoluteFill style={{pointerEvents: 'none', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
      <div style={{display: 'flex', gap: 10, margin: '44px 0 0 56px', direction: 'ltr', opacity: 0.85 * clamp(pop)}}>
        {[1, 2, 3, 4, 5, 6].map((c) => (
          <div key={c} style={{width: c === chapter ? 44 : 14, height: 8, borderRadius: 4, backgroundColor: c === chapter ? PAL.redBright : c < chapter ? PAL.sepia : 'rgba(241,233,218,0.25)', transition: 'none'}} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** ختم تاريخي دائري يظهر ويدور قليلاً (للتواريخ المفصلية) */
export const DateStamp: React.FC<{text: string; sub?: string; duration: number}> = ({text, sub, duration}) => {
  const frame = useCurrentFrame();
  const inP = easeOutBack(clamp(invLerp(0, 24, frame)));
  const fade = fadeWindow(frame, 0, duration, 6, 18);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', justifyContent: 'flex-start', alignItems: 'flex-end', opacity: fade}}>
      <div style={{margin: '70px 90px 0 0', transform: `scale(${inP}) rotate(${-8 + Math.sin(frame * 0.03) * 1.5}deg)`, direction: 'rtl', fontFamily: ARABIC_FONT, width: 230, height: 230, borderRadius: '50%', border: `8px double ${PAL.redBright}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: PAL.redBright, backgroundColor: 'rgba(10,8,8,0.55)', textAlign: 'center'}}>
        <div style={{fontSize: 46, fontWeight: 700, lineHeight: 1.1}}>{text}</div>
        {sub && <div style={{fontSize: 26, color: PAL.offWhite, marginTop: 6}}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

export const hudTotalFrames = TOTAL_FRAMES;
