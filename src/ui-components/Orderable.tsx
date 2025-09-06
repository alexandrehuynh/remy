import React, { useState, useRef } from 'react';
import { BurgerIcon } from '../lib/ui-constants';

interface OrderableProps {
  children: React.ReactNode;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  index?: number;
  disabled?: boolean;
}

export const Orderable: React.FC<OrderableProps> = ({
  children,
  onReorder,
  index = 0,
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  const handleBurgerStart = (clientX: number, clientY: number) => {
    if (disabled) return;
    setIsDragging(true);
    startPosRef.current = { x: clientX, y: clientY };
  };

  const handleBurgerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startPosRef.current.x;
    const deltaY = clientY - startPosRef.current.y;
    
    // Only allow vertical dragging
    setDragOffset({ x: 0, y: deltaY });
  };

  const handleBurgerEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    
    // Here you would calculate the new index based on the drag position
    // and call onReorder if needed
  };

  const handleBurgerMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleBurgerStart(e.clientX, e.clientY);
  };

  const handleBurgerTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleBurgerStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleBurgerMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      handleBurgerEnd();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleBurgerMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
      handleBurgerEnd();
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={elementRef}
      className="relative flex items-center"
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        zIndex: isDragging ? 50 : 1
      }}
    >
      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Burger Icon */}
      <div
        className="flex items-center justify-center p-3 cursor-grab active:cursor-grabbing"
        onMouseDown={handleBurgerMouseDown}
        onTouchStart={handleBurgerTouchStart}
        style={{ touchAction: 'none' }}
      >
        <BurgerIcon className="w-6 h-6 text-gray-400" />
      </div>
    </div>
  );
};