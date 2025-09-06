import React from 'react';
import { createOptions, XIcon } from '../lib/ui-constants';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
  const handleOptionClick = (option: any) => {
    console.log('Selected option:', option.primaryText);
    // Stub onClick for each option
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[9999]">
      <div className="bg-white rounded-t-lg w-full max-w-md">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Create Recipe</h2>
            <button onClick={onClose} className="p-1">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-1">
            {createOptions.map((option, index) => {
              const Icon = option.icon;
              const isFirst = index === 0;
              const isLast = index === createOptions.length - 1;
              
              return (
                <button
                  key={option.primaryText}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full flex items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors ${
                    isFirst ? 'rounded-t-lg' : ''
                  } ${isLast ? 'rounded-b-lg' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                       style={{ backgroundColor: 'hsl(220, 90%, 56%)' }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{option.primaryText}</div>
                    <div className="text-sm text-gray-600">{option.secondaryText}</div>
                  </div>
                </button>
              );
            })}
          </div>
          
          <button
            onClick={onClose}
            className="w-full mt-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};