import React from "react";

export function HeroGraphic() {
  return (
    <div style={{ position: "relative", width: "100%", height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 480 420" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <filter id="glowNode" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glowLine" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="ticketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
          </linearGradient>
          <style>{`
            .pulse { animation: p 3s ease-in-out infinite; }
            .dash { animation: d 15s linear infinite; }
            .float1 { animation: f 6s ease-in-out infinite; }
            .float2 { animation: f 8s ease-in-out infinite reverse; }
            .orbit { animation: o 35s linear infinite; transform-origin: 240px 210px; }
            .node-pulse { animation: np 2s ease-in-out infinite; transform-origin: center; }
            @keyframes p { 0%,100%{opacity:0.4; transform:scale(1)} 50%{opacity:1; transform:scale(1.05)} }
            @keyframes d { to { stroke-dashoffset: -100; } }
            @keyframes f { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
            @keyframes o { to { transform: rotate(360deg); } }
            @keyframes np { 0%,100%{r:4} 50%{r:6} }
          `}</style>
        </defs>

        {/* Dynamic Nodes Background */}
        <g opacity="0.4">
           <circle cx="240" cy="210" r="140" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="1" strokeDasharray="4 8" className="dash" />
           <circle cx="240" cy="210" r="90" fill="none" stroke="rgba(99,102,241,0.3)" strokeWidth="0.5" />
        </g>

        {/* Orbiting Elements */}
        <g className="orbit">
          <circle cx="240" cy="70" r="3" fill="#6366F1" filter="url(#glowNode)" />
          <circle cx="380" cy="210" r="4" fill="#818CF8" filter="url(#glowNode)" />
          <circle cx="100" cy="210" r="2" fill="#fff" />
        </g>

        {/* Ticket / Pass Central Graphic */}
        <g className="float1" transform="translate(130, 90)">
          {/* Main Card */}
          <rect x="0" y="0" width="220" height="240" rx="16" fill="url(#ticketGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <rect x="0" y="0" width="220" height="240" rx="16" fill="rgba(8,8,12,0.6)" />
          
          <rect x="0" y="0" width="220" height="6" fill="#6366F1" style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />
          
          {/* QR Box Art */}
          <g transform="translate(50, 40)">
            <rect x="0" y="0" width="120" height="120" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
            
            <rect x="18" y="18" width="36" height="36" rx="6" fill="rgba(99,102,241,0.8)" filter="url(#glowNode)" className="pulse" />
            <rect x="66" y="18" width="36" height="36" rx="6" fill="rgba(129,140,248,0.3)" />
            <rect x="18" y="66" width="36" height="36" rx="6" fill="rgba(129,140,248,0.3)" />
            <rect x="66" y="66" width="36" height="36" rx="6" fill="rgba(99,102,241,0.5)" />
            
            <circle cx="84" cy="84" r="8" fill="#fff" />
          </g>
          
          {/* Mock Document Lines */}
          <rect x="30" y="176" width="50" height="8" rx="4" fill="rgba(255,255,255,0.5)" />
          <rect x="30" y="196" width="140" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
          <rect x="30" y="210" width="100" height="6" rx="3" fill="rgba(255,255,255,0.1)" />

          {/* Verification Checkmark */}
          <g transform="translate(170, 180)">
             <circle cx="15" cy="15" r="15" fill="#10B981" fillOpacity="0.2" stroke="#10B981" />
             <path d="M 9 15 L 13 19 L 21 11" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>

        {/* Node connections floating left */}
        <g className="float2" transform="translate(30, -5)">
           <path d="M 60,150 L 100,105 L 150,120" fill="none" stroke="#6366F1" strokeWidth="2" filter="url(#glowLine)" opacity="0.7" />
           <circle cx="60" cy="150" r="5" fill="#818CF8" />
           <circle cx="100" cy="105" r="4" fill="#fff" />
           <circle cx="150" cy="120" r="5" fill="#6366F1" className="node-pulse" />
           <text x="50" y="170" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="'JetBrains Mono',monospace" letterSpacing="1">SECURE_LNK</text>
        </g>
        
        {/* Node connections floating right */}
        <g className="float2" transform="translate(190, 160)" style={{ animationDelay: '1.5s' }}>
           <path d="M 180,90 L 230,130 L 190,195" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 4" filter="url(#glowLine)" opacity="0.6" />
           <circle cx="180" cy="90" r="3" fill="#fff" />
           <circle cx="230" cy="130" r="5" fill="#6366F1" className="node-pulse" />
           <circle cx="190" cy="195" r="6" fill="#818CF8" />
           <text x="240" y="135" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="'JetBrains Mono',monospace" letterSpacing="1">VRIFIED</text>
        </g>

      </svg>
    </div>
  );
}
