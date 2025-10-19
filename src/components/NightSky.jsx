export default function NightSky() {
  return (
    <>
      {/* Moon */}
      <div className="absolute top-[15%] right-[20%] w-[120px] h-[120px] rounded-full z-[1]
        bg-gradient-radial from-[#fefcd7] to-[#f0e68c]
        shadow-[0_0_40px_rgba(254,252,215,0.6),0_0_80px_rgba(254,252,215,0.3)]
        md:w-20 md:h-20 md:top-[10%] md:right-[10%]">
        <div className="absolute inset-0 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1)]"></div>
      </div>

      {/* Stars */}
      <div className="stars-background absolute w-full h-full animate-twinkle z-[1]"></div>
    </>
  );
}
