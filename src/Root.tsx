import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import {Documentary} from './Documentary';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './config';

// نسخة 1280×720: نفس الفيلم بالضبط لكن مُصغَّر بنسبة 2/3، فيُرندر أسرع بكثير
const Documentary720: React.FC = () => (
  <AbsoluteFill>
    <div style={{width: WIDTH, height: HEIGHT, transform: 'scale(0.6666667)', transformOrigin: 'top left'}}>
      <Documentary />
    </div>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="RussianRevolution" component={Documentary} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="RussianRevolution720" component={Documentary720} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1280} height={720} />
    </>
  );
};