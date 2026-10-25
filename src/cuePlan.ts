import type {Cue} from './cues';

/**
 * خطة الرسوم المتحركة: متى يظهر كل رسم فوق الصور. الأزمنة بالثواني داخل التعليق (تقريبية مثل scenePlan).
 * غيّر fromSec / toSec أو احذف إشارة أو أضف جديدة؛ لا حاجة لمس أي كود عرض.
 */
export const CUES: Cue[] = [
  // ——— الفصل الأول ———
  {id: 'factory-workers', type: 'factory', fromSec: 29, toSec: 46},
  {id: 'name-nicholas', type: 'name', fromSec: 49, toSec: 56, name: 'نيقولا الثاني', role: 'القيصر'},
  {id: 'demands-phrase', type: 'phrase', fromSec: 62, toSec: 70, words: ['أجور أفضل', 'وظروف عمل أكثر إنسانية', 'ومشاركة سياسية حقيقية'], position: 'bottom', size: 64, stagger: 52, accentIndex: -1},
  {id: 'stamp-1914', type: 'stamp', fromSec: 77, toSec: 87, text: '١٩١٤', sub: 'الحرب العالمية الأولى'},
  {id: 'leak-war', type: 'leak', fromSec: 76, toSec: 92, hue: 'red', amount: 0.9},

  // ——— الفصل الثاني ———
  {id: 'trench', type: 'trench', fromSec: 95, toSec: 111},
  {id: 'snow-bread', type: 'snow', fromSec: 113, toSec: 158, amount: 0.7},
  {id: 'bread-queue', type: 'queue', fromSec: 129.5, toSec: 144},
  {id: 'crowd-feb', type: 'crowd', fromSec: 171, toSec: 187, banner: 'نقص الخبز'},
  {id: 'stamp-feb', type: 'stamp', fromSec: 170, toSec: 178, text: 'فبراير', sub: '١٩١٧'},

  // ——— الفصل الثالث ———
  {id: 'crown-break', type: 'crown', fromSec: 209, toSec: 224},
  {id: 'stamp-mar', type: 'stamp', fromSec: 207, toSec: 214, text: 'مارس', sub: '١٩١٧'},
  {id: 'decree-reforms', type: 'decree', fromSec: 233, toSec: 248},
  {id: 'paper-reforms', type: 'paper', fromSec: 232, toSec: 252, amount: 0.8},
  {id: 'soviets', type: 'soviet', fromSec: 257.5, toSec: 270},
  {id: 'name-lenin', type: 'name', fromSec: 281, toSec: 288, name: 'فلاديمير إيليتش لينين', role: 'قائد البلاشفة'},

  // ——— الفصل الرابع ———
  {id: 'route-lenin', type: 'route', fromSec: 291, toSec: 305},
  {id: 'slogans', type: 'slogans', fromSec: 306, toSec: 315},
  {id: 'crowd-july', type: 'crowd', fromSec: 335.5, toSec: 349},
  {id: 'name-kornilov', type: 'name', fromSec: 354, toSec: 362, name: 'لافار كورنيلوف', role: 'قائد عسكري'},
  {id: 'march-kornilov', type: 'march', fromSec: 362.5, toSec: 376},
  {id: 'phrase-decisive', type: 'phrase', fromSec: 391, toSec: 398.5, words: ['اللحظة', 'الحاسمة', 'قد اقتربت'], position: 'center', size: 120, stagger: 20, accentIndex: 1},

  // ——— الفصل الخامس ———
  {id: 'seize-bridges', type: 'bridges', fromSec: 436.5, toSec: 454},
  {id: 'stamp-24oct', type: 'stamp', fromSec: 436, toSec: 445, text: '٢٤ أكتوبر', sub: 'التقويم القديم'},
  {id: 'embers-night', type: 'embers', fromSec: 436, toSec: 468, amount: 0.8},
  {id: 'palace-night', type: 'palace', fromSec: 455.5, toSec: 469},
  {id: 'name-kerensky', type: 'name', fromSec: 467, toSec: 473.5, name: 'ألكسندر كيرينسكي', role: 'رئيس الحكومة المؤقتة'},
  {id: 'car-kerensky', type: 'car', fromSec: 467, toSec: 477},
  {id: 'clock-dawn', type: 'clock', fromSec: 477, toSec: 492, fromDay: '٢٥', toDay: '٢٦', month: 'أكتوبر', year: '١٩١٧ · التقويم القديم'},
  {id: 'leak-dawn', type: 'leak', fromSec: 480, toSec: 494, hue: 'warm', amount: 1},

  // ——— الفصل السادس ———
  {id: 'decree-peace-land', type: 'decree', fromSec: 497, toSec: 511},
  {id: 'paper-decrees', type: 'paper', fromSec: 496, toSec: 511, amount: 0.7},
  {id: 'brest-map', type: 'brest', fromSec: 513, toSec: 534},
  {id: 'civil-war-map', type: 'civil', fromSec: 538, toSec: 553.5},
  {id: 'embers-civil', type: 'embers', fromSec: 536, toSec: 554, amount: 0.7},
  {id: 'ussr-emblem', type: 'emblem', fromSec: 557, toSec: 575},
  {id: 'stamp-1922', type: 'stamp', fromSec: 555, toSec: 563, text: 'ديسمبر', sub: '١٩٢٢'},
  {id: 'phrase-power', type: 'phrase', fromSec: 603.5, toSec: 609.5, words: ['لمن', 'تكون', 'السلطة؟'], position: 'bottom', size: 96, stagger: 18, accentIndex: 2},
  {id: 'world-shift', type: 'world', fromSec: 610, toSec: 618},
];
