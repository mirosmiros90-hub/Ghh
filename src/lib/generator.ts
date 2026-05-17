export type Era = "19th Century Ukrainian Village" | "Soviet Era" | "Mixed Eastern European Memory";
export type OutputKey = "veo" | "sora" | "kling" | "runway" | "midjourney" | "imagen" | "flux";
export type Modifier = "similar" | "cinematic" | "realistic" | "emotional" | "soviet" | "village";

export type SceneControls = {
  era: Era;
  mood: string;
  palette: string;
  cameraIntensity: number;
  realism: number;
  chaos: number;
  complexity: number;
};

export type HistoricalScene = {
  id: string;
  createdAt: string;
  seed: number;
  fingerprint: string;
  title: string;
  hook: string;
  hashtags: string[];
  thumbnailPrompt: string;
  sceneDescription: string;
  palette: string[];
  storyboard: string[];
  authenticityChecklist: string[];
  prompts: Record<OutputKey, string>;
  raw: SceneParts;
};

type SceneParts = {
  era: Era;
  location: string;
  weather: string;
  season: string;
  time: string;
  profession: string;
  action: string;
  object: string;
  food: string;
  clothing: string;
  architecture: string;
  light: string;
  atmosphere: string;
  emotion: string;
  camera: string;
  lens: string;
  sound: string;
  texture: string;
  negative: string;
};

const village = {
  locations: [
    "muddy lane between whitewashed clay houses", "low-ceiling kitchen inside a smoke-darkened mazanka", "wheat field beyond a willow-lined pond", "thatch-roofed barnyard with hens and geese", "Sunday market near a wooden church fence", "riverbank washing place below leaning alders", "orchard courtyard with cherry trees and a well", "potato plot behind a woven wattle fence", "blacksmith shed glowing beside a dirt road", "cabbage garden at the edge of a foggy village", "winter vestibule stacked with firewood", "dusty summer road where horse carts pass slowly", "clay oven corner filled with coppery firelight", "granary loft with sacks, rope, and hand-carved tools", "bee yard beside sunflowers and rough wooden hives"
  ],
  professions: ["bread-baking peasant woman", "elderly blacksmith", "young farmhand", "village mother", "potter's apprentice", "market seller", "linen-clad shepherd", "grandmother preserving vegetables", "father repairing a plow", "children helping with water buckets", "field workers binding sheaves", "fisherman mending a net"],
  actions: ["kneading rye dough on a flour-dusted table", "harvesting wheat with sickles", "lifting potatoes from wet black soil", "feeding chickens from a wooden bowl", "washing linen against river stones", "carrying water buckets on a shoulder yoke", "stirring borscht in a soot-blackened pot", "sharpening a scythe with slow sparks", "loading hay onto a creaking cart", "picking cherries into a woven basket", "fermenting cabbage in a wooden tub", "patching a thatched roof before rain", "chopping firewood beside the stove", "repairing leather harness under a low doorway"],
  architecture: ["authentic clay мазанка walls with rounded corners, lime whitewash, blue-painted wooden shutters, and a reed thatch roof", "packed-earth floor, wooden benches, icon corner, handwoven rushnyky, clay stove, and no electricity", "wattle fence, hand-hewn gate, uneven dirt path, straw stacks, and a shallow well with a wooden sweep", "low clay outbuildings, carved window frames, rough beams, and smoke stains above the oven"],
  clothing: ["coarse linen shirts, homespun skirts, wool waistcoats, kerchiefs, bast shoes, and patched aprons", "sun-faded linen trousers, embroidered cuffs, simple belts, bare dusty feet, and no synthetic fabrics", "heavy wool shawls, sheepskin vest, rough mittens, and weathered leather boots"]
};

