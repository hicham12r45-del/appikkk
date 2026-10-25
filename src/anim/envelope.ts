import {NARRATION_ENVELOPE} from '../data/narrationEnvelope';
import {clamp} from './math';

/** شدة صوت المعلّق عند إطار معيّن (0..1) */
export const envelopeAt = (frame: number): number => {
  const i = Math.max(0, Math.min(NARRATION_ENVELOPE.length - 1, Math.round(frame)));
  return clamp(NARRATION_ENVELOPE[i] ?? 0, 0, 1);
};

/** متوسط متحرك لتنعيم الحركة */
export const smoothEnvelopeAt = (frame: number, radius = 3): number => {
  let sum = 0;
  let n = 0;
  for (let k = -radius; k <= radius; k++) {
    sum += envelopeAt(frame + k);
    n++;
  }
  return sum / n;
};

/** هل المعلّق يتكلم الآن؟ */
export const isSpeaking = (frame: number): boolean => smoothEnvelopeAt(frame, 4) > 0.07;

/**
 * مستوى "الكلام" البطيء لخفض الموسيقى (sidechain): يقترب من 1 أثناء الكلام ومن 0 في الصمت،
 * بنافذة واسعة (حوالي ثانية) حتى لا يتذبذب مستوى الموسيقى مع كل مقطع.
 */
export const speechPresence = (frame: number): number => {
  const radius = 15;
  let hits = 0;
  let n = 0;
  for (let k = -radius; k <= radius; k += 3) {
    if (envelopeAt(frame + k) > 0.08) hits++;
    n++;
  }
  return hits / n;
};

/** شكل الفم (0 مغلق ... 3 مفتوح واسعاً) مشتق من شدة الصوت */
export const mouthShapeAt = (frame: number): 0 | 1 | 2 | 3 => {
  const e = smoothEnvelopeAt(frame, 1);
  if (e < 0.06) return 0;
  if (e < 0.22) return 1;
  if (e < 0.5) return 2;
  return 3;
};
