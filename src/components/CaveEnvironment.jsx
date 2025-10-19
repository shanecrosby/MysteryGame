export default function CaveEnvironment() {
  // Generate random glowworms
  const glowworms = Array.from({ length: 25 }, (_, i) => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 80}%`,
    size: `${2 + Math.random() * 3}px`,
    delay: `${Math.random() * 3}s`,
    duration: `${2 + Math.random() * 2}s`,
  }));

  return (
    <>
      {/* Cave Ceiling - Rocky texture */}
      <div className="absolute top-0 left-0 w-full h-32 z-10 pointer-events-none overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-800/95 via-stone-700/80 to-transparent" />

        {/* Rocky stalactites using SVG */}
        <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cave-ceiling-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#44403c', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#57534e', stopOpacity: 0.9 }} />
              <stop offset="100%" style={{ stopColor: '#78716c', stopOpacity: 0.6 }} />
            </linearGradient>
          </defs>
          <path
            d="M 0 0 L 100 0 L 100 40 Q 95 50 90 40 Q 85 55 80 40 Q 75 45 70 40 Q 65 52 60 40 Q 55 48 50 40 Q 45 54 40 40 Q 35 46 30 40 Q 25 51 20 40 Q 15 47 10 40 Q 5 53 0 40 Z"
            fill="url(#cave-ceiling-gradient)"
            className="drop-shadow-2xl"
          />
        </svg>

        {/* Glowworms on ceiling and walls */}
        {glowworms.slice(0, 12).map((worm, i) => (
          <div
            key={`ceiling-${i}`}
            className="absolute rounded-full"
            style={{
              left: worm.x,
              top: worm.y,
              width: worm.size,
              height: worm.size,
              backgroundColor: '#a3e635',
              boxShadow: `0 0 ${parseInt(worm.size) * 3}px #a3e635`,
              animation: `twinkle ${worm.duration} ease-in-out infinite`,
              animationDelay: worm.delay,
            }}
          />
        ))}
      </div>

      {/* Left Cave Wall */}
      <div className="absolute left-0 top-0 w-24 h-full z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-800/90 via-stone-700/70 to-transparent" />
        {glowworms.slice(12, 17).map((worm, i) => (
          <div
            key={`left-${i}`}
            className="absolute rounded-full"
            style={{
              left: worm.x,
              top: worm.y,
              width: worm.size,
              height: worm.size,
              backgroundColor: '#a3e635',
              boxShadow: `0 0 ${parseInt(worm.size) * 3}px #a3e635`,
              animation: `twinkle ${worm.duration} ease-in-out infinite`,
              animationDelay: worm.delay,
            }}
          />
        ))}
      </div>

      {/* Right Cave Wall */}
      <div className="absolute right-0 top-0 w-24 h-full z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-stone-800/90 via-stone-700/70 to-transparent" />
        {glowworms.slice(17, 22).map((worm, i) => (
          <div
            key={`right-${i}`}
            className="absolute rounded-full"
            style={{
              left: worm.x,
              top: worm.y,
              width: worm.size,
              height: worm.size,
              backgroundColor: '#a3e635',
              boxShadow: `0 0 ${parseInt(worm.size) * 3}px #a3e635`,
              animation: `twinkle ${worm.duration} ease-in-out infinite`,
              animationDelay: worm.delay,
            }}
          />
        ))}
      </div>

      {/* Cave Floor - Rocky ground */}
      <div className="absolute bottom-0 left-0 w-full h-28 z-10 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-stone-800/95 via-stone-700/80 to-transparent">
          {/* Rocky floor using SVG */}
          <svg className="absolute top-0 left-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cave-floor-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#44403c', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#57534e', stopOpacity: 0.9 }} />
                <stop offset="100%" style={{ stopColor: '#78716c', stopOpacity: 0.4 }} />
              </linearGradient>
            </defs>
            <path
              d="M 0 112 L 100 112 L 100 60 Q 95 50 90 60 Q 85 45 80 60 Q 75 52 70 60 Q 65 48 60 60 Q 55 54 50 60 Q 45 47 40 60 Q 35 53 30 60 Q 25 49 20 60 Q 15 55 10 60 Q 5 46 0 60 Z"
              fill="url(#cave-floor-gradient)"
              className="drop-shadow-2xl"
            />
          </svg>

          {/* Glowworms near floor */}
          {glowworms.slice(22).map((worm, i) => (
            <div
              key={`floor-${i}`}
              className="absolute rounded-full"
              style={{
                left: worm.x,
                bottom: `${Math.random() * 40}px`,
                width: worm.size,
                height: worm.size,
                backgroundColor: '#a3e635',
                boxShadow: `0 0 ${parseInt(worm.size) * 3}px #a3e635`,
                animation: `twinkle ${worm.duration} ease-in-out infinite`,
                animationDelay: worm.delay,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