const soviet = {
  locations: [
    "dim Khrushchyovka kitchen with enamel pots and patterned oilcloth", "Soviet grocery queue outside a small гастроном", "communal apartment corridor with peeling green paint", "bus stop beside a muddy collective farm road", "workers' canteen under buzzing fluorescent lights", "railway platform with old suitcases and steam breath", "village club with propaganda-red curtains and worn parquet", "panel-block courtyard with laundry lines and cracked asphalt", "state farm potato field with a rattling truck", "small Soviet store with glass counters and faded packaging", "balcony stacked with jars, onions, and chipped enamel basins", "school hallway with varnished boards and wool coats"
  ],
  professions: ["shop assistant in a blue smock", "factory worker returning home", "collective farm mechanic", "bus conductor", "pensioner carrying a string bag", "canteen cook", "railway porter", "teacher in a wool cardigan", "mother preserving tomatoes", "teenager delivering milk bottles", "queue of tired villagers", "apartment janitor sweeping slush"],
  actions: ["waiting silently in a grocery queue", "ladling beet soup into chipped bowls", "repairing a sputtering old bus", "counting coins by a glass counter", "stacking jars of pickled cucumbers", "carrying potatoes in a mesh bag", "warming hands over a stove burner", "scrubbing a communal hallway floor", "folding laundry under grey winter light", "unloading bread crates at dawn", "sorting faded Soviet packaging", "pouring tea from a metal kettle"],
  architecture: ["accurate Soviet interior with patterned wallpaper, linoleum floor, enamelware, Bakelite switches, lace curtains, and no modern devices", "Khrushchyovka apartment blocks with cracked concrete, metal mailboxes, laundry lines, and muted utilitarian geometry", "old Soviet store counters with glass display cases, brown paper wrapping, enamel price plates, and faded institutional colors", "collective farm yard with fuel barrels, old buses, rough timber sheds, and utilitarian postwar masonry"],
  clothing: ["wool coats, kerchiefs, flat caps, sturdy boots, blue work smocks, knitted sweaters, and string shopping bags", "faded cotton dresses, brown leather shoes, quilted jackets, and practical Soviet-era layers", "grey work trousers, padded ватник jacket, scarf, and oil-stained hands"]
};

