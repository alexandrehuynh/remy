import React, { useState } from 'react';
import { Reorder } from 'framer-motion';
import { BurgerIcon } from '../lib/ui-constants';

interface OrderableProps {
  children: React.ReactNode;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  index?: number;
  disabled?: boolean;
  isDragDisabled?: boolean;
}

export const Orderable: React.FC<OrderableProps> = ({
  children,
  onReorder,
  index = 0,
  disabled = false,
  isDragDisabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleBurgerMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!disabled && !isDragDisabled) {
      setIsDragging(true);
    }
  };

  const handleBurgerTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!disabled && !isDragDisabled) {
      setIsDragging(true);
    }
  };

  return (
    <Reorder.Item
      value={index}
      onDragEnd={() => setIsDragging(false)}
      dragListener={false}
      dragControls={undefined}
      className="relative flex items-center"
      style={{
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
    </Reorder.Item>
  );
};

interface OrderableListProps {
  children: React.ReactNode[];
  onReorder?: (newOrder: number[]) => void;
  disabled?: boolean;
}

export const OrderableList: React.FC<OrderableListProps> = ({
  children,
  onReorder,
  disabled = false
}) => {
  const [items, setItems] = useState(children.map((_, index) => index));

  const handleReorder = (newOrder: number[]) => {
    setItems(newOrder);
    onReorder?.(newOrder);
  };

  return (
    <Reorder.Group 
      axis="y" 
      values={items} 
      onReorder={handleReorder}
      className="space-y-0"
    >
      {items.map((itemIndex) => (
        <Orderable 
          key={itemIndex} 
          index={itemIndex} 
          disabled={disabled}
        >
          {children[itemIndex]}
        </Orderable>
      ))}
    </Reorder.Group>
  );
};