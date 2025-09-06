import React, { useState } from 'react';
import { UIRecipes } from '../ui-pages/UIRecipes';
import { UICook } from '../ui-pages/UICook';
import { UIEditRecipe } from '../ui-pages/UIEditRecipe';
import { CreateModal } from '../modals/CreateModal';
import { PlusIcon, Recipe } from '../lib/ui-constants';

type Tab = 'recipes' | 'cook' | 'edit';
type Page = 'recipes' | 'cook' | 'edit' | 'category' | 'recipe-edit';

export const UITest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('recipes');
  const [currentPage, setCurrentPage] = useState<Page>('recipes');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(tab);
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentPage('category');
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentPage('recipe-edit');
  };

  const handleBackToRecipes = () => {
    setCurrentPage('recipes');
    setActiveTab('recipes');
  };

  const handleCookWithRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setActiveTab('cook');
    setCurrentPage('cook');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'recipes':
        return <UIRecipes onCategorySelect={handleCategorySelect} onRecipeSelect={handleRecipeSelect} />;
      case 'category':
        return <UIRecipes selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} onRecipeSelect={handleRecipeSelect} onBack={handleBackToRecipes} />;
      case 'cook':
        return <UICook selectedRecipe={selectedRecipe} />;
      case 'recipe-edit':
        return <UIEditRecipe recipe={selectedRecipe} onBack={handleBackToRecipes} onCook={handleCookWithRecipe} />;
      default:
        return <UIRecipes onCategorySelect={handleCategorySelect} onRecipeSelect={handleRecipeSelect} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => handleTabClick('recipes')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'recipes' ? 'text-blue-500' : 'text-gray-500'
            }`}
            style={{ color: activeTab === 'recipes' ? 'hsl(220, 90%, 56%)' : undefined }}
          >
            <div className="text-2xl mb-1">📚</div>
            <span className="text-xs">Recipes</span>
          </button>

          <button
            onClick={() => handleTabClick('cook')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'cook' ? 'text-blue-500' : 'text-gray-500'
            }`}
            style={{ color: activeTab === 'cook' ? 'hsl(220, 90%, 56%)' : undefined }}
          >
            <div className="text-2xl mb-1">👨‍🍳</div>
            <span className="text-xs">Cook</span>
          </button>

          <button
            onClick={handleCreateClick}
            className="flex flex-col items-center py-2 px-3 rounded-lg text-gray-500"
          >
            <PlusIcon className="w-6 h-6 mb-1" />
            <span className="text-xs">Create</span>
          </button>
        </div>
      </div>

      {/* Create Modal */}
      <CreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};