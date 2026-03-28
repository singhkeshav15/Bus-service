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

export default STYLES;
