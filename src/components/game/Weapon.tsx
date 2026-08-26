import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

export default function Weapon() {
  const isPlaying = useStore((state) => state.gameState.isPlaying);
  const weaponRef = useRef<THREE.Group>(null);
  
  // Basic recoil animation state
  const recoilOffset = useRef(0);

  // Listen to shoot event to trigger recoil
  React.useEffect(() => {
    const handleShoot = () => {
      recoilOffset.current = 0.2; // Move gun back
    };
    
    // We can listen to mousedown, but we need pointer lock check
    const onMouseDown = (event: MouseEvent) => {
      if (document.pointerLockElement === document.body && event.button === 0 && isPlaying) {
        handleShoot();
      }
    };
    
    // Listen to gamepad triggers for recoil as well - handled via polling usually, 
    // but for simplicity we can let the frame loop handle gamepad recoil or just rely on the mouse one for now if gamepad is hard to tap into events.
    // Let's add a global 'shoot' event that Player.tsx can fire.

    const onGlobalShoot = () => handleShoot();
    
    document.addEventListener('mousedown', onMouseDown);
    window.addEventListener('playerShoot', onGlobalShoot);
    
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('playerShoot', onGlobalShoot);
    };
  }, [isPlaying]);

  useFrame((state, delta) => {
    if (weaponRef.current) {
      // Recover from recoil
      if (recoilOffset.current > 0) {
        recoilOffset.current = Math.max(0, recoilOffset.current - delta * 2);
      }
      
      // Base position + recoil offset + sway
      const swayX = Math.sin(state.clock.elapsedTime * 2) * 0.01;
      const swayY = Math.cos(state.clock.elapsedTime * 2) * 0.01;
      
      weaponRef.current.position.set(0.4 + swayX, -0.3 + swayY, -0.8 + recoilOffset.current);
    }
  });

  return (
    <group ref={weaponRef}>
      {/* Gun Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.15, 0.5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Barrel */}
      <mesh position={[0, 0.02, -0.3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Sight */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.02, 0.04, 0.04]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}
