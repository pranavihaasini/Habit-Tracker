import { useState } from "react";
import { useTheme } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";
import { useHabits } from "./hooks/useHabits";
import { usePomodoro } from "./hooks/usePomodoro";

import { AuthScreen } from "./components/AuthScreen";
import { AddModal } from "./components/AddModal";
import { ProgressRing } from "./components/ProgressRing";
import { StatCard } from "./components/StatCard";

import { TodayTab } from "./tabs/TodayTab";
import { CalendarTab } from "./tabs/CalendarTab";
import { AnalyticsTab } from "./tabs/AnalyticsTab";
import { PomodoroTab } from "./tabs/PomodoroTab";
import { SettingsTab } from "./tabs/SettingsTab";

import { todayKey } from "./utils/dates";

const TABS = [
  { id: "today",     icon: "✦", label: "Today"     },
  { id: "calendar",  icon: "◈", label: "Calendar"  },
  { id: "analytics", icon: "◉", label: "Analytics" },
  { id: "pomodoro",  icon: "🍅", label: "Focus"     },
  { id: "settings",  icon: "⚙", label: "Settings"  },
];

function MainApp() {
  const { t, dark, toggle } = useTheme();
  const { habits, addHabit, toggleHabit, deleteHabit, saveNote } = useHabits();
  const { sessions, addSession } = usePomodoro();
  const [tab, setTab] = useState("today");
  const [showAdd, setShowAdd] = useState(false);

  const today = todayKey();
  const now = new Date();
  const doneCount = habits.filter((h) => h.completions?.[today]).length;
  const progress = habits.length ? Math.round((doneCount / habits.length) * 100) : 0;
  const bestStreak = habits.length ? Math.max(...habits.map((h) => h.streak || 0)) : 0;

  const glowColor =
    tab === "pomodoro" ? "rgba(248,113,113,0.07)"
    : tab === "analytics" ? "rgba(167,139,250,0.07)"
    : "rgba(129,140,248,0.07)";

  const showStats = tab !== "pomodoro" && tab !== "settings";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        body {
          background: ${t.bg};
          font-family: 'Outfit', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          transition: background 0.3s;
        }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes slideUp  { from { opacity:0; transform:translateY(40px) } to { opacity:1; transform:translateY(0) } }
        input::placeholder  { color: ${t.text4}; }
        input:focus         { border-color: ${t.border2} !important; }
        button              { font-family: inherit; }
        button:active       { transform: scale(0.97); }
        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${t.surface2}; border-radius: 2px; }

        .app-shell    { min-height:100vh; background:${t.bg}; display:flex; transition:background 0.3s; }
        .sidebar      { display:none; }
        .main-content { flex:1; display:flex; flex-direction:column; min-height:100vh; padding-bottom:80px; }
        .content-inner { width:100%; max-width:560px; margin:0 auto; padding:28px 20px; }

        .bottom-nav {
          display:flex; position:fixed; bottom:0; left:0; right:0;
          background:${t.navBg}; border-top:1px solid ${t.border};
          backdrop-filter:blur(20px); z-index:100; padding:8px 0 12px;
        }
        .bottom-nav button {
          flex:1; display:flex; flex-direction:column; align-items:center; gap:3px;
          background:none; border:none; color:${t.text3};
          cursor:pointer; font-size:10px; font-weight:600; letter-spacing:0.05em;
          padding:4px 0; transition:color 0.2s;
        }
        .bottom-nav button.active { color:${t.text}; }
        .bottom-nav button .nav-icon { font-size:16px; }

        @media (min-width:768px) {
          .sidebar {
            display:flex; flex-direction:column; width:220px; min-height:100vh;
            background:${t.sidebar}; border-right:1px solid ${t.sidebarBorder};
            padding:36px 0; position:sticky; top:0; height:100vh; flex-shrink:0;
          }
          .sidebar-logo  { padding:0 24px 32px; border-bottom:1px solid ${t.sidebarBorder}; }
          .sidebar-nav   { flex:1; padding:24px 12px; display:flex; flex-direction:column; gap:4px; }
          .sidebar-btn {
            display:flex; align-items:center; gap:12px; padding:11px 14px;
            background:none; border:none; color:${t.text3};
            cursor:pointer; font-size:14px; font-weight:600; width:100%;
            text-align:left; transition:all 0.18s; border-radius:12px;
          }
          .sidebar-btn:hover  { background:${t.surface2}; color:${t.text2}; }
          .sidebar-btn.active { background:${t.surface}; color:${t.text}; }
          .sidebar-btn .sicon { font-size:17px; width:22px; text-align:center; }
          .sidebar-footer { padding:0 12px; display:flex; flex-direction:column; gap:8px; }
          .bottom-nav    { display:none; }
          .main-content  { padding-bottom:0; }
          .content-inner { max-width:700px; padding:40px 36px; }
        }
        @media (min-width:1100px) {
          .sidebar       { width:240px; }
          .content-inner { max-width:760px; }
        }

        .mobile-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; animation:fadeUp 0.5s ease both; }
        .desktop-title { display:none; animation:fadeUp 0.5s ease both; }
        .mobile-tabs   { display:flex; margin-bottom:20px; }

        @media (min-width:768px) {
          .mobile-header { display:none; }
          .desktop-title { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; }
          .mobile-tabs   { display:none; }
        }
      `}</style>

      {/* Background effects */}
      {!dark && (
        <div style={{
          position: "fixed", inset: 0,
          background: "linear-gradient(135deg, rgba(129,140,248,0.03) 0%, transparent 50%)",
          pointerEvents: "none", zIndex: 0,
        }} />
      )}
      {dark && (
        <div style={{
          position: "fixed", top: -200, left: "50%",
          transform: "translateX(-50%)",
          width: 700, height: 500, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${glowColor} 0%, transparent 70%)`,
          pointerEvents: "none", zIndex: 0, transition: "background 1s",
        }} />
      )}

      <div className="app-shell">
        {/* ── Sidebar (desktop) ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div style={{ fontSize: 11, color: t.text3, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 6 }}>
              {now.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: t.text, letterSpacing: "-0.8px", lineHeight: 1.15 }}>
              Habit<br /><span style={{ color: t.text3 }}>Tracker</span>
            </div>
            <div style={{ fontSize: 12, color: t.text3, marginTop: 8 }}>
              {now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>

          <nav className="sidebar-nav">
            {TABS.map((t2) => (
              <button
                key={t2.id}
                className={`sidebar-btn${tab === t2.id ? " active" : ""}`}
                onClick={() => setTab(t2.id)}
              >
                <span className="sicon">{t2.icon}</span>
                {t2.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button
              onClick={() => setShowAdd(true)}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 14,
                background: "linear-gradient(135deg, rgba(129,140,248,0.2), rgba(129,140,248,0.08))",
                border: "1px solid rgba(129,140,248,0.25)", color: "#a5b4fc",
                cursor: "pointer", fontWeight: 700, fontSize: 13,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "linear-gradient(135deg,rgba(129,140,248,0.3),rgba(129,140,248,0.12))")}
              onMouseOut={(e)  => (e.currentTarget.style.background = "linear-gradient(135deg,rgba(129,140,248,0.2),rgba(129,140,248,0.08))")}
            >
              <span style={{ fontSize: 18 }}>+</span> New Habit
            </button>
            <button
              onClick={toggle}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 14,
                background: t.surface, border: `1px solid ${t.border}`,
                color: t.text3, cursor: "pointer", fontWeight: 600, fontSize: 13,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s",
              }}
            >
              {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="main-content" style={{ position: "relative", zIndex: 1 }}>
          <div className="content-inner">

            {/* Mobile header */}
            <div className="mobile-header">
              <div>
                <div style={{ fontSize: 11, color: t.text3, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 4 }}>
                  {now.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()}
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: t.text, letterSpacing: "-0.8px", lineHeight: 1.1 }}>
                  Habit<span style={{ color: t.text3 }}> Tracker</span>
                </h1>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={toggle}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: t.surface, border: `1px solid ${t.border}`,
                    color: t.text2, cursor: "pointer", fontSize: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {dark ? "☀" : "🌙"}
                </button>
                {showStats && <ProgressRing percent={progress} />}
              </div>
            </div>

            {/* Desktop title */}
            <div className="desktop-title">
              <div>
                <h2 style={{ fontSize: 30, fontWeight: 900, color: t.text, letterSpacing: "-1px", marginBottom: 4 }}>
                  {TABS.find((x) => x.id === tab)?.label}
                </h2>
                <div style={{ fontSize: 13, color: t.text3 }}>
                  {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </div>
              </div>
              {showStats && <ProgressRing percent={progress} />}
            </div>

            {/* Stat cards */}
            {showStats && (
              <div style={{ display: "flex", gap: 10, marginBottom: 24, animation: "fadeUp 0.5s ease 0.1s both" }}>
                <StatCard value={habits.length} label="TOTAL"       accent="#818cf8" />
                <StatCard value={doneCount}      label="DONE TODAY"  accent="#22c55e" />
                <StatCard value={`${bestStreak}🔥`} label="BEST STREAK" accent="#f97316" />
              </div>
            )}

            {/* Mobile tab switcher */}
            <div className="mobile-tabs">
              <div style={{
                display: "flex", gap: 3, width: "100%",
                background: t.surface, borderRadius: 14, padding: 4,
                border: `1px solid ${t.border}`,
              }}>
                {TABS.map((t2) => (
                  <button
                    key={t2.id}
                    onClick={() => setTab(t2.id)}
                    style={{
                      flex: 1, padding: "7px 3px", borderRadius: 11, border: "none",
                      background: tab === t2.id ? t.surface2 : "transparent",
                      color: tab === t2.id ? t.text : t.text3,
                      fontWeight: tab === t2.id ? 700 : 500,
                      fontSize: 10, cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    {t2.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div style={{ animation: "fadeUp 0.4s ease both" }}>
              {tab === "today"     && <TodayTab     habits={habits} onToggle={toggleHabit} onDelete={deleteHabit} onNote={saveNote} onAdd={() => setShowAdd(true)} />}
              {tab === "calendar"  && <CalendarTab  habits={habits} />}
              {tab === "analytics" && <AnalyticsTab habits={habits} />}
              {tab === "pomodoro"  && <PomodoroTab  sessions={sessions} onSessionComplete={addSession} />}
              {tab === "settings"  && <SettingsTab  habits={habits} sessions={sessions} />}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {TABS.map((t2) => (
          <button
            key={t2.id}
            className={tab === t2.id ? "active" : ""}
            onClick={() => setTab(t2.id)}
          >
            <span className="nav-icon">{t2.icon}</span>
            {t2.label}
          </button>
        ))}
        <button onClick={() => setShowAdd(true)} style={{ color: t.text3 }}>
          <span className="nav-icon" style={{ fontSize: 20, lineHeight: 1 }}>+</span>
          Add
        </button>
      </nav>

      {showAdd && <AddModal onAdd={addHabit} onClose={() => setShowAdd(false)} />}
    </>
  );
}

export default function App() {
  const { user } = useAuth();
  return user ? <MainApp /> : <AuthScreen />;
}
