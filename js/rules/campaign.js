// 赤壁战役状态、成长、巡练与剧情落账。纯逻辑，可单独测试。

import { PARTY, GROWTH, POINT_GAINS, SKILLS, EQUIPS, ITEMS, ECONOMY, BATTLES } from '../data/combat.js';
import { SCENES, LANDMARKS } from '../data/maps.js';
import { learnedSkills } from './battle.js';
import { createRNG, chance } from '../core/rng.js';

export const SAVE_VERSION = 3;
export const STAGES = ['meet', 'scout', 'plan', 'qixing', 'fireFleet', 'fireBoss', 'huarong', 'done'];
export const TEAM = ['zhouyu', 'huanggai', 'ganning'];
const stageIndex = (c) => STAGES.indexOf(c.stage);
export const reached = (c, stage) => stageIndex(c) >= STAGES.indexOf(stage);

export function newCampaign(seed) {
  return {
    version: SAVE_VERSION, seed: seed >>> 0, stage: 'meet', flags: {},
    levels: { zhouyu: 1, huanggai: 1, ganning: 1 }, storyLevel: 1, exp: 0, money: 180,
    alloc: {}, skillLevels: {}, points: {}, skillPoints: {},
    gear: {}, equipBag: {}, treasure: null, pets: [], formation: 'tiangang',
    items: { jinchuang: 3, falidan: 2, huoyou: 1 },
    bounty: { round: 1, ring: 0, state: 'idle', demon: null, total: 0 },
    explored: {}, wins: 0, attempts: {},
    world: { scene: 'sanjiangkou', x: null, y: null },
  };
}

const QUESTS = {
  meet: { title: '三江口军议', text: '周瑜刚回水寨。鲁肃与诸葛亮在临江亭候着，先去听这一仗怎么打。', scene: 'sanjiangkou', npc: 'lusu' },
  scout: { title: '巡江前哨', text: '曹军巡船就在水寨下游窥探。点江边的巡江都尉，先赢下第一阵。', here: '曹军巡船就在水寨外的明处。', scene: 'sanjiangkou', npc: 'caoxun' },
  plan: { title: '苦肉诈降', text: '黄盖已请命。回水寨同他商定，如何把火船送进乌林。', here: '黄盖在水寨校场等你。', scene: 'sanjiangkou', npc: 'huanggai' },
  qixing: { title: '七星借风', text: '从水寨东北上七星坛，请诸葛亮借三日东南风。', here: '孔明已在七星坛上候风。', scene: 'qixingtan', npc: 'zhuge' },
  fireFleet: { title: '乌林连舟', text: '东南风起。从水寨东南下乌林，先击破蔡瑁的铁索连舟。', here: '蔡瑁的连舟就在乌林水寨。', scene: 'wulin', npc: 'caimao' },
  fireBoss: { title: '火烧帅船', text: '连舟已破。曹操的楼船就在火头前，击破帅船，赤壁便定。', here: '曹操的帅船就在乌林深处。', scene: 'wulin', npc: 'caocao' },
  huarong: { title: '华容道', text: '曹操败走华容。去泥道尽头见关羽，这一刀由他决定。', here: '关羽横刀候在泥道中。', scene: 'huarong', npc: 'guanyu' },
  done: { title: '赤壁火息', text: '东风已歇，江上余火渐灭。这一仗写进了史书。', scene: 'sanjiangkou', npc: null },
};

export function mainQuest(c, hereScene = null) {
  const q = QUESTS[c.stage];
  return { ...q, text: hereScene === q.scene && q.here ? q.here : q.text };
}

export function portalLocked(c, to) {
  if (to === 'qixingtan' && !reached(c, 'plan')) return '七星坛还去不得，先同黄盖定下火船之计。';
  if (to === 'wulin' && !reached(c, 'qixing')) return '乌林水寨未到决战之时，先去七星坛借风。';
  if (to === 'huarong' && !reached(c, 'huarong')) return '华容道在乌林之后。先击破曹操帅船。';
  return null;
}

export function npcPresent(c, sceneId, id) {
  if (sceneId === 'sanjiangkou' && id === 'caoxun') return c.stage === 'scout';
  if (sceneId === 'qixingtan' && id === 'zhuge') return c.stage === 'qixing';
  if (sceneId === 'qixingtan' && id === 'lusu') return c.stage === 'qixing';
  if (sceneId === 'wulin' && id === 'caimao') return c.stage === 'fireFleet';
  if (sceneId === 'wulin' && (id === 'caocao' || id === 'xuchu')) return c.stage === 'fireBoss';
  if (sceneId === 'huarong') return c.stage === 'huarong';
  return true;
}

export const followers = (c) => {
  const list = ['huanggai', 'ganning'];
  if (c.pets.some((p) => p.key === 'zhuge')) list.push('zhuge');
  return list;
};

