import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';

/**
 * LoadingProgress - Shows loading progress for 3D assets
 * Displays a spinner and percentage while models/textures load
 */
export default function LoadingProgress() {
  const { active, progress, errors, item, loaded, total } = useProgress();
  const [visible, setVisible] = useState(true);

  // Hide loading screen when complete
  useEffect(() => {
    if (!active && progress === 100) {
      // Smooth fade out after loading completes
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  // Don't render if loading is complete and fade out is done
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#0a1628] via-[#1a2847] to-[#2a3856] transition-opacity duration-500 ${
        !active && progress === 100 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-blue-900/30 rounded-full"></div>

          {/* Animated progress ring */}
          <svg className="absolute inset-0 w-24 h-24 -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-blue-400"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>

          {/* Spinning snowflake icon */}
          <div className="absolute inset-0 flex items-center justify-center animate-spin">
            <svg
              className="w-10 h-10 text-blue-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 3v4m0 10v-4m7-7l-2.828 2.828M5.828 14.172L3 17m14 0l-2.828-2.828M5.828 5.828L3 3m14 14l-2.828-2.828M14.172 5.828L17 3M10 7a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="text-4xl font-bold text-blue-200 mb-4">
          {Math.round(progress)}%
        </div>

        {/* Loading Text */}
        <div className="text-lg text-blue-300 mb-2">
          Loading K-Pop Demon Hunter Mysteries...
        </div>

        {/* Progress Details */}
        <div className="text-sm text-blue-400/70">
          {loaded} / {total} assets loaded
        </div>

        {/* Current Item (if available) */}
        {item && (
          <div className="text-xs text-blue-400/50 mt-2 max-w-md truncate">
            {item}
          </div>
        )}

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="mt-4 text-red-400 text-sm max-w-2xl mx-auto">
            <div className="mb-2">
              ⚠ {errors.length} asset{errors.length > 1 ? 's' : ''} failed to load:
            </div>
            <div className="text-xs text-red-300/80 max-h-32 overflow-y-auto space-y-1 text-left bg-red-950/20 p-2 rounded">
              {errors.map((error, index) => (
                <div key={index} className="font-mono truncate">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
