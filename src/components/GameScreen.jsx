import { useState, useEffect } from 'react';
import NightSky from './NightSky';
import Icicles from './Icicles';
import CaveEnvironment from './CaveEnvironment';
import GlowingCrystals from './GlowingCrystals';
import { SCENES } from '../data/scenes';

export default function GameScreen({ currentScene, onSceneComplete, onGameComplete, onReturnToMenu }) {
  const [buttonStates, setButtonStates] = useState([null, null, null]);
  const scene = currentScene < SCENES.length ? SCENES[currentScene] : null;
  const isVictory = currentScene >= SCENES.length;

  useEffect(() => {
    setButtonStates([null, null, null]);
  }, [currentScene]);

  const handleAction = (isCorrect, index) => {
    if (buttonStates[index] !== null) return; // Already clicked

    const newStates = [...buttonStates];
    newStates[index] = isCorrect ? 'correct' : 'incorrect';
    setButtonStates(newStates);

    if (isCorrect) {
      setTimeout(() => {
        if (currentScene >= SCENES.length - 1) {
          onGameComplete();
        } else {
          onSceneComplete();
        }
      }, 1000);
    } else {
      setTimeout(() => {
        setButtonStates([null, null, null]);
      }, 500);
    }
  };

  if (isVictory) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 overflow-hidden">
        <CaveEnvironment />
        <GlowingCrystals />

        {/* Story Box */}
        <div className="absolute top-[180px] left-1/2 -translate-x-1/2 w-[80%] max-w-[700px] z-[15]
          bg-gradient-to-br from-white/95 to-blue-50/95
          border-[5px] border-yellow-400 rounded-[20px] px-9 py-6
          shadow-[0_8px_30px_rgba(0,0,0,0.6),inset_0_2px_10px_rgba(255,215,0,0.3)]
          md:w-[90%] md:px-6 md:py-5 md:top-[150px]">
          <p className="text-[#1a2847] text-2xl md:text-xl leading-relaxed font-semibold text-center m-0 font-serif">
            Congratulations! You solved the mystery! The K-Pop Demon Hunter thanks you for your help!
          </p>
        </div>

        {/* Victory Icons */}
        <div className="relative z-[5] h-full flex items-center justify-center pt-72 pb-48 px-5 md:pt-60 md:pb-40">
          <div className="text-8xl text-center">🎊 🎉 ⭐</div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-3 z-[15] flex-wrap justify-center max-w-[90%]">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-lg font-bold text-white
              bg-gradient-to-br from-blue-400 to-blue-600
              border-3 border-yellow-400 rounded-xl
              shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_-2px_8px_rgba(0,0,0,0.2)]
              transition-all duration-300
              hover:translate-y-[-3px] hover:shadow-[0_8px_20px_rgba(107,140,255,0.5),inset_0_-2px_8px_rgba(0,0,0,0.2)]
              hover:border-yellow-300 hover:from-blue-300 hover:to-blue-500
              active:translate-y-0 active:shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_2px_8px_rgba(0,0,0,0.3)]
              [text-shadow:2px_2px_4px_rgba(0,0,0,0.6)]
              min-w-[160px]"
          >
            Play Again
          </button>

          <button
            onClick={onReturnToMenu}
            className="px-6 py-3 text-lg font-bold text-white
              bg-gradient-to-br from-blue-400 to-blue-600
              border-3 border-yellow-400 rounded-xl
              shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_-2px_8px_rgba(0,0,0,0.2)]
              transition-all duration-300
              hover:translate-y-[-3px] hover:shadow-[0_8px_20px_rgba(107,140,255,0.5),inset_0_-2px_8px_rgba(0,0,0,0.2)]
              hover:border-yellow-300 hover:from-blue-300 hover:to-blue-500
              active:translate-y-0 active:shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_2px_8px_rgba(0,0,0,0.3)]
              [text-shadow:2px_2px_4px_rgba(0,0,0,0.6)]
              min-w-[160px]"
          >
            Main Menu
          </button>
        </div>
      </div>
    );
  }

  if (!scene) return null;

  // Determine if we're in a cave (scenes 2 and 3)
  const isInCave = currentScene >= 1;
  const hasCrystals = currentScene === 2; // Scene 3 (index 2)

  return (
    <div className={`absolute inset-0 overflow-hidden ${
      isInCave
        ? 'bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900'
        : 'bg-gradient-to-b from-[#0a1628] via-[#1a2847] to-[#2a3856]'
    }`}>
      {!isInCave && <NightSky />}
      {isInCave ? <CaveEnvironment /> : <Icicles />}
      {hasCrystals && <GlowingCrystals />}

      {/* Story Box */}
      <div className="absolute top-[180px] left-1/2 -translate-x-1/2 w-[80%] max-w-[700px] z-[15]
        bg-gradient-to-br from-white/95 to-blue-50/95
        border-[5px] border-yellow-400 rounded-[20px] px-9 py-6
        shadow-[0_8px_30px_rgba(0,0,0,0.6),inset_0_2px_10px_rgba(255,215,0,0.3)]
        md:w-[90%] md:px-6 md:py-5 md:top-[150px]">
        <p className="text-[#1a2847] text-2xl md:text-xl leading-relaxed font-semibold text-center m-0 font-serif">
          {scene.story}
        </p>
      </div>

      {/* Game Content - Clues */}
      <div className="relative z-[5] h-full flex items-center justify-center pt-72 pb-48 px-5 md:pt-60 md:pb-40">
        <div className="flex gap-6 md:gap-4 flex-wrap justify-center items-center max-w-[700px]">
          {scene.clues.map((clue, index) => (
            <div
              key={index}
              className="bg-white/15 border-[3px] border-yellow-400/60 rounded-2xl p-4 min-w-[100px] max-w-[140px]
                text-center backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.4)]
                transition-all duration-300
                hover:bg-white/25 hover:border-yellow-400 hover:scale-105"
            >
              <div className="text-4xl mb-2">{clue.icon}</div>
              <div className="text-white text-base font-bold [text-shadow:2px_2px_4px_rgba(0,0,0,0.8)]">
                {clue.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-3 z-[15] flex-wrap justify-center max-w-[90%]">
        {scene.actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleAction(action.correct, index)}
            className={`px-6 py-3 text-lg font-bold text-white
              border-3 border-yellow-400 rounded-xl
              shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_-2px_8px_rgba(0,0,0,0.2)]
              transition-all duration-300
              [text-shadow:2px_2px_4px_rgba(0,0,0,0.6)]
              min-w-[160px]
              ${buttonStates[index] === 'correct'
                ? 'bg-gradient-to-br from-green-500 to-green-700 animate-pulse-correct'
                : buttonStates[index] === 'incorrect'
                ? 'bg-gradient-to-br from-red-500 to-red-700 animate-shake'
                : 'bg-gradient-to-br from-blue-400 to-blue-600 hover:translate-y-[-3px] hover:shadow-[0_10px_30px_rgba(107,140,255,0.5),inset_0_-2px_10px_rgba(0,0,0,0.2)] hover:border-yellow-300 hover:from-blue-300 hover:to-blue-500 active:translate-y-0 active:shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_2px_10px_rgba(0,0,0,0.3)]'
              }`}
          >
            {action.text}
          </button>
        ))}
      </div>
    </div>
  );
}
