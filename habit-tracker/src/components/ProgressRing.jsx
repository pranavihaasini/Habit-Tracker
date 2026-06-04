import { useTheme } from "../context/ThemeContext";

export function ProgressRing({ percent }) {
  const { t } = useTheme();
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - percent / 100);
  const color = percent === 100 ? "#4ade80" : percent > 50 ? "#a78bfa" : "#818cf8";

  return (
    <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke={t.surface2} strokeWidth="9" />
        <circle
          cx="60" cy="60" r={r}
          fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.4,0,.2,1), stroke 0.4s" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: t.text, letterSpacing: "-0.5px" }}>
          {percent}%
        </span>
        <span style={{ fontSize: 10, color: t.text3, marginTop: 1, letterSpacing: "0.08em" }}>
          TODAY
        </span>
      </div>
    </div>
  );
}
