// 赤壁篇剧情、抉择与提示。who 为 null 时是旁白。

export const SPEAKERS = {
  zhouyu: { name: '周瑜', art: 'zhouyu' }, huanggai: { name: '黄盖', art: 'huanggai' },
  ganning: { name: '甘宁', art: 'ganning' }, zhuge: { name: '诸葛亮', art: 'zhuge' },
  lusu: { name: '鲁肃', art: 'lusu' }, caocao: { name: '曹操', art: 'caocao' },
  guanyu: { name: '关羽', art: 'guanyu' }, caimao: { name: '蔡瑁', art: 'caimao' },
  zhangyun: { name: '张允', art: 'zhangyun' }, caoxun: { name: '曹军都尉', art: 'caoxun' },
  xuchu: { name: '许褚', art: 'xuchu' }, quartermaster: { name: '军需官', art: 'guojia' },
};

export const STORY = {
  prologue: [
    { who: null, text: '建安十三年冬，曹操率二十余万大军南下。江陵既下，八十万水军顺江压向夏口。' },
    { who: null, text: '孙权以周瑜为左都督，程普为右都督，率三万江东水军逆流而上，与刘备合兵三江口。' },
    { who: 'zhouyu', text: '曹军船大而多，我军船小而快。正面硬撞，正中曹操下怀。' },
    { who: 'lusu', text: '都督，孔明先生已到临江亭。他说，这一仗的胜负，不在江面，在天时。' },
    { who: 'zhouyu', text: '请。先见鲁肃与孔明，再整水寨。曹军的巡船，也该到江心了。' },
  ],
  lusu: [
    { who: 'lusu', text: '都督，曹军新到，水土不服；北兵又不习水战，连舟之后才勉强能站稳。' },
    { who: 'zhouyu', text: '铁索连舟，看似稳，实则把几十条船变成一把柴。只要一把火，便一烧到底。' },
    { who: 'zhuge', text: '火要烧得起来，还要一阵风。此时江上北风正紧，火头会先烧回自己。' },
    { who: 'zhouyu', text: '孔明先生的意思是——等东南风？' },
    { who: 'zhuge', text: '三日之内，我可在七星坛借一场东南风。只是风来之前，得有人把火船送过江心。' },
    { who: 'lusu', text: '曹军巡船就在江岸。都督先拿它试刀，也好让三军知道：这一仗，江东要打。' },
  ],
  scoutIntro: [
    { who: 'huanggai', text: '都督，下游来了一队曹军巡船。打着“曹”字旗，正往水寨窥探。' },
    { who: 'ganning', text: '末将带锦帆营去截住，看他们还敢不敢靠岸。' },
    { who: 'zhouyu', text: '不必急着全营出动。先点将登船，试他们的阵。第一仗，要让全军看清怎么打。' },
  ],
  afterPatrol: [
    { who: null, text: '曹军巡船被击退，江面浮着断桨与破碎的曹字旗。东吴水寨第一次爆出长久的欢呼。' },
    { who: 'huanggai', text: '都督，曹军船虽大，转身却慢。若用火船贴水突入，他们连掉头都来不及。' },
    { who: 'zhouyu', text: '火船要有人去。不是把船点着推出去，是有人坐在船上，把它送到敌阵深处。' },
    { who: 'huanggai', text: '老夫去。' },
    { who: 'zhouyu', text: '老将军……' },
    { who: 'huanggai', text: '江东三世厚恩，老夫受得起。若曹操只防着东吴的锋刃，便让他看看一个老头子的降书。' },
    { who: 'ganning', text: '都督，黄老将军若要诈降，得先让曹军相信他真被打过、真受了辱。' },
    { who: 'zhouyu', text: '若要骗过曹操，先得骗过我们自己的军心。' },
  ],
  huanggaiPlan: [
    { who: 'huanggai', text: '都督尽管下令。杖责、夺职、押入后营，老夫都受得。' },
    { who: 'zhouyu', text: '老将军，这不是戏。杖下见血，曹军的探子才会信；你若中途改了主意，火船便无人能领。' },
    { who: 'huanggai', text: '老夫若怕疼，当年便不会在孙策帐前请缨。' },
    { who: 'lusu', text: '都督，杖责之后，黄老将军还得亲自写降书。' },
    { who: 'huanggai', text: '写。老夫写：“周瑜小儿，不足与谋；愿率本部归丞相。”' },
  ],
  qixingIntro: [
    { who: null, text: '南屏山七星坛。七盏灯按北斗铺开，坛下立着东吴的旗与曹军的探子。' },
    { who: 'zhuge', text: '都督，三日三夜东南风，从今夜起。' },
    { who: 'zhouyu', text: '孔明先生，风若不来呢？' },
    { who: 'zhuge', text: '风若不来，火船便不必出港。人不能拿三军性命，去赌一句“应该”。' },
    { who: 'lusu', text: '先生，坛上风大，你的衣袍都要被吹走了。' },
    { who: 'zhuge', text: '风大才好。风若太小，火船便走不到乌林。' },
    { who: 'zhouyu', text: '传令：七星坛灯火不灭，全军候风。风起之时，黄盖火船先行。' },
  ],
  gotZhuge: [
    { who: null, text: '东南风从江面缓缓压来。七星坛的七盏灯同时偏向西北，诸葛亮收起羽扇，随周瑜下坛。' },
    { who: 'zhuge', text: '都督，风已借到。接下来，得看人了。' },
    { who: 'zhouyu', text: '孔明先生随军同行。火船出港之前，我还要听你一句实话。' },
    { who: 'zhuge', text: '实话是：火一旦烧起来，江上不会有赢家。只会有先走的人和后走的人。' },
    { who: 'ganning', text: '那就让曹军后走。' },
  ],
  wulinIntro: [
    { who: null, text: '乌林水寨，铁索把曹军战船连成一片。夜色里，船灯像一条卧在江上的长龙。' },
    { who: 'caimao', text: '东吴船队？来得正好。铁索连舟，江面就是平地，看你们怎么撞。' },
    { who: 'zhangyun', text: '蔡将军，北岸箭楼已经备好。只要他们靠近，便万箭齐发。' },
    { who: 'zhouyu', text: '甘宁，先破弓手。黄盖，火船压住左翼。孔明，护住中军。' },
    { who: 'ganning', text: '锦帆营，随我上！' },
  ],
  afterFleet: [
    { who: null, text: '蔡瑁、张允的连舟被撕开一道缺口，火油顺着江面漂向深处。曹军寨中响起第一阵慌乱的锣声。' },
    { who: 'caocao', text: '不过是几艘小船，慌什么！传令许褚，守住帅船；蔡瑁，把缺口堵上。' },
    { who: 'huanggai', text: '都督，曹操的楼船就在火头前面。老夫的火船还能再冲一次。' },
    { who: 'zhouyu', text: '老将军，这一回不必诈降了。让曹操看清楚，是谁的船到了他面前。' },
    { who: 'zhuge', text: '风势正顺。只要帅船起火，余舰便不必再追。' },
    { who: 'ganning', text: '我替黄老将军开路。曹操的虎卫，也得先问过锦帆营的刀。' },
  ],
  bossIntro: [
    { who: 'caocao', text: '周瑜，你以为一把火就能烧尽我八十三万大军？' },
    { who: 'zhouyu', text: '烧不尽。可只要烧掉你的帅船，江上这些人便不必再替你送命。' },
    { who: 'caocao', text: '好大的口气。横槊在手，我便看看东吴的火，能不能近我的身。' },
    { who: 'huanggai', text: '曹操，黄盖在此！' },
    { who: 'caocao', text: '黄盖？你不是已经降了么？' },
    { who: 'huanggai', text: '降书是假的。老夫这把火，是真的。' },
  ],
  afterBoss: [
    { who: null, text: '帅船的火烧穿了船楼。曹操在许褚与亲卫护持下弃船登岸，沿华容道北走。' },
    { who: 'zhouyu', text: '不必追得太急。曹操若死在乱军里，北方诸州只会再推一个曹操出来。' },
    { who: 'zhuge', text: '华容道泥深路窄，关羽已在那里候着。' },
    { who: 'ganning', text: '关将军？他不是刘备的人么？' },
    { who: 'zhuge', text: '所以这一回，要让关将军自己选。' },
  ],
  huarongIntro: [
    { who: null, text: '华容道。雨水把山道泡成烂泥，曹操身边只剩数十骑，马匹陷在泥里，连旗都举不起来。' },
    { who: 'guanyu', text: '丞相，关某在此。' },
    { who: 'caocao', text: '云长……原来是故人。' },
    { who: 'guanyu', text: '昔日丞相待关某不薄。今日我奉军师将令，守此最后一道路。' },
    { who: 'zhouyu', text: '关将军，曹操若活着回去，北方仍有再起之日。' },
    { who: 'zhuge', text: '都督所言是军势；关将军所守，是人心。' },
    { who: 'guanyu', text: '请都督与军师退后。关某有一句话，要当着丞相问。' },
  ],
  huarongRelease: [
    { who: 'guanyu', text: '丞相，昔日赠马、赠袍，关某都记着。今日这条道，我还你。' },
    { who: 'caocao', text: '云长……' },
    { who: 'guanyu', text: '不必谢。关某放你，不为曹，只为当年那一份义。去罢。' },
    { who: null, text: '曹操抱拳一拜，带着残骑隐入山雾。关羽横刀立在泥道旁，没有回头。' },
  ],
  huarongKill: [
    { who: 'guanyu', text: '丞相，今日若放你走，来日江上还要再死多少人？' },
    { who: 'caocao', text: '云长要取我性命，便取。只望你记得，天下大势，不会因一人而止。' },
    { who: 'guanyu', text: '关某记得。可关某也记得，今日站在这里的人。' },
    { who: null, text: '青龙偃月刀落下，山雨忽然停了。华容道静得只剩马匹的喘息。' },
  ],
  ending: [
    { scene: 'battle', text: '乌林的余火在江面烧了三日。铁索连舟化作焦木，水寨的灯火终于熄灭。' },
    { scene: 'fire', text: '东风回转，火头渐渐低头。江上的人开始捞起浮木，把还能救的伤员拖上岸。' },
    { scene: 'ash', text: '周瑜站在焦黑的船头，望着北岸。这一仗胜了，江东却并没有因此变轻。' },
    { scene: 'rain', text: '黄盖的肩伤在雨里发疼。他把火把递给甘宁，自己坐在泥里，笑了很久。' },
    { scene: 'farewell', text: '三江口重新升起炊烟。诸葛亮把借来的风还了天，周瑜把军令还给孙权。' },
    { scene: 'farewell', text: '赤壁的火光照亮了一个时代，也照出了每个人要走的路。' },
  ],
};

