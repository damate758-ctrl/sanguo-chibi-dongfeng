// 赤壁回合制战斗数据。规则引擎只读取这些表；改角色、敌人与战法只需改此文件。

export const ELEMENTS = ['金', '木', '土', '水', '火'];
export const BEATS = { 金: '木', 木: '土', 土: '水', 水: '火', 火: '金' };
export const ELEMENT_COEF = { ke: 1.5, beike: 0.66, none: 1 };

// kind: phy 用武勇 / mag 用智略；target: enemy / enemies / ally / party / self
export const SKILLS = {
  huoshi: { name: '火攻', kind: 'mag', mul: 1.7, mp: 16, target: 'enemy', hit: 0.96, fx: 'fire', desc: '以火船引燃敌舰，重创一名敌人。' },
  dongfeng: { name: '借东风', kind: 'mag', mul: 0, mp: 22, target: 'party', buff: { id: 'spd_up', val: 0.28, turns: 3 }, fx: 'gale', desc: '东南风起，全队速度提高 28%，持续三回合。' },
  fenshao: { name: '焚舟破阵', kind: 'mag', mul: 1.15, mp: 25, target: 'enemies', hit: 0.92, fx: 'firewave', desc: '火势沿江面铺开，灼烧全体敌人。' },
  dudu: { name: '都督号令', kind: 'mag', mul: 0, mp: 20, target: 'party', buff: { id: 'atk_up', val: 0.25, turns: 3 }, fx: 'aura', desc: '三军听令，全队攻击提高 25%。' },
  tianhuo: { name: '天火燎原', kind: 'mag', mul: 1.85, mp: 34, target: 'enemy', hit: 0.94, fx: 'firewave', desc: '七星坛借来的东风化作天火，重创一舰。' },

  tiebian: { name: '铁鞭破索', kind: 'phy', mul: 1.45, mp: 14, target: 'enemy', hit: 0.94, buff: { id: 'def_down', val: 0.28, turns: 3 }, fx: 'smash', desc: '铁鞭劈开连环铁索，并令目标防御降低 28%。' },
  kuzhou: { name: '苦肉诈降', kind: 'mag', mul: 0, mp: 0, target: 'self', buff: { id: 'atk_up', val: 0.35, turns: 2 }, selfHurt: 0.12, fx: 'aura', desc: '受杖立誓，自身攻击提高 35% 两回合；以血换势。' },
  huochuan: { name: '火船突击', kind: 'phy', mul: 1.85, mp: 20, target: 'enemy', hit: 0.92, selfHeal: 0.18, fx: 'fire', desc: '驾火船撞入敌阵，重创一舰，并以火势回气。' },
  jianshou: { name: '老将坚守', kind: 'mag', mul: 0, mp: 16, target: 'self', buff: { id: 'dmg_reduce', val: 0.3, turns: 3 }, fx: 'ward', desc: '横鞭守住船头，三回合内所受伤害降低三成。' },

  jinfan: { name: '锦帆突袭', kind: 'phy', mul: 1.55, mp: 14, target: 'enemy', hit: 0.96, critBonus: 0.08, fx: 'slash', desc: '锦帆轻舟顺流而进，快速重击一舰。' },
  baiqi: { name: '百骑劫营', kind: 'phy', mul: 1.05, mp: 20, target: 'enemies', hit: 0.92, fx: 'sweep', desc: '百骑分袭，横扫全体敌人。' },
  duanwei: { name: '断桅', kind: 'phy', mul: 1.25, mp: 18, target: 'enemy', hit: 0.94, buff: { id: 'spd_down', val: 0.22, turns: 2 }, fx: 'slash', desc: '斩断敌舰桅杆，令目标速度降低 22%。' },
  shuilang: { name: '踏浪', kind: 'mag', mul: 1.35, mp: 18, target: 'enemies', fx: 'wave', desc: '借江浪拍击，伤及全体敌人。' },

  jiefeng: { name: '祭风', kind: 'mag', mul: 0, mp: 18, target: 'party', buff: { id: 'spd_up', val: 0.2, turns: 2 }, fx: 'gale', desc: '登坛祭风，全队速度提高两成。' },
  huozhen: { name: '火阵', kind: 'mag', mul: 1.35, mp: 20, target: 'enemies', fx: 'firewave', desc: '布下火阵，灼烧全体敌人。' },
  bagua: { name: '八卦护军', kind: 'mag', mul: 0, mp: 24, target: 'party', buff: { id: 'dmg_reduce', val: 0.28, turns: 3 }, fx: 'ward', desc: '八卦阵护住全队，三回合内受伤减少 28%。' },
  caochuan: { name: '草船借箭', kind: 'mag', mul: 1.55, mp: 22, target: 'enemies', hit: 0.9, fx: 'wave', desc: '借江雾诱敌放箭，反伤全体敌人。' },

  xunchuan: { name: '巡江戟', kind: 'phy', mul: 1.25, mp: 0, target: 'enemy', hit: 0.93, fx: 'slash' },
  liannu: { name: '连环弩', kind: 'phy', mul: 1.05, mp: 0, target: 'enemies', hit: 0.9, fx: 'sweep' },
  suolian: { name: '铁索横江', kind: 'phy', mul: 0.95, mp: 0, target: 'enemies', hit: 0.9, buff: { id: 'spd_down', val: 0.18, turns: 2 }, fx: 'quake' },
  huogong: { name: '曹军火矢', kind: 'mag', mul: 1.25, mp: 0, target: 'enemy', hit: 0.92, fx: 'fire' },
  hengshuo: { name: '横槊', kind: 'phy', mul: 1.65, mp: 0, target: 'enemy', hit: 0.94, fx: 'smash' },
  hubian: { name: '虎卫冲阵', kind: 'phy', mul: 1.1, mp: 0, target: 'enemies', hit: 0.9, fx: 'quake' },
  chengxiang: { name: '丞相督战', kind: 'mag', mul: 0, mp: 0, target: 'ally', buff: { id: 'atk_up', val: 0.3, turns: 3 }, fx: 'aura' },
  dafa: { name: '大纛压阵', kind: 'phy', mul: 1.8, mp: 0, target: 'enemy', hit: 0.9, fx: 'smash' },
};

