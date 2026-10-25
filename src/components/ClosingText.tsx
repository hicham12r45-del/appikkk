import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ARABIC_FONT} from '../fonts';
import {COLORS} from '../config';

// الجملة الأخيرة المنطوقة حرفياً، تظهر بهدوء وتبقى حتى آخر إطار
export const ClosingText: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [10, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', direction: 'rtl', fontFamily: ARABIC_FONT}}>
      <div
        style={{
          opacity,
          marginBottom: 120,
          fontSize: 84,
          fontWeight: 700,
          color: COLORS.offWhite,
          textShadow: '0 4px 28px rgba(0,0,0,0.95)',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
