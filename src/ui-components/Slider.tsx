import React, { useState, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';

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
  const [dragPosition, setDragPosition] = useState(0);
  const [hasTriggeredLeft, setHasTriggeredLeft] = useState(false);
  const [hasTriggeredRight, setHasTriggeredRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const maxLeftDrag = percentageLeft ? -(containerWidth * percentageLeft / 100) : 0;
    const maxRightDrag = percentageRight ? (containerWidth * percentageRight / 100) : 0;

    let newPosition = info.offset.x;

    // Constrain to allowed drag distances
    if (percentageLeft && newPosition < maxLeftDrag) {
      newPosition = maxLeftDrag;
    }
    if (percentageRight && newPosition > maxRightDrag) {
      newPosition = maxRightDrag;
    }
    if (!percentageLeft && newPosition < 0) {
      newPosition = 0;
    }
    if (!percentageRight && newPosition > 0) {
      newPosition = 0;
    }

    setDragPosition(newPosition);

    // Trigger actions when reaching maximum drag
    if (percentageLeft && newPosition <= maxLeftDrag && !hasTriggeredLeft) {
      setHasTriggeredLeft(true);
      onPress1?.();
    }
    if (percentageRight && newPosition >= maxRightDrag && !hasTriggeredRight) {
      setHasTriggeredRight(true);
      onPress2?.();
    }
  };

  const handleDragEnd = () => {
    setDragPosition(0);
    setHasTriggeredLeft(false);
    setHasTriggeredRight(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click when dragging
    if (Math.abs(dragPosition) > 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Left background */}
      {bgColor1 && percentageLeft && (
        <div 
          className="absolute left-0 top-0 h-full flex items-center justify-start pl-4"
          style={{ 
            backgroundColor: bgColor1,
            width: `${percentageLeft}%`,
            opacity: dragPosition < 0 ? Math.abs(dragPosition) / (containerRef.current?.offsetWidth || 1) * (100 / percentageLeft) : 0
          }}
        >
          {Icon1 && <Icon1 className="w-6 h-6 text-white" />}
        </div>
      )}
      
      {/* Right background */}
      {bgColor2 && percentageRight && (
        <div 
          className="absolute right-0 top-0 h-full flex items-center justify-end pr-4"
          style={{ 
            backgroundColor: bgColor2,
            width: `${percentageRight}%`,
            opacity: dragPosition > 0 ? dragPosition / (containerRef.current?.offsetWidth || 1) * (100 / percentageRight) : 0
          }}
        >
          {Icon2 && <Icon2 className="w-6 h-6 text-white" />}
        </div>
      )}

      {/* Draggable content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        animate={{ x: dragPosition }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};