export const BASIC_ATTACK = { name: '攻击', kind: 'phy', mul: 1.0, mp: 0, target: 'enemy', hit: 0.95, fx: 'slash' };

export const SP = { max: 150, gainPerHpPct: 0.9, minGain: 3 };
export const STUNTS = {
  poxi: { name: '破阵一斩', sp: 60, kind: 'phy', mul: 1.75, mp: 0, target: 'enemy', hit: 0.96, fx: 'smash', desc: '把胸中的战意压进一击，重创一舰。' },
  sanjun: { name: '三军齐鼓', sp: 80, kind: 'mag', mul: 0, mp: 0, target: 'party', buff: { id: 'atk_up', val: 0.28, turns: 3 }, fx: 'aura', desc: '擂鼓催军，全队攻击提高 28%，持续三回合。' },
  huoji: { name: '火攻齐发', sp: 110, kind: 'mag', mul: 1.2, mp: 0, target: 'enemies', fx: 'firewave', desc: '号令全军齐投火具，灼烧全体敌人。' },
};

export const FORMS = {};

export const PARTY = {
  zhouyu: {
    key: 'zhouyu', name: '周瑜', title: '东吴都督', element: '火', art: 'zhouyu', crit: 0.12,
    base: { hp: 540, mp: 100, atk: 76, def: 58, spd: 86, mag: 92 },
    growth: { hp: 58, mp: 8, atk: 7, def: 5, spd: 4, mag: 11 },
    skills: { 1: ['huoshi'], 2: ['dongfeng'], 3: ['fenshao'], 4: ['dudu'], 6: ['tianhuo'] },
    recommend: { 灵: 3, 速: 1, 体: 1 },
  },
  huanggai: {
    key: 'huanggai', name: '黄盖', title: '苦肉老将', element: '土', art: 'huanggai', crit: 0.09,
    base: { hp: 720, mp: 52, atk: 96, def: 74, spd: 54, mag: 38 },
    growth: { hp: 92, mp: 3, atk: 11, def: 9, spd: 3, mag: 3 },
    skills: { 1: ['tiebian'], 2: ['kuzhou'], 4: ['huochuan'], 5: ['jianshou'] },
    recommend: { 体: 2, 攻: 2, 防: 1 },
  },
  ganning: {
    key: 'ganning', name: '甘宁', title: '锦帆游侠', element: '水', art: 'ganning', crit: 0.16,
    base: { hp: 560, mp: 64, atk: 101, def: 48, spd: 98, mag: 47 },
    growth: { hp: 65, mp: 4, atk: 12, def: 4, spd: 5, mag: 4 },
    skills: { 1: ['jinfan'], 3: ['baiqi'], 4: ['duanwei'], 5: ['shuilang'] },
    recommend: { 攻: 3, 速: 2, 体: 1 },
  },
  zhuge: {
    key: 'zhuge', name: '诸葛亮', title: '卧龙军师', element: '火', art: 'zhuge', crit: 0.1, isPet: true,
    base: { hp: 460, mp: 128, atk: 52, def: 44, spd: 78, mag: 112 },
    growth: { hp: 44, mp: 10, atk: 4, def: 4, spd: 4, mag: 12 },
    skills: { 1: ['jiefeng'], 2: ['huozhen'], 4: ['bagua'], 5: ['caochuan'] },
    recommend: { 灵: 3, 速: 1, 体: 1 },
  },
};

