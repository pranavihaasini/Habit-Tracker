import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export function AuthScreen() {
  const { t } = useTheme();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));
    const err = mode === "login" ? login(email, password) : signup(email, password);
    if (err) setError(err);
    setLoading(false);
  };

  const switchMode = (m) => {
    setMode(m);
    setError("");
  };

  const inputStyle = {
    width: "100%",
    background: t.inputBg,
    border: `1px solid ${t.border2}`,
    borderRadius: 12,
    padding: "13px 16px",
    color: t.text,
    fontSize: 15,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    marginBottom: 12,
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: t.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🌱</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: t.text, letterSpacing: "-1px", marginBottom: 6 }}>
            Habit<span style={{ color: t.text3 }}>Tracker</span>
          </h1>
          <p style={{ color: t.text3, fontSize: 14 }}>Build better habits, one day at a time.</p>
        </div>

        {/* Card */}
        <div style={{
          background: t.modalBg, borderRadius: 24,
          padding: "32px 28px",
          border: `1px solid ${t.border}`,
          boxShadow: `0 20px 60px ${t.shadow}`,
        }}>
          {/* Tab switcher */}
          <div style={{
            display: "flex", gap: 4,
            background: t.surface, borderRadius: 12,
            padding: 4, marginBottom: 24,
          }}>
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                style={{
                  flex: 1, padding: "9px", borderRadius: 9, border: "none",
                  background: mode === m
                    ? (t.dark ? "rgba(255,255,255,0.1)" : "#fff")
                    : "transparent",
                  color: mode === m ? t.text : t.text3,
                  fontWeight: mode === m ? 700 : 500,
                  fontSize: 13, cursor: "pointer",
                  fontFamily: "inherit", transition: "all 0.2s",
                  boxShadow: mode === m && !t.dark ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            style={inputStyle}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            style={{ ...inputStyle, marginBottom: error ? 8 : 20 }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />

          {error && (
            <div style={{
              color: "#f87171", fontSize: 13, marginBottom: 16,
              padding: "8px 12px",
              background: "rgba(248,113,113,0.1)", borderRadius: 8,
            }}>
              {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            style={{
              width: "100%", padding: "14px", borderRadius: 14, border: "none",
              background: "linear-gradient(135deg, #818cf8, #a78bfa)",
              color: "#fff", fontSize: 15, fontWeight: 800,
              cursor: "pointer", fontFamily: "inherit",
              opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
              boxShadow: "0 4px 20px rgba(129,140,248,0.35)",
            }}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: t.text3 }}>
            {mode === "login" ? "No account? " : "Already have one? "}
            <span
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              style={{ color: "#818cf8", cursor: "pointer", fontWeight: 700 }}
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </span>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: t.text4 }}>
          Demo mode · data stored locally in your browser
        </p>
      </div>
    </div>
  );
}
