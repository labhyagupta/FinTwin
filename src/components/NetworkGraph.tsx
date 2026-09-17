import React, { useMemo, useState } from 'react';
import { Borrower, Connection } from '../types';
import { BorrowerSimulationResult, getStressColor } from '../utils/simulation';
import { useTheme } from '../context/ThemeContext';

interface NetworkGraphProps {
  borrowers: Borrower[];
  connections: Connection[];
  simulationResults: Record<string, BorrowerSimulationResult>;
  currentTimestep: string;
  selectedBorrowerId: string | null;
  onSelectBorrower: (id: string | null) => void;
  shockBorrowerId: string;
  isSimulating: boolean;
  pulseTriggerKey: number;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  borrowers,
  connections,
  simulationResults,
  currentTimestep,
  selectedBorrowerId,
  onSelectBorrower,
  shockBorrowerId,
  isSimulating,
  pulseTriggerKey
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredConnId, setHoveredConnId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'orb_web' | 'tension'>('orb_web');
  const [isPlucked, setIsPlucked] = useState(false);
  const [weaveKey, setWeaveKey] = useState(0);

  // Central hub coordinate
  const CENTER_X = 460;
  const CENTER_Y = 280;

  // Geometry: 12 spokes, 4 concentric rings (clean, uncluttered)
  const SPOKE_COUNT = 12;
  const WEB_RINGS = [80, 160, 240, 310];

  const handlePluckStrand = () => {
    setIsPlucked(true);
    setTimeout(() => setIsPlucked(false), 600);
  };

  const handleReplayWeave = () => {
    setWeaveKey((k) => k + 1);
  };

  // Spokes radiating from center
  const radialSpokes = useMemo(() => {
    const spokes: { x1: number; y1: number; x2: number; y2: number; angle: number; id: string }[] = [];
    const maxRadius = 330;
    for (let i = 0; i < SPOKE_COUNT; i++) {
      const angle = (i * 2 * Math.PI) / SPOKE_COUNT;
      spokes.push({
        x1: CENTER_X,
        y1: CENTER_Y,
        x2: CENTER_X + Math.cos(angle) * maxRadius,
        y2: CENTER_Y + Math.sin(angle) * maxRadius,
        angle,
        id: `spoke-${i}`
      });
    }
    return spokes;
  }, [CENTER_X, CENTER_Y]);

  // Concentric polygon web rings with subtle sag
  const webSpiralRings = useMemo(() => {
    return WEB_RINGS.map((radius, rIdx) => {
      let path = '';
      for (let i = 0; i <= SPOKE_COUNT; i++) {
        const idx = i % SPOKE_COUNT;
        const angle1 = (idx * 2 * Math.PI) / SPOKE_COUNT;
        const nextIdx = (idx + 1) % SPOKE_COUNT;
        const angle2 = (nextIdx * 2 * Math.PI) / SPOKE_COUNT;

        const x1 = CENTER_X + Math.cos(angle1) * radius;
        const y1 = CENTER_Y + Math.sin(angle1) * radius;
        const x2 = CENTER_X + Math.cos(angle2) * radius;
        const y2 = CENTER_Y + Math.sin(angle2) * radius;

        const midAngle = (angle1 + angle2) / 2;
        const sag = radius * 0.94;
        const ctrlX = CENTER_X + Math.cos(midAngle) * sag;
        const ctrlY = CENTER_Y + Math.sin(midAngle) * sag;

        if (i === 0) {
          path += `M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`;
        } else {
          path += ` Q ${ctrlX} ${ctrlY} ${x2} ${y2}`;
        }
      }
      return { radius, path, id: `ring-${rIdx}` };
    });
  }, [CENTER_X, CENTER_Y]);

  // Subtle web tension cross-filament
  const getSilkPath = (conn: Connection) => {
    const s = borrowers.find((b) => b.id === conn.source);
    const t = borrowers.find((b) => b.id === conn.target);
    if (!s || !t) return '';
    const midX = (s.x + t.x) / 2 + conn.curveOffset.x;
    const midY = (s.y + t.y) / 2 + conn.curveOffset.y;
    return `M ${s.x} ${s.y} Q ${midX} ${midY} ${t.x} ${t.y}`;
  };

