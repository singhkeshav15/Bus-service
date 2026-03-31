import React from "react";

export function HeroGraphic() {
  return (
    <div style={{ position: "relative", width: "100%", height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 480 420" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <linearGradient id="busBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="20%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="80%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="windowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.4" />
          </linearGradient>
          <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="busGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="groundGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="stopGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </radialGradient>

          <style>{`
            .bus-group { animation: busBob 3s ease-in-out infinite; transform-origin: 240px 230px; }
            .road-dash { stroke-dasharray: 20 16; animation: dashMove 1.2s linear infinite; }
            .stop-dot { animation: stopPulse 2s ease-in-out infinite; transform-origin: center; }
            .speed-line { animation: speedFade 1.5s ease-in-out infinite; }
            .wheel { animation: wheelSpin 0.8s linear infinite; transform-box: fill-box; transform-origin: center; }
            .signal-blink { animation: blink 1.2s step-end infinite; }
            .cloud-1 { animation: cloudDrift 18s linear infinite; }
            .cloud-2 { animation: cloudDrift 24s linear infinite; animation-delay: -8s; }
            .particle { animation: particleFade 2.5s ease-in-out infinite; }

            @keyframes busBob {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
            @keyframes dashMove {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: -36; }
            }
            @keyframes stopPulse {
              0%, 100% { r: 5; opacity: 1; }
              50% { r: 8; opacity: 0.4; }
            }
            @keyframes speedFade {
              0% { opacity: 0; transform: translateX(0); }
              40% { opacity: 0.6; }
              100% { opacity: 0; transform: translateX(-18px); }
            }
            @keyframes wheelSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.1; }
            }
            @keyframes cloudDrift {
              from { transform: translateX(-80px); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              to { transform: translateX(560px); opacity: 0; }
            }
            @keyframes particleFade {
              0%, 100% { opacity: 0; transform: translateY(0); }
              30%, 70% { opacity: 1; }
              100% { opacity: 0; transform: translateY(-20px); }
            }
          `}</style>
        </defs>

        {/* Sky gradient background orb */}
        <ellipse cx="240" cy="280" rx="220" ry="60" fill="url(#groundGlow)" />

        {/* Floating clouds */}
        <g className="cloud-1" style={{ animationDuration: "22s" }}>
          <ellipse cx="80" cy="80" rx="28" ry="10" fill="rgba(255,255,255,0.04)" rx="14" />
          <ellipse cx="95" cy="74" rx="18" ry="12" fill="rgba(255,255,255,0.03)" />
          <ellipse cx="70" cy="76" rx="14" ry="9" fill="rgba(255,255,255,0.03)" />
        </g>
        <g className="cloud-2" style={{ animationDuration: "28s", animationDelay: "-12s" }}>
          <ellipse cx="320" cy="100" rx="22" ry="8" fill="rgba(255,255,255,0.03)" />
          <ellipse cx="334" cy="95" rx="14" ry="10" fill="rgba(255,255,255,0.025)" />
        </g>

        {/* Road surface */}
        <rect x="30" y="265" width="420" height="48" rx="6" fill="rgba(255,255,255,0.025)" />
        <rect x="30" y="265" width="420" height="48" rx="6" fill="url(#roadGrad)" />
        {/* Road border lines */}
        <line x1="30" y1="266" x2="450" y2="266" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        <line x1="30" y1="312" x2="450" y2="312" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        {/* Center dash */}
        <line x1="30" y1="289" x2="450" y2="289" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="20 16" className="road-dash" />

        {/* Route stops */}
        {[90, 200, 310, 400].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy={250} r="16" fill="url(#stopGlow)" />
            <circle cx={cx} cy={250} r="5" fill="#6366F1" filter="url(#softGlow)" className="stop-dot" style={{ animationDelay: `${i * 0.5}s` }} />
            <circle cx={cx} cy={250} r="3" fill="#818CF8" />
            {/* Stop label */}
            <rect x={cx - 22} y={226} width={44} height={16} rx="8" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.2)" strokeWidth="1" />
            <text x={cx} y={238} textAnchor="middle" fill="#818CF8" fontSize="7.5" fontFamily="'JetBrains Mono',monospace" fontWeight="600">
              {["HUB A", "HUB B", "HUB C", "HUB D"][i]}
            </text>
            {/* Vertical connector */}
            <line x1={cx} y1={242} x2={cx} y2={252} stroke="rgba(99,102,241,0.4)" strokeWidth="1" strokeDasharray="2 2" />
          </g>
        ))}

        {/* Route path line */}
        <path d="M 60,250 Q 240,240 420,250" fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="1.5" strokeDasharray="4 6" />

        {/* BUS */}
        <g className="bus-group">
          {/* Glow underneath */}
          <ellipse cx="240" cy="286" rx="58" ry="8" fill="rgba(99,102,241,0.2)" filter="url(#busGlow)" />

          {/* Bus body */}
          <rect x="168" y="215" width="144" height="72" rx="10" fill="url(#busBodyGrad)" />
          {/* Body highlight */}
          <rect x="168" y="215" width="144" height="20" rx="10" fill="rgba(255,255,255,0.06)" />
          {/* Bottom shadow */}
          <rect x="168" y="262" width="144" height="25" rx="8" fill="rgba(0,0,0,0.15)" />

          {/* Windshield front */}
          <rect x="286" y="222" width="22" height="30" rx="4" fill="url(#windowGrad)" opacity="0.85" />
          {/* Windshield divider */}
          <line x1="297" y1="222" x2="297" y2="252" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {/* Passenger windows */}
          {[175, 198, 221, 244, 267].map((x, i) => (
            <g key={i}>
              <rect x={x} y={223} width={17} height={22} rx={3} fill="rgba(129,140,248,0.5)" />
              <rect x={x} y={223} width={17} height={8} rx={3} fill="rgba(255,255,255,0.1)" />
              {/* Silhouette */}
              <ellipse cx={x + 8.5} cy={241} rx={4} ry={5} fill="rgba(99,102,241,0.6)" />
            </g>
          ))}

          {/* Bus front face */}
          <rect x="305" y="226" width="6" height="10" rx="2" fill="#FBBF24" opacity="0.9" />
          {/* Headlight glow */}
          <ellipse cx="311" cy="231" rx="6" ry="4" fill="#FBBF24" opacity="0.25" filter="url(#softGlow)" />

          {/* Signal light (blinking) */}
          <rect x="308" y="240" width="4" height="4" rx="1" fill="#F97316" className="signal-blink" style={{ animationDelay: "0.3s" }} />

          {/* Bus label / number board */}
          <rect x="175" y="248" width="108" height="14" rx="3" fill="rgba(0,0,0,0.3)" />
          <text x="229" y="259" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="'JetBrains Mono',monospace" fontWeight="700" letterSpacing="2">
            NPTEL EXPRESS
          </text>

          {/* Wheels */}
          <circle cx="200" cy="286" r="12" fill="rgba(0,0,0,0.6)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" />
          <circle cx="200" cy="286" r="7" fill="rgba(255,255,255,0.06)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
          <circle cx="200" cy="286" r="3" fill="#6366F1" className="wheel" />

          <circle cx="275" cy="286" r="12" fill="rgba(0,0,0,0.6)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" />
          <circle cx="275" cy="286" r="7" fill="rgba(255,255,255,0.06)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
          <circle cx="275" cy="286" r="3" fill="#6366F1" className="wheel" style={{ animationDelay: "-0.2s" }} />

          {/* Door */}
          <rect x="168" y="232" width="1.5" height="42" rx="1" fill="rgba(255,255,255,0.1)" />

          {/* Speed lines (behind bus) */}
          {[218, 228, 238, 248, 258].map((y, i) => (
            <line
              key={i}
              x1="148" y1={y} x2="165" y2={y}
              stroke="rgba(99,102,241,0.35)"
              strokeWidth={i === 2 ? 1.5 : 1}
              className="speed-line"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </g>

        {/* Floating particles above */}
        {[
          { cx: 150, cy: 180, delay: 0 },
          { cx: 320, cy: 160, delay: 0.8 },
          { cx: 240, cy: 140, delay: 1.4 },
          { cx: 380, cy: 190, delay: 0.4 },
          { cx: 100, cy: 200, delay: 1.8 },
        ].map((p, i) => (
          <circle
            key={i}
            cx={p.cx} cy={p.cy} r="2"
            fill="#6366F1"
            className="particle"
            style={{ animationDelay: `${p.delay}s`, filter: "drop-shadow(0 0 4px rgba(99,102,241,0.8))" }}
          />
        ))}

        {/* Info card floating top-right */}
        <g transform="translate(340, 135)">
          <rect x="0" y="0" width="110" height="60" rx="12" fill="rgba(10,10,15,0.85)" stroke="rgba(99,102,241,0.25)" strokeWidth="1" />
          <rect x="0" y="0" width="110" height="60" rx="12" fill="none" stroke="rgba(129,140,248,0.1)" strokeWidth="0.5" />
          <circle cx="16" cy="16" r="5" fill="rgba(16,185,129,0.2)" />
          <circle cx="16" cy="16" r="3" fill="#10B981" style={{ filter: "drop-shadow(0 0 4px rgba(16,185,129,0.6))" }} />
          <text x="28" y="20" fill="#94a3b8" fontSize="8" fontFamily="'Plus Jakarta Sans','Outfit',sans-serif" fontWeight="600">LIVE STATUS</text>
          <text x="8" y="38" fill="white" fontSize="13" fontFamily="'Plus Jakarta Sans','Outfit',sans-serif" fontWeight="800">On Route</text>
          <text x="8" y="52" fill="#6366F1" fontSize="8" fontFamily="'JetBrains Mono',monospace" fontWeight="600">ETA: 12 MIN</text>
        </g>

        {/* Seat badge floating top-left */}
        <g transform="translate(28, 145)">
          <rect x="0" y="0" width="96" height="54" rx="12" fill="rgba(10,10,15,0.85)" stroke="rgba(99,102,241,0.25)" strokeWidth="1" />
          <text x="8" y="20" fill="#94a3b8" fontSize="8" fontFamily="'Plus Jakarta Sans','Outfit',sans-serif" fontWeight="600">AVAILABLE</text>
          <text x="8" y="38" fill="white" fontSize="20" fontFamily="'Plus Jakarta Sans','Outfit',sans-serif" fontWeight="800">42</text>
          <text x="38" y="38" fill="#6366F1" fontSize="10" fontFamily="'Plus Jakarta Sans','Outfit',sans-serif" fontWeight="700"> seats</text>
          <text x="8" y="50" fill="#94a3b8" fontSize="7.5" fontFamily="'JetBrains Mono',monospace">NPTEL EXPRESS</text>
        </g>
      </svg>
    </div>
  );
}
