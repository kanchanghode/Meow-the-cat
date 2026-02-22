import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CatCustomization, CAT_COLORS, CAT_PATTERNS, CAT_BREEDS } from '../types';
import { PawPrint, Settings2, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MenuProps {
  onStart: (config: CatCustomization) => void;
  initialConfig: CatCustomization;
}

export function Menu({ onStart, initialConfig }: MenuProps) {
  const [config, setConfig] = useState<CatCustomization>(initialConfig);

  const handleStart = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: [config.color, '#ffffff', '#f97316']
    });
    setTimeout(() => onStart(config), 800);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 opacity-40">
        <img 
          src="https://picsum.photos/seed/catstreet/1920/1080?blur=4" 
          alt="Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 p-12"
      >
        {/* Left Side: Title & Atmosphere */}
        <div className="lg:col-span-7 flex flex-col justify-end space-y-8 pb-12">
          <div className="space-y-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[10px] uppercase tracking-[0.8em] text-orange-500 font-bold"
            >
              A Street Cat Simulation
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-8xl font-light tracking-tighter leading-[0.85] text-white"
            >
              FELINE <br />
              <span className="font-serif italic font-normal text-neutral-400">Street</span>
            </motion.h1>
          </div>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-md text-neutral-400 text-lg font-light leading-relaxed border-l border-white/10 pl-6"
          >
            Navigate the concrete jungle. Survive the night. Experience life from four inches off the ground.
          </motion.p>
        </div>

        {/* Right Side: Refined Customization */}
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.03] backdrop-blur-2xl rounded-[40px] border border-white/10 p-10 flex flex-col space-y-10 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-white/60">Configuration</h2>
              <div className="w-12 h-[1px] bg-white/20" />
            </div>

            {/* Breed Selection */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Select Breed</label>
              <div className="grid grid-cols-2 gap-3">
                {CAT_BREEDS.map((breed) => (
                  <button
                    key={breed.id}
                    onClick={() => setConfig({ ...config, breed: breed.id as any })}
                    className={`px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border ${
                      config.breed === breed.id 
                        ? 'bg-white text-black border-white shadow-lg shadow-white/10' 
                        : 'bg-white/5 text-neutral-400 border-transparent hover:bg-white/10'
                    }`}
                  >
                    {breed.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Fur Pigment</label>
              <div className="flex flex-wrap gap-4">
                {CAT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setConfig({ ...config, color: color.value })}
                    className={`w-8 h-8 rounded-full transition-all ring-offset-4 ring-offset-black ${
                      config.color === color.value ? 'ring-2 ring-white scale-125' : 'ring-0 hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              className="group relative mt-auto w-full bg-white text-black py-6 rounded-full font-bold uppercase tracking-[0.4em] text-xs transition-all hover:bg-orange-500 hover:text-white active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Initialize Simulation</span>
              <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer Details */}
      <div className="absolute bottom-12 left-12 flex items-center gap-8">
        <div className="flex flex-col">
          <span className="text-[8px] uppercase tracking-widest text-neutral-600 font-bold">Version</span>
          <span className="text-[10px] font-mono text-neutral-400">2.0.4-STREET</span>
        </div>
        <div className="w-[1px] h-8 bg-white/10" />
        <div className="flex flex-col">
          <span className="text-[8px] uppercase tracking-widest text-neutral-600 font-bold">Engine</span>
          <span className="text-[10px] font-mono text-neutral-400">R3F-CORE</span>
        </div>
      </div>
    </div>
  );
}
