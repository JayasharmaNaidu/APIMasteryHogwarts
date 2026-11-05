# Hogwarts Registry

A Hogwarts-themed React + Vite app built to explore core API skills in a practical, visual way. This project is designed around three key concepts from the API Mastery Course: comparing multiple API results, visualising data, and caching data for speed and resilience.

## Overview

Hogwarts Registry is a small interactive web app that simulates a magical student and house tracking dashboard. It demonstrates how real-world API patterns can be applied in front-end development using React, JavaScript, and Chart.js.

## The 3 API Mastery concepts covered

### 1. Multiple items comparison
This concept focuses on fetching and comparing several resources at once, handling concurrency, and normalising data shapes before display.

Key ideas covered:
- `Promise.all()` and `Promise.allSettled()`
- normalising API responses
- pagination and data aggregation
- handling partial failures gracefully

Relevant files:
- `src/api/mockApi.js`
- `src/pages/Compare.jsx`
- `src/pages/Students.jsx`

### 2. Data visualisation
This concept shows how to turn raw data into meaningful charts and dashboard visuals for easier interpretation.

Key ideas covered:
- charting with Chart.js
- summarising API data visually
- turning data into insights for users

Relevant files:
- `src/components/ChartBox.jsx`
- `src/pages/Cup.jsx`

### 3. localStorage and caching
This concept focuses on making apps more efficient and resilient by storing data locally and reusing it when appropriate.

Key ideas covered:
- TTL-based caching
- `localStorage` persistence
- SWR-style stale-while-revalidate patterns
- offline fallback behaviour

Relevant files:
- `src/cache.js`
- `src/hooks.js`
- `src/components/Pensieve.jsx`

## Tech stack

- React
- Vite
- Chart.js
- JavaScript

## Getting started

### Prerequisites

- Node.js 18+

### Installation

1. Open the project folder.
2. Run:

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually:

```bash
http://localhost:5173
```

### Production build

```bash
npm run build
```

## Using a real API

The app currently uses mock API logic in `src/api/mockApi.js`. To connect it to a real backend:

1. Replace the mock `fetch` logic with real API calls.
2. Keep the `transform()` function so all responses stay in the same structure.
3. Continue using the same frontend components without changing the app layout.

This keeps the project useful as a pattern for real-world API integration.

## Project structure

```bash
hogwarts-registry/
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── cache.js
│   ├── hooks.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Goal

This project helps demonstrate how to build a frontend that feels polished while also learning real API concepts used in production applications.
