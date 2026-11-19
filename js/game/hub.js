// 场景枢纽：把战役状态变成场景里的人、任务、渡口与巡练。

import { h } from '../core/dom.js';
import { SCENES, BARKS, BANTER, LANDMARKS } from '../data/maps.js';
import { BOUNTY } from '../data/story.js';
import { createWorld } from '../world/scene.js';
import { createHud } from '../world/hud.js';
import {
  mainQuest, bountyQuest, portalLocked, npcPresent, followers, portalToward, bountyOpen, acceptBounty,
  explore, pendingTeam, pendingPets,
} from '../rules/campaign.js';
import { say, choose, toast, wipe, modalOpen } from '../ui/dialogue.js';
import { openMembers, openBag, openQuests, openFormation, openShop, openSettings, expLine } from '../ui/panels.js';
import { audio } from '../core/audio.js';

export function createHub(game) {
  const root = h('div.screen.world.hidden', { data: { ui: 'world' } });
  game.stage.append(root);
  let world = null, hud = null, busy = false, travel = null, mounted = false, chatter = 0, barkIdx = 0, frameN = 0;
  const C = () => game.c;

  function mount() {
    if (mounted) return;
    mounted = true;
    world = createWorld(root, {
      onActor, onPortal, onSpot,
      onMove: () => { if (hintLive) { hintLive = false; hud.hint(null); } travelCancelIfManual(); },
      onFrame,
    });
    hud = createHud(root, {
      onTrack: (q) => track(q),
      onIcon: (key) => openIcon(key),
      onMinimap: (x, y) => { if (!busy && !modalOpen()) { travel = null; world.walkTo(x, y); } },
    });
  }
  let hintLive = false, manualGuard = false;
  function travelCancelIfManual() { if (!manualGuard) travel = null; }

  function actorsFor(sceneId) {
    const c = C();
    const quest = mainQuest(c);
    const b = c.bounty;
    const list = [];
    for (const [id, n] of Object.entries(SCENES[sceneId].npcs)) {
      if (!npcPresent(c, sceneId, id)) continue;
      let mark = null;
      if (quest.scene === sceneId && quest.npc === id) mark = '!';
      else if (id === 'ganning' && bountyOpen(c)) mark = b.state === 'hunt' ? null : '令';
      list.push({ id, art: n.art, name: n.name, title: n.title, x: n.at[0], y: n.at[1], h: n.h, kind: n.foe ? 'foe' : 'npc', still: !!n.foe, mark });
    }
    if (b.state === 'hunt' && b.demon?.scene === sceneId) {
      list.push({ id: b.demon.id, art: b.demon.art, name: b.demon.name, title: '江防巡练', x: b.demon.x, y: b.demon.y, h: 118, kind: 'foe', wander: true, bounty: true, mark: '!' });
    }
    return list;
  }

  function questList() {
    const c = C();
    const mains = [{ id: 'main', ...mainQuest(c, world?.sceneId) }];
    const side = bountyQuest(c);
    if (side) mains.push({ id: 'bounty', side: true, ...side });
    return mains;
  }

  function refresh() {
    if (!world?.sceneId) return;
    const c = C();
    const scene = SCENES[world.sceneId];
    world.setActors(actorsFor(scene.id));
    world.setPortals(Object.entries(scene.portals).map(([id, p]) => ({
      id, to: p.to, x: p.at[0], y: p.at[1], label: p.label, locked: !!portalLocked(c, p.to),
    })));
    world.setSpots(Object.entries(scene.landmarks ?? {}).map(([id, s]) => ({
      id, name: s.name, x: s.at[0], y: s.at[1], done: !!c.explored[id],
    })));
    hud.quests(questList());
    hud.hero(expLine(c));
    hud.dots({ hero: pendingTeam(c), pet: pendingPets(c) });
  }

  function onFrame() {
    frameN += 1;
    if (frameN % 6 === 0) {
      const [x, y] = world.position();
      const scene = SCENES[world.sceneId];
      hud.place(scene.region, scene.name, x, y);
      world.drawMinimap(hud.mapCanvas);
      root.dataset.scene = world.sceneId;
      root.dataset.x = x;
      root.dataset.y = y;
      root.dataset.moving = world.moving ? '1' : '0';
    }
    chatter += 1;
    if (chatter > 60 * 10 && !busy && !modalOpen()) {
      chatter = 0;
      const sceneId = world.sceneId;
      if (barkIdx % 2 === 0) {
        const pool = BANTER.filter((x) => (!x.scenes || x.scenes.includes(sceneId)) && followers(C()).includes(x.who));
        if (pool.length) {
          const line = pool[(barkIdx / 2) % pool.length | 0];
          world.say(`f-${line.who}`, line.text);
        }
      } else {
        const ids = Object.keys(SCENES[sceneId].npcs).filter((id) => BARKS[id] && npcPresent(C(), sceneId, id));
        if (ids.length) {
          const id = ids[barkIdx % ids.length];
          world.say(id, BARKS[id][(barkIdx >> 1) % BARKS[id].length]);
        }
      }
      barkIdx += 1;
    }
  }

  async function enter(sceneId, { at = null, fade = false } = {}) {
    mount();
    const c = C();
    root.classList.remove('hidden');
    hud.show(true);
    root.dataset.ready = '0';
    await world.enter(sceneId, {
      at: at ?? (c.world.scene === sceneId && c.world.x != null ? [c.world.x, c.world.y] : null),
      party: followers(c),
    });
    c.world = { scene: sceneId, x: world.position()[0], y: world.position()[1] };
    refresh();
    world.lock(false);
    world.start();
    audio.music(SCENES[sceneId].music);
    root.dataset.ready = '1';
    busy = false;
    if (fade) await wipe('open');
    if (travel) continueTravel();
  }

  function leave() {
    if (!mounted) return;
    remember();
    world.pause();
    root.classList.add('hidden');
  }
  function remember() {
    if (world?.sceneId) {
      const [x, y] = world.position();
      C().world = { scene: world.sceneId, x, y };
    }
  }

  async function run(fn) {
    if (busy) return;
    busy = true;
    travel = null;
    world.lock(true);
    world.stop();
    hud.hint(null);
    hud.flash(false);
    hintLive = false;
    try { await fn(); } finally {
      busy = false;
      if (!root.classList.contains('hidden')) { world.lock(false); refresh(); }
    }
  }

  async function npcMenu(a, options) {
    const line = BARKS[a.id]?.[(barkIdx += 1) % BARKS[a.id].length] ?? '';
    return choose({ title: a.name, sub: options.text ?? line, options: [...options.list, { key: 'bye', label: '告辞' }], id: 'npc-menu' });
  }

  function onActor(a) {
    if (busy || modalOpen()) return;
    const c = C();
    const sceneId = world.sceneId;
    const quest = mainQuest(c);
    if (a.bounty) return run(() => game.story.bountyFight());
    if (quest.scene === sceneId && quest.npc === a.id) return run(() => game.story.main());
    if (a.id === 'ganning') return run(() => ganningMenu(a));
    if (a.id === 'quartermaster') return run(async () => {
      const pick = await npcMenu(a, { list: [{ key: 'shop', label: '买丹药与兵甲' }] });
      if (pick === 'shop') await openShop(c, 'quartermaster', { onChange: () => { game.save(); refresh(); } });
    });
    const lines = BARKS[a.id];
    world.say(a.id, lines ? lines[(barkIdx += 1) % lines.length] : '……');
    return null;
  }

  async function ganningMenu(a) {
    const c = C();
    if (!bountyOpen(c)) {
      await say([{ who: 'ganning', text: c.stage === 'meet' ? '都督先与鲁子敬议事，巡练的事不忙。' : '江面不急。先办都督的正事。' }]);
      return;
    }
    if (c.bounty.state === 'hunt') { await say([{ who: 'ganning', text: BOUNTY.hunting }]); return; }
    const pick = await npcMenu(a, {
      text: c.bounty.total > 0 ? BOUNTY.report : BOUNTY.offer,
      list: [{ key: 'take', label: '接下江防巡练', note: '水寨外会标出曹军斥候船；点它开战，得历练、银两与军需。' }],
    });
    if (pick === 'take') {
      const demon = acceptBounty(c);
      if (demon) {
        audio.sfx('quest');
        toast(`巡练：${demon.name}已出现在水寨外`);
        game.log(`接下江防巡练：去${SCENES[demon.scene].name}击退${demon.name}。`, true);
      }
    }
    game.save();
  }

  async function onPortal(p) {
    if (busy || modalOpen()) return;
    const locked = portalLocked(C(), p.to);
    if (locked) { world.say('hero', locked); travel = null; return; }
    const keep = travel;
    busy = true;
    world.lock(true);
    audio.sfx('portal');
    const from = world.sceneId;
    await wipe('close');
    travel = keep;
    await enter(p.to, { at: SCENES[p.to].arrivals[from] ?? SCENES[p.to].spawn, fade: true });
    game.log(`来到${SCENES[p.to].region} · ${SCENES[p.to].name}。`);
    game.save();
  }

  function onSpot(s) {
    if (busy || modalOpen()) return null;
    return run(async () => {
      const c = C();
      const def = LANDMARKS[s.id];
      if (c.explored[s.id]) { await say([{ who: null, text: def.revisit }]); return; }
      await say([{ who: null, text: def.intro }]);
      const pick = await choose({
        title: def.title,
        options: [...def.options.map((o) => ({ key: o.key, label: o.label })), { key: 'later', label: '先不动它' }],
        id: 'landmark',
      });
      if (pick === 'later') return;
      const done = explore(c, world.sceneId, s.id, pick);
      if (!done) return;
      audio.sfx(Object.keys(done.reward).length ? 'coin' : 'quest');
      await say([{ who: null, text: done.result }]);
      game.log(`见闻：${def.title}。`, true);
      game.save();
    });
  }

  function track(q) {
    if (busy || modalOpen() || !q.scene) return;
    travel = { scene: q.scene, npc: q.npc };
    audio.sfx('click');
    continueTravel();
  }

  function continueTravel() {
    if (!travel || busy) return;
    const here = world.sceneId;
    manualGuard = true;
    if (travel.scene !== here) {
      const via = portalToward(here, travel.scene);
      const p = SCENES[here].portals[via];
      if (!p) { travel = null; manualGuard = false; return; }
      const locked = portalLocked(C(), p.to);
      if (locked) { world.say('hero', locked); travel = null; manualGuard = false; return; }
      world.approach(p.at[0], p.at[1], () => onPortal({ to: p.to, x: p.at[0], y: p.at[1] }), 40);
    } else {
      const a = travel.npc ? world.actor(travel.npc) : null;
      travel = null;
      if (a) world.chase(a, () => onActor(a));
    }
    manualGuard = false;
  }

  function openIcon(key) {
    if (busy || modalOpen()) return;
    const c = C();
    const onChange = () => { game.save(); refresh(); };
    world.lock(true);
    const p = key === 'hero' ? openMembers(c, { onChange })
      : key === 'pet' ? openMembers(c, { pets: true, onChange })
        : key === 'bag' ? openBag(c, { onChange })
          : key === 'quest' ? openQuests(c, world.sceneId, { onTrack: (q) => setTimeout(() => track(q), 0) })
            : key === 'formation' ? openFormation(c, { onChange })
              : openSettings({
                inGame: true,
                onSave: () => { remember(); game.save(); },
                onTitle: () => { remember(); game.save(); game.toTitle(); },
                onApply: () => game.applySettings(),
              });
    p.then(() => { if (!busy) world.lock(false); refresh(); });
  }

  return {
    enter, leave, refresh, run, track, remember,
    get sceneId() { return world?.sceneId ?? null; },
    get busy() { return busy; },
    say: (id, text) => world?.say(id, text),
    log: (text, sys) => hud?.log(text, sys),
    firstMinute() {
      hintLive = true;
      hud.hint('点地面行走。头顶有「!」的人推动主线；点鲁肃，或点右侧任务可自动寻路。');
      hud.flash(true);
    },
    probe: () => ({ ...(world?.probe() ?? {}), busy, hidden: root.classList.contains('hidden') }),
    destroy() { world?.destroy(); hud?.destroy(); root.remove(); },
  };
}