export const CHOICES = {
  strategy: {
    title: '黄盖请命：如何把火船送进乌林？',
    options: [
      { key: 'fire', label: '依苦肉计，黄盖诈降', note: '黄盖受杖、投书曹营，火船可直入连舟。此后乌林之战，敌军火势更盛，但我军可抢得先手。' },
      { key: 'calm', label: '暂缓苦肉，稳守待机', note: '不急于诈降，先以水寨稳阵。乌林开战时全队头两回合受伤减少 15%，但火船攻势稍慢。' },
    ],
  },
  qixing: {
    title: '诸葛亮登坛借风：借多久？',
    options: [
      { key: 'three', label: '借三日三夜东风', note: '风足三日，乌林全战敌军每回合受火势影响；但曹操也会察觉江面风变。' },
      { key: 'one', label: '只借一夜，够烧帅船', note: '风短而急，首战全队身法提高；火势只够烧到帅船，决战需更快解决。' },
    ],
  },
  huarong: {
    title: '华容道 · 关羽问最后一句',
    options: [
      { key: 'release', label: '放曹操一条生路', note: '关羽还旧义，曹操北归。天下三分之势从此成形。' },
      { key: 'kill', label: '请关将军斩草除根', note: '曹操死于华容。北方大乱，江东与刘备都将面对新的局面。' },
    ],
  },
};

