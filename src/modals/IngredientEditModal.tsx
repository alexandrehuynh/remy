import React, { useState, useEffect } from 'react';
import { XIcon } from '../lib/ui-constants';
import { Ingredient } from '../lib/ui-constants';

interface IngredientEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ingredient: Ingredient) => void;
  ingredient?: Ingredient;
}

export const IngredientEditModal: React.FC<IngredientEditModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  ingredient 
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name);
      setAmount(ingredient.amount);
    } else {
      setName('');
      setAmount('');
    }
  }, [ingredient]);

  const handleSave = () => {
    if (name.trim() && amount.trim()) {
      onSave({
        name: name.trim(),
        amount: amount.trim(),
        isEditing: false,
        markedDone: ingredient?.markedDone || false
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-80 max-w-[90vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {ingredient ? 'Edit Ingredient' : 'Add Ingredient'}
          </h2>
          <button onClick={onClose} className="p-1">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingredient name..."
              className="w-full border border-gray-300 rounded px-3 py-2"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 2 cups, 1 tbsp..."
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
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