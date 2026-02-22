import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Plane, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface ChunkProps {
  position: [number, number, number];
  rotation: [number, number, number];
  type: 'straight' | 'turn-left' | 'turn-right';
}

function StreetChunk({ position, rotation, type }: ChunkProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Ground - Asphalt with texture-like color */}
      <Plane args={[14, 40]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#121212" roughness={0.95} metalness={0.05} />
      </Plane>

      {/* Sidewalks - Concrete */}
      <Box args={[6, 0.3, 40]} position={[-10, 0.15, 0]} receiveShadow>
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </Box>
      <Box args={[6, 0.3, 40]} position={[10, 0.15, 0]} receiveShadow>
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </Box>

      {/* Curb */}
      <Box args={[0.2, 0.4, 40]} position={[-7.1, 0.2, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[0.2, 0.4, 40]} position={[7.1, 0.2, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>

      {/* Road Lines - Dashed */}
      {[...Array(4)].map((_, i) => (
        <Plane key={i} args={[0.15, 4]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -15 + i * 10]}>
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.2} />
        </Plane>
      ))}

      {/* Buildings - More varied and realistic */}
      <Building position={[-16, 12, -5]} size={[10, 24, 15]} color="#0a0a0a" />
      <Building position={[-16, 18, 12]} size={[10, 36, 12]} color="#1a1a1a" />
      <Building position={[16, 15, -12]} size={[10, 30, 18]} color="#0f0f0f" />
      <Building position={[16, 10, 8]} size={[10, 20, 14]} color="#141414" />
      
      {/* Street Props */}
      <StreetLight position={[-7.5, 0, -10]} />
      <StreetLight position={[7.5, 0, 10]} rotation={[0, Math.PI, 0]} />

      <TrashCan position={[-8, 0.6, -2]} />
      <FireHydrant position={[8, 0, 5]} />
      
      {/* Parked Car */}
      {Math.random() > 0.5 && (
        <Car position={[8.5, 0.5, -8]} color={['#1e3a8a', '#7f1d1d', '#14532d', '#3f3f46'][Math.floor(Math.random() * 4)]} />
      )}
    </group>
  );
}

function Car({ position, color }: any) {
  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      <Box args={[2.2, 1.4, 4.5]} castShadow>
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} />
      </Box>
      <Box args={[2, 0.9, 2.2]} position={[0, 0.9, 0.2]} castShadow>
        <meshStandardMaterial color="#000" roughness={0} />
      </Box>
    </group>
  );
}

function Building({ position, size, color }: any) {
  return (
    <Box args={size} position={position} castShadow receiveShadow>
      <meshStandardMaterial color={color} />
    </Box>
  );
}

function StreetLight({ position, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} rotation={rotation}>
      <Cylinder args={[0.05, 0.05, 6]} position={[0, 3, 0]} castShadow>
        <meshStandardMaterial color="#000" />
      </Cylinder>
      <Box args={[0.4, 0.1, 0.8]} position={[0, 6, 0.4]}>
        <meshStandardMaterial color="#000" />
        <pointLight intensity={2} distance={15} color="#ffcc00" />
      </Box>
    </group>
  );
}

function TrashCan({ position }: any) {
  return (
    <Cylinder args={[0.3, 0.3, 0.8]} position={position} castShadow>
      <meshStandardMaterial color="#444" metalness={0.5} />
    </Cylinder>
  );
}

function FireHydrant({ position }: any) {
  return (
    <group position={position}>
      <Cylinder args={[0.15, 0.15, 0.6]} position={[0, 0.3, 0]} castShadow>
        <meshStandardMaterial color="#800" />
      </Cylinder>
      <Sphere args={[0.18, 12, 12]} position={[0, 0.6, 0]} castShadow>
        <meshStandardMaterial color="#800" />
      </Sphere>
    </group>
  );
}

export function InfiniteStreet({ catRef }: { catRef: React.RefObject<THREE.Group> }) {
  const [chunks, setChunks] = useState(() => [
    { id: 0, position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    { id: 1, position: [0, 0, -40] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    { id: 2, position: [0, 0, -80] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
  ]);

  const lastChunkId = useRef(2);
  const lastChunkPos = useRef(new THREE.Vector3(0, 0, -80));
  const lastChunkRot = useRef(new THREE.Euler(0, 0, 0));

  useFrame(() => {
    if (!catRef.current) return;

    const catPos = catRef.current.position;
    const distanceToLast = catPos.distanceTo(lastChunkPos.current);

    // If cat is getting close to the end of the current road (within 100 units)
    if (distanceToLast < 120) {
      const nextId = lastChunkId.current + 1;
      
      // Decide if we should turn
      // To keep it simple and avoid self-intersection in a 3D space without a full grid,
      // we'll mostly go straight but occasionally turn 90 degrees.
      const shouldTurn = Math.random() > 0.7;
      let turnAngle = 0;
      if (shouldTurn) {
        turnAngle = Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2;
      }

      // Calculate next position based on current rotation
      const forward = new THREE.Vector3(0, 0, -40);
      forward.applyEuler(lastChunkRot.current);
      
      const nextPos = lastChunkPos.current.clone().add(forward);
      const nextRot = new THREE.Euler(0, lastChunkRot.current.y + turnAngle, 0);

      setChunks(prev => {
        const newChunks = [...prev, { 
          id: nextId, 
          position: [nextPos.x, nextPos.y, nextPos.z] as [number, number, number], 
          rotation: [nextRot.x, nextRot.y, nextRot.z] as [number, number, number] 
        }];
        if (newChunks.length > 10) {
          return newChunks.slice(newChunks.length - 10);
        }
        return newChunks;
      });

      lastChunkId.current = nextId;
      lastChunkPos.current = nextPos;
      lastChunkRot.current = nextRot;
    }
  });

  return (
    <group>
      {chunks.map(chunk => (
        <React.Fragment key={chunk.id}>
          <StreetChunk position={chunk.position} rotation={chunk.rotation} type="straight" />
          {/* Junction filler to bridge gaps on turns */}
          <Box args={[26, 0.1, 26]} position={chunk.position} receiveShadow>
            <meshStandardMaterial color="#121212" />
          </Box>
        </React.Fragment>
      ))}
    </group>
  );
}
