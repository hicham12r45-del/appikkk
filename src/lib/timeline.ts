import {FPS, TOTAL_FRAMES} from '../config';
import {SCENES} from '../scenePlan';
import type {ResolvedScene} from '../types';

export const resolveScenes = (): ResolvedScene[] => {
  return SCENES.map((scene, i) => {
    const startFrame = i === 0 ? 0 : Math.round(scene.startSec * FPS);
    const next = SCENES[i + 1];
    const endFrame = next ? Math.round(next.startSec * FPS) : TOTAL_FRAMES;
    if (endFrame <= startFrame) {
      throw new Error(`Scene "${scene.id}" has non-positive duration (start ${startFrame}, end ${endFrame})`);
    }
    return {...scene, startFrame, endFrame};
  });
};

export const RESOLVED_SCENES = resolveScenes();
