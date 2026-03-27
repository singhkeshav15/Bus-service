import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase";

/* ─────────────────────────── GLOBAL STYLES ─────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#070B14;color:#F1F5F9;font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#1E2D45;border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:#2E4060}

:root{
  --bg:#070B14; --c1:#0C1220; --c2:#111827; --c3:#182236; --c4:#1E2D45;
  --a:#F97316; --a2:#FBBF24; --a3:#FB923C;
  --green:#10B981; --red:#F43F5E; --blue:#3B82F6; --purple:#8B5CF6;
  --t:#F1F5F9; --t2:#94A3B8; --t3:#475569; --t4:#334155;
  --b:rgba(255,255,255,0.05); --b2:rgba(255,255,255,0.09); --b3:rgba(255,255,255,0.14);
  --glow:rgba(249,115,22,0.15); --glow2:rgba(249,115,22,0.25);
  --r:16px; --r2:12px; --r3:10px;
  --font-head:'Syne',sans-serif; --font-body:'Plus Jakarta Sans',sans-serif; --font-mono:'JetBrains Mono',monospace;
  --shadow:0 4px 24px rgba(0,0,0,0.4); --shadow2:0 8px 40px rgba(0,0,0,0.5);
  --shadow-a:0 0 0 1px rgba(249,115,22,0.3), 0 8px 32px rgba(249,115,22,0.18);
}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 22px;border-radius:var(--r3);border:none;font-family:var(--font-body);font-size:14px;font-weight:600;cursor:pointer;transition:all 0.22s cubic-bezier(.4,0,.2,1);white-space:nowrap;text-decoration:none;position:relative;overflow:hidden}
.btn::after{content:'';position:absolute;inset:0;opacity:0;transition:opacity .2s;background:rgba(255,255,255,0.07);pointer-events:none}
.btn:hover::after{opacity:1}
.btn-primary{background:linear-gradient(135deg,#F97316 0%,#FBBF24 100%);color:#fff;box-shadow:0 4px 20px rgba(249,115,22,0.35)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(249,115,22,0.5)}
.btn-primary:active{transform:translateY(0)}
.btn-ghost{background:transparent;color:var(--t);border:1.5px solid var(--b2)}
.btn-ghost:hover{border-color:var(--a);color:var(--a)}
.btn-glass{background:rgba(255,255,255,0.06);color:var(--t);border:1px solid var(--b2);backdrop-filter:blur(12px)}
.btn-glass:hover{background:rgba(255,255,255,0.1);border-color:var(--b3)}
.btn-success{background:linear-gradient(135deg,#10B981,#059669);color:#fff;box-shadow:0 4px 16px rgba(16,185,129,0.3)}
.btn-danger{background:linear-gradient(135deg,#F43F5E,#E11D48);color:#fff;box-shadow:0 4px 16px rgba(244,63,94,0.25)}
.btn-sm{padding:7px 14px;font-size:12.5px;border-radius:8px;gap:5px}
.btn-xs{padding:5px 10px;font-size:11.5px;border-radius:7px;gap:4px}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;box-shadow:none!important}
.btn:disabled::after{display:none}

/* INPUTS */
.field{position:relative;margin-bottom:16px}
.field label{display:block;font-size:11.5px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:7px}
.inp{width:100%;background:var(--c2);border:1.5px solid var(--b2);border-radius:var(--r3);padding:12px 15px;color:var(--t);font-family:var(--font-body);font-size:14px;outline:none;transition:all .22s}
.inp:focus{border-color:var(--a);background:var(--c3);box-shadow:0 0 0 3px rgba(249,115,22,0.1)}
.inp::placeholder{color:var(--t4)}
.inp-icon{padding-left:42px}
.field .icon{position:absolute;left:13px;bottom:12px;color:var(--t3);pointer-events:none}
select.inp{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px}
select.inp option{background:var(--c2);color:var(--t)}
textarea.inp{resize:vertical;min-height:80px}

/* CARDS */
.card{background:var(--c1);border:1px solid var(--b);border-radius:var(--r);padding:22px}
.card-hover{transition:all .22s;cursor:pointer}
.card-hover:hover{border-color:var(--b2);transform:translateY(-2px);box-shadow:var(--shadow)}

/* CHOICE CARDS */
.choice{border:1.5px solid var(--b2);border-radius:var(--r2);padding:14px 16px;cursor:pointer;transition:all .2s;background:var(--c2);position:relative;overflow:hidden}
.choice:hover{border-color:var(--a3);background:var(--c3)}
.choice.active{border-color:var(--a);background:linear-gradient(135deg,rgba(249,115,22,0.08),rgba(251,191,36,0.04));box-shadow:var(--shadow-a)}
.choice.active::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--a),var(--a2))}
.choice.disabled{opacity:.4;cursor:not-allowed;pointer-events:none}

/* BADGE */
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:.2px}
.badge-pending{background:rgba(251,191,36,0.12);color:#FBBF24;border:1px solid rgba(251,191,36,0.2)}
.badge-approved{background:rgba(16,185,129,0.12);color:#10B981;border:1px solid rgba(16,185,129,0.2)}
.badge-rejected{background:rgba(244,63,94,0.1);color:#F43F5E;border:1px solid rgba(244,63,94,0.2)}
.badge-info{background:rgba(59,130,246,0.12);color:#60A5FA;border:1px solid rgba(59,130,246,0.2)}

/* TABLE */
.tbl{width:100%;border-collapse:collapse;font-size:13px}
.tbl th{text-align:left;padding:10px 14px;color:var(--t3);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--b);background:rgba(255,255,255,.015);white-space:nowrap}
.tbl td{padding:11px 14px;border-bottom:1px solid var(--b);vertical-align:middle}
.tbl tbody tr{transition:background .15s;cursor:pointer}
.tbl tbody tr:hover td{background:rgba(249,115,22,0.03)}
.tbl tbody tr:last-child td{border-bottom:none}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(7,11,20,0.88);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px);animation:fadeIn .2s ease}
.modal{background:var(--c1);border:1px solid var(--b2);border-radius:20px;padding:26px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto;animation:slideUp .25s cubic-bezier(.4,0,.2,1);box-shadow:0 24px 80px rgba(0,0,0,0.7)}

/* TOAST */
.toast-wrap{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none}
.toast{background:var(--c1);border:1px solid var(--b2);border-radius:12px;padding:12px 18px;font-size:13px;font-weight:500;box-shadow:0 16px 48px rgba(0,0,0,0.6);animation:slideInRight .3s cubic-bezier(.4,0,.2,1);max-width:320px;display:flex;align-items:center;gap:10px;pointer-events:all}

/* UPLOAD ZONE */
.upload-zone{border:2px dashed var(--b2);border-radius:var(--r2);padding:32px 20px;text-align:center;cursor:pointer;transition:all .22s;background:var(--c2);position:relative;overflow:hidden}
.upload-zone:hover,.upload-zone.drag{border-color:var(--a);background:rgba(249,115,22,0.04)}
.upload-zone.has-file{border-color:var(--green);background:rgba(16,185,129,0.04)}

/* ANIMATIONS */
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideInRight{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)}}
@keyframes slideInLeft{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes drawLine{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}
@keyframes popIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes roadMove{from{stroke-dashoffset:0}to{stroke-dashoffset:-40}}

.anim-fadeup{animation:fadeUp .4s cubic-bezier(.4,0,.2,1) both}
.anim-popin{animation:popIn .35s cubic-bezier(.4,0,.2,1) both}
.d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}.d5{animation-delay:.25s}.d6{animation-delay:.3s}

/* PROGRESS STEPPER */
.stepper{display:flex;align-items:center;gap:0;margin-bottom:32px;padding:0 4px}
.step-item{display:flex;flex-direction:column;align-items:center;flex:1;position:relative}
.step-circle{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;transition:all .3s;position:relative;z-index:1;flex-shrink:0}
.step-done .step-circle{background:linear-gradient(135deg,var(--a),var(--a2));color:#fff;box-shadow:0 4px 14px rgba(249,115,22,0.4)}
.step-active .step-circle{background:linear-gradient(135deg,var(--a),var(--a2));color:#fff;box-shadow:0 4px 20px rgba(249,115,22,0.5),0 0 0 4px rgba(249,115,22,0.15)}
.step-idle .step-circle{background:var(--c3);color:var(--t3);border:1.5px solid var(--b2)}
.step-label{font-size:10px;font-weight:600;color:var(--t3);margin-top:6px;text-align:center;white-space:nowrap;letter-spacing:.3px;text-transform:uppercase}
.step-active .step-label{color:var(--a)}
.step-done .step-label{color:var(--t2)}
.step-line{flex:1;height:2px;background:var(--b2);margin:0;margin-bottom:22px;transition:background .4s}
.step-line.done{background:linear-gradient(90deg,var(--a),var(--a2))}

/* STATS */
.stat-card{background:var(--c1);border:1px solid var(--b);border-radius:var(--r2);padding:18px 20px;position:relative;overflow:hidden;transition:border-color .2s}
.stat-card:hover{border-color:var(--b2)}
.stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;opacity:0;transition:opacity .2s}
.stat-card:hover::before{opacity:1}

/* NAV */
.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-bottom:1px solid var(--b);position:sticky;top:0;z-index:100;background:rgba(7,11,20,0.92);backdrop-filter:blur(16px)}

