const STORAGE_KEY = "khataMazanka.strategy.v2";

const icons = {
  clay: "icon-clay",
  flowers: "icon-flowers",
  supplies: "icon-supplies",
  community: "icon-community",
};

const levels = [
  {
    id: "small",
    name: "Мала мазанка",
    description: "Навчися тримати баланс між глиною, запасами й допомогою сусідів.",
    maxDays: 7,
    start: { heart: 12, supplies: 9, community: 18, fatigue: 0, rareDecor: 0 },
    target: { heart: 100, community: 55, rareDecor: 0 },
    unlocks: ["clay", "foundation", "whitewash", "roof", "flowers", "invite", "rest"],
  },
  {
    id: "family",
    name: "Велика родинна хата",
    description: "Більше кімнат, більше роботи: без орнаментів і громади хата не оживе.",
    maxDays: 10,
    start: { heart: 6, supplies: 12, community: 12, fatigue: 10, rareDecor: 0 },
    target: { heart: 100, community: 70, rareDecor: 0 },
    unlocks: ["clay", "foundation", "whitewash", "roof", "flowers", "ornaments", "invite", "rest"],
  },
  {
    id: "museum",
    name: "Музейна окраса села",
    description: "Складний проєкт на 14 днів: потрібні рідкісні оздоби, памʼять і багато взаємодопомоги.",
    maxDays: 14,
    start: { heart: 4, supplies: 14, community: 15, fatigue: 12, rareDecor: 0 },
    target: { heart: 100, community: 85, rareDecor: 2 },
    unlocks: ["clay", "foundation", "whitewash", "roof", "flowers", "ornaments", "collectDecor", "invite", "rest"],
  },
];

const neighbors = [
  {
    id: "vasyl",
    name: "Пан Василь",
    role: "майстер стріхи",
    cost: 2,
    community: 22,
    heart: 7,
    fatigue: -8,
    story: "Стріха любить терпіння: клади сніп до снопа, і дощ стане лише музикою над хатою.",
  },
  {
    id: "marusia",
    name: "Маруся",
    role: "знає давні орнаменти",
    cost: 2,
    community: 18,
    heart: 10,
    rareDecor: 1,
    story: "Кожна квітка на вікні — це не прикраса, а побажання щастя тим, хто входить до оселі.",
  },
  {
    id: "ostap",
    name: "Дід Остап",
    role: "памʼятає музейні історії",
    cost: 3,
    community: 28,
    heart: 5,
    rareDecor: 1,
    story: "Не поспішай закривати тріщини: спершу послухай, що вони розповідають про стару хату.",
  },
];

const dailyEvents = [
  {
    id: "clear",
    title: "Тихий ясний ранок",
    text: "Сонце лагідно сушить глину. Сьогодні всі роботи йдуть рівно.",
  },
  {
    id: "rain",
    title: "Дощ над городами",
    text: "Стіни сохнуть повільніше: приріст серця від будівельних робіт трохи менший.",
    heartMultiplier: 0.82,
    fatigueDelta: 5,
  },
  {
    id: "fair",
    title: "Ярмарок у сусідньому селі",
    text: "Вдалося вигідно дістати вапно, солому й дошки: +3 запаси.",
    suppliesDelta: 3,
  },
  {
    id: "song",
    title: "Вечірня пісня громади",
    text: "Пісня збирає людей разом: приріст громади сьогодні сильніший.",
    communityMultiplier: 1.3,
  },
  {
    id: "traveler",
    title: "Мандрівний різьбяр",
    text: "Різьбяр залишив стару лиштву для майбутніх оздоб: +1 рідкісна оздоба.",
    rareDecorDelta: 1,
  },
];

const stateMachine = {
  playing: new Set(["playing", "rest-required", "victory", "failed"]),
  "rest-required": new Set(["playing", "victory", "failed"]),
  victory: new Set([]),
  failed: new Set([]),
};

function transitionMachine(targetState, nextMachineState) {
  const allowed = stateMachine[targetState.machine];
  if (!allowed?.has(nextMachineState)) {
    throw new Error(`Invalid state transition from ${targetState.machine} to ${nextMachineState}`);
  }
  targetState.machine = nextMachineState;
}

