import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { HabitCard } from "../components/HabitCard";
import { CAT_COLORS } from "../utils/constants";
import { todayKey } from "../utils/dates";

export function TodayTab({ habits, onToggle, onDelete, onNote, onAdd }) {
  const { t } = useTheme();
  const [filter, setFilter] = useState("All");
  const today = todayKey();

  const filtered = filter === "All" ? habits : habits.filter((h) => h.category === filter);
  const usedCats = ["All", ...new Set(habits.map((h) => h.category).filter(Boolean))];

  return (
    <div>
      {/* Category filter chips */}
      {habits.length > 0 && (
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
          {usedCats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: "6px 14px", borderRadius: 20,
                border: `1px solid ${c === filter ? (CAT_COLORS[c] || "#818cf8") : t.border}`,
                background: c === filter ? `${CAT_COLORS[c] || "#818cf8"}22` : t.surface,
                color: c === filter ? (CAT_COLORS[c] || "#818cf8") : t.text3,
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.2s",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Habit list */}
      {filtered.length === 0 && habits.length > 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: t.text3, fontSize: 14 }}>
          No {filter} habits yet.
        </div>
      ) : habits.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: t.text3, fontSize: 15 }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🌱</div>
          Start building your habits today
        </div>
      ) : (
        filtered.map((h, i) => (
          <HabitCard
            key={h.id}
            index={i}
            habit={{ ...h, completed: !!h.completions?.[today] }}
            onToggle={onToggle}
            onDelete={onDelete}
            onNote={onNote}
          />
        ))
      )}

      {/* Add habit button */}
      <button
        onClick={onAdd}
        style={{
          width: "100%", padding: "15px", borderRadius: 18,
          border: `1.5px dashed ${t.border2}`, background: t.surface,
          color: t.text3, fontSize: 14, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s", marginTop: 6,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = t.text2;
          e.currentTarget.style.color = t.text2;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = t.border2;
          e.currentTarget.style.color = t.text3;
        }}
      >
        <span style={{ fontSize: 18 }}>+</span> Add habit
      </button>
    </div>
  );
}
