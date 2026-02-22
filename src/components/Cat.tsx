import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls, Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { CatCustomization } from '../types';

interface CatProps {
  customization: CatCustomization;
}

export const Cat = forwardRef<THREE.Group, CatProps>(({ customization }, forwardedRef) => {
  const group = useRef<THREE.Group>(null);
  React.useImperativeHandle(forwardedRef, () => group.current!);
  
  const [, getKeys] = useKeyboardControls();
  
  // Movement state
  const [velocity] = useState(() => new THREE.Vector3());
  const [action, setAction] = useState<'idle' | 'walking' | 'running' | 'jumping' | 'sneaking'>('idle');
  const [walkCycle, setWalkCycle] = useState(0);
  const [jumpVelocity, setJumpVelocity] = useState(0);
  const [isGrounded, setIsGrounded] = useState(true);

  // Meow Sound Synthesizer
  const playMeow = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyM') playMeow();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simple procedural cat model using primitives
  // In a real game, you'd load a GLTF model here
  const catColor = new THREE.Color(customization.color);

  useFrame((state, delta) => {
    if (!group.current) return;

    const { forward, backward, left, right, jump, sneak } = getKeys();
    
    // Movement logic
    const moveSpeed = sneak ? 1.5 : (forward || backward ? 4 : 0);
    const turnSpeed = 3;

    if (forward) velocity.z = -moveSpeed;
    else if (backward) velocity.z = moveSpeed;
    else velocity.z = 0;

    if (left) group.current.rotation.y += turnSpeed * delta;
    if (right) group.current.rotation.y -= turnSpeed * delta;

    // Jump logic
    if (jump && isGrounded) {
      setJumpVelocity(5);
      setIsGrounded(false);
      setAction('jumping');
    }

    if (!isGrounded) {
      group.current.position.y += jumpVelocity * delta;
      setJumpVelocity((v) => v - 15 * delta); // Gravity

      if (group.current.position.y <= 0.25) {
        group.current.position.y = 0.25;
        setIsGrounded(true);
        setJumpVelocity(0);
      }
    }

    // Apply velocity relative to rotation
    const direction = new THREE.Vector3(0, 0, velocity.z);
    direction.applyQuaternion(group.current.quaternion);
    
    group.current.position.addScaledVector(direction, delta);

    // Animation state logic
    const currentSpeed = Math.abs(velocity.z);
    if (!isGrounded) {
      setAction('jumping');
    } else if (currentSpeed > 0.1) {
      setAction(sneak ? 'sneaking' : (currentSpeed > 3 ? 'running' : 'walking'));
      // Synchronize walk cycle with actual movement speed
      const cycleSpeed = sneak ? 4 : (currentSpeed > 3 ? 12 : 8);
      setWalkCycle((prev) => (prev + delta * cycleSpeed) % (Math.PI * 2));
    } else {
      setAction('idle');
      setWalkCycle(0);
    }

    // Camera follow
    const idealOffset = new THREE.Vector3(0, 1.2, 3);
    idealOffset.applyQuaternion(group.current.quaternion);
    idealOffset.add(group.current.position);

    const idealLookat = new THREE.Vector3(0, 0.4, -1.5);
    idealLookat.applyQuaternion(group.current.quaternion);
    idealLookat.add(group.current.position);

    state.camera.position.lerp(idealOffset, 0.05);
    const currentLookAt = new THREE.Vector3();
    state.camera.getWorldDirection(currentLookAt);
    const targetLookAt = idealLookat.clone().sub(state.camera.position).normalize();
    
    state.camera.lookAt(idealLookat);
  });

  const bodyBob = (action !== 'idle' && isGrounded) ? Math.sin(walkCycle * 2) * 0.03 : 0;

  return (
    <group ref={group} position={[0, 0.25 + bodyBob, 0]}>
      {/* Body */}
      <Box args={[0.35, 0.3, 0.7]} castShadow receiveShadow>
        <meshStandardMaterial color={catColor} />
      </Box>
      {/* Neck/Shoulders */}
      <Box args={[0.3, 0.25, 0.2]} position={[0, 0.1, -0.25]} castShadow>
        <meshStandardMaterial color={catColor} />
      </Box>

      {/* Head */}
      <group position={[0, 0.3, -0.45]}>
        <Box args={[0.3, 0.3, 0.3]} castShadow>
          <meshStandardMaterial color={catColor} />
          {/* Ears */}
          <Box args={[0.08, 0.15, 0.04]} position={[0.1, 0.18, 0]} rotation={[0, 0, 0.2]}>
            <meshStandardMaterial color={catColor} />
          </Box>
          <Box args={[0.08, 0.15, 0.04]} position={[-0.1, 0.18, 0]} rotation={[0, 0, -0.2]}>
            <meshStandardMaterial color={catColor} />
          </Box>
          {/* Eyes */}
          <Sphere args={[0.03, 8, 8]} position={[0.08, 0.05, -0.16]}>
            <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.5} />
          </Sphere>
          <Sphere args={[0.03, 8, 8]} position={[-0.08, 0.05, -0.16]}>
            <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.5} />
          </Sphere>
          {/* Nose */}
          <Box args={[0.05, 0.04, 0.04]} position={[0, 0, -0.18]}>
            <meshStandardMaterial color="#f472b6" />
          </Box>
        </Box>
      </group>

      {/* Tail */}
      <group 
        position={[0, 0.1, 0.4]} 
        rotation={[0.5 + (action !== 'idle' ? Math.sin(walkCycle * 2) * 0.2 : 0), (action !== 'idle' ? Math.cos(walkCycle) * 0.3 : 0), 0]}
      >
        <Cylinder args={[0.04, 0.04, 0.6]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.3]}>
          <meshStandardMaterial color={catColor} />
        </Cylinder>
      </group>

      {/* Legs */}
      {[
        { pos: [-0.15, -0.2, -0.25], phase: 0 },            // Front Left
        { pos: [0.15, -0.2, -0.25], phase: Math.PI },       // Front Right
        { pos: [-0.15, -0.2, 0.25], phase: Math.PI * 0.5 }, // Back Left
        { pos: [0.15, -0.2, 0.25], phase: Math.PI * 1.5 }   // Back Right
      ].map((leg, i) => {
        const isMoving = action !== 'idle' && isGrounded;
        
        // Quadruped walk: legs move in a specific sequence
        // We use the phase to offset each leg in the cycle
        const swing = Math.sin(walkCycle + leg.phase);
        // Lift the leg only when it's swinging forward (sin > 0)
        const lift = isMoving ? Math.max(0, Math.cos(walkCycle + leg.phase)) * 0.12 : 0;
        
        return (
          <group 
            key={i} 
            position={[leg.pos[0], leg.pos[1] + lift, leg.pos[2]] as any}
            rotation={[isMoving ? swing * 0.5 : 0, 0, 0]}
          >
            <Box args={[0.07, 0.25, 0.07]} castShadow>
              <meshStandardMaterial color={catColor} />
            </Box>
            {/* Paws */}
            <Box args={[0.09, 0.05, 0.1]} position={[0, -0.12, -0.01]}>
              <meshStandardMaterial color={catColor} />
            </Box>
          </group>
        );
      })}

      {/* Whiskers */}
      <group position={[0, 0.2, -0.6]}>
        {[[-0.1, 0.05, 0], [0.1, 0.05, 0], [-0.1, -0.05, 0], [0.1, -0.05, 0]].map((pos, i) => (
          <Box key={i} args={[0.2, 0.01, 0.01]} position={pos as any} rotation={[0, 0, i % 2 === 0 ? 0.2 : -0.2]}>
            <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
          </Box>
        ))}
      </group>
    </group>
  );
});
