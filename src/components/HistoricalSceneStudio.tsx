"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  type Era,
  type HistoricalScene,
  type Modifier,
  type OutputKey,
  type SceneControls,
  defaultControls,
  eras,
  exportScene,
  generateScene,
  moods,
  palettes
} from "@/lib/generator";

const outputLabels: Record<OutputKey, string> = {
  veo: "Veo 3 Video",
  sora: "Sora Video",
  kling: "Kling Video",
  runway: "Runway Video",
  midjourney: "Midjourney Image",
  imagen: "Imagen",
  flux: "Flux"
};

const boosts: { label: string; modifier: Modifier; hint: string }[] = [
  { label: "Generate Similar Scene", modifier: "similar", hint: "Keep mood and place, change human details" },
  { label: "More Cinematic", modifier: "cinematic", hint: "Stronger motion, lens drama, pacing" },
  { label: "More Realistic", modifier: "realistic", hint: "Less stylized, more documentary" },
  { label: "More Emotional", modifier: "emotional", hint: "Human atmosphere and memory" },
  { label: "More Soviet", modifier: "soviet", hint: "Soviet interiors and objects" },
  { label: "More Ukrainian Village", modifier: "village", hint: "Mazanka, linen, clay, hand tools" }
];

const storage = {
  history: "historical-scene-history-v1",
  favorites: "historical-scene-favorites-v1"
};