const actionCatalog = {
  clay: {
    label: "Замісити глину",
    icon: "clay",
    cost: { supplies: 0, fatigue: 14 },
    repeatable: true,
    tags: ["build"],
    apply(state) {
      state.supplies += state.levelIndex + 4;
      state.heart += 4;
      return "Глина з половою стала пружною. Запасів більше, а основа хати міцніша.";
    },
  },
  foundation: {
    label: "Укріпити підмурок",
    icon: "supplies",
    cost: { supplies: 3, fatigue: 16 },
    stageKey: "foundation",
    tags: ["build"],
    apply(state) {
      state.heart += 13;
      return "Підмурок вирівняно каменем і глиною — хата більше не просідає.";
    },
  },
  whitewash: {
    label: "Побілити стіни",
    icon: "clay",
    cost: { supplies: 4, fatigue: 18 },
    stageKey: "whitewash",
    tags: ["build"],
    apply(state) {
      state.heart += 16;
      return "Вапно лягло мʼяким шаром, і стіни засвітилися чистотою.";
    },
  },
  roof: {
    label: "Полагодити стріху",
    icon: "supplies",
    cost: { supplies: 5, fatigue: 22 },
    stageKey: "roof",
    tags: ["build"],
    apply(state) {
      state.heart += 19;
      return "Соломʼяна стріха стала щільною, теплою й готовою зустріти негоду.";
    },
  },
  flowers: {
    label: "Посадити квіти",
    icon: "flowers",
    cost: { supplies: 2, fatigue: 12 },
    stageKey: "flowers",
    tags: ["community"],
    apply(state) {
      state.heart += 10;
      state.community += 8;
      return "Мальви й соняхи підняли голови біля призьби, і двір став привітнішим.";
    },
  },
  ornaments: {
    label: "Розписати орнаменти",
    icon: "flowers",
    cost: { supplies: 4, fatigue: 20 },
    stageKey: "ornaments",
    tags: ["community"],
    apply(state) {
      state.heart += 20;
      state.community += 10;
      return "На вікнах зʼявилися рослинні орнаменти — тепер хата впізнавана здалеку.";
    },
  },
  collectDecor: {
    label: "Шукати рідкісні оздоби",
    icon: "flowers",
    cost: { supplies: 2, fatigue: 18 },
    repeatable: true,
    tags: ["community"],
    apply(state) {
      state.rareDecor += 1;
      state.community += 5;
      return "У старій скрині знайшлася лиштва й барвники для музейної окраси.";
    },
  },
  invite: {
    label: "Запросити сусіда",
    icon: "community",
    cost: { supplies: 2, fatigue: 8 },
    repeatable: true,
    tags: ["community"],
    apply(state) {
      return inviteNeighbor(neighbors[0].id, state);
    },
  },
  rest: {
    label: "Відпочити",
    icon: "community",
    cost: { supplies: 0, fatigue: 0 },
    repeatable: true,
    alwaysEnabled: true,
    apply(state) {
      state.fatigue -= 48;
      state.community += 2;
      return "Господарі перепочили, випили узвару й повернули сили для наступного дня.";
    },
  },
};

let state = loadState();

const elements = {
  levelSelect: document.querySelector("#level-select"),
  newLevel: document.querySelector("#new-level"),
  day: document.querySelector("#day"),
  maxDays: document.querySelector("#max-days"),
  heart: document.querySelector("#heart"),
  heartMeter: document.querySelector("#heart-meter"),
  supplies: document.querySelector("#supplies"),
  community: document.querySelector("#community"),
  fatigue: document.querySelector("#fatigue"),
  fatigueMeter: document.querySelector("#fatigue-meter"),
  rareDecor: document.querySelector("#rare-decor"),
  dailyEvent: document.querySelector("#daily-event"),
  house: document.querySelector("#house"),
  wall: document.querySelector("#wall"),
  roof: document.querySelector("#roof"),
  garden: document.querySelector("#garden"),
  actions: document.querySelector("#actions"),
  levelTitle: document.querySelector("#level-title"),
  levelDescription: document.querySelector("#level-description"),
  requirements: document.querySelector("#requirements"),
  neighborList: document.querySelector("#neighbor-list"),
  message: document.querySelector("#message"),
  restart: document.querySelector("#restart"),
  nextLevel: document.querySelector("#next-level"),
  dialogue: document.querySelector("#dialogue"),
  dialogueName: document.querySelector("#dialogue-name"),
  dialogueText: document.querySelector("#dialogue-text"),
  closeDialogue: document.querySelector("#close-dialogue"),
};

