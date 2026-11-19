// 四张可走场景与地图锚点。坐标是 2400×1600 的地图单位。

export const MAP_SIZE = [2400, 1600];
export const MAP_PX_PER_UNIT = 1;

const road = (w, ...pts) => ({ w, pts });

export const SCENES = {
  sanjiangkou: {
    id: 'sanjiangkou', name: '三江口', region: '东吴水寨', music: 'overworld', tint: [130, 180, 170],
    roads: [
      road(310, [1020, 1300], [1100, 1080], [1120, 840], [1180, 620], [1320, 520], [1510, 540]),
      road(260, [1120, 840], [900, 770], [740, 720], [620, 700]),
      road(260, [1120, 840], [1360, 860], [1610, 900], [1880, 910], [2050, 850]),
      road(240, [620, 700], [500, 820], [460, 980], [520, 1080]),
      road(250, [1120, 840], [1060, 1110], [1080, 1300]),
      road(230, [1180, 620], [1230, 480], [1280, 400]),
      road(230, [2050, 850], [2130, 690], [2210, 420], [2270, 320]),
      road(230, [1880, 910], [1980, 1060], [2180, 1180], [2310, 1280]),
      road(430, [1180, 620]), road(380, [1510, 540]), road(320, [740, 720]),
      road(320, [520, 1080]), road(320, [2270, 320]), road(320, [2310, 1280]),
    ],
    blocks: [
      [300, 360, 660, 690], [850, 300, 1110, 610], [1230, 350, 1730, 720], [1840, 480, 2140, 760],
      [300, 880, 480, 1180], [690, 890, 900, 1050], [1460, 980, 1750, 1220], [2020, 980, 2280, 1220],
      [160, 1280, 430, 1510], [620, 1280, 900, 1450], [1320, 1180, 1620, 1470], [1960, 1300, 2300, 1510],
    ],
    spawn: [1020, 1320],
    npcs: {
      lusu: { art: 'lusu', name: '鲁肃', title: '东吴赞军校尉', at: [1280, 470], h: 126 },
      zhuge: { art: 'zhuge', name: '诸葛亮', title: '卧龙先生', at: [1510, 540], h: 130 },
      huanggai: { art: 'huanggai', name: '黄盖', title: '东吴老将', at: [740, 720], h: 128 },
      ganning: { art: 'ganning', name: '甘宁', title: '锦帆游侠', at: [2050, 850], h: 126 },
      quartermaster: { art: 'guojia', name: '军需官', title: '丹药与兵甲', at: [520, 1080], h: 116 },
      caoxun: { art: 'caoxun', name: '曹军巡江都尉', title: '巡江前哨', at: [1880, 910], h: 124, foe: true },
    },
    portals: {
      qixingtan: { to: 'qixingtan', at: [2270, 320], label: '七星坛' },
      wulin: { to: 'wulin', at: [2310, 1280], label: '乌林水寨' },
    },
    arrivals: { qixingtan: [2170, 390], wulin: [2190, 1190] },
    landmarks: {
      war_drum: { name: '江畔战鼓', at: [900, 770] },
      old_camp: { name: '断枪旧垒', at: [1610, 900] },
    },
    demonSpawns: [[1260, 1080], [1580, 880], [860, 760], [1900, 760]],
  },
  qixingtan: {
    id: 'qixingtan', name: '七星坛', region: '南屏山', music: 'overworld', tint: [150, 170, 230],
    roads: [
      road(260, [250, 1450], [420, 1320], [620, 1180], [820, 1100], [1030, 1040]),
      road(260, [1030, 1040], [1190, 990], [1390, 1040], [1610, 1110], [1850, 1210], [2100, 1340]),
      road(260, [620, 1180], [540, 980], [600, 790]),
      road(260, [1610, 1110], [1710, 930], [1800, 760]),
      road(420, [1190, 990]), road(320, [250, 1450]),
    ],
    blocks: [
      [220, 310, 540, 620], [690, 240, 980, 540], [1530, 260, 1880, 580], [2010, 350, 2310, 670],
      [130, 1050, 390, 1320], [1800, 1260, 2130, 1530], [680, 1330, 960, 1540],
    ],
    spawn: [270, 1420],
    npcs: {
      zhuge: { art: 'zhuge', name: '诸葛亮', title: '登坛借风', at: [1190, 790], h: 138 },
      lusu: { art: 'lusu', name: '鲁肃', title: '奉都督命护卫', at: [1010, 1110], h: 122 },
    },
    portals: { sanjiangkou: { to: 'sanjiangkou', at: [250, 1450], label: '三江口' } },
    arrivals: { sanjiangkou: [330, 1400] },
    landmarks: {
      altar: { name: '七星法坛', at: [1190, 990] },
      star_rock: { name: '观星石', at: [1710, 930] },
    },
    demonSpawns: [[880, 1120], [1420, 1080]],
  },
  wulin: {
    id: 'wulin', name: '乌林水寨', region: '曹军连舟', music: 'overworld', tint: [225, 120, 90],
    roads: [
      road(260, [240, 1420], [470, 1320], [700, 1190], [890, 1050], [980, 900]),
      road(260, [980, 900], [1210, 830], [1430, 760], [1660, 690], [1900, 650]),
      road(260, [1430, 760], [1530, 920], [1640, 1080], [1810, 1160]),
      road(260, [700, 1190], [620, 1010], [670, 850]),
      road(360, [980, 900]), road(360, [1660, 690]), road(300, [1810, 1160]),
    ],
    blocks: [
      [360, 430, 690, 740], [820, 300, 1160, 580], [1500, 180, 1880, 500], [2010, 420, 2320, 730],
      [180, 870, 480, 1140], [710, 1350, 980, 1550], [1210, 1250, 1510, 1530],
    ],
    spawn: [250, 1400],
    npcs: {
      caimao: { art: 'caimao', name: '蔡瑁', title: '曹军水军都督', at: [980, 900], h: 128, foe: true },
      caocao: { art: 'caocao', name: '曹操', title: '丞相帅船', at: [1660, 690], h: 142, foe: true },
      xuchu: { art: 'xuchu', name: '许褚', title: '虎卫', at: [1430, 760], h: 134, foe: true },
    },
    portals: { sanjiangkou: { to: 'sanjiangkou', at: [240, 1420], label: '三江口' } },
    arrivals: { sanjiangkou: [330, 1380] },
    landmarks: {
      chain_ships: { name: '连环铁索', at: [700, 1190] },
      cao_mast: { name: '曹军帅旗', at: [1810, 1160] },
    },
    demonSpawns: [[880, 1040], [1240, 900], [1800, 780]],
  },
  huarong: {
    id: 'huarong', name: '华容道', region: '荆州北道', music: 'overworld', tint: [120, 170, 150],
    roads: [
      road(240, [220, 1360], [420, 1260], [650, 1160], [870, 1070], [1080, 990]),
      road(240, [1080, 990], [1240, 850], [1390, 710], [1580, 610], [1810, 560]),
      road(200, [650, 1160], [570, 990], [590, 820]),
      road(200, [1390, 710], [1510, 930], [1640, 1070]),
      road(360, [1080, 990]), road(340, [1580, 610]),
    ],
    blocks: [
      [130, 380, 420, 700], [500, 260, 720, 540], [850, 260, 1110, 520], [1830, 200, 2250, 550],
      [1900, 800, 2260, 1100], [180, 1390, 420, 1580], [980, 1250, 1310, 1570],
    ],
    spawn: [230, 1340],
    npcs: {
      guanyu: { art: 'guanyu', name: '关羽', title: '汉寿亭侯', at: [1080, 990], h: 142 },
      caocao: { art: 'caocao', name: '曹操', title: '败走华容', at: [1390, 710], h: 132 },
    },
    portals: {},
    arrivals: {},
    landmarks: {
      muddy_road: { name: '泥泞古道', at: [650, 1160] },
      broken_banner: { name: '折断的曹旗', at: [1640, 1070] },
    },
    demonSpawns: [],
  },
};

