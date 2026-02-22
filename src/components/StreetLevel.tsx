import React from 'react';
import { Box, Plane, Cylinder, Sphere } from '@react-three/drei';

export function StreetLevel() {
  return (
    <group>
      {/* Ground / Street - Expanded */}
      <Plane args={[200, 200]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#262626" roughness={0.8} />
      </Plane>

      {/* Sidewalks - Expanded */}
      <Box args={[10, 0.2, 200]} position={[-10, 0.1, 0]} receiveShadow>
        <meshStandardMaterial color="#404040" />
      </Box>
      <Box args={[10, 0.2, 200]} position={[10, 0.1, 0]} receiveShadow>
        <meshStandardMaterial color="#404040" />
      </Box>

      {/* Road Lines */}
      {[...Array(10)].map((_, i) => (
        <Plane key={i} args={[0.2, 2]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -50 + i * 10]}>
          <meshStandardMaterial color="yellow" />
        </Plane>
      ))}

      {/* Buildings - Left Side */}
      <Building position={[-20, 10, -30]} size={[15, 20, 15]} color="#171717" />
      <Building position={[-20, 15, -10]} size={[15, 30, 15]} color="#262626" />
      <Building position={[-20, 8, 10]} size={[15, 16, 15]} color="#171717" />
      <Building position={[-20, 12, 30]} size={[15, 24, 15]} color="#262626" />
      <Building position={[-20, 10, 50]} size={[15, 20, 15]} color="#171717" />

      {/* Buildings - Right Side */}
      <Building position={[20, 12, -40]} size={[15, 24, 15]} color="#262626" />
      <Building position={[20, 10, -20]} size={[15, 20, 15]} color="#171717" />
      <Building position={[20, 15, 0]} size={[15, 30, 15]} color="#262626" />
      <Building position={[20, 8, 20]} size={[15, 16, 15]} color="#171717" />
      <Building position={[20, 12, 40]} size={[15, 24, 15]} color="#262626" />

      {/* Street Props */}
      {/* Trash Cans */}
      <TrashCan position={[-6, 0.6, -5]} />
      <TrashCan position={[-6.2, 0.6, -4]} />
      <TrashCan position={[6, 0.6, 15]} />

      {/* Parked Cars */}
      <Car position={[6, 0.5, 5]} color="#7f1d1d" />
      <Car position={[6, 0.5, -15]} color="#1e3a8a" />
      <Car position={[-6, 0.5, 25]} color="#14532d" />

      {/* Fences */}
      <Box args={[0.1, 1.5, 20]} position={[-5, 0.75, 15]} castShadow>
        <meshStandardMaterial color="#451a03" />
      </Box>
      <Box args={[0.1, 1.5, 20]} position={[5, 0.75, -25]} castShadow>
        <meshStandardMaterial color="#451a03" />
      </Box>

      {/* Alleyway Obstacles */}
      <AlleyObstacles position={[-8, 0, 0]} />
      <AlleyObstacles position={[8, 0, -30]} />

      {/* Fire Hydrants */}
      <FireHydrant position={[4, 0, -8]} />
      <FireHydrant position={[-4, 0, 12]} />

      {/* Street Lights */}
      {[...Array(6)].map((_, i) => (
        <StreetLight key={i} position={[-5, 0, -50 + i * 25]} />
      ))}
      {[...Array(6)].map((_, i) => (
        <StreetLight key={i} position={[5, 0, -37 + i * 25]} rotation={[0, Math.PI, 0]} />
      ))}

      {/* Trees */}
      {[...Array(4)].map((_, i) => (
        <Tree key={i} position={[-8, 0, -40 + i * 30]} />
      ))}
      {[...Array(4)].map((_, i) => (
        <Tree key={i} position={[8, 0, -20 + i * 30]} />
      ))}
    </group>
  );
}

function Tree({ position }: any) {
  return (
    <group position={position}>
      <Cylinder args={[0.2, 0.3, 2]} position={[0, 1, 0]} castShadow>
        <meshStandardMaterial color="#451a03" />
      </Cylinder>
      <Sphere args={[1, 12, 12]} position={[0, 2.5, 0]} castShadow>
        <meshStandardMaterial color="#14532d" />
      </Sphere>
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

function TrashCan({ position }: any) {
  return (
    <Cylinder args={[0.4, 0.4, 1]} position={position} castShadow>
      <meshStandardMaterial color="#525252" metalness={0.5} roughness={0.2} />
    </Cylinder>
  );
}

function Car({ position, color }: any) {
  return (
    <group position={position}>
      <Box args={[2, 1.2, 4]} castShadow>
        <meshStandardMaterial color={color} />
      </Box>
      <Box args={[1.8, 0.8, 2]} position={[0, 0.8, -0.2]} castShadow>
        <meshStandardMaterial color="#1e293b" />
      </Box>
    </group>
  );
}

function AlleyObstacles({ position }: any) {
  return (
    <group position={position}>
      <Box args={[1, 1, 1]} position={[0, 0.5, 2]} castShadow>
        <meshStandardMaterial color="#78350f" />
      </Box>
      <Box args={[1.2, 0.8, 1.2]} position={[0.2, 0.4, 3.5]} castShadow>
        <meshStandardMaterial color="#78350f" />
      </Box>
      <Box args={[0.8, 1.2, 0.8]} position={[-0.2, 0.6, 5]} castShadow>
        <meshStandardMaterial color="#78350f" />
      </Box>
    </group>
  );
}

function FireHydrant({ position }: any) {
  return (
    <group position={position}>
      <Cylinder args={[0.2, 0.2, 0.8]} position={[0, 0.4, 0]} castShadow>
        <meshStandardMaterial color="#991b1b" />
      </Cylinder>
      <Sphere args={[0.22, 16, 16]} position={[0, 0.8, 0]} castShadow>
        <meshStandardMaterial color="#991b1b" />
      </Sphere>
    </group>
  );
}

function StreetLight({ position, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} rotation={rotation}>
      <Cylinder args={[0.1, 0.1, 6]} position={[0, 3, 0]} castShadow>
        <meshStandardMaterial color="#171717" />
      </Cylinder>
      <Box args={[0.5, 0.2, 1]} position={[0, 6, 0.5]}>
        <meshStandardMaterial color="#171717" />
        <pointLight intensity={5} distance={10} color="#fef3c7" />
      </Box>
    </group>
  );
}
