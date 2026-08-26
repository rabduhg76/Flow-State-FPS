import React from 'react';
import { Box, Plane, Grid } from '@react-three/drei';

export default function Environment() {
  return (
    <group>
      {/* Floor */}
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.2} />
      </Plane>
      
      {/* Floor Grid for scale reference */}
      <Grid 
        args={[100, 100]} 
        cellSize={1} 
        cellThickness={1} 
        cellColor="#1e293b" 
        sectionSize={10} 
        sectionThickness={1.5} 
        sectionColor="#0ea5e9" 
        fadeDistance={50} 
        fadeStrength={1} 
      />

      {/* Walls */}
      {/* Front Wall (Targets spawn here) */}
      <Box args={[60, 20, 2]} position={[0, 10, -30]} receiveShadow>
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </Box>
      <Box args={[60, 2, 2]} position={[0, 21, -30]}>
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} />
      </Box>

      {/* Left Wall */}
      <Box args={[2, 20, 60]} position={[-30, 10, 0]} receiveShadow>
        <meshStandardMaterial color="#0f172a" />
      </Box>
      
      {/* Right Wall */}
      <Box args={[2, 20, 60]} position={[30, 10, 0]} receiveShadow>
        <meshStandardMaterial color="#0f172a" />
      </Box>

      {/* Back Wall */}
      <Box args={[60, 20, 2]} position={[0, 10, 30]} receiveShadow>
        <meshStandardMaterial color="#0f172a" />
      </Box>

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
      />
      <pointLight position={[0, 15, -15]} intensity={1.5} color="#0ea5e9" distance={40} />
      <pointLight position={[0, 15, 15]} intensity={0.5} color="#38bdf8" />
    </group>
  );
}
