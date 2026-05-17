const STORAGE = "khata-mazanka-clean-v1";
const icon = { clay: "i-clay", flowers: "i-flower", supplies: "i-supplies", community: "i-community" };

const levels = [
  { name: "Мала мазанка", days: 7, start: { heart: 10, supplies: 9, community: 18, fatigue: 0, decor: 0 }, goal: { heart: 100, community: 55, decor: 0 }, unlocks: ["clay", "foundation", "whitewash", "roof", "flowers", "invite", "rest"], text: "Базова хата для навчання балансу між матеріалами, втомою та толокою." },
  { name: "Велика родинна хата", days: 10, start: { heart: 6, supplies: 12, community: 12, fatigue: 10, decor: 0 }, goal: { heart: 100, community: 70, decor: 0 }, unlocks: ["clay", "foundation", "whitewash", "roof", "flowers", "ornaments", "invite", "rest"], text: "Більший обсяг робіт. Відкривається розпис орнаментів." },
  { name: "Музейна окраса села", days: 14, start: { heart: 4, supplies: 14, community: 15, fatigue: 12, decor: 0 }, goal: { heart: 100, community: 85, decor: 2 }, unlocks: ["clay", "foundation", "whitewash", "roof", "flowers", "ornaments", "collectDecor", "invite", "rest"], text: "Найскладніший рівень: потрібні рідкісні оздоби й сильна громада." },
];

const neighbors = [
  { id: "vasyl", name: "Пан Василь", role: "майстер стріхи", cost: 2, community: 22, heart: 7, fatigue: -8, decor: 0, line: "Стріха любить терпіння: сніп до снопа — і дощ стане музикою." },
  { id: "marusia", name: "Маруся", role: "знає давні орнаменти", cost: 2, community: 18, heart: 10, fatigue: 4, decor: 1, line: "Квітка біля вікна — це побажання щастя кожному, хто входить." },
  { id: "ostap", name: "Дід Остап", role: "хранитель історій", cost: 3, community: 28, heart: 5, fatigue: 2, decor: 1, line: "Старі тріщини спершу треба вислухати, а вже потім замазувати." },
];

const events = [
  { id: "sun", title: "Ясний ранок", text: "Сонце добре сушить глину. День без штрафів." },
  { id: "rain", title: "Дощ над городами", text: "Будівельний прогрес сьогодні трохи слабший, а втома зростає.", heartMod: 0.82, fatigue: 5 },
  { id: "fair", title: "Ярмарок", text: "На ярмарку вдалося дістати вапно й солому: +3 запаси.", supplies: 3 },
  { id: "song", title: "Вечірня пісня", text: "Громада охочіше долучається до толоки.", communityMod: 1.3 },
  { id: "carver", title: "Мандрівний різьбяр", text: "Різьбяр залишив лиштву: +1 оздоба.", decor: 1, minLevel: 2 },
];

const machine = {
  playing: new Set(["playing", "rest", "victory", "failed"]),
  rest: new Set(["playing", "victory", "failed"]),
  victory: new Set([]),
  failed: new Set([]),
};

