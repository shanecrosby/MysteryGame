export default function GlowingCrystals() {
  // Generate crystal clusters with various colors and positions
  const crystals = [
    // Left side clusters
    { x: '10%', y: '25%', color: '#a78bfa', size: 60, rotation: -15, delay: 0 },
    { x: '15%', y: '20%', color: '#c084fc', size: 45, rotation: 20, delay: 0.5 },
    { x: '8%', y: '35%', color: '#e879f9', size: 50, rotation: -25, delay: 1 },
    { x: '12%', y: '55%', color: '#60a5fa', size: 55, rotation: 10, delay: 1.5 },
    { x: '18%', y: '65%', color: '#818cf8', size: 40, rotation: -30, delay: 0.8 },

    // Right side clusters
    { x: '88%', y: '30%', color: '#f472b6', size: 65, rotation: 15, delay: 0.3 },
    { x: '85%', y: '22%', color: '#ec4899', size: 48, rotation: -20, delay: 1.2 },
    { x: '90%', y: '45%', color: '#a78bfa', size: 52, rotation: 25, delay: 0.6 },
    { x: '82%', y: '60%', color: '#60a5fa', size: 58, rotation: -18, delay: 1.8 },
    { x: '87%', y: '70%', color: '#c084fc', size: 42, rotation: 12, delay: 0.9 },

    // Top center clusters
    { x: '45%', y: '18%', color: '#818cf8', size: 50, rotation: -10, delay: 0.4 },
    { x: '55%', y: '15%', color: '#e879f9', size: 45, rotation: 22, delay: 1.1 },

    // Bottom scattered crystals
    { x: '35%', y: '75%', color: '#f472b6', size: 38, rotation: -28, delay: 1.4 },
    { x: '65%', y: '78%', color: '#60a5fa', size: 44, rotation: 18, delay: 0.7 },
  ];

  return (
    <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
      {crystals.map((crystal, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: crystal.x,
            top: crystal.y,
            transform: `translate(-50%, -50%) rotate(${crystal.rotation}deg)`,
          }}
        >
          {/* Crystal group - multiple shards */}
          <div className="relative" style={{ width: crystal.size, height: crystal.size }}>
            {/* Main crystal shard */}
            <svg
              width={crystal.size}
              height={crystal.size}
              viewBox="0 0 60 80"
              className="absolute top-0 left-0"
              style={{
                filter: `drop-shadow(0 0 ${crystal.size * 0.3}px ${crystal.color})`,
                animation: `twinkle ${2 + (index % 3)}s ease-in-out infinite`,
                animationDelay: `${crystal.delay}s`,
              }}
            >
              <defs>
                <linearGradient id={`crystal-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: crystal.color, stopOpacity: 0.9 }} />
                  <stop offset="50%" style={{ stopColor: crystal.color, stopOpacity: 0.7 }} />
                  <stop offset="100%" style={{ stopColor: crystal.color, stopOpacity: 0.5 }} />
                </linearGradient>
                <linearGradient id={`crystal-highlight-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: crystal.color, stopOpacity: 0.3 }} />
                </linearGradient>
              </defs>

              {/* Main crystal body */}
              <polygon
                points="30,5 45,25 40,75 20,75 15,25"
                fill={`url(#crystal-gradient-${index})`}
                stroke={crystal.color}
                strokeWidth="1"
                opacity="0.85"
              />

              {/* Highlight on crystal */}
              <polygon
                points="30,5 35,20 32,60 28,60 25,20"
                fill={`url(#crystal-highlight-${index})`}
                opacity="0.6"
              />

              {/* Crystal facets for depth */}
              <polygon
                points="30,5 15,25 30,35"
                fill={crystal.color}
                opacity="0.4"
              />
              <polygon
                points="30,5 45,25 30,35"
                fill={crystal.color}
                opacity="0.3"
              />
            </svg>

            {/* Smaller crystal shards around main one */}
            <svg
              width={crystal.size * 0.4}
              height={crystal.size * 0.5}
              viewBox="0 0 24 40"
              className="absolute"
              style={{
                left: '-30%',
                top: '40%',
                filter: `drop-shadow(0 0 ${crystal.size * 0.2}px ${crystal.color})`,
                animation: `twinkle ${2.5 + (index % 2)}s ease-in-out infinite`,
                animationDelay: `${crystal.delay + 0.3}s`,
              }}
            >
              <polygon
                points="12,2 18,12 16,38 8,38 6,12"
                fill={crystal.color}
                stroke={crystal.color}
                strokeWidth="0.5"
                opacity="0.7"
              />
            </svg>

            <svg
              width={crystal.size * 0.35}
              height={crystal.size * 0.45}
              viewBox="0 0 21 36"
              className="absolute"
              style={{
                right: '-25%',
                top: '50%',
                filter: `drop-shadow(0 0 ${crystal.size * 0.15}px ${crystal.color})`,
                animation: `twinkle ${2.8 + (index % 3)}s ease-in-out infinite`,
                animationDelay: `${crystal.delay + 0.6}s`,
              }}
            >
              <polygon
                points="10.5,2 15,10 14,34 7,34 6,10"
                fill={crystal.color}
                stroke={crystal.color}
                strokeWidth="0.5"
                opacity="0.65"
              />
            </svg>

            {/* Glow effect at base */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-xl"
              style={{
                width: crystal.size * 0.8,
                height: crystal.size * 0.3,
                backgroundColor: crystal.color,
                opacity: 0.4,
                animation: `twinkle ${3 + (index % 4)}s ease-in-out infinite`,
                animationDelay: `${crystal.delay}s`,
              }}
            />
          </div>
        </div>
      ))}

      {/* Additional ambient light particles around crystals */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${20 + Math.random() * 60}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            backgroundColor: ['#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#60a5fa', '#818cf8'][i % 6],
            boxShadow: `0 0 ${4 + Math.random() * 6}px ${['#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#60a5fa', '#818cf8'][i % 6]}`,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}