  // Color tokens tuned for both light and dark modes
  const webSpokeColor = isDark ? 'rgba(140, 180, 145, 0.22)' : 'rgba(120, 160, 125, 0.25)';
  const webRingColor = isDark ? 'rgba(165, 200, 158, 0.3)' : 'rgba(110, 150, 115, 0.3)';
  const cardBg = isDark ? '#1D2A1F' : '#FFFFFF';
  const textTitle = isDark ? '#EEF4EB' : '#1F2D20';

  return (
    <div
      className={`relative w-full h-[540px] md:h-[600px] rounded-3xl overflow-hidden border select-none shadow-sm transition-all duration-300
        bg-[#F7FAF4] dark:bg-[#162218]
        border-[#E3E9DA] dark:border-[#2F4433]
        ${isPlucked ? 'animate-[webPluck_0.5s_ease-in-out]' : ''}`}
    >
      {/* Soft Ambient Radial Background (Light pastel yellow center fading to sage) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(254,240,138,0.22)_0%,rgba(217,235,212,0.3)_40%,transparent_75%)] pointer-events-none" />

      {/* Title Watermark */}
      <div className="absolute bottom-3 left-4 text-xs font-serif text-[#586B5A] dark:text-[#A7D1A2] pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#86B581] dark:bg-[#FEF08A]" />
        <span>COMMUNITY WEB &middot; 7 Members Linked by Shared Guarantees</span>
      </div>

      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setViewMode((prev) => (prev === 'orb_web' ? 'tension' : 'orb_web'))}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer shadow-xs ${
            viewMode === 'tension'
              ? 'bg-[#FEF08A] text-[#1F2D20] border-[#FACC15] font-semibold'
              : 'bg-white dark:bg-[#1D2A1F] text-[#586B5A] dark:text-[#EEF4EB] border-[#E3E9DA] dark:border-[#2F4433] hover:border-[#86B581]'
          }`}
          title="Toggle between standard web view and tension map"
        >
          {viewMode === 'tension' ? 'Tension View On' : 'View Link Tension'}
        </button>

        <button
          onClick={handlePluckStrand}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-[#1D2A1F] text-[#1F2D20] dark:text-[#EEF4EB] border border-[#E3E9DA] dark:border-[#2F4433] hover:border-[#FACC15] dark:hover:border-[#FEF08A] shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          title="Vibrate web strand"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
          <span>Vibrate Web</span>
        </button>

        <button
          onClick={handleReplayWeave}
          className="px-3 py-1.5 rounded-full text-xs font-medium text-[#586B5A] dark:text-[#B2C4B0] bg-white dark:bg-[#1D2A1F] hover:bg-[#F4F7EE] dark:hover:bg-[#243527] border border-[#E3E9DA] dark:border-[#2F4433] transition-colors cursor-pointer shadow-xs"
          title="Reset animation"
        >
          Re-center
        </button>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 920 560"
        className="w-full h-full relative z-10"
        key={weaveKey}
      >
        <defs>
          {/* Subtle line glow */}
          <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- BACKGROUND SPIDERWEB MESH --- */}
        <g className="web-mesh-layer">
          {/* Concentric rings */}
          {webSpiralRings.map((ring) => (
            <path
              key={ring.id}
              d={ring.path}
              fill="none"
              stroke={webRingColor}
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
          ))}

          {/* Radial Spokes */}
          {radialSpokes.map((spoke) => (
            <line
              key={spoke.id}
              x1={spoke.x1}
              y1={spoke.y1}
              x2={spoke.x2}
              y2={spoke.y2}
              stroke={webSpokeColor}
              strokeWidth="1"
            />
          ))}

          {/* Central Community Hearth / Circle Center */}
          <g transform={`translate(${CENTER_X}, ${CENTER_Y})`}>
            <circle cx="0" cy="0" r="28" fill={isDark ? '#1D2A1F' : '#FFFFFF'} stroke="#86B581" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
            <circle cx="0" cy="0" r="4" fill="#65A30D" />
            <text
              x="0"
              y="18"
              textAnchor="middle"
              fill={isDark ? '#A7D1A2' : '#586B5A'}
              fontSize="9"
              fontWeight="600"
              className="tracking-wider select-none"
            >
              CIRCLE CORE
            </text>
          </g>
        </g>

        {/* --- CONNECTIONS LAYER: LINKS BETWEEN MEMBERS --- */}
        <g className="connections-layer">
          {connections.map((conn) => {
            const pathData = getSilkPath(conn);
            const s = borrowers.find((b) => b.id === conn.source);
            const t = borrowers.find((b) => b.id === conn.target);
            if (!s || !t) return null;

            const isDimmed =
              selectedBorrowerId !== null &&
              selectedBorrowerId !== conn.source &&
              selectedBorrowerId !== conn.target;

            const isHighlighted =
              selectedBorrowerId === conn.source || selectedBorrowerId === conn.target;

            const isShockSource =
              (conn.source === shockBorrowerId || conn.target === shockBorrowerId) &&
              (isSimulating || currentTimestep !== '0');

            const isGuarantee = conn.type === 'mutual_guarantee';
            const strokeWidth = Math.max(2, conn.strength * 4.5);

            // Calm, soft colors
            const strokeColor = isShockSource
              ? '#EF4444' // Soft red
              : viewMode === 'tension'
              ? conn.strength > 0.65
                ? '#F59E0B'
                : '#10B981'
              : isGuarantee
              ? '#D97706' // Warm amber for guarantee
              : '#059669'; // Emerald for supply link

            return (
              <g
                key={conn.id}
                className={`transition-opacity duration-300 cursor-pointer ${
                  isDimmed ? 'opacity-20' : isHighlighted ? 'opacity-100' : 'opacity-80'
                }`}
                onMouseEnter={() => setHoveredConnId(conn.id)}
                onMouseLeave={() => setHoveredConnId(null)}
                onClick={handlePluckStrand}
              >
                {/* Wider invisible stroke for easier hover/click target */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="16"
                />

                {/* Primary connection strand */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isHighlighted ? strokeWidth + 1.5 : strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={isGuarantee ? 'none' : '4 3'}
                  opacity={isHighlighted ? 1 : 0.85}
                />

                {/* Single subtle traveling pulse if active shock */}
                {(isSimulating || (isShockSource && currentTimestep !== '0')) && (
                  <circle r={4.5} fill="#EF4444">
                    <animateMotion
                      key={`${conn.id}-${pulseTriggerKey}-${currentTimestep}`}
                      path={pathData}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Hover Details Tooltip */}
                {hoveredConnId === conn.id && (
                  <g transform={`translate(${(s.x + t.x) / 2 + conn.curveOffset.x}, ${(s.y + t.y) / 2 + conn.curveOffset.y})`}>
                    <rect
                      x="-80"
                      y="-24"
                      width="160"
                      height="28"
                      rx="8"
                      fill={cardBg}
                      stroke={strokeColor}
                      strokeWidth="1"
                      filter="drop-shadow(0 2px 8px rgba(0,0,0,0.12))"
                    />
                    <text
                      x="0"
                      y="-8"
                      textAnchor="middle"
                      fill={textTitle}
                      fontSize="10"
                      fontWeight="600"
                    >
                      {conn.label}
                    </text>
                    <text
                      x="0"
                      y="5"
                      textAnchor="middle"
                      fill={isDark ? '#B2C4B0' : '#586B5A'}
                      fontSize="9"
                    >
                      {isGuarantee ? 'Mutual Guarantee' : 'Supply Trade'} &middot; {Math.round(conn.strength * 100)}% Link
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* --- NODES LAYER: 7 COMMUNITY MEMBERS --- */}
        <g className="borrowers-layer">
          {borrowers.map((borrower) => {
            const simResult = simulationResults[borrower.id];
            const currentStress = simResult
              ? simResult.stressScores[currentTimestep as keyof typeof simResult.stressScores]
              : borrower.baseStress;
            const nodeColor = getStressColor(currentStress);

            const isSelected = selectedBorrowerId === borrower.id;
            const isHovered = hoveredNodeId === borrower.id;
            const isTarget = borrower.id === shockBorrowerId;
            const isDimmed = selectedBorrowerId !== null && !isSelected;

            return (
              <g
                key={borrower.id}
                transform={`translate(${borrower.x}, ${borrower.y})`}
                className={`cursor-pointer transition-all duration-300 ${
                  isDimmed ? 'opacity-30' : 'opacity-100'
                }`}
                onClick={() => {
                  onSelectBorrower(isSelected ? null : borrower.id);
                  handlePluckStrand();
                }}
                onMouseEnter={() => setHoveredNodeId(borrower.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                tabIndex={0}
                role="button"
                aria-label={`Select borrower ${borrower.name}`}
              >
                {/* Soft outer aura on hover or selection */}
                {(isSelected || isHovered) && (
                  <circle
                    r={borrower.radius + 8}
                    fill={nodeColor}
                    fillOpacity="0.15"
                    stroke={isSelected ? '#F59E0B' : 'transparent'}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Shock epicenter alert ring */}
                {isTarget && (
                  <circle
                    r={borrower.radius + 12}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="animate-spin"
                    style={{ animationDuration: '9s' }}
                  />
                )}

                {/* Main Member Node Circle */}
                <circle
                  r={borrower.radius}
                  fill={isDark ? '#1D2A1F' : '#FFFFFF'}
                  stroke={isSelected ? '#D97706' : nodeColor}
                  strokeWidth={isSelected ? 3.5 : 2.5}
                  filter="drop-shadow(0 2px 5px rgba(0,0,0,0.08))"
                />

                {/* Numerals for stress level */}
                <text
                  x="0"
                  y="1"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-serif font-bold select-none"
                  fill={isDark ? '#EEF4EB' : '#1F2D20'}
                  fontSize={borrower.radius > 32 ? '16' : '13'}
                >
                  {Math.round(currentStress)}
                </text>

                {/* Member Name Label Pill */}
                <g transform={`translate(0, ${borrower.radius + 16})`}>
                  <rect
                    x="-60"
                    y="-10"
                    width="120"
                    height="20"
                    rx="10"
                    fill={isDark ? '#243527' : '#FFFFFF'}
                    stroke={isSelected ? '#D97706' : isDark ? '#2F4433' : '#E3E9DA'}
                    strokeWidth={isSelected ? '1.5' : '1'}
                    filter="drop-shadow(0 1px 3px rgba(0,0,0,0.06))"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill={isDark ? '#EEF4EB' : '#1F2D20'}
                    fontSize="11"
                    fontWeight="600"
                    className="select-none"
                  >
                    {borrower.name.split(' ')[0]}
                  </text>
                </g>

                {/* Sector & Buffer info underneath */}
                <text
                  x="0"
                  y={borrower.radius + 33}
                  textAnchor="middle"
                  fill={isDark ? '#B2C4B0' : '#586B5A'}
                  fontSize="9.5"
                  className="select-none font-medium"
                >
                  ${borrower.loanAmount} loan &middot; {borrower.cashBufferMonths}mo cash
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Simplified, Calm Legend at Top Left */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-3 text-xs bg-white/90 dark:bg-[#1D2A1F]/90 backdrop-blur-xs px-3.5 py-2 rounded-full border border-[#E3E9DA] dark:border-[#2F4433] shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[#1F2D20] dark:text-[#EEF4EB] font-medium">Calm (&lt;38)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-[#1F2D20] dark:text-[#EEF4EB] font-medium">Watch (38-68)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-[#1F2D20] dark:text-[#EEF4EB] font-medium">Care (&gt;68)</span>
        </div>
        <div className="w-px h-3 bg-[#E3E9DA] dark:bg-[#2F4433] mx-0.5" />
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-[#FEF08A]">
          <span className="w-3 h-1 bg-amber-500 rounded-full" />
          <span className="font-medium">Mutual Guarantee</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <span className="w-3 h-1 bg-emerald-500 rounded-full" />
          <span className="font-medium">Trade Supply</span>
        </div>
      </div>

      {/* Selected borrower banner */}
      {selectedBorrowerId && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-white/95 dark:bg-[#1D2A1F]/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#E3E9DA] dark:border-[#2F4433] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-xs font-medium text-[#1F2D20] dark:text-[#EEF4EB]">Member selected</span>
          <button
            onClick={() => onSelectBorrower(null)}
            className="px-2 py-0.5 rounded-full bg-[#F4F7EE] dark:bg-[#243527] text-xs font-semibold text-[#1F2D20] dark:text-[#EEF4EB] hover:bg-[#E3E9DA] transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};
