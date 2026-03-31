import React, { useEffect, useState } from "react";
import I from "../../constants/icons.jsx";
import { Counter } from "../ui/Counter.jsx";
import { HeroGraphic } from "../ui/HeroGraphic.jsx";

export function Landing({ settings, seatCounts, onBook, onAdmin }) {
  const approvedCount = seatCounts ? seatCounts.reduce((sum, s) => sum + parseInt(s.used_seats || 0, 10), 0) : 0;
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = 1;
            e.target.style.transform = "translateY(0)";
            ob.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)";
      ob.observe(el);
    });
    return () => ob.disconnect();
  }, []);

  return (
    <div>
      {/* Announcement Banner */}
      {settings.announcementOn && settings.announcement && (
        <div style={{
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.04), transparent)",
          borderBottom: "1px solid var(--b)",
          padding: "11px 20px",
          textAlign: "center",
          fontSize: 12,
          color: "var(--t2)",
          fontWeight: 600,
          letterSpacing: 0.3,
          position: "relative",
          overflow: "hidden",
        }}>
          <span style={{ color: "var(--a)", marginRight: 10, fontWeight: 800 }}>●</span>
          {settings.announcement}
        </div>
      )}

      {/* NAV */}
      <nav className="nav">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 13,
            background: "linear-gradient(135deg, var(--a), var(--a3))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 20px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}>
            <span style={{ color: "#fff", transform: "scale(1.1)" }}>{I.bus}</span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 18, letterSpacing: -0.5, color: "var(--t)", lineHeight: 1.1 }}>
              {settings.brandName}
            </div>
            <div style={{ fontSize: 9, color: "var(--t3)", fontWeight: 700, letterSpacing: 1.5, marginTop: 3, textTransform: "uppercase" }}>
              NPTEL Transit Network
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn btn-ghost btn-sm hide-sm" onClick={() => setShowSupport(true)} style={{ gap: 6 }}>
            {I.phone} Support
          </button>
          <button className="btn btn-glass btn-sm" onClick={onAdmin} style={{ gap: 6 }}>
            {I.gear} Portal
          </button>
          <button className="btn btn-primary btn-sm hide-sm" onClick={onBook} style={{ gap: 6 }}>
            Book Now {I.arrow}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
        {/* Ambient orbs */}
        <div style={{ position: "absolute", top: "10%", right: "8%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(48px)", animation: "float 14s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(64px)", animation: "float 20s ease-in-out infinite reverse" }} />

        <div className="hero-grid" style={{ position: "relative", zIndex: 1 }}>
          <div>
            {/* Badge */}
            <div className="anim-fadeup d1" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 100, padding: "7px 18px 7px 10px", fontSize: 11.5, color: "var(--t2)", marginBottom: 30, fontWeight: 600, backdropFilter: "blur(12px)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "var(--a)", color: "#fff", borderRadius: 100, padding: "3px 10px", fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>LIVE</span>
              MAY 2025 EXAM BOOKINGS OPEN
            </div>

            <h1 className="anim-fadeup d2" style={{ fontFamily: "var(--font-head)", fontSize: "clamp(36px, 8vw, 72px)", fontWeight: 900, lineHeight: 0.95, marginBottom: 24, letterSpacing: -2, color: "#fff" }}>
              Your Exam,<br />
              <span className="text-grad">Our Route.</span>
            </h1>

            <p className="anim-fadeup d3" style={{ color: "var(--t3)", fontSize: 16.5, lineHeight: 1.65, marginBottom: 36, maxWidth: 480, fontWeight: 400 }}>
              {settings.tagline}. Verified seats, real-time availability, and seamless booking — built for NPTEL students.
            </p>

            <div className="anim-fadeup d4" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 44 }}>
              <button className="btn btn-primary" style={{ fontSize: 15.5, padding: "16px 36px", borderRadius: 14, flex: "1 1 auto" }} onClick={onBook}>
                Reserve My Seat {I.arrow}
              </button>
              <button className="btn btn-ghost hide-sm" style={{ fontSize: 15.5, padding: "16px 28px", borderRadius: 14 }} onClick={() => setShowSupport(true)}>
                View Schedule
              </button>
            </div>

            {/* Live feed widget */}
            <div className="anim-fadeup d5" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid var(--b2)", borderRadius: 18, padding: "18px 20px", backdropFilter: "blur(20px)", maxWidth: 480 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="glow-dot" />
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--t3)", letterSpacing: 1.2, textTransform: "uppercase" }}>System Live</span>
                </div>
                <span style={{ fontSize: 10, color: "var(--green)", fontWeight: 700, fontFamily: "var(--font-mono)", background: "rgba(16,185,129,0.08)", padding: "3px 10px", borderRadius: 100, border: "1px solid rgba(16,185,129,0.15)" }}>ALL SYSTEMS GO</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 13, color: "var(--t2)", display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ color: "var(--a)", fontFamily: "var(--font-mono)", fontSize: 10.5, minWidth: 36 }}>13:10</span>
                  <span>Syncing seat availability across {settings.centers.length} exam centers...</span>
                </div>
                <div style={{ height: 1, background: "var(--b)" }} />
                <div style={{ fontSize: 13, color: "#fff", display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ color: "var(--a)", fontFamily: "var(--font-mono)", fontSize: 10.5, minWidth: 36 }}>13:11</span>
                  <span style={{ fontWeight: 500 }}>Booking engine ready. {approvedCount > 0 ? `${approvedCount} seats confirmed.` : "All slots available."}</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="anim-fadeup d6" style={{ display: "flex", gap: "clamp(20px,5vw,40px)", marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--b)", flexWrap: "wrap" }}>
              {[
                { v: approvedCount || "0", l: "Booked Seats", c: "var(--a)" },
                { v: settings.centers.length, l: "Exam Centers", c: "#fff" },
                { v: "100%", l: "Safety Record", c: "var(--green)" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 30, fontWeight: 800, fontFamily: "var(--font-head)", color: s.c, letterSpacing: -1, lineHeight: 1 }}>
                    {typeof s.v === "number" ? <Counter target={s.v} /> : s.v}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--t3)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginTop: 5 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero graphic */}
          <div className="anim-fadeup hide-sm" style={{ perspective: 1200 }}>
            <div style={{ transform: "rotateY(-8deg) rotateX(6deg)", transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
              <HeroGraphic />
            </div>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px 100px" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 100, padding: "6px 18px", marginBottom: 20 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 700, color: "var(--a)", letterSpacing: 1.5 }}>THE PROCESS</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-head)", fontSize: 38, fontWeight: 900, color: "#fff", letterSpacing: -1.5, marginBottom: 12 }}>Built for Simplicity</h2>
          <p style={{ color: "var(--t3)", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>Four quick steps between you and a confirmed seat on exam day.</p>
        </div>

        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 }}>
          {[
            { n: "01", icon: "📍", t: "Pick Your Route", d: "Select your exam center, date, and departure slot that works for your schedule." },
            { n: "02", icon: "🆔", t: "Verify Identity", d: "Provide your academic details for boarding verification and booking security." },
            { n: "03", icon: "⚡", t: "Pay via UPI", d: "Instant payment through PhonePe, GPay, or Paytm. Scan QR or use UPI ID." },
            { n: "04", icon: "🎟️", t: "Seat Confirmed", d: "Receive your unique Booking ID. We verify within 1–3 hours via WhatsApp." },
          ].map((s, i) => (
            <div key={i} className="card card-hover" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: i === 0 ? "linear-gradient(90deg,var(--a),var(--a2))" : "transparent", borderRadius: "20px 20px 0 0" }} />
              <div style={{ fontSize: 26, marginBottom: 20 }}>{s.icon}</div>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16.5, marginBottom: 10, color: "#fff" }}>{s.t}</div>
              <div style={{ fontSize: 13.5, color: "var(--t3)", lineHeight: 1.65 }}>{s.d}</div>
              <div style={{ marginTop: 22, display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 6, fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--a)", fontWeight: 700 }}>
                STEP {s.n}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ROUTES GRID ── */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px 100px" }}>
        <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 700, color: "var(--a)", letterSpacing: 1.5, marginBottom: 12, textTransform: "uppercase" }}>NETWORK MAP</div>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: -1.5, marginBottom: 0 }}>Available Centers</h2>
          </div>
          <button className="btn btn-primary" onClick={onBook} style={{ gap: 8 }}>Book a Seat {I.arrow}</button>
        </div>

        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
          {settings.centers.map((c, i) => {
            const totalBooked = seatCounts
              ? seatCounts.filter((s) => s.center === c.id).reduce((sum, s) => sum + parseInt(s.used_seats || 0, 10), 0)
              : 0;
            const totalSeats = settings.seatsPerSlot * settings.slots.length * settings.dates.length;
            const pct = Math.min(100, (totalBooked / Math.max(1, totalSeats)) * 100);
            const statusColor = pct > 90 ? "var(--red)" : pct > 70 ? "#FBBF24" : "var(--green)";
            const statusLabel = pct > 90 ? "Almost Full" : pct > 70 ? "Filling Fast" : "Available";

            return (
              <div key={c.id} className="card card-hover" style={{ padding: 26, cursor: "pointer" }} onClick={onBook}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <h3 style={{ fontWeight: 800, fontSize: 17, color: "#fff", lineHeight: 1 }}>{c.name}</h3>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--t3)", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ color: "var(--a)" }}>{I.map}</span> {c.city}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 26, color: "#fff", lineHeight: 1 }}>₹{c.price}</div>
                    <div style={{ fontSize: 9, color: "var(--t3)", fontWeight: 700, letterSpacing: 1, marginTop: 3 }}>PER SEAT</div>
                  </div>
                </div>

                <div style={{ fontSize: 12.5, color: "var(--t3)", lineHeight: 1.5, background: "rgba(255,255,255,0.02)", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--b)", marginBottom: 18 }}>
                  {c.address}
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor, boxShadow: `0 0 8px ${statusColor}` }} />
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: statusColor }}>{statusLabel}</span>
                    </div>
                    <span style={{ fontSize: 10.5, color: "var(--t3)", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{totalBooked} / {totalSeats}</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${statusColor}, ${statusColor}aa)`, borderRadius: 10, transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── TRUST STATS ── */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px 100px" }}>
        <div className="reveal cyber-card">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: 34, fontWeight: 900, color: "#fff", letterSpacing: -1.5 }}>Why Students Trust Us</h2>
            <p style={{ color: "var(--t3)", marginTop: 10, fontSize: 14.5 }}>The most reliable exam transport service for NPTEL candidates.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 40 }}>
            {[
              { t: "On-Time Rate", v: "100%", d: "Zero delays across all routes" },
              { t: "Bookings Secured", v: approvedCount > 0 ? `${approvedCount}+` : "500+", d: "Students transported safely" },
              { t: "Success Rate", v: "99.9%", d: "Confirmed seats, kept" },
              { t: "Support", v: "24/7", d: "WhatsApp + voice support" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 38, fontWeight: 900, color: "var(--a)", fontFamily: "var(--font-head)", marginBottom: 8, letterSpacing: -1 }}>{s.v}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 5 }}>{s.t}</div>
                <div style={{ fontSize: 12.5, color: "var(--t3)", lineHeight: 1.5 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid var(--b)", padding: "52px 28px 40px", background: "rgba(0,0,0,0.4)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,var(--a),var(--a3))", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 14 }}>{I.bus}</span>
            </div>
            <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 18, letterSpacing: -0.5, color: "#fff" }}>{settings.brandName}</span>
          </div>
          <div style={{ fontSize: 13.5, color: "var(--t3)", maxWidth: 480, textAlign: "center", lineHeight: 1.6 }}>
            {settings.footerNote}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowSupport(true)} style={{ gap: 6 }}>{I.phone} Contact</button>
            <button className="btn btn-ghost btn-sm" onClick={onAdmin} style={{ gap: 6 }}>{I.gear} Admin</button>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--t4)", letterSpacing: 1.5, textTransform: "uppercase" }}>
            © 2025 {settings.brandName} · All Rights Reserved · v2.4
          </div>
        </div>
      </footer>

      {showSupport && <SupportModal settings={settings} onClose={() => setShowSupport(false)} />}

      {/* ── Sticky mobile bottom CTA ── */}
      <div className="mobile-cta">
        <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowSupport(true)}>
          {I.phone} Support
        </button>
        <button className="btn btn-primary" style={{ flex: 2, justifyContent: "center" }} onClick={onBook}>
          Book Seat {I.arrow}
        </button>
      </div>
    </div>
  );
}

function SupportModal({ settings, onClose }) {
  const [copied, setCopied] = useState("");
  const copy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="mask" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 22, color: "#fff" }}>Get Support</div>
            <div style={{ fontSize: 12.5, color: "var(--t3)", marginTop: 4 }}>We're here to help you, anytime.</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: 10, borderRadius: 12 }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* WhatsApp */}
          <div style={{ background: "rgba(37,211,102,0.04)", border: "1px solid rgba(37,211,102,0.15)", borderRadius: 18, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(37,211,102,0.1)", color: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {I.wa}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--t3)" }}>WhatsApp</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 17, color: "#fff", marginTop: 3, fontWeight: 600 }}>+91 {settings.whatsapp}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => copy(settings.whatsapp, "wa")}>
                {copied === "wa" ? "✓ Copied" : "Copy"}
              </button>
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"
                className="btn btn-sm" style={{ flex: 2, background: "#25D366", color: "#fff", fontWeight: 700 }}>
                Chat Now {I.arrow}
              </a>
            </div>
          </div>

          {/* Phone */}
          <div style={{ background: "var(--c2)", border: "1px solid var(--b)", borderRadius: 18, padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(99,102,241,0.1)", color: "var(--a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {I.phone}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--t3)" }}>Call Support</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 17, color: "#fff", marginTop: 3, fontWeight: 600 }}>+91 {settings.supportPhone}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => copy(settings.supportPhone, "call")}>
                {copied === "call" ? "✓ Copied" : "Copy"}
              </button>
              <a href={`tel:${settings.supportPhone}`} className="btn btn-primary btn-sm" style={{ flex: 2 }}>
                Call Now {I.arrow}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
