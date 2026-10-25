import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

// بلاط ضجيج صغير يتكرر ويتحرك — أرخص بكثير من فلتر على كامل الإطار
const NOISE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
  );

export const FilmOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 2); // يتغير كل إطارين
  const ox = (step * 73) % 256;
  const oy = (step * 151) % 256;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* حبيبات فيلم خفيفة */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("${NOISE_SVG}")`,
          backgroundSize: '256px 256px',
          backgroundPosition: `${ox}px ${oy}px`,
          opacity: 0.07,
          mixBlendMode: 'overlay',
        }}
      />
      {/* تعتيم الأطراف */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
