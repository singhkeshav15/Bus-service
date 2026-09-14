import { useState, useRef, useEffect } from "react";
import { supabase } from "../../supabase.js";
import { genId, fmtDate, usedSeats } from "../../utils/helpers.js";
import I from "../../constants/icons.jsx";
import { Turnstile } from "@marsidev/react-turnstile";
import imageCompression from "browser-image-compression";

const EMPTY_FORM = {
  centerId: "", date: "", slotId: "",
  name: "", phone: "", email: "", college: "", rollNo: "",
  pickupPoint: "", pickupOther: "",
  utr: "", screenshot: null, screenshotName: "", groupSize: 1,
};

function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

export function BookingFlow({ settings, seatCounts, onConfirm, onBack }) {
  const [submitError, setSubmitError] = useState("");
  const [step, setStep] = useState(1);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const fileRef = useRef();

  const center = settings.centers.find((c) => c.id === form.centerId);
  const slot = settings.slots.find((s) => s.id === form.slotId);
  const avail = center && form.date && form.slotId
    ? settings.seatsPerSlot - usedSeats(seatCounts, form.centerId, form.date, form.slotId)
    : null;
  const totalAmt = center ? center.price * form.groupSize : 0;

  const sf = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const r = new FileReader();
      r.onload = (e) => { sf("screenshot", e.target.result); sf("screenshotName", file.name); };
      r.readAsDataURL(compressedFile);
    } catch (err) {
      console.error("Failed to compress image:", err);
      setSubmitError("Failed to process image compression.");
    }
  };

  const STEPS = ["Selection", "Identity", "Payment", "Verify"];
  const ok1 = form.centerId && form.date && form.slotId && avail > 0;
  const ok2 = form.name.trim() && /^\d{10}$/.test(form.phone.trim()) && form.college.trim() && form.rollNo.trim() && (form.pickupPoint && (form.pickupPoint !== "Other" || form.pickupOther.trim()));
  const utrLen = form.utr.trim().length;
  const ok4 = (utrLen === 11 || utrLen === 12) && form.screenshot && turnstileToken;

  const submit = async () => {
    setSubmitError("");
    setLoading(true);
    try {
      const bookingRef = genId();
      const fileName = `${bookingRef}-${Date.now()}-${form.screenshotName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("payments")
        .upload(`screenshots/${fileName}`, dataURLtoFile(form.screenshot, fileName));
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
      const imageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/payments/${uploadData.path}`;

      const { data: dups } = await supabase
        .from("students")
        .select("phone, roll_no, utr")
        .or(`phone.eq.${form.phone.trim()},roll_no.eq.${form.rollNo.trim()},utr.eq.${form.utr.trim()}`);

      if (dups && dups.length > 0) {
        for (const dup of dups) {
          if (dup.phone === form.phone.trim()) throw new Error("This WhatsApp number is already registered for a booking.");
          if (dup.roll_no === form.rollNo.trim()) throw new Error("This Roll Number has already been used.");
          if (dup.utr === form.utr.trim()) throw new Error("This UTR has already been used. Please provide a valid transaction reference.");
        }
      }

      const { error: dbError } = await supabase.from("students").insert([{
        booking_ref: bookingRef,
        name: form.name.trim(), email: form.email.trim() || null, phone: form.phone.trim(),
        screenshot_url: imageUrl, payment_status: "pending",
        college: form.college.trim(), roll_no: form.rollNo.trim() || null,
        pickup_point: form.pickupPoint === "Other" ? form.pickupOther.trim() : form.pickupPoint,
        utr: form.utr.trim(), center: form.centerId, exam_date: form.date,
        slot: form.slotId, group_size: form.groupSize, price: totalAmt,
      }]);
      if (dbError) throw new Error(`Save failed: ${dbError.message}`);
      onConfirm({
        id: bookingRef, name: form.name.trim(), phone: form.phone.trim(),
        college: form.college.trim(), centerName: center.name, centerCity: center.city,
        date: form.date, slotLabel: slot.label, groupSize: form.groupSize, price: totalAmt,
        pickupPoint: form.pickupPoint === "Other" ? form.pickupOther.trim() : form.pickupPoint,
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
      setSubmitError(err.message || "An unexpected error occurred.");
    }
  };

  // ── Booking Closed Guard ──
  if (settings.bookingOpen === false) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{
          padding: "14px 24px", borderBottom: "1px solid var(--b)",
          display: "flex", alignItems: "center", gap: 16,
          background: "rgba(0,0,0,0.65)", backdropFilter: "blur(24px)", zIndex: 100,
        }}>
          <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ gap: 8 }}>{I.arrowLeft} Back</button>
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15, color: "#fff" }}>{settings.brandName}</div>
            <div style={{ fontSize: 10, color: "var(--t4)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Booking Engine · Secure</div>
          </div>
        </div>

        {/* Closed Notice */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
          <div className="anim-fadeup" style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
            {/* Glowing icon */}
            <div style={{ position: "relative", display: "inline-flex", marginBottom: 32 }}>
              <div style={{
                width: 100, height: 100, borderRadius: "50%",
                background: "rgba(244,63,94,0.1)",
                border: "2px solid rgba(244,63,94,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 46, boxShadow: "0 0 40px rgba(244,63,94,0.25), 0 0 80px rgba(244,63,94,0.1)",
                animation: "pulse 2.5s ease-in-out infinite",
              }}>🚫</div>
            </div>

            <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 30, color: "#fff", marginBottom: 16, letterSpacing: -1, lineHeight: 1.15 }}>
              Seat Bookings<br />
              <span style={{ color: "var(--red)" }}>Are Currently Closed</span>
            </h2>

            <div style={{
              background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.2)",
              borderRadius: 18, padding: "22px 28px", marginBottom: 32,
              fontSize: 14.5, color: "var(--t2)", lineHeight: 1.7, fontWeight: 500,
            }}>
              {settings.bookingClosedMsg ||
                "We're sorry — seat bookings are temporarily closed. Please check back later or contact support for more information."}
            </div>

            {/* Info pills */}
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
              {[
                { icon: "⏳", text: "Check back soon" },
                { icon: "📞", text: `Call ${settings.supportPhone || "support"}` },
                { icon: "💬", text: "Contact on WhatsApp" },
              ].map((p, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,0.04)", border: "1px solid var(--b2)",
                  borderRadius: 100, padding: "8px 16px", fontSize: 12.5, color: "var(--t2)", fontWeight: 600,
                  cursor: p.icon === "💬" ? "pointer" : "default",
                }}
                  onClick={() => {
                    if (p.icon === "💬" && settings.whatsapp) {
                      window.open(`https://wa.me/${settings.whatsapp}?text=Hi, I want to know about bus bookings.`, "_blank");
                    }
                  }}
                >
                  {p.icon} {p.text}
                </div>
              ))}
            </div>

            <button className="btn btn-ghost" style={{ padding: "14px 40px", fontSize: 14, borderRadius: 14 }} onClick={onBack}>
              {I.arrowLeft} Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sticky Header */}
      <div style={{
        padding: "14px 24px", borderBottom: "1px solid var(--b)",
        display: "flex", alignItems: "center", gap: 16,
        position: "sticky", top: 0,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(24px)",
        zIndex: 100,
      }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ gap: 8 }}>{I.arrowLeft} Back</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15, color: "#fff", letterSpacing: -0.3 }}>{settings.brandName}</div>
          <div style={{ fontSize: 10, color: "var(--t4)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Booking Engine · Secure</div>
        </div>
        {center && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "var(--t3)", fontWeight: 600, letterSpacing: 0.5 }}>TOTAL DUE</div>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 22, color: "var(--a)", lineHeight: 1 }}>₹{totalAmt}</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "28px 16px 100px" }}>
        {/* Stepper */}
        <div className="stepper" style={{ marginBottom: 44 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
              <div className={`step-item step-${step > i + 1 ? "done" : step === i + 1 ? "active" : "idle"}`}>
                <div className="step-circle">{step > i + 1 ? "✓" : i + 1}</div>
                <div className="step-label" style={{ fontWeight: step === i + 1 ? 700 : 500 }}>{s}</div>
              </div>
              {i < STEPS.length - 1 && <div className={`step-line ${step > i + 1 ? "done" : ""}`} />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: SELECTION ── */}
        {step === 1 && (
          <div key="s1" className="anim-fadeup">
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 26, marginBottom: 8, color: "#fff", letterSpacing: -0.8 }}>Choose Route & Slot</h2>
              <p style={{ fontSize: 14, color: "var(--t3)" }}>Select your exam center, journey date, and preferred departure window.</p>
            </div>

            {/* Center Selection */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>1. Exam Center</div>
              <div style={{ display: "grid", gap: 10 }}>
                {settings.centers.map((c) => {
                  const left = form.date && form.slotId ? settings.seatsPerSlot - usedSeats(seatCounts, c.id, form.date, form.slotId) : null;
                  const full = left !== null && left <= 0;
                  const isSelected = form.centerId === c.id;
                  return (
                    <div
                      key={c.id}
                      className={`choice ${isSelected ? "active" : ""}${full ? " disabled" : ""}`}
                      onClick={() => !full && sf("centerId", c.id)}
                      style={{ padding: "18px 20px" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: 15.5, marginBottom: 4, color: isSelected ? "var(--a)" : "#fff" }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: "var(--t3)", display: "flex", alignItems: "center", gap: 6 }}>
                            {I.map} {c.city} · {c.address}
                          </div>
                          {left !== null && (
                            <div style={{
                              fontSize: 11, marginTop: 10, fontWeight: 700,
                              color: left <= 0 ? "var(--red)" : left <= 5 ? "#FBBF24" : "var(--green)",
                              display: "inline-flex", alignItems: "center", gap: 6,
                              background: "rgba(255,255,255,0.03)", padding: "4px 10px",
                              borderRadius: 100, border: "1px solid rgba(255,255,255,0.06)"
                            }}>
                              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", boxShadow: "0 0 6px currentColor" }} />
                              {left <= 0 ? "SOLD OUT" : left <= 5 ? (settings.showSeatCounts ? `${left} SEATS LEFT` : "FILLING FAST") : (settings.showSeatCounts ? `${left} AVAILABLE` : "AVAILABLE")}
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: "right", marginLeft: 20 }}>
                          <div style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 22, color: isSelected ? "var(--a)" : "#fff" }}>₹{c.price}</div>
                          <div style={{ fontSize: 9, color: "var(--t3)", fontWeight: 700, letterSpacing: 1 }}>PER SEAT</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date Selection */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>2. Journey Date</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10 }}>
                {settings.dates.map((d) => (
                  <div key={d} className={`choice ${form.date === d ? "active" : ""}`} onClick={() => sf("date", d)} style={{ textAlign: "center", padding: "16px 12px" }}>
                    <div style={{ fontWeight: 800, fontSize: 14.5, color: form.date === d ? "var(--a)" : "#fff" }}>{fmtDate(d).split(",")[0]}</div>
                    <div style={{ fontSize: 10, color: "var(--t3)", marginTop: 4, fontWeight: 600 }}>{fmtDate(d).split(",").slice(1).join(",").trim()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slot Selection */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>3. Departure Slot</div>
              <div style={{ display: "grid", gap: 10 }}>
                {settings.slots.map((s) => (
                  <div key={s.id} className={`choice ${form.slotId === s.id ? "active" : ""}`} onClick={() => sf("slotId", s.id)} style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ color: form.slotId === s.id ? "var(--a)" : "var(--t3)" }}>{I.clock}</div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 14.5, color: form.slotId === s.id ? "var(--a)" : "#fff" }}>{s.label}</div>
                          <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 2 }}>{s.time}</div>
                        </div>
                      </div>
                      <div className={`radio-outer ${form.slotId === s.id ? "checked" : ""}`}>
                        <div className="radio-inner" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>



            <button className="btn btn-primary" style={{ width: "100%", padding: "17px 24px", fontSize: 15.5, borderRadius: 14 }} disabled={!ok1} onClick={() => setStep(2)}>
              Confirm Selection {I.arrow}
            </button>
          </div>
        )}

        {/* ── STEP 2: IDENTITY ── */}
        {step === 2 && (
          <div key="s2" className="anim-fadeup">
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 26, marginBottom: 8, color: "#fff", letterSpacing: -0.8 }}>Passenger Details</h2>
              <p style={{ fontSize: 14, color: "var(--t3)" }}>Required for boarding verification. Your data is secure and private.</p>
            </div>

            <div className="card" style={{ padding: 26, marginBottom: 20 }}>
              {[
                { k: "name", l: "Full Name", p: "As per your ID card", t: "text", req: true },
                { k: "phone", l: "WhatsApp Number", p: "10-digit mobile", t: "tel", req: true },
                { k: "email", l: "Email (Optional)", p: "your@university.edu", t: "email", req: false },
                { k: "college", l: "College / University", p: "Institution name", t: "text", req: true },
                { k: "rollNo", l: "Roll / Enrollment No.", p: "University roll number", t: "text", req: true },
              ].map((f) => (
                <div className="field" key={f.k} style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ fontSize: 10.5, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 1 }}>{f.l}</label>
                    {f.req && <span style={{ fontSize: 9.5, color: "var(--a)", fontWeight: 800 }}>REQUIRED</span>}
                  </div>
                  {f.k === "phone" ? (
                    <div style={{ display: "flex", gap: 10 }}>
                      <div className="inp" style={{ width: 76, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t3)", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", padding: "0 12px" }}>
                        🇮🇳 +91
                      </div>
                      <input className="inp" style={{ flex: 1 }} type="tel" maxLength={10} placeholder="0000000000" value={form.phone} onChange={(e) => sf("phone", e.target.value.replace(/\D/g, ""))} />
                    </div>
                  ) : (
                    <input className="inp" type={f.t} placeholder={f.p} value={form[f.k]} onChange={(e) => sf(f.k, f.k === "rollNo" ? e.target.value.toUpperCase().replace(/\s/g, "") : e.target.value)} />
                  )}
                </div>
              ))}

              <div className="field" style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontSize: 10.5, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 1 }}>Pickup Point</label>
                  <span style={{ fontSize: 9.5, color: "var(--a)", fontWeight: 800 }}>REQUIRED</span>
                </div>
                <select className="inp" value={form.pickupPoint === "Other" ? "Other" : form.pickupPoint} onChange={(e) => sf("pickupPoint", e.target.value)} style={{ appearance: "none" }}>
                  <option value="" disabled>Choose your PickUp Point</option>
                  {(settings.pickupPoints || [
                    "GLA Main Gate", "Chhatikara", "Govardhan Chauraha", "Tank Chauraha",
                    "Krishna Valley", "Radha Valley", "Mandi chauraha", "Township chauraha"
                  ]).map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {form.pickupPoint === "Other" && (
                  <input className="inp" type="text" placeholder="Specify other pickup point" value={form.pickupOther} onChange={(e) => sf("pickupOther", e.target.value)} style={{ marginTop: 10 }} />
                )}
              </div>
            </div>

            {/* ── Group Size Picker ── */}
            <div className="card" style={{ padding: "20px 26px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                    Number of Seats
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--t3)", lineHeight: 1.5 }}>
                    Booking for yourself or a group? Max 4 per booking.
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ width: 38, height: 38, padding: 0, borderRadius: 10, justifyContent: "center", fontSize: 20, fontWeight: 300 }}
                    disabled={form.groupSize <= 1}
                    onClick={() => sf("groupSize", form.groupSize - 1)}
                  >−</button>
                  <div style={{ textAlign: "center", minWidth: 40 }}>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 28, color: "var(--a)", lineHeight: 1 }}>
                      {form.groupSize}
                    </div>
                    <div style={{ fontSize: 9.5, color: "var(--t3)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>
                      {form.groupSize === 1 ? "seat" : "seats"}
                    </div>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ width: 38, height: 38, padding: 0, borderRadius: 10, justifyContent: "center", fontSize: 20, fontWeight: 300 }}
                    disabled={form.groupSize >= 4}
                    onClick={() => sf("groupSize", form.groupSize + 1)}
                  >+</button>
                </div>
              </div>
              {center && (
                <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(99,102,241,0.05)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--t3)", fontWeight: 600 }}>Total Amount</span>
                  <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 18, color: "var(--a)" }}>
                    ₹{totalAmt} <span style={{ fontSize: 11, color: "var(--t3)", fontWeight: 500 }}>({form.groupSize} × ₹{center.price})</span>
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>{I.arrowLeft} Back</button>
              <button className="btn btn-primary" style={{ flex: 2, padding: "17px 24px", fontSize: 15, borderRadius: 14 }} disabled={!ok2} onClick={() => setStep(3)}>
                Proceed to Payment {I.arrow}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: PAYMENT ── */}
        {step === 3 && (
          <div key="s3" className="anim-fadeup">
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 26, marginBottom: 8, color: "#fff", letterSpacing: -0.8 }}>Secure Payment</h2>
              <p style={{ fontSize: 14, color: "var(--t3)" }}>Pay via UPI to lock in your seat. Takes just 30 seconds.</p>
            </div>

            {/* Amount card */}
            <div style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: 22, padding: "32px 28px", marginBottom: 22, textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--a)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Amount Payable</div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 64, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: -3 }}>₹{totalAmt}</div>
              <div style={{ fontSize: 13, color: "var(--t3)", marginTop: 12, fontWeight: 600 }}>
                {center?.name} · {form.groupSize} Seat{form.groupSize > 1 ? "s" : ""}
              </div>
            </div>

            {/* UPI card */}
            <div className="card" style={{ padding: 24, marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{I.upi}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14.5, color: "#fff" }}>UPI Payment</div>
                  <div style={{ fontSize: 11, color: "var(--t3)" }}>PhonePe · GPay · Paytm</div>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 14, padding: "16px 18px", marginBottom: 18, border: "1px solid var(--b)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>UPI ID</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 17, color: "var(--a)" }}>{settings.upiId}</div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => { navigator.clipboard?.writeText(settings.upiId); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  >
                    {copied ? "✓ Copied" : <>{I.copy} Copy</>}
                  </button>
                </div>
                <div style={{ fontSize: 12, color: "var(--t2)", marginTop: 8, fontWeight: 500 }}>Recipient: {settings.upiName}</div>
              </div>

              {settings.upiQr && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "20px 0", borderTop: "1px solid var(--b)", borderBottom: "1px solid var(--b)", margin: "0 0 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 1.5 }}>Scan QR Code</div>
                  <div style={{ background: "#fff", padding: 12, borderRadius: 16, boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
                    <img src={settings.upiQr} alt="QR" style={{ width: 176, height: 176, display: "block" }} />
                  </div>
                  <p style={{ fontSize: 12, color: "var(--t3)", textAlign: "center", maxWidth: 240 }}>Scan using any UPI app to pay instantly.</p>
                </div>
              )}

              <div style={{ fontSize: 13, color: "var(--t3)", lineHeight: 1.8 }}>
                {settings.instructions.split("\n").map((line, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                    <span style={{ color: "var(--a)", fontWeight: 800, minWidth: 12 }}>›</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(2)}>{I.arrowLeft} Back</button>
              <button className="btn btn-primary" style={{ flex: 2, padding: "17px 24px", fontSize: 15, borderRadius: 14 }} onClick={() => setStep(4)}>
                I've Paid · Upload Proof {I.arrow}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: VERIFY ── */}
        {step === 4 && (
          <div key="s4" className="anim-fadeup">
            {loading ? (
              <div style={{ marginBottom: 40, animation: "fadeIn 0.5s ease" }}>
                <div style={{ marginBottom: 32 }}>
                  <div className="skeleton" style={{ height: 32, width: 220, marginBottom: 12 }}></div>
                  <div className="skeleton" style={{ height: 16, width: "80%" }}></div>
                </div>
                <div className="skeleton" style={{ height: 260, width: "100%", borderRadius: 16, marginBottom: 20 }}></div>
                <div className="skeleton" style={{ height: 100, width: "100%", borderRadius: 16, marginBottom: 24 }}></div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div className="skeleton" style={{ height: 54, flex: 1, borderRadius: 14 }}></div>
                  <div className="skeleton" style={{ height: 54, flex: 3, borderRadius: 14 }}></div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 900, fontSize: 26, marginBottom: 8, color: "#fff", letterSpacing: -0.8 }}>Confirm Payment</h2>
                  <p style={{ fontSize: 14, color: "var(--t3)" }}>Upload your payment screenshot and enter the transaction ID.</p>
                </div>

            {/* Upload Zone */}
            <div
              className={`upload-zone ${drag ? "drag" : ""} ${form.screenshot ? "has-file" : ""}`}
              style={{ padding: "44px 24px", marginBottom: 20 }}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}
            >
              {form.screenshot ? (
                <div style={{ textAlign: "center" }}>
                  <img src={form.screenshot} alt="proof" style={{ maxWidth: 200, maxHeight: 280, borderRadius: 14, marginBottom: 16, boxShadow: "0 20px 48px rgba(0,0,0,0.6)" }} />
                  <div style={{ fontSize: 13.5, color: "var(--green)", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {I.checkCircle} {form.screenshotName}
                  </div>
                  <div style={{ fontSize: 10.5, color: "var(--t3)", marginTop: 8, fontWeight: 700, letterSpacing: 1 }}>TAP TO CHANGE</div>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: "var(--a)", marginBottom: 14, fontSize: 32 }}>{I.upload}</div>
                  <div style={{ fontWeight: 800, fontSize: 15.5, color: "#fff", marginBottom: 8 }}>Drop screenshot here</div>
                  <div style={{ fontSize: 13, color: "var(--t3)" }}>PNG or JPG · Tap to browse</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />

            {/* UTR Input */}
            <div className="card" style={{ padding: 22, marginBottom: 20 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <label style={{ fontSize: 10.5, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 1 }}>UTR / Transaction ID</label>
                  <span style={{ fontSize: 9.5, color: "var(--a)", fontWeight: 800 }}>11-12 DIGITS</span>
                </div>
                <input
                  className="inp"
                  placeholder="e.g. 412301230456"
                  value={form.utr}
                  maxLength={12}
                  onChange={(e) => sf("utr", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                  style={{ fontSize: 20, fontFamily: "var(--font-mono)", padding: 16, letterSpacing: 3, textAlign: "center" }}
                />
                <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 10, lineHeight: 1.5 }}>
                  Found in your bank app under "Transaction Reference" or "UTR Number."
                </div>
              </div>
            </div>

            {/* Turnstile */}
            <div style={{ marginBottom: 20 }}>
              <Turnstile
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => setTurnstileToken("")}
                options={{ theme: "dark" }}
              />
            </div>

            {/* Error */}
            {submitError && (
              <div style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 14, padding: "14px 18px", marginBottom: 18, fontSize: 13.5, color: "#F87171", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontWeight: 800, flexShrink: 0 }}>{I.x}</span>
                <span>{submitError}</span>
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(3)} disabled={loading}>{I.arrowLeft} Back</button>
              <button className="btn btn-primary" style={{ flex: 3, padding: "17px 24px", fontSize: 15, borderRadius: 14 }} disabled={!ok4} onClick={submit}>
                <>{I.check} Finalize Booking</>
              </button>
            </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
