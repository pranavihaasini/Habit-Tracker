import { useState, useEffect, useRef } from "react";

// ── Progress Ring ───────────────────────────────────────────────────
function ProgressRing({ percent }) {
  const r = 52, circ = 2 * Math.PI * r;
  const offset = circ * (1 - percent / 100);
  const color = percent === 100 ? "#4ade80" : percent > 50 ? "#a78bfa" : "#818cf8";
  return (
    <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
        <circle cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.4,0,.2,1), stroke 0.4s" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>{percent}%</span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 1, letterSpacing: "0.08em" }}>TODAY</span>
      </div>
    </div>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────
function StatCard({ value, label, accent }) {
  return (
    <div style={{
      flex: 1,
      background: "rgba(255,255,255,0.04)",
      borderRadius: 16,
      padding: "18px 14px",
      textAlign: "center",
      border: "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(10px)",
      position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 40, height: 2, borderRadius: 2,
        background: accent, opacity: 0.8
      }} />
      <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginTop: 6 }}>{value}</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4, letterSpacing: "0.06em" }}>{label}</div>
    </div>
  );
}

// ── Habit Card ──────────────────────────────────────────────────────
function HabitCard({ habit, onToggle, onDelete, onNote, index }) {
  const [showNote, setShowNote] = useState(false);
  const [noteText, setNoteText] = useState(habit.note || "");
  const streak = habit.streak || 0;
  const color = habit.color || "#818cf8";
  const done = habit.completed;

  return (
    <div style={{
      background: done
        ? `linear-gradient(135deg, ${color}18 0%, rgba(255,255,255,0.03) 100%)`
        : "rgba(255,255,255,0.04)",
      border: `1px solid ${done ? color + "44" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 18, padding: "16px 18px",
      marginBottom: 10,
      transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(135deg, ${color}33, ${color}11)`,
          border: `1px solid ${color}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22
        }}>
          {habit.icon || "🎯"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 15, fontWeight: 700, color: done ? "rgba(255,255,255,0.4)" : "#fff",
            textDecoration: done ? "line-through" : "none",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            transition: "all 0.2s", letterSpacing: "-0.2px"
          }}>{habit.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span style={{
              fontSize: 11, color: streak > 0 ? "#fb923c" : "rgba(255,255,255,0.25)",
              fontWeight: 600
            }}>🔥 {streak} day streak</span>
            {habit.note && (
              <span style={{
                fontSize: 11, color: "rgba(255,255,255,0.25)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 120
              }}>· {habit.note}</span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => setShowNote(!showNote)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: showNote ? "#a78bfa" : "rgba(255,255,255,0.2)",
            fontSize: 15, padding: "4px", borderRadius: 6
          }}>📝</button>
          <button onClick={() => onDelete(habit.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.15)", fontSize: 14, padding: "4px", borderRadius: 6
          }}
            onMouseOver={e => e.currentTarget.style.color = "#f87171"}
            onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.15)"}
          >✕</button>
          <div onClick={() => onToggle(habit.id)} style={{
            width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
            border: `2px solid ${done ? color : "rgba(255,255,255,0.15)"}`,
            background: done ? color : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.25s cubic-bezier(.34,1.56,.64,1)",
            transform: done ? "scale(1.08)" : "scale(1)"
          }}>
            {done && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7L5.5 10L11.5 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </div>
      </div>
      {showNote && (
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <input
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="What did you do today?…"
            style={{
              flex: 1, background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, padding: "8px 12px",
              color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit"
            }}
          />
          <button onClick={() => { onNote(habit.id, noteText); setShowNote(false); }} style={{
            background: color, border: "none", borderRadius: 10, padding: "8px 14px",
            color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit"
          }}>Save</button>
        </div>
      )}
    </div>
  );
}

// ── Add Habit Modal ─────────────────────────────────────────────────
const ICONS  = ["💧","🏃","📖","💻","🧘","🥗","😴","✍️","🎯","🎸","🧠","💊","🚴","🏋️","🎨","🌿"];
const COLORS = ["#818cf8","#22c55e","#f97316","#a78bfa","#ec4899","#ef4444","#eab308","#06b6d4","#10b981","#3b82f6"];

function AddModal({ onAdd, onClose }) {
  const [name, setName]   = useState("");
  const [icon, setIcon]   = useState("🎯");
  const [color, setColor] = useState("#818cf8");
  const inputRef = useRef();
  useEffect(() => inputRef.current?.focus(), []);

  const submit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), icon, color);
    onClose();
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 200, padding: "20px"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#18181b",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 24, padding: "32px 28px",
        width: "100%", maxWidth: 460,
        animation: "slideUp 0.3s cubic-bezier(.34,1.56,.64,1) both"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px" }}>
            New Habit ✨
          </h3>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8,
            color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18,
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center"
          }}>✕</button>
        </div>

        <input
          ref={inputRef}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="e.g. Drink 3L water…"
          style={{
            width: "100%", background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14, padding: "13px 16px",
            color: "#fff", fontSize: 15, outline: "none",
            fontFamily: "inherit", marginBottom: 22,
            boxSizing: "border-box"
          }}
        />

        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 10, letterSpacing: "0.1em", fontWeight: 700 }}>ICON</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
          {ICONS.map(ic => (
            <div key={ic} onClick={() => setIcon(ic)} style={{
              width: 44, height: 44, borderRadius: 12,
              background: ic === icon ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
              border: `1.5px solid ${ic === icon ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.07)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 20,
              transform: ic === icon ? "scale(1.1)" : "scale(1)",
              transition: "all 0.15s"
            }}>{ic}</div>
          ))}
        </div>

        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 10, letterSpacing: "0.1em", fontWeight: 700 }}>COLOR</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
          {COLORS.map(c => (
            <div key={c} onClick={() => setColor(c)} style={{
              width: 30, height: 30, borderRadius: "50%", background: c,
              border: `3px solid ${c === color ? "#fff" : "transparent"}`,
              cursor: "pointer", transition: "all 0.15s",
              transform: c === color ? "scale(1.15)" : "scale(1)"
            }} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "13px",
            borderRadius: 14, background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.4)", cursor: "pointer",
            fontSize: 14, fontFamily: "inherit", fontWeight: 600
          }}>Cancel</button>
          <button onClick={submit} style={{
            flex: 2, padding: "13px",
            borderRadius: 14,
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
            border: "none", color: "#fff", cursor: "pointer",
            fontSize: 14, fontFamily: "inherit", fontWeight: 800,
            boxShadow: `0 4px 20px ${color}44`
          }}>Add Habit ✓</button>
        </div>
      </div>
    </div>
  );
}

