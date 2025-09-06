import React, { useState } from 'react';
import { sampleRecipes, textSizes, Recipe, Ingredient, Instruction } from '../lib/ui-constants';
import { IngredientComponent } from '../ui-components/IngredientComponent';
import { InstructionComponent } from '../ui-components/InstructionComponent';
import { IngredientEditModal } from '../modals/IngredientEditModal';
import { InstructionEditModal } from '../modals/InstructionEditModal';
import { Reorder } from 'framer-motion';

interface UIEditRecipeProps {
  recipe?: Recipe | null;
  onBack?: () => void;
  onCook?: (recipe: Recipe) => void;
}

export const UIEditRecipe: React.FC<UIEditRecipeProps> = ({ 
  recipe: initialRecipe, 
  onBack, 
  onCook 
}) => {
  const [recipe, setRecipe] = useState<Recipe>(initialRecipe || sampleRecipes[0]);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [editingInstruction, setEditingInstruction] = useState<Instruction | null>(null);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setShowIngredientModal(true);
  };

  const handleEditInstruction = (instruction: Instruction) => {
    setEditingInstruction(instruction);
    setShowInstructionModal(true);
  };

  const handleSaveIngredient = (ingredient: Ingredient) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: editingIngredient 
        ? prev.ingredients.map(ing => ing === editingIngredient ? ingredient : ing)
        : [...prev.ingredients, ingredient]
    }));
    setHasChanges(true);
    setEditingIngredient(null);
  };

  const handleSaveInstruction = (instruction: Instruction) => {
    setRecipe(prev => ({
      ...prev,
      instructions: editingInstruction
        ? prev.instructions.map(inst => inst === editingInstruction ? instruction : inst)
        : [...prev.instructions, { ...instruction, order: prev.instructions.length + 1 }]
    }));
    setHasChanges(true);
    setEditingInstruction(null);
  };

  const handleDeleteIngredient = (ingredient: Ingredient) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing !== ingredient)
    }));
    setHasChanges(true);
  };

  const handleDeleteInstruction = (instruction: Instruction) => {
    setRecipe(prev => ({
      ...prev,
      instructions: prev.instructions
        .filter(inst => inst !== instruction)
        .map((inst, index) => ({ ...inst, order: index + 1 }))
    }));
    setHasChanges(true);
  };

  const handleReorderIngredients = (newIngredients: Ingredient[]) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
    setHasChanges(true);
  };

  const handleReorderInstructions = (newInstructions: Instruction[]) => {
    setRecipe(prev => ({
      ...prev,
      instructions: newInstructions.map((inst, index) => ({ ...inst, order: index + 1 }))
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    console.log('Saving recipe changes:', recipe);
    setHasChanges(false);
  };

  const handleStartCooking = () => {
    onCook?.(recipe);
  };

  const handleBack = () => {
    if (hasChanges) {
      setShowUnsavedModal(true);
    } else {
      onBack?.();
    }
  };

  const handleDiscardChanges = () => {
    setHasChanges(false);
    setShowUnsavedModal(false);
    onBack?.();
  };

  const handleSaveAndBack = () => {
    handleSaveChanges();
    setShowUnsavedModal(false);
    onBack?.();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleBack} className="text-blue-500">← Back</button>
          <h1 className={`${textSizes.title} font-bold text-center`}>{recipe.name}</h1>
          <div></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Recipe Image */}
        <div className="p-4 flex justify-center">
          <button 
            className="w-full max-w-[50%] h-48 bg-gray-300 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'hsl(220, 90%, 70%)' }}
          >
            <span className="text-white">Tap to replace image</span>
          </button>
        </div>

        {/* Ingredients */}
        <div className="px-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`${textSizes.large} font-bold`}>Ingredients</h2>
            <button
              onClick={() => {
                setEditingIngredient(null);
                setShowIngredientModal(true);
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium"
              style={{ backgroundColor: 'hsl(220, 90%, 56%)' }}
            >
              + Add
            </button>
          </div>
          <div className="bg-white rounded-lg overflow-hidden">
            <Reorder.Group 
              axis="y" 
              values={recipe.ingredients} 
              onReorder={handleReorderIngredients}
              className="space-y-0"
              layoutScroll
              style={{ overflowY: 'visible' }}
            >
              {recipe.ingredients.map((ingredient: Ingredient, index: number) => (
                <IngredientComponent
                  key={ingredient.name + index}
                  ingredient={ingredient}
                  isSliderEnabled={true}
                  isOrderable={true}
                  onEdit={() => handleEditIngredient(ingredient)}
                  onDelete={() => handleDeleteIngredient(ingredient)}
                />
              ))}
            </Reorder.Group>
          </div>
        </div>

        {/* Instructions */}
        <div className="px-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`${textSizes.large} font-bold`}>Instructions</h2>
            <button
              onClick={() => {
                setEditingInstruction(null);
                setShowInstructionModal(true);
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium"
              style={{ backgroundColor: 'hsl(220, 90%, 56%)' }}
            >
              + Add
            </button>
          </div>
          <div className="bg-white rounded-lg overflow-hidden">
            <Reorder.Group 
              axis="y" 
              values={recipe.instructions} 
              onReorder={handleReorderInstructions}
              className="space-y-0"
              layoutScroll
            >
              {recipe.instructions.map((instruction: Instruction, index: number) => (
                <InstructionComponent
                  key={instruction.instruction + index}
                  instruction={instruction}
                  isSliderEnabled={true}
                  isOrderable={true}
                  onEdit={() => handleEditInstruction(instruction)}
                  onDelete={() => handleDeleteInstruction(instruction)}
                />
              ))}
            </Reorder.Group>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <button
            onClick={handleSaveChanges}
            className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium"
            style={{ backgroundColor: 'hsl(220, 90%, 56%)' }}
          >
            Save Changes
          </button>
          <button
            onClick={handleStartCooking}
            className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium"
            style={{ backgroundColor: 'hsl(142, 76%, 36%)' }}
          >
            Cook
          </button>
        </div>
      </div>

      {/* Modals */}
      <IngredientEditModal
        isOpen={showIngredientModal}
        onClose={() => {
          setShowIngredientModal(false);
          setEditingIngredient(null);
        }}
        onSave={handleSaveIngredient}
        ingredient={editingIngredient || undefined}
      />

      <InstructionEditModal
        isOpen={showInstructionModal}
        onClose={() => {
          setShowInstructionModal(false);
          setEditingInstruction(null);
        }}
        onSave={handleSaveInstruction}
        instruction={editingInstruction || undefined}
      />

      {/* Unsaved Changes Modal */}
      {showUnsavedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">Unsaved Changes</h3>
            <p className="text-gray-600 mb-4">You have unsaved changes. What would you like to do?</p>
            <div className="flex gap-3">
              <button
                onClick={handleDiscardChanges}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700"
              >
                Discard
              </button>
              <button
                onClick={handleSaveAndBack}
                className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg"
                style={{ backgroundColor: 'hsl(220, 90%, 56%)' }}
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};