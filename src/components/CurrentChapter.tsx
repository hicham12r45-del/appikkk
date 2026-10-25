import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChapterIndicator} from '../infographics/Hud';
import {RESOLVED_SCENES} from '../lib/timeline';

/** يحدد الفصل الحالي من خطة المشاهد ويمرره إلى مؤشر الفصول */
export const CurrentChapter: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = RESOLVED_SCENES.find((s) => frame >= s.startFrame && frame < s.endFrame) ?? RESOLVED_SCENES[RESOLVED_SCENES.length - 1];
  return <ChapterIndicator chapter={scene.chapter} />;
};
