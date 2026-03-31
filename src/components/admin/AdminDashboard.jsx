import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabase.js";
import I from "../../constants/icons.jsx";
import { Counter } from "../ui/Counter.jsx";
import { fmtDate, fmtTime, sv } from "../../utils/helpers.js";

export function AdminDashboard({ settings, setSettings, bookings, setBookings, onLogout, toast }) {
  const [tab,    setTab]   = useState("overview");
  const [modal,  setModal] = useState(null);
  const [filter, setFil]   = useState({ q: "", status: "", center: "" });

  // Editable settings state
  const [gen, setGen] = useState({
    brandName: settings.brandName, tagline: settings.tagline,
    upiId: settings.upiId, upiName: settings.upiName, upiQr: settings.upiQr || "",
    seatsPerSlot: settings.seatsPerSlot,
    whatsapp: settings.whatsapp, supportPhone: settings.supportPhone,
    announcement: settings.announcement, announcementOn: settings.announcementOn,
    instructions: settings.instructions, footerNote: settings.footerNote,
  });
  const [ctrs, setCtrs] = useState([...settings.centers]);
  const [dts,  setDts]  = useState([...settings.dates]);
  const [sls,  setSls]  = useState([...settings.slots]);
  const [newC, setNewC] = useState({ name: "", city: "", price: "", address: "" });
  const [newD, setNewD] = useState("");
  const [newS, setNewS] = useState({ label: "", time: "" });

  /* ── Actions ── */
  const save = () => {
    const upd = { ...settings, ...gen, centers: ctrs, dates: dts, slots: sls };
    setSettings(upd);
    sv("mk_settings_v2", upd);
    toast("Settings saved successfully!", "success");
  };

  /* ── Admin: Approve / Reject ── */
  const setStatus = async (id, status) => {
    // Optimistically update UI first for instant feedback
    const upd = bookings.map((b) => (b.id === id ? { ...b, payment_status: status } : b));
    setBookings(upd);
    setModal((m) => (m?.id === id ? { ...m, payment_status: status } : m));

    // Persist to Supabase
    const { error } = await supabase
      .from("students")
      .update({ payment_status: status })
      .eq("id", id);

    if (error) {
      // Revert optimistic update on failure
      setBookings(bookings);
      setModal((m) => m);
      toast(`Failed to update status: ${error.message}`, "error");
    } else {
      toast(
        status === "approved" ? "Booking approved ✓" : "Booking rejected",
        status === "approved" ? "success" : "error"
      );
    }
  };

  /* ── Admin: Delete ── */
  const del = async (id) => {
    if (!confirm("Delete this booking? This cannot be undone.")) return;

    // Optimistically update UI
    const prev = bookings;
    setBookings(bookings.filter((b) => b.id !== id));
    setModal(null);

    // Persist to Supabase
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (error) {
      setBookings(prev); // revert on failure
      toast(`Delete failed: ${error.message}`, "error");
    } else {
      toast("Booking deleted", "info");
    }
  };

  const exportCSV = () => {
    const rows = [
      ["Booking Ref", "Name", "Phone", "Email", "College", "Roll No", "Center", "Date", "Slot", "Seats", "Amount (INR)", "UTR", "Status", "Booked At"],
      ...bookings.map((b) => [
        b.booking_ref || b.id,
        b.name, b.phone, b.email || "",
        b.college, b.roll_no || "",
        b.center, b.exam_date, b.slot,
        b.group_size || 1, b.price || "",
        b.utr, b.payment_status,
        b.created_at,
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csv);
    a.download = `mk_bookings_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  /* ── Polling fallback: refresh every 30s when admin panel is open ──
   *  Works even if Supabase real-time is not enabled.
   *  Real-time subscription (in App.jsx) handles instant updates when available.
   */
  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setBookings(data);
  }, [setBookings]);

  useEffect(() => {
    const interval = setInterval(refresh, 30_000); // every 30 seconds
    return () => clearInterval(interval);
  }, [refresh]);

  /* ── Derived stats ── */
  const stats = {
    total:    bookings.length,
    pending:  bookings.filter((b) => b.payment_status === "pending").length,
    approved: bookings.filter((b) => b.payment_status === "approved").length,
    rejected: bookings.filter((b) => b.payment_status === "rejected").length,
    revenue:  bookings.filter((b) => b.payment_status === "approved").reduce((s, b) => s + (b.price || 0), 0),
    today:    bookings.filter((b) => b.created_at?.startsWith(new Date().toISOString().slice(0, 10))).length,
  };

  const filtered = bookings.filter((b) =>
    (!filter.status || b.payment_status === filter.status) &&
    (!filter.center || b.center === filter.center) &&
    (!filter.q || [b.name, b.phone, b.id, b.college, b.roll_no].some((v) => v?.toLowerCase().includes(filter.q.toLowerCase())))
  );

  const TABS = [
    { k: "overview",  l: "Overview",  ic: I.chartBar },
    { k: "bookings",  l: "Bookings",  ic: I.list },
    { k: "settings",  l: "Settings",  ic: I.gear },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Admin Nav */}
      <nav className="nav" style={{ gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(99,102,241,0.3)" }}>
            <span style={{ color: "#fff", transform: "scale(.9)" }}>{I.bus}</span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 15, color: "#fff" }}>{settings.brandName}</div>
            <div style={{ fontSize: 9, color: "var(--a)", fontWeight: 800, letterSpacing: 1.5, lineHeight: 1, textTransform: "uppercase" }}>Admin Console</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {TABS.map((t) => (
            <button key={t.k} className={`btn btn-sm ${tab === t.k ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab(t.k)} style={{ gap: 5 }}>
              {t.ic} {t.l}
            </button>
          ))}
          <button className="btn btn-glass btn-sm" onClick={async () => {
            await supabase.auth.signOut();
            onLogout();
          }} style={{ color: "var(--red)" }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 16px 60px" }}>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Dashboard Overview</h2>
              <p style={{ fontSize: 13, color: "var(--t3)" }}>Welcome back. Here's what's happening with {settings.brandName}.</p>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12, marginBottom: 24 }}>
              {[
                { l: "Total",    v: stats.total,    sub: "All bookings",    c: "var(--a)",      bc: "rgba(99,102,241,0.2)" },
                { l: "Pending",  v: stats.pending,  sub: "Needs review",    c: "#FBBF24",       bc: "rgba(251,191,36,0.2)" },
                { l: "Approved", v: stats.approved, sub: "Confirmed seats", c: "var(--green)",  bc: "rgba(16,185,129,0.2)" },
                { l: "Revenue",  v: `₹${stats.revenue.toLocaleString("en-IN")}`, sub: "Gross collected", c: "#a78bfa", bc: "rgba(139,92,246,0.2)" },
                { l: "Today",    v: stats.today,    sub: "New today",       c: "#60a5fa",      bc: "rgba(59,130,246,0.2)" },
                { l: "Rejected", v: stats.rejected, sub: "Declined",        c: "var(--red)",   bc: "rgba(244,63,94,0.2)" },
              ].map((s, i) => (
                <div key={i} className="stat-card anim-fadeup" style={{ animationDelay: `${i * 0.06}s`, borderColor: s.bc }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>{s.l}</div>
                  <div style={{ fontFamily: "var(--font-head)", fontSize: 30, fontWeight: 800, color: s.c, lineHeight: 1, marginBottom: 6 }}>
                    {typeof s.v === "number" ? <Counter target={s.v} /> : s.v}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--t3)" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Pending alert */}
            {stats.pending > 0 && (
              <div className="anim-fadeup" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 16, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#FBBF24", fontWeight: 700 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FBBF24", boxShadow: "0 0 8px #FBBF24", animation: "pulse 1.5s ease-in-out infinite" }} />
                  {stats.pending} booking{stats.pending > 1 ? "s" : ""} awaiting payment verification
                </div>
                <button className="btn btn-sm" style={{ background: "rgba(251,191,36,0.1)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.2)", padding: "8px 16px" }} onClick={() => { setFil((f) => ({ ...f, status: "pending" })); setTab("bookings"); }}>
                  Review Now {I.arrow}
                </button>
              </div>
            )}

            {/* Center breakdown */}
            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Bookings by Center</div>
              <div style={{ display: "grid", gap: 10 }}>
                {settings.centers.map((c) => {
                  const cnt = bookings
                    .filter((b) => b.center === c.id && b.payment_status !== "rejected")
                    .reduce((sum, b) => sum + (b.group_size || 1), 0);
                  const max = settings.seatsPerSlot * settings.slots.length * settings.dates.length;
                  const pct = Math.min(100, (cnt / Math.max(1, max)) * 100);
                  return (
                    <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 120, fontSize: 12, fontWeight: 500, flexShrink: 0 }}>{c.name}</div>
                      <div style={{ flex: 1, height: 6, background: "var(--c3)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,var(--a),var(--a2))", borderRadius: 3, transition: "width 1s ease" }} />
                      </div>
                      <div style={{ fontSize: 12, color: "var(--t2)", fontFamily: "var(--font-mono)", width: 50, textAlign: "right", flexShrink: 0 }}>{cnt}/{max}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent bookings */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15 }}>Recent Bookings</div>
                <div style={{ display: "flex", gap: 7 }}>
                  {bookings.length > 0 && <button className="btn btn-glass btn-sm" onClick={exportCSV}>{I.download} Export CSV</button>}
                  <button className="btn btn-ghost btn-sm" onClick={() => setTab("bookings")}>View All →</button>
                </div>
              </div>
              {bookings.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--t3)", padding: "32px 0", fontSize: 14 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🚌</div>
                  No bookings yet! Share your website to start getting bookings.
                </div>
              ) : (
                <div className="scrollable">
                  <table className="tbl">
                    <thead><tr><th>Booking ID</th><th>Name</th><th>Center</th><th className="hide-sm">Date</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {[...bookings].slice(0, 8).map((b) => (
                        <tr key={b.id} onClick={() => { setModal(b); setTab("bookings"); }}>
                          <td><span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--a)" }}>{b.booking_ref || b.id?.slice(0,8)}</span></td>
                          <td><div style={{ fontWeight: 500, fontSize: 13 }}>{b.name}</div><div style={{ fontSize: 11, color: "var(--t3)" }}>{b.college?.split(" ").slice(0, 2).join(" ")}</div></td>
                          <td style={{ fontSize: 12 }}>{b.center}</td>
                          <td className="hide-sm" style={{ fontSize: 12, color: "var(--t2)" }}>{b.exam_date ? fmtDate(b.exam_date) : "—"}</td>
                          <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--a)" }}>₹{b.price || "—"}</td>
                          <td><span className={`badge badge-${b.payment_status}`}>{b.payment_status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === "bookings" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 20 }}>All Bookings</h2>
                <p style={{ fontSize: 12, color: "var(--t3)", marginTop: 2 }}>{filtered.length} booking{filtered.length !== 1 ? "s" : ""} found</p>
              </div>
              {bookings.length > 0 && <button className="btn btn-glass btn-sm" onClick={exportCSV}>{I.download} Export CSV</button>}
            </div>

            {/* Filters */}
            <div className="filter-grid">
              <input className="inp" placeholder="Search name, phone, ID, college…" value={filter.q} onChange={(e) => setFil((f) => ({ ...f, q: e.target.value }))} />
              <select className="inp" value={filter.status} onChange={(e) => setFil((f) => ({ ...f, status: e.target.value }))} style={{ minWidth: 130 }}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select className="inp" value={filter.center} onChange={(e) => setFil((f) => ({ ...f, center: e.target.value }))} style={{ minWidth: 140 }}>
                <option value="">All Centers</option>
                {settings.centers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="card">
              <div className="scrollable">
                <table className="tbl">
                  <thead><tr><th>ID</th><th>Passenger</th><th>Phone</th><th className="hide-sm">Center</th><th className="hide-sm">Date · Slot</th><th>₹</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--t3)", padding: 28, fontSize: 13 }}>No bookings match your filters</td></tr>
                    )}
                    {filtered.map((b) => (
                      <tr key={b.id}>
                        <td><span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--a)" }}>{b.booking_ref || b.id?.slice(0,8)}</span></td>
                        <td>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{b.name}</div>
                          <div style={{ fontSize: 11, color: "var(--t3)" }}>{b.college}</div>
                        </td>
                        <td style={{ fontSize: 12.5 }}>{b.phone}</td>
                        <td className="hide-sm" style={{ fontSize: 12, color: "var(--t2)" }}>{b.center}</td>
                        <td className="hide-sm" style={{ fontSize: 11.5, color: "var(--t2)" }}>{b.exam_date ? fmtDate(b.exam_date) : "—"}<br /><span style={{ color: "var(--t3)" }}>{b.slot}</span></td>
                        <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--a)", fontSize: 13 }}>₹{b.price || "—"}</td>
                        <td><span className={`badge badge-${b.payment_status}`}>{b.payment_status}</span></td>
                        <td>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button className="btn btn-glass btn-xs" onClick={() => setModal(b)} title="View details">{I.eye}</button>
                            {b.payment_status !== "approved" && <button className="btn btn-success btn-xs" onClick={() => setStatus(b.id, "approved")} title="Approve">{I.check}</button>}
                            {b.payment_status !== "rejected" && <button className="btn btn-danger btn-xs"  onClick={() => setStatus(b.id, "rejected")} title="Reject">{I.x}</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 20, marginBottom: 4 }}>Website Settings</h2>
                <p style={{ fontSize: 13, color: "var(--t3)" }}>All changes reflect on your website immediately after saving.</p>
              </div>
              <button className="btn btn-primary" style={{ padding: "11px 24px" }} onClick={save}>💾 Save All Changes</button>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {/* Brand */}
              <div className="card">
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 16, display: "flex", alignItems: "center", gap: 7 }}>🎨 Brand & Content</div>
                <div className="settings-grid-2">
                  {[
                    { k: "brandName",    l: "Brand / Business Name",             p: "MK Bus Service" },
                    { k: "tagline",      l: "Tagline / Subtitle",                 p: "Your Trusted Exam Partner" },
                    { k: "supportPhone", l: "Support Phone Number",               p: "9876543210" },
                    { k: "whatsapp",     l: "WhatsApp Number (with country code)", p: "919876543210" },
                    { k: "footerNote",   l: "Footer Note",                        p: "Safe · Punctual · Affordable." },
                  ].map((f) => (
                    <div key={f.k} className="field" style={{ marginBottom: 0 }}>
                      <label>{f.l}</label>
                      <input className="inp" placeholder={f.p} value={gen[f.k] || ""} onChange={(e) => setGen((g) => ({ ...g, [f.k]: e.target.value }))} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcement */}
              <div className="card">
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>📢 Announcement Banner</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--t2)" }}>
                    <div
                      style={{ position: "relative", width: 38, height: 22, borderRadius: 11, background: gen.announcementOn ? "linear-gradient(135deg,var(--a),var(--a2))" : "var(--c3)", transition: "background .2s", cursor: "pointer" }}
                      onClick={() => setGen((g) => ({ ...g, announcementOn: !g.announcementOn }))}
                    >
                      <div style={{ position: "absolute", top: 3, left: gen.announcementOn ? 18 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
                    </div>
                    Show banner on website
                  </label>
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Banner Text</label>
                  <input className="inp" placeholder="🚌 Booking is LIVE! Limited seats available." value={gen.announcement || ""} onChange={(e) => setGen((g) => ({ ...g, announcement: e.target.value }))} />
                </div>
              </div>

              {/* Payment */}
              <div className="card">
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 16, display: "flex", alignItems: "center", gap: 7 }}>💳 Payment Settings</div>
                <div className="settings-grid-2" style={{ marginBottom: 12 }}>
                  {[
                    { k: "upiId",   l: "UPI ID",           p: "yourname@paytm" },
                    { k: "upiName", l: "UPI Display Name",  p: "MK Bus Service" },
                  ].map((f) => (
                    <div key={f.k} className="field" style={{ marginBottom: 0 }}>
                      <label>{f.l}</label>
                      <input className="inp" placeholder={f.p} value={gen[f.k] || ""} onChange={(e) => setGen((g) => ({ ...g, [f.k]: e.target.value }))} />
                    </div>
                  ))}
                </div>

                {/* UPI QR Code URL */}
                <div className="field" style={{ marginBottom: 12 }}>
                  <label>UPI QR Code Image URL <span style={{ color: "var(--t3)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional — shown to students on payment page)</span></label>
                  <input className="inp" placeholder="https://... paste a direct image URL of your UPI QR code" value={gen.upiQr || ""} onChange={(e) => setGen((g) => ({ ...g, upiQr: e.target.value }))} />
                  {gen.upiQr && (
                    <div style={{ marginTop: 10, display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ background: "#fff", padding: 8, borderRadius: 10, display: "inline-flex", boxShadow: "0 4px 14px rgba(0,0,0,0.3)" }}>
                        <img src={gen.upiQr} alt="QR Preview" style={{ width: 100, height: 100, display: "block", borderRadius: 4 }}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <div style={{ fontSize: 12, color: "var(--t3)", lineHeight: 1.6 }}>
                        ✓ QR preview loaded<br/>Students will see this on the payment step.<br/>
                        <button className="btn btn-danger btn-xs" style={{ marginTop: 6 }} onClick={() => setGen((g) => ({ ...g, upiQr: "" }))}>
                          Remove QR
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Payment Instructions (shown to students)</label>
                  <textarea className="inp" rows={5} value={gen.instructions || ""} onChange={(e) => setGen((g) => ({ ...g, instructions: e.target.value }))} placeholder="Step-by-step instructions…" />
                </div>
              </div>

              {/* Admin Access & Limits */}
              <div className="card">
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 16, display: "flex", alignItems: "center", gap: 7 }}>🔐 Admin Settings</div>
                <div className="settings-grid-2">
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Max Seats Per Slot</label>
                    <input className="inp" type="number" min="1" value={gen.seatsPerSlot} onChange={(e) => setGen((g) => ({ ...g, seatsPerSlot: +e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Centers */}
              <div className="card">
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>🏫 Exam Centers & Fares</div>
                <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
                  {ctrs.map((c, i) => (
                    <div key={c.id} className="centers-row" style={{ background: "var(--c2)", borderRadius: 10, padding: "10px 12px", border: "1px solid var(--b)" }}>
                      <input className="inp" value={c.name}  placeholder="Center name" onChange={(e) => setCtrs((cs) => cs.map((x, j) => j === i ? { ...x, name: e.target.value }  : x))} />
                      <input className="inp" value={c.city}  placeholder="City"        onChange={(e) => setCtrs((cs) => cs.map((x, j) => j === i ? { ...x, city: e.target.value }  : x))} />
                      <input className="inp" type="number" value={c.price} placeholder="₹" onChange={(e) => setCtrs((cs) => cs.map((x, j) => j === i ? { ...x, price: +e.target.value } : x))} />
                      <button className="btn btn-danger btn-xs" onClick={() => setCtrs((cs) => cs.filter((_, j) => j !== i))}>{I.trash}</button>
                    </div>
                  ))}
                </div>
                <div className="centers-row" style={{ alignItems: "end" }}>
                  {[{ k: "name", p: "Center name" }, { k: "city", p: "City" }, { k: "price", p: "₹", t: "number" }, { skip: true }].map((f, i) =>
                    f.skip ? (
                      <button key={i} className="btn btn-primary btn-sm" onClick={() => {
                        if (!newC.name || !newC.city || !newC.price) return;
                        setCtrs((cs) => [...cs, { id: "c" + Date.now(), name: newC.name, city: newC.city, price: +newC.price, address: newC.city }]);
                        setNewC({ name: "", city: "", price: "", address: "" });
                      }}>{I.plus} Add</button>
                    ) : (
                      <div key={i}>
                        <label style={{ fontSize: 10, color: "var(--t3)", fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase", display: "block", marginBottom: 5 }}>{f.p}</label>
                        <input className="inp" type={f.t || "text"} placeholder={f.p} value={newC[f.k] || ""} onChange={(e) => setNewC((n) => ({ ...n, [f.k]: e.target.value }))} />
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="card">
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>📅 Exam Dates</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                  {dts.map((d, i) => (
                    <div key={d} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--c2)", border: "1px solid var(--b2)", borderRadius: 8, padding: "7px 12px", fontSize: 12.5, fontWeight: 500 }}>
                      📅 {fmtDate(d)}
                      <button style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }} onClick={() => setDts((ds) => ds.filter((_, j) => j !== i))}>{I.x}</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input className="inp" type="date" value={newD} onChange={(e) => setNewD(e.target.value)} style={{ flex: 1 }} />
                  <button className="btn btn-primary btn-sm" onClick={() => { if (!newD || dts.includes(newD)) return; setDts((d) => [...d, newD].sort()); setNewD(""); }}>{I.plus} Add Date</button>
                </div>
              </div>

              {/* Slots */}
              <div className="card">
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 7 }}>🕐 Time Slots</div>
                <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
                  {sls.map((s, i) => (
                    <div key={s.id} className="slots-row" style={{ background: "var(--c2)", border: "1px solid var(--b)", borderRadius: 10, padding: "10px 12px", alignItems: "center" }}>
                      <input className="inp" value={s.label} placeholder="Slot name" onChange={(e) => setSls((ss) => ss.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
                      <input className="inp" value={s.time}  placeholder="e.g. Depart 8:00 AM · Return after exam" onChange={(e) => setSls((ss) => ss.map((x, j) => j === i ? { ...x, time: e.target.value } : x))} />
                      <button className="btn btn-danger btn-xs" onClick={() => setSls((ss) => ss.filter((_, j) => j !== i))}>{I.trash}</button>
                    </div>
                  ))}
                </div>
                <div className="slots-row" style={{ alignItems: "end" }}>
                  <div>
                    <label style={{ fontSize: 10, color: "var(--t3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 5 }}>Slot Name</label>
                    <input className="inp" placeholder="e.g. Evening Shift" value={newS.label} onChange={(e) => setNewS((n) => ({ ...n, label: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: "var(--t3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, display: "block", marginBottom: 5 }}>Timing Info</label>
                    <input className="inp" placeholder="Depart 5:00 PM · Return after exam" value={newS.time} onChange={(e) => setNewS((n) => ({ ...n, time: e.target.value }))} />
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ alignSelf: "end" }} onClick={() => {
                    if (!newS.label.trim()) return;
                    setSls((ss) => [...ss, { id: "s" + Date.now(), ...newS }]);
                    setNewS({ label: "", time: "" });
                  }}>{I.plus} Add</button>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: 16 }} onClick={save}>
                💾 Save All Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {modal && (
        <div className="mask" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 22, color: "#fff" }}>{modal.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--a)", marginTop: 6, letterSpacing: 2, fontWeight: 700 }}>{modal.booking_ref || modal.id?.slice(0,8).toUpperCase()}</div>
                <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 4, fontWeight: 600 }}>{fmtTime(modal.created_at)}</div>
              </div>
              <span className={`badge badge-${modal.payment_status}`} style={{ fontSize: 11, padding: "6px 14px" }}>{modal.payment_status}</span>
            </div>

            <div style={{ display: "grid", gap: 0, marginBottom: 20, background: "rgba(255,255,255,0.02)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--b)" }}>
              {[
                ["Phone",        modal.phone],
                ["Email",        modal.email || "—"],
                ["College",      modal.college],
                ["Roll No.",     modal.roll_no || "—"],
                ["Exam Center",  modal.center],
                ["Date",         modal.exam_date ? fmtDate(modal.exam_date) : "—"],
                ["Time Slot",    modal.slot],
                ["Total Amount", modal.price ? `₹${modal.price}` : "—"],
                ["UTR / Ref",    modal.utr],
              ].map(([k, v], i) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "11px 16px", borderBottom: "1px solid var(--b)" }}>
                  <span style={{ fontSize: 11, color: "var(--t3)", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.8, flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, textAlign: "right", wordBreak: "break-all", color: "#fff" }}>{v}</span>
                </div>
              ))}
            </div>

            {modal.screenshot_url && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "var(--t3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>Payment Evidence</div>
                <img src={modal.screenshot_url} alt="proof" style={{ width: "100%", borderRadius: 16, border: "1px solid var(--b)", display: "block" }} />
              </div>
            )}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {modal.payment_status !== "approved" && <button className="btn btn-success" style={{ flex: 2 }} onClick={() => setStatus(modal.id, "approved")}>{I.check} Approve</button>}
              {modal.payment_status !== "rejected" && <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => setStatus(modal.id, "rejected")}>{I.x} Reject</button>}
              <button className="btn btn-glass" onClick={() => del(modal.id)} style={{ color: "var(--red)" }}>{I.trash}</button>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>✕</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
