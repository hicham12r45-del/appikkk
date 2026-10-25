import React from 'react';
import {AbsoluteFill} from 'remotion';
import {HEIGHT, WIDTH} from '../config';
import {Narrator} from '../characters/Narrator';

/** طبقة SVG بحجم الإطار تحمل شخصية المعلّق */
export const NarratorLayer: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
      <Narrator baseX={24} baseY={HEIGHT + 20} scale={0.74} largeScale={1.05} />
    </svg>
  </AbsoluteFill>
);
