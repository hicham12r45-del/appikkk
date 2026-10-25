import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ARABIC_FONT} from '../fonts';
import {COLORS} from '../config';

interface Props {
  text: string;
  duration: number;
}

// شريط تعريفي (تاريخ أو مكان) أسفل الشاشة
export const Caption: React.FC<Props> = ({text, duration}) => {
  const frame = useCurrentFrame();
  const fade = 18;
  const opacity = interpolate(frame, [0, fade, duration - fade, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slide = interpolate(frame, [0, 30], [30, 0], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-end', direction: 'rtl', fontFamily: ARABIC_FONT}}>
      <div
        style={{
          opacity,
          transform: `translateX(${slide}px)`,
          margin: '0 110px 90px 0',
          paddingRight: 24,
          borderRight: `6px solid ${COLORS.red}`,
          fontSize: 58,
          fontWeight: 700,
          color: COLORS.offWhite,
          textShadow: '0 3px 20px rgba(0,0,0,0.95)',
          textAlign: 'right',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