export function portalToward(from, to) {
  if (from === to) return null;
  const portals = SCENES[from].portals;
  return portals[to] ? to : 'sanjiangkou';
}

export const expToNext = (level) => ECONOMY.expBase * level;
export const levelCap = (c) => c.storyLevel + 1;
const members = (c) => [...TEAM, ...c.pets.map((p) => p.key)];

function levelUp(c, keys) {
  const ups = {};
  for (const key of keys) {
    const def = PARTY[key];
    if (!def) continue;
    const before = c.levels[key] ?? 1;
    c.levels[key] = before + 1;
    c.points[key] = (c.points[key] ?? 0) + GROWTH.pointsPerLevel;
    c.skillPoints[key] = (c.skillPoints[key] ?? 0) + GROWTH.skillPointsPerLevel;
    const had = learnedSkills(def, before);
    ups[key] = { level: before + 1, newSkills: learnedSkills(def, before + 1).filter((s) => !had.includes(s)) };
  }
  return ups;
}

export function storyLevelUp(c) {
  c.storyLevel += 1;
  c.money += ECONOMY.storyMoney;
  return levelUp(c, members(c));
}

export function grantExp(c, amount) {
  const ups = {};
  c.exp += Math.max(0, Math.round(amount));
  for (;;) {
    const lv = c.levels.zhouyu;
    const need = expToNext(lv);
    if (lv >= levelCap(c)) { c.exp = Math.min(c.exp, need); return { ups, capped: true }; }
    if (c.exp < need) return { ups, capped: false };
    c.exp -= need;
    Object.assign(ups, levelUp(c, members(c).filter((k) => (c.levels[k] ?? 1) < levelCap(c))));
  }
}

export const pendingGrowth = (c, key) => (c.points[key] ?? 0) + (c.skillPoints[key] ?? 0);
export const pendingTeam = (c) => TEAM.reduce((n, k) => n + pendingGrowth(c, k), 0);
export const pendingPets = (c) => c.pets.reduce((n, p) => n + pendingGrowth(c, p.key), 0);

export function addPoint(c, key, stat, delta = 1) {
  const cur = c.alloc[key]?.[stat] ?? 0;
  if (!POINT_GAINS[stat]) return false;
  if (delta > 0 && ((c.points[key] ?? 0) <= 0 || cur >= GROWTH.statCap)) return false;
  if (delta < 0 && cur <= 0) return false;
  c.alloc[key] = { ...c.alloc[key], [stat]: cur + delta };
  c.points[key] = (c.points[key] ?? 0) - delta;
  return true;
}

export function recommendPoints(c, key) {
  const weights = Object.entries(PARTY[key].recommend ?? { 攻: 1 }).sort((a, b) => b[1] - a[1]);
  const total = weights.reduce((n, [, w]) => n + w, 0);
  let used = 0;
  for (let guard = 0; (c.points[key] ?? 0) > 0 && guard < 200; guard += 1) {
    const spent = weights.reduce((n, [s]) => n + (c.alloc[key]?.[s] ?? 0), 0) + 1;
    const [stat] = weights.reduce((best, w) => {
      const gap = (w[1] / total) * spent - (c.alloc[key]?.[w[0]] ?? 0);
      return gap > best[2] ? [w[0], w[1], gap] : best;
    }, [weights[0][0], weights[0][1], -Infinity]);
    if (!addPoint(c, key, stat)) break;
    used += 1;
  }
  return used;
}

export const skillRank = (c, key, skillId) => c.skillLevels[key]?.[skillId] ?? 1;

function raiseSkill(c, key, skillId) {
  if (!learnedSkills(PARTY[key], c.levels[key] ?? 1).includes(skillId)) return false;
  const cur = skillRank(c, key, skillId);
  if (cur >= GROWTH.skillRankCap) return false;
  c.skillLevels[key] = { ...c.skillLevels[key], [skillId]: cur + 1 };
  return true;
}

export function trainSkill(c, key, skillId) {
  if ((c.skillPoints[key] ?? 0) <= 0 || !raiseSkill(c, key, skillId)) return false;
  c.skillPoints[key] -= 1;
  return true;
}

export const studyCost = (rank) => ECONOMY.studyCost[rank + 1] ?? null;
export function studySkill(c, key, skillId) {
  const cost = studyCost(skillRank(c, key, skillId));
  if (cost == null || c.money < cost || !raiseSkill(c, key, skillId)) return false;
  c.money -= cost;
  return true;
}