const actions = {
  clay: { label: "Замісити глину", icon: "clay", cost: { supplies: 0, fatigue: 14 }, repeat: true, tags: ["build"], run: (s) => { s.supplies += 4 + s.level; s.heart += 4; return "Глина з половою стала пружною, а запасів побільшало."; } },
  foundation: { label: "Укріпити підмурок", icon: "supplies", cost: { supplies: 3, fatigue: 16 }, stage: "foundation", tags: ["build"], run: (s) => { s.heart += 13; return "Підмурок вирівняно каменем і глиною."; } },
  whitewash: { label: "Побілити стіни", icon: "clay", cost: { supplies: 4, fatigue: 18 }, stage: "whitewash", tags: ["build"], run: (s) => { s.heart += 16; return "Стіни засяяли чистою побілкою."; } },
  roof: { label: "Полагодити стріху", icon: "supplies", cost: { supplies: 5, fatigue: 22 }, stage: "roof", tags: ["build"], run: (s) => { s.heart += 19; return "Стріха стала щільною й теплою."; } },
  flowers: { label: "Посадити мальви", icon: "flowers", cost: { supplies: 2, fatigue: 12 }, stage: "flowers", tags: ["community"], run: (s) => { s.heart += 10; s.community += 8; return "Мальви й соняхи оживили двір."; } },
  ornaments: { label: "Розписати орнаменти", icon: "flowers", cost: { supplies: 4, fatigue: 20 }, stage: "ornaments", tags: ["community"], run: (s) => { s.heart += 20; s.community += 10; return "Вікна отримали барвисті рослинні орнаменти."; } },
  collectDecor: { label: "Шукати рідкісні оздоби", icon: "flowers", cost: { supplies: 2, fatigue: 18 }, repeat: true, tags: ["community"], run: (s) => { s.decor += 1; s.community += 5; return "У скрині знайшлася старовинна лиштва."; } },
  invite: { label: "Запросити сусіда", icon: "community", cost: { supplies: 2, fatigue: 8 }, repeat: true, tags: ["community"], run: (s) => invite(neighbors[0], s) },
  rest: { label: "Відпочити", icon: "community", cost: { supplies: 0, fatigue: 0 }, repeat: true, run: (s) => { s.fatigue -= 48; s.community += 2; return "Господарі випили узвару й повернули сили."; } },
};

let state = load();
const $ = (id) => document.getElementById(id);
const el = {
  levelSelect: $("levelSelect"), startLevel: $("startLevel"), day: $("day"), daysTotal: $("daysTotal"), heart: $("heart"), heartMeter: $("heartMeter"), supplies: $("supplies"), community: $("community"), fatigue: $("fatigue"), fatigueMeter: $("fatigueMeter"), decor: $("decor"), eventBox: $("eventBox"), house: $("house"), flowers: $("flowers"), levelName: $("levelName"), levelText: $("levelText"), goals: $("goals"), neighbors: $("neighbors"), actions: $("actions"), log: $("log"), nextLevel: $("nextLevel"), reset: $("reset"), dialog: $("dialog"), closeDialog: $("closeDialog"), dialogName: $("dialogName"), dialogText: $("dialogText"),
};