export const CHAPTERS = {
  c1: { bg: 'sanjiangkou', title: '第一折 · 三江定计', sub: '第四十三至四十六回　诸葛亮舌战群儒　周瑜三江口点兵' },
  c2: { bg: 'sanjiangkou', title: '第二折 · 苦肉诈降', sub: '第四十六回　用奇谋孔明借箭　献密计黄盖受刑' },
  c3: { bg: 'qixingtan', title: '第三折 · 七星借风', sub: '第四十九回　七星坛诸葛祭风　三江口周瑜纵火' },
  c4: { bg: 'wulin', title: '第四折 · 火烧赤壁', sub: '第五十回　诸葛亮智算华容　关云长义释曹操' },
  c5: { bg: 'huarong', title: '终折 · 华容道', sub: '一把火之后的天下人心' },
};

export const STORY_BG = { qixing: 'qixingtan', huarong: 'huarong' };

export const BOUNTY = {
  offer: '甘宁把巡练令拍在案上：“都督，江面那几艘曹军斥候船闲着也是闲着，让兄弟们拿它们练手？”',
  hunting: '巡练敌船就在水寨外的明处。点它便可开战；胜负都有历练与军需可拿。',
  report: '这一轮巡练已过。点甘宁可再领一趟。',
  roundDone: '五轮巡练已满。甘宁把锦帆营的旧刀谱塞进了你的行囊。',
};

