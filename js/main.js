// 启动、标题画面与整局进出。规则在 rules/，剧情在 game/story.js。

import { h, pace } from './core/dom.js';
import { images } from './core/assets.js';
import { audio } from './core/audio.js';
import { settings, saveSettings, loadGame, saveGame, clearGame } from './core/store.js';
import { newCampaign } from './rules/campaign.js';
import { bgArt, uiArt, unitArt } from './data/art.js';
import { createFx } from './battle/fx.js';
import { createHub } from './game/hub.js';
import { createStory } from './game/story.js';
import { runEnding } from './game/ending.js';
import { confirmBox, wipe, toast } from './ui/dialogue.js';
import { openHelp, openSettings } from './ui/panels.js';

const params = new URLSearchParams(location.search);
const FAST = params.get('fast') === '1';
const SEED = params.has('seed') ? Number(params.get('seed')) >>> 0 : null;
const stage = document.getElementById('stage');

const game = {
  c: null, stage, hub: null, story: null, battle: null, screen: 'boot',
  save() { if (game.c) saveGame(game.c); },
  log(text, sys = false) { game.hub?.log(text, sys); },
  applySettings() { pace.base = FAST ? 0.12 : 1; pace.speed = settings.speed === 2 ? 2 : 1; audio.refresh(); },
  async toTitle() { await wipe('close'); teardown(); showTitle(); await wipe('open'); },
  async ending() {
    game.screen = 'ending';
    game.hub?.leave();
    const next = await runEnding(stage, game.c);
    if (next === 'restart') { clearGame(); await startNew(); }
    else { teardown(); showTitle(); }
  },
};
game.applySettings();

function teardown() {
  game.hub?.destroy();
  game.hub = null;
  game.story = null;
  game.battle = null;
  stage.replaceChildren();
}

function setup(campaign) {
  teardown();
  game.c = campaign;
  game.hub = createHub(game);
  game.story = createStory(game);
}

async function startNew() {
  await wipe('close');
  settings.seen = {};
  saveSettings();
  setup(newCampaign(SEED ?? ((Date.now() ^ (Math.random() * 1e9)) >>> 0)));
  game.screen = 'world';
  await game.hub.enter('sanjiangkou', { fade: true });
  game.log('三江口，东吴水寨。曹军大军压境。');
  game.save();
  await game.hub.run(() => game.story.opening());
}

async function resume(saved) {
  await wipe('close');
  setup(saved);
  if (saved.stage === 'done') { await game.ending(); return; }
  game.screen = 'world';
  await game.hub.enter(saved.world?.scene ?? 'sanjiangkou', { fade: true });
  game.log('接着上回的江面往下走。');
}

function showTitle() {
  game.screen = 'title';
  game.c = null;
  audio.music('title');
  const saved = loadGame();
  const canvas = h('canvas.title-fx');
  const menu = h('div.title-menu');
  const titleArt = h('div.title-art', { style: { backgroundImage: 'url(assets/bg/title-keyart.jpg)' } });
  const figure = h('div.title-figure', { 'aria-hidden': 'true' },
    h('div.figure-aura'),
    h('img.figure-side.left', { src: unitArt('huanggai'), alt: '' }),
    h('img.figure-side.right', { src: unitArt('zhuge'), alt: '' }),
    h('img.figure-lead', { src: unitArt('zhouyu'), alt: '周瑜立于赤壁江崖' }));
  const root = h('div.screen.title', { data: { ui: 'title' } },
    titleArt,
    h('div.title-veil'),
    canvas,
    figure,
    h('div.title-main', {},
      h('div.from', {}, '三国演义 · 第四十三至五十回'),
      h('h1', {}, '赤壁', h('br'), h('em', {}, '东风')),
      h('div.title-sub', {}, '探索 · 回合制 · 五行相克 · 火攻'),
      menu,
      h('div.title-features', {}, h('span', {}, '三江口'), h('span', {}, '七星坛'), h('span', {}, '乌林火海'))),
    h('div.title-seal', {}, '赤'),
    h('div.title-foot', {}, '周公瑾点兵三江口，孔明借风，黄盖纵火 · 约四十五分钟 · 进度存在本机浏览器'));
  const fx = createFx(canvas);
  fx.ambient('ember');
  const go = async (fn) => {
    menu.querySelectorAll('button').forEach((b) => { b.disabled = true; });
    audio.sfx('quest');
    await fn();
    fx.destroy();
  };
  const add = (label, cls, act, fn) => menu.append(h(`button.btn${cls}`, { type: 'button', data: { act }, onclick: fn }, label));
  if (saved) add(saved.stage === 'done' ? '重温赤壁' : '接着渡江', '.primary', 'continue', () => go(() => resume(saved)));
  add('挥师入阵', saved ? '' : '.primary', 'new', async () => {
    if (saved && !(await confirmBox({ title: '从头再打这一仗？', text: '会盖掉现在这份存档。', yes: '重新开始', no: '再想想', danger: true }))) return;
    clearGame();
    go(startNew);
  });
  add('行前须知', '.ghost', 'help', () => openHelp());
  add('设置', '.ghost', 'settings', () => openSettings({ inGame: false, onApply: () => game.applySettings() }));
  stage.append(root);
}