export const GROWTH = { pointsPerLevel: 5, skillRankCap: 3, statCap: 40, skillPointsPerLevel: 1 };
export const STAT_KEYS = ['体', '攻', '防', '速', '灵'];
export const POINT_GAINS = { 体: { hp: 9 }, 攻: { atk: 2 }, 防: { def: 2 }, 速: { spd: 2 }, 灵: { mag: 2, mp: 2 } };
export const STAT_LABEL = { 体: '体魄', 攻: '武勇', 防: '统御', 速: '身法', 灵: '智略' };
export const STAT_GAIN_TEXT = { 体: '气血 +9', 攻: '武勇 +2', 防: '统御 +2', 速: '身法 +2', 灵: '智略 +2、法力 +2' };

export const EQUIP_SLOTS = { weapon: '兵器', armor: '甲胄' };
export const EQUIPS = {
  gudingdao: { key: 'gudingdao', name: '古锭刀', slot: 'weapon', tier: 1, mods: { atk: 6 }, desc: '武勇 +6' },
  tiejia: { key: 'tiejia', name: '玄铁甲', slot: 'armor', tier: 1, mods: { def: 5, hp: 28 }, desc: '统御 +5，气血 +28' },
  zhanma: { key: 'zhanma', name: '百炼环首刀', slot: 'weapon', tier: 2, mods: { atk: 10 }, crit: 0.02, desc: '武勇 +10，暴击 +2%' },
  yulin: { key: 'yulin', name: '鱼鳞重铠', slot: 'armor', tier: 2, mods: { def: 9, hp: 42 }, desc: '统御 +9，气血 +42' },
  dongfengfu: { key: 'dongfengfu', name: '东风符', slot: 'weapon', tier: 3, mods: { mag: 12, spd: 5 }, only: 'zhouyu', desc: '智略 +12，身法 +5' },
  huoyou: { key: 'huoyou', name: '火油罐', slot: 'armor', tier: 3, mods: { hp: 50, mag: 8 }, only: 'huanggai', desc: '气血 +50，智略 +8' },
  jinchuang: { key: 'jinchuang', name: '护腕', slot: 'armor', tier: 1, mods: { hp: 20 }, desc: '气血 +20' },
};

export const TREASURES = {};

export const FORMATIONS = {
  tiangang: { key: 'tiangang', name: '锋矢阵', gain: '武勇 +20%　身法 +5%', cost: '所受伤害 +15%', mods: { atk: 1.2, spd: 1.05, dmgTaken: 1.15 } },
  liuding: { key: 'liuding', name: '方圆阵', gain: '统御 +18%　所受伤害 −20%', cost: '身法 −5%', mods: { def: 1.18, spd: 0.95, dmgTaken: 0.8 } },
};