export const SHOP_LINES = { quartermaster: '都督，军需在此。药、火油、兵甲都有，银两得省着花。' };

export const HELP = [
  ['行路', '点地面行走，也可用方向键。头顶有「!」的人推动主线；点右侧任务，周瑜会自己走过去。'],
  ['交战', '每回合先给三位伙伴下令，再按速度依次出手。上方一排头像就是出手顺序。'],
  ['五行', '金克木、木克土、土克水、水克火、火克金。克制对手伤害多五成；被克只剩六成六。选目标时会先显示预伤。'],
  ['战法', '战法耗法力。防御让这回合受伤减半，并回一成法力。'],
  ['特技', '挨打会攒怒气。怒气够了，人人能放特技；诸葛亮入队后还能用军师战法。'],
  ['巡练', '与甘宁说话可领江防巡练：点水寨外的曹军斥候船开战，得历练、银两和军需。'],
  ['存档', '每场战斗后自动存档。设置里也能随时手动存。'],
];

export const COACH = {
  zhouyu1: '周瑜属火，巡江都尉属金——火克金。点【攻击】，再点都尉。',
  huanggai1: '黄盖稳守船头：点【防御】，这回合受伤减半，还能回一点法力。',
  ganning1: '甘宁属水，身法最快。点【战法】，用「锦帆突袭」先打弓手。',
  ke: '火克金：这一下多打了五成。看清五行，比多发一船火油更管用。',
  round2: '上方是出手顺序，身法快的先动。三条指令都已放开，随你调遣。',
  fire: '乌林火起：每回合末，不属水的伙伴会被灼伤。甘宁属水，可放心突进。',
  heavy: '曹操在蓄力！下一击锁定此刻气血最少的人（头顶「被盯上」）。让他防御、补血，或由伙伴保护。',
  assist: '黄盖火船已撞上帅船！曹操破防，正是集火的时候。',
};

export function endingScene(i, lines = STORY.ending) {
  return lines[i]?.scene ?? (i >= lines.length - 2 ? 'farewell' : 'fire');
}
