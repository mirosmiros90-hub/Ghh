const state = {
  day: 1,
  coziness: 35,
  supplies: 8,
  community: 20,
  roofFixed: false,
  whitewashed: false,
  gardenBloom: false,
};

const actions = {
  clay: {
    cost: 0,
    apply() {
      state.supplies += 4;
      state.coziness += 4;
      return "Ти замісив глину з половою. Стіни стануть міцніші, а запаси зросли.";
    },
  },
  whitewash: {
    cost: 3,
    doneKey: "whitewashed",
    apply() {
      state.whitewashed = true;
      state.coziness += 14;
      return "Біла хата засяяла проти сонця. На стінах проступила тепла охайність.";
    },
  },
  roof: {
    cost: 4,
    doneKey: "roofFixed",
    apply() {
      state.roofFixed = true;
      state.coziness += 18;
      return "Стріха рівно лягла снопами. Тепер дощ не злякає вечорниць.";
    },
  },
  garden: {
    cost: 2,
    doneKey: "gardenBloom",
    apply() {
      state.gardenBloom = true;
      state.coziness += 10;
      state.community += 6;
      return "Біля призьби розквітли мальви й соняхи. Перехожі усміхаються хаті.";
    },
  },
  invite: {
    cost: 1,
    apply() {
      state.community += 18;
      state.supplies += Math.ceil(state.community / 25);
      state.coziness += 8;
      return "Сусіди принесли пісні, вапно й добрі руки. Громада робить мазанку живою.";
    },
  },
};

const elements = {
  day: document.querySelector("#day"),
  coziness: document.querySelector("#coziness"),
  supplies: document.querySelector("#supplies"),
  community: document.querySelector("#community"),
  message: document.querySelector("#message"),
  house: document.querySelector("#house"),
  wall: document.querySelector("#wall"),
  roof: document.querySelector("#roof"),
  garden: document.querySelector("#garden"),
  buttons: document.querySelectorAll("[data-action]"),
  restart: document.querySelector("#restart"),
};

function clampStats() {
  state.coziness = Math.min(100, Math.max(0, state.coziness));
  state.community = Math.min(100, Math.max(0, state.community));
  state.supplies = Math.max(0, state.supplies);
}

function render() {
  clampStats();
  elements.day.textContent = state.day;
  elements.coziness.textContent = state.coziness;
  elements.supplies.textContent = state.supplies;
  elements.community.textContent = state.community;

  elements.wall.classList.toggle("whitewashed", state.whitewashed);
  elements.wall.classList.toggle("decorated", state.gardenBloom);
  elements.roof.classList.toggle("fixed", state.roofFixed);
  elements.garden.classList.toggle("bloom", state.gardenBloom);

  elements.buttons.forEach((button) => {
    const action = actions[button.dataset.action];
    button.disabled =
      state.day > 7 ||
      state.coziness >= 100 ||
      state.supplies < action.cost ||
      Boolean(action.doneKey && state[action.doneKey]);
  });
}

function finishTurn(message) {
  state.day += 1;

  if (state.day <= 7 && state.coziness < 100) {
    state.coziness -= 3;
    state.community -= 1;
  }

  if (state.coziness >= 100) {
    message = `${message} Перемога! Хата-мазанка готова до вечорниць і світиться родинним теплом.`;
    elements.house.classList.add("celebrate");
  } else if (state.day > 7) {
    message = `${message} Настав вечір 7-го дня. ${state.coziness >= 75 ? "Оселя вийшла затишною, але ще просить турботи." : "Не все встигли — спробуй інший порядок робіт."}`;
  } else if (state.supplies === 0) {
    message = `${message} Запаси скінчилися: заміси глину або поклич сусідів наступним ходом.`;
  }

  elements.message.textContent = message;
  render();
}

function handleAction(event) {
  const actionName = event.currentTarget.dataset.action;
  const action = actions[actionName];

  if (
    !action ||
    state.supplies < action.cost ||
    state.day > 7 ||
    state.coziness >= 100 ||
    Boolean(action.doneKey && state[action.doneKey])
  ) {
    return;
  }

  state.supplies -= action.cost;
  const message = action.apply();
  finishTurn(message);
}

function restart() {
  Object.assign(state, {
    day: 1,
    coziness: 35,
    supplies: 8,
    community: 20,
    roofFixed: false,
    whitewashed: false,
    gardenBloom: false,
  });
  elements.house.classList.remove("celebrate");
  elements.message.textContent = "Бабуся лишила поради: почни з глини, бо міцна стіна тримає тепло й памʼять.";
  render();
}

elements.buttons.forEach((button) => button.addEventListener("click", handleAction));
elements.restart.addEventListener("click", restart);

render();
