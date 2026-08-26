import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';
import Weapon from './Weapon';

export default function Player() {
  const { camera, scene } = useThree();
  const isPlaying = useStore((state) => state.gameState.isPlaying);
  const settings = useStore((state) => state.settings);
  const registerMiss = useStore((state) => state.registerMiss);
  const registerHit = useStore((state) => state.registerHit);

  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const raycaster = useRef(new THREE.Raycaster());
  const weaponGroupRef = useRef<THREE.Group>(null);

  // Input state
  const gamepadIndex = useRef<number | null>(null);
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.fov = settings.fov;
    camera.updateProjectionMatrix();
  }, [settings.fov, camera]);

  useEffect(() => {
    // Check already connected gamepads
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (let i = 0; i < pads.length; i++) {
      if (pads[i] && pads[i]?.connected) {
        gamepadIndex.current = pads[i]!.index;
        useStore.getState().setControllerName(pads[i]!.id);
        break;
      }
    }

    const handleGamepadConnected = (e: GamepadEvent) => {
      gamepadIndex.current = e.gamepad.index;
      useStore.getState().setControllerName(e.gamepad.id);
      useStore.getState().setInputMode('controller');
      console.log('Gamepad connected', e.gamepad.id);
    };
    const handleGamepadDisconnected = (e: GamepadEvent) => {
      if (gamepadIndex.current === e.gamepad.index) {
        gamepadIndex.current = null;
        useStore.getState().setControllerName(null);
      }
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  // Keyboard Movement Event Listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { 
      keys.current[e.code] = true; 
      useStore.getState().setInputMode('keyboardMouse');
    };
    const onKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const shoot = (gamepad: Gamepad | null = null) => {
    window.dispatchEvent(new CustomEvent('playerShoot'));
    
    // Controller vibration
    if (gamepad && (gamepad as any).vibrationActuator) {
      try {
        (gamepad as any).vibrationActuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: 100,
          weakMagnitude: 0.5,
          strongMagnitude: 0.8
        });
      } catch (e) {
        console.error("Vibration failed", e);
      }
    }
    
    raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera);
    const intersects = raycaster.current.intersectObjects(scene.children, true);
    
    const hit = intersects.find(i => i.object.userData?.isTarget);
    
    if (hit && hit.object.userData) {
      // Dispatch hit event
      const event = new CustomEvent('targetHit', { 
        detail: { 
          id: hit.object.userData.id,
          spawnTime: hit.object.userData.spawnTime 
        } 
      });
      window.dispatchEvent(event);
    } else {
      registerMiss();
    }
  };

  useEffect(() => {
    if (!isPlaying) return;

    const onMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement === document.body) {
        useStore.getState().setInputMode('keyboardMouse');
        // Simple sensitivity calculation
        const factor = 0.002 * (settings.mouseSens / 5.0) * (800 / settings.dpi);
        
        euler.current.y -= event.movementX * factor;
        euler.current.x -= event.movementY * factor;

        // Clamp vertical look
        euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      if (document.pointerLockElement !== document.body) return;
      if (event.button !== 0) return; // Only left click
      useStore.getState().setInputMode('keyboardMouse');
      shoot(null);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [isPlaying, settings.mouseSens, settings.dpi]);

  // Handle Gamepad shooting state
  const lastTriggerPressed = useRef(false);

  useFrame((state, delta) => {
    if (!isPlaying) return;

    let gamepad: Gamepad | null = null;
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (let i = 0; i < pads.length; i++) {
      if (pads[i] && pads[i]?.connected) {
        gamepad = pads[i];
        break;
      }
    }
    
    // Auto-detect newly pressed gamepad buttons to switch mode
    if (gamepad) {
       const isControllerActive = gamepad.buttons.some(b => b.pressed || b.value > 0.1) || gamepad.axes.some(a => Math.abs(a) > 0.1);
       if (isControllerActive && useStore.getState().inputMode !== 'controller') {
         useStore.getState().setInputMode('controller');
         useStore.getState().setControllerName(gamepad.id);
       }
    }

    const deadzone = settings.controller.deadzone;
    
    // Player Movement (Keyboard + Left Stick)
    const moveSpeed = 12.0 * delta;
    const moveDir = new THREE.Vector3();

    // Keyboard (WASD)
    if (keys.current['KeyW']) moveDir.z -= 1;
    if (keys.current['KeyS']) moveDir.z += 1;
    if (keys.current['KeyA']) moveDir.x -= 1;
    if (keys.current['KeyD']) moveDir.x += 1;

    // Gamepad Left Stick (Axes 0 and 1) + D-pad
    if (gamepad) {
      let lx = gamepad.axes[0] || 0;
      let ly = gamepad.axes[1] || 0;
      
      const axis9 = gamepad.axes[9] !== undefined ? gamepad.axes[9] : 0;
      const dPadUp = gamepad.buttons[12]?.pressed || (axis9 > -1.1 && axis9 < -0.9) || (axis9 > 0.9 && axis9 < 1.1);
      const dPadDown = gamepad.buttons[13]?.pressed || (axis9 > 0.1 && axis9 < 0.3);
      const dPadLeft = gamepad.buttons[14]?.pressed || (axis9 > 0.6 && axis9 < 0.8);
      const dPadRight = gamepad.buttons[15]?.pressed || (axis9 > -0.5 && axis9 < -0.3);

      if (dPadUp) moveDir.z -= 1;
      if (dPadDown) moveDir.z += 1;
      if (dPadLeft) moveDir.x -= 1;
      if (dPadRight) moveDir.x += 1;

      if (Math.abs(lx) > deadzone) {
        moveDir.x += Math.sign(lx) * ((Math.abs(lx) - deadzone) / (1 - deadzone));
      }
      if (Math.abs(ly) > deadzone) {
        moveDir.z += Math.sign(ly) * ((Math.abs(ly) - deadzone) / (1 - deadzone));
      }
    }

    // Apply Movement
    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
      moveDir.applyEuler(new THREE.Euler(0, euler.current.y, 0)); // Move relative to camera yaw
      camera.position.addScaledVector(moveDir, moveSpeed);
      
      // Clamp to room bounds to prevent walking through walls
      camera.position.x = Math.max(-28, Math.min(28, camera.position.x));
      camera.position.z = Math.max(-10, Math.min(28, camera.position.z)); // Restrict walking into target spawn area
    }


    // Camera Rotation (Right Stick) & Shooting (Triggers/Shoulders)
    if (gamepad) {
      // Right stick (usually axes 2 and 3)
      let rx = gamepad.axes[2] || 0;
      let ry = gamepad.axes[3] || 0;

      // Apply deadzone visually
      if (Math.abs(rx) < deadzone) rx = 0;
      if (Math.abs(ry) < deadzone) ry = 0;

      if (rx !== 0 || ry !== 0) {
        // Normalize stick input after deadzone so that movement starts smoothly from 0
        rx = rx !== 0 ? (Math.abs(rx) - deadzone) / (1 - deadzone) * Math.sign(rx) : 0;
        ry = ry !== 0 ? (Math.abs(ry) - deadzone) / (1 - deadzone) * Math.sign(ry) : 0;

        // Apply response curve (e.g. exponential)
        const applyCurve = (val: number) => {
          if (settings.controller.responseCurve === 'exponential') {
             return Math.sign(val) * Math.pow(Math.abs(val), 2);
          }
          if (settings.controller.responseCurve === 'dynamic') {
             return Math.sign(val) * Math.pow(Math.abs(val), 1.5);
          }
          return val;
        };

        rx = applyCurve(rx);
        ry = applyCurve(ry);

        const hSens = settings.controller.horizontalSens;
        const vSens = settings.controller.verticalSens;

        // Base factor: scales stick input to radians per frame
        let baseSpeed = 2.0 * delta;

        // --- Aim Assist Simulation ---
        let slowdownMultiplier = 1.0;

        if (settings.aimAssist.mode !== 'OFF') {
           raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera);
           const intersects = raycaster.current.intersectObjects(scene.children, true);
           const hit = intersects.find(i => i.object.userData?.isTarget);
           
           if (hit) {
              slowdownMultiplier = 1.0 - (settings.aimAssist.slowdown * (settings.aimAssist.strength / 100));
           }
        }

        // Apply all inputs and multipliers to the camera's euler rotation
        euler.current.y -= rx * baseSpeed * hSens * slowdownMultiplier;
        euler.current.x -= ry * baseSpeed * vSens * slowdownMultiplier;

        // Clamp vertical look
        euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
      }

      // Shooting logic: RT (7), RB (5), A/Cross (0), B/Circle (1), X/Square (2)
      const isShooting = 
        (gamepad.buttons[7] && (gamepad.buttons[7].pressed || gamepad.buttons[7].value > 0.5)) ||
        (gamepad.buttons[5] && gamepad.buttons[5].pressed) ||
        (gamepad.buttons[0] && gamepad.buttons[0].pressed) || 
        (gamepad.buttons[1] && gamepad.buttons[1].pressed) || 
        (gamepad.buttons[2] && gamepad.buttons[2].pressed); // Fallback for weird mappings

      if (isShooting) {
         if (!lastTriggerPressed.current) {
             shoot(gamepad); 
             lastTriggerPressed.current = true;
         }
      } else {
         lastTriggerPressed.current = false;
      }

      // Pause / Back to menu (Start/Menu/Back)
      const isPausing = 
        (gamepad.buttons[9] && gamepad.buttons[9].pressed) || // Start
        (gamepad.buttons[8] && gamepad.buttons[8].pressed); // Select
      
      if (isPausing) {
        useStore.getState().endGame();
      }
    }

    camera.quaternion.setFromEuler(euler.current);
    
    if (weaponGroupRef.current) {
      weaponGroupRef.current.position.copy(camera.position);
      weaponGroupRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group ref={weaponGroupRef}>
      {isPlaying && <Weapon />}
    </group>
  );
}