export const WALK_ART = Object.fromEntries(
  ['zhouyu', 'huanggai', 'ganning', 'zhuge', 'lusu', 'caocao', 'guanyu', 'caimao', 'zhangyun', 'caoxun', 'xuchu', 'guojia'].map((k) => [k, { ax: 0.5, ay: 0.982, top: 0.025 }]),
);
export const WALK_SHEETS = {};
export const WALK_SHEET_CELL = { h: 300, frames: 6, foot: 0.987 };

export const BARKS = {
  lusu: ['都督，江上风向又变了。', '孔明先生已在临江亭候着。', '军需已备，只等火船。'],
  zhuge: ['万事俱备，只欠东风。', '七星坛上，我自为都督借三日三夜东南风。', '火攻之要，不在火，而在风。'],
  huanggai: ['老夫受江东三世厚恩，这一把骨头还报得起。', '诈降书已经送过江了。', '火船要贴水走，才不会先被箭射住。'],
  ganning: ['锦帆营随时可以出发。', '曹军铁索连舟，最怕一把火。', '要练一练，便点江上的巡船。'],
  quartermaster: ['金疮药、醒神散，都是江上用得着的。', '火油罐不多了，都督省着用。'],
  caoxun: ['什么人敢近曹军水寨！', '巡江船队，止步！'],
  caimao: ['铁索连舟，江面便是一块平地。', '东吴小儿，也敢来撞水寨？'],
  caocao: ['横槊赋诗，人生几何。', '江东火起，也未必烧得到丞相帅船。'],
  guanyu: ['关某在此，已候多时。', '丞相昔日厚待，今日如何还这笔账？'],
};