// ── Calendar Tab ────────────────────────────────────────────────────
function CalendarTab({ habits }) {
  const now = new Date(), y = now.getFullYear(), m = now.getMonth();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["M","T","W","T","F","S","S"];
  const offset = (new Date(y,m,1).getDay()+6)%7;
  const total  = new Date(y,m+1,0).getDate();
  const todayKey = `${y}-${String(m+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  const doneDays = new Set();
  habits.forEach(h => Object.keys(h.completions||{}).forEach(k => {
    if (h.completions[k]) doneDays.add(k);
  }));

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <span style={{ fontSize:18, fontWeight:800, color:"#fff" }}>{monthNames[m]} {y}</span>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ width:8,height:8,borderRadius:2,background:"#22c55e",display:"inline-block" }}/>All done
        </span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
        {dayNames.map((d,i)=>(
          <div key={i} style={{ textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.25)", padding:"0 0 8px", fontWeight:600 }}>{d}</div>
        ))}
        {Array(offset).fill(null).map((_,i)=><div key={"e"+i}/>)}
        {Array(total).fill(null).map((_,i)=>{
          const d=i+1;
          const key=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const done=doneDays.has(key), isToday=key===todayKey;
          const isFuture = new Date(key) > now;
          return (
            <div key={d} style={{
              aspectRatio:"1", borderRadius:10,
              background: done ? "#22c55e" : isToday ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
              border: isToday ? "1.5px solid rgba(255,255,255,0.3)" : "1px solid transparent",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight: isToday||done ? 700:400,
              color: done ? "#fff" : isFuture ? "rgba(255,255,255,0.15)" : isToday ? "#fff" : "rgba(255,255,255,0.4)"
            }}>{d}</div>
          );
        })}
      </div>
    </div>
  );
}

// ── Analytics Tab ───────────────────────────────────────────────────
function AnalyticsTab({ habits }) {
  const days = Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(6-i));
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  });
  let totalP=habits.length*7, totalD=0;
  habits.forEach(h=>days.forEach(d=>{if(h.completions?.[d])totalD++;}));
  const overall=totalP?Math.round(totalD/totalP*100):0;

  return (
    <div>
      <div style={{
        background:"rgba(255,255,255,0.04)", borderRadius:18,
        padding:"24px", marginBottom:24,
        border:"1px solid rgba(255,255,255,0.07)",
        display:"flex", alignItems:"center", justifyContent:"space-between"
      }}>
        <div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em", fontWeight:600 }}>7-DAY SUCCESS RATE</div>
          <div style={{ fontSize:46, fontWeight:900, color:"#fff", letterSpacing:"-2px", marginTop:4 }}>{overall}<span style={{fontSize:26}}>%</span></div>
        </div>
        <div style={{
          width:68, height:68, borderRadius:"50%",
          background:`conic-gradient(#a78bfa ${overall*3.6}deg, rgba(255,255,255,0.06) 0deg)`,
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>
          <div style={{ width:54,height:54,borderRadius:"50%",background:"#0f0f0f",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <span style={{fontSize:22}}>📊</span>
          </div>
        </div>
      </div>

      <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:16, letterSpacing:"0.1em", fontWeight:700 }}>BY HABIT</div>
      {habits.length===0 && <p style={{color:"rgba(255,255,255,0.25)",fontSize:14}}>No habits yet.</p>}
      {habits.map((h,i)=>{
        const done=days.filter(d=>h.completions?.[d]).length;
        const pct=Math.round(done/7*100);
        const c=h.color||"#818cf8";
        return (
          <div key={h.id} style={{ marginBottom:18 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{fontSize:16}}>{h.icon}</span>
                <span style={{ fontSize:13, color:"rgba(255,255,255,0.8)", fontWeight:600 }}>{h.name}</span>
              </div>
              <span style={{
                fontSize:12, fontWeight:800, color:c,
                background:`${c}22`, padding:"2px 10px", borderRadius:20
              }}>{pct}%</span>
            </div>
            <div style={{ height:8, background:"rgba(255,255,255,0.06)", borderRadius:4, overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${pct}%`,
                background:`linear-gradient(90deg, ${c}88, ${c})`,
                borderRadius:4, transition:"width 0.6s cubic-bezier(.4,0,.2,1)"
              }}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────
function todayKey() {
  const n=new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`;
}

// ── Main App ────────────────────────────────────────────────────────
export default function App() {
  const [habits, setHabits] = useState(()=>{
    try{return JSON.parse(localStorage.getItem("ht_v2")||"[]");}catch{return[];}
  });
  const [tab, setTab]       = useState("today");
  const [showAdd, setShowAdd] = useState(false);

  useEffect(()=>{
    localStorage.setItem("ht_v2", JSON.stringify(habits));
  },[habits]);

  const today     = todayKey();
  const now       = new Date();
  const doneCount = habits.filter(h=>h.completions?.[today]).length;
  const progress  = habits.length ? Math.round(doneCount/habits.length*100) : 0;
  const bestStreak= habits.length ? Math.max(...habits.map(h=>h.streak||0)) : 0;

  const addHabit=(name,icon,color)=>setHabits(p=>[...p,{
    id:Date.now().toString(),name,icon,color,
    completions:{},notes:{},streak:0
  }]);

  const toggleHabit=id=>setHabits(p=>p.map(h=>{
    if(h.id!==id)return h;
    const comps={...(h.completions||{})};
    const was=comps[today];
    if(was)delete comps[today]; else comps[today]=true;
    let streak=0,d=new Date();
    const tmp=was?comps:{...comps,[today]:true};
    while(true){
      const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      if(tmp[k]){streak++;d.setDate(d.getDate()-1);}else break;
    }
    return{...h,completions:comps,completed:!was,streak};
  }));

  const deleteHabit=id=>setHabits(p=>p.filter(h=>h.id!==id));
  const saveNote=(id,note)=>setHabits(p=>p.map(h=>
    h.id===id?{...h,note,notes:{...(h.notes||{}),[today]:note}}:h
  ));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus { border-color: rgba(255,255,255,0.2) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        /* ── Responsive layout ── */
        .app-shell {
          min-height: 100vh;
          background: #0a0a0f;
          display: flex;
          font-family: 'Outfit', sans-serif;
        }

        /* Mobile: single column, no sidebar */
        .sidebar { display: none; }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding-bottom: 80px; /* room for bottom nav on mobile */
        }

        .content-inner {
          width: 100%;
          max-width: 560px;
          margin: 0 auto;
          padding: 28px 20px;
        }

        /* Bottom nav: mobile only */
        .bottom-nav {
          display: flex;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: rgba(10,10,15,0.95);
          border-top: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          z-index: 100;
          padding: 8px 0 12px;
        }

        .bottom-nav button {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          padding: 4px 0;
          transition: color 0.2s;
        }
        .bottom-nav button.active { color: #fff; }
        .bottom-nav button .nav-icon { font-size: 18px; }

        /* ── Desktop: sidebar layout ── */
        @media (min-width: 768px) {
          .sidebar {
            display: flex;
            flex-direction: column;
            width: 220px;
            min-height: 100vh;
            background: rgba(255,255,255,0.02);
            border-right: 1px solid rgba(255,255,255,0.06);
            padding: 36px 0;
            position: sticky;
            top: 0;
            height: 100vh;
            flex-shrink: 0;
          }

          .sidebar-logo {
            padding: 0 24px 32px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }

          .sidebar-nav {
            flex: 1;
            padding: 24px 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .sidebar-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 11px 14px;
            border-radius: 12px;
            background: none;
            border: none;
            color: rgba(255,255,255,0.35);
            cursor: pointer;
            font-family: 'Outfit', sans-serif;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.01em;
            width: 100%;
            text-align: left;
            transition: all 0.18s;
          }
          .sidebar-btn:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); }
          .sidebar-btn.active { background: rgba(255,255,255,0.08); color: #fff; }
          .sidebar-btn .sicon { font-size: 18px; width: 22px; text-align: center; }

          .sidebar-footer {
            padding: 0 12px;
          }

          .bottom-nav { display: none; }

          .main-content { padding-bottom: 0; }
          .content-inner { max-width: 700px; padding: 40px 36px; }
        }

        @media (min-width: 1100px) {
          .sidebar { width: 240px; }
          .content-inner { max-width: 760px; }
        }
      `}</style>

      {/* Glow */}
      <div style={{
        position:"fixed", top:-200, left:"50%", transform:"translateX(-50%)",
        width:700, height:500, borderRadius:"50%",
        background:"radial-gradient(ellipse, rgba(129,140,248,0.07) 0%, transparent 70%)",
        pointerEvents:"none", zIndex:0
      }}/>

      <div className="app-shell">

        {/* ── Sidebar (desktop) ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.25)", letterSpacing:"0.12em", fontWeight:700, marginBottom:6 }}>
              {now.toLocaleDateString("en-US",{weekday:"long"}).toUpperCase()}
            </div>
            <div style={{ fontSize:22, fontWeight:900, color:"#fff", letterSpacing:"-0.8px", lineHeight:1.15 }}>
              Habit<br/><span style={{ color:"rgba(255,255,255,0.3)" }}>Tracker</span>
            </div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.2)", marginTop:8 }}>
              {now.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
            </div>
          </div>

          <nav className="sidebar-nav">
            {[
              { id:"today",     icon:"✦", label:"Today" },
              { id:"calendar",  icon:"◈", label:"Calendar" },
              { id:"analytics", icon:"◉", label:"Analytics" },
            ].map(t=>(
              <button key={t.id} className={`sidebar-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
                <span className="sicon">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button onClick={()=>setShowAdd(true)} style={{
              width:"100%", padding:"12px 14px",
              borderRadius:14,
              background:"linear-gradient(135deg, rgba(129,140,248,0.2), rgba(129,140,248,0.08))",
              border:"1px solid rgba(129,140,248,0.25)",
              color:"#a5b4fc", cursor:"pointer",
              fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              transition:"all 0.2s"
            }}
              onMouseOver={e=>e.currentTarget.style.background="linear-gradient(135deg, rgba(129,140,248,0.3), rgba(129,140,248,0.12))"}
              onMouseOut={e=>e.currentTarget.style.background="linear-gradient(135deg, rgba(129,140,248,0.2), rgba(129,140,248,0.08))"}
            >
              <span style={{fontSize:18}}>+</span> New Habit
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="main-content" style={{ position:"relative", zIndex:1 }}>
          <div className="content-inner">

            {/* Mobile header */}
            <div style={{ animation:"fadeUp 0.5s ease both" }} className="mobile-header">
              <style>{`
                .mobile-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                @media (min-width: 768px) { .mobile-header { display: none; } }
              `}</style>
              <div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.25)", letterSpacing:"0.12em", fontWeight:700, marginBottom:4 }}>
                  {now.toLocaleDateString("en-US",{weekday:"long"}).toUpperCase()}
                </div>
                <h1 style={{ fontSize:26, fontWeight:900, color:"#fff", letterSpacing:"-0.8px", lineHeight:1.1 }}>
                  Habit<span style={{ color:"rgba(255,255,255,0.3)" }}> Tracker</span>
                </h1>
              </div>
              <ProgressRing percent={progress} />
            </div>

            {/* Desktop page title area */}
            <div style={{ marginBottom:28, animation:"fadeUp 0.5s ease both" }} className="desktop-title">
              <style>{`
                .desktop-title { display: none; }
                @media (min-width: 768px) {
                  .desktop-title { display: flex; justify-content: space-between; align-items: flex-start; }
                }
              `}</style>
              <div>
                <h2 style={{ fontSize:30, fontWeight:900, color:"#fff", letterSpacing:"-1px", marginBottom:4 }}>
                  {tab === "today" ? "Today" : tab === "calendar" ? "Calendar" : "Analytics"}
                </h2>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.3)" }}>
                  {now.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <ProgressRing percent={progress} />
              </div>
            </div>

            {/* Stat cards */}
            <div style={{ display:"flex", gap:12, marginBottom:28, animation:"fadeUp 0.5s ease 0.1s both" }}>
              <StatCard value={habits.length} label="TOTAL" accent="#818cf8" />
              <StatCard value={doneCount} label="DONE TODAY" accent="#22c55e" />
              <StatCard value={`${bestStreak}🔥`} label="BEST STREAK" accent="#f97316" />
            </div>

            {/* Mobile tab bar (inline pills) — hidden on desktop */}
            <div style={{ marginBottom:24, animation:"fadeUp 0.5s ease 0.15s both" }} className="mobile-tabs">
              <style>{`
                .mobile-tabs { display: flex; }
                @media (min-width: 768px) { .mobile-tabs { display: none; } }
              `}</style>
              <div style={{
                display:"flex", gap:4, width:"100%",
                background:"rgba(255,255,255,0.04)",
                borderRadius:16, padding:5,
                border:"1px solid rgba(255,255,255,0.06)",
              }}>
                {[
                  { id:"today", icon:"✦" },
                  { id:"calendar", icon:"◈" },
                  { id:"analytics", icon:"◉" }
                ].map(t=>(
                  <button key={t.id} onClick={()=>setTab(t.id)} style={{
                    flex:1, padding:"9px 6px",
                    borderRadius:12, border:"none",
                    background: tab===t.id ? "rgba(255,255,255,0.09)" : "transparent",
                    color: tab===t.id ? "#fff" : "rgba(255,255,255,0.3)",
                    fontWeight: tab===t.id ? 700 : 500,
                    fontSize:13, cursor:"pointer", fontFamily:"inherit",
                    transition:"all 0.2s"
                  }}>
                    {t.icon} {t.id.charAt(0).toUpperCase()+t.id.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            {tab==="today" && (
              <div style={{ animation:"fadeUp 0.4s ease both" }}>
                {habits.length===0 ? (
                  <div style={{
                    textAlign:"center", padding:"60px 20px",
                    color:"rgba(255,255,255,0.2)", fontSize:15
                  }}>
                    <div style={{fontSize:48,marginBottom:14}}>🌱</div>
                    Start building your habits today
                  </div>
                ) : (
                  habits.map((h,i)=>(
                    <HabitCard key={h.id} index={i}
                      habit={{...h,completed:!!h.completions?.[today]}}
                      onToggle={toggleHabit} onDelete={deleteHabit} onNote={saveNote}
                    />
                  ))
                )}
                <button
                  onClick={()=>setShowAdd(true)}
                  style={{
                    width:"100%", padding:"15px",
                    borderRadius:18,
                    border:"1.5px dashed rgba(255,255,255,0.1)",
                    background:"rgba(255,255,255,0.02)",
                    color:"rgba(255,255,255,0.3)",
                    fontSize:14, cursor:"pointer",
                    display:"flex", alignItems:"center",
                    justifyContent:"center", gap:8,
                    fontFamily:"inherit", fontWeight:600,
                    transition:"all 0.2s", marginTop:6
                  }}
                  onMouseOver={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.25)";e.currentTarget.style.color="rgba(255,255,255,0.6)";}}
                  onMouseOut={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";e.currentTarget.style.color="rgba(255,255,255,0.3)";}}
                >
                  <span style={{fontSize:18}}>+</span> Add habit
                </button>
              </div>
            )}

            {tab==="calendar"  && <div style={{animation:"fadeUp 0.4s ease both"}}><CalendarTab habits={habits}/></div>}
            {tab==="analytics" && <div style={{animation:"fadeUp 0.4s ease both"}}><AnalyticsTab habits={habits}/></div>}
          </div>
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="bottom-nav">
        {[
          { id:"today",     icon:"✦", label:"Today" },
          { id:"calendar",  icon:"◈", label:"Calendar" },
          { id:"analytics", icon:"◉", label:"Analytics" },
        ].map(t=>(
          <button key={t.id} className={tab===t.id?"active":""} onClick={()=>setTab(t.id)}>
            <span className="nav-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
        <button onClick={()=>setShowAdd(true)} style={{ color: "rgba(255,255,255,0.3)" }}>
          <span className="nav-icon" style={{ fontSize:22, lineHeight:1 }}>+</span>
          Add
        </button>
      </nav>

      {showAdd && <AddModal onAdd={addHabit} onClose={()=>setShowAdd(false)}/>}
    </>
  );
}