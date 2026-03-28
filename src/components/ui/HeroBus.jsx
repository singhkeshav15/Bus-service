export function HeroBus() {
  return (
    <svg
      viewBox="0 0 320 180"
      style={{ width: "100%", maxWidth: 340, filter: "drop-shadow(0 12px 40px rgba(249,115,22,0.2))" }}
    >
      <defs>
        <linearGradient id="busGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#F97316" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#1E2D45" stopOpacity="0" />
          <stop offset="20%"  stopColor="#1E2D45" />
          <stop offset="80%"  stopColor="#1E2D45" />
          <stop offset="100%" stopColor="#1E2D45" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Road */}
      <rect x="0" y="130" width="320" height="24" rx="4" fill="url(#roadGrad)" />
      <line x1="20" y1="142" x2="300" y2="142" stroke="#334155" strokeWidth="1" strokeDasharray="20 12" />
      {/* Animated road lines */}
      <line x1="20" y1="142" x2="300" y2="142" stroke="#F97316" strokeWidth="1.5" strokeDasharray="20 30" opacity=".4">
        <animate attributeName="stroke-dashoffset" from="0" to="-50" dur="1.2s" repeatCount="indefinite" />
      </line>

      {/* Bus body */}
      <rect x="40" y="72" width="200" height="58" rx="10" fill="url(#busGrad)" />
      {/* Roof detail */}
      <rect x="48" y="64" width="184" height="14" rx="6" fill="#FB923C" />

      {/* Windows */}
      {[68, 104, 140, 176].map((x, i) => (
        <rect key={i} x={x} y="82" width="28" height="20" rx="4" fill="rgba(7,11,20,0.7)" opacity=".9" />
      ))}
      {/* Window shine */}
      {[68, 104, 140, 176].map((x, i) => (
        <rect key={i} x={x + 2} y="84" width="8" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
      ))}

      {/* Door */}
      <rect x="212" y="84" width="22" height="38" rx="3" fill="rgba(7,11,20,0.55)" />
      <rect x="222" y="96" width="3"  height="8"  rx="1.5" fill="#FBBF24" />

      {/* Headlight */}
      <rect x="232" y="90" width="16" height="8" rx="3" fill="#FEF3C7" opacity=".9" />
      <rect x="233" y="91" width="14" height="6" rx="2" fill="#FFFBEB" />

      {/* Grille */}
      <rect x="234" y="102" width="14" height="2" rx="1" fill="rgba(0,0,0,0.3)" />
      <rect x="234" y="106" width="14" height="2" rx="1" fill="rgba(0,0,0,0.3)" />

      {/* Wheels */}
      {[85, 190].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="132" r="16" fill="#1E2D45" />
          <circle cx={x} cy="132" r="11" fill="#111827" />
          <circle cx={x} cy="132" r="5"  fill="#334155" />
          <circle cx={x} cy="132" r="2.5" fill="#F97316" />
          {[0, 72, 144, 216, 288].map((a, j) => (
            <circle
              key={j}
              cx={x + 7.5 * Math.cos((a * Math.PI) / 180)}
              cy={132 + 7.5 * Math.sin((a * Math.PI) / 180)}
              r="1.5"
              fill="#475569"
            />
          ))}
        </g>
      ))}

      {/* MK logo on bus */}
      <text x="80" y="116" fill="rgba(255,255,255,0.95)" fontFamily="'Syne',sans-serif" fontWeight="800" fontSize="11" letterSpacing="1">
        MK BUS
      </text>

      {/* Exhaust puffs */}
      <circle cx="34" cy="125" r="4" fill="rgba(71,85,105,0.4)">
        <animate attributeName="r"  values="2;5;2"    dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".5;0;.5" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="cx" values="34;20;10" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="30" cy="122" r="3" fill="rgba(71,85,105,0.3)">
        <animate attributeName="r"  values="1;4;1"    dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".4;0;.4" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="cx" values="30;15;5"  dur="1.8s" repeatCount="indefinite" />
      </circle>

      {/* Speed lines */}
      {[88, 96, 104].map((y, i) => (
        <line key={i} x1="16" y1={y} x2={28 + i * 3} y2={y} stroke="#F97316" strokeWidth="1" opacity=".3">
          <animate attributeName="opacity" values=".3;.6;.3" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />
        </line>
      ))}

      {/* Decorative stars */}
      {[[288, 50, 3], [300, 70, 2], [276, 40, 2], [310, 55, 1.5]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#FBBF24" opacity=".4">
          <animate attributeName="opacity" values=".2;.6;.2" dur={`${1.5 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}