export const BANTER = [
  { who: 'huanggai', text: '都督，火船已备，只等风起。', scenes: ['sanjiangkou'] },
  { who: 'ganning', text: '江面看着静，水下可不静。', scenes: ['sanjiangkou', 'wulin'] },
  { who: 'zhuge', text: '天时、地利、人和，缺一不可。' },
  { who: 'lusu', text: '这一仗打得太险，都督务必留后手。' },
  { who: 'huanggai', text: '老将的船头，还站得稳。', scenes: ['wulin'] },
];

export const LANDMARKS = {
  war_drum: {
    scene: 'sanjiangkou', title: '江畔战鼓',
    intro: '一面旧战鼓半埋在江沙里。鼓面还紧，仿佛昨夜才擂过三通。',
    revisit: '战鼓被移到了军帐前，鼓声随时能传遍水寨。',
    options: [{ key: 'look', label: '替老鼓换上鼓槌', reward: {}, result: '黄盖试擂一记，江面回声沉厚。三军都知道：这一仗不是虚张声势。' }],
  },
  old_camp: {
    scene: 'sanjiangkou', title: '断枪旧垒',
    intro: '沙洲上留着孙策旧营的断枪与残旗。垒墙只到膝盖，却仍能看出当年拒水列阵的骨架。',
    revisit: '旧垒旁插了新旗，年轻军士正在照旧阵练枪。',
    options: [{ key: 'look', label: '掸去旧旗上的沙', reward: {}, result: '周瑜望着断垒道：“江东的山河，从来不是一代人守下来的。”' }],
  },
  altar: {
    scene: 'qixingtan', title: '七星法坛',
    intro: '坛按北斗七位铺石，四角悬着铜铃。海风穿过铃隙，声音一高一低，像潮水在数数。',
    revisit: '法坛上的旗仍指着东南。风已经借来了。',
    options: [{ key: 'look', label: '细看坛上的风纹', reward: {}, result: '诸葛亮以羽扇点过七盏灯：“风非我造，只是借来。三日之后，须原样还天。”' }],
  },
  star_rock: {
    scene: 'qixingtan', title: '观星石',
    intro: '青石表面刻着细密星图，边角已被海浪磨圆。北斗的第七星缺了一笔。',
    revisit: '缺笔的星位被新石灰补上，夜色里微微发亮。',
    options: [{ key: 'look', label: '补看这一笔星路', reward: {}, result: '诸葛亮笑道：“星路可看，不可全信。真正能借风的，还是肯把船开出去的人。”' }],
  },
  chain_ships: {
    scene: 'wulin', title: '连环铁索',
    intro: '粗如手臂的铁索把几十艘曹军舰船锁成一排。铁环被江水磨亮，旁边却有新浇的火油味。',
    revisit: '铁索已经被火烤得发黑，连舟成了连火。',
    options: [{ key: 'look', label: '记下铁索的连接处', reward: {}, result: '甘宁用刀背敲了敲锁扣：“连得越紧，烧起来越散不开。都督，就是这里。”' }],
  },
  cao_mast: {
    scene: 'wulin', title: '曹军帅旗',
    intro: '帅旗在夜风里压得很低。旗面上“曹”字胖大，旗杆下守着两层甲士，远处是曹操的楼船。',
    revisit: '帅旗已经烧去半幅，只剩一个焦黑的曹字。',
    options: [{ key: 'look', label: '看清帅船的位置', reward: {}, result: '周瑜记下楼船与链阵的距离：“火船不必撞散全寨，只要烧到帅船跟前。”' }],
  },
  muddy_road: {
    scene: 'huarong', title: '泥泞古道',
    intro: '雨水把山道泡成烂泥，车辙深得能养鱼。曹军丢下的盔甲散在路边，连旗杆都折了。',
    revisit: '泥地里只剩两行车辙，一路向华容深处。',
    options: [{ key: 'look', label: '察看来路与退路', reward: {}, result: '关羽按刀道：“此路只容一骑。丞相要走，也只走得一人。”' }],
  },
  broken_banner: {
    scene: 'huarong', title: '折断的曹旗',
    intro: '旗杆从中间断开，曹字只剩半边。旁边倒着一只水囊，仍有一线温水。',
    revisit: '断旗被雨打得贴地，再没有军号声。',
    options: [{ key: 'look', label: '把水囊留给败军', reward: {}, result: '周瑜没有阻拦。胜负已定，饥渴却仍是真的。' }],
  },
};
