import { useState, useEffect } from 'react';
import Level1Scene3D from './Level1Scene3D';
import CluesSidebar from './CluesSidebar';
import useAudioPlayer from '../hooks/useAudioPlayer';
import { SCENES } from '../data/scenes';

export default function GameScreen({ currentScene, onSceneComplete, onGameComplete, onReturnToMenu }) {
  const [clues, setClues] = useState([]);
  const [collectedClues, setCollectedClues] = useState([]);
  const [showNarration, setShowNarration] = useState(true);
  const [narrationText, setNarrationText] = useState('');
  const [tutorialShown, setTutorialShown] = useState({
    first_click: false,
    first_clue: false,
    all_clues: false
  });

  const { play, unlock } = useAudioPlayer();
  const scene = currentScene < SCENES.length ? SCENES[currentScene] : null;
  const isVictory = currentScene >= SCENES.length;

  // Unlock audio on component mount (user clicked Start Game button)
  useEffect(() => {
    unlock();
  }, [unlock]);

  // Initialize scene clues
  useEffect(() => {
    if (scene && scene.clues) {
      setClues(scene.clues.map(clue => ({ ...clue, collected: false })));
      setCollectedClues([]);
      setTutorialShown({
        first_click: false,
        first_clue: false,
        all_clues: false
      });

      // Play intro narration if available
      if (scene.narration && scene.narration.intro) {
        setNarrationText(scene.narration.intro.text);
        play(scene.narration.intro.audio);

        // Auto-hide intro after duration and show scene narration with 1s buffer
        setTimeout(() => {
          if (scene.narration.scene) {
            setNarrationText(scene.narration.scene.text);
            play(scene.narration.scene.audio);
          }
        }, (scene.narration.intro.duration + 2) * 1000);
      } else if (scene.narration && scene.narration.scene) {
        setNarrationText(scene.narration.scene.text);
        play(scene.narration.scene.audio);
      } else {
        setNarrationText(scene.story);
      }
    }
  }, [currentScene, scene, play]);

  // Handle clue click
  const handleClueClick = (clickedClue) => {
    // Show first click tutorial if not shown
    if (!tutorialShown.first_click && scene.tutorials) {
      const tutorial = scene.tutorials.find(t => t.trigger === 'first_click');
      if (tutorial) {
        setNarrationText(tutorial.text);
        play(tutorial.audio);
        setTutorialShown(prev => ({ ...prev, first_click: true }));
      }
    }

    // Update clue state
    const updatedClues = clues.map(clue =>
      clue.id === clickedClue.id ? { ...clue, collected: true } : clue
    );
    setClues(updatedClues);

    // Add to collected clues
    const newCollectedClues = [...collectedClues, clickedClue];
    setCollectedClues(newCollectedClues);

    // Play clue narration
    if (clickedClue.narration) {
      setNarrationText(clickedClue.narration.text);
      play(clickedClue.narration.audio);
    }

    // Show first clue tutorial if not shown
    if (newCollectedClues.length === 1 && !tutorialShown.first_clue && scene.tutorials) {
      const tutorial = scene.tutorials.find(t => t.trigger === 'first_clue');
      if (tutorial) {
        setTimeout(() => {
          setNarrationText(tutorial.text);
          play(tutorial.audio);
          setTutorialShown(prev => ({ ...prev, first_clue: true }));
        }, (clickedClue.narration?.duration || 3) * 1000 + 1000);
      }
    }

    // Check if all clues collected
    if (newCollectedClues.length === scene.clues.length) {
      if (!tutorialShown.all_clues && scene.tutorials) {
        const tutorial = scene.tutorials.find(t => t.trigger === 'all_clues');
        if (tutorial) {
          setTimeout(() => {
            setNarrationText(tutorial.text);
            play(tutorial.audio);
            setTutorialShown(prev => ({ ...prev, all_clues: true }));
          }, (clickedClue.narration?.duration || 3) * 1000 + 1000);
        }
      }

      // Show exit narration and allow progression
      if (scene.exitNarration) {
        setTimeout(() => {
          setNarrationText(scene.exitNarration.text);
          play(scene.exitNarration.audio);
        }, (clickedClue.narration?.duration || 3) * 1000 + 3000);
      }
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

  // Check if all clues are collected
  const allCluesCollected = collectedClues.length === scene.clues.length;

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#1a2847] to-[#2a3856]">
      {/* 3D Scene */}
      <Level1Scene3D clues={clues} onClueClick={handleClueClick} />

      {/* Collected Clues Sidebar */}
      <CluesSidebar
        collectedClues={collectedClues}
        totalClues={scene.clues.length}
      />

      {/* Narration Box - Bottom Right */}
      {showNarration && narrationText && (
        <div className="absolute bottom-4 right-4 w-[400px] max-w-[90vw] z-[15]
          bg-gradient-to-br from-white/95 to-blue-50/95
          border-[5px] border-yellow-400 rounded-[20px] px-6 py-5
          shadow-[0_8px_30px_rgba(0,0,0,0.6),inset_0_2px_10px_rgba(255,215,0,0.3)]
          md:w-[350px]">
          <p className="text-[#1a2847] text-lg md:text-base leading-relaxed font-semibold m-0 font-serif">
            {narrationText}
          </p>
          <button
            onClick={() => setShowNarration(false)}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center
              bg-yellow-400 hover:bg-yellow-500 rounded-full text-[#1a2847] font-bold
              transition-colors duration-200"
            title="Close narration"
          >
            ×
          </button>
        </div>
      )}

      {/* Continue Button (shown when all clues collected) */}
      {allCluesCollected && (
        <div className="absolute bottom-24 md:bottom-20 left-1/2 -translate-x-1/2 z-[15]">
          <button
            onClick={() => {
              if (currentScene >= SCENES.length - 1) {
                onGameComplete();
              } else {
                onSceneComplete();
              }
            }}
            className="px-8 py-4 text-2xl font-bold text-white
              bg-gradient-to-br from-green-400 to-green-600
              border-4 border-yellow-400 rounded-xl
              shadow-[0_6px_20px_rgba(0,0,0,0.4),inset_0_-2px_10px_rgba(0,0,0,0.2)]
              transition-all duration-300
              hover:translate-y-[-3px] hover:shadow-[0_10px_30px_rgba(74,222,128,0.5)]
              hover:border-yellow-300 hover:from-green-300 hover:to-green-500
              active:translate-y-0 active:shadow-[0_4px_15px_rgba(0,0,0,0.4)]
              [text-shadow:2px_2px_4px_rgba(0,0,0,0.6)]
              animate-bounce"
          >
            Continue to Next Level
          </button>
        </div>
      )}

      {/* Return to Menu Button */}
      <button
        onClick={onReturnToMenu}
        className="absolute top-4 left-4 px-4 py-2 text-sm font-bold text-white
          bg-gradient-to-br from-gray-600 to-gray-800
          border-2 border-white/50 rounded-lg
          shadow-[0_4px_12px_rgba(0,0,0,0.4)]
          transition-all duration-300
          hover:from-gray-500 hover:to-gray-700 hover:border-white
          z-[15]"
      >
        Menu
      </button>
    </div>
  );
}