export function recommendSkills(c, key) {
  const def = PARTY[key];
  const prefer = (def.recommend?.灵 ?? 0) > (def.recommend?.攻 ?? 0) ? 'mag' : 'phy';
  const score = (id) => (SKILLS[id].kind === prefer ? 1000 : 0) + (SKILLS[id].mul ?? 0) * 100 + (SKILLS[id].heal ?? 0) * 50;
  let used = 0;
  while ((c.skillPoints[key] ?? 0) > 0) {
    const pool = learnedSkills(def, c.levels[key] ?? 1)
      .filter((id) => skillRank(c, key, id) < GROWTH.skillRankCap)
      .sort((a, b) => score(b) - score(a) || (a < b ? -1 : 1));
    if (!pool.length || !trainSkill(c, key, pool[0])) break;
    used += 1;
  }
  return used;
}

export function addLoot(c, { money = 0, items = {}, equips = [] } = {}) {
  c.money += money;
  for (const [k, n] of Object.entries(items)) c.items[k] = (c.items[k] ?? 0) + n;
  for (const k of equips) c.equipBag[k] = (c.equipBag[k] ?? 0) + 1;
}

export function buy(c, good) {
  if (c.money < good.price) return false;
  c.money -= good.price;
  addLoot(c, good.item ? { items: { [good.item]: 1 } } : { equips: [good.equip] });
  return true;
}

export const gearOf = (c, key) => [c.gear[key]?.weapon, c.gear[key]?.armor].filter(Boolean);

export function equip(c, key, equipKey) {
  const eq = EQUIPS[equipKey];
  if (!eq || !(c.equipBag[equipKey] > 0) || (eq.only && eq.only !== key)) return false;
  const old = c.gear[key]?.[eq.slot];
  c.equipBag[equipKey] -= 1;
  if (old) c.equipBag[old] = (c.equipBag[old] ?? 0) + 1;
  c.gear[key] = { ...c.gear[key], [eq.slot]: equipKey };
  return true;
}

export function unequip(c, key, slot) {
  const old = c.gear[key]?.[slot];
  if (!old) return false;
  c.equipBag[old] = (c.equipBag[old] ?? 0) + 1;
  c.gear[key] = { ...c.gear[key], [slot]: null };
  return true;
}

export function itemLabel(c, key) {
  const item = ITEMS[key];
  return { name: item?.name ?? key, desc: item?.desc ?? '' };
}

export const activePet = (c) => c.pets.find((p) => p.active) ?? null;

export function addPet(c, key, { activate = false } = {}) {
  if (c.pets.some((p) => p.key === key)) return false;
  c.levels[key] = Math.max(1, c.levels.zhouyu - 1);
  c.pets.push({ key, active: false });
  if (activate || c.pets.length === 1) setActivePet(c, key);
  return true;
}

export function setActivePet(c, key) {
  for (const p of c.pets) p.active = p.key === key;
}

export function releasePet(c, key) {
  const i = c.pets.findIndex((p) => p.key === key);
  if (i < 0) return false;
  const wasActive = c.pets[i].active;
  c.pets.splice(i, 1);
  if (wasActive && c.pets[0]) c.pets[0].active = true;
  return true;
}

export function battleParty(c) {
  const keys = [...TEAM];
  const pet = activePet(c);
  if (pet) keys.push(pet.key);
  return keys.map((key) => ({ key, level: c.levels[key] ?? 1, alloc: c.alloc[key], equip: gearOf(c, key), skillLevels: c.skillLevels[key] }));
}

export const battleItems = (c) => ({ ...c.items });

export function battleSeed(c, battleId, salt = 0) {
  const n = c.attempts[battleId] ?? 0;
  let h = c.seed ^ (salt * 2654435761);
  for (const ch of battleId) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h + n * 7919) >>> 0;
}

export function settleBattle(c, state) {
  c.attempts[state.battleId] = (c.attempts[state.battleId] ?? 0) + 1;
  if (state.winner === 'enemy') return [];
  for (const [k, n] of Object.entries(state.items)) c.items[k] = n;
  c.formation = state.formation;
  return [];
}

export const bountyOpen = (c) => reached(c, 'scout') && c.stage !== 'done' && c.stage !== 'huarong';

export function acceptBounty(c) {
  const b = c.bounty;
  if (!bountyOpen(c) || b.state !== 'idle') return null;
  const rng = createRNG((c.seed + 7000 + b.round * 97 + b.ring * 13 + b.total * 31) >>> 0);
  const spots = SCENES.sanjiangkou.demonSpawns;
  const [x, y] = spots[Math.floor(rng() * spots.length)];
  const strong = b.ring % 2 === 1;
  b.demon = {
    id: `drill-${b.total}`, scene: 'sanjiangkou', x, y, strong,
    battle: strong ? 'drill_b' : 'drill', art: strong ? 'zhangyun' : 'caoxun',
    name: strong ? '曹军铁索小队' : '曹军斥候船', seed: Math.floor(rng() * 1e9),
  };
  b.state = 'hunt';
  return b.demon;
}

