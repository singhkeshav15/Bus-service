import { useRef, useState } from "react";
import I from "../../constants/icons.jsx";
import { fmtDate } from "../../utils/helpers.js";
import html2canvas from "html2canvas";

export function Confirmation({ booking, settings, onHome }) {
  const receiptRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    try {
      // Temporarily remove animation classes that cause html2canvas to render blank
      receiptRef.current.classList.remove("anim-fadeup", "d3");
      receiptRef.current.style.opacity = "1";
      receiptRef.current.style.transform = "none";

      const canvas = await html2canvas(receiptRef.current, { backgroundColor: "#1e293b", scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `Booking-${booking.id}.png`;
      link.click();

      // Restore classes
      receiptRef.current.classList.add("anim-fadeup", "d3");
      receiptRef.current.style.opacity = "";
      receiptRef.current.style.transform = "";
    } catch (err) {
      console.error("Failed to download receipt:", err);
    }
    setDownloading(false);
  };
  // waMsg removed, admin handles the WhatsApp notification

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      {/* Confetti dots */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute", width: 6, height: 6,
              borderRadius: i % 3 === 0 ? "50%" : "2px",
              background: i % 4 === 0 ? "#F97316" : i % 4 === 1 ? "#FBBF24" : i % 4 === 2 ? "#10B981" : "#3B82F6",
              left: `${5 + i * 4.5}%`, top: `${Math.random() * 40 + 10}%`,
              opacity: 0.6,
              animation: `float ${1.5 + i * 0.2}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      <div style={{ maxWidth: 460, width: "100%", textAlign: "center", position: "relative" }}>
        {/* Success icon */}
        <div className="anim-popin" style={{ marginBottom: 20 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.05))", border: "2px solid rgba(16,185,129,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", position: "relative" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" width="32" height="32">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <div style={{ position: "absolute", inset: -3, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "rgba(16,185,129,0.4)", animation: "spin 2s linear infinite" }} />
          </div>
        </div>

        <h2 className="anim-fadeup d1" style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          Booking Submitted! 🎉
        </h2>
        <p className="anim-fadeup d2" style={{ color: "var(--t2)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          Your seat has been reserved. Payment verification usually takes <strong>1–3 hours</strong>. You'll be notified on WhatsApp once approved.
        </p>

        {/* Booking card */}
        <div ref={receiptRef} className="card anim-fadeup d3" style={{ marginBottom: 16, textAlign: "left", position: "relative", overflow: "hidden", padding: "20px" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,var(--a),var(--a2))" }} />
          {/* Booking ID */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--b)" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 0.6 }}>Booking ID</span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 17, color: "var(--a)", letterSpacing: 2 }}>{booking.id}</span>
          </div>
          {[
            ["Passenger",       booking.name],
            ["Phone",           booking.phone],
            ["College",         booking.college],
            ["Exam Center",     `${booking.centerName}, ${booking.centerCity}`],
            ["Date",            fmtDate(booking.date)],
            ["Time Slot",       booking.slotLabel],
            ["Seats",           booking.groupSize],
            ["Amount Paid",     `₹${booking.price}`],
            ["Payment Status",  "⏳ Under Verification"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,.03)" }}>
              <span style={{ fontSize: 12, color: "var(--t3)" }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{v}</span>
            </div>
          ))}
        </div>

        <div className="anim-fadeup d4" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>📸</div>
            <div style={{ fontSize: 13, color: "#FBBF24", fontWeight: 700, marginBottom: 4 }}>Keep This Safe</div>
            <div style={{ fontSize: 12, color: "var(--t2)" }}>Please take a screenshot of this page immediately. This serves as your proof of booking!</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-ghost" onClick={downloadReceipt} disabled={downloading} style={{ flex: 1, justifyContent: "center", padding: "14px 16px", borderRadius: 12 }}>
              {downloading ? "Saving..." : "⬇\uFE0E Download"}
            </button>
            <button className="btn btn-primary" onClick={onHome} style={{ flex: 2, justifyContent: "center", padding: "14px 24px", borderRadius: 12 }}>
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