function fresh(level = 0, unlocked = unlockedLevel()) {
  const base = levels[level].start;
  const s = { version: 1, status: "playing", level, unlocked: Math.max(unlocked, level), day: 1, heart: base.heart, supplies: base.supplies, community: base.community, fatigue: base.fatigue, decor: base.decor, done: [], event: "sun", pulse: null, log: "" };
  startDay(s, "Нова хата чекає на майстрів і добрих сусідів.");
  return s;
}
function unlockedLevel() { try { return JSON.parse(localStorage.getItem(STORAGE))?.unlocked ?? 0; } catch { return 0; } }
function load() { try { const saved = JSON.parse(localStorage.getItem(STORAGE)); if (saved?.version === 1 && levels[saved.level]) return saved; } catch { localStorage.removeItem(STORAGE); } return fresh(); }
function save() { localStorage.setItem(STORAGE, JSON.stringify(state)); }
function level() { return levels[state.level]; }
function currentEvent() { return events.find((event) => event.id === state.event) ?? events[0]; }
function transition(to) { if (!machine[state.status]?.has(to)) throw new Error(`Invalid transition ${state.status} -> ${to}`); state.status = to; }
function clamp(s = state) { s.heart = Math.min(100, Math.max(0, Math.round(s.heart))); s.community = Math.min(100, Math.max(0, Math.round(s.community))); s.fatigue = Math.min(100, Math.max(0, Math.round(s.fatigue))); s.supplies = Math.max(0, Math.round(s.supplies)); s.decor = Math.max(0, Math.round(s.decor)); }
function pickEvent(s = state) { const pool = events.filter((event) => (event.minLevel ?? 0) <= s.level); return pool[Math.floor(Math.random() * pool.length)]; }
function startDay(s, prefix = "") { const event = pickEvent(s); s.event = event.id; if (event.supplies) s.supplies += event.supplies; if (event.decor) s.decor += event.decor; if (event.fatigue) s.fatigue += event.fatigue; s.log = [prefix, `Подія дня: ${event.title}. ${event.text}`].filter(Boolean).join(" "); clamp(s); }
function afford(action) { return state.supplies >= (action.cost.supplies || 0) && state.decor >= (action.cost.decor || 0); }
function available(id) { const action = actions[id]; if (!action || !level().unlocks.includes(id)) return false; if (["victory", "failed"].includes(state.status)) return false; if (state.status === "rest" && id !== "rest") return false; if (!action.repeat && action.stage && state.done.includes(action.stage)) return false; return afford(action); }
function pay(action) { state.supplies -= action.cost.supplies || 0; state.decor -= action.cost.decor || 0; state.fatigue += action.cost.fatigue || 0; }
function modded(before, action) { const event = currentEvent(); const heartGain = state.heart - before.heart; const communityGain = state.community - before.community; state.heart = before.heart + (action.tags?.includes("build") && event.heartMod ? Math.ceil(heartGain * event.heartMod) : heartGain); state.community = before.community + (action.tags?.includes("community") && event.communityMod ? Math.ceil(communityGain * event.communityMod) : communityGain); }
function run(id) { const action = actions[id]; if (!available(id)) return; sound(220, 0.045, "triangle"); pay(action); const before = { heart: state.heart, community: state.community }; const message = action.run(state); modded(before, action); if (action.stage && !state.done.includes(action.stage)) state.done.push(action.stage); state.pulse = action.icon === "community" ? "community" : action.icon === "flowers" ? "decor" : "supplies"; endTurn(message); }
function invite(n, s = state) { s.community += n.community; s.heart += n.heart; s.fatigue += n.fatigue; s.decor += n.decor; showDialog(n); return `${n.name} (${n.role}) прийшов на толоку й підсилив громаду.`; }
function inviteNeighbor(id) { const n = neighbors.find((item) => item.id === id); if (!n || state.status !== "playing" || state.supplies < n.cost) return; sound(250, 0.05, "triangle"); state.supplies -= n.cost; state.fatigue += 8; state.pulse = "community"; endTurn(invite(n)); }
function won() { const goal = level().goal; return state.heart >= goal.heart && state.community >= goal.community && state.decor >= goal.decor; }
function endTurn(message) { clamp(); if (won()) { transition("victory"); state.unlocked = Math.max(state.unlocked, Math.min(state.level + 1, levels.length - 1)); state.log = `${message} Перемога! ${level().name} стала оберегом села.`; victoryTune(); save(); render(true); return; } if (state.day >= level().days) { transition("failed"); state.log = `${message} Вечір ${level().days}-го дня настав зарано — спробуй іншу стратегію.`; save(); render(); return; } state.day += 1; if (state.fatigue >= 100) { transition("rest"); state.log = `${message} Втома сягнула 100%: наступний хід треба відпочити.`; } else { transition("playing"); startDay(state, message); } clamp(); save(); render(true); }
function stage() { if (state.heart >= 82) return "stage-4"; if (state.heart >= 58) return "stage-3"; if (state.heart >= 32) return "stage-2"; return "stage-1"; }
function svg(name) { return `<svg aria-hidden="true"><use href="#${icon[name]}"/></svg>`; }
function render(shine = false) {
  el.levelSelect.innerHTML = levels.map((l, i) => `<option value="${i}" ${i === state.level ? "selected" : ""} ${i > state.unlocked ? "disabled" : ""}>${i + 1}. ${l.name}${i > state.unlocked ? " — замкнено" : ""}</option>`).join("");
  el.day.textContent = state.day; el.daysTotal.textContent = level().days; el.heart.textContent = state.heart; el.heartMeter.value = state.heart; el.supplies.textContent = state.supplies; el.community.textContent = state.community; el.fatigue.textContent = state.fatigue; el.fatigueMeter.value = state.fatigue; el.decor.textContent = state.decor;
  const event = currentEvent(); el.eventBox.innerHTML = `<strong>${event.title}</strong><span>${event.text}</span>`; el.levelName.textContent = level().name; el.levelText.textContent = level().text; el.goals.innerHTML = `<li>Серце: ${state.heart}/${level().goal.heart}%</li><li>Громада: ${state.community}/${level().goal.community}%</li><li>Оздоби: ${state.decor}/${level().goal.decor}</li>`; el.log.textContent = state.log;
  document.querySelectorAll(".stat").forEach((stat) => stat.classList.toggle("pulse", stat.dataset.pulse === state.pulse));
  el.house.className = `house ${stage()} ${shine ? "shine" : ""} ${state.done.includes("whitewash") ? "whitewashed" : ""} ${state.done.includes("roof") ? "roofed" : ""} ${state.done.includes("ornaments") ? "ornamented" : ""}`; el.flowers.classList.toggle("bloom", state.done.includes("flowers"));
  el.actions.innerHTML = level().unlocks.map((id) => { const a = actions[id]; const c = a.cost; const cost = [c.supplies ? `${c.supplies} запасів` : null, c.decor ? `${c.decor} оздоба` : null, c.fatigue ? `+${c.fatigue}% втоми` : id === "rest" ? "-48% втоми" : null].filter(Boolean).join(" · ") || "безкоштовно"; return `<button class="action" data-action="${id}" ${available(id) ? "" : "disabled"}>${svg(a.icon)}<span><strong>${a.label}</strong><small>${state.status === "rest" && id !== "rest" ? "Потрібен відпочинок" : cost}</small></span></button>`; }).join("");
  el.actions.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => run(button.dataset.action)));
  el.neighbors.innerHTML = neighbors.map((n) => `<button data-neighbor="${n.id}" ${state.status === "playing" && state.supplies >= n.cost ? "" : "disabled"}>${svg("community")}<span><strong>${n.name}</strong><small>${n.role} · ${n.cost} запасів</small></span></button>`).join("");
  el.neighbors.querySelectorAll("[data-neighbor]").forEach((button) => button.addEventListener("click", () => inviteNeighbor(button.dataset.neighbor)));
  el.nextLevel.hidden = !(state.status === "victory" && state.level < levels.length - 1); save();
}
function showDialog(n) { el.dialogName.textContent = n.name; el.dialogText.textContent = n.line; el.dialog.hidden = false; }
function sound(freq, duration, type) { const AudioContext = window.AudioContext || window.webkitAudioContext; if (!AudioContext) return; const context = new AudioContext(); const osc = context.createOscillator(); const gain = context.createGain(); osc.type = type; osc.frequency.value = freq; gain.gain.value = 0.035; osc.connect(gain).connect(context.destination); osc.start(); gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration); osc.stop(context.currentTime + duration); }
function victoryTune() { [330, 392, 440, 523, 440, 523].forEach((note, i) => setTimeout(() => sound(note, 0.12, "sine"), i * 130)); }
el.house.addEventListener("animationend", () => el.house.classList.remove("shine")); el.closeDialog.addEventListener("click", () => { el.dialog.hidden = true; }); el.dialog.addEventListener("click", (e) => { if (e.target === el.dialog) el.dialog.hidden = true; }); el.startLevel.addEventListener("click", () => { const idx = Number(el.levelSelect.value); if (idx <= state.unlocked) { state = fresh(idx, state.unlocked); render(); } }); el.nextLevel.addEventListener("click", () => { state = fresh(Math.min(state.level + 1, levels.length - 1), state.unlocked); render(); }); el.reset.addEventListener("click", () => { localStorage.removeItem(STORAGE); state = fresh(0, 0); render(); });
render();