export const ITEMS = {
  jinchuang: { key: 'jinchuang', name: '金疮药', type: 'heal', val: 0.5, target: 'ally', desc: '一人恢复一半气血。' },
  dahuandan: { key: 'dahuandan', name: '大还丹', type: 'heal', val: 1.0, target: 'ally', desc: '一人气血回满。' },
  falidan: { key: 'falidan', name: '醒神散', type: 'mp', val: 50, target: 'ally', desc: '一人恢复 50 点法力。' },
  wubaodan: { key: 'wubaodan', name: '行军散', type: 'mp', val: 999, target: 'ally', desc: '一人法力回满。' },
  xingshi: { key: 'xingshi', name: '护心镜', type: 'buff', buff: { id: 'dmg_reduce', val: 0.4, turns: 2 }, target: 'ally', desc: '一人两回合内所受伤害减四成。' },
  jiuhui: { key: 'jiuhui', name: '九转回魂丹', type: 'revive', val: 0.3, target: 'fallen', desc: '救起一位倒下的伙伴，带三成气血归队。' },
  huoyou: { key: 'huoyou', name: '火油罐', type: 'buff', buff: { id: 'atk_up', val: 0.25, turns: 2 }, target: 'ally', desc: '泼油助势，一人两回合攻击提高 25%。' },
  caolian: { key: 'caolian', name: '草连舟', type: 'buff', buff: { id: 'hit_up', val: 0.15, turns: 3 }, target: 'ally', desc: '草束连舟稳住阵脚，一人命中提高 15%。' },
};

export const ENEMIES = {
  caoxun: {
    key: 'caoxun', name: '曹军巡江都尉', short: '巡江都尉', element: '金', art: 'caoxun', crit: 0.06,
    base: { hp: 440, mp: 0, atk: 60, def: 35, spd: 60, mag: 35 },
    growth: { hp: 60, mp: 0, atk: 5, def: 3, spd: 2, mag: 2 },
    skills: ['xunchuan'],
  },
  caosailor: {
    key: 'caosailor', name: '曹军弓手', short: '曹军弓手', element: '木', art: 'zhangyun', crit: 0.05,
    base: { hp: 340, mp: 0, atk: 50, def: 26, spd: 72, mag: 42 },
    growth: { hp: 45, mp: 0, atk: 4, def: 2, spd: 3, mag: 4 },
    skills: ['liannu'],
  },
  caimao: {
    key: 'caimao', name: '蔡瑁', element: '水', art: 'caimao', crit: 0.08,
    base: { hp: 780, mp: 0, atk: 78, def: 56, spd: 62, mag: 56 },
    growth: { hp: 90, mp: 0, atk: 7, def: 5, spd: 3, mag: 4 },
    skills: ['suolian', 'huogong'],
  },
  zhangyun: {
    key: 'zhangyun', name: '张允', element: '木', art: 'zhangyun', crit: 0.08,
    base: { hp: 620, mp: 0, atk: 68, def: 42, spd: 78, mag: 60 },
    growth: { hp: 66, mp: 0, atk: 6, def: 3, spd: 4, mag: 5 },
    skills: ['liannu', 'huogong'],
  },
  caocao: {
    key: 'caocao', name: '曹操', element: '金', art: 'caocao', crit: 0.1, ai: 'boss', heavyName: '横槊一击',
    base: { hp: 1650, mp: 0, atk: 112, def: 70, spd: 74, mag: 88 },
    growth: { hp: 125, mp: 0, atk: 6, def: 4, spd: 2, mag: 5 },
    skills: ['hengshuo', 'chengxiang', 'dafa'],
  },
  xuchu: {
    key: 'xuchu', name: '许褚', element: '土', art: 'xuchu', crit: 0.08, big: true,
    base: { hp: 1120, mp: 0, atk: 106, def: 74, spd: 48, mag: 38 },
    growth: { hp: 112, mp: 0, atk: 7, def: 6, spd: 1, mag: 2 },
    skills: ['hubian'],
  },
  caimao_boss: {
    key: 'caimao_boss', name: '蔡瑁旗舰', short: '蔡瑁', element: '水', art: 'caimao', crit: 0.07,
    base: { hp: 740, mp: 0, atk: 78, def: 54, spd: 58, mag: 54 },
    growth: { hp: 90, mp: 0, atk: 7, def: 5, spd: 2, mag: 4 },
    skills: ['suolian', 'huogong'],
  },
};

export const STORY_SETUP = {
  route: {
    fire: { battle: 'wulin', side: 'enemy', element: '火', buff: { id: 'atk_up', val: 0.18, turns: 3 } },
    calm: { battle: 'wulin', side: 'party', buff: { id: 'dmg_reduce', val: 0.15, turns: 2 } },
  },
};

