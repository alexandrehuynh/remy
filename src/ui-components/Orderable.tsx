import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { BurgerIcon } from '../lib/ui-constants';

interface OrderableItemProps {
  item: any;
  children: React.ReactNode;
  isDragDisabled?: boolean;
}

export const OrderableItem: React.FC<OrderableItemProps> = ({
  item,
  children,
  isDragDisabled = false
}) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item 
      value={item} 
      dragListener={false}
      dragControls={dragControls}
      className="relative"
    >
      <div className="flex items-center">
        {/* Content */}
        <div className="flex-1">{children}</div>

        {/* Burger Icon - only this should trigger drag */}
        <div
          className="flex items-center justify-center p-3 cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none' }}
          onPointerDown={(e) => {
            if (!isDragDisabled) {
              e.preventDefault();
              dragControls.start(e);
            }
          }}
        >
          <BurgerIcon className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </Reorder.Item>
  );
};

interface OrderableListProps {
  items: any[];
  onReorder: (newItems: any[]) => void;
  children: (item: any, index: number) => React.ReactNode;
  isDragDisabled?: boolean;
}

export const OrderableList: React.FC<OrderableListProps> = ({
  items,
  onReorder,
  children,
  isDragDisabled = false
}) => {
  return (
    <Reorder.Group 
      axis="y" 
      values={items} 
      onReorder={onReorder}
      className="space-y-0"
    >
      {items.map((item, index) => (
        <OrderableItem 
          key={item.id || index} 
          item={item}
          isDragDisabled={isDragDisabled}
        >
          {children(item, index)}
        </OrderableItem>
      ))}
    </Reorder.Group>
  );
};