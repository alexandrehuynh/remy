import React, { useState, useRef, useEffect } from 'react';

interface SliderProps {
  children: React.ReactNode;
  bgColor1?: string;
  bgColor2?: string;
  percentageLeft?: number;
  percentageRight?: number;
  onPress1?: () => void;
  onPress2?: () => void;
  icon1?: React.ComponentType<{ className?: string }>;
  icon2?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  children,
  bgColor1,
  bgColor2,
  percentageLeft,
  percentageRight,
  onPress1,
  onPress2,
  icon1: Icon1,
  icon2: Icon2,
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [hasTriggeredLeft, setHasTriggeredLeft] = useState(false);
  const [hasTriggeredRight, setHasTriggeredRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  const handleStart = (clientX: number) => {
    if (disabled) return;
    setIsDragging(true);
    startXRef.current = clientX;
    setHasTriggeredLeft(false);
    setHasTriggeredRight(false);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = clientX - startXRef.current;
    const percentage = (deltaX / containerWidth) * 100;

    // Constrain movement based on provided percentages
    let constrainedPercentage = percentage;
    
    if (percentage < 0 && percentageLeft) {
      constrainedPercentage = Math.max(percentage, -percentageLeft);
    } else if (percentage < 0 && !percentageLeft) {
      constrainedPercentage = 0;
    }
    
    if (percentage > 0 && percentageRight) {
      constrainedPercentage = Math.min(percentage, percentageRight);
    } else if (percentage > 0 && !percentageRight) {
      constrainedPercentage = 0;
    }

    setDragPosition(constrainedPercentage);

    // Check for trigger points
    if (percentageLeft && constrainedPercentage <= -percentageLeft && !hasTriggeredLeft) {
      setHasTriggeredLeft(true);
      onPress1?.();
    }
    
    if (percentageRight && constrainedPercentage >= percentageRight && !hasTriggeredRight) {
      setHasTriggeredRight(true);
      onPress2?.();
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragPosition(0);
    setHasTriggeredLeft(false);
    setHasTriggeredRight(false);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  useEffect(() => {
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
      ref={containerRef}
      className="relative overflow-hidden"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        transform: `translateX(${dragPosition}%)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {/* Left background */}
      {bgColor1 && percentageLeft && (
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-start pl-4"
          style={{
            backgroundColor: bgColor1,
            width: `${percentageLeft}%`,
            transform: 'translateX(-100%)'
          }}
        >
          {Icon1 && <Icon1 className="w-6 h-6 text-white" />}
        </div>
      )}

      {/* Right background */}
      {bgColor2 && percentageRight && (
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-end pr-4"
          style={{
            backgroundColor: bgColor2,
            width: `${percentageRight}%`,
            transform: 'translateX(100%)'
          }}
        >
          {Icon2 && <Icon2 className="w-6 h-6 text-white" />}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 bg-white">
        {children}
      </div>
    </div>
  );
};