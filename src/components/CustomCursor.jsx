import React, { useState, useEffect } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, []);

  return (
    <>
      <div 
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full mix-blend-screen transition-transform duration-100"
        style={{
          width: isHovering ? '40px' : '20px',
          height: isHovering ? '40px' : '20px',
          backgroundColor: isHovering ? 'hsla(135, 25%, 55%, 0.1)' : 'transparent',
          border: '1px solid hsla(135, 25%, 55%, 0.8)',
          transform: `translate(${position.x - (isHovering ? 20 : 10)}px, ${position.y - (isHovering ? 20 : 10)}px)`,
        }}
      ></div>
      <div 
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-2 h-2 bg-primary rounded-full mix-blend-screen transition-transform duration-75"
        style={{
          backgroundColor: 'var(--primary)',
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          boxShadow: '0 0 10px 2px var(--primary-glow)'
        }}
      ></div>
    </>
  );
}
