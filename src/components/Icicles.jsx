import { useMemo } from 'react';

export default function Icicles() {
  // Generate random icicle positions for a more natural look
  // useMemo ensures these values stay constant across re-renders
  const topIcicles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      left: `${i * 5}%`,
      height: `${20 + Math.random() * 30}px`,
      delay: `${Math.random() * 2}s`,
    }))
  , []);

  // Generate snow mounds with varying heights
  // useMemo ensures these values stay constant across re-renders
  const snowMounds = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      left: `${i * 3.33}%`,
      height: `${15 + Math.random() * 25}px`,
    }))
  , []);

  return (
    <>
      {/* Top Icicles - Subtle hanging icicles */}
      <div className="absolute top-0 left-0 w-full h-16 z-10 pointer-events-none overflow-hidden">
        {topIcicles.map((icicle, i) => (
          <div
            key={i}
            className="absolute top-0"
            style={{ left: icicle.left }}
          >
            <svg
              width="20"
              height={icicle.height}
              viewBox="0 0 20 50"
              className="opacity-60"
            >
              <defs>
                <linearGradient id={`icicle-gradient-top-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#d0e8ff', stopOpacity: 0.9 }} />
                  <stop offset="50%" style={{ stopColor: '#b8dcff', stopOpacity: 0.7 }} />
                  <stop offset="100%" style={{ stopColor: '#a0d0ff', stopOpacity: 0.5 }} />
                </linearGradient>
              </defs>
              <polygon
                points="10,0 0,5 5,15 10,50 15,15 20,5"
                fill={`url(#icicle-gradient-top-${i})`}
                stroke="#a0d0ff"
                strokeWidth="0.5"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Bottom - Snowy Ground */}
      <div className="absolute bottom-0 left-0 w-full h-24 z-10 pointer-events-none">
        {/* Snow layer with gradient */}
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white/95 via-blue-50/90 to-transparent">
          {/* Snow mounds for texture */}
          <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="snow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f0f8ff', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              d={`M 0 ${96 - 20} ${snowMounds.map((mound, i) => {
                const x = parseFloat(mound.left);
                const y = 96 - parseFloat(mound.height);
                return `Q ${x} ${y} ${x + 1.665} ${96 - 15}`;
              }).join(' ')} L 100 96 L 0 96 Z`}
              fill="url(#snow-gradient)"
              className="drop-shadow-lg"
            />
          </svg>

          {/* Sparkles on snow */}
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: `${10 + Math.random() * 30}px`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
