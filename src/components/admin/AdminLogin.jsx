import { useState } from "react";
import I from "../../constants/icons.jsx";

export function AdminLogin({ settings, onLogin, onBack }) {
  const [pw, setPw]     = useState("");
  const [err, setErr]   = useState(false);
  const [show, setShow] = useState(false);

  const go = () => {
    if (pw === settings.adminPass) {
      onLogin();
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 2500);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      {/* Background glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.07) 0%,transparent 70%)" }} />
      </div>

      <div style={{ maxWidth: 380, width: "100%", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg,#F97316,#FBBF24)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 8px 28px rgba(249,115,22,0.4)" }}>
            <span style={{ color: "#fff" }}>{I.gear}</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 24 }}>Admin Panel</h2>
          <p style={{ color: "var(--t3)", fontSize: 13, marginTop: 5 }}>{settings.brandName} · Management Portal</p>
        </div>

        <div className="card" style={{ border: "1px solid var(--b2)" }}>
          <div className="field" style={{ position: "relative" }}>
            <label>{I.lock} Password</label>
            <input
              className="inp"
              type={show ? "text" : "password"}
              placeholder="Enter admin password"
              value={pw}
              style={err ? { borderColor: "var(--red)", boxShadow: "0 0 0 3px rgba(244,63,94,0.1)" } : {}}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
            />
            <button
              onClick={() => setShow((s) => !s)}
              style={{ position: "absolute", right: 12, bottom: 11, background: "none", border: "none", color: "var(--t3)", cursor: "pointer", fontSize: 12 }}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>

          {err && (
            <div style={{ color: "var(--red)", fontSize: 12.5, marginTop: -8, marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}>
              {I.x} Incorrect password. Please try again.
            </div>
          )}

          <button className="btn btn-primary" style={{ width: "100%", padding: 13 }} onClick={go}>
            Login to Admin →
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>{I.arrowLeft} Back to Website</button>
        </div>
        <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "var(--t4)" }}>
          Default password: mk@admin · Change it in Settings tab
        </div>
      </div>
    </div>
  );
}
