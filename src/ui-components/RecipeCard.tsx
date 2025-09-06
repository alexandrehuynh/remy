import React from 'react';
import { CategoryCard } from './CategoryCard';
import { textSizes } from '../lib/ui-constants';

interface RecipeCardProps {
  imageComponent: React.ComponentType<{ className?: string }>;
  text: string;
  prepTime: string;
  onClick: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  imageComponent,
  text,
  prepTime,
  onClick
}) => {
  return (
    <div className="relative">
      <CategoryCard
        imageComponent={imageComponent}
        text={text}
        onClick={onClick}
      />
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
        {prepTime}
      </div>
    </div>
  );
};