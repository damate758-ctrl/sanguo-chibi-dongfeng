// 赤壁主线：对白 → 抉择 → 战斗 → 落账 → 回到场景。

import { h } from '../core/dom.js';
import { STORY, CHOICES, CHAPTERS, STORY_BG } from '../data/story.js';
import { BATTLES, PARTY, SKILLS, ITEMS, EQUIPS, ECONOMY } from '../data/combat.js';
import { SCENES } from '../data/maps.js';
import { bgArt } from '../data/art.js';
import { createBattle } from '../rules/battle.js';
import {
  story as S, battleParty, battleItems, battleSeed, battleSetup, settleBattle, itemLabel, winBounty, levelCap,
} from '../rules/campaign.js';
import { runBattleView, resultCard } from '../battle/view.js';
import { say, choose, toast, banner, chapterCard, wipe } from '../ui/dialogue.js';
import { audio } from '../core/audio.js';

export function createStory(game) {
  const C = () => game.c;
  const hub = () => game.hub;

  function backdrop(bg, cls = '') {
    const el = h(`div.screen.backdrop${cls ? `.${cls}` : ''}`, { data: { ui: 'backdrop' }, style: { backgroundImage: `url(${bgArt(bg)})` } });
    game.stage.append(el);
    return el;
  }

  const levelLines = (ups) => {
    const lines = [];
    const lv = Object.values(ups)[0]?.level;
    if (lv) lines.push(['升级', `全队升到 Lv.${lv}，每人得 5 点潜力、1 点修炼`]);
    for (const [key, up] of Object.entries(ups)) {
      if (up.newSkills.length) lines.push(['新战法', `${PARTY[key].name}习得「${up.newSkills.map((s) => SKILLS[s].name).join('」「')}」`]);
    }
    return lines;
  };
  const growthHint = (ups) => (Object.keys(ups).length ? '升级得了潜力与修炼点：回到场景后点右下的【角色】，「推荐加点」一下就好。' : null);

  async function fight(battleId, { tutorial = false, onWin = null, onBeat = null, enemyLevel = null, salt = 0 } = {}) {
    const c = C();
    const def = BATTLES[battleId];
    for (;;) {
      await wipe('close');
      hub().leave();
      game.stage.querySelectorAll('.backdrop').forEach((n) => n.remove());
      const state = createBattle({
        battleId, party: battleParty(c), formation: c.formation, items: battleItems(c, battleId),
        seed: battleSeed(c, battleId, salt), treasure: c.treasure, setup: battleSetup(c, battleId), enemyLevel,
      });
      const view = runBattleView(game.stage, { state, labels: (k) => itemLabel(c, k), tutorial, canAutoAll: !def.boss, onBeat });
      game.battle = { state, view };
      audio.music(def.music);
      await wipe('open');
      await view.done;
      settleBattle(c, state);
      const close = () => { view.destroy(); game.battle = null; };
      if (state.winner === 'enemy') {
        const pick = await resultCard({
          title: '败北', lost: true,
          hint: def.retryHint ?? '看清五行与蓄力提示，再来一次。',
          buttons: [{ key: 'retry', label: '重整旗鼓，再战' }, { key: 'back', label: '先回去整顿' }],
        });
        close();
        if (pick === 'retry') continue;
        return { winner: 'enemy', state, close: () => {} };
      }
      if (state.winner === 'party') {
        const extra = onWin ? onWin(state) : { lines: [] };
        game.save();
        await resultCard({ title: '此战得胜', lines: extra.lines ?? [], hint: extra.hint ?? null, buttons: [{ key: 'ok', label: '继续' }] });
      }
      return { winner: state.winner, state, close };
    }
  }

  const back = async (sceneId, at = null, r = null) => {
    await wipe('close');
    r?.close();
    game.stage.querySelectorAll('.backdrop').forEach((n) => n.remove());
    await hub().enter(sceneId, { at, fade: true });
  };

  async function meet() {
    const c = C();
    await say(STORY.prologue);
    await say(STORY.lusu);
    S.metAdvisors(c);
    audio.sfx('quest');
    toast('鲁肃相赠：金疮药 ×2、醒神散 ×1、草连舟 ×1', 'good');
    game.log('军议已定：先击退曹军巡船，再议火攻。', true);
    game.save();
    banner('巡江前哨', '水寨下游，曹军巡船正在窥探', 1500);
  }

  async function scout() {
    const c = C();
    await say(STORY.scoutIntro);
    let ups = {};
    const r = await fight('patrol', {
      tutorial: true,
      onWin: () => {
        ups = S.patrolWon(c);
        return { lines: [...levelLines(ups), ['银两', `+${ECONOMY.storyMoney}`]], hint: growthHint(ups) };
      },
    });
    if (r.winner !== 'party') { await back('sanjiangkou', null, r); return; }
    await say(STORY.afterPatrol);
    await back('sanjiangkou', SCENES.sanjiangkou.arrivals.wulin, r);
    game.log('巡江前哨得胜。黄盖请命，以苦肉计诈降曹营。', true);
    banner('苦肉诈降', '回水寨校场，听黄盖把话说完', 1400);
  }

  async function plan() {
    const c = C();
    await chapterCard(CHAPTERS.c2);
    await say(STORY.huanggaiPlan);
    const pick = await choose({ ...CHOICES.strategy, id: 'choice-strategy' });
    S.setStrategy(c, pick);
    game.save();
    await say(pick === 'fire' ? [
      { who: 'huanggai', text: '都督，杖下见血，降书才有人信。老夫这就去后营。' },
      { who: 'zhouyu', text: '传令：黄盖惑乱军心，杖五十，押入后营。' },
      { who: null, text: '军帐外，杖声与军士的低声议论一同传开。当夜，一封降书顺江送进曹营。' },
    ] : [
      { who: 'zhouyu', text: '先不急着杖责。火船照旧备好，让曹操先以为东吴仍在观望。' },
      { who: 'huanggai', text: '老夫这把骨头先留着，等风起再交给都督。' },
      { who: 'lusu', text: '稳住军心也好。只是火船出港时，曹军仍有防备。' },
    ]);
    await back('sanjiangkou');
    game.log('火船之计已定。上七星坛，借东南风。', true);
    banner('七星借风', '水寨东北，南屏山七星坛', 1400);
  }

  async function qixing() {
    const c = C();
    await chapterCard(CHAPTERS.c3);
    await say(STORY.qixingIntro);
    const pick = await choose({ ...CHOICES.qixing, id: 'choice-qixing' });
    const ups = S.gotZhuge(c, pick);
    game.save();
    await say(STORY.gotZhuge);
    audio.sfx('levelup');
    await banner('风起东南', `诸葛亮入队 · 全队升到 Lv.${ups.zhouyu.level}`, 1700);
    await back('qixingtan', SCENES.qixingtan.arrivals.sanjiangkou);
    game.log('诸葛亮以军师身份入队（已上阵）。东风已起，下乌林水寨。', true);
    toast('诸葛亮上阵，可在【军师】里查看与培养', 'good');
  }

  async function fireFleet() {
    const c = C();
    await chapterCard(CHAPTERS.c4);
    await say(STORY.wulinIntro);
    let ups = {};
    const r = await fight('wulin', {
      onWin: () => {
        ups = S.fleetWon(c);
        return { lines: [...levelLines(ups), ['银两', `+${ECONOMY.storyMoney}`]], hint: growthHint(ups) };
      },
    });
    if (r.winner !== 'party') { await back('wulin', null, r); return; }
    await say(STORY.afterFleet);
    await back('wulin', null, r);
    game.log('铁索连舟已破。曹操帅船就在火头前。', true);
    banner('火烧帅船', '点乌林深处的曹操楼船', 1400);
  }

  async function fireBoss() {
    const c = C();
    await say(STORY.bossIntro);
    let ups = {};
    const r = await fight('wulin_boss', {
      onBeat: (kind) => {
        if (kind === 'assist') toast('黄盖火船撞上帅船！曹操破防', 'good');
      },
      onWin: () => {
        ups = S.bossWon(c);
        return { lines: [...levelLines(ups), ['战果', '曹操帅船倾覆，曹军水寨瓦解']], hint: growthHint(ups) };
      },
    });
    if (r.winner !== 'party') { await back('wulin', null, r); return; }
    await say(STORY.afterBoss);
    await wipe('close');
    r.close();
    await back('huarong', SCENES.huarong.spawn);
    game.log('赤壁火胜。曹操败走华容道，关羽已候在泥道中。', true);
    banner('华容道', '最后一刀，交给关羽', 1500);
  }

  async function huarong() {
    const c = C();
    await chapterCard(CHAPTERS.c5);
    await say(STORY.huarongIntro);
    const pick = await choose({ ...CHOICES.huarong, id: 'choice-huarong' });
    S.huarongChoice(c, pick);
    game.save();
    await say(pick === 'release' ? STORY.huarongRelease : STORY.huarongKill);
    audio.sfx('levelup');
    await wipe('close');
    await game.ending();
  }

  async function bountyFight() {
    const c = C();
    const demon = c.bounty.demon;
    if (!demon) return;
    let out = null;
    const r = await fight(demon.battle, {
      enemyLevel: c.levels.zhouyu,
      onWin: () => {
        out = winBounty(c);
        const lines = [
          ['历练', out.capped ? `已到眼下的上限（Lv.${levelCap(c)}），主线再进一步才会放开` : `+${out.reward.exp}`],
          ['银两', `+${out.reward.money}`],
        ];
        const drops = [
          ...Object.entries(out.reward.items).map(([k, n]) => `${ITEMS[k].name} ×${n}`),
          ...out.reward.equips.map((k) => EQUIPS[k].name),
        ];
        if (drops.length) lines.push(['军需', drops.join('、')]);
        lines.push(...levelLines(out.ups));
        if (out.roundDone) lines.push(['五轮巡练', '甘宁另赠兵甲一件，已入背囊']);
        return { lines, hint: growthHint(out.ups) ?? '回水寨找甘宁，可再领下一趟巡练。' };
      },
    });
    await back('sanjiangkou', null, r);
    if (r.winner === 'party') game.log(`江防巡练得胜：银两 +${out.reward.money}。`, true);
  }

  const MAIN = { meet, scout, plan, qixing, fireFleet, fireBoss, huarong };
  return {
    main: () => MAIN[C().stage]?.(),
    bountyFight,
    async opening() {
      await say([
        { who: null, text: '建安十三年冬，江东水军在赤壁与曹军隔江相望。东风未起，江面却已经没有退路。' },
        { who: 'zhouyu', text: '先见鲁肃与孔明。这一仗从哪里落子，今日便要定下。' },
      ]);
      hub().firstMinute();
    },
  };
}
