import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export function SettingsTab({ habits, sessions }) {
  const { t, dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [exported, setExported] = useState(false);
  const [notifStatus, setNotifStatus] = useState(() =>
    "Notification" in window ? Notification.permission : "unsupported"
  );

  const exportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      user: user?.email,
      habits: habits.map((h) => ({
        name: h.name, icon: h.icon, category: h.category,
        streak: h.streak, completions: h.completions, notes: h.notes,
      })),
      sessions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "habit-tracker-export.json"; a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const exportCSV = () => {
    const rows = [["Habit", "Category", "Date", "Completed", "Note"]];
    habits.forEach((h) => {
      Object.keys(h.completions || {}).forEach((d) => {
        rows.push([h.name, h.category || "", d, h.completions[d] ? "Yes" : "No", (h.notes || {})[d] || ""]);
      });
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "habit-tracker-export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const requestNotifs = async () => {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setNotifStatus(perm);
  };

  const ToggleSwitch = ({ on, onToggle }) => (
    <div
      onClick={onToggle}
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: "pointer",
        background: on ? "#818cf8" : t.surface2, position: "relative", transition: "background 0.25s",
      }}
    >
      <div style={{
        position: "absolute", top: 2, left: on ? 22 : 2,
        width: 20, height: 20, borderRadius: "50%",
        background: "#fff", transition: "left 0.25s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }} />
    </div>
  );

  const Row = ({ label, sub, children }) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "16px 0", borderBottom: `1px solid ${t.border}`,
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: t.text3, marginTop: 2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );

  const bestStreak = habits.length ? Math.max(...habits.map((h) => h.streak || 0)) : 0;

  return (
    <div>
      {/* Profile card */}
      <div style={{ background: t.surface, borderRadius: 18, padding: "20px", marginBottom: 20, border: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, #818cf8, #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 800, color: "#fff",
          }}>
            {user?.avatar || "?"}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: t.text }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: t.text3 }}>{user?.email}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { v: habits.length, l: "Habits"       },
            { v: bestStreak,    l: "Best Streak"  },
            { v: sessions.length, l: "Sessions"   },
          ].map((s) => (
            <div key={s.l} style={{ flex: 1, textAlign: "center", background: t.surface2, borderRadius: 12, padding: "10px 6px" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: t.text }}>{s.v}</div>
              <div style={{ fontSize: 10, color: t.text3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div style={{ background: t.surface, borderRadius: 18, padding: "0 20px", border: `1px solid ${t.border}`, marginBottom: 20 }}>
        <Row label="Dark Mode" sub="Switch between light and dark">
          <ToggleSwitch on={dark} onToggle={toggle} />
        </Row>
        <Row
          label="Notifications"
          sub={
            notifStatus === "granted" ? "Enabled ✓"
              : notifStatus === "denied" ? "Blocked in browser"
              : "Not yet enabled"
          }
        >
          {notifStatus !== "granted" && (
            <button
              onClick={requestNotifs}
              style={{
                padding: "7px 14px", borderRadius: 10,
                border: `1px solid ${t.border2}`, background: t.surface2,
                color: t.text2, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Enable
            </button>
          )}
        </Row>
      </div>

      {/* Export */}
      <div style={{ background: t.surface, borderRadius: 18, padding: "20px", border: `1px solid ${t.border}`, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: t.text3, letterSpacing: "0.1em", fontWeight: 700, marginBottom: 16 }}>
          EXPORT DATA
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={exportJSON}
            style={{
              flex: 1, padding: "12px", borderRadius: 14,
              background: exported ? "#22c55e22" : t.surface2,
              border: `1px solid ${exported ? "#22c55e" : t.border2}`,
              color: exported ? "#22c55e" : t.text2,
              fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
            }}
          >
            {exported ? "✓ Exported!" : "⬇ Export JSON"}
          </button>
          <button
            onClick={exportCSV}
            style={{
              flex: 1, padding: "12px", borderRadius: 14,
              background: t.surface2, border: `1px solid ${t.border2}`,
              color: t.text2, fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            ⬇ Export CSV
          </button>
        </div>
        <p style={{ fontSize: 11, color: t.text4, marginTop: 12 }}>
          JSON export includes full completion history, streaks, and notes. CSV is spreadsheet-friendly.
        </p>
      </div>

      {/* Sign out */}
      <div style={{ background: t.surface, borderRadius: 18, padding: "20px", border: "1px solid rgba(248,113,113,0.2)" }}>
        <div style={{ fontSize: 11, color: "#f87171", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 16 }}>
          ACCOUNT
        </div>
        <button
          onClick={logout}
          style={{
            width: "100%", padding: "12px", borderRadius: 14,
            background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)",
            color: "#f87171", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.2)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.1)")}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
