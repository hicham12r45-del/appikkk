import React from 'react';
import {Composition} from 'remotion';
import {Documentary} from './Documentary';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './config';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="RussianRevolution"
      component={Documentary}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