function readScenes(key: string) {
  if (typeof window === "undefined") return [] as HistoricalScene[];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]") as HistoricalScene[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function download(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export default function HistoricalSceneStudio() {
  const [controls, setControls] = useState<SceneControls>(defaultControls);
  const [scene, setScene] = useState<HistoricalScene>(() => generateScene(defaultControls));
  const [activeOutput, setActiveOutput] = useState<OutputKey>("veo");
  const [history, setHistory] = useState<HistoricalScene[]>([]);
  const [favorites, setFavorites] = useState<HistoricalScene[]>([]);
  const [copied, setCopied] = useState(false);

  const fingerprints = useMemo(() => history.map((item) => item.fingerprint), [history]);
  const isFavorite = favorites.some((item) => item.id === scene.id);

  useEffect(() => {
    const savedHistory = readScenes(storage.history);
    const savedFavorites = readScenes(storage.favorites);
    setHistory(savedHistory);
    setFavorites(savedFavorites);
    if (savedHistory[0]) setScene(savedHistory[0]);
  }, []);

  const persistHistory = (next: HistoricalScene[]) => {
    setHistory(next);
    window.localStorage.setItem(storage.history, JSON.stringify(next.slice(0, 24)));
  };

  const createScene = (modifier?: Modifier) => {
    const next = generateScene(controls, fingerprints, modifier, scene);
    setScene(next);
    persistHistory([next, ...history.filter((item) => item.id !== next.id)].slice(0, 24));
    setCopied(false);
  };

  const update = <K extends keyof SceneControls>(key: K, value: SceneControls[K]) => {
    setControls((current) => ({ ...current, [key]: value }));
  };

  const toggleFavorite = () => {
    const next = isFavorite ? favorites.filter((item) => item.id !== scene.id) : [scene, ...favorites];
    setFavorites(next);
    window.localStorage.setItem(storage.favorites, JSON.stringify(next));
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(scene.prompts[activeOutput]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const exportCurrent = (format: "txt" | "json" | "md") => {
    const content = exportScene(scene, format);
    download(`${scene.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${format}`, content, format === "json" ? "application/json" : "text/plain");
  };

  return (
    <main className="min-h-screen px-4 py-5 text-slate-50 sm:px-6 lg:px-8">
      <div className="cinema-bg" />
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong relative overflow-hidden rounded-[2rem] p-5 sm:p-8 lg:p-10"
        >
          <div className="absolute right-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.28em] text-amber-200">
                Premium cinematic AI studio
              </p>
              <h1 className="font-display text-4xl font-black leading-[.9] tracking-[-.08em] text-balance sm:text-6xl lg:text-7xl">
                Historical Scene Generator
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                Generate historically accurate, non-repetitive, emotionally immersive 8-second prompts for Veo 3, Sora, Kling, Runway-style workflows, Imagen, Midjourney, and Flux.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-3xl border border-white/10 bg-black/20 p-3">
              {["8s video", "No dialogue", "No modern objects", "Ukrainian village", "Soviet era", "Export-ready"].map((item) => (
                <span key={item} className="rounded-2xl bg-white/[.06] px-3 py-3 text-center text-xs font-bold text-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.header>

        <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
          <motion.aside initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-[2rem] p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-amber-200">Director controls</p>
                <h2 className="mt-1 text-2xl font-black">Scene Engine</h2>
              </div>
              <button onClick={() => createScene()} className="glow-button rounded-2xl bg-amber-400 px-4 py-3 text-sm font-black text-black shadow-glow">
                Randomize
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-300">Historical era</span>
                <select value={controls.era} onChange={(event) => update("era", event.target.value as Era)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 font-bold outline-none focus:border-amber-300">
                  {eras.map((era) => <option key={era}>{era}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-300">Mood direction</span>
                <select value={controls.mood} onChange={(event) => update("mood", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 font-bold outline-none focus:border-amber-300">
                  {moods.map((mood) => <option key={mood}>{mood}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-300">Cinematic color palette</span>
                <select value={controls.palette} onChange={(event) => update("palette", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 font-bold outline-none focus:border-amber-300">
                  {palettes.map((palette) => <option key={palette}>{palette}</option>)}
                </select>
              </label>

              {([
                ["cameraIntensity", "Camera intensity"],
                ["realism", "Historical realism"],
                ["chaos", "Chaos / randomness"],
                ["complexity", "Scene complexity"]
              ] as const).map(([key, label]) => (
                <label key={key} className="block rounded-3xl border border-white/10 bg-white/[.04] p-4">
                  <span className="mb-3 flex justify-between text-sm font-bold text-slate-200"><span>{label}</span><span className="text-amber-200">{controls[key]}</span></span>
                  <input className="slider w-full" type="range" min="0" max="100" value={controls[key]} onChange={(event) => update(key, Number(event.target.value))} />
                </label>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {boosts.map((boost) => (
                <button key={boost.modifier} onClick={() => createScene(boost.modifier)} className="rounded-2xl border border-white/10 bg-white/[.05] p-4 text-left transition hover:border-amber-300/50 hover:bg-amber-300/10">
                  <span className="block font-black">{boost.label}</span>
                  <span className="mt-1 block text-xs text-slate-400">{boost.hint}</span>
                </button>
              ))}
            </div>
          </motion.aside>

          <section className="grid gap-5">
            <ScenePreview scene={scene} onFavorite={toggleFavorite} isFavorite={isFavorite} />

            <motion.div layout className="glass rounded-[2rem] p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.24em] text-amber-200">Prompt outputs</p>
                  <h2 className="text-2xl font-black">Generator Pack</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={copyPrompt} className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-black">{copied ? "Copied" : "Copy prompt"}</button>
                  <button onClick={() => exportCurrent("txt")} className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold">TXT</button>
                  <button onClick={() => exportCurrent("json")} className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold">JSON</button>
                  <button onClick={() => exportCurrent("md")} className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-bold">Markdown</button>
                </div>
              </div>

              <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                {(Object.keys(outputLabels) as OutputKey[]).map((key) => (
                  <button key={key} onClick={() => setActiveOutput(key)} className={`whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-black transition ${activeOutput === key ? "bg-amber-400 text-black shadow-glow" : "bg-white/[.06] text-slate-300 hover:bg-white/[.1]"}`}>
                    {outputLabels[key]}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeOutput + scene.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-3xl border border-white/10 bg-black/40 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200 sm:text-base">{scene.prompts[activeOutput]}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Library title="Scene history" scenes={history} onSelect={setScene} empty="Generated scenes will appear here." />
              <Library title="Favorites" scenes={favorites} onSelect={setScene} empty="Save your strongest prompts here." />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function ScenePreview({ scene, onFavorite, isFavorite }: { scene: HistoricalScene; onFavorite: () => void; isFavorite: boolean }) {
  return (
    <motion.article layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-strong overflow-hidden rounded-[2rem]">
      <div className="relative min-h-[420px] p-5 sm:p-7">
        <div className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(circle at 24% 18%, ${scene.palette[0]}55, transparent 28rem), radial-gradient(circle at 78% 22%, ${scene.palette[1]}66, transparent 26rem), linear-gradient(135deg, ${scene.palette[3]}, #07080d)` }} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 grid min-h-[370px] gap-6 lg:grid-cols-[1fr_310px] lg:items-end">
          <div className="self-end">
            <p className="mb-3 inline-flex rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-amber-100">AI thumbnail concept</p>
            <h2 className="max-w-3xl font-display text-3xl font-black leading-none tracking-[-.06em] sm:text-5xl">{scene.title}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">{scene.sceneDescription}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {scene.hashtags.slice(0, 5).map((tag) => <span key={tag} className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-slate-200">{tag}</span>)}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-black">Storyboard timeline</h3>
              <button onClick={onFavorite} className={`rounded-full px-3 py-1 text-xs font-black ${isFavorite ? "bg-amber-300 text-black" : "bg-white/10"}`}>{isFavorite ? "Saved" : "Favorite"}</button>
            </div>
            <ol className="space-y-3">
              {scene.storyboard.map((beat) => (
                <li key={beat} className="rounded-2xl border border-white/10 bg-white/[.05] p-3 text-sm leading-6 text-slate-300">{beat}</li>
              ))}
            </ol>
            <div className="mt-4 flex gap-2">
              {scene.palette.map((color) => <span key={color} className="h-8 flex-1 rounded-full border border-white/20" style={{ backgroundColor: color }} />)}
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-3 border-t border-white/10 bg-black/20 p-5 md:grid-cols-3">
        {scene.authenticityChecklist.map((item) => <div key={item} className="rounded-2xl bg-white/[.04] p-4 text-sm font-semibold leading-6 text-slate-300">✓ {item}</div>)}
      </div>
    </motion.article>
  );
}

function Library({ title, scenes, onSelect, empty }: { title: string; scenes: HistoricalScene[]; onSelect: (scene: HistoricalScene) => void; empty: string }) {
  return (
    <section className="glass rounded-[2rem] p-5">
      <h2 className="mb-4 text-xl font-black">{title}</h2>
      {scenes.length === 0 ? <p className="text-sm text-slate-400">{empty}</p> : (
        <div className="max-h-80 space-y-3 overflow-auto pr-1">
          {scenes.map((item) => (
            <button key={item.id} onClick={() => onSelect(item)} className="block w-full rounded-2xl border border-white/10 bg-white/[.04] p-4 text-left transition hover:border-amber-300/40 hover:bg-amber-300/10">
              <span className="block font-black text-slate-100">{item.title}</span>
              <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-400">{item.sceneDescription}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