const common = {
  weather: ["hot dusty summer air", "foggy blue morning", "sudden rainstorm", "heavy overcast evening", "golden sunset haze", "windy day with moving grass", "humid pre-storm atmosphere", "first snow drifting sideways", "icy thaw with puddles", "dry harvest heat shimmering over the road", "mist rising from wet earth", "low clouds after rain"],
  seasons: ["late spring", "high summer", "early autumn", "deep winter", "mud season", "harvest week", "rainy April", "frosty January", "golden September", "humid July"],
  times: ["before sunrise", "early morning", "noon", "late afternoon", "blue hour", "candle-lit night", "storm-dark midday", "last light before dusk"],
  objects: ["wooden bucket", "hand-forged sickle", "clay jug", "woven basket", "iron kettle", "linen towel", "rough broom", "horse harness", "potato sack", "wooden spoon", "enamel bowl", "glass jar", "scythe", "bread paddle", "brass scale"],
  foods: ["round rye bread", "borscht with beet steam", "varenyky on a cloth", "fermenting cabbage", "boiled potatoes with dill", "pickled cucumbers", "buckwheat kasha", "cherries in a bowl", "sunflower seeds", "fresh milk in a clay pot", "salted mushrooms", "onion braids"],
  lighting: ["warm firelight trembling on faces", "low sunrise glow through dust", "soft overcast window light", "hard dusty sunlight through a doorway", "dramatic sunset rim light", "single candle flame and deep shadows", "bluish dawn with smoke layers", "fluorescent flicker softened by haze", "lantern light reflecting on wet mud", "golden shafts cutting through barn dust"],
  atmospheres: ["quiet documentary intimacy", "tense pre-storm stillness", "nostalgic rural melancholy", "busy market realism", "exhausted end-of-day warmth", "time-travel observer realism", "raw handheld immediacy", "slow ethnographic patience", "weathered family memory", "cinematic folk realism"],
  emotions: ["weary tenderness", "focused concentration", "communal resilience", "silent anxiety", "humble pride", "childlike wonder", "stoic patience", "bittersweet nostalgia", "urgent preparation", "calm survival"],
  cameras: ["shoulder-level handheld tracking shot with natural focus breathing", "slow cinematic push-in from a low doorway", "aggressive handheld movement weaving through people", "drone-like glide descending over the road then settling at human height", "low-angle tracking beside muddy footsteps", "war-film style close handheld realism", "vintage documentary pan with micro-jitters", "intimate over-the-shoulder movement with rack focus", "slow lateral dolly across textured objects", "chaotic realistic movement that stabilizes on the main action"],
  lenses: ["35mm anamorphic documentary lens", "50mm natural perspective lens", "24mm wide close-proximity lens", "85mm portrait compression", "16mm archival film look", "IMAX-like wide cinematic framing"],
  sounds: ["birds, insects, distant dogs, creaking wood, and soft footsteps in dust", "rain on thatch, mud sucking under boots, and a low wind through wheat", "crackling fire, wooden spoon against clay, quiet breathing, and floorboard creaks", "horse snorts, cart wheels, harness leather, and distant village ambience", "market murmurs without readable speech, chickens, coins, and cloth rustle", "fluorescent hum, enamel dishes, old bus brakes, and shoes on wet concrete", "wind through wheat, scythe scrape, insects, and far-off thunder", "stove fire, boiling soup, jar lids, and a window rattling gently"],
  textures: ["cracked clay walls, soot, straw fibers, rough wood grain, linen weave, and damp soil", "peeling paint, worn linoleum, chipped enamel, fogged glass, wool fibers, and paper packaging", "flour dust, steam, ember glow, hand-polished wood, and weathered skin", "mud splashes, rust, smoke layers, rain beads, and frayed cloth"],
  palettes: {
    "Amber Archive": ["#f59e0b", "#7c2d12", "#fef3c7", "#17120c"],
    "Soviet Faded Green": ["#9ca56c", "#3f4a3c", "#d6c7a3", "#111214"],
    "Clay & Linen": ["#d8a15d", "#fff7df", "#a75a2d", "#1a120d"],
    "Rain on Thatch": ["#8aa0a8", "#46545b", "#c0a16b", "#090b0d"],
    "Cherry Dusk": ["#9f1239", "#fbbf24", "#43231c", "#09070a"],
    "Winter Kerosene": ["#dbeafe", "#64748b", "#facc15", "#080a12"]
  }
};

const bannedModern = "no dialogue, no subtitles, no visible text, no logos, no watermarks, no smartphones, no plastic windows, no modern cars, no modern asphalt roads unless Soviet-era context requires cracked old asphalt, no modern synthetic clothing, no electric lights in 19th century scenes";

const hash = (input: string) => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return Math.abs(h >>> 0);
};

const mulberry32 = (seed: number) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const pick = <T,>(items: T[], random: () => number) => items[Math.floor(random() * items.length) % items.length];

const weightedEra = (controls: SceneControls, modifier?: Modifier): Era => {
  if (modifier === "soviet") return "Soviet Era";
  if (modifier === "village") return "19th Century Ukrainian Village";
  if (controls.era !== "Mixed Eastern European Memory") return controls.era;
  return Math.random() > 0.46 ? "19th Century Ukrainian Village" : "Soviet Era";
};

const fingerprintOf = (parts: SceneParts) => [parts.era, parts.location, parts.action, parts.weather, parts.time, parts.camera, parts.light, parts.emotion].join("|");

