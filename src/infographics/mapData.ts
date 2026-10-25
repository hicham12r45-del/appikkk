// خريطة تخطيطية مبسطة (ليست دقيقة جغرافياً): إحداثيات خط الطول/العرض تقريبية لأغراض الرسم فقط.

export type LonLat = readonly [number, number];

export const MAP_VIEW = {
  lonMin: 2,
  lonMax: 62,
  latMin: 40,
  latMax: 71,
  width: 1280,
  height: 720,
  padX: 70,
  padY: 40,
};

export const project = (lon: number, lat: number): [number, number] => {
  const {lonMin, lonMax, latMin, latMax, width, height, padX, padY} = MAP_VIEW;
  const x = padX + ((lon - lonMin) / (lonMax - lonMin)) * (width - padX * 2);
  const y = padY + (1 - (lat - latMin) / (latMax - latMin)) * (height - padY * 2);
  return [x, y];
};

export const projectAll = (pts: ReadonlyArray<LonLat>): Array<[number, number]> => pts.map((p) => project(p[0], p[1]));

/** حدود الإمبراطورية الروسية الأوروبية بصورة تقريبية جداً (للتمثيل فقط) */
export const RUSSIAN_EMPIRE: ReadonlyArray<LonLat> = [
  [22.8, 70],
  [30, 70],
  [41, 67.4],
  [44, 66],
  [60, 68],
  [62, 60],
  [62, 50],
  [55, 47],
  [50, 46],
  [47.5, 45.2],
  [45, 42.3],
  [40, 43.6],
  [38, 46.8],
  [35.5, 45.2],
  [33.5, 46],
  [30.7, 46.4],
  [29.6, 45.3],
  [26.6, 48.2],
  [24.1, 50.4],
  [23.5, 51.6],
  [22.7, 53.1],
  [22.8, 54.4],
  [21, 56.2],
  [21.4, 57.6],
  [23.6, 58.2],
  [23.5, 59.2],
  [28, 59.6],
  [23.2, 60.2],
  [21.4, 61.6],
  [21.6, 63.6],
  [24.8, 65.2],
  [24.2, 66.6],
  [23.8, 68.4],
];

/** خطوط ساحل الأراضي الأوروبية المجاورة (كتلة واحدة مبسطة) */
export const WESTERN_EUROPE: ReadonlyArray<LonLat> = [
  [2, 42],
  [2, 54],
  [8.5, 55],
  [10.4, 57.6],
  [12.6, 56],
  [14.3, 55.5],
  [18.8, 54.4],
  [22.8, 54.4],
  [22.7, 53.1],
  [23.5, 51.6],
  [24.1, 50.4],
  [26.6, 48.2],
  [29.6, 45.3],
  [28.5, 43.7],
  [26, 41.5],
  [20.5, 40.5],
  [18.5, 42.4],
  [13.7, 45.6],
  [12.3, 44.2],
  [8.7, 44.3],
  [3, 43.2],
];

export const SCANDINAVIA: ReadonlyArray<LonLat> = [
  [5.2, 59.5],
  [5, 62.5],
  [10, 64.6],
  [14, 67.6],
  [18.5, 70],
  [22.8, 70],
  [23.8, 68.4],
  [24.2, 66.6],
  [24.8, 65.2],
  [21.6, 63.6],
  [17.4, 62],
  [18.8, 60],
  [16.8, 57.4],
  [13, 55.6],
  [11.2, 58.8],
  [8, 58.2],
];

export const BLACK_SEA: ReadonlyArray<LonLat> = [
  [28.2, 43.4],
  [29.7, 45.3],
  [30.7, 46.4],
  [33.5, 46],
  [35.5, 45.2],
  [38, 46.8],
  [40, 43.6],
  [41.6, 41.6],
  [36, 41.3],
  [31, 41.2],
];

export const BALTIC: ReadonlyArray<LonLat> = [
  [12.6, 56],
  [14.3, 55.5],
  [18.8, 54.4],
  [22.8, 54.4],
  [21, 56.2],
  [21.4, 57.6],
  [23.6, 58.2],
  [23.5, 59.2],
  [28, 59.6],
  [23.2, 60.2],
  [21.4, 61.6],
  [21.6, 63.6],
  [24.8, 65.2],
  [22, 65.4],
  [17.4, 62],
  [18.8, 60],
  [16.8, 57.4],
  [13, 55.6],
];

export interface City {
  id: string;
  name: string; // بالعربية
  lonLat: LonLat;
  labelDx?: number;
  labelDy?: number;
}

export const CITIES: Record<string, City> = {
  petrograd: {id: 'petrograd', name: 'بتروغراد', lonLat: [30.3, 59.9], labelDx: 14, labelDy: -14},
  moscow: {id: 'moscow', name: 'موسكو', lonLat: [37.6, 55.8], labelDx: 14, labelDy: 6},
  kiev: {id: 'kiev', name: 'كييف', lonLat: [30.5, 50.4], labelDx: 14, labelDy: 6},
  warsaw: {id: 'warsaw', name: 'وارسو', lonLat: [21, 52.2], labelDx: -86, labelDy: 20},
  brest: {id: 'brest', name: 'بريست ليتوفسك', lonLat: [23.7, 52.1], labelDx: -176, labelDy: -4},
  berlin: {id: 'berlin', name: 'برلين', lonLat: [13.4, 52.5], labelDx: -70, labelDy: -12},
  zurich: {id: 'zurich', name: 'زيوريخ', lonLat: [8.5, 47.4], labelDx: -70, labelDy: 22},
  stockholm: {id: 'stockholm', name: 'ستوكهولم', lonLat: [18.1, 59.3], labelDx: -116, labelDy: -10},
  haparanda: {id: 'haparanda', name: 'هاباراندا', lonLat: [24.1, 65.8], labelDx: -118, labelDy: 6},
  omsk: {id: 'omsk', name: 'الشرق', lonLat: [57, 56], labelDx: -40, labelDy: 28},
  crimea: {id: 'crimea', name: 'القرم', lonLat: [34.2, 45.2], labelDx: 14, labelDy: 30},
  archangel: {id: 'archangel', name: 'الشمال', lonLat: [40.5, 64.5], labelDx: 12, labelDy: -10},
};

/** طريق عودة لينين التقريبي في أبريل ١٩١٧ (زيوريخ → برلين → ستوكهولم → هاباراندا → بتروغراد) */
export const LENIN_ROUTE: ReadonlyArray<string> = ['zurich', 'berlin', 'stockholm', 'haparanda', 'petrograd'];

export const lonLatOf = (id: string): [number, number] => {
  const c = CITIES[id];
  return project(c.lonLat[0], c.lonLat[1]);
};
