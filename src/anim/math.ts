// أدوات رياضية صغيرة للحركة: تسهيلات، عشوائية ثابتة (seeded)، ضجيج، إلخ.

export const clamp = (v: number, min = 0, max = 1): number => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const invLerp = (a: number, b: number, v: number): number => (a === b ? 0 : clamp((v - a) / (b - a)));

export const remap = (v: number, inA: number, inB: number, outA: number, outB: number): number =>
  lerp(outA, outB, invLerp(inA, inB, v));

export const smoothstep = (t: number): number => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

export const smootherstep = (t: number): number => {
  const x = clamp(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - clamp(t), 3);

export const easeInCubic = (t: number): number => Math.pow(clamp(t), 3);

export const easeInOutCubic = (t: number): number => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export const easeOutQuart = (t: number): number => 1 - Math.pow(1 - clamp(t), 4);

export const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const x = clamp(t);
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export const easeOutElastic = (t: number): number => {
  const x = clamp(t);
  if (x === 0 || x === 1) return x;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};

export const easeOutBounce = (t: number): number => {
  let x = clamp(t);
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) {
    x -= 1.5 / d1;
    return n1 * x * x + 0.75;
  }
  if (x < 2.5 / d1) {
    x -= 2.25 / d1;
    return n1 * x * x + 0.9375;
  }
  x -= 2.625 / d1;
  return n1 * x * x + 0.984375;
};

/** نبضة تصعد ثم تهبط: 0 → 1 → 0 */
export const pulse = (t: number, rise = 0.5): number => {
  const x = clamp(t);
  return x < rise ? smoothstep(x / rise) : smoothstep((1 - x) / (1 - rise));
};

/** ظهور ثم اختفاء ضمن نافذة زمنية (كل المدد بالإطارات) */
export const fadeWindow = (frame: number, start: number, end: number, fadeIn: number, fadeOut: number): number => {
  const a = invLerp(start, start + fadeIn, frame);
  const b = invLerp(end - fadeOut, end, frame);
  return clamp(Math.min(a, 1 - b));
};

/** مولد أرقام عشوائية ثابت — نفس البذرة تعطي نفس النتيجة في كل ريندر */
export const mulberry32 = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const hash1 = (n: number): number => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** ضجيج قيمة أحادي البعد، ناعم، يعود بين -1 و 1 */
export const noise1D = (x: number, seed = 0): number => {
  const i = Math.floor(x);
  const f = x - i;
  const a = hash1(i + seed * 17.13);
  const b = hash1(i + 1 + seed * 17.13);
  const u = f * f * (3 - 2 * f);
  return (a + (b - a) * u) * 2 - 1;
};

/** ضجيج متعدد الطبقات (fbm) للحركة العضوية */
export const fbm1D = (x: number, seed = 0, octaves = 3): number => {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += noise1D(x * freq, seed + o * 3.7) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
};

/** يختار عنصراً ثابتاً من مصفوفة حسب البذرة */
export const pick = <T,>(arr: readonly T[], rand: () => number): T => arr[Math.floor(rand() * arr.length) % arr.length];

export const degToRad = (d: number): number => (d * Math.PI) / 180;

export const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [
  cx + Math.cos(degToRad(deg)) * r,
  cy + Math.sin(degToRad(deg)) * r,
];

/** يحوّل مصفوفة نقاط إلى مسار SVG مفتوح أو مغلق */
export const pointsToPath = (pts: ReadonlyArray<readonly [number, number]>, close = false): string => {
  if (pts.length === 0) return '';
  const head = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  const body = pts
    .slice(1)
    .map((p) => `L ${p[0].toFixed(2)} ${p[1].toFixed(2)}`)
    .join(' ');
  return `${head} ${body}${close ? ' Z' : ''}`;
};
