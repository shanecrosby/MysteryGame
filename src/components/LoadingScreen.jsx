export default function LoadingScreen({ progress = 0 }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#1a2847] to-[#2a3856] overflow-hidden flex items-center justify-center z-50">
      <div className="text-center">
        {/* Loading Title */}
        <h2 className="text-4xl md:text-3xl font-black text-yellow-400 mb-8
          tracking-wider
          [text-shadow:3px_3px_6px_rgba(0,0,0,0.8),0_0_20px_rgba(255,215,0,0.6)]">
          Loading...
        </h2>

        {/* Progress Bar Container */}
        <div className="w-[400px] max-w-[90vw] h-8 bg-[#1a2847] border-4 border-yellow-400 rounded-xl overflow-hidden
          shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          {/* Progress Bar Fill */}
          <div
            className="h-full bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-300 ease-out
              shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <p className="text-2xl md:text-xl font-bold text-white mt-4
          [text-shadow:2px_2px_4px_rgba(0,0,0,0.8)]">
          {Math.round(progress)}%
        </p>

        {/* Loading Spinner */}
        <div className="mt-8 flex justify-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}
