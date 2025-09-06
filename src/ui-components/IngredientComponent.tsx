import React, { useState } from 'react';
import { EllipsisIcon, CheckIcon } from '../lib/ui-constants';
import { Edit, Trash2 } from 'lucide-react';
import { Ingredient } from '../lib/ui-constants';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { BurgerIcon } from '../lib/ui-constants';

interface IngredientComponentProps {
  ingredient: Ingredient;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkDone?: () => void;
  isSliderEnabled?: boolean;
  isOrderable?: boolean;
  showOptions?: boolean;
}

export const IngredientComponent: React.FC<IngredientComponentProps> = ({
  ingredient,
  onEdit,
  onDelete,
  onMarkDone,
  isSliderEnabled = false,
  isOrderable = false,
  showOptions = true
}) => {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [hasTriggeredLeft, setHasTriggeredLeft] = useState(false);
  const [hasTriggeredRight, setHasTriggeredRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useDragControls();

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptionsMenu(!showOptionsMenu);
  };

  const handleEdit = () => {
    onEdit?.();
    setShowOptionsMenu(false);
  };

  const handleDelete = () => {
    onDelete?.();
    setShowOptionsMenu(false);
  };

  const handleMarkDone = () => {
    onMarkDone?.();
    setShowOptionsMenu(false);
  };

  const handleContentClick = () => {
    if (!isDragging && Math.abs(dragPosition) < 5) {
      onEdit?.();
    }
  };

  const handleDrag = (event: any, info: any) => {
    if (!isSliderEnabled) return;
    
    const containerWidth = 300; // Approximate container width
    const maxLeftDrag = -(containerWidth * 30 / 100);
    const maxRightDrag = (containerWidth * 30 / 100);

    let newPosition = info.offset.x;

    if (newPosition < maxLeftDrag) newPosition = maxLeftDrag;
    if (newPosition > maxRightDrag) newPosition = maxRightDrag;
    if (newPosition > 0 && newPosition < 0) newPosition = 0;

    setDragPosition(newPosition);

    // Only trigger actions when reaching exact maximum drag distance
    if (Math.abs(newPosition - maxLeftDrag) < 5 && !hasTriggeredLeft) {
      setHasTriggeredLeft(true);
      onDelete?.();
    }
    if (Math.abs(newPosition - maxRightDrag) < 5 && !hasTriggeredRight) {
      setHasTriggeredRight(true);
      onMarkDone?.();
    }
  };

  const handleDragEnd = () => {
    setDragPosition(0);
    setHasTriggeredLeft(false);
    setHasTriggeredRight(false);
    setIsDragging(false);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const renderContent = () => (
    <div className="relative overflow-hidden">
      {/* Left background */}
      {isSliderEnabled && (
        <div 
          className="absolute left-0 top-0 h-full flex items-center justify-start pl-4"
          style={{ 
            backgroundColor: "#ef4444",
            width: "30%",
            opacity: dragPosition < 0 ? Math.abs(dragPosition) / 90 : 0
          }}
        >
          <Trash2 className="w-6 h-6 text-white" />
        </div>
      )}
      
      {/* Right background */}
      {isSliderEnabled && (
        <div 
          className="absolute right-0 top-0 h-full flex items-center justify-end pr-4"
          style={{ 
            backgroundColor: "#10b981",
            width: "30%",
            opacity: dragPosition > 0 ? dragPosition / 90 : 0
          }}
        >
          <CheckIcon className="w-6 h-6 text-white" />
        </div>
      )}

      <motion.div
        drag={isSliderEnabled ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        animate={{ x: dragPosition }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="relative z-10"
        onClick={handleContentClick}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <div className="flex-1">
            <div className={`font-medium ${ingredient.markedDone ? 'line-through text-gray-400' : ''}`}>
              {ingredient.name}
            </div>
            <div className="text-sm text-gray-500">{ingredient.amount}</div>
          </div>
          
          {isOrderable && (
            <div
              className="flex items-center justify-center p-3 cursor-grab active:cursor-grabbing"
              style={{ touchAction: 'none' }}
              onPointerDown={(e) => {
                e.preventDefault();
                dragControls.start(e);
              }}
            >
              <BurgerIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
          
          {showOptions && !isOrderable && (
            <div className="relative">
              <button
                onClick={handleOptionsClick}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <EllipsisIcon className="w-5 h-5" />
              </button>
            </div>
          )}
          
        </div>
      </motion.div>
      
      {showOptionsMenu && (
        <div className="fixed bg-white border rounded-lg shadow-lg py-1 min-w-[120px] z-[9999]"
             style={{ 
               position: 'fixed',
               top: '50%', 
               right: '60px',
               transform: 'translateY(-50%)',
               boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
             }}>
          <button
            onClick={handleEdit}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={handleMarkDone}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <CheckIcon className="w-4 h-4" />
            {ingredient.markedDone ? 'Mark Undone' : 'Mark Done'}
          </button>
        </div>
      )}
    </div>
  );

  if (isOrderable) {
    return (
      <Reorder.Item 
        value={ingredient} 
        dragListener={false}
        dragControls={dragControls}
        className="relative"
      >
        {renderContent()}
      </Reorder.Item>
    );
  }

  return renderContent();
};