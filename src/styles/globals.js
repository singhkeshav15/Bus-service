const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  background-color:#000000;
  color:#E2E8F0;
  font-family:'Outfit',sans-serif;
  min-height:100vh;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
  margin:0;
}
.dot-bg{position:fixed;top:-5vw;left:-5vw;width:110vw;height:110vh;background-image:radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);background-size:24px 24px;pointer-events:none;z-index:-1;transition:transform 0.1s linear;transform:translate(calc(var(--mouseX,0px) * -0.02), calc(var(--mouseY,0px) * -0.02))}
.mask{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);background:rgba(0,0,0,0.7);animation:fadeIn 0.4s ease-out}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:10px}
::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.15)}

:root{
  --bg:#000000; --c1:rgba(10,10,12,0.7); --c2:rgba(255,255,255,0.015); --c3:rgba(255,255,255,0.04); 
  --a:#6366F1; --a2:#818CF8; --a3:#4F46E5;
  --green:#10B981; --red:#EF4444; --blue:#3B82F6; --purple:#8B5CF6;
  --t:#F8FAFC; --t2:#cbd5e1; --t3:#94a3b8; --t4:#44444F;
  --b:rgba(255,255,255,0.06); --b2:rgba(255,255,255,0.09); --b3:rgba(255,255,255,0.15);
  --glow:rgba(99,102,241,0.1); --glow2:rgba(99,102,241,0.2);
  --r:20px; --r2:14px; --r3:10px;
  --font-head:'Outfit',sans-serif; --font-body:'Outfit',sans-serif; --font-mono:'JetBrains Mono',monospace;
  --shadow:0 8px 32px rgba(0,0,0,0.4); --shadow2:0 12px 48px rgba(0,0,0,0.6);
  --shadow-a:0 0 0 1px rgba(99,102,241,0.3), 0 8px 32px rgba(99,102,241,0.15);
}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;border-radius:var(--r3);border:none;font-family:var(--font-body);font-size:14.5px;font-weight:600;cursor:pointer;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);white-space:nowrap;text-decoration:none;position:relative;overflow:hidden}
.btn::before{content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);transform:skewX(-25deg);transition:0s}
.btn:hover::before{left:150%;transition:0.8s ease}

