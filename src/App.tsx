/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu } from './components/Menu';
import { Game } from './components/Game';
import { CatCustomization, GameState } from './types';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [customization, setCustomization] = useState<CatCustomization>({
    color: '#d97706',
    pattern: 'solid',
    breed: 'shorthair',
  });

  const handleStart = (config: CatCustomization) => {
    setCustomization(config);
    setGameState('playing');
  };

  return (
    <div className="w-full h-screen bg-neutral-950 text-white overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {gameState === 'menu' ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <Menu onStart={handleStart} initialConfig={customization} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <Game customization={customization} onBackToMenu={() => setGameState('menu')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
