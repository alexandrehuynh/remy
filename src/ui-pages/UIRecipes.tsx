import React, { useState } from 'react';
import { categories, sampleRecipes, CardViewIcon, RowViewIcon, SearchIcon, EllipsisIcon, textSizes } from '../lib/ui-constants';
import { CategoryCard } from '../ui-components/CategoryCard';
import { CategoryModal } from '../modals/CategoryModal';

export const UIRecipes: React.FC = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'rows'>('cards');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === '+') {
      setShowCategoryModal(true);
      return;
    }
    
    if (viewMode === 'cards') {
      // Navigate to category view
      console.log('Navigate to category:', categoryName);
    } else {
      // Toggle category selection for filtering
      setSelectedCategories(prev => 
        prev.includes(categoryName) 
          ? prev.filter(c => c !== categoryName)
          : [...prev, categoryName]
      );
    }
  };

  const handleAddCategory = (categoryName: string) => {
    console.log('Added new category:', categoryName);
  };

  const filteredRecipes = viewMode === 'rows' && selectedCategories.length > 0
    ? sampleRecipes.filter(recipe => selectedCategories.includes(recipe.category))
    : sampleRecipes;

  const recipesByCategory = filteredRecipes.reduce((acc, recipe) => {
    if (!acc[recipe.category]) {
      acc[recipe.category] = [];
    }
    acc[recipe.category].push(recipe);
    return acc;
  }, {} as Record<string, typeof sampleRecipes>);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setViewMode(viewMode === 'cards' ? 'rows' : 'cards')}
            className="p-2"
          >
            {viewMode === 'cards' ? (
              <RowViewIcon className="w-6 h-6" />
            ) : (
              <CardViewIcon className="w-6 h-6" />
            )}
          </button>
          
          <h1 className={`${textSizes.large} font-bold`}>My Recipes</h1>
          
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2"
          >
            <SearchIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Category Pills for Row Mode */}
        {viewMode === 'rows' && (
          <div className="px-4 pb-4">
            <div className="flex gap-2 overflow-x-auto">
              {categories.filter(cat => cat.name !== '+').map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                    selectedCategories.includes(category.name)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  style={{
                    backgroundColor: selectedCategories.includes(category.name) 
                      ? 'hsl(220, 90%, 56%)' 
                      : undefined
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'cards' ? (
          /* Cards View */
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.name}
                  imageComponent={category.icon}
                  text={category.name === '+' ? 'New' : category.name}
                  onClick={() => handleCategoryClick(category.name)}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Rows View */
          <div className="p-4 space-y-6">
            {Object.entries(recipesByCategory).map(([categoryName, recipes]) => (
              <div key={categoryName}>
                <h2 className={`${textSizes.normal} font-semibold mb-3 text-gray-800`}>
                  {categoryName}
                </h2>
                <div className="space-y-1">
                  {recipes.map((recipe) => (
                    <div key={recipe.name} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex-1 text-left pl-4">
                        <div className="font-medium text-gray-800">{recipe.name}</div>
                        <div className="text-sm text-gray-600">{recipe.timeToCook}</div>
                      </div>
                      <div className="relative">
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <EllipsisIcon className="w-5 h-5 text-gray-500" />
                        </button>
                        {/* Options menu would appear here */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleAddCategory}
      />
    </div>
  );
};