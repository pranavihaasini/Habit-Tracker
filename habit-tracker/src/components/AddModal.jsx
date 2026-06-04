import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { CATEGORIES, CAT_COLORS, ICONS, COLORS } from "../utils/constants";

export function AddModal({ onAdd, onClose }) {
  const { t } = useTheme();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🎯");
  const [color, setColor] = useState("#818cf8");
  const [category, setCategory] = useState("Personal");
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), icon, color, category);
    onClose();
  };

  const sectionLabel = (label) => (
    <div style={{
      fontSize: 11, color: t.text3,
      marginBottom: 10, letterSpacing: "0.1em", fontWeight: 700,
    }}>
      {label}
    </div>
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200, padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: t.modalBg,
          border: `1px solid ${t.border}`,
          borderRadius: 24,
          padding: "32px 28px",
          width: "100%", maxWidth: 460,
          animation: "slideUp 0.3s cubic-bezier(.34,1.56,.64,1) both",
          boxShadow: `0 24px 64px ${t.shadow}`,
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, color: t.text, fontWeight: 800, fontSize: 20 }}>New Habit ✨</h3>
          <button
            onClick={onClose}
            style={{
              background: t.surface, border: "none", borderRadius: 8,
              color: t.text3, cursor: "pointer", fontSize: 18,
              width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Name input */}
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="e.g. Drink 3L water…"
          style={{
            width: "100%", background: t.inputBg,
            border: `1px solid ${t.border2}`, borderRadius: 14,
            padding: "13px 16px", color: t.text, fontSize: 15,
            outline: "none", fontFamily: "inherit",
            marginBottom: 22, boxSizing: "border-box",
          }}
        />

        {/* Category */}
        {sectionLabel("CATEGORY")}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 22 }}>
          {CATEGORIES.filter((c) => c !== "All").map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: "6px 14px", borderRadius: 20,
                border: `1px solid ${c === category ? CAT_COLORS[c] : t.border2}`,
                background: c === category ? `${CAT_COLORS[c]}22` : t.surface,
                color: c === category ? CAT_COLORS[c] : t.text3,
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.15s",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Icon picker */}
        {sectionLabel("ICON")}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
          {ICONS.map((ic) => (
            <div
              key={ic}
              onClick={() => setIcon(ic)}
              style={{
                width: 44, height: 44, borderRadius: 12,
                background: ic === icon ? t.surface2 : t.surface,
                border: `1.5px solid ${ic === icon ? t.border2 : t.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 20,
                transform: ic === icon ? "scale(1.1)" : "scale(1)",
                transition: "all 0.15s",
              }}
            >
              {ic}
            </div>
          ))}
        </div>

        {/* Color picker */}
        {sectionLabel("COLOR")}
        <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
          {COLORS.map((c) => (
            <div
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 30, height: 30, borderRadius: "50%", background: c,
                border: `3px solid ${c === color ? "#fff" : "transparent"}`,
                cursor: "pointer", transition: "all 0.15s",
                transform: c === color ? "scale(1.15)" : "scale(1)",
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "13px", borderRadius: 14,
              background: t.surface, border: `1px solid ${t.border}`,
              color: t.text3, cursor: "pointer",
              fontSize: 14, fontFamily: "inherit", fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            style={{
              flex: 2, padding: "13px", borderRadius: 14,
              background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              border: "none", color: "#fff", cursor: "pointer",
              fontSize: 14, fontFamily: "inherit", fontWeight: 800,
              boxShadow: `0 4px 20px ${color}44`,
            }}
          >
            Add Habit ✓
          </button>
        </div>
      </div>
    </div>
  );
}