async function boot() {
  const bar = h('i.fill', { style: { width: '4%' } });
  const loading = h('div.loading', {}, '东风起处', h('div.bar', {}, bar));
  document.getElementById('app').append(loading);
  const list = [
    'assets/bg/title-keyart.jpg',
    ...['sanjiangkou', 'qixingtan', 'wulin', 'huarong'].map(bgArt),
    ...['attack', 'spell', 'defend', 'bag', 'special', 'hero', 'pet', 'quest', 'formation', 'settings', 'coin', 'armor', 'vitality', 'speed', 'water', 'fire', 'wind', 'metal', 'wood', 'earth'].map(uiArt),
    ...['jinchuang', 'dahuandan', 'falidan', 'wubaodan', 'xingshi', 'jiuhui', 'huoyou', 'caolian', 'dongfengfu', 'gudingdao', 'tiejia'].map((key) => `assets/items/${key}.svg`),
    ...['zhouyu', 'huanggai', 'ganning', 'zhuge', 'lusu', 'caocao', 'guanyu', 'caimao', 'zhangyun', 'caoxun', 'xuchu', 'guojia'].map(unitArt),
  ];
  let n = 0;
  try {
    await Promise.all(list.map((src) => images([src]).then(() => {
      n += 1;
      bar.style.width = `${(n / list.length) * 100}%`;
    })));
  } catch (err) {
    loading.replaceChildren('有美术资源未读取，请刷新重试', h('div', { style: { fontSize: '14px', letterSpacing: 0, fontFamily: 'var(--serif)' } }, String(err.message ?? err)));
    throw err;
  }
  loading.remove();
  showTitle();
}

window.addEventListener('pagehide', () => {
  if (game.screen === 'world' && !game.battle && game.hub && !game.hub.busy) {
    game.hub.remember();
    game.save();
  }
});
window.addEventListener('error', (e) => {
  if (game.screen !== 'boot') toast(`出了点岔子：${e.message}`);
});

window.chibi = {
  snapshot() {
    const c = game.c;
    const b = game.battle?.state;
    return JSON.parse(JSON.stringify({
      screen: game.battle ? 'battle' : game.screen,
      world: game.hub?.probe() ?? null,
      campaign: c ? {
        stage: c.stage, levels: c.levels, storyLevel: c.storyLevel, money: c.money, exp: c.exp,
        items: c.items, pets: c.pets, formation: c.formation, flags: c.flags, bounty: c.bounty,
        explored: c.explored, wins: c.wins, points: c.points, skillPoints: c.skillPoints, gear: c.gear,
      } : null,
      battle: b ? {
        id: b.battleId, round: b.round, over: b.over, winner: b.winner, formation: b.formation, items: b.items,
        units: b.units.map((u) => ({
          id: u.id, key: u.key, side: u.side, name: u.name, hp: u.hp, maxHp: u.maxHp,
          mp: u.mp, sp: u.sp, alive: u.alive, element: u.element, charging: u.charging,
          chargeTarget: u.chargeTarget ?? null, skills: u.skills,
        })),
      } : null,
    }));
  },
};

boot();