function createLevelState(levelIndex, unlockedLevel = getUnlockedLevel()) {
  const level = levels[levelIndex];
  const newState = {
    version: 2,
    machine: "playing",
    levelIndex,
    unlockedLevel: Math.max(unlockedLevel, levelIndex),
    day: 1,
    heart: level.start.heart,
    supplies: level.start.supplies,
    community: level.start.community,
    fatigue: level.start.fatigue,
    rareDecor: level.start.rareDecor,
    completed: [],
    currentEvent: "clear",
    lastChanged: null,
    log: "",
  };
  startDay(newState, "Бабуся радить: міцна хата починається з підмурку, а жива — з громади.");
  return newState;
}

function getUnlockedLevel() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Number.isInteger(saved?.unlockedLevel) ? saved.unlockedLevel : 0;
  } catch {
    return 0;
  }
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.version === 2 && levels[saved.levelIndex]) {
      return saved;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return createLevelState(0, 0);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function iconMarkup(iconName) {
  return `<svg class="action-icon" aria-hidden="true"><use href="#${icons[iconName]}" /></svg>`;
}

function activeLevel() {
  return levels[state.levelIndex];
}

function activeEvent() {
  return dailyEvents.find((event) => event.id === state.currentEvent) || dailyEvents[0];
}

function randomEventForLevel(targetState = state) {
  const available = targetState.levelIndex < 2 ? dailyEvents.filter((event) => event.id !== "traveler") : dailyEvents;
  return available[Math.floor(Math.random() * available.length)];
}

function startDay(targetState, prefix = "") {
  const event = randomEventForLevel(targetState);
  targetState.currentEvent = event.id;
  if (event.suppliesDelta) targetState.supplies += event.suppliesDelta;
  if (event.rareDecorDelta) targetState.rareDecor += event.rareDecorDelta;
  if (event.fatigueDelta) targetState.fatigue += event.fatigueDelta;
  targetState.log = [prefix, `Подія дня: ${event.title}. ${event.text}`].filter(Boolean).join(" ");
  clamp(targetState);
}

function clamp(targetState = state) {
  targetState.heart = Math.min(100, Math.max(0, Math.round(targetState.heart)));
  targetState.community = Math.min(100, Math.max(0, Math.round(targetState.community)));
  targetState.fatigue = Math.min(100, Math.max(0, Math.round(targetState.fatigue)));
  targetState.supplies = Math.max(0, Math.round(targetState.supplies));
  targetState.rareDecor = Math.max(0, Math.round(targetState.rareDecor));
}

function adjustedHeartGain(amount, tags = []) {
  const event = activeEvent();
  return tags.includes("build") && event.heartMultiplier ? Math.ceil(amount * event.heartMultiplier) : amount;
}

function adjustedCommunityGain(amount, tags = []) {
  const event = activeEvent();
  return tags.includes("community") && event.communityMultiplier ? Math.ceil(amount * event.communityMultiplier) : amount;
}

function applyCosts(action) {
  const cost = action.cost || {};
  state.supplies -= cost.supplies || 0;
  state.rareDecor -= cost.rareDecor || 0;
  state.fatigue += cost.fatigue || 0;
}

function canAfford(action) {
  const cost = action.cost || {};
  return state.supplies >= (cost.supplies || 0) && state.rareDecor >= (cost.rareDecor || 0);
}

function isUnlocked(actionId) {
  return activeLevel().unlocks.includes(actionId);
}

function canRunAction(actionId) {
  const action = actionCatalog[actionId];
  if (!action || !isUnlocked(actionId)) return false;
  if (state.machine === "victory" || state.machine === "failed") return false;
  if (state.machine === "rest-required" && actionId !== "rest") return false;
  if (!action.repeatable && state.completed.includes(action.stageKey)) return false;
  return canAfford(action);
}

function withTrackedGains(action, work) {
  const before = { heart: state.heart, community: state.community };
  const message = work();
  state.heart = before.heart + adjustedHeartGain(state.heart - before.heart, action.tags);
  state.community = before.community + adjustedCommunityGain(state.community - before.community, action.tags);
  return message;
}

function runAction(actionId) {
  const action = actionCatalog[actionId];
  if (!canRunAction(actionId)) return;

  playClickSound();
  applyCosts(action);
  const message = withTrackedGains(action, () => action.apply(state));
  if (action.stageKey && !state.completed.includes(action.stageKey)) {
    state.completed.push(action.stageKey);
  }
  state.lastChanged = action.icon === "community" ? "community" : action.icon === "flowers" ? "decor" : "supplies";
  completeTurn(message);
}

function inviteNeighbor(neighborId, targetState = state) {
  const neighbor = neighbors.find((candidate) => candidate.id === neighborId) || neighbors[0];
  targetState.community += adjustedCommunityGain(neighbor.community, ["community"]);
  targetState.heart += neighbor.heart;
  targetState.fatigue += neighbor.fatigue || 0;
  targetState.rareDecor += neighbor.rareDecor || 0;
  showDialogue(neighbor);
  return `${neighbor.name} (${neighbor.role}) прийшов на толоку й поділився порадою. Громада відчутно зросла.`;
}

function runNeighbor(neighborId) {
  const neighbor = neighbors.find((candidate) => candidate.id === neighborId);
  if (!neighbor || state.machine === "victory" || state.machine === "failed" || state.machine === "rest-required") return;
  if (state.supplies < neighbor.cost) return;

  playClickSound();
  state.supplies -= neighbor.cost;
  state.fatigue += 8;
  state.lastChanged = "community";
  completeTurn(inviteNeighbor(neighbor.id));
}

function completeTurn(message) {
  clamp();
  const level = activeLevel();
  const victory = state.heart >= level.target.heart && state.community >= level.target.community && state.rareDecor >= level.target.rareDecor;

  if (victory) {
    transitionMachine(state, "victory");
    state.unlockedLevel = Math.max(state.unlockedLevel, Math.min(state.levelIndex + 1, levels.length - 1));
    state.log = `${message} Перемога! ${level.name} стала справжнім оберегом.`;
    playVictoryTune();
    saveState();
    render(true);
    return;
  }

  if (state.day >= level.maxDays) {
    transitionMachine(state, "failed");
    state.log = `${message} Настав вечір ${level.maxDays}-го дня. Хата ще потребує роботи — спробуй іншу стратегію.`;
    saveState();
    render();
    return;
  }

  state.day += 1;
  if (state.fatigue >= 100) {
    transitionMachine(state, "rest-required");
    state.log = `${message} Втома сягнула межі: наступний хід треба відпочити.`;
  } else {
    transitionMachine(state, "playing");
    startDay(state, message);
  }

  clamp();
  saveState();
  render(true);
}

function restTurn() {
  if (state.machine !== "rest-required" && state.machine !== "playing") return;
  runAction("rest");
}

function houseStage() {
  if (state.heart >= 82) return "stage-4";
  if (state.heart >= 58) return "stage-3";
  if (state.heart >= 32) return "stage-2";
  return "stage-1";
}

function render(shine = false) {
  const level = activeLevel();
  renderLevelOptions();
  elements.day.textContent = state.day;
  elements.maxDays.textContent = level.maxDays;
  elements.heart.textContent = state.heart;
  elements.heartMeter.value = state.heart;
  elements.supplies.textContent = state.supplies;
  elements.community.textContent = state.community;
  elements.fatigue.textContent = state.fatigue;
  elements.fatigueMeter.value = state.fatigue;
  elements.rareDecor.textContent = state.rareDecor;
  elements.dailyEvent.innerHTML = `<strong>${activeEvent().title}</strong><span>${activeEvent().text}</span>`;
  elements.levelTitle.textContent = level.name;
  elements.levelDescription.textContent = level.description;
  elements.message.textContent = state.log;

  document.querySelectorAll(".stat").forEach((stat) => stat.classList.remove("pulse"));
  if (state.lastChanged) {
    document.querySelector(`[data-stat="${state.lastChanged}"]`)?.classList.add("pulse");
  }

  elements.house.className = `house ${houseStage()} ${shine ? "shine" : ""}`;
  elements.house.classList.toggle("is-whitewashed", state.completed.includes("whitewash"));
  elements.house.classList.toggle("is-roofed", state.completed.includes("roof"));
  elements.house.classList.toggle("is-ornamented", state.completed.includes("ornaments"));
  elements.garden.classList.toggle("bloom", state.completed.includes("flowers"));

  renderRequirements(level);
  renderActions();
  renderNeighbors();
  elements.nextLevel.hidden = !(state.machine === "victory" && state.levelIndex < levels.length - 1);
  saveState();
}

function renderLevelOptions() {
  elements.levelSelect.innerHTML = levels
    .map((level, index) => `<option value="${index}" ${index === state.levelIndex ? "selected" : ""} ${index > state.unlockedLevel ? "disabled" : ""}>${index + 1}. ${level.name}${index > state.unlockedLevel ? " — замкнено" : ""}</option>`)
    .join("");
}

function renderRequirements(level) {
  elements.requirements.innerHTML = `
    <li>Серце хати: ${state.heart}/${level.target.heart}%</li>
    <li>Громада: ${state.community}/${level.target.community}%</li>
    <li>Рідкісні оздоби: ${state.rareDecor}/${level.target.rareDecor}</li>
    <li>Доступні дії: ${level.unlocks.map((id) => actionCatalog[id].label).join(", ")}</li>
  `;
}

function renderActions() {
  elements.actions.innerHTML = activeLevel().unlocks
    .map((actionId) => {
      const action = actionCatalog[actionId];
      const cost = action.cost || {};
      const costText = [
        cost.supplies ? `${cost.supplies} запасів` : null,
        cost.rareDecor ? `${cost.rareDecor} оздоба` : null,
        cost.fatigue ? `+${cost.fatigue}% втоми` : actionId === "rest" ? "-48% втоми" : null,
      ].filter(Boolean).join(" · ") || "безкоштовно";
      const locked = state.machine === "rest-required" && actionId !== "rest" ? "Потрібен відпочинок" : costText;
      return `<button class="action-card" data-action="${actionId}" ${canRunAction(actionId) ? "" : "disabled"}>
        ${iconMarkup(action.icon)}
        <span><strong>${action.label}</strong><small>${locked}</small></span>
      </button>`;
    })
    .join("");

  elements.actions.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.action === "rest") restTurn();
      else runAction(button.dataset.action);
    });
  });
}

