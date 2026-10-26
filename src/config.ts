// المصدر الوحيد لمدة الفيديو والـ FPS والأبعاد — لا تكرر هذه الأرقام في أي ملف آخر.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// المدة الفعلية لملف التعليق الصوتي public/audio/merged.mp3 (قيست بـ ffprobe)
export const NARRATION_SECONDS = 615.628;

// ثواني إضافية بعد آخر كلمة حتى لا تُقطع، وللتلاشي الختامي
export const TAIL_SECONDS = 2.5;

export const TOTAL_FRAMES = Math.ceil((NARRATION_SECONDS + TAIL_SECONDS) * FPS);

// الموسيقى public/audio/music.mp3
export const MUSIC_SECONDS = 176.588;
export const MUSIC_CROSSFADE_SECONDS = 3;

// طريقة ملء الصور (غير الملصقات): 'cover' يملأ الشاشة ويقصّ الأطراف، 'contain' يعرض الصورة كاملة فوق خلفية ضبابية
export const IMAGE_FIT: 'cover' | 'contain' = 'cover';

export const COLORS = {
  charcoal: '#0d0d0f',
  sepia: '#b59a76',
  red: '#a3201f',
  offWhite: '#f1e9da',
};

// وضع الريندر السريع: يُفعَّل بالمتغير REMOTION_FAST=1 (من الـ workflow) ويعطّل التأثيرات الثقيلة فقط
const FAST = process.env.REMOTION_FAST === '1';

// مفاتيح تشغيل/إيقاف الطبقات (مفيدة للمعاينة السريعة في Studio أو لتخفيف زمن الريندر)
export const FEATURES = {
  narrator: true,
  cues: true,
  timeline: true,
  chapterIndicator: true,
  dust: !FAST,
  filmScratches: !FAST,
  projectorFlicker: !FAST,
};