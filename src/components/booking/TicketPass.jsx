import React, { useEffect, useRef, useState } from "react";
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

  // 3D Tilt Logic
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glX: 50, glY: 50 });

  const handleMouseMove = (e) => {
    if (!ticketRef.current) return;
    const rect = ticketRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Max rotation 12deg
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -12;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 12;
    
    const glX = (x / rect.width) * 100;
    const glY = (y / rect.height) * 100;

    setTilt({ rx, ry, glX, glY });
  };

  if (!booking) return null;

  return (
    <div style={{ minHeight: "100vh", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Background ambient light */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "80vw", height: "80vw", maxWidth: 600, maxHeight: 600, background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <style>{`
        @keyframes scan-laser {
          0% { left: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes stamp-pop {
          0% { transform: scale(3) rotate(-25deg); opacity: 0; }
          50% { transform: scale(0.85) rotate(15deg); opacity: 1; }
          100% { transform: scale(1) rotate(8deg); opacity: 0.9; }
        }
        @keyframes bg-slide {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }} ref={ticketRef}>
        {/* Header Action */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ color: "var(--t2)", padding: 8 }}>{I.arrowLeft} Back</button>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 2 }}>Digital Pass</div>
        </div>

        {/* --- TICKET START --- */}
        <div 
          id="boarding-pass" 
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTilt({ rx: 0, ry: 0, glX: 50, glY: 50 })}
          style={{ 
            position: "relative", 
            filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.6))",
            transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: tilt.rx === 0 && tilt.ry === 0 ? "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)" : "transform 0.1s ease-out",
            transformStyle: "preserve-3d",
            willChange: "transform"
          }}
        >
          {/* Glare effect */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none", borderRadius: 24,
            background: `radial-gradient(circle at ${tilt.glX}% ${tilt.glY}%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
            transition: tilt.rx === 0 ? "opacity 0.6s ease" : "opacity 0.1s ease",
            opacity: tilt.rx === 0 ? 0 : 1, mixBlendMode: "overlay"
          }} />

          {/* Main Ticket Body */}
          <div style={{ background: "#111", borderRadius: "24px 24px 0 0", border: `1px solid rgba(255,255,255,0.1)`, borderBottom: "none", overflow: "hidden", position: "relative" }}>
            
            {/* Top Pattern Header */}
            <div style={{ background: "linear-gradient(135deg, var(--a), var(--a3))", padding: "24px 24px 32px", position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: "linear-gradient(45deg, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent)", backgroundSize: "40px 40px", animation: "bg-slide 15s linear infinite" }} />
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
              
              {/* Confirmed Stamp Overlay */}
              {booking.payment_status === "approved" && (
                <div style={{ 
                  position: "absolute", top: "50%", right: "10%", 
                  color: "rgba(16, 185, 129, 0.8)", border: "4px solid rgba(16, 185, 129, 0.8)", 
                  padding: "6px 14px", borderRadius: 8, 
                  fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 900, 
                  letterSpacing: 4, animation: "stamp-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                  pointerEvents: "none", opacity: 0, zIndex: 5, filter: "drop-shadow(0 4px 12px rgba(16, 185, 129, 0.2))"
                }}>
                  VERIFIED
                </div>
              )}

              {/* Overlapping Passenger Card */}
              <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 18, marginTop: -20, position: "relative", zIndex: 2, boxShadow: "0 12px 32px rgba(0,0,0,0.4)" }}>
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
          <div style={{ background: "#111", borderRadius: "0 0 24px 24px", border: "1px solid rgba(255,255,255,0.1)", borderTop: "none", padding: "24px", textAlign: "center", position: "relative" }}>
            <div style={{ fontSize: 10, color: "var(--t3)", textTransform: "uppercase", fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>Booking Reference</div>
            
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, position: "relative", width: "fit-content", margin: "0 auto 12px" }}>
              {/* Scanning Laser */}
              <div style={{
                 position: "absolute", top: -4, bottom: -4, width: 2, zIndex: 3,
                 background: "#ef4444", boxShadow: "0 0 12px 3px rgba(239,68,68,0.6)",
                 animation: "scan-laser 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate"
              }} />
              
              {/* Mock Barcode generated via divs */}
              <div style={{ display: "flex", height: 52, gap: 2, opacity: 0.85, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}>
                {[3,1,2,4,1,1,3,2,1,4,3,2,1,3,1,1,2,3,4,1,2,1,3].map((w, i) => (
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
