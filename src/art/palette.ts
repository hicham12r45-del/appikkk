// لوحة ألوان موحّدة للرسوم المتحركة: فحم، سيبيا، أحمر ثوري، أبيض دافئ.

export const PAL = {
  ink: '#0b0b0d',
  charcoal: '#16161a',
  coal: '#23232a',
  smoke: '#3a3a43',
  ash: '#6d6a68',
  sepia: '#b59a76',
  sepiaDark: '#7d6548',
  parchment: '#e9dcc0',
  offWhite: '#f1e9da',
  red: '#a3201f',
  redBright: '#d12e2b',
  redDeep: '#5e1212',
  gold: '#c9a24a',
  goldDeep: '#8a6a22',
  snow: '#e9eef2',
  steel: '#5b6770',
  skin: '#d9b99b',
  skinShade: '#b8906f',
  skinDark: '#8c6a4c',
  hair: '#2a2420',
  hairGrey: '#8e8a86',
  coat: '#3b3a36',
  coatDark: '#26251f',
  khaki: '#6b6a4a',
  khakiDark: '#4a4932',
  white: '#ffffff',
} as const;

export type PalKey = keyof typeof PAL;