function renderNeighbors() {
  elements.neighborList.innerHTML = neighbors
    .map((neighbor) => `<button class="neighbor" data-neighbor="${neighbor.id}" ${state.supplies >= neighbor.cost && state.machine === "playing" ? "" : "disabled"}>
      ${iconMarkup("community")}
      <span><strong>${neighbor.name}</strong><small>${neighbor.role} · ${neighbor.cost} запасів</small></span>
    </button>`)
    .join("");

  elements.neighborList.querySelectorAll("[data-neighbor]").forEach((button) => {
    button.addEventListener("click", () => runNeighbor(button.dataset.neighbor));
  });
}

function showDialogue(neighbor) {
  elements.dialogueName.textContent = neighbor.name;
  elements.dialogueText.textContent = neighbor.story;
  elements.dialogue.hidden = false;
}

function playClickSound() {
  playTone(220, 0.045, "triangle");
}

function playVictoryTune() {
  [330, 392, 440, 523, 440, 523].forEach((note, index) => {
    setTimeout(() => playTone(note, 0.12, "sine"), index * 130);
  });
}

function playTone(frequency, duration, type) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = 0.035;
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  oscillator.stop(context.currentTime + duration);
}

elements.house.addEventListener("animationend", () => elements.house.classList.remove("shine"));
elements.closeDialogue.addEventListener("click", () => { elements.dialogue.hidden = true; });
elements.dialogue.addEventListener("click", (event) => {
  if (event.target === elements.dialogue) elements.dialogue.hidden = true;
});
elements.restart.addEventListener("click", () => {
  const unlocked = state.unlockedLevel;
  localStorage.removeItem(STORAGE_KEY);
  state = createLevelState(0, unlocked);
  render();
});
elements.newLevel.addEventListener("click", () => {
  const nextIndex = Number(elements.levelSelect.value);
  if (nextIndex <= state.unlockedLevel) {
    state = createLevelState(nextIndex, state.unlockedLevel);
    render();
  }
});
elements.nextLevel.addEventListener("click", () => {
  const nextIndex = Math.min(state.levelIndex + 1, levels.length - 1);
  state = createLevelState(nextIndex, state.unlockedLevel);
  render();
});

render();
