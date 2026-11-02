/**
 * Vector Graphics (SVGs) for Underwater Scooters in Maths Handbuilder
 */

export const SCOOTER_ART = {
  // Sea A: Underwater Scooter (Starter electric DPV with propeller)
  A_Scooter: `
  <svg viewBox="0 0 200 130" class="scooter-svg scooter-a" xmlns="http://www.w3.org/2000/svg">
    <!-- Water Bubbles -->
    <circle cx="22" cy="72" r="4" fill="#38bdf8" opacity="0.6"/>
    <circle cx="12" cy="62" r="2.5" fill="#38bdf8" opacity="0.5"/>
    <circle cx="18" cy="85" r="3" fill="#38bdf8" opacity="0.4"/>
    <circle cx="30" cy="55" r="2" fill="#38bdf8" opacity="0.5"/>

    <!-- Propeller Shroud & Blades (Left) -->
    <rect x="36" y="52" width="14" height="34" rx="4" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <path d="M43 55 L39 69 L43 83" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="38" cy="69" rx="3" ry="12" fill="#64748b"/>

    <!-- Main Torpedo Battery Body (Bright Yellow & Teal) -->
    <path d="M48 50 L140 50 C165 50, 175 69, 175 69 C175 69, 165 88, 140 88 L48 88 Z" 
          fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/>
    <!-- Bottom Hull Accent (Cyan) -->
    <path d="M50 72 L140 72 C158 72, 168 76, 172 74 C164 86, 145 87, 136 87 L50 87 Z" 
          fill="#0284c7" opacity="0.9"/>

    <!-- Battery Charge Indicator Window -->
    <rect x="74" y="57" width="46" height="12" rx="3" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
    <rect x="77" y="60" width="8" height="6" rx="1" fill="#4ade80"/>
    <rect x="87" y="60" width="8" height="6" rx="1" fill="#4ade80"/>
    <rect x="97" y="60" width="8" height="6" rx="1" fill="#4ade80"/>
    <rect x="107" y="60" width="8" height="6" rx="1" fill="#4ade80"/>

    <!-- Dual Handlebars & Grips (Top) -->
    <path d="M90 50 L90 32 L116 32 L116 50" fill="none" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
    <rect x="85" y="27" width="10" height="7" rx="2" fill="#ef4444"/>
    <rect x="111" y="27" width="10" height="7" rx="2" fill="#ef4444"/>
    <!-- Accelerator Trigger -->
    <circle cx="116" cy="37" r="2.5" fill="#facc15"/>

    <!-- Front Headlight & Cone -->
    <path d="M168 62 C178 65, 178 73, 168 76 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>
    <polygon points="175,69 198,54 198,84" fill="#fef08a" opacity="0.35"/>

    <!-- Stabilizer Fin (Bottom) -->
    <path d="M68 88 L60 104 L78 96 L84 88 Z" fill="#0369a1" stroke="#075985" stroke-width="1.5"/>
    <!-- Bolt Emblem -->
    <polygon points="132,58 126,67 132,67 128,78 138,67 132,67" fill="#ffffff" stroke="#ca8a04" stroke-width="1"/>
  </svg>
  `,

  // Sea B: Ten Speed Scooter (High-speed streamlined dual thruster)
  B_Scooter: `
  <svg viewBox="0 0 200 130" class="scooter-svg scooter-b" xmlns="http://www.w3.org/2000/svg">
    <!-- Speed Lines -->
    <line x1="10" y1="45" x2="32" y2="45" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <line x1="5" y1="68" x2="36" y2="68" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
    <line x1="14" y1="92" x2="30" y2="92" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" opacity="0.5"/>

    <!-- Twin Thruster Shrouds -->
    <rect x="34" y="44" width="16" height="20" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
    <rect x="34" y="74" width="16" height="20" rx="3" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
    <ellipse cx="36" cy="54" rx="3" ry="8" fill="#38bdf8"/>
    <ellipse cx="36" cy="84" rx="3" ry="8" fill="#38bdf8"/>

    <!-- Ultra-Streamlined Main Body (Teal & Lime) -->
    <path d="M48 46 L148 48 C176 50, 185 68, 185 68 C185 68, 176 86, 148 88 L48 90 Z" 
          fill="#0d9488" stroke="#115e59" stroke-width="2.5"/>
    <path d="M52 58 L142 60 C162 62, 172 68, 172 68 C168 76, 156 78, 138 78 L52 78 Z" 
          fill="#14b8a6"/>

    <!-- Speed Striping (Lime Accent) -->
    <path d="M72 49 L132 50 L118 62 L58 61 Z" fill="#a3e635"/>
    <path d="M72 87 L132 86 L118 76 L58 77 Z" fill="#a3e635"/>

    <!-- Cockpit Speedometer Dome -->
    <ellipse cx="112" cy="46" rx="16" ry="9" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="112" y="49" text-anchor="middle" font-size="7" font-weight="900" fill="#a3e635">10 SPEED</text>

    <!-- Ergonomic Racing Grips -->
    <path d="M96 46 L96 28 L128 28 L128 46" fill="none" stroke="#334155" stroke-width="3.5" stroke-linecap="round"/>
    <rect x="91" y="24" width="10" height="7" rx="2" fill="#14b8a6"/>
    <rect x="123" y="24" width="10" height="7" rx="2" fill="#14b8a6"/>

    <!-- Swept Wing Fins -->
    <path d="M56 46 L46 22 L72 38 Z" fill="#0f766e" stroke="#115e59" stroke-width="1.5"/>
    <path d="M56 90 L46 114 L72 98 Z" fill="#0f766e" stroke="#115e59" stroke-width="1.5"/>
  </svg>
  `,

  // Sea C: Reverse Gear Scooter (Industrial submarine with reversing thrusters)
  C_Scooter: `
  <svg viewBox="0 0 200 130" class="scooter-svg scooter-c" xmlns="http://www.w3.org/2000/svg">
    <!-- Hazard Stripes Pattern (Warning) -->
    <!-- Heavy Duty Main Hull (Orange & Slate) -->
    <rect x="46" y="48" width="115" height="42" rx="12" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
    <rect x="52" y="54" width="103" height="30" rx="8" fill="#f97316"/>

    <!-- Reversible Thruster Cowling (Center Bi-directional) -->
    <rect x="26" y="52" width="22" height="34" rx="4" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <path d="M22 62 L32 62 L28 56 Z" fill="#facc15"/>
    <path d="M42 76 L32 76 L36 82 Z" fill="#facc15"/>

    <!-- Hazard Stripes on Hull -->
    <polygon points="68,54 78,54 66,84 56,84" fill="#1e293b"/>
    <polygon points="88,54 98,54 86,84 76,84" fill="#1e293b"/>
    <polygon points="108,54 118,54 106,84 96,84" fill="#1e293b"/>

    <!-- Reverse Gear Lever & Housing -->
    <rect x="120" y="36" width="18" height="14" rx="3" fill="#1e293b"/>
    <line x1="129" y1="36" x2="124" y2="22" stroke="#dc2626" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="123" cy="20" r="5" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
    <!-- Gear label -->
    <text x="129" y="47" text-anchor="middle" font-size="7" font-weight="900" fill="#f8fafc">R/D</text>

    <!-- Handlebars (Sturdy Steel) -->
    <path d="M84 48 L84 30 L108 30 L108 48" fill="none" stroke="#475569" stroke-width="4"/>
    <rect x="80" y="26" width="8" height="7" rx="1" fill="#f97316"/>
    <rect x="104" y="26" width="8" height="7" rx="1" fill="#f97316"/>

    <!-- Reinforced Bumper Cage (Front) -->
    <path d="M158 52 C172 58, 172 80, 158 86" fill="none" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
    <circle cx="164" cy="69" r="6" fill="#fde047" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Reverse Thruster Exhaust Vents -->
    <line x1="144" y1="90" x2="136" y2="104" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  </svg>
  `,

  // Sea D: Double Drive Scooter (Twin-turbine catamaran scooter)
  D_Scooter: `
  <svg viewBox="0 0 200 130" class="scooter-svg scooter-d" xmlns="http://www.w3.org/2000/svg">
    <!-- Top Turbine Pod -->
    <rect x="36" y="32" width="124" height="24" rx="8" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
    <ellipse cx="158" cy="44" rx="4" ry="10" fill="#60a5fa"/>
    <rect x="26" y="35" width="12" height="18" rx="3" fill="#1e293b"/>
    <line x1="22" y1="44" x2="28" y2="44" stroke="#38bdf8" stroke-width="2"/>

    <!-- Bottom Turbine Pod -->
    <rect x="36" y="74" width="124" height="24" rx="8" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
    <ellipse cx="158" cy="86" rx="4" ry="10" fill="#60a5fa"/>
    <rect x="26" y="77" width="12" height="18" rx="3" fill="#1e293b"/>
    <line x1="22" y1="86" x2="28" y2="86" stroke="#38bdf8" stroke-width="2"/>

    <!-- Central Chassis Bridge -->
    <rect x="68" y="52" width="60" height="26" rx="5" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
    <!-- Double Drive Badge -->
    <text x="98" y="68" text-anchor="middle" font-size="8" font-weight="900" fill="#60a5fa">2× DRIVE</text>

    <!-- Dual Steering Column -->
    <path d="M88 32 L88 18 L108 18 L108 32" fill="none" stroke="#64748b" stroke-width="3.5" stroke-linecap="round"/>
    <rect x="83" y="14" width="9" height="7" rx="1.5" fill="#3b82f6"/>
    <rect x="104" y="14" width="9" height="7" rx="1.5" fill="#3b82f6"/>

    <!-- High-Voltage Energy Arcs between Turbines -->
    <path d="M136 54 L142 65 L138 65 L144 76" stroke="#facc15" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M58 54 L64 65 L60 65 L66 76" stroke="#facc15" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>
  `,

  // Sea E: Quad Bike Scooter (Heavy duty 4-propeller underwater quad)
  E_Scooter: `
  <svg viewBox="0 0 200 130" class="scooter-svg scooter-e" xmlns="http://www.w3.org/2000/svg">
    <!-- 4 Thruster Pods (Corners) -->
    <rect x="28" y="24" width="22" height="18" rx="4" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
    <rect x="28" y="88" width="22" height="18" rx="4" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
    <rect x="136" y="24" width="22" height="18" rx="4" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>
    <rect x="136" y="88" width="22" height="18" rx="4" fill="#991b1b" stroke="#7f1d1d" stroke-width="2"/>

    <!-- Roll Cage Tube Frame -->
    <path d="M38 34 L146 34 L154 65 L146 96 L38 96 L30 65 Z" fill="#18181b" stroke="#ef4444" stroke-width="2.5"/>

    <!-- Central Cockpit Block -->
    <rect x="52" y="44" width="82" height="42" rx="8" fill="#dc2626" stroke="#b91c1c" stroke-width="2"/>
    <!-- Quad Core Generator -->
    <circle cx="93" cy="65" r="14" fill="#18181b" stroke="#facc15" stroke-width="2"/>
    <polygon points="93,55 98,63 94,63 97,73 89,66 93,66" fill="#facc15"/>

    <!-- Handlebars with Armored Guards -->
    <path d="M78 44 L78 26 L108 26 L108 44" fill="none" stroke="#52525b" stroke-width="4" stroke-linecap="round"/>
    <rect x="72" y="22" width="10" height="8" rx="2" fill="#ef4444"/>
    <rect x="104" y="22" width="10" height="8" rx="2" fill="#ef4444"/>

    <!-- Dual Heavy Searchlights -->
    <circle cx="164" cy="54" r="6" fill="#fef08a" stroke="#eab308" stroke-width="1.5"/>
    <circle cx="164" cy="76" r="6" fill="#fef08a" stroke="#eab308" stroke-width="1.5"/>
  </svg>
  `,

  // Sea F: Seven Speed Scooter (Hydrofoil with gear array)
  F_Scooter: `
  <svg viewBox="0 0 200 130" class="scooter-svg scooter-f" xmlns="http://www.w3.org/2000/svg">
    <!-- Swept Hydrofoil Wings -->
    <path d="M52 56 L12 28 C32 46, 52 52, 68 56 Z" fill="#7e22ce" stroke="#581c87" stroke-width="1.5"/>
    <path d="M52 74 L12 102 C32 84, 52 78, 68 74 Z" fill="#7e22ce" stroke="#581c87" stroke-width="1.5"/>

    <!-- Main Hydrofoil Hull (Purple & Gold) -->
    <path d="M46 50 L145 52 C178 56, 186 65, 186 65 C186 65, 178 74, 145 78 L46 80 Z" 
          fill="#9333ea" stroke="#6b21a8" stroke-width="2.5"/>
    <path d="M52 58 L142 60 C165 62, 174 65, 174 65 C165 68, 142 70, 52 72 Z" fill="#c084fc"/>

    <!-- Gold Gear Transmission Casing -->
    <rect x="68" y="56" width="56" height="18" rx="4" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
    <circle cx="78" cy="65" r="5" fill="#fef3c7" stroke="#b45309" stroke-width="1"/>
    <circle cx="92" cy="65" r="6.5" fill="#fef3c7" stroke="#b45309" stroke-width="1"/>
    <circle cx="108" cy="65" r="8" fill="#fef3c7" stroke="#b45309" stroke-width="1"/>
    <!-- Gear Teeth -->
    <line x1="78" y1="58" x2="78" y2="72" stroke="#b45309" stroke-width="1.5"/>
    <line x1="92" y1="56" x2="92" y2="74" stroke="#b45309" stroke-width="1.5"/>
    <line x1="108" y1="55" x2="108" y2="75" stroke="#b45309" stroke-width="1.5"/>

    <!-- Sleek Handlebars -->
    <path d="M88 50 L88 32 L116 32 L116 50" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
    <rect x="84" y="28" width="9" height="7" rx="1.5" fill="#f59e0b"/>
    <rect x="111" y="28" width="9" height="7" rx="1.5" fill="#f59e0b"/>

    <!-- Sonar / Treasure Detector Array (Front) -->
    <ellipse cx="180" cy="65" rx="5" ry="8" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
    <path d="M185 58 C192 61, 192 69, 185 72" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
    <path d="M190 54 C200 59, 200 71, 190 76" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
  </svg>
  `,

  // Sea G: Treasure Hunter (Deep sea submersible explorer with claw & spotlights)
  G_Scooter: `
  <svg viewBox="0 0 200 130" class="scooter-svg scooter-g" xmlns="http://www.w3.org/2000/svg">
    <!-- Submarine Explorer Hull (Bronze & Dark Navy) -->
    <ellipse cx="95" cy="66" rx="60" ry="28" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <ellipse cx="95" cy="66" rx="55" ry="24" fill="#334155"/>

    <!-- Gold Brass Accents -->
    <rect x="58" y="52" width="76" height="6" fill="#f59e0b"/>
    <rect x="58" y="74" width="76" height="6" fill="#f59e0b"/>

    <!-- Big Observation Dome / Porthole -->
    <circle cx="120" cy="66" r="16" fill="#38bdf8" stroke="#f59e0b" stroke-width="3"/>
    <circle cx="118" cy="64" r="13" fill="#0284c7"/>
    <ellipse cx="114" cy="60" rx="4" ry="7" fill="#ffffff" opacity="0.6"/>

    <!-- Dual Propeller Thrusters (Rear) -->
    <rect x="28" y="48" width="12" height="14" rx="2" fill="#d97706"/>
    <rect x="28" y="70" width="12" height="14" rx="2" fill="#d97706"/>
    <ellipse cx="26" cy="55" rx="2.5" ry="8" fill="#92400e"/>
    <ellipse cx="26" cy="77" rx="2.5" ry="8" fill="#92400e"/>

    <!-- Robotic Treasure Grabber Claw (Front Bottom) -->
    <path d="M145 78 L168 88 L182 85" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
    <path d="M182 80 L194 82 L188 88" fill="none" stroke="#d97706" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M182 90 L194 88 L188 84" fill="none" stroke="#d97706" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Grabbed Gem -->
    <polygon points="192,85 196,82 199,85 196,88" fill="#a855f7" stroke="#7e22ce" stroke-width="1"/>

    <!-- Deep Sea Spotlight Beam (Front Top) -->
    <path d="M148 52 L164 48" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>
    <circle cx="166" cy="47" r="5" fill="#fde047" stroke="#ca8a04" stroke-width="1.5"/>
    <polygon points="171,47 200,32 200,62" fill="#fef08a" opacity="0.35"/>

    <!-- Steering Conning Tower -->
    <rect x="80" y="28" width="30" height="12" rx="3" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
    <circle cx="95" cy="34" r="3" fill="#38bdf8"/>
  </svg>
  `
};

/**
 * Returns SVG artwork for a scooter, falling back to a themed default.
 */
export function scooterArtFor(scooter) {
  if (scooter?.id && SCOOTER_ART[scooter.id]) {
    return SCOOTER_ART[scooter.id];
  }
  // Generic fallback scooter
  let hash = 0;
  for (const ch of scooter?.name || '') hash = (hash * 31 + ch.charCodeAt(0)) % 360;
  return `
  <svg viewBox="0 0 200 130" class="scooter-svg" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="100" cy="65" rx="56" ry="24" fill="hsl(${hash},70%,50%)" stroke="hsl(${hash},60%,30%)" stroke-width="3"/>
    <rect x="36" y="53" width="14" height="24" rx="3" fill="#334155"/>
    <ellipse cx="36" cy="65" rx="3" ry="10" fill="#64748b"/>
    <rect x="85" y="32" width="28" height="12" rx="3" fill="#1e293b"/>
    <circle cx="152" cy="65" r="7" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
    <text x="100" y="70" text-anchor="middle" font-size="10" font-weight="800" fill="#ffffff">${scooter?.name || 'Scooter'}</text>
  </svg>
  `;
}

