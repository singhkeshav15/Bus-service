import I from "../../constants/icons.jsx";
import { Counter } from "../ui/Counter.jsx";
import { HeroBus } from "../ui/HeroBus.jsx";
import { fmtDate } from "../../utils/helpers.js";

export function Landing({ settings, bookings, onBook, onAdmin }) {
  const approvedCount = bookings.filter((b) => b.status !== "rejected").length;

  return (
    <div>
      {/* Announcement Banner */}
      {settings.announcementOn && settings.announcement && (
        <div
          style={{
            background: "linear-gradient(90deg,rgba(249,115,22,0.15),rgba(251,191,36,0.1),rgba(249,115,22,0.15))",
            borderBottom: "1px solid rgba(249,115,22,0.2)",
            padding: "10px 20px",
            textAlign: "center",
            fontSize: 13,
            color: "#FDBA74",
            fontWeight: 500,
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
          }}
        >
          {settings.announcement}
        </div>
      )}

      {/* NAV */}
      <nav className="nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg,#F97316,#FBBF24)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(249,115,22,0.4)",
            }}
          >
            <span style={{ color: "#fff" }}>{I.bus}</span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 16, letterSpacing: -0.2 }}>
              {settings.brandName}
            </div>
            <div style={{ fontSize: 9.5, color: "var(--t3)", fontWeight: 500, letterSpacing: 0.4, lineHeight: 1 }}>
              NPTEL EXAM TRANSPORT
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <a href={`tel:${settings.supportPhone}`} className="btn btn-ghost btn-sm hide-sm" style={{ gap: 5 }}>
            {I.phone} {settings.supportPhone}
          </a>
          <button className="btn btn-glass btn-sm" onClick={onAdmin} style={{ gap: 5 }}>
            {I.gear} Admin
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "50px 24px 40px", display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "center" }}>
          <div>
            <div className="anim-fadeup d1" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.22)", borderRadius: 100, padding: "5px 14px", fontSize: 11.5, color: "#FB923C", marginBottom: 20, fontWeight: 700, letterSpacing: 0.3 }}>
              <div className="glow-dot" />
              NPTEL MAY 2025 · BOOKING OPEN
            </div>
            <h1 className="anim-fadeup d2" style={{ fontFamily: "var(--font-head)", fontSize: "clamp(30px,5.5vw,58px)", fontWeight: 800, lineHeight: 1.08, marginBottom: 16, letterSpacing: -1 }}>
              Stress-Free Journey<br />
              to Your <span className="text-grad">Exam Center</span>
            </h1>
            <p className="anim-fadeup d3" style={{ color: "var(--t2)", fontSize: 15, lineHeight: 1.75, marginBottom: 28, maxWidth: 480 }}>
              {settings.tagline}. Book your seat in under 2 minutes — safe, punctual, affordable.
            </p>
            <div className="anim-fadeup d4" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btn-primary" style={{ fontSize: 15, padding: "14px 30px" }} onClick={onBook}>
                Book My Seat {I.arrow}
              </button>
              <a className="btn btn-glass" style={{ fontSize: 14, padding: "14px 20px" }} href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">
                {I.wa} Chat on WhatsApp
              </a>
            </div>

            {/* Trust row */}
            <div className="anim-fadeup d5" style={{ display: "flex", gap: 20, marginTop: 28, flexWrap: "wrap" }}>
              {[
                { v: approvedCount || "0", l: "Students Booked",  c: "var(--a)" },
                { v: settings.centers.length, l: "Exam Routes",   c: "var(--blue)" },
                { v: "100%",                  l: "On-Time Record", c: "var(--green)" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-head)", color: s.c }}>
                    {typeof s.v === "number" ? <Counter target={s.v} /> : s.v}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--t3)", fontWeight: 500, lineHeight: 1.3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="anim-fadeup hide-sm" style={{ animation: "float 4s ease-in-out infinite" }}>
            <HeroBus />
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--a)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Simple Process</div>
          <h2 style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 800 }}>Book in 4 Easy Steps</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
          {[
            { n: "01", icon: "🗺️", t: "Choose Route",   d: "Select exam center, date & time slot that works for you" },
            { n: "02", icon: "👤", t: "Fill Details",    d: "Your name, college and contact info" },
            { n: "03", icon: "💳", t: "Pay via UPI",     d: "Secure UPI payment — PhonePe, GPay or Paytm" },
            { n: "04", icon: "🎟️", t: "Get Booking ID", d: "Instant confirmation with unique booking ID" },
          ].map((s, i) => (
            <div key={i} className="card card-hover anim-fadeup" style={{ animationDelay: `${i * 0.08}s`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 12, right: 14, fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 30, color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{s.t}</div>
              <div style={{ fontSize: 12.5, color: "var(--t3)", lineHeight: 1.65 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ROUTES & PRICING */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--a)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Routes & Fares</div>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 800 }}>Available Exam Centers</h2>
          </div>
          <button className="btn btn-primary btn-sm" onClick={onBook}>Reserve Now →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 12 }}>
          {settings.centers.map((c, i) => {
            const totalBooked = bookings.filter((b) => b.centerId === c.id && b.status !== "rejected").length;
            const seatsPct = Math.min(100, (totalBooked / (settings.seatsPerSlot * settings.slots.length * settings.dates.length)) * 100);
            return (
              <div
                key={c.id}
                className="card anim-fadeup"
                style={{ animationDelay: `${i * 0.07}s`, position: "relative", overflow: "hidden", cursor: "pointer", transition: "all .22s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(249,115,22,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--b)"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                onClick={onBook}
              >
                <div style={{ position: "absolute", top: 0, left: 0, width: `${seatsPct}%`, height: 3, background: "linear-gradient(90deg,var(--a),var(--a2))", transition: "width 1s ease" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{c.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "var(--t3)" }}>
                      {I.map} {c.city}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 22, color: "var(--a)", lineHeight: 1 }}>₹{c.price}</div>
                    <div style={{ fontSize: 9, color: "var(--t3)", letterSpacing: 0.5, fontWeight: 600, textTransform: "uppercase" }}>per seat</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "var(--t3)", display: "flex", alignItems: "center", gap: 4 }}>
                  {I.map} <span>{c.address}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{ background: "linear-gradient(135deg,rgba(249,115,22,0.06),rgba(251,191,36,0.03))", border: "1px solid rgba(249,115,22,0.12)", borderRadius: 20, padding: "32px 28px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Why Students Choose Us</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            {[
              { icon: "⏰", t: "Always On Time",    d: "We depart sharp — never miss your exam slot" },
              { icon: "🛡️", t: "Safe & Reliable",  d: "Experienced drivers on verified vehicles" },
              { icon: "💰", t: "Best Price",        d: "Lowest fares, no hidden charges whatsoever" },
              { icon: "📱", t: "Instant Booking",   d: "Book from phone, get ID in under 2 minutes" },
              { icon: "🪑", t: "Reserved Seat",     d: "Your specific seat is confirmed after verification" },
              { icon: "🔔", t: "WhatsApp Updates",  d: "Get confirmation and reminders on WhatsApp" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{f.t}</div>
                  <div style={{ fontSize: 12, color: "var(--t3)", lineHeight: 1.55 }}>{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--b)", padding: "24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8, color: "var(--a)" }}>
          {I.bus}
          <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15 }}>{settings.brandName}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--t3)" }}>{settings.footerNote}</div>
        <div style={{ fontSize: 11, color: "var(--t4)", marginTop: 8 }}>For support: {settings.supportPhone}</div>
      </footer>
    </div>
  );
}
