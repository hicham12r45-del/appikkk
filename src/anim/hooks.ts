import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, easeOutCubic, invLerp} from './math';

/** تقدّم خطي 0..1 بين إطارين محليين */
export const useProgress = (start: number, duration: number): number => {
  const frame = useCurrentFrame();
  return clamp(invLerp(start, start + duration, frame));
};

/** تقدّم مع تسهيل خروج ناعم */
export const useEasedProgress = (start: number, duration: number): number => easeOutCubic(useProgress(start, duration));

/** نابض (spring) بعد تأخير */
export const useSpringIn = (delay = 0, damping = 14, stiffness = 90, mass = 0.8): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, stiffness, mass}});
};

/** زمن محلي بالثواني */
export const useSeconds = (): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};
