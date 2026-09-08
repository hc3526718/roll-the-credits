'use client';

import { OfficeTier } from '@/lib/types-gdt';

interface IsometricOfficeProps {
  tier: OfficeTier;
  projectCount: number;
  staffCount: number;
  onClickDesk?: () => void;
  onClickResearch?: () => void;
  onClickHire?: () => void;
}

export default function IsometricOffice({
  tier,
  projectCount,
  staffCount,
  onClickDesk,
  onClickResearch,
  onClickHire
}: IsometricOfficeProps) {
  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden">
      {/* Isometric Grid Base */}
      <svg viewBox="0 0 800 400" className="w-full h-full">
        <defs>
          {/* Patterns for textures */}
          <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="#4a3728"/>
            <line x1="0" y1="0" x2="4" y2="4" stroke="#3a2718" strokeWidth="0.5"/>
          </pattern>
          <pattern id="carpet" patternUnits="userSpaceOnUse" width="8" height="8">
            <rect width="8" height="8" fill="#2d3748"/>
            <circle cx="2" cy="2" r="0.5" fill="#1a202c"/>
            <circle cx="6" cy="6" r="0.5" fill="#1a202c"/>
          </pattern>
        </defs>
        
        {tier === 'garage' && <GarageOffice onClickDesk={onClickDesk} />}
        {tier === 'first-studio' && <FirstStudioOffice onClickDesk={onClickDesk} staffCount={staffCount} />}
        {tier === 'upgraded-studio' && <UpgradedStudioOffice onClickDesk={onClickDesk} staffCount={staffCount} />}
        {tier === 'large-lot' && <LargeLotOffice onClickDesk={onClickDesk} onClickResearch={onClickResearch} staffCount={staffCount} />}
        {tier === 'late-game' && <LateGameOffice onClickDesk={onClickDesk} staffCount={staffCount} />}
      </svg>
      
      {/* Hover hints */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-xs text-slate-400">
        Click desks to start projects • Click staff to hire
      </div>
    </div>
  );
}

// Garage Office (Tier 1)
function GarageOffice({ onClickDesk }: { onClickDesk?: () => void }) {
  return (
    <g>
      {/* Floor */}
      <polygon
        points="100,300 400,150 700,300 400,450"
        fill="url(#carpet)"
        stroke="#1a202c"
        strokeWidth="2"
      />
      
      {/* Back Wall */}
      <polygon
        points="400,150 700,300 700,100 400,50"
        fill="#374151"
        stroke="#1f2937"
        strokeWidth="2"
      />
      
      {/* Left Wall */}
      <polygon
        points="100,300 400,150 400,50 100,100"
        fill="#475569"
        stroke="#334155"
        strokeWidth="2"
      />
      
      {/* Garage Door */}
      <g>
        <rect x="450" y="120" width="200" height="180" fill="#52525b" stroke="#3f3f46" strokeWidth="2"/>
        <line x1="450" y1="160" x2="650" y2="160" stroke="#3f3f46" strokeWidth="1"/>
        <line x1="450" y1="200" x2="650" y2="200" stroke="#3f3f46" strokeWidth="1"/>
        <line x1="450" y1="240" x2="650" y2="240" stroke="#3f3f46" strokeWidth="1"/>
      </g>
      
      {/* Desk (clickable) */}
      <g
        onClick={onClickDesk}
        className="cursor-pointer hover:opacity-80 transition-opacity"
        style={{ cursor: 'pointer' }}
      >
        {/* Desk top */}
        <polygon
          points="250,280 350,230 450,280 350,330"
          fill="url(#woodGrain)"
          stroke="#2d2416"
          strokeWidth="2"
        />
        {/* Desk side */}
        <polygon
          points="350,230 450,280 450,320 350,270"
          fill="#3a2718"
          stroke="#2d2416"
          strokeWidth="1"
        />
        {/* Computer monitor */}
        <rect x="340" y="200" width="40" height="30" fill="#1e293b" stroke="#0f172a" strokeWidth="1"/>
        <rect x="345" y="205" width="30" height="20" fill="#3b82f6"/>
      </g>
      
      {/* Founder character (simple sprite) */}
      <g transform="translate(300, 320)">
        <ellipse cx="0" cy="15" rx="15" ry="5" fill="rgba(0,0,0,0.3)"/> {/* Shadow */}
        <circle cx="0" cy="0" r="8" fill="#fbbf24"/> {/* Head */}
        <rect x="-6" y="5" width="12" height="15" fill="#3b82f6" stroke="#1e40af" strokeWidth="1"/> {/* Body */}
        <line x1="-6" y1="10" x2="-12" y2="15" stroke="#3b82f6" strokeWidth="2"/> {/* Arm */}
        <line x1="6" y1="10" x2="12" y2="15" stroke="#3b82f6" strokeWidth="2"/> {/* Arm */}
      </g>
      
      {/* Text label */}
      <text x="400" y="40" textAnchor="middle" fill="#9ca3af" fontSize="14" fontWeight="bold">
        GARAGE
      </text>
    </g>
  );
}

