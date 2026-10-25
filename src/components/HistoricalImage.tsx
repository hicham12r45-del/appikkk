import React from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {HEIGHT, IMAGE_FIT, WIDTH} from '../config';
import type {MotionStyle, VisualType} from '../types';

interface Props {
  asset: string;
  visualType: VisualType;
  motionStyle: MotionStyle;
  /** إجمالي عدد إطارات هذا المشهد (بما فيها المزج) */
  durationInFrames: number;
}

// حركة كاميرا بطيئة: مقياس + إزاحة بالبكسل
const motionFor = (style: MotionStyle, p: number) => {
  const px = WIDTH * 0.025;
  const py = HEIGHT * 0.025;
  switch (style) {
    case 'pushIn':
      return {scale: interpolate(p, [0, 1], [1.02, 1.13]), x: 0, y: 0};
    case 'pullBack':
      return {scale: interpolate(p, [0, 1], [1.14, 1.03]), x: 0, y: 0};
    case 'panLeft':
      return {scale: 1.1, x: interpolate(p, [0, 1], [px, -px]), y: 0};
    case 'panRight':
      return {scale: 1.1, x: interpolate(p, [0, 1], [-px, px]), y: 0};
    case 'driftUp':
      return {scale: 1.09, x: 0, y: interpolate(p, [0, 1], [py, -py])};
    case 'driftDown':
      return {scale: 1.09, x: 0, y: interpolate(p, [0, 1], [-py, py])};
  }
};

export const HistoricalImage: React.FC<Props> = ({asset, visualType, motionStyle, durationInFrames}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  const {scale, x, y} = motionFor(motionStyle, p);
  const src = staticFile(asset);

  const isPoster = visualType === 'poster';
  const fit = isPoster ? 'contain' : IMAGE_FIT;
  // الملصقات تُعرض كاملة بلا تمديد ولا قص، فوق خلفية ضبابية معتمة من نفس الصورة
  const needsBackdrop = fit === 'contain';

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#0b0b0d'}}>
      {needsBackdrop && (
        <Img
          src={src}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(48px) brightness(0.35) saturate(0.8)',
            transform: 'scale(1.25)',
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          // الملصق يترك هامشاً صغيراً حتى لا يلامس الحواف أثناء الحركة
          inset: isPoster ? '3% 0' : 0,
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: fit,
            // معالجة لونية تاريخية هادئة للصور فقط؛ الملصقات تبقى كما هي
            filter: isPoster ? 'none' : 'sepia(0.22) contrast(1.06) saturate(0.82) brightness(0.92)',
          }}
        />
      </div>
    </div>
  );
};
