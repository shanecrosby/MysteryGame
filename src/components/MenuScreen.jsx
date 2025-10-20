import MenuScene3D from './MenuScene3D';

export default function MenuScreen({ onNewGame }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#1a2847] to-[#2a3856] overflow-hidden">
      <MenuScene3D />

      <div className="relative z-[5] flex flex-col items-center justify-center h-full px-5">
        {/* Title */}
        <h1 className="text-6xl md:text-5xl font-black text-center text-yellow-400 mb-16 md:mb-10
          tracking-wider leading-tight
          [text-shadow:3px_3px_6px_rgba(0,0,0,0.8),0_0_20px_rgba(255,215,0,0.6),0_0_40px_rgba(255,215,0,0.4)]">
          K-Pop Demon Hunter<br />Mysteries
        </h1>

        {/* Start Button */}
        <button
          onClick={onNewGame}
          className="px-12 py-5 text-3xl md:text-xl font-black text-white
            bg-gradient-to-br from-pink-400 to-pink-600
            border-4 border-yellow-400 rounded-2xl
            shadow-[0_6px_20px_rgba(0,0,0,0.4),inset_0_-2px_10px_rgba(0,0,0,0.2)]
            transition-all duration-300
            hover:translate-y-[-3px] hover:shadow-[0_10px_30px_rgba(255,107,157,0.5),inset_0_-2px_10px_rgba(0,0,0,0.2)]
            hover:border-yellow-300 hover:from-pink-300 hover:to-pink-500
            active:translate-y-0 active:shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_2px_10px_rgba(0,0,0,0.3)]
            [text-shadow:2px_2px_4px_rgba(0,0,0,0.6)]
            min-w-[350px] md:min-w-[280px]"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