// First Studio (Tier 2)
function FirstStudioOffice({ onClickDesk, staffCount }: { onClickDesk?: () => void; staffCount: number }) {
  return (
    <g>
      {/* Floor */}
      <polygon
        points="100,320 400,170 700,320 400,470"
        fill="#334155"
        stroke="#1e293b"
        strokeWidth="2"
      />
      
      {/* Walls */}
      <polygon points="400,170 700,320 700,120 400,70" fill="#475569" stroke="#334155" strokeWidth="2"/>
      <polygon points="100,320 400,170 400,70 100,120" fill="#64748b" stroke="#475569" strokeWidth="2"/>
      
      {/* Window */}
      <rect x="150" y="140" width="80" height="60" fill="#7dd3fc" opacity="0.6" stroke="#0ea5e9" strokeWidth="2"/>
      
      {/* Multiple desks */}
      <g onClick={onClickDesk} className="cursor-pointer hover:opacity-80" style={{ cursor: 'pointer' }}>
        {/* Desk 1 */}
        <polygon points="200,260 280,220 360,260 280,300" fill="url(#woodGrain)" stroke="#2d2416" strokeWidth="2"/>
        <rect x="270" y="195" width="25" height="20" fill="#1e293b"/>
        <rect x="273" y="198" width="19" height="14" fill="#3b82f6"/>
      </g>
      
      {/* Staff sprites */}
      {[...Array(Math.min(staffCount, 3))].map((_, i) => (
        <g key={i} transform={`translate(${250 + i * 80}, ${300 + i * 20})`}>
          <ellipse cx="0" cy="15" rx="12" ry="4" fill="rgba(0,0,0,0.3)"/>
          <circle cx="0" cy="0" r="6" fill="#fbbf24"/>
          <rect x="-5" y="4" width="10" height="12" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="1"/>
        </g>
      ))}
      
      <text x="400" y="60" textAnchor="middle" fill="#9ca3af" fontSize="14" fontWeight="bold">
        FIRST STUDIO
      </text>
    </g>
  );
}

// Upgraded Studio (Tier 3)
function UpgradedStudioOffice({ onClickDesk, staffCount }: { onClickDesk?: () => void; staffCount: number }) {
  return (
    <g>
      <polygon points="80,340 400,180 720,340 400,500" fill="#1e293b" stroke="#0f172a" strokeWidth="2"/>
      <polygon points="400,180 720,340 720,140 400,80" fill="#334155" stroke="#1e293b" strokeWidth="2"/>
      <polygon points="80,340 400,180 400,80 80,140" fill="#475569" stroke="#334155" strokeWidth="2"/>
      
      {/* Large windows */}
      <rect x="450" y="120" width="220" height="120" fill="#7dd3fc" opacity="0.5" stroke="#0ea5e9" strokeWidth="2"/>
      <line x1="560" y1="120" x2="560" y2="240" stroke="#0ea5e9" strokeWidth="2"/>
      
      {/* Multiple work areas */}
      <g onClick={onClickDesk} className="cursor-pointer hover:opacity-80" style={{ cursor: 'pointer' }}>
        {[0, 1].map(i => (
          <g key={i} transform={`translate(${i * 150}, ${i * 40})`}>
            <polygon points="180,280 260,240 340,280 260,320" fill="url(#woodGrain)" stroke="#2d2416" strokeWidth="2"/>
            <rect x="250" y="215" width="25" height="20" fill="#1e293b"/>
          </g>
        ))}
      </g>
      
      {/* Staff (more) */}
      {[...Array(Math.min(staffCount, 5))].map((_, i) => (
        <g key={i} transform={`translate(${200 + (i % 3) * 70}, ${320 + Math.floor(i / 3) * 40})`}>
          <ellipse cx="0" cy="12" rx="10" ry="3" fill="rgba(0,0,0,0.3)"/>
          <circle cx="0" cy="0" r="5" fill="#fbbf24"/>
          <rect x="-4" y="3" width="8" height="10" fill="#10b981"/>
        </g>
      ))}
      
      <text x="400" y="70" textAnchor="middle" fill="#9ca3af" fontSize="14" fontWeight="bold">
        UPGRADED STUDIO
      </text>
    </g>
  );
}

