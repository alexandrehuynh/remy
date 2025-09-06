import React, { useState, useEffect } from 'react';
import { XIcon } from '../lib/ui-constants';
import { Instruction } from '../lib/ui-constants';

interface InstructionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (instruction: Instruction) => void;
  instruction?: Instruction;
}

export const InstructionEditModal: React.FC<InstructionEditModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  instruction 
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (instruction) {
      setText(instruction.instruction);
    } else {
      setText('');
    }
  }, [instruction]);

  const handleSave = () => {
    if (text.trim()) {
      onSave({
        order: instruction?.order || 1,
        instruction: text.trim(),
        isEditing: false,
        markedDone: instruction?.markedDone || false
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {instruction ? 'Edit Instruction' : 'Add Instruction'}
          </h2>
          <button onClick={onClose} className="p-1">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Instruction</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter cooking instruction..."
            className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-none"
            autoFocus
          />
        </div>
        
        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            style={{ backgroundColor: 'hsl(220, 90%, 56%)' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};