export const BATTLES = {
  patrol: {
    id: 'patrol', name: '三江口 · 巡江前哨', bg: 'sanjiangkou', music: 'battle', level: 1,
    enemies: ['caoxun', 'caosailor'],
    goal: '击退曹军巡江船',
    retryHint: '周瑜属火，克金：先集火巡江都尉。甘宁速度快，适合补刀；黄盖稳守船头。',
  },
  wulin: {
    id: 'wulin', name: '乌林 · 铁索连舟', bg: 'wulin', music: 'battle', level: 3,
    enemies: ['caimao', 'zhangyun', 'caosailor'],
    field: { kind: 'burn', name: '江火延烧', pct: 0.045, element: '火', immune: '水', short: '乌林火起，每回合末灼伤不属水的伙伴', desc: '火油顺江漂流，每回合末灼伤不属水的伙伴；甘宁属水，可在火中穿行。' },
    goal: '击破蔡瑁、张允，打开乌林水寨',
    retryHint: '甘宁属水，不受江火灼伤，又克火。让周瑜先「焚舟破阵」清理弓手，再集火蔡瑁。',
  },
  wulin_boss: {
    id: 'wulin_boss', name: '乌林 · 曹操帅船', bg: 'wulin', music: 'boss', level: 5, boss: true,
    enemies: ['caocao', 'xuchu', 'caimao_boss'],
    field: { kind: 'burn', name: '满江火海', pct: 0.035, element: '火', immune: '水', short: '连舟尽燃，每回合末灼伤不属水的伙伴', desc: '东南风把火头推向帅船。每回合末，不属水的伙伴会被灼伤。' },
    assist: { boss: 'caocao', hpBelow: 0.56, name: '黄盖火船', art: 'huanggai', amount: 0.16, debuff: { id: 'def_down', val: 0.3, turns: 3 } },
    winOn: { key: 'caocao', title: '曹操败走', sub: '帅船倾覆，余舰四散', goal: '击破曹操帅船，不必清场' },
    goal: '击破曹操帅船',
    retryHint: '曹操每三回合蓄力「横槊一击」。让黄盖防御或保护气血最少的人；甘宁属水，不怕满江火海。',
  },
  drill: {
    id: 'drill', name: '江防巡练 · 曹军斥候', bg: 'sanjiangkou', music: 'battle', bounty: true,
    enemies: ['caoxun', 'caosailor'],
    goal: '击退巡练敌船',
    retryHint: '这是甘宁安排的巡练，可反复挑战；先集火都尉，弓手便不足为惧。',
  },
  drill_b: {
    id: 'drill_b', name: '江防巡练 · 铁索小队', bg: 'wulin', music: 'battle', bounty: true,
    enemies: ['zhangyun', 'caosailor', 'caosailor'],
    goal: '击破铁索小队',
    retryHint: '弓手成群时先让周瑜或诸葛亮群攻。甘宁属水，不怕江火。',
  },
};

export const BUFF_INFO = {
  atk_up: { name: '战意', good: true }, enrage: { name: '狂暴', good: true },
  atk_down: { name: '泄气', good: false }, def_up: { name: '固守', good: true },
  def_down: { name: '破防', good: false }, dmg_reduce: { name: '护军', good: true },
  hit_up: { name: '定帆', good: true }, spd_up: { name: '顺风', good: true },
  spd_down: { name: '逆风', good: false }, regen: { name: '整备', good: true },
  stun: { name: '乱阵', good: false }, vulnerable: { name: '破绽', good: false },
  ke_shield: { name: '铁甲', good: true },
};

export const ECONOMY = {
  expBase: 100, bountyExpPct: 0.4, bountyRing: 5, bountyMoney: [80, 15], storyMoney: 180,
  bountyDrops: [
    { item: 'jinchuang', p: 0.32 }, { item: 'falidan', p: 0.2 },
    { equip: 'zhanma', p: 0.08 }, { equip: 'yulin', p: 0.08 },
  ],
  studyCost: { 2: 300, 3: 700 },
};

export const SHOPS = {
  quartermaster: {
    title: '三江口军需官',
    goods: [
      { item: 'jinchuang', price: 40 }, { item: 'falidan', price: 60 },
      { item: 'huoyou', price: 90 }, { item: 'jiuhui', price: 150 },
      { equip: 'gudingdao', price: 260 }, { equip: 'tiejia', price: 240 },
    ],
  },
};