/* MISC */
.divider{height:1px;background:var(--b);margin:16px 0}
.tag{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:100px;font-size:11.5px;font-weight:600}
.text-grad{background:linear-gradient(135deg,#F97316,#FBBF24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.glow-dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 8px rgba(16,185,129,0.7);animation:pulse 2s ease-in-out infinite}
.mono{font-family:var(--font-mono)!important}
.scrollable{overflow-x:auto;-webkit-overflow-scrolling:touch}

/* RESPONSIVE */
@media(max-width:640px){
  .hide-sm{display:none!important}
  .card{padding:16px}
  .modal{padding:18px;border-radius:16px;margin:0}
  .nav{padding:12px 16px}
}
`;

/* ─────────────────────────── CONSTANTS / HELPERS ─────────────────────────── */
const BK = "mk_bookings_v2";
const SK = "mk_settings_v2";

const DEFAULT_SETTINGS = {
  brandName: "MK Bus Service",
  tagline: "Your Trusted Exam Transport Partner",
  upiId: "mkbusservice@paytm",
  upiName: "MK Bus Service",
  upiQr: "",
  adminPass: "mk@admin",
  seatsPerSlot: 50,
  whatsapp: "919876543210",
  supportPhone: "9876543210",
  announcement: "🚌 NPTEL May 2025 booking is LIVE! Reserve your seat before slots fill up.",
  announcementOn: true,
  centers: [
    { id:"c1", name:"Punjab University", city:"Chandigarh", price:299, address:"Sector 14, Chandigarh" },
    { id:"c2", name:"Thapar Institute", city:"Patiala", price:249, address:"Bhadson Rd, Patiala" },
    { id:"c3", name:"GNDU Campus", city:"Amritsar", price:199, address:"G.T. Road, Amritsar" },
    { id:"c4", name:"NIT Jalandhar", city:"Jalandhar", price:249, address:"GT Road, Jalandhar" },
  ],
  dates: ["2025-05-17","2025-05-18","2025-05-24","2025-05-25"],
  slots: [
    { id:"s1", label:"Morning Shift", time:"Depart 7:30 AM · Return after exam" },
    { id:"s2", label:"Afternoon Shift", time:"Depart 12:00 PM · Return after exam" },
  ],
  instructions: "1. Open PhonePe / Google Pay / Paytm\n2. Search or enter the UPI ID\n3. Pay the exact amount\n4. Take a clear screenshot of the success screen\n5. Note your UTR / Transaction ID",
  footerNote: "Operated by students, for students. Safe · Punctual · Affordable.",
};

const ld = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const genId = () => "MK" + Math.random().toString(36).slice(2,5).toUpperCase() + Date.now().toString(36).slice(-3).toUpperCase();
const fmtDate = d => new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday:"short", day:"2-digit", month:"short", year:"2-digit" });
const fmtTime = iso => new Date(iso).toLocaleString("en-IN", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" });
const usedSeats = (bks, cId, date, sId) => bks.filter(b => b.centerId===cId && b.date===date && b.slotId===sId && b.status!=="rejected").length;

/* ─────────────────────────── ICON PACK ─────────────────────────── */
const I = {
  bus: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg>,
  arrow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  arrowLeft: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>,
  checkCircle: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  upload: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  upi: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>,
  wa: <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
  copy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  gear: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  download: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  map: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.56-1.88a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  star: <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  seat: <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M7 22H2v-2a3 3 0 0 1 3-3h5V8H8a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2h-2v9h5a3 3 0 0 1 3 3v2h-5v-2H7v2zM10 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/></svg>,
  rupee: <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M13.66 7H15V5H9v2h1.75c.92 0 1.7.59 1.96 1.41L9.17 13H7v2h2.17l-1.91 5H9l3.17-5H15v-2h-2.83z"/></svg>,
  info: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  chartBar: <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  ticket: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"/></svg>,
  list: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
};

/* ─────────────────────────── TOAST SYSTEM ─────────────────────────── */
function ToastContainer({ toasts, remove }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className="toast" style={{ borderLeft: `3px solid ${t.type==="success"?"#10B981":t.type==="error"?"#F43F5E":"#F97316"}` }}>
          <span style={{ fontSize:16 }}>{t.type==="success"?"✓":t.type==="error"?"✕":"•"}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type="info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return [toasts, add];
}

/* ─────────────────────────── ANIMATED COUNTER ─────────────────────────── */
function Counter({ target, prefix="", suffix="" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(start);
      if (start >= target) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [target]);
  return <>{prefix}{val}{suffix}</>;
}

/* ─────────────────────────── HERO SVG BUS ANIMATION ─────────────────────────── */
function HeroBus() {
  return (
    <svg viewBox="0 0 320 180" style={{ width:"100%", maxWidth:340, filter:"drop-shadow(0 12px 40px rgba(249,115,22,0.2))" }}>
      <defs>
        <linearGradient id="busGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316"/>
          <stop offset="100%" stopColor="#FBBF24"/>
        </linearGradient>
        <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E2D45" stopOpacity="0"/>
          <stop offset="20%" stopColor="#1E2D45"/>
          <stop offset="80%" stopColor="#1E2D45"/>
          <stop offset="100%" stopColor="#1E2D45" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Road */}
      <rect x="0" y="130" width="320" height="24" rx="4" fill="url(#roadGrad)"/>
      <line x1="20" y1="142" x2="300" y2="142" stroke="#334155" strokeWidth="1" strokeDasharray="20 12"/>
      {/* White road lines animated */}
      <line x1="20" y1="142" x2="300" y2="142" stroke="#F97316" strokeWidth="1.5" strokeDasharray="20 30" opacity=".4">
        <animate attributeName="stroke-dashoffset" from="0" to="-50" dur="1.2s" repeatCount="indefinite"/>
      </line>
      {/* Bus body */}
      <rect x="40" y="72" width="200" height="58" rx="10" fill="url(#busGrad)"/>
      {/* Roof detail */}
      <rect x="48" y="64" width="184" height="14" rx="6" fill="#FB923C"/>
      {/* Windows */}
      {[68,104,140,176].map((x,i) => (
        <rect key={i} x={x} y="82" width="28" height="20" rx="4" fill="rgba(7,11,20,0.7)" opacity=".9"/>
      ))}
      {/* Window shine */}
      {[68,104,140,176].map((x,i) => (
        <rect key={i} x={x+2} y="84" width="8" height="4" rx="2" fill="rgba(255,255,255,0.35)"/>
      ))}
      {/* Door */}
      <rect x="212" y="84" width="22" height="38" rx="3" fill="rgba(7,11,20,0.55)"/>
      <rect x="222" y="96" width="3" height="8" rx="1.5" fill="#FBBF24"/>
      {/* Front */}
      <rect x="220" y="72" width="28" height="58" rx="0" fill="#EA6C10" style={{display:"none"}}/>
      {/* Headlight */}
      <rect x="232" y="90" width="16" height="8" rx="3" fill="#FEF3C7" opacity=".9"/>
      <rect x="233" y="91" width="14" height="6" rx="2" fill="#FFFBEB"/>
      {/* Grille */}
      <rect x="234" y="102" width="14" height="2" rx="1" fill="rgba(0,0,0,0.3)"/>
      <rect x="234" y="106" width="14" height="2" rx="1" fill="rgba(0,0,0,0.3)"/>
      {/* Wheels */}
      {[85,190].map((x,i) => (
        <g key={i}>
          <circle cx={x} cy="132" r="16" fill="#1E2D45"/>
          <circle cx={x} cy="132" r="11" fill="#111827"/>
          <circle cx={x} cy="132" r="5" fill="#334155"/>
          <circle cx={x} cy="132" r="2.5" fill="#F97316"/>
          {/* Wheel bolts */}
          {[0,72,144,216,288].map((a,j) => (
            <circle key={j}
              cx={x + 7.5*Math.cos(a*Math.PI/180)}
              cy={132 + 7.5*Math.sin(a*Math.PI/180)}
              r="1.5" fill="#475569"/>
          ))}
        </g>
      ))}
      {/* MK logo on bus */}
      <text x="80" y="116" fill="rgba(255,255,255,0.95)" fontFamily="'Syne',sans-serif" fontWeight="800" fontSize="11" letterSpacing="1">MK BUS</text>
      {/* Exhaust puffs */}
      <circle cx="34" cy="125" r="4" fill="rgba(71,85,105,0.4)">
        <animate attributeName="r" values="2;5;2" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".5;0;.5" dur="1.5s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="34;20;10" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="30" cy="122" r="3" fill="rgba(71,85,105,0.3)">
        <animate attributeName="r" values="1;4;1" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".4;0;.4" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="30;15;5" dur="1.8s" repeatCount="indefinite"/>
      </circle>
      {/* Speed lines */}
      {[88,96,104].map((y,i) => (
        <line key={i} x1="16" y1={y} x2={28+i*3} y2={y} stroke="#F97316" strokeWidth="1" opacity=".3">
          <animate attributeName="opacity" values=".3;.6;.3" dur={`${1+i*0.3}s`} repeatCount="indefinite"/>
        </line>
      ))}
      {/* Stars/dots decoration */}
      {[[288,50,3],[300,70,2],[276,40,2],[310,55,1.5]].map(([x,y,r],i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#FBBF24" opacity=".4">
          <animate attributeName="opacity" values=".2;.6;.2" dur={`${1.5+i*0.4}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

/* ─────────────────────────── LANDING PAGE ─────────────────────────── */
function Landing({ settings, bookings, onBook, onAdmin }) {
  const approvedCount = bookings.filter(b => b.status !== "rejected").length;
  return (
    <div>
      {/* Announcement Banner */}
      {settings.announcementOn && settings.announcement && (
        <div style={{ background:"linear-gradient(90deg,rgba(249,115,22,0.15),rgba(251,191,36,0.1),rgba(249,115,22,0.15))", borderBottom:"1px solid rgba(249,115,22,0.2)", padding:"10px 20px", textAlign:"center", fontSize:13, color:"#FDBA74", fontWeight:500, backgroundSize:"200% 100%", animation:"shimmer 3s linear infinite" }}>
          {settings.announcement}
        </div>
      )}

      {/* NAV */}
      <nav className="nav">
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#F97316,#FBBF24)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(249,115,22,0.4)" }}>
            <span style={{ color:"#fff" }}>{I.bus}</span>
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:16, letterSpacing:-.2 }}>{settings.brandName}</div>
            <div style={{ fontSize:9.5, color:"var(--t3)", fontWeight:500, letterSpacing:.4, lineHeight:1 }}>NPTEL EXAM TRANSPORT</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <a href={`tel:${settings.supportPhone}`} className="btn btn-ghost btn-sm hide-sm" style={{ gap:5 }}>{I.phone} {settings.supportPhone}</a>
          <button className="btn btn-glass btn-sm" onClick={onAdmin} style={{ gap:5 }}>{I.gear} Admin</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position:"relative", overflow:"hidden" }}>
        {/* Glows */}
        <div style={{ position:"absolute", top:-60, right:-60, width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(249,115,22,0.12) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-40, left:-40, width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%)", pointerEvents:"none" }}/>

        <div style={{ maxWidth:900, margin:"0 auto", padding:"50px 24px 40px", display:"grid", gridTemplateColumns:"1fr auto", gap:20, alignItems:"center" }}>
          <div>
            <div className="anim-fadeup d1" style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(249,115,22,0.1)", border:"1px solid rgba(249,115,22,0.22)", borderRadius:100, padding:"5px 14px", fontSize:11.5, color:"#FB923C", marginBottom:20, fontWeight:700, letterSpacing:.3 }}>
              <div className="glow-dot"/>
              NPTEL MAY 2025 · BOOKING OPEN
            </div>
            <h1 className="anim-fadeup d2" style={{ fontFamily:"var(--font-head)", fontSize:"clamp(30px,5.5vw,58px)", fontWeight:800, lineHeight:1.08, marginBottom:16, letterSpacing:-1 }}>
              Stress-Free Journey<br/>
              to Your <span className="text-grad">Exam Center</span>
            </h1>
            <p className="anim-fadeup d3" style={{ color:"var(--t2)", fontSize:15, lineHeight:1.75, marginBottom:28, maxWidth:480 }}>
              {settings.tagline}. Book your seat in under 2 minutes — safe, punctual, affordable.
            </p>
            <div className="anim-fadeup d4" style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <button className="btn btn-primary" style={{ fontSize:15, padding:"14px 30px" }} onClick={onBook}>
                Book My Seat {I.arrow}
              </button>
              <a className="btn btn-glass" style={{ fontSize:14, padding:"14px 20px" }} href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">
                {I.wa} Chat on WhatsApp
              </a>
            </div>

            {/* Trust row */}
            <div className="anim-fadeup d5" style={{ display:"flex", gap:20, marginTop:28, flexWrap:"wrap" }}>
              {[
                { v: approvedCount || "0", l:"Students Booked", c:"var(--a)" },
                { v: settings.centers.length, l:"Exam Routes", c:"var(--blue)" },
                { v: "100%", l:"On-Time Record", c:"var(--green)" },
              ].map((s,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ fontSize:22, fontWeight:800, fontFamily:"var(--font-head)", color:s.c }}>{s.v}</div>
                  <div style={{ fontSize:11, color:"var(--t3)", fontWeight:500, lineHeight:1.3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="anim-fadeup hide-sm" style={{ animation:"float 4s ease-in-out infinite" }}>
            <HeroBus/>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"0 24px 48px" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"var(--a)", letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Simple Process</div>
          <h2 style={{ fontFamily:"var(--font-head)", fontSize:28, fontWeight:800 }}>Book in 4 Easy Steps</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
          {[
            { n:"01", icon:"🗺️", t:"Choose Route", d:"Select exam center, date & time slot that works for you" },
            { n:"02", icon:"👤", t:"Fill Details", d:"Your name, college and contact info" },
            { n:"03", icon:"💳", t:"Pay via UPI", d:"Secure UPI payment — PhonePe, GPay or Paytm" },
            { n:"04", icon:"🎟️", t:"Get Booking ID", d:"Instant confirmation with unique booking ID" },
          ].map((s,i) => (
            <div key={i} className="card card-hover anim-fadeup" style={{ animationDelay:`${i*0.08}s`, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:12, right:14, fontFamily:"var(--font-head)", fontWeight:900, fontSize:30, color:"rgba(255,255,255,0.04)", lineHeight:1 }}>{s.n}</div>
              <div style={{ fontSize:26, marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:15, marginBottom:6 }}>{s.t}</div>
              <div style={{ fontSize:12.5, color:"var(--t3)", lineHeight:1.65 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ROUTES & PRICING */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"0 24px 48px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:20, flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"var(--a)", letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>Routes & Fares</div>
            <h2 style={{ fontFamily:"var(--font-head)", fontSize:24, fontWeight:800 }}>Available Exam Centers</h2>
          </div>
          <button className="btn btn-primary btn-sm" onClick={onBook}>Reserve Now →</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:12 }}>
          {settings.centers.map((c,i) => {
            const totalBooked = bookings.filter(b => b.centerId===c.id && b.status!=="rejected").length;
            const seatsPct = Math.min(100, (totalBooked / (settings.seatsPerSlot * settings.slots.length * settings.dates.length)) * 100);
            return (
              <div key={c.id} className="card anim-fadeup" style={{ animationDelay:`${i*0.07}s`, position:"relative", overflow:"hidden", cursor:"pointer", transition:"all .22s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(249,115,22,0.3)"; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(249,115,22,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="var(--b)"; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
                onClick={onBook}
              >
                <div style={{ position:"absolute", top:0, left:0, width:`${seatsPct}%`, height:3, background:"linear-gradient(90deg,var(--a),var(--a2))", transition:"width 1s ease" }}/>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{c.name}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:11.5, color:"var(--t3)" }}>
                      {I.map} {c.city}
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:22, color:"var(--a)", lineHeight:1 }}>₹{c.price}</div>
                    <div style={{ fontSize:9, color:"var(--t3)", letterSpacing:.5, fontWeight:600, textTransform:"uppercase" }}>per seat</div>
                  </div>
                </div>
                <div style={{ fontSize:11, color:"var(--t3)", display:"flex", alignItems:"center", gap:4 }}>
                  {I.map} <span>{c.address}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"0 24px 48px" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(249,115,22,0.06),rgba(251,191,36,0.03))", border:"1px solid rgba(249,115,22,0.12)", borderRadius:20, padding:"32px 28px" }}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <h2 style={{ fontFamily:"var(--font-head)", fontSize:24, fontWeight:800, marginBottom:8 }}>Why Students Choose Us</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
            {[
              { icon:"⏰", t:"Always On Time", d:"We depart sharp — never miss your exam slot" },
              { icon:"🛡️", t:"Safe & Reliable", d:"Experienced drivers on verified vehicles" },
              { icon:"💰", t:"Best Price", d:"Lowest fares, no hidden charges whatsoever" },
              { icon:"📱", t:"Instant Booking", d:"Book from phone, get ID in under 2 minutes" },
              { icon:"🪑", t:"Reserved Seat", d:"Your specific seat is confirmed after verification" },
              { icon:"🔔", t:"WhatsApp Updates", d:"Get confirmation and reminders on WhatsApp" },
            ].map((f,i) => (
              <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ fontSize:22, flexShrink:0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, marginBottom:3 }}>{f.t}</div>
                  <div style={{ fontSize:12, color:"var(--t3)", lineHeight:1.55 }}>{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid var(--b)", padding:"24px", textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:8, color:"var(--a)" }}>
          {I.bus}
          <span style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:15 }}>{settings.brandName}</span>
        </div>
        <div style={{ fontSize:12, color:"var(--t3)" }}>{settings.footerNote}</div>
        <div style={{ fontSize:11, color:"var(--t4)", marginTop:8 }}>For support: {settings.supportPhone}</div>
      </footer>
    </div>
  );
}

/* ─────────────────────────── BOOKING FLOW ─────────────────────────── */
const EMPTY_FORM = { centerId:"", date:"", slotId:"", name:"", phone:"", email:"", college:"", rollNo:"", utr:"", screenshot:null, screenshotName:"", groupSize:1 };

function BookingFlow({ settings, bookings, onConfirm, onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef();

  const center = settings.centers.find(c => c.id===form.centerId);
  const slot   = settings.slots.find(s => s.id===form.slotId);
  const avail  = (center && form.date && form.slotId)
    ? settings.seatsPerSlot - usedSeats(bookings, form.centerId, form.date, form.slotId) : null;
  const totalAmt = center ? center.price * form.groupSize : 0;

  const sf = (k, v) => setForm(f => ({ ...f, [k]:v }));

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = e => { sf("screenshot", e.target.result); sf("screenshotName", file.name); };
    r.readAsDataURL(file);
  };

  const STEPS = ["Route","Details","Pay","Upload"];
  const ok1 = form.centerId && form.date && form.slotId && avail > 0;
  const ok2 = form.name.trim() && form.phone.trim().length >= 10 && form.college.trim();
  const ok4 = form.utr.trim().length >= 6 && form.screenshot;

  //
  function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

const submit = async () => {
  try {
    setLoading(true);

    // 1. Upload image to Supabase
    const fileName = `${Date.now()}-${form.screenshotName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("payments")
      .upload(`screenshots/${fileName}`, dataURLtoFile(form.screenshot, fileName));

    if (uploadError) throw uploadError;

    const imageUrl = `https://fbczqcuuqtiaibffsnws.supabase.co/storage/v1/object/public/payments/${uploadData.path}`;

    // 2. Save to database
    console.log(form)
    // console.log(file)
    const { error: dbError } = await supabase
      .from("students")
      .insert([
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        screenshot_url: imageUrl,
        payment_status: "pending",
        college: form.college,
        roll_no: form.rollNo,
        utr: form.utr,
        center: form.centerId,
        exam_date: form.date,
        slot: form.slotId
      }
    ]);
    console.log("Insert response:", dbError)

    if (dbError) throw dbError;

    setLoading(false);
    alert("Booking submitted successfully");

  } catch (err) {
    console.error(err)
    alert(err.message)
  }
};

  return (
    <div style={{ minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ padding:"14px 20px", borderBottom:"1px solid var(--b)", display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, background:"rgba(7,11,20,0.95)", backdropFilter:"blur(16px)", zIndex:10 }}>
        <button className="btn btn-glass btn-sm" onClick={onBack}>{I.arrowLeft} Back</button>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:15 }}>Book Your Seat</div>
          <div style={{ fontSize:11, color:"var(--t3)" }}>{settings.brandName} · NPTEL May 2025</div>
        </div>
        {center && <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
          <span style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:18, color:"var(--a)" }}>₹{totalAmt}</span>
          <span style={{ fontSize:10, color:"var(--t3)" }}>total fare</span>
        </div>}
      </div>

      <div style={{ maxWidth:560, margin:"24px auto 0", padding:"0 20px 60px" }}>
        {/* Stepper */}
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", flex: i < STEPS.length-1 ? 1 : "none" }}>
              <div className={`step-item step-${step>i+1?"done":step===i+1?"active":"idle"}`}>
                <div className="step-circle">
                  {step > i+1 ? "✓" : i+1}
                </div>
                <div className="step-label">{s}</div>
              </div>
              {i < STEPS.length-1 && <div className={`step-line ${step>i+1?"done":""}`}/>}
            </div>
          ))}
        </div>

        {/* ── STEP 1: ROUTE ── */}
        {step===1 && (
          <div key="s1" className="anim-fadeup">
            <h3 style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:18, marginBottom:6 }}>Choose Your Route</h3>
            <p style={{ fontSize:13, color:"var(--t3)", marginBottom:20 }}>Select exam center, date and preferred time slot</p>

            {/* Center */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"var(--t3)", textTransform:"uppercase", letterSpacing:.6, marginBottom:10 }}>Exam Center</div>
              <div style={{ display:"grid", gap:8 }}>
                {settings.centers.map(c => {
                  const left = form.date && form.slotId ? settings.seatsPerSlot - usedSeats(bookings, c.id, form.date, form.slotId) : null;
                  const full = left !== null && left <= 0;
                  return (
                    <div key={c.id} className={`choice${form.centerId===c.id?" active":""}${full?" disabled":""}`}
                      onClick={() => !full && sf("centerId", c.id)}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                        <div>
                          <div style={{ fontWeight:600, fontSize:14, marginBottom:2 }}>{c.name}</div>
                          <div style={{ fontSize:12, color:"var(--t3)", display:"flex", alignItems:"center", gap:4 }}>
                            {I.map} {c.city} · {c.address}
                          </div>
                          {left !== null && (
                            <div style={{ fontSize:11, marginTop:4, color: left<=5&&left>0?"#FBBF24":left<=0?"var(--red)":"var(--green)", display:"flex", alignItems:"center", gap:4 }}>
                              {I.seat} {left<=0?"Fully Booked":left<=5?`⚡ Only ${left} seats left`:`${left} seats available`}
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign:"right", flexShrink:0 }}>
                          <div style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:22, color:form.centerId===c.id?"var(--a)":"var(--t)", lineHeight:1 }}>₹{c.price}</div>
                          <div style={{ fontSize:9, color:"var(--t3)", fontWeight:600, textTransform:"uppercase", letterSpacing:.5 }}>per seat</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"var(--t3)", textTransform:"uppercase", letterSpacing:.6, marginBottom:10 }}>Exam Date</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:8 }}>
                {settings.dates.map(d => (
                  <div key={d} className={`choice${form.date===d?" active":""}`} onClick={() => sf("date", d)} style={{ textAlign:"center", padding:"12px 10px" }}>
                    <div style={{ fontSize:18, marginBottom:2 }}>📅</div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{fmtDate(d).split(",")[0]}</div>
                    <div style={{ fontSize:10.5, color:"var(--t3)", marginTop:1 }}>{fmtDate(d).split(",").slice(1).join(",").trim()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slot */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"var(--t3)", textTransform:"uppercase", letterSpacing:.6, marginBottom:10 }}>Time Slot</div>
              <div style={{ display:"grid", gap:8 }}>
                {settings.slots.map(s => (
                  <div key={s.id} className={`choice${form.slotId===s.id?" active":""}`} onClick={() => sf("slotId", s.id)}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14 }}>{s.label}</div>
                        <div style={{ fontSize:12, color:"var(--t3)", marginTop:2, display:"flex", alignItems:"center", gap:4 }}>{I.clock} {s.time}</div>
                      </div>
                      <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${form.slotId===s.id?"var(--a)":"var(--b2)"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {form.slotId===s.id && <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--a)" }}/>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Group size */}
            {ok1 && (
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"var(--t3)", textTransform:"uppercase", letterSpacing:.6, marginBottom:10 }}>Number of Seats</div>
                <div style={{ display:"flex", gap:8 }}>
                  {[1,2,3,4].map(n => (
                    <div key={n} className={`choice${form.groupSize===n?" active":""}`}
                      style={{ flex:1, textAlign:"center", padding:"10px 6px" }}
                      onClick={() => sf("groupSize", n)}>
                      <div style={{ fontWeight:700, fontSize:17 }}>{n}</div>
                      <div style={{ fontSize:10, color:"var(--t3)" }}>seat{n>1?"s":""}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:12, color:"var(--t2)", marginTop:8, padding:"8px 12px", background:"rgba(249,115,22,0.06)", borderRadius:8, textAlign:"center" }}>
                  Total: <strong style={{ color:"var(--a)" }}>₹{center?.price * form.groupSize}</strong> for {form.groupSize} seat{form.groupSize>1?"s":""}
                </div>
              </div>
            )}

            <button className="btn btn-primary" style={{ width:"100%", padding:14, fontSize:15 }} disabled={!ok1} onClick={() => setStep(2)}>
              Continue to Details {I.arrow}
            </button>
          </div>
        )}

        {/* ── STEP 2: PERSONAL DETAILS ── */}
        {step===2 && (
          <div key="s2" className="anim-fadeup">
            <h3 style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:18, marginBottom:6 }}>Your Details</h3>
            <p style={{ fontSize:13, color:"var(--t3)", marginBottom:20 }}>We need these details to confirm your seat</p>

            {/* Summary pill */}
            <div style={{ background:"rgba(249,115,22,0.06)", border:"1px solid rgba(249,115,22,0.15)", borderRadius:10, padding:"10px 14px", marginBottom:20, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:6, fontSize:12 }}>
              <span style={{ color:"var(--t2)" }}>{center?.name} · {fmtDate(form.date)}</span>
              <span style={{ color:"var(--t2)" }}>{slot?.label} · <strong style={{ color:"var(--a)" }}>₹{totalAmt}</strong></span>
            </div>

            <div className="card">
              {[
                { k:"name",    l:"Full Name",                 p:"Your full name",          t:"text",  req:true },
                { k:"phone",   l:"WhatsApp / Phone No.",      p:"10-digit mobile number",  t:"tel",   req:true },
                { k:"email",   l:"Email Address",             p:"your@email.com",          t:"email", req:false },
                { k:"college", l:"College / Institution",     p:"e.g. DAV College, Amritsar", t:"text", req:true },
                { k:"rollNo",  l:"Roll No. / Enrollment No.", p:"e.g. 2021CS001",          t:"text",  req:false },
              ].map(f => (
                <div className="field" key={f.k}>
                  <label>{f.l}{f.req&&<span style={{ color:"var(--a)", marginLeft:2 }}>*</span>}</label>
                  <input className="inp" type={f.t} placeholder={f.p} value={form[f.k]} onChange={e => sf(f.k, e.target.value)}/>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              <button className="btn btn-ghost" style={{ minWidth:90 }} onClick={() => setStep(1)}>{I.arrowLeft} Back</button>
              <button className="btn btn-primary" style={{ flex:1, padding:14 }} disabled={!ok2} onClick={() => setStep(3)}>
                Continue to Payment {I.arrow}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: PAYMENT ── */}
        {step===3 && (
          <div key="s3" className="anim-fadeup">
            <h3 style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:18, marginBottom:6 }}>Make Payment</h3>
            <p style={{ fontSize:13, color:"var(--t3)", marginBottom:20 }}>Pay via UPI and take a screenshot — you'll need it in the next step</p>

            {/* Amount card */}
            <div style={{ background:"linear-gradient(135deg,rgba(249,115,22,0.12),rgba(251,191,36,0.06))", border:"1px solid rgba(249,115,22,0.2)", borderRadius:16, padding:"20px", marginBottom:14, textAlign:"center" }}>
              <div style={{ fontSize:12, fontWeight:600, color:"var(--t3)", textTransform:"uppercase", letterSpacing:.6, marginBottom:6 }}>Amount to Pay</div>
              <div style={{ fontFamily:"var(--font-head)", fontSize:52, fontWeight:900, color:"var(--a)", lineHeight:1, letterSpacing:-1 }}>₹{totalAmt}</div>
              <div style={{ fontSize:13, color:"var(--t2)", marginTop:6 }}>{center?.name} · {form.groupSize} seat{form.groupSize>1?"s":""}</div>
            </div>

            {/* UPI Card */}
            <div className="card" style={{ marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <div style={{ width:28, height:28, borderRadius:7, background:"linear-gradient(135deg,#F97316,#FBBF24)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ color:"#fff" }}>{I.upi}</span>
                </div>
                <span style={{ fontWeight:700, fontSize:14 }}>Pay via UPI</span>
              </div>

              <div style={{ background:"var(--c2)", borderRadius:10, padding:14, marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"var(--t3)", textTransform:"uppercase", letterSpacing:.6, marginBottom:6 }}>UPI ID</div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                  <div style={{ fontFamily:"var(--font-mono)", fontWeight:600, fontSize:16, color:"var(--a)", letterSpacing:.5 }}>{settings.upiId}</div>
                  <button className="btn btn-glass btn-sm" onClick={() => { navigator.clipboard?.writeText(settings.upiId); setCopied(true); setTimeout(()=>setCopied(false),2000); }}>
                    {copied ? "✓ Copied" : <>{I.copy} Copy</>}
                  </button>
                </div>
                <div style={{ fontSize:12, color:"var(--t3)", marginTop:6 }}>Pay to: <strong style={{ color:"var(--t2)" }}>{settings.upiName}</strong></div>
              </div>

              {/* Instructions */}
              <div style={{ fontSize:12.5, color:"var(--t2)", lineHeight:1.85 }}>
                {settings.instructions.split("\n").map((line,i) => (
                  <div key={i} style={{ display:"flex", gap:8, marginBottom:2 }}>
                    <span style={{ color:"var(--a)", fontWeight:700, flexShrink:0 }}>{line.match(/^\d/)?"":""}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:"rgba(59,130,246,0.07)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:10, padding:"10px 14px", marginBottom:14, fontSize:12.5, color:"#93C5FD", display:"flex", gap:8 }}>
              {I.info}
              <span>After paying, take a <strong>screenshot of the success screen</strong>. You'll upload it in the next step to confirm your booking.</span>
            </div>

            <div style={{ display:"flex", gap:8 }}>
              <button className="btn btn-ghost" style={{ minWidth:90 }} onClick={() => setStep(2)}>{I.arrowLeft} Back</button>
              <button className="btn btn-primary" style={{ flex:1, padding:14 }} onClick={() => setStep(4)}>
                I've Paid · Upload Proof {I.arrow}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: UPLOAD PROOF ── */}
        {step===4 && (
          <div key="s4" className="anim-fadeup">
            <h3 style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:18, marginBottom:6 }}>Upload Payment Proof</h3>
            <p style={{ fontSize:13, color:"var(--t3)", marginBottom:20 }}>Upload the screenshot and enter your transaction ID to complete booking</p>

            {/* Upload zone */}
            <div
              className={`upload-zone${drag?" drag":""}${form.screenshot?" has-file":""}`}
              style={{ marginBottom:14 }}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileRef.current?.click()}
            >
              {form.screenshot ? (
                <div>
                  <img src={form.screenshot} alt="proof" style={{ maxWidth:"100%", maxHeight:200, borderRadius:10, marginBottom:10, boxShadow:"0 4px 24px rgba(0,0,0,0.4)" }}/>
                  <div style={{ fontSize:13, color:"var(--green)", fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                    {I.checkCircle} {form.screenshotName}
                  </div>
                  <div style={{ fontSize:11, color:"var(--t3)", marginTop:4 }}>Tap to change image</div>
                </div>
              ) : (
                <div>
                  <div style={{ color:"var(--t3)", marginBottom:12, display:"flex", justifyContent:"center" }}>{I.upload}</div>
                  <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>Tap to upload screenshot</div>
                  <div style={{ fontSize:12, color:"var(--t3)" }}>or drag & drop here · JPG, PNG</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])}/>

            <div className="card" style={{ marginBottom:14 }}>
              <div className="field" style={{ marginBottom:0 }}>
                <label>UTR / Transaction Reference Number <span style={{ color:"var(--a)" }}>*</span></label>
                <input className="inp" placeholder="e.g. 412301230456" value={form.utr} onChange={e => sf("utr", e.target.value)}/>
                <div style={{ fontSize:11, color:"var(--t3)", marginTop:5 }}>Find this in your payment app → transaction history → reference/UTR number</div>
              </div>
            </div>

            <div style={{ display:"flex", gap:8 }}>
              <button className="btn btn-ghost" style={{ minWidth:90 }} onClick={() => setStep(3)}>{I.arrowLeft} Back</button>
              <button className="btn btn-primary" style={{ flex:1, padding:14 }} disabled={!ok4 || loading} onClick={submit}>
                {loading ? (
                  <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation:"spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" opacity=".3"/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
                    Confirming Booking…
                  </span>
                ) : <>Confirm Booking {I.check}</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── CONFIRMATION ─────────────────────────── */
function Confirmation({ booking, settings, onHome }) {
  const waMsg = encodeURIComponent(`Hi! I just booked a seat with ${settings.brandName} for my NPTEL exam.\n\n🎟️ Booking ID: *${booking.id}*\n👤 Name: ${booking.name}\n🏫 Center: ${booking.centerName}, ${booking.centerCity}\n📅 Date: ${fmtDate(booking.date)}\n🕐 Slot: ${booking.slotLabel}\n💰 Amount Paid: ₹${booking.price}\n\n⏳ Status: Pending Verification\n\nPowered by ${settings.brandName}`);
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      {/* Confetti dots */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        {[...Array(20)].map((_,i) => (
          <div key={i} style={{ position:"absolute", width:6, height:6, borderRadius:i%3===0?"50%":"2px",
            background: i%4===0?"#F97316":i%4===1?"#FBBF24":i%4===2?"#10B981":"#3B82F6",
            left:`${5+i*4.5}%`, top:`${Math.random()*40+10}%`, opacity:.6,
            animation:`float ${1.5+i*0.2}s ease-in-out infinite`, animationDelay:`${i*0.1}s` }}/>
        ))}
      </div>

      <div style={{ maxWidth:460, width:"100%", textAlign:"center", position:"relative" }}>
        {/* Success icon */}
        <div className="anim-popin" style={{ marginBottom:20 }}>
          <div style={{ width:76, height:76, borderRadius:"50%", background:"linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.05))", border:"2px solid rgba(16,185,129,0.4)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto", position:"relative" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" width="32" height="32">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <div style={{ position:"absolute", inset:-3, borderRadius:"50%", border:"2px solid transparent", borderTopColor:"rgba(16,185,129,0.4)", animation:"spin 2s linear infinite" }}/>
          </div>
        </div>

        <h2 className="anim-fadeup d1" style={{ fontFamily:"var(--font-head)", fontSize:28, fontWeight:800, marginBottom:8 }}>Booking Submitted! 🎉</h2>
        <p className="anim-fadeup d2" style={{ color:"var(--t2)", fontSize:14, lineHeight:1.7, marginBottom:24 }}>
          Your seat has been reserved. Payment verification usually takes <strong>1–3 hours</strong>. You'll be notified on WhatsApp once approved.
        </p>

        {/* Booking card */}
        <div className="card anim-fadeup d3" style={{ marginBottom:16, textAlign:"left", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,var(--a),var(--a2))" }}/>
          {/* Booking ID */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid var(--b)" }}>
            <span style={{ fontSize:11, fontWeight:700, color:"var(--t3)", textTransform:"uppercase", letterSpacing:.6 }}>Booking ID</span>
            <span style={{ fontFamily:"var(--font-mono)", fontWeight:700, fontSize:17, color:"var(--a)", letterSpacing:2 }}>{booking.id}</span>
          </div>
          {[
            ["Passenger", booking.name],
            ["Phone", booking.phone],
            ["College", booking.college],
            ["Exam Center", `${booking.centerName}, ${booking.centerCity}`],
            ["Date", fmtDate(booking.date)],
            ["Time Slot", booking.slotLabel],
            ["Seats", booking.groupSize],
            ["Amount Paid", `₹${booking.price}`],
            ["Payment Status", "⏳ Under Verification"],
          ].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,.03)" }}>
              <span style={{ fontSize:12, color:"var(--t3)" }}>{k}</span>
              <span style={{ fontSize:13, fontWeight:500, textAlign:"right", maxWidth:"60%" }}>{v}</span>
            </div>
          ))}
        </div>

        <div className="anim-fadeup d4" style={{ display:"flex", flexDirection:"column", gap:9 }}>
          <a className="btn btn-success" style={{ justifyContent:"center" }} href={`https://wa.me/${settings.whatsapp}?text=${waMsg}`} target="_blank" rel="noreferrer">
            {I.wa} Share Booking on WhatsApp
          </a>
          <button className="btn btn-ghost" onClick={onHome}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── ADMIN LOGIN ─────────────────────────── */
function AdminLogin({ settings, onLogin, onBack }) {
  const [pw, setPw] = useState(""), [err, setErr] = useState(false), [show, setShow] = useState(false);
  const go = () => pw===settings.adminPass ? onLogin() : (setErr(true), setTimeout(()=>setErr(false),2500));
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(249,115,22,0.07) 0%,transparent 70%)" }}/>
      </div>
      <div style={{ maxWidth:380, width:"100%", position:"relative" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:50, height:50, borderRadius:14, background:"linear-gradient(135deg,#F97316,#FBBF24)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:"0 8px 28px rgba(249,115,22,0.4)" }}>
            <span style={{ color:"#fff" }}>{I.gear}</span>
          </div>
          <h2 style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:24 }}>Admin Panel</h2>
          <p style={{ color:"var(--t3)", fontSize:13, marginTop:5 }}>{settings.brandName} · Management Portal</p>
        </div>
        <div className="card" style={{ border:"1px solid var(--b2)" }}>
          <div className="field" style={{ position:"relative" }}>
            <label>{I.lock} Password</label>
            <input className="inp" type={show?"text":"password"} placeholder="Enter admin password" value={pw}
              style={err?{borderColor:"var(--red)",boxShadow:"0 0 0 3px rgba(244,63,94,0.1)"}:{}}
              onChange={e => setPw(e.target.value)} onKeyDown={e => e.key==="Enter" && go()}
            />
            <button onClick={() => setShow(s => !s)} style={{ position:"absolute", right:12, bottom:11, background:"none", border:"none", color:"var(--t3)", cursor:"pointer", fontSize:12 }}>
              {show?"Hide":"Show"}
            </button>
          </div>
          {err && (
            <div style={{ color:"var(--red)", fontSize:12.5, marginTop:-8, marginBottom:12, display:"flex", alignItems:"center", gap:5 }}>
              {I.x} Incorrect password. Please try again.
            </div>
          )}
          <button className="btn btn-primary" style={{ width:"100%", padding:13 }} onClick={go}>
            Login to Admin →
          </button>
        </div>
        <div style={{ textAlign:"center", marginTop:16 }}>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>{I.arrowLeft} Back to Website</button>
        </div>
        <div style={{ textAlign:"center", marginTop:10, fontSize:11, color:"var(--t4)" }}>
          Default password: mk@admin · Change it in Settings tab
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── ADMIN DASHBOARD ─────────────────────────── */
function AdminDashboard({ settings, setSettings, bookings, setBookings, onLogout, toast }) {
  const [tab, setTab]   = useState("overview");
  const [modal, setModal] = useState(null);
  const [filter, setFil] = useState({ q:"", status:"", center:"" });

  // Editable settings state
  const [gen, setGen] = useState({
    brandName: settings.brandName, tagline: settings.tagline,
    upiId: settings.upiId, upiName: settings.upiName,
    adminPass: settings.adminPass, seatsPerSlot: settings.seatsPerSlot,
    whatsapp: settings.whatsapp, supportPhone: settings.supportPhone,
    announcement: settings.announcement, announcementOn: settings.announcementOn,
    instructions: settings.instructions, footerNote: settings.footerNote,
  });
  const [ctrs, setCtrs] = useState([...settings.centers]);
  const [dts, setDts]   = useState([...settings.dates]);
  const [sls, setSls]   = useState([...settings.slots]);
  const [newC, setNewC] = useState({ name:"", city:"", price:"", address:"" });
  const [newD, setNewD] = useState("");
  const [newS, setNewS] = useState({ label:"", time:"" });

  const save = () => {
    const upd = { ...settings, ...gen, centers:ctrs, dates:dts, slots:sls };
    setSettings(upd);
    sv(SK, upd);
    toast("Settings saved successfully!", "success");
  };

  const setStatus = (id, status) => {
    const upd = bookings.map(b => b.id===id ? {...b,status} : b);
    setBookings(upd); sv(BK, upd);
    setModal(m => m?.id===id ? {...m,status} : m);
    toast(status==="approved" ? "Booking approved ✓" : "Booking rejected", status==="approved"?"success":"error");
  };

  const del = (id) => {
    if (!confirm("Delete this booking?")) return;
    const upd = bookings.filter(b => b.id!==id);
    setBookings(upd); sv(BK, upd);
    setModal(null);
    toast("Booking deleted", "info");
  };

  const exportCSV = () => {
    const rows = [
      ["ID","Name","Phone","Email","College","Roll No","Center","City","Date","Slot","Seats","Amount","UTR","Status","Booked At"],
      ...bookings.map(b=>[b.id,b.name,b.phone,b.email||"",b.college,b.rollNo||"",b.centerName,b.centerCity||"",b.date,b.slotLabel,b.groupSize||1,b.price,b.utr,b.status,b.createdAt])
    ];
    const csv = rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8,\uFEFF"+encodeURIComponent(csv);
    a.download = `mk_bookings_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const stats = {
    total:    bookings.length,
    pending:  bookings.filter(b=>b.status==="pending").length,
    approved: bookings.filter(b=>b.status==="approved").length,
    rejected: bookings.filter(b=>b.status==="rejected").length,
    revenue:  bookings.filter(b=>b.status==="approved").reduce((s,b)=>s+b.price,0),
    today:    bookings.filter(b=>b.createdAt?.startsWith(new Date().toISOString().slice(0,10))).length,
  };

  const filtered = bookings.filter(b =>
    (!filter.status || b.status===filter.status) &&
    (!filter.center || b.centerId===filter.center) &&
    (!filter.q || [b.name,b.phone,b.id,b.college,b.rollNo].some(v=>v?.toLowerCase().includes(filter.q.toLowerCase())))
  );

  const TABS = [
    { k:"overview", l:"Overview", ic:I.chartBar },
    { k:"bookings", l:"Bookings", ic:I.list },
    { k:"settings", l:"Settings", ic:I.gear },
  ];

  return (
    <div style={{ minHeight:"100vh" }}>
      {/* Admin Nav */}
      <nav className="nav" style={{ gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#F97316,#FBBF24)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", transform:"scale(.85)" }}>{I.bus}</span>
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:14 }}>{settings.brandName}</div>
            <div style={{ fontSize:9, color:"var(--t3)", fontWeight:600, letterSpacing:.5, lineHeight:1 }}>ADMIN PANEL</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
          {TABS.map(t => (
            <button key={t.k} className={`btn btn-sm ${tab===t.k?"btn-primary":"btn-ghost"}`} onClick={() => setTab(t.k)} style={{ gap:5 }}>
              {t.ic} {t.l}
            </button>
          ))}
          <button className="btn btn-glass btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"20px 16px 60px" }}>

        {/* ── OVERVIEW ── */}
        {tab==="overview" && (
          <div>
            <div style={{ marginBottom:20 }}>
              <h2 style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:22, marginBottom:4 }}>Dashboard Overview</h2>
              <p style={{ fontSize:13, color:"var(--t3)" }}>Welcome back. Here's what's happening with {settings.brandName}.</p>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10, marginBottom:20 }}>
              {[
                { l:"Total Bookings", v:stats.total, sub:"All time", c:"var(--a)", bg:"rgba(249,115,22,0.08)", bc:"rgba(249,115,22,0.2)" },
                { l:"Pending Review", v:stats.pending, sub:"Needs action", c:"#FBBF24", bg:"rgba(251,191,36,0.08)", bc:"rgba(251,191,36,0.2)" },
                { l:"Confirmed", v:stats.approved, sub:"Approved seats", c:"var(--green)", bg:"rgba(16,185,129,0.08)", bc:"rgba(16,185,129,0.2)" },
                { l:"Revenue", v:`₹${stats.revenue.toLocaleString("en-IN")}`, sub:"From approved", c:"var(--purple)", bg:"rgba(139,92,246,0.08)", bc:"rgba(139,92,246,0.2)" },
                { l:"Today", v:stats.today, sub:"New bookings", c:"var(--blue)", bg:"rgba(59,130,246,0.08)", bc:"rgba(59,130,246,0.2)" },
                { l:"Rejected", v:stats.rejected, sub:"Declined", c:"var(--red)", bg:"rgba(244,63,94,0.08)", bc:"rgba(244,63,94,0.2)" },
              ].map((s,i) => (
                <div key={i} className="stat-card anim-fadeup" style={{ animationDelay:`${i*0.06}s`, borderColor:s.bc, background:`linear-gradient(135deg,${s.bg},transparent)` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:"var(--t3)", textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>{s.l}</div>
                  <div style={{ fontFamily:"var(--font-head)", fontSize:28, fontWeight:800, color:s.c, lineHeight:1, marginBottom:4 }}>
                    <Counter target={typeof s.v==="number"?s.v:0} prefix={typeof s.v==="string"&&s.v.startsWith("₹")?"₹":""} />
                    {typeof s.v==="string"&&!s.v.startsWith("₹")?s.v:""}
                  </div>
                  <div style={{ fontSize:11, color:"var(--t3)" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Pending alert */}
            {stats.pending > 0 && (
              <div className="anim-fadeup" style={{ background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:12, padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13.5, color:"#FBBF24", fontWeight:600 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#FBBF24", animation:"pulse 1.5s ease-in-out infinite" }}/>
                  {stats.pending} booking{stats.pending>1?"s":""} waiting for payment verification
                </div>
                <button className="btn btn-sm" style={{ background:"rgba(251,191,36,0.15)", color:"#FBBF24", border:"1px solid rgba(251,191,36,0.25)" }} onClick={() => { setFil(f=>({...f,status:"pending"})); setTab("bookings"); }}>
                  Review Now {I.arrow}
                </button>
              </div>
            )}

            {/* Center breakdown */}
            <div className="card" style={{ marginBottom:14 }}>
              <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:15, marginBottom:14 }}>Bookings by Center</div>
              <div style={{ display:"grid", gap:10 }}>
                {settings.centers.map(c => {
                  const cnt = bookings.filter(b=>b.centerId===c.id&&b.status!=="rejected").length;
                  const max = settings.seatsPerSlot * settings.slots.length * settings.dates.length;
                  const pct = Math.min(100, (cnt/Math.max(1,max))*100);
                  return (
                    <div key={c.id} style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:120, fontSize:12, fontWeight:500, flexShrink:0 }}>{c.name}</div>
                      <div style={{ flex:1, height:6, background:"var(--c3)", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`, height:"100%", background:"linear-gradient(90deg,var(--a),var(--a2))", borderRadius:3, transition:"width 1s ease" }}/>
                      </div>
                      <div style={{ fontSize:12, color:"var(--t2)", fontFamily:"var(--font-mono)", width:50, textAlign:"right", flexShrink:0 }}>{cnt}/{max}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent */}
            <div className="card">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:15 }}>Recent Bookings</div>
                <div style={{ display:"flex", gap:7 }}>
                  {bookings.length>0 && <button className="btn btn-glass btn-sm" onClick={exportCSV}>{I.download} Export CSV</button>}
                  <button className="btn btn-ghost btn-sm" onClick={() => setTab("bookings")}>View All →</button>
                </div>
              </div>
              {bookings.length===0 ? (
                <div style={{ textAlign:"center", color:"var(--t3)", padding:"32px 0", fontSize:14 }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🚌</div>
                  No bookings yet! Share your website to start getting bookings.
                </div>
              ) : (
                <div className="scrollable">
                  <table className="tbl">
                    <thead><tr><th>Booking ID</th><th>Name</th><th>Center</th><th className="hide-sm">Date</th><th>Amount</th><th>Status</th></tr></thead>
                    <tbody>
                      {[...bookings].reverse().slice(0,8).map(b => (
                        <tr key={b.id} onClick={() => { setModal(b); setTab("bookings"); }}>
                          <td><span style={{ fontFamily:"var(--font-mono)", fontSize:11.5, color:"var(--a)" }}>{b.id}</span></td>
                          <td><div style={{ fontWeight:500, fontSize:13 }}>{b.name}</div><div style={{ fontSize:11, color:"var(--t3)" }}>{b.college?.split(" ").slice(0,2).join(" ")}</div></td>
                          <td style={{ fontSize:12 }}>{b.centerName}</td>
                          <td className="hide-sm" style={{ fontSize:12, color:"var(--t2)" }}>{fmtDate(b.date)}</td>
                          <td style={{ fontFamily:"var(--font-mono)", fontWeight:600, color:"var(--a)" }}>₹{b.price}</td>
                          <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
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
        {tab==="bookings" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:20 }}>All Bookings</h2>
                <p style={{ fontSize:12, color:"var(--t3)", marginTop:2 }}>{filtered.length} booking{filtered.length!==1?"s":""} found</p>
              </div>
              {bookings.length>0 && <button className="btn btn-glass btn-sm" onClick={exportCSV}>{I.download} Export CSV</button>}
            </div>

            {/* Filters */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr auto auto", gap:8, marginBottom:14 }}>
              <input className="inp" placeholder="Search name, phone, ID, college…" value={filter.q} onChange={e => setFil(f=>({...f,q:e.target.value}))}/>
              <select className="inp" value={filter.status} onChange={e => setFil(f=>({...f,status:e.target.value}))} style={{ minWidth:130 }}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select className="inp" value={filter.center} onChange={e => setFil(f=>({...f,center:e.target.value}))} style={{ minWidth:140 }}>
                <option value="">All Centers</option>
                {settings.centers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="card">
              <div className="scrollable">
                <table className="tbl">
                  <thead><tr><th>ID</th><th>Passenger</th><th>Phone</th><th className="hide-sm">Center</th><th className="hide-sm">Date · Slot</th><th>₹</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filtered.length===0 && (
                      <tr><td colSpan={8} style={{ textAlign:"center", color:"var(--t3)", padding:28, fontSize:13 }}>No bookings match your filters</td></tr>
                    )}
                    {[...filtered].reverse().map(b => (
                      <tr key={b.id}>
                        <td><span style={{ fontFamily:"var(--font-mono)", fontSize:11.5, color:"var(--a)" }}>{b.id}</span></td>
                        <td>
                          <div style={{ fontWeight:500, fontSize:13 }}>{b.name}</div>
                          <div style={{ fontSize:11, color:"var(--t3)" }}>{b.college}</div>
                        </td>
                        <td style={{ fontSize:12.5 }}>{b.phone}</td>
                        <td className="hide-sm" style={{ fontSize:12, color:"var(--t2)" }}>{b.centerName}</td>
                        <td className="hide-sm" style={{ fontSize:11.5, color:"var(--t2)" }}>{fmtDate(b.date)}<br/><span style={{ color:"var(--t3)" }}>{b.slotLabel}</span></td>
                        <td style={{ fontFamily:"var(--font-mono)", fontWeight:600, color:"var(--a)", fontSize:13 }}>₹{b.price}</td>
                        <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                        <td>
                          <div style={{ display:"flex", gap:5 }}>
                            <button className="btn btn-glass btn-xs" onClick={() => setModal(b)} title="View details">{I.eye}</button>
                            {b.status!=="approved" && <button className="btn btn-success btn-xs" onClick={() => setStatus(b.id,"approved")} title="Approve">{I.check}</button>}
                            {b.status!=="rejected" && <button className="btn btn-danger btn-xs" onClick={() => setStatus(b.id,"rejected")} title="Reject">{I.x}</button>}
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
        {tab==="settings" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, flexWrap:"wrap", gap:10 }}>
              <div>
                <h2 style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:20, marginBottom:4 }}>Website Settings</h2>
                <p style={{ fontSize:13, color:"var(--t3)" }}>All changes reflect on your website immediately after saving.</p>
              </div>
              <button className="btn btn-primary" style={{ padding:"11px 24px" }} onClick={save}>💾 Save All Changes</button>
            </div>

            <div style={{ display:"grid", gap:14 }}>
              {/* Brand */}
              <div className="card">
                <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:15, marginBottom:16, display:"flex", alignItems:"center", gap:7 }}>
                  🎨 Brand & Content
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {[
                    { k:"brandName",    l:"Brand / Business Name",         p:"MK Bus Service" },
                    { k:"tagline",      l:"Tagline / Subtitle",             p:"Your Trusted Exam Partner" },
                    { k:"supportPhone", l:"Support Phone Number",           p:"9876543210" },
                    { k:"whatsapp",     l:"WhatsApp Number (with country code)", p:"919876543210" },
                    { k:"footerNote",   l:"Footer Note",                    p:"Safe · Punctual · Affordable." },
                  ].map(f => (
                    <div key={f.k} className="field" style={{ marginBottom:0 }}>
                      <label>{f.l}</label>
                      <input className="inp" placeholder={f.p} value={gen[f.k]||""} onChange={e => setGen(g=>({...g,[f.k]:e.target.value}))}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcement */}
              <div className="card">
                <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:15, marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
                  📢 Announcement Banner
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:13, color:"var(--t2)" }}>
                    <div style={{ position:"relative", width:38, height:22, borderRadius:11, background:gen.announcementOn?"linear-gradient(135deg,var(--a),var(--a2))":"var(--c3)", transition:"background .2s", cursor:"pointer" }}
                      onClick={() => setGen(g=>({...g,announcementOn:!g.announcementOn}))}>
                      <div style={{ position:"absolute", top:3, left:gen.announcementOn?18:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }}/>
                    </div>
                    Show banner on website
                  </label>
                </div>
                <div className="field" style={{ marginBottom:0 }}>
                  <label>Banner Text</label>
                  <input className="inp" placeholder="🚌 Booking is LIVE! Limited seats available." value={gen.announcement||""} onChange={e => setGen(g=>({...g,announcement:e.target.value}))}/>
                </div>
              </div>

              {/* Payment */}
              <div className="card">
                <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:15, marginBottom:16, display:"flex", alignItems:"center", gap:7 }}>
                  💳 Payment Settings
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                  {[
                    { k:"upiId",   l:"UPI ID",           p:"yourname@paytm" },
                    { k:"upiName", l:"UPI Display Name", p:"MK Bus Service" },
                  ].map(f => (
                    <div key={f.k} className="field" style={{ marginBottom:0 }}>
                      <label>{f.l}</label>
                      <input className="inp" placeholder={f.p} value={gen[f.k]||""} onChange={e => setGen(g=>({...g,[f.k]:e.target.value}))}/>
                    </div>
                  ))}
                </div>
                <div className="field" style={{ marginBottom:0 }}>
                  <label>Payment Instructions (shown to students)</label>
                  <textarea className="inp" rows={5} value={gen.instructions||""} onChange={e => setGen(g=>({...g,instructions:e.target.value}))} placeholder="Step-by-step instructions…"/>
                </div>
              </div>

              {/* Access */}
              <div className="card">
                <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:15, marginBottom:16, display:"flex", alignItems:"center", gap:7 }}>
                  🔐 Admin Access
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div className="field" style={{ marginBottom:0 }}>
                    <label>Max Seats Per Slot</label>
                    <input className="inp" type="number" min="1" value={gen.seatsPerSlot} onChange={e => setGen(g=>({...g,seatsPerSlot:+e.target.value}))}/>
                  </div>
                  <div className="field" style={{ marginBottom:0 }}>
                    <label>Change Admin Password</label>
                    <input className="inp" type="text" placeholder="New password" value={gen.adminPass} onChange={e => setGen(g=>({...g,adminPass:e.target.value}))}/>
                  </div>
                </div>
              </div>

              {/* Centers */}
              <div className="card">
                <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:15, marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
                  🏫 Exam Centers & Fares
                </div>
                <div style={{ display:"grid", gap:8, marginBottom:14 }}>
                  {ctrs.map((c,i) => (
                    <div key={c.id} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 80px auto", gap:8, alignItems:"center", background:"var(--c2)", borderRadius:10, padding:"10px 12px", border:"1px solid var(--b)" }}>
                      <input className="inp" value={c.name} placeholder="Center name" onChange={e => setCtrs(cs=>cs.map((x,j)=>j===i?{...x,name:e.target.value}:x))}/>
                      <input className="inp" value={c.city} placeholder="City" onChange={e => setCtrs(cs=>cs.map((x,j)=>j===i?{...x,city:e.target.value}:x))}/>
                      <input className="inp" type="number" value={c.price} placeholder="₹" onChange={e => setCtrs(cs=>cs.map((x,j)=>j===i?{...x,price:+e.target.value}:x))}/>
                      <button className="btn btn-danger btn-xs" onClick={() => setCtrs(cs=>cs.filter((_,j)=>j!==i))}>{I.trash}</button>
                    </div>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 80px auto", gap:8, alignItems:"end" }}>
                  {[
                    { k:"name", p:"Center name" }, { k:"city", p:"City" },
                    { k:"price", p:"₹", t:"number" }, { skip:true }
                  ].map((f,i) => f.skip ? (
                    <button key={i} className="btn btn-primary btn-sm" onClick={() => {
                      if (!newC.name||!newC.city||!newC.price) return;
                      setCtrs(cs=>[...cs,{ id:"c"+Date.now(), name:newC.name, city:newC.city, price:+newC.price, address:newC.city }]);
                      setNewC({ name:"", city:"", price:"", address:"" });
                    }}>{I.plus} Add</button>
                  ) : (
                    <div key={i}>
                      <label style={{ fontSize:10, color:"var(--t3)", fontWeight:600, letterSpacing:.4, textTransform:"uppercase", display:"block", marginBottom:5 }}>{f.p}</label>
                      <input className="inp" type={f.t||"text"} placeholder={f.p} value={newC[f.k]||""} onChange={e => setNewC(n=>({...n,[f.k]:e.target.value}))}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="card">
                <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:15, marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
                  📅 Exam Dates
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
                  {dts.map((d,i) => (
                    <div key={d} style={{ display:"flex", alignItems:"center", gap:6, background:"var(--c2)", border:"1px solid var(--b2)", borderRadius:8, padding:"7px 12px", fontSize:12.5, fontWeight:500 }}>
                      📅 {fmtDate(d)}
                      <button style={{ background:"none", border:"none", color:"var(--red)", cursor:"pointer", display:"flex", alignItems:"center", padding:0 }} onClick={() => setDts(ds=>ds.filter((_,j)=>j!==i))}>{I.x}</button>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <input className="inp" type="date" value={newD} onChange={e => setNewD(e.target.value)} style={{ flex:1 }}/>
                  <button className="btn btn-primary btn-sm" onClick={() => {
                    if (!newD||dts.includes(newD)) return;
                    setDts(d=>[...d,newD].sort()); setNewD("");
                  }}>{I.plus} Add Date</button>
                </div>
              </div>

              {/* Slots */}
              <div className="card">
                <div style={{ fontFamily:"var(--font-head)", fontWeight:700, fontSize:15, marginBottom:14, display:"flex", alignItems:"center", gap:7 }}>
                  🕐 Time Slots
                </div>
                <div style={{ display:"grid", gap:8, marginBottom:14 }}>
                  {sls.map((s,i) => (
                    <div key={s.id} style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr auto", gap:8, background:"var(--c2)", border:"1px solid var(--b)", borderRadius:10, padding:"10px 12px", alignItems:"center" }}>
                      <input className="inp" value={s.label} placeholder="Slot name" onChange={e => setSls(ss=>ss.map((x,j)=>j===i?{...x,label:e.target.value}:x))}/>
                      <input className="inp" value={s.time} placeholder="e.g. Depart 8:00 AM · Return after exam" onChange={e => setSls(ss=>ss.map((x,j)=>j===i?{...x,time:e.target.value}:x))}/>
                      <button className="btn btn-danger btn-xs" onClick={() => setSls(ss=>ss.filter((_,j)=>j!==i))}>{I.trash}</button>
                    </div>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr auto", gap:8, alignItems:"end" }}>
                  <div>
                    <label style={{ fontSize:10, color:"var(--t3)", fontWeight:600, textTransform:"uppercase", letterSpacing:.4, display:"block", marginBottom:5 }}>Slot Name</label>
                    <input className="inp" placeholder="e.g. Evening Shift" value={newS.label} onChange={e => setNewS(n=>({...n,label:e.target.value}))}/>
                  </div>
                  <div>
                    <label style={{ fontSize:10, color:"var(--t3)", fontWeight:600, textTransform:"uppercase", letterSpacing:.4, display:"block", marginBottom:5 }}>Timing Info</label>
                    <input className="inp" placeholder="Depart 5:00 PM · Return after exam" value={newS.time} onChange={e => setNewS(n=>({...n,time:e.target.value}))}/>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ alignSelf:"end" }} onClick={() => {
                    if (!newS.label.trim()) return;
                    setSls(ss=>[...ss,{ id:"s"+Date.now(), ...newS }]);
                    setNewS({ label:"", time:"" });
                  }}>{I.plus} Add</button>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width:"100%", padding:"14px", fontSize:16 }} onClick={save}>
                💾 Save All Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {modal && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
              <div>
                <div style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:19 }}>{modal.name}</div>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"var(--a)", marginTop:3, letterSpacing:1 }}>{modal.id}</div>
                <div style={{ fontSize:11, color:"var(--t3)", marginTop:2 }}>{fmtTime(modal.createdAt)}</div>
              </div>
              <span className={`badge badge-${modal.status}`} style={{ fontSize:12 }}>{modal.status}</span>
            </div>

            {/* Details */}
            <div style={{ display:"grid", gap:0, marginBottom:16, background:"var(--c2)", borderRadius:12, overflow:"hidden" }}>
              {[
                ["Phone", modal.phone], ["Email", modal.email||"—"], ["College", modal.college],
                ["Roll No.", modal.rollNo||"—"], ["Exam Center", `${modal.centerName}, ${modal.centerCity||""}`],
                ["Date", fmtDate(modal.date)], ["Time Slot", modal.slotLabel],
                ["Seats", modal.groupSize||1], ["Total Amount", `₹${modal.price}`], ["UTR / Reference", modal.utr],
              ].map(([k,v],i) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", gap:10, padding:"9px 14px", borderBottom:"1px solid var(--b)", background:i%2===0?"transparent":"rgba(255,255,255,.015)" }}>
                  <span style={{ fontSize:11.5, color:"var(--t3)", flexShrink:0 }}>{k}</span>
                  <span style={{ fontSize:13, fontWeight:500, textAlign:"right", wordBreak:"break-all" }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Screenshot */}
            {modal.screenshot && (
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:11.5, fontWeight:600, color:"var(--t3)", textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>Payment Screenshot</div>
                <img src={modal.screenshot} alt="proof" style={{ width:"100%", borderRadius:12, border:"1px solid var(--b2)", display:"block" }}/>
              </div>
            )}

            {/* Actions */}
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {modal.status!=="approved" && <button className="btn btn-success" style={{ flex:1 }} onClick={() => setStatus(modal.id,"approved")}>{I.check} Approve Booking</button>}
              {modal.status!=="rejected" && <button className="btn btn-danger" style={{ flex:1 }} onClick={() => setStatus(modal.id,"rejected")}>{I.x} Reject</button>}
              <button className="btn btn-glass" onClick={() => del(modal.id)}>{I.trash}</button>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── APP ROOT ─────────────────────────── */
export default function App() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const [page, setPage]           = useState("home");
  const [settings, _setSettings]  = useState(() => { const s = ld(SK, null); return s ? {...DEFAULT_SETTINGS,...s} : DEFAULT_SETTINGS; });
  const [bookings, _setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) { console.error(error); return; }
      _setBookings(data);
    };
    fetchBookings();
  }, []);
  
  const [confirmed, setConfirmed]  = useState(null);
  const [toasts, toast]            = useToast();

  const setSettings = s => { _setSettings(s); sv(SK, s); };
  const setBookings = b => { _setBookings(b); sv(BK, b); };

  return (
    <>
      {page==="home"       && <Landing       settings={settings} bookings={bookings} onBook={() => setPage("book")} onAdmin={() => setPage("admin-login")}/>}
      {page==="book"       && <BookingFlow   settings={settings} bookings={bookings} onBack={() => setPage("home")} onConfirm={b => { setBookings([...bookings,b]); setConfirmed(b); setPage("confirm"); }}/>}
      {page==="confirm"    && <Confirmation  booking={confirmed} settings={settings} onHome={() => setPage("home")}/>}
      {page==="admin-login"&& <AdminLogin    settings={settings} onBack={() => setPage("home")} onLogin={() => setPage("admin")}/>}
      {page==="admin"      && <AdminDashboard settings={settings} setSettings={setSettings} bookings={bookings} setBookings={setBookings} onLogout={() => setPage("home")} toast={toast}/>}
      <ToastContainer toasts={toasts} remove={() => {}}/>
    </>
  );
}
