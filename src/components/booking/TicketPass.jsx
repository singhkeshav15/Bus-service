import React, { useEffect, useRef } from "react";
import I from "../../constants/icons.jsx";
import { fmtDate } from "../../utils/helpers.js";

export function TicketPass({ booking, settings, onClose }) {
  const ticketRef = useRef(null);

  // Animation on mount
  useEffect(() => {
    if (ticketRef.current) {
      ticketRef.current.style.opacity = 0;
      ticketRef.current.style.transform = "scale(0.95) translateY(20px)";
      setTimeout(() => {
        ticketRef.current.style.transition = "all 0.6s cubic-bezier(0.16,1,0.3,1)";
        ticketRef.current.style.opacity = 1;
        ticketRef.current.style.transform = "scale(1) translateY(0)";
      }, 50);
    }
  }, []);

  if (!booking) return null;

  return (
    <div style={{ minHeight: "100vh", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Background ambient light */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "80vw", height: "80vw", maxWidth: 600, maxHeight: 600, background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }} ref={ticketRef}>
        {/* Header Action */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ color: "var(--t2)", padding: 8 }}>{I.arrowLeft} Back</button>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 2 }}>Digital Pass</div>
        </div>

        {/* --- TICKET START --- */}
        <div id="boarding-pass" style={{ position: "relative", filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.5))" }}>
          
          {/* Main Ticket Body */}
          <div style={{ background: "#111", borderRadius: "24px 24px 0 0", border: "1px solid var(--b2)", borderBottom: "none", overflow: "hidden", position: "relative" }}>
            
            {/* Top Pattern Header */}
            <div style={{ background: "linear-gradient(135deg, var(--a), var(--a3))", padding: "24px 24px 32px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
              <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", marginBottom: 4 }}>
                    <div style={{ background: "rgba(255,255,255,0.2)", padding: 6, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {I.bus}
                    </div>
                    <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>{settings.brandName}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Boarding Pass</div>
                </div>
                {booking.payment_status === "approved" ? (
                  <div style={{ background: "#fff", color: "var(--a)", fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 100, letterSpacing: 1 }}>CONFIRMED</div>
                ) : (
                  <div style={{ background: "var(--t2)", color: "#111", fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 100, letterSpacing: 1 }}>{booking.payment_status.toUpperCase()}</div>
                )}
              </div>
            </div>

            {/* Ticket Contents */}
            <div style={{ padding: "0 24px 24px", background: "#111", position: "relative" }}>
              {/* Overlapping Passenger Card */}
              <div style={{ background: "var(--c2)", border: "1px solid var(--b)", borderRadius: 16, padding: 18, marginTop: -20, position: "relative", zIndex: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
                <div style={{ fontSize: 10, color: "var(--t3)", textTransform: "uppercase", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>Passenger Name</div>
                <div style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 12 }}>{booking.name}</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--t3)", textTransform: "uppercase", fontWeight: 600 }}>Phone</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--t2)" }}>+91 {booking.phone}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: "var(--t3)", textTransform: "uppercase", fontWeight: 600 }}>Seats</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--t2)" }}>{booking.group_size || 1}</div>
                  </div>
                </div>
              </div>

              {/* Journey Details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 16px", marginTop: 24 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--t3)", textTransform: "uppercase", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>{I.map} Exam Center</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>{booking.center}</div>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--t3)", textTransform: "uppercase", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>{I.clock} Date & Time</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{booking.exam_date ? fmtDate(booking.exam_date) : "—"}</div>
                  <div style={{ fontSize: 12, color: "var(--t2)" }}>{booking.slot}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Tear Line / Divider */}
          <div style={{ display: "flex", alignItems: "center", position: "relative", zIndex: 2, height: 32, background: "#111", borderLeft: "1px solid var(--b2)", borderRight: "1px solid var(--b2)" }}>
            <div style={{ position: "absolute", left: -16, width: 32, height: 32, borderRadius: "50%", background: "var(--bg)", borderRight: "1px solid var(--b2)", boxShadow: "inset -8px 0 12px rgba(0,0,0,0.2)" }} />
            <div style={{ flex: 1, borderTop: "2px dashed var(--b2)" }} />
            <div style={{ position: "absolute", right: -16, width: 32, height: 32, borderRadius: "50%", background: "var(--bg)", borderLeft: "1px solid var(--b2)", boxShadow: "inset 8px 0 12px rgba(0,0,0,0.2)" }} />
          </div>

          {/* Bottom Barcode Section */}
          <div style={{ background: "#111", borderRadius: "0 0 24px 24px", border: "1px solid var(--b2)", borderTop: "none", padding: "24px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--t3)", textTransform: "uppercase", fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>Booking Reference</div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              {/* Mock Barcode generated via divs */}
              <div style={{ display: "flex", height: 48, gap: 2, opacity: 0.8 }}>
                {[3,1,2,4,1,1,3,2,1,4,2,2,1,3,1,1,2,3,4,1,2,1,3].map((w, i) => (
                  <div key={i} style={{ width: w * 2, background: "#fff", borderRadius: 1 }} />
                ))}
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--a)", fontWeight: 700, letterSpacing: 6 }}>
              {booking.booking_ref?.toUpperCase() || booking.id?.slice(0,8).toUpperCase()}
            </div>
          </div>
        </div>
        {/* --- TICKET END --- */}

        {/* Actions */}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          {booking.payment_status === "approved" ? (
            <div>
              <div style={{ fontSize: 13, color: "var(--t2)", marginBottom: 16 }}>Take a screenshot of this pass for your records.</div>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px", borderRadius: 14 }} onClick={() => window.print()}>
                Download / Print Pass
              </button>
            </div>
          ) : (
            <div style={{ padding: 16, border: "1px solid var(--b)", borderRadius: 14, background: "rgba(255,255,255,0.02)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Status: {booking.payment_status.toUpperCase()}</div>
              <div style={{ fontSize: 13, color: "var(--t3)" }}>
                {booking.payment_status === "pending" ? "Your booking is under review. Check back later." : "Your booking was rejected. Please contact support."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
