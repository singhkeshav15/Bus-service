import { useState, useRef } from "react";
import { supabase } from "../../supabase.js";
import I from "../../constants/icons.jsx";
import { fmtDate, usedSeats } from "../../utils/helpers.js";

const EMPTY_FORM = {
  centerId: "", date: "", slotId: "",
  name: "", phone: "", email: "", college: "", rollNo: "",
  utr: "", screenshot: null, screenshotName: "", groupSize: 1,
};

function dataURLtoFile(dataurl, filename) {
  const arr  = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

export function BookingFlow({ settings, bookings, onConfirm, onBack }) {
  const [step,    setStep]    = useState(1);
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [drag,    setDrag]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied,  setCopied]  = useState(false);
  const fileRef = useRef();

  const center   = settings.centers.find((c) => c.id === form.centerId);
  const slot     = settings.slots.find((s) => s.id === form.slotId);
  const avail    = center && form.date && form.slotId
    ? settings.seatsPerSlot - usedSeats(bookings, form.centerId, form.date, form.slotId)
    : null;
  const totalAmt = center ? center.price * form.groupSize : 0;

  const sf = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = (e) => { sf("screenshot", e.target.result); sf("screenshotName", file.name); };
    r.readAsDataURL(file);
  };

  const STEPS = ["Route", "Details", "Pay", "Upload"];
  const ok1   = form.centerId && form.date && form.slotId && avail > 0;
  const ok2   = form.name.trim() && form.phone.trim().length >= 10 && form.college.trim();
  const ok4   = form.utr.trim().length >= 6 && form.screenshot;

  const submit = async () => {
    try {
      setLoading(true);

      // 1. Upload image to Supabase Storage
      const fileName = `${Date.now()}-${form.screenshotName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("payments")
        .upload(`screenshots/${fileName}`, dataURLtoFile(form.screenshot, fileName));

      if (uploadError) throw uploadError;

      const imageUrl = `https://fbczqcuuqtiaibffsnws.supabase.co/storage/v1/object/public/payments/${uploadData.path}`;

      // 2. Save booking record to Supabase DB
      const { error: dbError } = await supabase.from("students").insert([
        {
          name:             form.name,
          email:            form.email,
          phone:            form.phone,
          screenshot_url:   imageUrl,
          payment_status:   "pending",
          college:          form.college,
          roll_no:          form.rollNo,
          utr:              form.utr,
          center:           form.centerId,
          exam_date:        form.date,
          slot:             form.slotId,
        },
      ]);

      if (dbError) throw dbError;

      setLoading(false);
      alert("Booking submitted successfully");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--b)", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, background: "rgba(7,11,20,0.95)", backdropFilter: "blur(16px)", zIndex: 10 }}>
        <button className="btn btn-glass btn-sm" onClick={onBack}>{I.arrowLeft} Back</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15 }}>Book Your Seat</div>
          <div style={{ fontSize: 11, color: "var(--t3)" }}>{settings.brandName} · NPTEL May 2025</div>
        </div>
        {center && (
          <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 18, color: "var(--a)" }}>₹{totalAmt}</span>
            <span style={{ fontSize: 10, color: "var(--t3)" }}>total fare</span>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 560, margin: "24px auto 0", padding: "0 20px 60px" }}>
        {/* Stepper */}
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
              <div className={`step-item step-${step > i + 1 ? "done" : step === i + 1 ? "active" : "idle"}`}>
                <div className="step-circle">{step > i + 1 ? "✓" : i + 1}</div>
                <div className="step-label">{s}</div>
              </div>
              {i < STEPS.length - 1 && <div className={`step-line ${step > i + 1 ? "done" : ""}`} />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: ROUTE ── */}
        {step === 1 && (
          <div key="s1" className="anim-fadeup">
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Choose Your Route</h3>
            <p style={{ fontSize: 13, color: "var(--t3)", marginBottom: 20 }}>Select exam center, date and preferred time slot</p>

            {/* Center */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Exam Center</div>
              <div style={{ display: "grid", gap: 8 }}>
                {settings.centers.map((c) => {
                  const left = form.date && form.slotId
                    ? settings.seatsPerSlot - usedSeats(bookings, c.id, form.date, form.slotId)
                    : null;
                  const full = left !== null && left <= 0;
                  return (
                    <div key={c.id} className={`choice${form.centerId === c.id ? " active" : ""}${full ? " disabled" : ""}`} onClick={() => !full && sf("centerId", c.id)}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: "var(--t3)", display: "flex", alignItems: "center", gap: 4 }}>
                            {I.map} {c.city} · {c.address}
                          </div>
                          {left !== null && (
                            <div style={{ fontSize: 11, marginTop: 4, color: left <= 5 && left > 0 ? "#FBBF24" : left <= 0 ? "var(--red)" : "var(--green)", display: "flex", alignItems: "center", gap: 4 }}>
                              {I.seat} {left <= 0 ? "Fully Booked" : left <= 5 ? `⚡ Only ${left} seats left` : `${left} seats available`}
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 22, color: form.centerId === c.id ? "var(--a)" : "var(--t)", lineHeight: 1 }}>₹{c.price}</div>
                          <div style={{ fontSize: 9, color: "var(--t3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>per seat</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Exam Date</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8 }}>
                {settings.dates.map((d) => (
                  <div key={d} className={`choice${form.date === d ? " active" : ""}`} onClick={() => sf("date", d)} style={{ textAlign: "center", padding: "12px 10px" }}>
                    <div style={{ fontSize: 18, marginBottom: 2 }}>📅</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{fmtDate(d).split(",")[0]}</div>
                    <div style={{ fontSize: 10.5, color: "var(--t3)", marginTop: 1 }}>{fmtDate(d).split(",").slice(1).join(",").trim()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slot */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Time Slot</div>
              <div style={{ display: "grid", gap: 8 }}>
                {settings.slots.map((s) => (
                  <div key={s.id} className={`choice${form.slotId === s.id ? " active" : ""}`} onClick={() => sf("slotId", s.id)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{s.label}</div>
                        <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>{I.clock} {s.time}</div>
                      </div>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${form.slotId === s.id ? "var(--a)" : "var(--b2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {form.slotId === s.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--a)" }} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Group size */}
            {ok1 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Number of Seats</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className={`choice${form.groupSize === n ? " active" : ""}`} style={{ flex: 1, textAlign: "center", padding: "10px 6px" }} onClick={() => sf("groupSize", n)}>
                      <div style={{ fontWeight: 700, fontSize: 17 }}>{n}</div>
                      <div style={{ fontSize: 10, color: "var(--t3)" }}>seat{n > 1 ? "s" : ""}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "var(--t2)", marginTop: 8, padding: "8px 12px", background: "rgba(249,115,22,0.06)", borderRadius: 8, textAlign: "center" }}>
                  Total: <strong style={{ color: "var(--a)" }}>₹{center?.price * form.groupSize}</strong> for {form.groupSize} seat{form.groupSize > 1 ? "s" : ""}
                </div>
              </div>
            )}

            <button className="btn btn-primary" style={{ width: "100%", padding: 14, fontSize: 15 }} disabled={!ok1} onClick={() => setStep(2)}>
              Continue to Details {I.arrow}
            </button>
          </div>
        )}

        {/* ── STEP 2: PERSONAL DETAILS ── */}
        {step === 2 && (
          <div key="s2" className="anim-fadeup">
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Your Details</h3>
            <p style={{ fontSize: 13, color: "var(--t3)", marginBottom: 20 }}>We need these details to confirm your seat</p>

            {/* Summary pill */}
            <div style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, fontSize: 12 }}>
              <span style={{ color: "var(--t2)" }}>{center?.name} · {fmtDate(form.date)}</span>
              <span style={{ color: "var(--t2)" }}>{slot?.label} · <strong style={{ color: "var(--a)" }}>₹{totalAmt}</strong></span>
            </div>

            <div className="card">
              {[
                { k: "name",    l: "Full Name",                 p: "Your full name",             t: "text",  req: true },
                { k: "phone",   l: "WhatsApp / Phone No.",      p: "10-digit mobile number",     t: "tel",   req: true },
                { k: "email",   l: "Email Address",             p: "your@email.com",             t: "email", req: false },
                { k: "college", l: "College / Institution",     p: "e.g. DAV College, Amritsar", t: "text",  req: true },
                { k: "rollNo",  l: "Roll No. / Enrollment No.", p: "e.g. 2021CS001",             t: "text",  req: false },
              ].map((f) => (
                <div className="field" key={f.k}>
                  <label>{f.l}{f.req && <span style={{ color: "var(--a)", marginLeft: 2 }}>*</span>}</label>
                  <input className="inp" type={f.t} placeholder={f.p} value={form[f.k]} onChange={(e) => sf(f.k, e.target.value)} />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="btn btn-ghost" style={{ minWidth: 90 }} onClick={() => setStep(1)}>{I.arrowLeft} Back</button>
              <button className="btn btn-primary" style={{ flex: 1, padding: 14 }} disabled={!ok2} onClick={() => setStep(3)}>
                Continue to Payment {I.arrow}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: PAYMENT ── */}
        {step === 3 && (
          <div key="s3" className="anim-fadeup">
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Make Payment</h3>
            <p style={{ fontSize: 13, color: "var(--t3)", marginBottom: 20 }}>Pay via UPI and take a screenshot — you'll need it in the next step</p>

            {/* Amount card */}
            <div style={{ background: "linear-gradient(135deg,rgba(249,115,22,0.12),rgba(251,191,36,0.06))", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 16, padding: "20px", marginBottom: 14, textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>Amount to Pay</div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 52, fontWeight: 900, color: "var(--a)", lineHeight: 1, letterSpacing: -1 }}>₹{totalAmt}</div>
              <div style={{ fontSize: 13, color: "var(--t2)", marginTop: 6 }}>{center?.name} · {form.groupSize} seat{form.groupSize > 1 ? "s" : ""}</div>
            </div>

            {/* UPI Card */}
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#F97316,#FBBF24)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff" }}>{I.upi}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Pay via UPI</span>
              </div>

              <div style={{ background: "var(--c2)", borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>UPI ID</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 16, color: "var(--a)", letterSpacing: 0.5 }}>{settings.upiId}</div>
                  <button className="btn btn-glass btn-sm" onClick={() => { navigator.clipboard?.writeText(settings.upiId); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                    {copied ? "✓ Copied" : <>{I.copy} Copy</>}
                  </button>
                </div>
                <div style={{ fontSize: 12, color: "var(--t3)", marginTop: 6 }}>Pay to: <strong style={{ color: "var(--t2)" }}>{settings.upiName}</strong></div>
              </div>

              {/* Instructions */}
              <div style={{ fontSize: 12.5, color: "var(--t2)", lineHeight: 1.85 }}>
                {settings.instructions.split("\n").map((line, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 2 }}>
                    <span style={{ color: "var(--a)", fontWeight: 700, flexShrink: 0 }}>{line.match(/^\d/) ? "" : ""}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12.5, color: "#93C5FD", display: "flex", gap: 8 }}>
              {I.info}
              <span>After paying, take a <strong>screenshot of the success screen</strong>. You'll upload it in the next step to confirm your booking.</span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" style={{ minWidth: 90 }} onClick={() => setStep(2)}>{I.arrowLeft} Back</button>
              <button className="btn btn-primary" style={{ flex: 1, padding: 14 }} onClick={() => setStep(4)}>
                I've Paid · Upload Proof {I.arrow}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: UPLOAD PROOF ── */}
        {step === 4 && (
          <div key="s4" className="anim-fadeup">
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Upload Payment Proof</h3>
            <p style={{ fontSize: 13, color: "var(--t3)", marginBottom: 20 }}>Upload the screenshot and enter your transaction ID to complete booking</p>

            {/* Upload zone */}
            <div
              className={`upload-zone${drag ? " drag" : ""}${form.screenshot ? " has-file" : ""}`}
              style={{ marginBottom: 14 }}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}
            >
              {form.screenshot ? (
                <div>
                  <img src={form.screenshot} alt="proof" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 10, marginBottom: 10, boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }} />
                  <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    {I.checkCircle} {form.screenshotName}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 4 }}>Tap to change image</div>
                </div>
              ) : (
                <div>
                  <div style={{ color: "var(--t3)", marginBottom: 12, display: "flex", justifyContent: "center" }}>{I.upload}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Tap to upload screenshot</div>
                  <div style={{ fontSize: 12, color: "var(--t3)" }}>or drag & drop here · JPG, PNG</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />

            <div className="card" style={{ marginBottom: 14 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>UTR / Transaction Reference Number <span style={{ color: "var(--a)" }}>*</span></label>
                <input className="inp" placeholder="e.g. 412301230456" value={form.utr} onChange={(e) => sf("utr", e.target.value)} />
                <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 5 }}>Find this in your payment app → transaction history → reference/UTR number</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" style={{ minWidth: 90 }} onClick={() => setStep(3)}>{I.arrowLeft} Back</button>
              <button className="btn btn-primary" style={{ flex: 1, padding: 14 }} disabled={!ok4 || loading} onClick={submit}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                      <circle cx="12" cy="12" r="10" opacity=".3" /><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    Confirming Booking…
                  </span>
                ) : <>{I.check} Confirm Booking</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