export function bountyReward(c) {
  const b = c.bounty;
  const rng = createRNG(b.demon.seed);
  const ring = b.ring + 1;
  const reward = {
    exp: Math.round(expToNext(c.levels.zhouyu) * ECONOMY.bountyExpPct),
    money: ECONOMY.bountyMoney[0] + ECONOMY.bountyMoney[1] * ring,
    items: {}, equips: [],
  };
  for (const drop of ECONOMY.bountyDrops) {
    if (!chance(rng, drop.p)) continue;
    if (drop.item) reward.items[drop.item] = (reward.items[drop.item] ?? 0) + 1;
    else reward.equips.push(drop.equip);
  }
  return reward;
}

export function winBounty(c) {
  const b = c.bounty;
  if (b.state !== 'hunt') return null;
  const reward = bountyReward(c);
  const { ups, capped } = grantExp(c, reward.exp);
  addLoot(c, reward);
  b.ring += 1;
  b.total += 1;
  b.demon = null;
  b.state = 'idle';
  const roundDone = b.ring >= ECONOMY.bountyRing;
  if (roundDone) { b.ring = 0; b.round += 1; }
  return { reward, ups, capped, roundDone };
}

export function reportBounty(c) {
  if (c.bounty.state !== 'report') return false;
  c.bounty.state = 'idle';
  return true;
}

export function bountyQuest(c) {
  if (!bountyOpen(c)) return null;
  const b = c.bounty;
  if (b.state === 'hunt') return { title: '江防巡练', text: '水寨外的曹军斥候船已标出，点它开战。', scene: 'sanjiangkou', npc: b.demon?.id };
  return { title: '江防巡练（可选）', text: '与甘宁说话可领巡练：击退曹军斥候，得历练、银两与军需。', scene: 'sanjiangkou', npc: 'ganning' };
}

export function explore(c, sceneId, id, choiceKey) {
  const def = LANDMARKS[id];
  if (!def || def.scene !== sceneId || c.explored[id]) return null;
  const choice = def.options.find((o) => o.key === choiceKey);
  if (!choice) return null;
  c.explored[id] = choiceKey;
  addLoot(c, choice.reward);
  return choice;
}

export const story = {
  metAdvisors(c) {
    if (c.stage !== 'meet') return;
    addLoot(c, { items: { jinchuang: 2, falidan: 1, caolian: 1 } });
    c.stage = 'scout';
  },
  patrolWon(c) {
    if (c.stage !== 'scout') return {};
    c.wins += 1;
    c.stage = 'plan';
    return storyLevelUp(c);
  },
  setStrategy(c, key) {
    c.flags.route = key;
    if (c.stage === 'plan') c.stage = 'qixing';
  },
  gotZhuge(c, key) {
    c.flags.wind = key;
    addPet(c, 'zhuge', { activate: true });
    c.levels.zhuge = Math.max(c.levels.zhuge ?? 1, c.levels.zhouyu);
    addLoot(c, { items: { falidan: 1, huoyou: 1 } });
    const ups = storyLevelUp(c);
    c.stage = 'fireFleet';
    return ups;
  },
  fleetWon(c) {
    if (c.stage !== 'fireFleet') return {};
    c.wins += 1;
    c.stage = 'fireBoss';
    return storyLevelUp(c);
  },
  bossWon(c) {
    if (c.stage !== 'fireBoss') return {};
    c.wins += 1;
    c.stage = 'huarong';
    return storyLevelUp(c);
  },
  huarongChoice(c, key) {
    c.flags.huarong = key;
    c.stage = 'done';
    c.wins += 1;
  },
};

export function battleSetup(c, battleId) {
  const setup = {};
  if (battleId === 'wulin' && c.flags.route) setup.route = c.flags.route;
  return setup;
}

export function endingEchoes(c) {
  const lines = [];
  if (c.flags.route === 'fire') lines.push('黄盖的苦肉计骗过了曹操，也让乌林的火船一路无人拦阻。');
  else if (c.flags.route === 'calm') lines.push('你没有让黄盖先流那一道血，稳阵换来的先手，仍在乌林派上了用场。');
  if (c.flags.wind === 'three') lines.push('三日东南风烧尽了铁索连舟，也把江上的夜照得像白昼。');
  else if (c.flags.wind === 'one') lines.push('只借一夜的风，来得急，去得也急；帅船起火之后，江面很快重新暗下去。');
  lines.push(c.flags.huarong === 'release' ? '关羽还了曹操旧义，华容道的泥水里留了一条生路。' : '关羽这一刀斩断了旧义，也把北方的棋局推向了另一种走法。');
  return lines.slice(0, 3);
}
