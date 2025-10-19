import { useState } from 'react';
import MenuScreen from './components/MenuScreen';
import GameScreen from './components/GameScreen';

function App() {
  const [screen, setScreen] = useState('menu'); // 'menu' or 'game'
  const [currentScene, setCurrentScene] = useState(0);
  const [fadeState, setFadeState] = useState('in'); // 'in' or 'out'

  const handleNewGame = () => {
    setCurrentScene(0);
    setFadeState('out');
    setTimeout(() => {
      setScreen('game');
      setFadeState('in');
    }, 1500);
  };

  const handleSceneComplete = () => {
    setCurrentScene(prev => prev + 1);
  };

  const handleGameComplete = () => {
    setCurrentScene(prev => prev + 1);
  };

  const handleReturnToMenu = () => {
    setFadeState('out');
    setTimeout(() => {
      setScreen('menu');
      setCurrentScene(0);
      setFadeState('in');
    }, 1500);
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-[#0a1628] via-[#1a2847] to-[#2a3856] relative overflow-hidden">
      {/* Menu Screen */}
      <div
        className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
          screen === 'menu' && fadeState === 'in'
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
        }`}
      >
        <MenuScreen onNewGame={handleNewGame} />
      </div>

      {/* Game Screen */}
      <div
        className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
          screen === 'game' && fadeState === 'in'
            ? 'opacity-100 visible'
            : 'opacity-0 invisible'
        }`}
      >
        <GameScreen
          currentScene={currentScene}
          onSceneComplete={handleSceneComplete}
          onGameComplete={handleGameComplete}
          onReturnToMenu={handleReturnToMenu}
        />
      </div>
    </div>
  );
}

export default App;
