import React, { useState } from 'react';
import { XIcon } from '../lib/ui-constants';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryName: string) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSave = () => {
    if (categoryName.trim()) {
      onSave(categoryName.trim());
      setCategoryName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-80 max-w-[90vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Category</h2>
          <button onClick={onClose} className="p-1">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category name..."
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          autoFocus
        />
        
        <div className="flex gap-2 justify-end">
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