const makeParts = (controls: SceneControls, seed: number, modifier?: Modifier, anchor?: SceneParts): SceneParts => {
  const random = mulberry32(seed);
  const era = anchor && modifier === "similar" ? anchor.era : weightedEra(controls, modifier);
  const bank = era === "Soviet Era" ? soviet : village;
  const realism = controls.realism + (modifier === "realistic" ? 22 : 0);
  const cameraIntensity = controls.cameraIntensity + (modifier === "cinematic" ? 28 : 0);
  const emotionalBoost = modifier === "emotional" ? 1 : 0;

  return {
    era,
    location: anchor && modifier === "similar" ? anchor.location : pick(bank.locations, random),
    profession: pick(bank.professions, random),
    action: pick(bank.actions, random),
    architecture: pick(bank.architecture, random),
    clothing: pick(bank.clothing, random),
    weather: pick(common.weather, random),
    season: pick(common.seasons, random),
    time: pick(common.times, random),
    object: pick(common.objects, random),
    food: pick(common.foods, random),
    light: pick(common.lighting, random),
    atmosphere: realism > 75 ? "unvarnished observational realism" : pick(common.atmospheres, random),
    emotion: emotionalBoost ? pick(["quiet heartbreak", "deep family tenderness", "ancestral longing", "exhausted hope"], random) : pick(common.emotions, random),
    camera: cameraIntensity > 78 ? pick(common.cameras.filter((camera) => camera.includes("handheld") || camera.includes("aggressive") || camera.includes("chaotic")), random) : pick(common.cameras, random),
    lens: pick(common.lenses, random),
    sound: pick(common.sounds, random),
    texture: pick(common.textures, random),
    negative: era === "Soviet Era" ? bannedModern.replace("no electric lights in 19th century scenes", "no smartphones, no LED lighting, no contemporary branding") : bannedModern
  };
};

const sentence = (parts: SceneParts, controls: SceneControls) => {
  const complexity = controls.complexity > 70 ? ` Secondary micro-actions fill the frame: steam curls around hands, animals shift in the background, fabric snaps in the wind, and dust or rain catches the light.` : "";
  return `${parts.season}, ${parts.time}, ${parts.weather}: a ${parts.profession} is ${parts.action} in a ${parts.location}. The scene features ${parts.architecture}, ${parts.clothing}, ${parts.object}, ${parts.food}, and ${parts.texture}. Mood: ${parts.atmosphere}, ${parts.emotion}. Lighting: ${parts.light}.${complexity}`;
};

const videoPrompt = (model: string, parts: SceneParts, controls: SceneControls) => `${model} video prompt, exactly 8 seconds long. ${sentence(parts, controls)} Camera: ${parts.camera}, ${parts.lens}, cinematic pacing with realistic human movement, environmental motion, natural focus shifts, and documentary time-travel immediacy. Audio: realistic ambient sounds only — ${parts.sound}. Historical accuracy rules: ${parts.negative}. No dialogue, no subtitles, no visible text, no logos, no watermarks. Make it feel like real documentary footage, not a staged fantasy.`;

const imagePrompt = (model: string, parts: SceneParts, controls: SceneControls) => `${model} image prompt: ${sentence(parts, controls)} Ultra-real historical realism, cinematic composition, ${parts.lens}, rich atmospheric depth, tactile materials, historically correct objects and clothing, ${controls.palette} color grade, emotionally immersive documentary still. Negative: ${parts.negative}, no visible text, no logos, no watermarks.`;

export const defaultControls: SceneControls = {
  era: "Mixed Eastern European Memory",
  mood: "Documentary realism",
  palette: "Amber Archive",
  cameraIntensity: 64,
  realism: 86,
  chaos: 42,
  complexity: 70
};

export const palettes = Object.keys(common.palettes);
export const eras: Era[] = ["Mixed Eastern European Memory", "19th Century Ukrainian Village", "Soviet Era"];
export const moods = ["Documentary realism", "Melancholic", "Urgent market energy", "Warm family memory", "Storm tension", "Quiet ethnographic detail"];

