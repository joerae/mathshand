/**
 * Placeholder Vector Graphics (SVGs) for Sea Creatures in Maths Handbuilder
 */

export const FISH_ART = {
  1: `
  <svg viewBox="0 0 160 120" class="fish-svg chainsaw-clownfish" xmlns="http://www.w3.org/2000/svg">
    <!-- Clownfish Body (Orange) -->
    <ellipse cx="65" cy="62" rx="42" ry="28" fill="#f97316" stroke="#c2410c" stroke-width="2.5"/>
    <!-- Tail Fin -->
    <path d="M25 62 L8 44 L16 62 L8 80 Z" fill="#f97316" stroke="#c2410c" stroke-width="2.5"/>
    <path d="M14 50 L20 62 L14 74" stroke="#ffffff" stroke-width="2.5" fill="none"/>
    <!-- White Stripes with Black Outline -->
    <path d="M48 37 C52 50, 52 74, 48 87 C44 87, 42 85, 42 85 C46 73, 46 51, 42 39 Z" fill="#ffffff" stroke="#1f2937" stroke-width="1.5"/>
    <path d="M68 34 C73 50, 73 74, 68 90 C63 89, 61 88, 61 88 C66 73, 66 50, 61 36 Z" fill="#ffffff" stroke="#1f2937" stroke-width="1.5"/>
    <!-- Fins -->
    <path d="M60 34 C70 20, 85 24, 80 35 Z" fill="#ea580c" stroke="#c2410c" stroke-width="2"/>
    <path d="M62 89 C70 102, 82 98, 78 89 Z" fill="#ea580c" stroke="#c2410c" stroke-width="2"/>
    <!-- Eye & Fierce Brow -->
    <circle cx="88" cy="54" r="8" fill="#ffffff" stroke="#1f2937" stroke-width="1.5"/>
    <circle cx="90" cy="54" r="4.5" fill="#111827"/>
    <circle cx="92" cy="52" r="1.5" fill="#ffffff"/>
    <path d="M80 47 L98 51" stroke="#991b1b" stroke-width="3" stroke-linecap="round"/>
    <!-- Grin -->
    <path d="M88 68 Q95 72 102 65" stroke="#1f2937" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Chainsaw -->
    <!-- Hand holding it -->
    <ellipse cx="94" cy="74" rx="5" ry="4" fill="#fb923c" stroke="#c2410c" stroke-width="1.5"/>
    <!-- Motor Body (Red) -->
    <rect x="98" y="65" width="22" height="18" rx="3" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
    <rect x="95" y="68" width="6" height="5" rx="1.5" fill="#374151"/>
    <!-- Guide Bar (Silver) -->
    <path d="M120 70 L152 70 C156 70, 156 78, 152 78 L120 78 Z" fill="#d1d5db" stroke="#4b5563" stroke-width="1.5"/>
    <!-- Teeth -->
    <path d="M122 68 L124 70 L127 68 L129 70 L132 68 L134 70 L137 68 L139 70 L142 68 L144 70 L147 68 L149 70 L152 71" stroke="#374151" stroke-width="1.5" fill="none"/>
    <path d="M122 80 L124 78 L127 80 L129 78 L132 80 L134 78 L137 80 L139 78 L142 80 L144 78 L147 80 L149 78 L152 77" stroke="#374151" stroke-width="1.5" fill="none"/>
    <!-- Motion lines -->
    <path d="M148 62 L154 65" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
    <path d="M152 84 L157 81" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
  </svg>
  `,

  2: `
  <svg viewBox="0 0 160 120" class="fish-svg electric-eel" xmlns="http://www.w3.org/2000/svg">
    <!-- Electric Sparks in background -->
    <polygon points="20,25 28,15 26,27 34,20 25,37 28,30" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
    <polygon points="135,28 143,18 141,30 149,23 140,40 143,33" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
    <polygon points="75,95 83,85 81,97 89,90 80,107 83,100" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
    <!-- Eel Body (Winding Teal) -->
    <path d="M15 85 C35 85, 30 40, 65 42 C100 44, 90 85, 125 75 C138 72, 148 60, 142 48 C136 36, 118 38, 112 48" 
          fill="none" stroke="#0d9488" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Yellow Belly Accent -->
    <path d="M15 87 C35 87, 30 44, 65 46 C100 48, 90 87, 125 78 C135 75, 142 66, 140 56" 
          fill="none" stroke="#2dd4bf" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Eel Head (Right side) -->
    <ellipse cx="140" cy="50" rx="14" ry="11" fill="#0d9488"/>
    <!-- Angry Zappy Eye -->
    <circle cx="143" cy="46" r="5" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
    <circle cx="144" cy="46" r="2.5" fill="#111827"/>
    <!-- Zigzag Eyebrow -->
    <path d="M137 40 L143 43 L149 41" stroke="#ca8a04" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Sharp Teeth Grin -->
    <path d="M138 56 Q146 58 152 52" stroke="#134e4a" stroke-width="2" fill="none"/>
    <polygon points="144,55 146,51 148,55" fill="#ffffff"/>
    <polygon points="148,54 150,50 152,54" fill="#ffffff"/>
    <!-- Electric crackle near mouth -->
    <path d="M152 45 L158 48 L154 52 L160 55" stroke="#facc15" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>
  `,

  3: `
  <svg viewBox="0 0 160 120" class="fish-svg pufferfish" xmlns="http://www.w3.org/2000/svg">
    <!-- Spikes radiating outward -->
    <polygon points="80,12 84,24 76,24" fill="#ca8a04"/>
    <polygon points="112,18 108,30 102,26" fill="#ca8a04"/>
    <polygon points="138,40 126,46 126,38" fill="#ca8a04"/>
    <polygon points="144,70 130,70 132,62" fill="#ca8a04"/>
    <polygon points="132,96 122,88 126,82" fill="#ca8a04"/>
    <polygon points="105,112 102,98 96,102" fill="#ca8a04"/>
    <polygon points="65,114 68,100 74,102" fill="#ca8a04"/>
    <polygon points="35,100 42,88 46,94" fill="#ca8a04"/>
    <polygon points="20,74 32,70 32,78" fill="#ca8a04"/>
    <polygon points="25,44 36,48 34,40" fill="#ca8a04"/>
    <polygon points="50,20 56,32 50,34" fill="#ca8a04"/>
    <!-- Giant Round Puffed Body -->
    <circle cx="80" cy="64" r="44" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
    <!-- Light Belly -->
    <ellipse cx="80" cy="80" rx="34" ry="22" fill="#fef9c3"/>
    <!-- Tiny Tail & Fin -->
    <path d="M36 64 L18 52 L22 64 L18 76 Z" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
    <path d="M116 75 C124 72, 126 84, 118 84 Z" fill="#eab308" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Googly Derpy Eyes -->
    <circle cx="82" cy="48" r="10" fill="#ffffff" stroke="#1f2937" stroke-width="2"/>
    <circle cx="84" cy="46" r="4.5" fill="#111827"/>
    <circle cx="85.5" cy="44.5" r="1.5" fill="#ffffff"/>

    <circle cx="106" cy="50" r="9" fill="#ffffff" stroke="#1f2937" stroke-width="2"/>
    <circle cx="107" cy="52" r="4" fill="#111827"/>
    <circle cx="108.5" cy="50.5" r="1.5" fill="#ffffff"/>
    <!-- Tiny Puffed Lips -->
    <ellipse cx="114" cy="66" rx="6" ry="4" fill="#f43f5e" stroke="#be123c" stroke-width="1.5"/>
    <!-- Rosy Cheeks -->
    <ellipse cx="94" cy="65" rx="6" ry="4" fill="#fda4af" opacity="0.7"/>
  </svg>
  `,

  4: `
  <svg viewBox="0 0 160 120" class="fish-svg kraken" xmlns="http://www.w3.org/2000/svg">
    <!-- Tentacles relaxing -->
    <path d="M40 75 C30 95, 10 90, 12 75 C14 62, 32 68, 38 72" fill="#a855f7" stroke="#7e22ce" stroke-width="3"/>
    <path d="M55 85 C45 110, 25 105, 30 92" fill="none" stroke="#9333ea" stroke-width="7" stroke-linecap="round"/>
    <path d="M72 88 C70 115, 55 112, 60 98" fill="none" stroke="#a855f7" stroke-width="7" stroke-linecap="round"/>
    <path d="M92 88 C95 115, 110 112, 105 98" fill="none" stroke="#a855f7" stroke-width="7" stroke-linecap="round"/>
    <path d="M108 85 C120 110, 138 105, 132 92" fill="none" stroke="#9333ea" stroke-width="7" stroke-linecap="round"/>
    <!-- Kraken Head (Chill Dome) -->
    <path d="M44 65 C44 32, 116 32, 116 65 C116 80, 104 86, 80 86 C56 86, 44 80, 44 65 Z" 
          fill="#c084fc" stroke="#7e22ce" stroke-width="3"/>
    <!-- Suction Cups -->
    <circle cx="20" cy="84" r="2.5" fill="#f3e8ff"/>
    <circle cx="34" cy="100" r="2.5" fill="#f3e8ff"/>
    <circle cx="126" cy="100" r="2.5" fill="#f3e8ff"/>
    <!-- Cool Sunglasses -->
    <rect x="52" y="52" width="24" height="15" rx="3" fill="#18181b" stroke="#09090b" stroke-width="1.5"/>
    <rect x="84" y="52" width="24" height="15" rx="3" fill="#18181b" stroke="#09090b" stroke-width="1.5"/>
    <line x1="76" y1="58" x2="84" y2="58" stroke="#18181b" stroke-width="3"/>
    <!-- Sunglass Glare -->
    <line x1="56" y1="55" x2="68" y2="63" stroke="#52525b" stroke-width="2"/>
    <line x1="88" y1="55" x2="100" y2="63" stroke="#52525b" stroke-width="2"/>
    <!-- Relaxed Smug Grin -->
    <path d="M72 74 Q80 79 88 74" stroke="#581c87" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Tropical Drink with Umbrella in Tentacle (Right side) -->
    <path d="M125 60 L135 60 L132 75 L128 75 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>
    <!-- Drink straw -->
    <line x1="130" y1="62" x2="124" y2="50" stroke="#f43f5e" stroke-width="2"/>
    <!-- Little Umbrella -->
    <path d="M128 54 C134 44, 146 48, 144 54 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.2"/>
  </svg>
  `,

  5: `
  <svg viewBox="0 0 160 120" class="fish-svg anglerfish" xmlns="http://www.w3.org/2000/svg">
    <!-- Glowing Lure Stalk & Light Bulb -->
    <!-- Glow aura -->
    <circle cx="132" cy="22" r="16" fill="#fef08a" opacity="0.35"/>
    <circle cx="132" cy="22" r="9" fill="#fef08a" opacity="0.6"/>
    <circle cx="132" cy="22" r="5" fill="#facc15" stroke="#eab308" stroke-width="1.5"/>
    <!-- Flexible stalk from head -->
    <path d="M75 48 C75 16, 120 10, 130 20" fill="none" stroke="#0f766e" stroke-width="3" stroke-linecap="round"/>
    <!-- Deep Sea Body (Dark Teal) -->
    <ellipse cx="68" cy="68" rx="42" ry="32" fill="#115e59" stroke="#042f2e" stroke-width="3"/>
    <!-- Tail Fin -->
    <path d="M26 68 L10 52 L14 68 L10 84 Z" fill="#0f766e" stroke="#042f2e" stroke-width="2"/>
    <!-- Huge Spiky Underbite Jaw -->
    <path d="M65 82 Q90 85 106 72" stroke="#042f2e" stroke-width="3" fill="none"/>
    <!-- Needle Teeth sticking up and down -->
    <polygon points="76,82 78,73 81,82" fill="#f8fafc"/>
    <polygon points="84,81 87,70 90,81" fill="#f8fafc"/>
    <polygon points="93,79 96,68 99,78" fill="#f8fafc"/>
    <polygon points="101,75 103,66 106,73" fill="#f8fafc"/>
    <!-- Top needle teeth -->
    <polygon points="80,68 82,75 84,68" fill="#f8fafc"/>
    <polygon points="89,68 91,76 93,68" fill="#f8fafc"/>
    <polygon points="97,67 99,74 102,67" fill="#f8fafc"/>
    <!-- Large Spooky-Cute Eye -->
    <circle cx="76" cy="54" r="8.5" fill="#ffffff" stroke="#042f2e" stroke-width="2"/>
    <circle cx="78" cy="53" r="4.5" fill="#0f172a"/>
    <circle cx="80" cy="51" r="1.5" fill="#ffffff"/>
    <!-- Fin -->
    <path d="M52 72 C42 66, 42 78, 50 78 Z" fill="#0f766e" stroke="#042f2e" stroke-width="1.5"/>
  </svg>
  `,

  6: `
  <svg viewBox="0 0 160 120" class="fish-svg great-white-shark" xmlns="http://www.w3.org/2000/svg">
    <!-- Shark Torpedo Body (Ocean Slate-Grey) -->
    <path d="M22 62 C35 44, 75 36, 130 48 C144 51, 154 58, 144 68 C128 78, 80 88, 22 62 Z" 
          fill="#475569" stroke="#1e293b" stroke-width="3"/>
    <!-- White Belly -->
    <path d="M45 64 C70 66, 110 68, 142 68 C130 76, 85 85, 45 64 Z" fill="#f8fafc"/>
    <!-- Dorsal Fin (Top) -->
    <path d="M78 40 L92 12 C96 16, 102 28, 104 42 Z" fill="#334155" stroke="#1e293b" stroke-width="2.5"/>
    <!-- Pectoral Fin (Bottom) -->
    <path d="M72 72 L86 100 C92 98, 95 88, 92 74 Z" fill="#334155" stroke="#1e293b" stroke-width="2.5"/>
    <!-- Caudal / Tail Fin (Left) -->
    <path d="M24 62 L4 34 C10 48, 14 58, 8 62 C14 66, 10 76, 4 90 Z" fill="#475569" stroke="#1e293b" stroke-width="2.5"/>
    <!-- Gill Slits -->
    <line x1="98" y1="52" x2="96" y2="62" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
    <line x1="102" y1="52" x2="100" y2="62" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
    <line x1="106" y1="53" x2="104" y2="61" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
    <!-- Big Sharp-Toothed Shark Grin -->
    <path d="M112 66 Q130 76 142 65" stroke="#1e293b" stroke-width="3" fill="#991b1b"/>
    <!-- Upper teeth -->
    <polygon points="116,66 119,70 122,67" fill="#ffffff"/>
    <polygon points="122,67 125,72 128,68" fill="#ffffff"/>
    <polygon points="128,68 131,73 134,69" fill="#ffffff"/>
    <polygon points="134,69 137,72 140,66" fill="#ffffff"/>
    <!-- Eye & Brow -->
    <circle cx="125" cy="52" r="5" fill="#0f172a"/>
    <circle cx="126" cy="51" r="1.5" fill="#ffffff"/>
    <path d="M120 48 L129 50" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
  </svg>
  `
};
