import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { POMO_MODES } from "../utils/constants";

export function PomodoroTab({ sessions, onSessionComplete }) {
  const { t } = useTheme();
  const [modeIdx, setModeIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(POMO_MODES[0].minutes * 60);
  const [customMin, setCustomMin] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const intervalRef = useRef(null);
  const hasNotified = useRef(false);

  const mode = POMO_MODES[modeIdx];
  const totalSecs = (showCustom && parseInt(customMin) > 0 ? parseInt(customMin) : mode.minutes) * 60;
  const percent = Math.round(((totalSecs - timeLeft) / totalSecs) * 100);
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  const r = 90;
  const circ = 2 * Math.PI * r;

  const reset = useCallback((idx, custom) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    hasNotified.current = false;
    const m2 = custom ? parseInt(custom) : POMO_MODES[idx ?? modeIdx].minutes;
    setTimeLeft((m2 || 25) * 60);
  }, [modeIdx]);

  const switchMode = (idx) => {
    setModeIdx(idx);
    setShowCustom(false);
    setCustomMin("");
    reset(idx, null);
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          if (!hasNotified.current) {
            hasNotified.current = true;
            if (mode.id === "focus") onSessionComplete();
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification(
                mode.id === "focus" ? "🍅 Focus session done!" : "☕ Break over!",
                { body: "Time to switch!" }
              );
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, mode, onSessionComplete]);

  const todaySessions = sessions.filter((d) => d === new Date().toDateString()).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 8 }}>
      {/* Mode tabs */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 32,
        background: t.surface, borderRadius: 14, padding: 5,
        border: `1px solid ${t.border}`, width: "100%",
      }}>
        {POMO_MODES.map((m, i) => (
          <button
            key={m.id}
            onClick={() => switchMode(i)}
            style={{
              flex: 1, padding: "8px 6px", borderRadius: 10, border: "none",
              background: modeIdx === i ? `${m.color}22` : "transparent",
              color: modeIdx === i ? m.color : t.text3,
              fontWeight: modeIdx === i ? 700 : 500,
              fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
              outline: modeIdx === i ? `1px solid ${m.color}44` : "none",
            }}
          >
            {m.label}
          </button>
        ))}
        <button
          onClick={() => { setShowCustom(!showCustom); if (!showCustom) reset(modeIdx, customMin); }}
          style={{
            padding: "8px 10px", borderRadius: 10, border: "none",
            background: showCustom ? t.surface2 : "transparent",
            color: t.text3, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          ⚙️
        </button>
      </div>

      {showCustom && (
        <div style={{ display: "flex", gap: 10, marginBottom: 28, alignItems: "center" }}>
          <input
            value={customMin}
            onChange={(e) => { setCustomMin(e.target.value); reset(modeIdx, e.target.value); }}
            placeholder="Minutes…"
            type="number" min="1" max="120"
            style={{
              width: 110, background: t.inputBg,
              border: `1px solid ${t.border2}`, borderRadius: 10,
              padding: "8px 12px", color: t.text, fontSize: 14,
              outline: "none", fontFamily: "inherit", textAlign: "center",
            }}
          />
          <span style={{ fontSize: 13, color: t.text3 }}>min custom</span>
        </div>
      )}

      {/* Timer ring */}
      <div style={{ position: "relative", width: 220, height: 220, marginBottom: 36 }}>
        <svg width="220" height="220" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="110" cy="110" r={r} fill="none" stroke={t.surface2} strokeWidth="12" />
          <circle
            cx="110" cy="110" r={r}
            fill="none" stroke={mode.color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - percent / 100)}
            style={{
              transition: running ? "stroke-dashoffset 1s linear" : "stroke-dashoffset 0.4s ease",
              filter: `drop-shadow(0 0 8px ${mode.color}66)`,
            }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
        }}>
          <span style={{ fontSize: 48, fontWeight: 900, color: t.text, letterSpacing: "-3px", lineHeight: 1 }}>
            {mins}:{secs}
          </span>
          <span style={{ fontSize: 11, color: t.text3, letterSpacing: "0.12em", marginTop: 4 }}>
            {running ? mode.label.toUpperCase() : timeLeft === 0 ? "DONE ✓" : "PAUSED"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 14, marginBottom: 36, alignItems: "center" }}>
        <button
          onClick={() => reset(modeIdx, showCustom ? customMin : null)}
          style={{
            width: 46, height: 46, borderRadius: "50%",
            background: t.surface, border: `1px solid ${t.border2}`,
            color: t.text3, cursor: "pointer", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ↺
        </button>
        <button
          onClick={() => {
            if (timeLeft === 0) reset(modeIdx, showCustom ? customMin : null);
            else setRunning((r) => !r);
          }}
          style={{
            width: 72, height: 72, borderRadius: "50%",
            background: running ? `${mode.color}33` : mode.color,
            border: `2px solid ${mode.color}`,
            color: "#fff", cursor: "pointer", fontSize: 22,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.25s cubic-bezier(.34,1.56,.64,1)",
            boxShadow: running ? `0 0 24px ${mode.color}55` : "none",
            transform: running ? "scale(1.05)" : "scale(1)",
          }}
        >
          {timeLeft === 0 ? "↺" : running ? "⏸" : "▶"}
        </button>
        <button
          onClick={() => { if ("Notification" in window) Notification.requestPermission(); }}
          title="Enable notifications"
          style={{
            width: 46, height: 46, borderRadius: "50%",
            background: t.surface, border: `1px solid ${t.border2}`,
            color: t.text3, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          🔔
        </button>
      </div>

      {/* Session history */}
      <div style={{ width: "100%", background: t.surface, borderRadius: 18, padding: "18px 20px", border: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 11, color: t.text3, letterSpacing: "0.1em", fontWeight: 700, marginBottom: 14 }}>
          SESSION HISTORY
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          {[
            { v: todaySessions,                           l: "TODAY",    c: "#f87171" },
            { v: sessions.length,                         l: "ALL TIME", c: t.text    },
            { v: `${Math.round(sessions.length * 25 / 60)}h`, l: "FOCUSED",  c: "#fbbf24" },
          ].map((s) => (
            <div key={s.l} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.c, letterSpacing: "-1px" }}>{s.v}</div>
              <div style={{ fontSize: 10, color: t.text3, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {sessions.slice(-24).map((d, i) => (
            <div
              key={i}
              title={d}
              style={{
                width: 10, height: 10, borderRadius: "50%",
                background: d === new Date().toDateString() ? "#f87171" : "rgba(248,113,113,0.3)",
              }}
            />
          ))}
          {sessions.length === 0 && (
            <span style={{ fontSize: 12, color: t.text4 }}>Complete your first session 🍅</span>
          )}
        </div>
      </div>
    </div>
  );
}
