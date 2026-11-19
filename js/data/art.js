// 原创赤壁美术资产路径与头像裁切参数。角色优先使用绘景立绘，SVG 仅作兜底。

export const FACES = {
  zhouyu: [0.5, 0.14, 0.25], huanggai: [0.5, 0.15, 0.25], ganning: [0.5, 0.14, 0.25],
  zhuge: [0.5, 0.12, 0.25], lusu: [0.5, 0.15, 0.25], caocao: [0.5, 0.15, 0.25],
  guanyu: [0.5, 0.16, 0.26], caimao: [0.5, 0.15, 0.25], zhangyun: [0.5, 0.15, 0.25],
  caoxun: [0.5, 0.15, 0.25], xuchu: [0.5, 0.16, 0.27], guojia: [0.5, 0.15, 0.25],
};

const PAINTED_UNITS = new Set([
  'zhouyu', 'huanggai', 'ganning', 'zhuge', 'lusu', 'caocao',
  'guanyu', 'caimao', 'zhangyun', 'caoxun', 'xuchu', 'guojia',
]);
export const unitArt = (key) => (PAINTED_UNITS.has(key) ? `assets/units/${key}-paint.webp` : `assets/units/${key}.svg`);
export const walkArt = (key) => (PAINTED_UNITS.has(key) ? `assets/units/${key}-paint.webp` : `assets/units/${key}.svg`);
export const walkSheet = () => '';
export const itemArt = (key) => `assets/items/${key}.svg`;
export const uiArt = (key) => `assets/ui/${key}.svg`;
const PAINTED_BG = new Set(['sanjiangkou', 'qixingtan', 'wulin', 'huarong']);
export const bgArt = (key) => (PAINTED_BG.has(key) ? `assets/bg/${key}-paint.jpg` : `assets/bg/${key}.svg`);
export const mapArt = (scene) => (PAINTED_BG.has(scene) ? `assets/terrain/${scene}-paint.webp` : `assets/terrain/${scene}.svg`);
export const ELEMENT_ICON = { 金: 'metal', 木: 'wood', 水: 'water', 火: 'fire', 土: 'earth' };
export const ELEMENT_COLOR = { 金: '#c9a03a', 木: '#4c9a48', 水: '#3a8fc0', 火: '#d2492c', 土: '#9a7446' };

export function faceStyle(key) {
  const [cx, cy, s] = FACES[key] ?? [0.5, 0.15, 0.25];
  const ratio = 600 / 900;
  const sizeX = 100 / (s / ratio);
  const posX = ((cx - s / ratio / 2) / (1 - s / ratio)) * 100;
  const posY = ((cy - s / 2) / (1 - s)) * 100;
  return {
    backgroundImage: `url(${unitArt(key)})`,
    backgroundSize: `${sizeX.toFixed(1)}% auto`,
    backgroundPosition: `${Math.max(0, Math.min(100, posX)).toFixed(1)}% ${Math.max(0, Math.min(100, posY)).toFixed(1)}%`,
    backgroundRepeat: 'no-repeat',
  };
}

const cache = new Map();
export function image(src) {
  if (!cache.has(src)) {
    cache.set(src, new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`图片读取失败：${src}`));
      img.src = src;
    }));
  }
  return cache.get(src);
}
export const images = (list) => Promise.all(list.map(image));