export function generateScene(controls: SceneControls, previous: string[] = [], modifier?: Modifier, anchor?: HistoricalScene): HistoricalScene {
  let seed = Date.now() + Math.floor(Math.random() * 999999) + Math.floor(controls.chaos * 193);
  let parts = makeParts(controls, seed, modifier, anchor?.raw);
  let fingerprint = fingerprintOf(parts);
  let attempts = 0;

  while (previous.includes(fingerprint) && attempts < 24) {
    seed += hash(fingerprint + attempts + controls.chaos);
    parts = makeParts(controls, seed, modifier, anchor?.raw);
    fingerprint = fingerprintOf(parts);
    attempts += 1;
  }

  const titleNoun = parts.era === "Soviet Era" ? "Soviet Memory" : "Mazanka Chronicle";
  const title = `${parts.time.replace(/^./, (c) => c.toUpperCase())} ${titleNoun}: ${parts.action.split(" ").slice(0, 3).join(" ")}`;
  const sceneDescription = sentence(parts, controls);
  const palette = common.palettes[controls.palette as keyof typeof common.palettes] ?? common.palettes["Amber Archive"];

  return {
    id: `${seed}-${hash(fingerprint)}`,
    createdAt: new Date().toISOString(),
    seed,
    fingerprint,
    title,
    hook: `What would ${parts.era === "Soviet Era" ? "an ordinary Soviet morning" : "a 19th-century Ukrainian village morning"} look like if a time traveler filmed it for 8 seconds?`,
    hashtags: ["#HistoricalAI", "#CinematicPrompt", "#TimeTravelFootage", parts.era === "Soviet Era" ? "#SovietEra" : "#UkrainianVillage", "#Veo3", "#Sora", "#Runway", "#Midjourney"],
    thumbnailPrompt: `Cinematic thumbnail, ${parts.location}, ${parts.profession}, ${parts.light}, ${parts.weather}, historically accurate, dramatic but realistic, no text, no logo`,
    sceneDescription,
    palette,
    storyboard: [
      `0-2s: Establish ${parts.location} in ${parts.weather}; camera begins ${parts.camera}.`,
      `2-5s: Focus lands on the ${parts.profession} ${parts.action}; ${parts.object} and ${parts.food} become tactile foreground details.`,
      `5-8s: ${parts.light} intensifies the ${parts.emotion}; ambient sound of ${parts.sound} closes the moment.`
    ],
    authenticityChecklist: parts.era === "Soviet Era" ? [
      "Soviet interiors, stores, buses, packaging, and clothing only",
      "No modern phones, LED lights, recent logos, or contemporary appliances",
      "Faded utilitarian colors, worn linoleum, enamelware, and practical clothing"
    ] : [
      "Authentic clay мазанки, thatch, dirt roads, hand tools, and wooden utensils",
      "No electricity, plastic windows, asphalt roads, modern clothing, or modern buildings",
      "Linen, wool, clay, straw, wood, soot, and historically plausible food preparation"
    ],
    prompts: {
      veo: videoPrompt("Veo 3", parts, controls),
      sora: videoPrompt("Sora", parts, controls),
      kling: videoPrompt("Kling", parts, controls),
      runway: videoPrompt("Runway", parts, controls),
      midjourney: `${imagePrompt("Midjourney", parts, controls)} --ar 16:9 --style raw --v 6 --s ${Math.round(100 + controls.cameraIntensity * 2)}`,
      imagen: imagePrompt("Imagen", parts, controls),
      flux: `${imagePrompt("Flux", parts, controls)} high dynamic range, natural skin, no AI gloss`
    },
    raw: parts
  };
}

export function exportScene(scene: HistoricalScene, format: "txt" | "json" | "md") {
  if (format === "json") return JSON.stringify(scene, null, 2);
  if (format === "md") {
    return `# ${scene.title}\n\n${scene.sceneDescription}\n\n## Hook\n${scene.hook}\n\n## Prompts\n${Object.entries(scene.prompts).map(([key, value]) => `### ${key.toUpperCase()}\n${value}`).join("\n\n")}\n\n## Storyboard\n${scene.storyboard.map((item) => `- ${item}`).join("\n")}\n\n## Hashtags\n${scene.hashtags.join(" ")}`;
  }
  return `${scene.title}\n\n${scene.sceneDescription}\n\nHOOK\n${scene.hook}\n\n${Object.entries(scene.prompts).map(([key, value]) => `${key.toUpperCase()}\n${value}`).join("\n\n")}\n\nHASHTAGS\n${scene.hashtags.join(" ")}`;
}
