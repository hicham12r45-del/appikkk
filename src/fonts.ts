import {loadFont} from '@remotion/google-fonts/Amiri';

const {fontFamily} = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['arabic', 'latin'],
});

export const ARABIC_FONT = `${fontFamily}, 'Noto Naskh Arabic', serif`;
