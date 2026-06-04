import { useTheme } from "../context/ThemeContext";

export function StatCard({ value, label, accent }) {
  const { t } = useTheme();

  return (
    <div style={{
      flex: 1,
      background: t.surface,
      borderRadius: 16,
      padding: "18px 14px",
      textAlign: "center",
      border: `1px solid ${t.border}`,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: 40, height: 2, borderRadius: 2,
        background: accent, opacity: 0.8,
      }} />
      <div style={{ fontSize: 26, fontWeight: 800, color: t.text, letterSpacing: "-1px", marginTop: 6 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: t.text3, marginTop: 4, letterSpacing: "0.06em" }}>
        {label}
      </div>
    </div>
  );
}
