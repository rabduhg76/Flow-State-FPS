import { useEffect, useRef } from 'react';

export function useGamepadMenu(isActive: boolean) {
  const lastState = useRef({
    up: false, down: false, left: false, right: false, click: false
  });
  
  const lastMoveTime = useRef(0);

  useEffect(() => {
    if (!isActive) return;
    
    let requestRef: number;
    
    const pollGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      let gp: Gamepad | null = null;
      for (const pad of gamepads) {
        if (pad && pad.connected) {
          gp = pad;
          break;
        }
      }
      
      if (gp) {
        const threshold = 0.5;
        
        // Map D-pad and Left Stick
        // gp.axes[9] is sometimes used for D-pad on generic/switch controllers
        const axis9 = gp.axes[9] !== undefined ? gp.axes[9] : 0;
        
        // Approximate values for D-Pad on axis 9 (varies by browser/OS, but usually maps to standard fractions)
        const dPadAxisUp = axis9 > -1.1 && axis9 < -0.9 || axis9 > 0.9 && axis9 < 1.1;
        const dPadAxisDown = axis9 > 0.1 && axis9 < 0.3;
        const dPadAxisLeft = axis9 > 0.6 && axis9 < 0.8;
        const dPadAxisRight = axis9 > -0.5 && axis9 < -0.3;

        const up = gp.buttons[12]?.pressed || (gp.axes[1] && gp.axes[1] < -threshold) || dPadAxisUp;
        const down = gp.buttons[13]?.pressed || (gp.axes[1] && gp.axes[1] > threshold) || dPadAxisDown;
        const left = gp.buttons[14]?.pressed || (gp.axes[0] && gp.axes[0] < -threshold) || dPadAxisLeft;
        const right = gp.buttons[15]?.pressed || (gp.axes[0] && gp.axes[0] > threshold) || dPadAxisRight;
        
        // Map Accept (Check all face buttons to be safe for any controller layout)
        const click = gp.buttons[0]?.pressed || gp.buttons[1]?.pressed || gp.buttons[2]?.pressed || gp.buttons[3]?.pressed; 

        // Find all interactive elements currently visible
        const interactables = Array.from(document.querySelectorAll('button, input[type="range"], select'));
        const currentIndex = interactables.findIndex(b => b === document.activeElement);
        let nextIndex = currentIndex;

        const now = performance.now();
        const canMove = now - lastMoveTime.current > 200; // 200ms delay for stick holding

        // If nothing is focused, focus the first item on any directional input
        if (currentIndex === -1 && (up || down || left || right) && interactables.length > 0) {
           (interactables[0] as HTMLElement).focus();
           lastMoveTime.current = now;
        } 
        // Handle navigation
        else if (canMove) {
          if (down || right) {
            nextIndex = Math.min(currentIndex + 1, interactables.length - 1);
            if (nextIndex !== currentIndex) {
              (interactables[nextIndex] as HTMLElement).focus();
              lastMoveTime.current = now;
            }
          } else if (up || left) {
            nextIndex = Math.max(currentIndex - 1, 0);
            if (nextIndex !== currentIndex) {
              (interactables[nextIndex] as HTMLElement).focus();
              lastMoveTime.current = now;
            }
          }
        }

        // Handle click (require release between clicks)
        if (click && !lastState.current.click) {
           if (document.activeElement instanceof HTMLElement && document.activeElement.tagName === 'BUTTON') {
              document.activeElement.click();
           } else if (currentIndex === -1 && interactables.length > 0) {
              (interactables[0] as HTMLElement).focus();
           }
        }

        lastState.current = { up, down, left, right, click };
      }
      
      requestRef = requestAnimationFrame(pollGamepad);
    };
    
    requestRef = requestAnimationFrame(pollGamepad);
    return () => cancelAnimationFrame(requestRef);
  }, [isActive]);
}
