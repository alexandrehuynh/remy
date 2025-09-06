import React, { useState, useEffect } from 'react';
import { sampleRecipes, textSizes, Recipe, createOptions } from '../lib/ui-constants';
import { IngredientComponent } from '../ui-components/IngredientComponent';
import { InstructionComponent } from '../ui-components/InstructionComponent';

interface UICookProps {
  selectedRecipe?: Recipe | null;
}

export const UICook: React.FC<UICookProps> = ({ selectedRecipe }) => {
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(selectedRecipe || null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-sliding carousel with infinite scrolling
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (sampleRecipes.length * 2));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRecipeSelect = (recipe: Recipe) => {
    setActiveRecipe(recipe);
  };

  if (activeRecipe) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Recipe Background with Voice Agent */}
        <div 
          className="relative h-48 bg-cover bg-center flex items-center justify-center rounded-lg mx-4 mt-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${activeRecipe.imagePath})`,
            backgroundColor: 'hsl(220, 90%, 56%)'
          }}
        >
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full animate-pulse"></div>
          </div>
          <button
            onClick={() => setActiveRecipe(null)}
            className="absolute top-4 left-4 text-white bg-black bg-opacity-30 rounded-full p-2"
          >
            ←
          </button>
        </div>

        {/* Ingredients */}
        <div className="px-4 mt-6">
          <h2 className={`${textSizes.large} font-bold mb-4`}>Ingredients</h2>
          <div className="bg-white rounded-lg overflow-hidden">
            {activeRecipe.ingredients.map((ingredient, index) => (
              <IngredientComponent
                key={index}
                ingredient={ingredient}
                isSliderEnabled={true}
                showOptions={true}
                onEdit={() => console.log('Edit ingredient:', ingredient.name)}
                onDelete={() => console.log('Delete ingredient:', ingredient.name)}
                onMarkDone={() => console.log('Mark ingredient done:', ingredient.name)}
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="px-4 mt-6 pb-6">
          <h2 className={`${textSizes.large} font-bold mb-4`}>Instructions</h2>
          <div className="bg-white rounded-lg overflow-hidden">
            {activeRecipe.instructions.map((instruction, index) => (
              <InstructionComponent
                key={index}
                instruction={instruction}
                isSliderEnabled={true}
                showOptions={true}
                onEdit={() => console.log('Edit instruction:', instruction.order)}
                onDelete={() => console.log('Delete instruction:', instruction.order)}
                onMarkDone={(done) => console.log('Mark instruction done:', instruction.order, done)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 items-center justify-center px-4">
      {/* Recipe Carousel */}
      <div className="mb-8">
        <h1 className={`${textSizes.title} font-bold text-center mb-6`}>
          Choose one of your Recipes
        </h1>
        
        <div className="relative w-64 h-48 rounded-lg overflow-hidden shadow-lg mx-auto">
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${(currentSlide % sampleRecipes.length) * 100}%)` }}
          >
            {/* Create infinite loop by duplicating recipes */}
            {[...sampleRecipes, ...sampleRecipes].map((recipe, index) => (
              <button
                key={index}
                onClick={() => handleRecipeSelect(recipe)}
                className="w-64 h-48 flex-shrink-0 bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(${recipe.imagePath})`,
                  backgroundColor: 'hsl(220, 90%, 56%)'
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Create New Recipe */}
      <div className="w-full max-w-md">
        <h2 className={`${textSizes.title} font-bold text-center mb-4`}>
          Or Create a New One!
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* All create options from constants */}
          {createOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <button key={index} className="p-4 bg-white rounded-lg shadow-sm text-center">
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm font-medium">{option.primaryText}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};