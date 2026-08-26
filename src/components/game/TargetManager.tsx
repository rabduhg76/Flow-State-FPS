import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore, TrainingMode } from '../../store/useStore';
import { Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

interface TargetData {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  size: number;
  spawnTime: number;
}

export default function TargetManager() {
  const isPlaying = useStore((state) => state.gameState.isPlaying);
  const mode = useStore((state) => state.trainingMode);
  const targetColor = useStore((state) => state.settings.targetColor);
  const registerHit = useStore((state) => state.registerHit);

  const [targets, setTargets] = useState<TargetData[]>([]);
  const targetRef = useRef<THREE.Group>(null);

  // Constants for spawning area
  const SPAWN_AREA = {
    x: { min: -15, max: 15 },
    y: { min: 2, max: 12 },
    z: { min: -25, max: -20 },
  };

  // --- Target Spawning Engine ---
  // Calculates randomized positions within a set bounding volume (SPAWN_AREA)
  // Assigns target size and velocity vectors based on the current active training mode.
  const spawnTarget = () => {
    const id = Math.random().toString(36).substring(7);
    
    // Determine random spawn coordinates
    const position = new THREE.Vector3(
      Math.random() * (SPAWN_AREA.x.max - SPAWN_AREA.x.min) + SPAWN_AREA.x.min,
      Math.random() * (SPAWN_AREA.y.max - SPAWN_AREA.y.min) + SPAWN_AREA.y.min,
      Math.random() * (SPAWN_AREA.z.max - SPAWN_AREA.z.min) + SPAWN_AREA.z.min
    );
    
    let velocity = new THREE.Vector3();
    let size = 1.0;

    // Apply mode-specific modifiers
    if (mode === 'flick') {
      size = Math.random() * 0.5 + 0.5; // Random size variation (0.5 to 1.0)
    } else if (mode === 'tracking' || mode === 'daily') {
      const speed = Math.random() * 5 + 5; // Random speed
      // Generate a random vector along the X and Y axes
      velocity.set((Math.random() > 0.5 ? 1 : -1) * speed, (Math.random() - 0.5) * speed, 0);
      size = 0.8; // Uniform smaller size for tracking
    } else if (mode === 'switching') {
      size = 0.7; // Smaller static targets for dense clusters
    } else if (mode === 'reaction') {
      size = 1.2; // Large, easy-to-hit target for pure reaction timing
    }

    return { id, position, velocity, size, spawnTime: performance.now() };
  };

  // Initial spawn
  useEffect(() => {
    if (!isPlaying) {
      setTargets([]);
      return;
    }

    let initialCount = 1;
    if (mode === 'flick') initialCount = 3;
    if (mode === 'tracking' || mode === 'daily') initialCount = 1;
    if (mode === 'switching') initialCount = 4;
    if (mode === 'reaction') initialCount = 0; // Handled specially

    const newTargets = Array(initialCount).fill(0).map(() => spawnTarget());
    setTargets(newTargets);

    let timeout: NodeJS.Timeout;
    if (mode === 'reaction') {
      timeout = setTimeout(() => {
        if (useStore.getState().gameState.isPlaying) {
           setTargets([spawnTarget()]);
        }
      }, Math.random() * 2000 + 1000);
    }

    const handleTargetHitEvent = (e: any) => {
      const { id, spawnTime } = e.detail;
      handleHit(id, spawnTime);
    };

    window.addEventListener('targetHit', handleTargetHitEvent);

    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener('targetHit', handleTargetHitEvent);
    };
  }, [isPlaying, mode]);

  useFrame((state, delta) => {
    if (!isPlaying) return;

    if (mode === 'tracking' || mode === 'daily') {
      setTargets(prev => prev.map(t => {
        const newPos = t.position.clone().add(t.velocity.clone().multiplyScalar(delta));
        // Bounce off walls
        if (newPos.x > SPAWN_AREA.x.max || newPos.x < SPAWN_AREA.x.min) t.velocity.x *= -1;
        if (newPos.y > SPAWN_AREA.y.max || newPos.y < SPAWN_AREA.y.min) t.velocity.y *= -1;
        return { ...t, position: newPos };
      }));
    }
  });

  const handleHit = (id: string, spawnTime: number) => {
    if (!useStore.getState().gameState.isPlaying) return;

    const reactionTime = performance.now() - spawnTime;
    registerHit(reactionTime);

    setTargets(prev => prev.filter(t => t.id !== id));

    // Spawn new target based on mode
    setTimeout(() => {
        if (!useStore.getState().gameState.isPlaying) return;
        
        if (mode === 'flick' || mode === 'tracking' || mode === 'switching' || mode === 'daily') {
           setTargets(prev => [...prev, spawnTarget()]);
        } else if (mode === 'reaction') {
            setTimeout(() => {
                if (useStore.getState().gameState.isPlaying) {
                    setTargets([spawnTarget()]);
                }
            }, Math.random() * 2000 + 1000);
        }
    }, 0);
  };

  return (
    <group ref={targetRef}>
      {targets.map(target => (
        <Sphere 
          key={target.id}
          args={[target.size, 32, 32]}
          position={target.position}
          userData={{ isTarget: true, id: target.id, spawnTime: target.spawnTime }}
        >
          <meshStandardMaterial 
            color={targetColor} 
            emissive={targetColor} 
            emissiveIntensity={0.5} 
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      ))}
    </group>
  );
}
