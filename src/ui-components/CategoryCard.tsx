import React from 'react';
import { textSizes } from '../lib/ui-constants';

interface CategoryCardProps {
  imageComponent: React.ComponentType<{ className?: string }>;
  text: string;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  imageComponent: ImageComponent,
  text,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
    >
      <div className="mb-4" style={{ color: 'hsl(220, 90%, 56%)' }}>
        <ImageComponent className="w-12 h-12" />
      </div>
      <span className={`${textSizes.normal} font-medium text-gray-800`}>
        {text}
      </span>
    </button>
  );
};