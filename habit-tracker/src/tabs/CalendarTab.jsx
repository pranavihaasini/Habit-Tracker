import { useTheme } from "../context/ThemeContext";
import { dateKey, last30Days } from "../utils/dates";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["M","T","W","T","F","S","S"];

export function CalendarTab({ habits }) {
  const { t } = useTheme();
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  // Calendar math
  const offset = (new Date(y, m, 1).getDay() + 6) % 7; // Mon-start
  const total = new Date(y, m + 1, 0).getDate();
  const today = dateKey(now);

  // Build completion count per day
  const dailyCount = {};
  last30Days().forEach((d) => {
    dailyCount[d] = habits.filter((h) => h.completions?.[d]).length;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: t.text }}>
          {MONTH_NAMES[m]} {y}
        </span>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ fontSize: 11, color: t.text3, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "#22c55e", display: "inline-block" }} />
            All done
          </span>
          <span style={{ fontSize: 11, color: t.text3, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "#fbbf24", display: "inline-block" }} />
            Partial
          </span>
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5, marginBottom: 28 }}>
        {DAY_NAMES.map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 11, color: t.text3, padding: "0 0 8px", fontWeight: 600 }}>
            {d}
          </div>
        ))}

        {Array(offset).fill(null).map((_, i) => <div key={"e" + i} />)}

        {Array(total).fill(null).map((_, i) => {
          const d = i + 1;
          const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const count = dailyCount[key] || 0;
          const allDone = habits.length > 0 && count === habits.length;
          const partial = count > 0 && !allDone;
          const isToday = key === today;
          const isFuture = new Date(key) > now;

          return (
            <div
              key={d}
              style={{
                aspectRatio: "1", borderRadius: 9,
                background: allDone ? "#22c55e" : partial ? "#fbbf24" : isToday ? t.surface2 : t.surface,
                border: isToday ? `1.5px solid ${t.border2}` : "1px solid transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12,
                fontWeight: isToday || allDone || partial ? 700 : 400,
                color: allDone || partial ? "#fff" : isFuture ? t.text4 : isToday ? t.text : t.text3,
              }}
            >
              {d}
            </div>
          );
        })}
      </div>

      {/* Streak list */}
      <div style={{ fontSize: 11, color: t.text3, marginBottom: 14, letterSpacing: "0.1em", fontWeight: 700 }}>
        CURRENT STREAKS
      </div>
      {habits.length === 0 && (
        <p style={{ color: t.text3, fontSize: 13 }}>Add habits to track your streaks.</p>
      )}
      {habits.map((h) => (
        <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>{h.icon}</span>
          <span style={{
            flex: 1, fontSize: 13, color: t.text2, fontWeight: 600,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {h.name}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: h.streak > 0 ? "#fb923c" : t.text4 }}>
            🔥 {h.streak || 0}
          </span>
        </div>
      ))}
    </div>
  );
}
