# Habit Tracker

A React habit tracking app with Pomodoro timer, analytics, and calendar view.

## Project Structure

```
src/
├── main.jsx                  # Entry point — mounts the app
├── App.jsx                   # Root — wires providers + tab routing
│
├── context/
│   ├── ThemeContext.jsx       # Dark/light mode + all colour tokens
│   └── AuthContext.jsx       # Login/signup state (mock, localStorage)
│
├── hooks/
│   ├── useHabits.js          # All habit CRUD logic + streak calculation
│   └── usePomodoro.js        # Pomodoro session storage
│
├── components/
│   ├── AuthScreen.jsx        # Login / signup screen
│   ├── AddModal.jsx          # New habit modal
│   ├── HabitCard.jsx         # Single habit row with toggle + note
│   ├── ProgressRing.jsx      # SVG ring showing today's progress
│   └── StatCard.jsx          # Small stat display card
│
├── tabs/
│   ├── TodayTab.jsx          # Daily habit checklist
│   ├── CalendarTab.jsx       # Monthly calendar + streak list
│   ├── AnalyticsTab.jsx      # Charts and per-habit breakdown
│   ├── PomodoroTab.jsx       # Focus timer with session history
│   └── SettingsTab.jsx       # Profile, theme, export, sign out
│
└── utils/
    ├── dates.js              # Date helpers (todayKey, last30Days, etc.)
    └── constants.js          # CATEGORIES, ICONS, COLORS, POMO_MODES
```

## Getting Started

```bash
npm install
npm run dev
```

## Making it Full Stack

To connect a real backend, replace the mock `AuthContext` with Supabase auth
and swap `localStorage` calls in `useHabits.js` and `usePomodoro.js` with
API calls to your own Express/Node server.
