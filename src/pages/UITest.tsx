import React, { useState } from 'react';
import { UIRecipes } from '../ui-pages/UIRecipes';
import { UICook } from '../ui-pages/UICook';
import { UIEditRecipe } from '../ui-pages/UIEditRecipe';
import { CreateModal } from '../modals/CreateModal';
import { PlusIcon } from '../lib/ui-constants';

type Tab = 'recipes' | 'cook' | 'create' | 'edit';

export const UITest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('recipes');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleTabClick = (tab: Tab) => {
    if (tab === 'create') {
      setShowCreateModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'recipes':
        return <UIRecipes />;
      case 'cook':
        return <UICook />;
      case 'edit':
        return <UIEditRecipe />;
      default:
        return <UIRecipes />;
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
            onClick={() => handleTabClick('create')}
            className="flex flex-col items-center py-2 px-3 rounded-lg text-gray-500"
          >
            <PlusIcon className="w-6 h-6 mb-1" />
            <span className="text-xs">Create</span>
          </button>

          {/* Debug button for Edit page */}
          <button
            onClick={() => handleTabClick('edit')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg ${
              activeTab === 'edit' ? 'text-blue-500' : 'text-gray-500'
            }`}
            style={{ color: activeTab === 'edit' ? 'hsl(220, 90%, 56%)' : undefined }}
          >
            <div className="text-2xl mb-1">✏️</div>
            <span className="text-xs">Edit</span>
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