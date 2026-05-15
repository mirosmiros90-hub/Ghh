const STORAGE_KEYS = {
  highScore: "khataMazanka.highScore",
  currentLevel: "khataMazanka.currentLevel",
};

const levels = [
  {
    id: 1,
    name: "Молода родинна хата",
    label: "Рівень 1 · Легко",
    description: "Щедрі сусіди, більше стартових запасів і мʼякша втома для першої оселі.",
    start: { clay: 10, supplies: 14, community: 18, progress: 0, fatigue: 0 },
    efficiencyPenalty: 0.36,
    target: 100,
  },
  {
    id: 2,
    name: "Садиба сільського отамана",
    label: "Рівень 2 · Середньо",
    description: "Більша хата потребує точнішого плану, а громада очікує гідного подвірʼя.",
    start: { clay: 8, supplies: 11, community: 12, progress: 0, fatigue: 6 },
    efficiencyPenalty: 0.46,
    target: 100,
  },
  {
    id: 3,
    name: "Музей давньої спадщини",
    label: "Рівень 3 · Важко",
    description: "Суворий нагляд за автентичністю: ресурсів мало, а кожен день на вагу золота.",
    start: { clay: 6, supplies: 9, community: 8, progress: 0, fatigue: 10 },
    efficiencyPenalty: 0.56,
    target: 100,
  },
];

const visitors = [
  {
    name: "Дід Василь",
    text: "Стукає киями по стіні й підказує, де додати соломи до глини.",
    effect(state) {
      state.community += 2;
      return "Дід Василь дав технічну пораду: робота сьогодні трохи рівніша. +2 громади.";
    },
  },
  {
    name: "Сусідка Маруся",
    text: "Приносить вузлик із крупою, цвяхами та теплим словом.",
    effect(state) {
      state.supplies += 4;
      return "Сусідка Маруся принесла гостинці й інструменти. +4 запасів.";
    },
  },
  {
    name: "Сільська молодь",
    text: "Гуртом береться за важке, але після пісень усі швидко втомлюються.",
    effect(state) {
      state.community += 5;
      state.fatigue += 6;
      return "Сільська молодь допомогла з важкою роботою. +5 громади, +6% втоми.";
    },
  },
];

const morningEvents = [
  {
    title: "Базарний день",
    text: "+5 запасів: на ярмарку вдалося виміняти крупи й полотно.",
    apply(state) {
      state.supplies += 5;
    },
  },
  {
    title: "Сильна злива",
    text: "-10% серця хати: дощ розмив частину сирих стін.",
    apply(state) {
      state.progress -= 10;
    },
  },
  {
    title: "Тиха молитва громади",
    text: "+6 громади: люди зібралися біля криниці й домовилися допомагати.",
    apply(state) {
      state.community += 6;
    },
  },
  {
    title: "Гончар привіз глину",
    text: "+5 глини: майстер залишив добрий візок матеріалу.",
    apply(state) {
      state.clay += 5;
    },
  },
  {
    title: "Спекотний полудень",
    text: "+7% втоми: сонце пече, тож робота дається важче.",
    apply(state) {
      state.fatigue += 7;
    },
  },
];

const gameState = {
  levelId: Number(localStorage.getItem(STORAGE_KEYS.currentLevel)) || 1,
  day: 1,
  clay: 0,
  supplies: 0,
  community: 0,
  fatigue: 0,
  progress: 0,
  finished: false,
  decorateUnlocked: false,
  usedMorningEventToday: false,
  currentVisitor: visitors[0],
  log: [],
};

const elements = {
  levelSelect: document.querySelector("#level-select"),
  levelDescription: document.querySelector("#level-description"),
  highScore: document.querySelector("#high-score"),
  day: document.querySelector("#day"),
  progress: document.querySelector("#progress"),
  progressMeter: document.querySelector("#progress-meter"),
  clay: document.querySelector("#clay"),
  supplies: document.querySelector("#supplies"),
  community: document.querySelector("#community"),
  fatigue: document.querySelector("#fatigue"),
  fatigueMeter: document.querySelector("#fatigue-meter"),
  efficiencyBadge: document.querySelector("#efficiency-badge"),
  stageTitle: document.querySelector("#house-stage-title"),
  khataSvg: document.querySelector("#khata-svg"),
  visitorName: document.querySelector("#visitor-name"),
  visitorText: document.querySelector("#visitor-text"),
  log: document.querySelector("#log"),
  restart: document.querySelector("#restart"),
  buttons: document.querySelectorAll("[data-action]"),
};

