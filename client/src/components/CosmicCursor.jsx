import React, { useEffect, useState, useRef } from 'react';

export default function CosmicCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [enabled, setEnabled] = useState(true);

  const requestRef = useRef();

  useEffect(() => {
    // Check if touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setEnabled(false);
      return;
    }

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if hovering interactive elements
      const target = e.target;
      const isInteractive = target.closest('a, button, input, textarea, select, .glass-card, [role="button"], .clickable');
      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Smooth trailing ring lerp
    let curX = -100;
    let curY = -100;

    const animateTrail = () => {
      curX += (position.x - curX) * 0.18;
      curY += (position.y - curY) * 0.18;
      setTrail({ x: curX, y: curY });
      requestRef.current = requestAnimationFrame(animateTrail);
    };

    requestRef.current = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, [position.x, position.y]);

  if (!enabled) return null;

  return (
    <>
      {/* Center pinpoint */}
      <div
        className="cosmic-cursor-dot"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isClicked ? 0.6 : isHovered ? 1.5 : 1})`,
          backgroundColor: isHovered ? 'var(--solar-magenta)' : 'var(--starlight-cyan)',
          boxShadow: isHovered
            ? '0 0 15px var(--solar-magenta)'
            : '0 0 12px var(--starlight-cyan)'
        }}
      />

      {/* Lagging celestial ring */}
      <div
        className="cosmic-cursor-ring"
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
          width: isHovered ? '48px' : isClicked ? '24px' : '34px',
          height: isHovered ? '48px' : isClicked ? '24px' : '34px',
          borderColor: isHovered ? 'rgba(247, 37, 133, 0.7)' : 'rgba(0, 240, 255, 0.6)',
          backgroundColor: isHovered ? 'rgba(247, 37, 133, 0.08)' : 'rgba(0, 240, 255, 0.03)'
        }}
      />
    </>
  );
}
