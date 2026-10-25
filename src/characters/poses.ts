import {lerp, smoothstep} from '../anim/math';

/** وضعية ذراع من مفصلين: زوايا بالدرجات (0 = يمين الشاشة، 90 = للأسفل) */
export interface ArmPose {
  shoulder: number;
  elbow: number; // نسبي لزاوية الكتف
}

export interface BodyPose {
  armR: ArmPose; // يمين الشاشة (اليد المشيرة)
  armL: ArmPose; // يسار الشاشة
  lean: number; // ميل الجذع بالدرجات
  pointer: boolean; // يحمل عصا إشارة
  book: boolean; // يحمل كتاباً باليد اليسرى
}

export type PoseName = 'rest' | 'explain' | 'explainWide' | 'point' | 'raise' | 'book' | 'think' | 'present';

export const POSES: Record<PoseName, BodyPose> = {
  rest: {armR: {shoulder: 98, elbow: -8}, armL: {shoulder: 82, elbow: 8}, lean: 0, pointer: false, book: false},
  explain: {armR: {shoulder: 62, elbow: 62}, armL: {shoulder: 84, elbow: 12}, lean: 1.5, pointer: false, book: false},
  explainWide: {armR: {shoulder: 36, elbow: 38}, armL: {shoulder: 146, elbow: -34}, lean: 0, pointer: false, book: false},
  point: {armR: {shoulder: 8, elbow: -4}, armL: {shoulder: 84, elbow: 14}, lean: 2.5, pointer: true, book: false},
  raise: {armR: {shoulder: -38, elbow: 24}, armL: {shoulder: 86, elbow: 10}, lean: -1, pointer: false, book: false},
  book: {armR: {shoulder: 58, elbow: 76}, armL: {shoulder: 118, elbow: -88}, lean: 0.5, pointer: false, book: true},
  think: {armR: {shoulder: 70, elbow: 112}, armL: {shoulder: 84, elbow: 12}, lean: -1.5, pointer: false, book: false},
  present: {armR: {shoulder: 20, elbow: 22}, armL: {shoulder: 160, elbow: -24}, lean: 1, pointer: false, book: false},
};

const blendArm = (a: ArmPose, b: ArmPose, t: number): ArmPose => ({
  shoulder: lerp(a.shoulder, b.shoulder, t),
  elbow: lerp(a.elbow, b.elbow, t),
});

/** مزج وضعيتين بسلاسة */
export const blendPose = (a: BodyPose, b: BodyPose, t: number): BodyPose => {
  const k = smoothstep(t);
  return {
    armR: blendArm(a.armR, b.armR, k),
    armL: blendArm(a.armL, b.armL, k),
    lean: lerp(a.lean, b.lean, k),
    pointer: k < 0.5 ? a.pointer : b.pointer,
    book: k < 0.5 ? a.book : b.book,
  };
};

/**
 * جدول إيماءات المعلّق: كل مدخل (ثانية البداية → الوضعية).
 * يمكن تعديله بحرية؛ الانتقال بين الوضعيات يتم بمزج ناعم مدته نصف ثانية.
 */
export const GESTURE_TRACK: ReadonlyArray<readonly [number, PoseName]> = [
  [0, 'present'],
  [6, 'explain'],
  [18, 'explainWide'],
  [30, 'point'],
  [44, 'explain'],
  [58, 'book'],
  [72, 'think'],
  [80, 'explainWide'],
  [94, 'point'],
  [108, 'explain'],
  [122, 'raise'],
  [138, 'explainWide'],
  [150, 'think'],
  [162, 'explain'],
  [178, 'point'],
  [190, 'explainWide'],
  [200, 'explain'],
  [214, 'book'],
  [226, 'explain'],
  [240, 'point'],
  [256, 'explainWide'],
  [272, 'think'],
  [282, 'raise'],
  [290, 'explain'],
  [304, 'point'],
  [318, 'explainWide'],
  [334, 'explain'],
  [348, 'think'],
  [362, 'book'],
  [376, 'explain'],
  [392, 'present'],
  [404, 'explain'],
  [420, 'point'],
  [436, 'explainWide'],
  [452, 'raise'],
  [462, 'explain'],
  [472, 'think'],
  [484, 'explainWide'],
  [496, 'point'],
  [512, 'explain'],
  [528, 'book'],
  [544, 'explainWide'],
  [558, 'present'],
  [574, 'explain'],
  [590, 'think'],
  [602, 'raise'],
  [612, 'rest'],
];

/** الوضعية الحالية والسابقة ونسبة المزج عند ثانية معيّنة */
export const poseAt = (sec: number): BodyPose => {
  let idx = 0;
  for (let i = 0; i < GESTURE_TRACK.length; i++) {
    if (GESTURE_TRACK[i][0] <= sec) idx = i;
  }
  const [start, name] = GESTURE_TRACK[idx];
  const prevName = idx > 0 ? GESTURE_TRACK[idx - 1][1] : name;
  const blend = Math.min(1, (sec - start) / 0.6);
  return blendPose(POSES[prevName], POSES[name], blend);
};
