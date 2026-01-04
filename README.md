# Drishti AI — Triple-Lock Multimodal Safety Dashboard

![Vite](https://img.shields.io/badge/Vite-7C3AED?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-0EA5E9?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-2563EB?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-111827?logo=reactrouter&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-0EA5E9)

Operational dashboard for infrastructure threat monitoring and decision support. Calm, light theme with nested routing, reusable components, and static data scaffolding ready for live feeds.

## Quick start

- Install deps: `pnpm install`
- Run dev: `pnpm run dev`
- Build: `pnpm run build`
- Lint: `pnpm run lint`

## Routes

- `/` marketing hero
- `/technology` modal + logic explainer
- `/dashboard` shell with sidebar/header and nested views:
  - Overview (stats, risk tiers, recent events)
  - Alerts
  - Sensors
  - Decision Log
  - System Health

## Features

- Responsive shell (collapsible sidebar on mobile, sticky header, status badge)
- Tailwind-only styling; no UI/animation libs
- Reusable pieces: Sidebar, Header, StatCard, StatusBadge, TableRow
- Mocked data arrays for fast swap to live sources

## Tech stack

- Vite + React 19 + TypeScript
- Tailwind CSS (utility-first)
- React Router nested routes

## Project structure (key)

- `src/App.tsx` — route setup (landing, tech, dashboard nested)
- `src/pages/dashboard.tsx` — dashboard layout + pages/components
- `src/index.css` — global theme background and typography
