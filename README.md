# Historical Scene Generator

A production-style Next.js application for creating cinematic, historically accurate AI prompts for video and image generation.

## What it does

Historical Scene Generator randomly combines expandable databases of locations, weather, seasons, professions, objects, food, lighting, atmosphere, emotions, camera movement, sounds, clothing, architecture, actions, and time periods to create unique scenes for:

- Veo 3 video prompts
- Sora video prompts
- Kling video prompts
- Midjourney image prompts
- Imagen prompts
- Flux prompts
- YouTube Shorts hook ideas
- Video titles, hashtags, scene descriptions, thumbnails, and storyboard beats

The generator specializes in 19th-century Ukrainian village life, authentic clay houses / мазанки, historical food preparation, peasant daily life, farming, markets, rural atmosphere, Soviet-era interiors, Khrushchyovka apartments, Soviet grocery queues, and realistic cinematic action.

## Features

- Modern dark cinematic interface with glassmorphism panels and responsive mobile layout.
- Advanced modular randomization engine with duplicate fingerprint avoidance.
- Historical authenticity rules for Ukrainian village and Soviet-era scenes.
- Required 8-second video prompt constraints: no dialogue, no subtitles, no visible text, no logos, no watermarks, realistic ambient sound only.
- Creative modifiers: Generate Similar Scene, More Cinematic, More Realistic, More Emotional, More Soviet, and More Ukrainian Village.
- Scene history and favorites stored in `localStorage`.
- TXT, JSON, Markdown downloads and clipboard copying.
- AI thumbnail concept, storyboard preview, palette selector, and sliders for camera intensity, realism, chaos, and complexity.

## Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Production

```bash
npm run build
npm run start
```
