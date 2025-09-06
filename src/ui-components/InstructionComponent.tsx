import React, { useState } from 'react';
import { Instruction, EllipsisIcon, CheckIcon, XIcon } from '../lib/ui-constants';
import { Slider } from './Slider';
import { Orderable } from './Orderable';

interface InstructionComponentProps {
  instruction: Instruction;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkDone?: (done: boolean) => void;
  isSliderEnabled?: boolean;
  isOrderable?: boolean;
  showOptions?: boolean;
}

export const InstructionComponent: React.FC<InstructionComponentProps> = ({
  instruction,
  onEdit,
  onDelete,
  onMarkDone,
  isSliderEnabled = false,
  isOrderable = false,
  showOptions = true
}) => {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const handleMarkDone = () => {
    onMarkDone?.(true);
    setShowOptionsMenu(false);
  };

  const handleMarkUndone = () => {
    onMarkDone?.(false);
    setShowOptionsMenu(false);
  };

  const content = (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center flex-1">
        <div 
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold mr-4 ${
            instruction.markedDone 
              ? 'bg-green-500 text-white border-green-500' 
              : 'bg-white text-gray-800 border-gray-300'
          }`}
        >
          {instruction.order}
        </div>
        <div className={`flex-1 ${instruction.markedDone ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {instruction.instruction}
        </div>
      </div>
      
      {showOptions && (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowOptionsMenu(!showOptionsMenu);
            }}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <EllipsisIcon className="w-5 h-5 text-gray-500" />
          </button>
          
          {showOptionsMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] min-w-[120px]">
              <button
                onClick={() => {
                  onEdit?.();
                  setShowOptionsMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete?.();
                  setShowOptionsMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
              >
                Delete
              </button>
              <button
                onClick={handleMarkDone}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Mark Done
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  let wrappedContent = content;

  if (isSliderEnabled) {
    wrappedContent = (
      <Slider
        bgColor1="rgb(34, 197, 94)"
        bgColor2="rgb(239, 68, 68)"
        percentageLeft={20}
        percentageRight={20}
        onPress1={handleMarkDone}
        onPress2={handleMarkUndone}
        icon1={CheckIcon}
        icon2={XIcon}
      >
        {content}
      </Slider>
    );
  }

  if (isOrderable) {
    wrappedContent = (
      <Orderable>
        {wrappedContent}
      </Orderable>
    );
  }

  return wrappedContent;
};