// Large Lot (Tier 4 - with Creative Lab)
function LargeLotOffice({ onClickDesk, onClickResearch, staffCount }: { onClickDesk?: () => void; onClickResearch?: () => void; staffCount: number }) {
  return (
    <g>
      <polygon points="60,360 400,190 740,360 400,530" fill="#0f172a" stroke="#020617" strokeWidth="3"/>
      <polygon points="400,190 740,360 740,160 400,90" fill="#1e293b" stroke="#0f172a" strokeWidth="2"/>
      <polygon points="60,360 400,190 400,90 60,160" fill="#334155" stroke="#1e293b" strokeWidth="2"/>
      
      {/* Creative Lab door (special) */}
      <g
        onClick={onClickResearch}
        className="cursor-pointer hover:opacity-90"
        style={{ cursor: 'pointer' }}
      >
        <rect x="600" y="200" width="80" height="120" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2"/>
        <text x="640" y="260" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">LAB</text>
        <circle cx="665" cy="290" r="3" fill="#fbbf24"/> {/* Door handle */}
      </g>
      
      {/* Multiple zones */}
      <g onClick={onClickDesk} className="cursor-pointer hover:opacity-80" style={{ cursor: 'pointer' }}>
        {[0, 1, 2].map(i => (
          <g key={i} transform={`translate(${i * 100 + 100}, ${i * 30 + 260})`}>
            <polygon points="0,0 60,-30 120,0 60,30" fill="url(#woodGrain)" stroke="#2d2416" strokeWidth="1.5"/>
          </g>
        ))}
      </g>
      
      {/* Staff (many) */}
      {[...Array(Math.min(staffCount, 8))].map((_, i) => (
        <g key={i} transform={`translate(${150 + (i % 4) * 60}, ${340 + Math.floor(i / 4) * 35})`}>
          <ellipse cx="0" cy="10" rx="8" ry="2.5" fill="rgba(0,0,0,0.3)"/>
          <circle cx="0" cy="0" r="4" fill="#fbbf24"/>
          <rect x="-3" y="2" width="6" height="8" fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][i % 4]}/>
        </g>
      ))}
      
      <text x="400" y="80" textAnchor="middle" fill="#a855f7" fontSize="16" fontWeight="bold">
        LARGE STUDIO LOT • CREATIVE LAB
      </text>
    </g>
  );
}

// Late Game (Tier 5 - Empire)
function LateGameOffice({ onClickDesk, staffCount }: { onClickDesk?: () => void; staffCount: number }) {
  return (
    <g>
      <polygon points="50,380 400,200 750,380 400,560" fill="#020617" stroke="#000" strokeWidth="3"/>
      <polygon points="400,200 750,380 750,180 400,100" fill="#0f172a" stroke="#020617" strokeWidth="2"/>
      <polygon points="50,380 400,200 400,100 50,180" fill="#1e293b" stroke="#0f172a" strokeWidth="2"/>
      
      {/* Floor-to-ceiling windows */}
      <rect x="420" y="120" width="300" height="180" fill="#7dd3fc" opacity="0.4" stroke="#0ea5e9" strokeWidth="3"/>
      
      {/* Massive work floor */}
      <g onClick={onClickDesk} className="cursor-pointer hover:opacity-80" style={{ cursor: 'pointer' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <g key={i} transform={`translate(${i * 80 + 120}, ${i * 20 + 300})`}>
            <polygon points="0,0 50,-25 100,0 50,25" fill="url(#woodGrain)" stroke="#2d2416" strokeWidth="1"/>
          </g>
        ))}
      </g>
      
      {/* Staff (empire scale) */}
      {[...Array(Math.min(staffCount, 12))].map((_, i) => (
        <g key={i} transform={`translate(${120 + (i % 6) * 50}, ${350 + Math.floor(i / 6) * 30})`}>
          <circle cx="0" cy="0" r="3" fill="#fbbf24"/>
          <rect x="-2" y="2" width="4" height="6" fill={['#3b82f6', '#8b5cf6', '#10b981'][i % 3]}/>
        </g>
      ))}
      
      <text x="400" y="90" textAnchor="middle" fill="#fbbf24" fontSize="18" fontWeight="bold">
        ENTERTAINMENT EMPIRE
      </text>
    </g>
  );
}
