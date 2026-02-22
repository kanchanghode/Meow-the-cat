import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CatCustomization } from '../types';
import { MousePointer2, Move, Keyboard, ArrowLeft, Volume2, Scissors, Sparkles, Ghost } from 'lucide-react';

interface UIOverlayProps {
  isLocked: boolean;
  onBack: () => void;
  customization: CatCustomization;
}

export function UIOverlay({ isLocked, onBack, customization }: UIOverlayProps) {
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyM') setLastAction('Vocalizing');
      if (e.code === 'KeyE') setLastAction('Marking Territory');
      if (e.code === 'KeyG') setLastAction('Self-Care');
      if (e.code === 'Space') setLastAction('Vertical Leap');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (lastAction) {
      const timer = setTimeout(() => setLastAction(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastAction]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-12">
      {/* Top Bar - Minimalist Status */}
      <div className="flex justify-between items-start">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-bold">Neural Link Active</span>
          </div>
          <div className="flex flex-col">
            <div className="text-3xl font-extralight tracking-tighter text-white/90">
              {customization.breed}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[8px] uppercase tracking-[0.3em] text-white/20 font-bold">Pattern</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium">{customization.pattern}</span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col items-end gap-4">
          <button
            onClick={onBack}
            className="pointer-events-auto group flex items-center gap-4 text-white/30 hover:text-white transition-all duration-500"
          >
            <span className="text-[9px] uppercase tracking-[0.5em] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Disconnect</span>
            <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/5 transition-all">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
          </button>
          
          {/* Compass / Orientation Mockup */}
          <div className="flex flex-col items-end gap-1">
            <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div 
                animate={{ x: [-20, 20] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </div>
            <span className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-bold">Vector Alignment</span>
          </div>
        </div>
      </div>

      {/* Center Action Feedback - Cinematic Overlay */}
      <div className="flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {lastAction && (
            <motion.div
              key={lastAction}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
              className="text-white/60 text-[11px] uppercase tracking-[0.8em] font-light italic"
            >
              {lastAction}
            </motion.div>
          )}
        </AnimatePresence>

        {!isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-8 pointer-events-auto"
          >
            <div className="relative">
              <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <motion.div 
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-white/40 blur-[2px]"
              />
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-[10px] uppercase tracking-[1em] text-white/80 font-light">Synchronize</h3>
              <p className="text-white/10 text-[8px] uppercase tracking-[0.3em] font-bold">Press to engage feline perspective</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Controls - Technical Layout */}
      <div className="flex justify-between items-end">
        <div className="flex gap-16 border-t border-white/5 pt-6">
          <MinimalKey label="WASD" desc="Locomotion" />
          <MinimalKey label="M" desc="Vocalize" />
          <MinimalKey label="E" desc="Interact" />
          <MinimalKey label="G" desc="Groom" />
          <MinimalKey label="SPACE" desc="Leap" />
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-bold">Lat</span>
              <span className="text-[10px] font-mono text-white/40 tracking-widest">40.7128</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-bold">Lon</span>
              <span className="text-[10px] font-mono text-white/40 tracking-widest">-74.0060</span>
            </div>
          </div>
          <div className="text-[9px] uppercase tracking-[0.3em] text-white/10 font-black">Urban Sector 07</div>
        </div>
      </div>
    </div>
  );
}

function MinimalKey({ label, desc }: { label: string, desc: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-white tracking-widest">{label}</span>
      <span className="text-[8px] uppercase tracking-[0.2em] text-white/20 font-bold">{desc}</span>
    </div>
  );
}