const actionHandlers = {
  buildWalls() {
    if (!spend({ clay: 3, supplies: 1 })) return false;
    const gain = workGain(18);
    gameState.progress += gain;
    gameState.fatigue += 13;
    addLog(`Ви замісили глину разом із сусідами. Серце хати зросло на ${gain}%.`);
    return true;
  },
  thatchedRoof() {
    if (!spend({ clay: 2, supplies: 4 })) return false;
    const gain = workGain(22);
    gameState.progress += gain;
    gameState.fatigue += 17;
    addLog(`Ви поклали рівну стріху з пахучої соломи. Серце хати +${gain}%.`);
    return true;
  },
  decorate() {
    if (!gameState.decorateUnlocked) {
      addLog("Орнаменти відкриються, коли Серце хати сягне 50%.");
      return false;
    }
    if (!spend({ clay: 1, supplies: 2 })) return false;
    const gain = workGain(12);
    gameState.progress += gain;
    gameState.community += 12;
    gameState.fatigue += 8;
    addLog(`Ви розмалювали причілок квітами й оберегами. +${gain}% серця, +12 громади.`);
    return true;
  },
  inviteMarusia() {
    gameState.supplies += 6;
    gameState.community += 3;
    gameState.fatigue += 3;
    addLog("Маруся принесла запаси та навчила берегти сили. +6 запасів, +3 громади.");
    return true;
  },
  inviteYouth() {
    const gain = workGain(15) + Math.floor(gameState.community / 18);
    gameState.progress += gain;
    gameState.community += 7;
    gameState.fatigue += 21;
    addLog(`Сільська молодь підняла важкі бантини й співала до смерку. +${gain}% серця, +7 громади, але втома зросла.`);
    return true;
  },
  rest() {
    const restored = Math.min(gameState.fatigue, 28 + Math.floor(gameState.community / 10));
    gameState.fatigue -= restored;
    gameState.supplies = Math.max(0, gameState.supplies - 1);
    addLog(`Вечірній перепочинок біля печі зняв ${restored}% втоми. Запаси зігріли робітників.`);
    return true;
  },
};

function getLevel() {
  return levels.find((level) => level.id === gameState.levelId) || levels[0];
}

function getHighScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.highScore)) || {};
  } catch {
    return {};
  }
}

function saveHighScore() {
  const scores = getHighScores();
  const current = scores[gameState.levelId] || 0;
  scores[gameState.levelId] = Math.max(current, gameState.progress);
  localStorage.setItem(STORAGE_KEYS.highScore, JSON.stringify(scores));
}

function clampState() {
  gameState.clay = Math.max(0, Math.round(gameState.clay));
  gameState.supplies = Math.max(0, Math.round(gameState.supplies));
  gameState.community = Math.min(100, Math.max(0, Math.round(gameState.community)));
  gameState.fatigue = Math.min(100, Math.max(0, Math.round(gameState.fatigue)));
  gameState.progress = Math.min(100, Math.max(0, Math.round(gameState.progress)));
  gameState.decorateUnlocked = gameState.progress >= 50;
}

function workGain(base) {
  const level = getLevel();
  const fatigueFactor = Math.max(0.35, 1 - (gameState.fatigue / 100) * level.efficiencyPenalty);
  const communityFactor = 1 + gameState.community / 180;
  return Math.max(3, Math.round(base * fatigueFactor * communityFactor));
}

