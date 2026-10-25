// نموذج بيانات "الإشارات" (cues): كل إشارة رسم متحرك أو عنصر بصري يظهر في نافذة زمنية فوق المشاهد.

export interface CueBase {
  id: string;
  fromSec: number;
  toSec: number;
}

export type CueVariant =
  // رسوم متحركة كبيرة (لوحات أو ملء الشاشة)
  | {type: 'factory'}
  | {type: 'trench'}
  | {type: 'queue'}
  | {type: 'crowd'; banner?: string}
  | {type: 'crown'}
  | {type: 'decree'}
  | {type: 'soviet'}
  | {type: 'route'}
  | {type: 'slogans'}
  | {type: 'march'}
  | {type: 'bridges'}
  | {type: 'palace'}
  | {type: 'clock'; fromDay: string; toDay: string; month: string; year: string}
  | {type: 'car'}
  | {type: 'brest'}
  | {type: 'civil'}
  | {type: 'emblem'}
  | {type: 'world'}
  | {type: 'station'}
  // عناصر نصية
  | {type: 'name'; name: string; role: string}
  | {type: 'phrase'; words: string[]; position?: 'center' | 'top' | 'bottom'; size?: number; stagger?: number; accentIndex?: number}
  | {type: 'counter'; to: number; label: string; suffix?: string}
  | {type: 'stamp'; text: string; sub?: string}
  // أجواء
  | {type: 'snow'; amount?: number}
  | {type: 'embers'; amount?: number}
  | {type: 'paper'; amount?: number}
  | {type: 'leak'; hue?: 'warm' | 'red'; amount?: number};

export type Cue = CueBase & CueVariant;
