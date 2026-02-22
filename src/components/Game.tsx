import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, Stars, Environment, KeyboardControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { CatCustomization } from '../types';
import { Cat } from './Cat';
import { InfiniteStreet } from './InfiniteStreet';
import { UIOverlay } from './UIOverlay';
import { AmbientSounds } from './AmbientSounds';

interface GameProps {
  customization: CatCustomization;
  onBackToMenu: () => void;
}

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'meow', keys: ['KeyM'] },
  { name: 'scratch', keys: ['KeyE'] },
  { name: 'groom', keys: ['KeyG'] },
  { name: 'sneak', keys: ['ShiftLeft', 'ShiftRight'] },
];

export function Game({ customization, onBackToMenu }: GameProps) {
  const [isLocked, setIsLocked] = useState(false);
  const catRef = useRef<THREE.Group>(null);

  return (
    <div className="w-full h-full relative">
      <KeyboardControls map={keyboardMap}>
        <AmbientSounds />
        <Canvas shadows>
          <fog attach="fog" args={['#000', 10, 80]} />
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={75} />
            
            <Sky sunPosition={[100, 20, 100]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Environment preset="city" />
            
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />

            <InfiniteStreet catRef={catRef} />
            
            <Cat ref={catRef} customization={customization} />

            <PointerLockControls onLock={() => setIsLocked(true)} onUnlock={() => setIsLocked(false)} />
          </Suspense>
        </Canvas>
      </KeyboardControls>

      <UIOverlay 
        isLocked={isLocked} 
        onBack={onBackToMenu} 
        customization={customization}
      />
    </div>
  );
}
