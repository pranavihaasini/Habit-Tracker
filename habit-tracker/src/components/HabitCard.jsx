import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { CAT_COLORS } from "../utils/constants";

export function HabitCard({ habit, onToggle, onDelete, onNote }) {
  const { t } = useTheme();
  const [showNote, setShowNote] = useState(false);
  const [noteText, setNoteText] = useState(habit.note || "");

  const streak = habit.streak || 0;
  const color = habit.color || "#818cf8";
  const done = habit.completed;
  const catColor = CAT_COLORS[habit.category] || color;

  return (
    <div style={{
      background: done
        ? `linear-gradient(135deg, ${color}14 0%, ${t.surface} 100%)`
        : t.surface,
      border: `1px solid ${done ? color + "44" : t.border}`,
      borderRadius: 18,
      padding: "16px 18px",
      marginBottom: 10,
      transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Icon */}
        <div style={{
          width: 46, height: 46, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(135deg, ${color}33, ${color}11)`,
          border: `1px solid ${color}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
        }}>
          {habit.icon || "🎯"}
        </div>

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              fontSize: 15, fontWeight: 700,
              color: done ? t.text3 : t.text,
              textDecoration: done ? "line-through" : "none",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              transition: "all 0.2s", letterSpacing: "-0.2px",
            }}>
              {habit.name}
            </div>
            {habit.category && habit.category !== "All" && (
              <span style={{
                fontSize: 10, fontWeight: 700, color: catColor,
                background: `${catColor}18`, padding: "2px 7px",
                borderRadius: 20, flexShrink: 0, letterSpacing: "0.04em",
              }}>
                {habit.category}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 11, color: streak > 0 ? "#fb923c" : t.text4, fontWeight: 600 }}>
              🔥 {streak} day streak
            </span>
            {habit.note && (
              <span style={{
                fontSize: 11, color: t.text4,
                whiteSpace: "nowrap", overflow: "hidden",
                textOverflow: "ellipsis", maxWidth: 100,
              }}>
                · {habit.note}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => setShowNote(!showNote)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: showNote ? "#a78bfa" : t.text4, fontSize: 15, padding: "4px", borderRadius: 6,
            }}
          >
            📝
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: t.text4, fontSize: 14, padding: "4px", borderRadius: 6, transition: "color 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#f87171")}
            onMouseOut={(e) => (e.currentTarget.style.color = t.text4)}
          >
            ✕
          </button>
          <div
            onClick={() => onToggle(habit.id)}
            style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
              border: `2px solid ${done ? color : t.border2}`,
              background: done ? color : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(.34,1.56,.64,1)",
              transform: done ? "scale(1.08)" : "scale(1)",
            }}
          >
            {done && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7L5.5 10L11.5 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Inline note editor */}
      {showNote && (
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <input
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="What did you do today?…"
            style={{
              flex: 1, background: t.inputBg,
              border: `1px solid ${t.border2}`, borderRadius: 10,
              padding: "8px 12px", color: t.text, fontSize: 13,
              outline: "none", fontFamily: "inherit",
            }}
          />
          <button
            onClick={() => { onNote(habit.id, noteText); setShowNote(false); }}
            style={{
              background: color, border: "none", borderRadius: 10,
              padding: "8px 14px", color: "#fff", cursor: "pointer",
              fontSize: 12, fontWeight: 700, fontFamily: "inherit",
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
