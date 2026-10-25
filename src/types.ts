export type MotionStyle = 'pushIn' | 'pullBack' | 'panLeft' | 'panRight' | 'driftUp' | 'driftDown';
export type VisualType = 'image' | 'poster';
export type Transition =
  | 'dissolve'
  | 'fade'
  | 'dipBlack'
  | 'wipeRight'
  | 'wipeLeft'
  | 'iris'
  | 'blinds'
  | 'slideRed'
  | 'filmBurn'
  | 'inkBlot';

export interface TitleCardDef {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  big?: boolean;
}

export interface SceneDef {
  id: string;
  chapter: number; // 0 = افتتاحية
  narrationSection: string;
  /** زمن بداية المشهد بالثواني داخل ملف merged.mp3 (تقديري — عدّله بعد المعاينة) */
  startSec: number;
  /** مسار الملف داخل مجلد public */
  visualAsset: string;
  visualType: VisualType;
  historicalEvent: string;
  motionStyle: MotionStyle;
  transitionIn: Transition;
  transitionOut: Transition;
  titleCard?: TitleCardDef;
  /** شريط تعريفي (تاريخ/مكان) أسفل الشاشة */
  caption?: string;
  /** نص ختامي منطوق حرفياً في التعليق */
  closingText?: string;
}

export interface ResolvedScene extends SceneDef {
  startFrame: number;
  endFrame: number;
}
