# Local Media Player

A privacy-first, offline video & GIF player for mobile — built with **React Native** and **Expo**.

## About

This app lets you play video and GIF files stored locally on your phone — with no internet connection required, no file uploads, and no tracking or analytics of any kind. All processing happens entirely on-device.

The playback controller is fully custom-built, rather than relying on the system's default native controls.

## Features

- Video playback for common formats (`mp4`, `mov`, `mkv`, `webm`, etc.)
- Animated GIF playback
- Fully offline — no network requests, no backend server
- Custom playback controller:
  - Double-tap left/right to seek backward/forward (5 seconds)
  - Slider for manual seeking
  - Large centered play/pause button
  - Custom fullscreen mode (not dependent on the system's native fullscreen UI)
- Controls auto-hide/show after a few seconds of inactivity
- Loop playback for both video and GIF

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React Native (Expo) |
| Language | TypeScript |
| Routing | Expo Router |
| Styling | NativeWind (Tailwind CSS) |
| Video playback | expo-video |
| GIF rendering | expo-image |
| File picking | expo-document-picker |
| Icons | @expo/vector-icons |
| Orientation control | expo-screen-orientation |

## Getting Started

```bash
# Install dependencies
npm install

# Start the project
npx expo start
```

To run on your phone, install the **Expo Go** app and scan the displayed QR code.

### Run on Web

```bash
npx expo start --web
```

## 📂 Project Structure

```

├── app
|  ├── index.tsx
|  ├── PlayerScreen.tsx
|  └── _layout.tsx
|
├── components
|  ├── GifPlayer
|  ├── index.ts
|  ├── PlaybackControls.tsx
|  ├── PlayPauseIndicator.tsx
|  └── VideoPlayer
|
├── Hooks
|  ├── index.ts
|  ├── useControlsVisibility.ts
|  ├── useDoubleTapSeek.ts
|  ├── useFullscreen.ts
|  └── useVideoControls.ts
|
├── utils
   ├── fileType.ts
   └── formatTime.ts
├── assets
|  └── images
|
├── babel.config.js
├── CLAUDE.md
├── AGENTS.md
├── Constants
├── cssInterop.ts
├── eslint.config.js
├── expo-env.d.ts
├── global.css
├── metro.config.js
├── nativewind-env.d.ts
├── package-lock.json
├── package.json
├── app.json
├── README.md
├── tailwind.config.js
├── tsconfig.json


directory: 1486 file: 3388

```

## 📝 Project Status
This project is under active development. More features (such as setting the app as a default handler for video/GIF file types) are planned.

## 📄 License
This project was built for educational/personal purposes.











