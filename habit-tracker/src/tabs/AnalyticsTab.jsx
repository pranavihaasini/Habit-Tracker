import { useTheme } from "../context/ThemeContext";
import { last7Days, last30Days, shortDate, todayKey } from "../utils/dates";

export function AnalyticsTab({ habits }) {
  const { t } = useTheme();
  const days7 = last7Days();
  const days30 = last30Days();

  // 7-day rate
  const total7 = habits.length * 7;
  let done7 = 0;
  habits.forEach((h) => days7.forEach((d) => { if (h.completions?.[d]) done7++; }));
  const rate7 = total7 ? Math.round((done7 / total7) * 100) : 0;

  // 30-day bar chart data
  const barData = days30.map((d) => ({
    label: shortDate(d),
    value: habits.filter((h) => h.completions?.[d]).length,
    max: habits.length || 1,
    key: d,
  }));

  // Day-of-week heatmap
  const byDow = Array(7).fill(0);
  habits.forEach((h) => {
    Object.keys(h.completions || {}).forEach((k) => {
      if (h.completions[k]) byDow[new Date(k).getDay()]++;
    });
  });
  const maxDow = Math.max(...byDow, 1);
  const dowLabels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  // Per-habit 30-day
  const habitStats = habits
    .map((h) => {
      const done = days30.filter((d) => h.completions?.[d]).length;
      return { ...h, pct30: Math.round((done / 30) * 100), done30: done };
    })
    .sort((a, b) => b.pct30 - a.pct30);

  const ringCirc = 2 * Math.PI * 30;

  return (
    <div>
      {/* 7-day hero card */}
      <div style={{
        background: t.surface, borderRadius: 20, padding: "22px 24px",
        marginBottom: 20, border: `1px solid ${t.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 11, color: t.text3, letterSpacing: "0.08em", fontWeight: 700, marginBottom: 4 }}>
            7-DAY SUCCESS RATE
          </div>
          <div style={{ fontSize: 46, fontWeight: 900, color: t.text, letterSpacing: "-2px" }}>
            {rate7}<span style={{ fontSize: 24 }}>%</span>
          </div>
          <div style={{ fontSize: 12, color: t.text3, marginTop: 4 }}>
            {done7} of {total7} sessions completed
          </div>
        </div>
        <div style={{ position: "relative", width: 72, height: 72 }}>
          <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="36" cy="36" r="30" fill="none" stroke={t.surface2} strokeWidth="8" />
            <circle cx="36" cy="36" r="30" fill="none" stroke="#a78bfa" strokeWidth="8"
              strokeLinecap="round" strokeDasharray={ringCirc}
              strokeDashoffset={ringCirc * (1 - rate7 / 100)}
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, color: t.text,
          }}>
            {rate7}%
          </div>
        </div>
      </div>

      {/* 30-day bar chart */}
      <div style={{ background: t.surface, borderRadius: 20, padding: "20px 20px 16px", marginBottom: 20, border: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 11, color: t.text3, letterSpacing: "0.1em", fontWeight: 700, marginBottom: 16 }}>
          30-DAY COMPLETIONS
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
          {barData.map((d, i) => {
            const h = d.max > 0 ? Math.round((d.value / d.max) * 100) : 0;
            const isToday = d.key === todayKey();
            return (
              <div
                key={i}
                title={`${d.label}: ${d.value}/${d.max}`}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}
              >
                <div style={{
                  width: "100%", borderRadius: "3px 3px 0 0",
                  height: `${Math.max(h, 4)}%`,
                  background: isToday ? "#818cf8"
                    : h === 100 ? "#22c55e"
                    : h > 0 ? `rgba(129,140,248,${0.3 + (h / 100) * 0.5})`
                    : t.surface2,
                  transition: "height 0.5s ease",
                }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 10, color: t.text4 }}>{shortDate(days30[0])}</span>
          <span style={{ fontSize: 10, color: t.text4 }}>Today</span>
        </div>
      </div>

      {/* Day-of-week heatmap */}
      <div style={{ background: t.surface, borderRadius: 20, padding: "20px", marginBottom: 20, border: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 11, color: t.text3, letterSpacing: "0.1em", fontWeight: 700, marginBottom: 14 }}>
          BEST DAYS OF WEEK
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 60 }}>
          {dowLabels.map((label, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: "100%", borderRadius: 6, minHeight: 8,
                height: `${Math.max(Math.round((byDow[i] / maxDow) * 100), 8)}%`,
                background: byDow[i] > 0
                  ? `rgba(167,139,250,${0.25 + (byDow[i] / maxDow) * 0.75})`
                  : t.surface2,
                transition: "height 0.5s ease",
              }} />
              <span style={{ fontSize: 10, color: t.text3 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-habit breakdown */}
      <div style={{ fontSize: 11, color: t.text3, marginBottom: 14, letterSpacing: "0.1em", fontWeight: 700 }}>
        30-DAY BY HABIT
      </div>
      {habits.length === 0 && <p style={{ color: t.text3, fontSize: 13 }}>No habits yet.</p>}
      {habitStats.map((h) => {
        const c = h.color || "#818cf8";
        return (
          <div key={h.id} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15 }}>{h.icon}</span>
                <span style={{ fontSize: 13, color: t.text2, fontWeight: 600 }}>{h.name}</span>
              </div>
              <span style={{
                fontSize: 12, fontWeight: 800, color: c,
                background: `${c}22`, padding: "2px 10px", borderRadius: 20,
              }}>
                {h.pct30}%
              </span>
            </div>
            <div style={{ height: 8, background: t.surface2, borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${h.pct30}%`,
                background: `linear-gradient(90deg, ${c}88, ${c})`,
                borderRadius: 4, transition: "width 0.6s ease",
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
