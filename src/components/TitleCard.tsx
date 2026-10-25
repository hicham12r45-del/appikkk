import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ARABIC_FONT} from '../fonts';
import {COLORS} from '../config';
import type {TitleCardDef} from '../types';

interface Props {
  card: TitleCardDef;
  /** مدة ظهور البطاقة بالإطارات */
  duration: number;
}

export const TitleCard: React.FC<Props> = ({card, duration}) => {
  const frame = useCurrentFrame();
  const fade = 22;
  const opacity = interpolate(frame, [0, fade, duration - fade, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rise = interpolate(frame, [0, 40], [18, 0], {extrapolateRight: 'clamp'});
  const lineW = interpolate(frame, [6, 50], [0, card.big ? 520 : 360], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        justifyContent: 'center',
        alignItems: 'center',
        direction: 'rtl',
        fontFamily: ARABIC_FONT,
        background:
          'radial-gradient(ellipse at center, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0) 100%)',
      }}
    >
      <div style={{textAlign: 'center', transform: `translateY(${rise}px)`, padding: '0 140px'}}>
        {card.eyebrow && (
          <div style={{fontSize: 52, color: COLORS.sepia, letterSpacing: 2, marginBottom: 10}}>{card.eyebrow}</div>
        )}
        <div
          style={{
            fontSize: card.big ? 150 : 100,
            fontWeight: 700,
            lineHeight: 1.25,
            color: COLORS.offWhite,
            textShadow: '0 4px 28px rgba(0,0,0,0.85)',
          }}
        >
          {card.title}
        </div>
        <div style={{height: 4, width: lineW, backgroundColor: COLORS.red, margin: '22px auto'}} />
        {card.subtitle && (
          <div
            style={{
              fontSize: 64,
              color: COLORS.sepia,
              textShadow: '0 3px 18px rgba(0,0,0,0.85)',
            }}
          >
            {card.subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
