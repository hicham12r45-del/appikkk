import {fadeWindow, lerp, smoothstep} from '../anim/math';
import {FPS} from '../config';

/**
 * متى يظهر المعلّق وبأي حجم. البيانات هنا فقط؛ عدّلها بحرية.
 * hidden = يختفي (عند الرسوم الكبيرة التي تشغل الشاشة)، large = يكبر ويتوسط (الخاتمة).
 */
export interface NarratorWindow {
  fromSec: number;
  toSec: number;
  mode: 'hidden' | 'large';
}

export const NARRATOR_WINDOWS: NarratorWindow[] = [
  {fromSec: 0, toSec: 5.8, mode: 'hidden'}, // بطاقة العنوان
  {fromSec: 9, toSec: 14, mode: 'hidden'}, // بطاقة الفصل الأول
  {fromSec: 93, toSec: 98, mode: 'hidden'},
  {fromSec: 196.5, toSec: 201, mode: 'hidden'},
  {fromSec: 287, toSec: 291.5, mode: 'hidden'},
  {fromSec: 400, toSec: 404.5, mode: 'hidden'},
  {fromSec: 454, toSec: 462, mode: 'hidden'}, // اقتحام قصر الشتاء: الرسم المتحرك أهم
  {fromSec: 493.5, toSec: 498, mode: 'hidden'},
  {fromSec: 603, toSec: 615.7, mode: 'large'}, // الخاتمة
];

const FADE = 18;

/** نسبة الظهور 0..1 */
export const narratorPresence = (frame: number): number => {
  let hide = 0;
  for (const w of NARRATOR_WINDOWS) {
    if (w.mode !== 'hidden') continue;
    hide = Math.max(hide, fadeWindow(frame, w.fromSec * FPS, w.toSec * FPS, FADE, FADE));
  }
  return 1 - smoothstep(hide);
};

/** معامل الحجم الكبير 0..1 (للخاتمة) */
export const narratorLargeness = (frame: number): number => {
  let large = 0;
  for (const w of NARRATOR_WINDOWS) {
    if (w.mode !== 'large') continue;
    large = Math.max(large, fadeWindow(frame, w.fromSec * FPS, w.toSec * FPS, 60, 30));
  }
  return smoothstep(large);
};

export const narratorScale = (frame: number, base: number, large: number): number =>
  lerp(base, large, narratorLargeness(frame));