function spend(cost) {
  const lacksClay = gameState.clay < (cost.clay || 0);
  const lacksSupplies = gameState.supplies < (cost.supplies || 0);

  if (lacksClay || lacksSupplies) {
    addLog("Бракує глини або запасів. Покличте допомогу чи оберіть іншу дію.");
    return false;
  }

  gameState.clay -= cost.clay || 0;
  gameState.supplies -= cost.supplies || 0;
  return true;
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function runMorning() {
  if (gameState.finished || gameState.usedMorningEventToday) return;

  const event = pickRandom(morningEvents);
  event.apply(gameState);
  addLog(`<strong>Ранкова подія: ${event.title}.</strong> ${event.text}`);

  gameState.currentVisitor = pickRandom(visitors);
  const visitorMessage = gameState.currentVisitor.effect(gameState);
  addLog(`<strong>${gameState.currentVisitor.name} завітав.</strong> ${visitorMessage}`);
  gameState.usedMorningEventToday = true;
  clampState();
}

function finishDay() {
  clampState();

  if (gameState.progress >= getLevel().target) {
    gameState.finished = true;
    addLog("<strong>Перемога!</strong> Хата-мазанка готова: білі стіни, стріха, орнаменти й квіти стали оберегом села.");
    saveHighScore();
    return;
  }

  if (gameState.day >= 7) {
    gameState.finished = true;
    addLog(`<strong>Сьомий день завершено.</strong> Серце хати зупинилося на ${gameState.progress}%. Спробуйте інший порядок дій.`);
    saveHighScore();
    return;
  }

  gameState.day += 1;
  gameState.usedMorningEventToday = false;
  gameState.fatigue = Math.max(0, gameState.fatigue - 5);
  runMorning();
}

function stageForProgress(progress) {
  if (progress >= 100) return { className: "stage-100", title: "Квіти розквітли" };
  if (progress >= 75) return { className: "stage-75", title: "Розписані обереги" };
  if (progress >= 50) return { className: "stage-50", title: "Соломʼяна стріха" };
  if (progress >= 25) return { className: "stage-25", title: "Біла мазанка" };
  return { className: "stage-0", title: "Глиняні стіни" };
}

function renderLevelOptions() {
  elements.levelSelect.innerHTML = levels
    .map((level) => `<option value="${level.id}">${level.label}: ${level.name}</option>`)
    .join("");
  elements.levelSelect.value = String(gameState.levelId);
}

function render() {
  clampState();
  const level = getLevel();
  const highScores = getHighScores();
  const stage = stageForProgress(gameState.progress);
  const efficiency = Math.round(Math.max(35, (workGain(100) / (100 * (1 + gameState.community / 180))) * 100));

  elements.day.textContent = gameState.day;
  elements.progress.textContent = gameState.progress;
  elements.progressMeter.style.width = `${gameState.progress}%`;
  elements.clay.textContent = gameState.clay;
  elements.supplies.textContent = gameState.supplies;
  elements.community.textContent = gameState.community;
  elements.fatigue.textContent = gameState.fatigue;
  elements.fatigueMeter.style.width = `${gameState.fatigue}%`;
  elements.efficiencyBadge.textContent = `Ефективність ${efficiency}%`;
  elements.stageTitle.textContent = stage.title;
  elements.levelDescription.textContent = level.description;
  elements.highScore.textContent = `${highScores[gameState.levelId] || 0}%`;
  elements.visitorName.textContent = gameState.currentVisitor.name;
  elements.visitorText.textContent = gameState.currentVisitor.text;

  elements.khataSvg.classList.remove("stage-0", "stage-25", "stage-50", "stage-75", "stage-100");
  elements.khataSvg.classList.add(stage.className);

  elements.buttons.forEach((button) => {
    const actionName = button.dataset.action;
    const disabledByFinish = gameState.finished;
    const disabledByDecorate = actionName === "decorate" && !gameState.decorateUnlocked;
    button.disabled = disabledByFinish || disabledByDecorate;
  });

  elements.log.innerHTML = gameState.log.map((item) => `<li>${item}</li>`).join("");
}

function addLog(message) {
  const dayLabel = `<strong>День ${gameState.day}.</strong>`;
  gameState.log.unshift(`${dayLabel} ${message}`);
  gameState.log = gameState.log.slice(0, 24);
}

function startNewGame(levelId = gameState.levelId) {
  const level = levels.find((item) => item.id === Number(levelId)) || levels[0];
  Object.assign(gameState, {
    levelId: level.id,
    day: 1,
    clay: level.start.clay,
    supplies: level.start.supplies,
    community: level.start.community,
    fatigue: level.start.fatigue,
    progress: level.start.progress,
    finished: false,
    decorateUnlocked: false,
    usedMorningEventToday: false,
    currentVisitor: visitors[0],
    log: [],
  });
  localStorage.setItem(STORAGE_KEYS.currentLevel, String(level.id));
  addLog(`Починається будівництво: ${level.name}. Маєте 7 днів, щоб відкрити Серце хати.`);
  runMorning();
  render();
}

function handleAction(event) {
  const action = actionHandlers[event.currentTarget.dataset.action];
  if (!action || gameState.finished) return;

  const completed = action();
  if (completed) {
    finishDay();
  }
  render();
}

renderLevelOptions();
elements.buttons.forEach((button) => button.addEventListener("click", handleAction));
elements.restart.addEventListener("click", () => startNewGame());
elements.levelSelect.addEventListener("change", (event) => startNewGame(event.target.value));

startNewGame(gameState.levelId);