.btn-primary{background:var(--a);color:#fff;box-shadow:inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 20px rgba(99,102,241,0.25)}
.btn-primary:hover{background:var(--a2);transform:translateY(-1.5px);box-shadow:inset 0 1px 0 rgba(255,255,255,0.3), 0 10px 30px rgba(99,102,241,0.35)}
.btn-primary:active{transform:translateY(0)}

.btn-ghost{background:transparent;color:var(--t2);border:1px solid var(--b)}
.btn-ghost:hover{background:rgba(255,255,255,0.04);color:#fff;border-color:var(--b2)}

.btn-glass{background:rgba(255,255,255,0.03);color:#fff;border:1px solid var(--b);backdrop-filter:blur(16px)}
.btn-glass:hover{background:rgba(255,255,255,0.06);border-color:var(--b3);box-shadow:0 0 20px rgba(255,255,255,0.05)}

.btn-success{background:linear-gradient(135deg,#10B981,#059669);color:#fff;box-shadow:inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 16px rgba(16,185,129,0.3)}
.btn-danger{background:linear-gradient(135deg,#EF4444,#DC2626);color:#fff;box-shadow:inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 16px rgba(239,68,68,0.3)}

.btn-sm{padding:8px 18px;font-size:13px;border-radius:8px;gap:6px}
.btn-xs{padding:6px 14px;font-size:12px;border-radius:7px;gap:5px}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;box-shadow:none!important}

/* INPUTS */
.field{position:relative;margin-bottom:20px}
.field label{display:block;font-size:11.5px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
.inp{width:100%;background:rgba(255,255,255,0.015);border:1px solid var(--b);border-radius:var(--r3);padding:14px 18px;color:var(--t);font-family:var(--font-body);font-size:14px;outline:none;transition:all 0.3s cubic-bezier(0.16,1,0.3,1)}
.inp:focus{border-color:var(--a);background:rgba(99,102,241,0.02);box-shadow:0 0 0 3px rgba(99,102,241,0.1)}
.inp::placeholder{color:var(--t4)}
select.inp{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center}
select.inp option{background:#000;color:var(--t)}

/* GLASSMORPHISM CARDS */
.card{background:var(--c1);border:1px solid var(--b);border-radius:var(--r);padding:24px;backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);box-shadow:var(--shadow/overlay)}
.card-hover{transition:all 0.4s cubic-bezier(0.16,1,0.3,1);cursor:pointer}
.card-hover:hover{border-color:var(--b3);transform:translateY(-3px);background:rgba(255,255,255,0.02)}

/* CHOICE CARDS */
.choice{border:1px solid var(--b);border-radius:var(--r2);padding:18px;cursor:pointer;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);background:rgba(255,255,255,0.01);position:relative;overflow:hidden}
.choice:hover{border-color:var(--b3);background:rgba(255,255,255,0.03)}
.choice.active{border-color:var(--a);background:rgba(99,102,241,0.05);box-shadow:var(--shadow-a);transform:translateY(-2px)}
.choice.active::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--a2),transparent)}
.choice.disabled{opacity:0.3;cursor:not-allowed;pointer-events:none;filter:grayscale(100%)}

/* BADGES */
.badge{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:0.5px;font-family:var(--font-mono)}
.badge-pending{background:rgba(251,191,36,0.08);color:#FBBF24;border:1px solid rgba(251,191,36,0.15)}
.badge-approved{background:rgba(16,185,129,0.08);color:#10B981;border:1px solid rgba(16,185,129,0.15)}
.badge-rejected{background:rgba(239,68,68,0.08);color:#EF4444;border:1px solid rgba(239,68,68,0.15)}

/* TABLE */
.tbl{width:100%;border-collapse:collapse;font-size:13.5px}
.tbl th{text-align:left;padding:14px 18px;color:var(--t3);font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:1.2px;border-bottom:1px solid var(--b);background:rgba(255,255,255,0.01)}
.tbl td{padding:16px 18px;border-bottom:1px solid var(--b);vertical-align:middle;color:var(--t2)}
.tbl tbody tr{transition:background 0.2s ease;cursor:pointer}
.tbl tbody tr:hover td{background:rgba(255,255,255,0.015);color:#fff}

/* MODAL / OVERLAY */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);animation:fadeIn .4s ease}
.modal{background:var(--c1);border:1px solid var(--b);border-radius:28px;padding:36px;max-width:580px;width:100%;max-height:90vh;overflow-y:auto;backdrop-filter:blur(40px);-webkit-backdrop-filter:blur(40px);box-shadow:0 40px 120px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05);animation:slideUp .5s cubic-bezier(0.16,1,0.3,1)}

/* TOAST */
.toast-wrap{position:fixed;bottom:32px;right:32px;z-index:9999;display:flex;flex-direction:column;gap:12px;pointer-events:none}
.toast{background:rgba(10,10,12,0.95);border:1px solid var(--b2);border-radius:14px;padding:16px 24px;font-size:14px;font-weight:600;color:#fff;backdrop-filter:blur(20px);box-shadow:0 20px 60px rgba(0,0,0,0.6);animation:slideInRight .5s cubic-bezier(0.16,1,0.3,1);max-width:340px;display:flex;align-items:center;gap:14px;pointer-events:all}

/* UPLOAD ZONE */
.upload-zone{border:1px dashed var(--b3);border-radius:var(--r2);padding:44px 24px;text-align:center;cursor:pointer;transition:all 0.3s ease;background:rgba(255,255,255,0.01);position:relative;overflow:hidden}
.upload-zone:hover,.upload-zone.drag{border-color:var(--a);background:rgba(99,102,241,0.02)}
.upload-zone.has-file{border-color:var(--green);background:rgba(16,185,129,0.03);border-style:solid}

/* ANIMATIONS */
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(30px) scale(0.99)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes slideInRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}

.anim-fadeup{animation:fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both}
.d1{animation-delay:.08s}.d2{animation-delay:.16s}.d3{animation-delay:.24s}.d4{animation-delay:.32s}.d5{animation-delay:.40s}.d6{animation-delay:.48s}

/* PROGRESS STEPPER (NEO) */
.stepper{display:flex;align-items:center;margin-bottom:40px;padding:0 4px}
.step-item{display:flex;flex-direction:column;align-items:center;flex:1;position:relative}
.step-circle{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;transition:all 0.4s cubic-bezier(0.16,1,0.3,1);position:relative;z-index:1;flex-shrink:0;font-family:var(--font-mono)}
.step-done .step-circle{background:var(--a);color:#fff;box-shadow:0 0 15px rgba(99,102,241,0.3)}
.step-active .step-circle{background:transparent;color:var(--a);border:2px solid var(--a);box-shadow:inset 0 0 8px rgba(99,102,241,0.1)}
.step-idle .step-circle{background:var(--c3);color:var(--t4);border:1px solid var(--b)}
.step-label{font-size:10.5px;font-weight:700;color:var(--t3);margin-top:12px;text-align:center;letter-spacing:1.2px;text-transform:uppercase}
.step-active .step-label{color:var(--t)}
.step-line{flex:1;height:1px;background:var(--b2);margin-bottom:28px;transition:background 0.4s}
.step-line.done{background:var(--a)}

/* STATS */
.stat-card{background:var(--c1);border:1px solid var(--b);border-radius:calc(var(--r2) + 4px);padding:24px;position:relative;overflow:hidden;transition:all 0.4s cubic-bezier(0.16,1,0.3,1);backdrop-filter:blur(24px)}
.stat-card:hover{border-color:var(--b2);transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,0,0,0.5)}

/* NAV */
.nav{display:flex;align-items:center;justify-content:space-between;padding:18px 40px;border-bottom:1px solid var(--b);position:sticky;top:0;z-index:100;background:rgba(0,0,0,0.4);backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px)}

/* MISC */
.divider{height:1px;background:var(--b);margin:24px 0}
.tag{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:100px;font-size:11.5px;font-weight:600;font-family:var(--font-mono);background:var(--c3);border:1px solid var(--b2)}
.text-grad{background:linear-gradient(135deg,#fff,#94a3b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.glow-dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 10px rgba(16,185,129,0.5)}
.mono{font-family:var(--font-mono)!important}
.scrollable{overflow-x:auto;-webkit-overflow-scrolling:touch}

/* LAYOUT HELPERS (MOBILE-FIRST) */
.hero-grid{display:grid;grid-template-columns:1fr 440px;gap:56px;align-items:center;position:relative;z-index:1;width:100%;max-width:1120px;margin:0 auto;padding:72px 28px}
.filter-grid{display:grid;grid-template-columns:1fr auto auto;gap:8px;margin-bottom:14px}
.settings-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.centers-row{display:grid;grid-template-columns:1fr 1fr 80px auto;gap:8px;align-items:center}
.slots-row{display:grid;grid-template-columns:1fr 1.5fr auto;gap:8px;align-items:center}

/* RESPONSIVE  640px — tablet */
@media(max-width:640px){
  .hide-sm{display:none!important}
  .card{padding:20px}
  .modal{padding:24px 20px;border-radius:20px;margin:8px;max-height:88vh}
  .nav{padding:14px 16px}
  .hero-grid{grid-template-columns:1fr;gap:0;padding:40px 20px 32px}
  .filter-grid{grid-template-columns:1fr;gap:8px}
  .settings-grid-2{grid-template-columns:1fr}
  .centers-row{grid-template-columns:1fr 80px auto;gap:6px}
  .slots-row{grid-template-columns:1fr auto;gap:6px}
  .cyber-card{padding:28px 20px!important}
  .toast-wrap{bottom:76px;right:12px;left:12px}
  .toast{max-width:100%}
  .stepper{margin-bottom:28px}
  .step-label{font-size:9px;letter-spacing:0.5px}
}

/* RESPONSIVE  480px — small phones */
@media(max-width:480px){
  .card{padding:16px}
  .modal{padding:20px 16px;margin:6px}
  .hero-grid{padding:32px 16px 24px}
  .btn{font-size:13.5px;padding:11px 20px}
  .btn-sm{padding:7px 14px;font-size:12px}
  .toast-wrap{bottom:80px;right:10px;left:10px}
}

/* MOBILE STICKY BOTTOM CTA */
.mobile-cta{display:none}
@media(max-width:640px){
  .mobile-cta{
    display:flex;gap:10px;
    position:fixed;bottom:0;left:0;right:0;
    padding:12px 16px env(safe-area-inset-bottom,12px);
    background:rgba(0,0,0,0.88);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
    border-top:1px solid var(--b);z-index:500;
  }
  body{padding-bottom:env(safe-area-inset-bottom,0)}
}

/* DATA FLOW SVG (REFINED) */
.data-path{fill:none;stroke:var(--a);stroke-width:1;stroke-linecap:round;stroke-opacity:0.2}
.data-packet{fill:var(--a);filter:blur(1px);transform-origin:center;animation:flowPath 4s linear infinite}
@keyframes flowPath{0%{offset-distance:0%}100%{offset-distance:100%}}

/* CYBER CHASE BORDER (REFINED TO GLOW) */
.cyber-card{position:relative;background:rgba(0,0,0,0.4);border-radius:28px;padding:48px 40px;backdrop-filter:blur(32px);border:1px solid var(--b)}
.cyber-card::after{content:'';position:absolute;inset:0;border-radius:28px;padding:1px;background:linear-gradient(135deg,rgba(99,102,241,0.4),transparent,rgba(99,102,241,0.4));-webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;opacity:0.3;transition:opacity 0.6s}
.cyber-card:hover::after{opacity:0.8}

/* SPINNER */
.spinner-sm{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,0.15);border-top-color:#fff;animation:spin 0.7s linear infinite}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

/* RADIO */
.radio-outer{width:20px;height:20px;border-radius:50%;border:1.5px solid var(--b3);display:flex;align-items:center;justify-content:center;transition:all 0.25s;flex-shrink:0}
.radio-outer.checked{border-color:var(--a);box-shadow:0 0 0 3px rgba(99,102,241,0.12)}
.radio-inner{width:9px;height:9px;border-radius:50%;background:var(--a);transform:scale(0);transition:transform 0.25s cubic-bezier(0.16,1,0.3,1)}
.radio-outer.checked .radio-inner{transform:scale(1)}

/* ANIM POPIN */
@keyframes popIn{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
.anim-popin{animation:popIn 0.6s cubic-bezier(0.16,1,0.3,1) both}
`;

export default STYLES;
