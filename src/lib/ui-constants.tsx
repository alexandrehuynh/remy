import React from 'react';

// Color System
export const colors = {
  primary: {
    main: 'hsl(220, 90%, 56%)',
    light: 'hsl(220, 90%, 70%)',
    dark: 'hsl(220, 90%, 42%)',
  },
  secondary: {
    main: 'hsl(280, 60%, 50%)',
    light: 'hsl(280, 60%, 70%)',
    dark: 'hsl(280, 60%, 30%)',
  }
};

// Text Sizes
export const textSizes = {
  title: 'text-3xl',
  large: 'text-2xl', 
  normal: 'text-xl',
  small: 'text-lg'
};

// Icons
export const DinnerIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.41,8.808c1.537-1.566,5.79-3.515,7.929-2.561l1.44-1.44a1.5,1.5,0,1,1,2.063-.649,1.5,1.5,0,1,1-.649,2.063L19.749,7.665c.981,2.39-1.1,6.474-2.555,7.927C12.6,19.949,6.055,13.4,10.41,8.808Zm8.2,8.2c-6.831,6.361-16.1-3.669-9.21-9.981A8.942,8.942,0,0,0,0,16v2.568C.168,23.879,5.723,23.808,9,24c9,.149,20.246-2.311,12.416-11.777A13.057,13.057,0,0,1,18.607,17.006ZM8,4A1,1,0,0,0,9,3V1A1,1,0,0,0,7,1V3A1,1,0,0,0,8,4Zm4,0a1,1,0,0,0,1-1V1a1,1,0,0,0-2,0V3A1,1,0,0,0,12,4ZM4,4A1,1,0,0,0,5,3V1A1,1,0,0,0,3,1V3A1,1,0,0,0,4,4Z"/>
  </svg>
);

export const LunchIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 640 640" fill="currentColor">
    <path d="M112 448C103.2 448 96 455.2 96 464C96 508.2 131.8 544 176 544L464 544C508.2 544 544 508.2 544 464C544 455.2 536.8 448 528 448L112 448zM96 266C96 278.2 105.9 288 118 288L522 288C534.2 288 544 278.1 544 266C544 248.8 541.4 231.6 533.2 216.5C511 175.7 450.9 96 320 96C189.1 96 129 175.6 106.8 216.5C98.6 231.6 96 248.8 96 266zM64 368C64 385.7 78.3 400 96 400L544 400C561.7 400 576 385.7 576 368C576 350.3 561.7 336 544 336L96 336C78.3 336 64 350.3 64 368zM320 136C333.3 136 344 146.7 344 160C344 173.3 333.3 184 320 184C306.7 184 296 173.3 296 160C296 146.7 306.7 136 320 136zM184 192C184 178.7 194.7 168 208 168C221.3 168 232 178.7 232 192C232 205.3 221.3 216 208 216C194.7 216 184 205.3 184 192zM432 168C445.3 168 456 178.7 456 192C456 205.3 445.3 216 432 216C418.7 216 408 205.3 408 192C408 178.7 418.7 168 432 168z"/>
  </svg>
);

export const BreakfastIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.94,6.573a2.849,2.849,0,0,1-2.516,2.284s-1.051.165-1.51.284A7.5,7.5,0,0,0,20,8.146V4.011a6.052,6.052,0,0,0-.217-1.578,11.8,11.8,0,0,1,2.795,1.138A2.765,2.765,0,0,1,23.94,6.573Zm-9.793,7.556a3,3,0,0,0,.6-3.308L10.991,3.607A4.351,4.351,0,0,0,4.16,2.06c-.342.292-.684.6-1.018.912-.355.334-.717.712-1.077,1.124a4.323,4.323,0,0,0-.957,3.826,4.453,4.453,0,0,0,2.539,3.1l7.2,3.717A2.9,2.9,0,0,0,12.059,15,2.936,2.936,0,0,0,14.147,14.129ZM16.473.862A3.966,3.966,0,0,0,13.082.109a16.852,16.852,0,0,0-1.814.543,6.4,6.4,0,0,1,1.524,2.083l3.78,7.271a4.963,4.963,0,0,1,.174.492l.01-.01A5.525,5.525,0,0,0,18,7V4.011A3.993,3.993,0,0,0,16.473.862Zm-9.9,23.077a2.849,2.849,0,0,0,2.283-2.516s.165-1.051.284-1.51A7.489,7.489,0,0,1,8.146,20H4.01a6.058,6.058,0,0,1-1.578-.217,11.779,11.779,0,0,0,1.138,2.8A2.766,2.766,0,0,0,6.573,23.939ZM4.01,18H7a5.525,5.525,0,0,0,3.488-1.244l.01-.009a5.123,5.123,0,0,1-.491-.175l-7.271-3.78A6.4,6.4,0,0,1,.651,11.267a16.622,16.622,0,0,0-.542,1.814,3.959,3.959,0,0,0,.753,3.391A3.991,3.991,0,0,0,4.01,18Z"/>
  </svg>
);

export const CreateRecipeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 1-2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const DessertIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24,23a1,1,0,0,1-1,1H1a1,1,0,0,1,0-2H23A1,1,0,0,1,24,23ZM3.75,15c1.068,0,1.75-.657,1.75-1a1,1,0,0,1,2,0c0,.306.661,1,1.75,1,1.068,0,1.75-.657,1.75-1a1,1,0,0,1,2,0c0,.306.661,1,1.75,1,1.068,0,1.75-.657,1.75-1a1,1,0,0,1,2,0c0,.306.661,1,1.75,1S22,14.306,22,14a5.006,5.006,0,0,0-5-5H13V6.816A3,3,0,0,0,15,4,6.683,6.683,0,0,0,13.332.59a1.856,1.856,0,0,0-2.663,0A6.676,6.676,0,0,0,9,4a3,3,0,0,0,2,2.816V9H7a5.006,5.006,0,0,0-5,5C2,14.306,2.661,15,3.75,15ZM3,20H21a1,1,0,0,0,1-1V16.625A4.359,4.359,0,0,1,20.25,17a4.194,4.194,0,0,1-2.75-1,4.309,4.309,0,0,1-5.5.015A4.309,4.309,0,0,1,6.5,16a4.194,4.194,0,0,1-2.75,1A4.359,4.359,0,0,1,2,16.625V19A1,1,0,0,0,3,20Z"/>
  </svg>
);

export const SnackIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="m7.948 16h7.999v7h-7.999zm15.2-.805-6.999-11.761c-.922-1.547-2.45-2.434-4.193-2.434-1.757 0-3.293.887-4.213 2.434l-7 11.762c-.946 1.59-.991 3.518-.121 5.155.883 1.658 2.502 2.648 4.331 2.648h.996v-8.999h11.999v9h.991c1.785 0 3.701-1.249 4.555-2.97.774-1.56.661-3.141-.346-4.835z"/>
  </svg>
);

export const GenerateRecipeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.247,9.752l4.187-4.186,4,4-4.186,4.187ZM8.833,11.166l-8,8a2.829,2.829,0,0,0,2,4.829,2.806,2.806,0,0,0,2-.829l8-8ZM18.667,17.3,20,19.962,21.333,17.3,24,15.962l-2.667-1.334L20,11.962l-1.333,2.666L16,15.962Zm-12-11.962L8,8,9.333,5.333,12,4,9.333,2.667,8,0,6.667,2.667,4,4Zm12.666-.666L20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"/>
  </svg>
);

export const WebSearchIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const CommunitySearchIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const FridgeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    <path d="M9 4v16" />
  </svg>
);

export const CardViewIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

export const RowViewIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 640 640" fill="currentColor">
    <path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/>
  </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const BurgerIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const EllipsisIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

// Create Options
export const createOptions = [
  {
    primaryText: "Upload Image",
    secondaryText: "Import your favorite recipe",
    icon: PlusIcon
  },
  {
    primaryText: "Create Recipe", 
    secondaryText: "Add a recipe manually",
    icon: CreateRecipeIcon
  },
  {
    primaryText: "Generate Recipe",
    secondaryText: "Let AI create your recipe", 
    icon: GenerateRecipeIcon
  },
  {
    primaryText: "Web Search",
    secondaryText: "Find a recipe online",
    icon: WebSearchIcon
  },
  {
    primaryText: "Community Search", 
    secondaryText: "Browse users' recipes",
    icon: CommunitySearchIcon
  },
  {
    primaryText: "Scan Fridge",
    secondaryText: "Find recipes you can make now",
    icon: FridgeIcon
  }
];

// Categories
export const categories = [
  { name: 'Breakfast', icon: BreakfastIcon },
  { name: 'Lunch', icon: LunchIcon },
  { name: 'Dinner', icon: DinnerIcon },
  { name: 'Snacks', icon: SnackIcon },
  { name: 'Dessert', icon: DessertIcon },
  { name: '+', icon: PlusIcon }
];

// Sample Data
export interface Ingredient {
  name: string;
  amount: string;
  isEditing: boolean;
  markedDone?: boolean;
}

export interface Instruction {
  order: number;
  instruction: string;
  isEditing: boolean;
  markedDone?: boolean;
}

export interface Recipe {
  name: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  timeToCook: string;
  imagePath: string;
  category: string;
}

export const sampleRecipes: Recipe[] = [
  {
    name: "Chicken Alfredo",
    category: "Dinner",
    timeToCook: "30 min",
    imagePath: "/placeholder-recipe.jpg",
    ingredients: [
      { name: "Chicken Breast", amount: "2 lbs", isEditing: false },
      { name: "Fettuccine", amount: "1 lb", isEditing: false },
      { name: "Heavy Cream", amount: "2 cups", isEditing: false }
    ],
    instructions: [
      { order: 1, instruction: "Cook pasta according to package directions", isEditing: false },
      { order: 2, instruction: "Season and cook chicken until done", isEditing: false },
      { order: 3, instruction: "Make alfredo sauce with cream and cheese", isEditing: false }
    ]
  },
  {
    name: "Pancakes",
    category: "Breakfast", 
    timeToCook: "20 min",
    imagePath: "/placeholder-recipe.jpg",
    ingredients: [
      { name: "Flour", amount: "2 cups", isEditing: false },
      { name: "Milk", amount: "1.5 cups", isEditing: false },
      { name: "Eggs", amount: "2", isEditing: false }
    ],
    instructions: [
      { order: 1, instruction: "Mix dry ingredients", isEditing: false },
      { order: 2, instruction: "Combine wet ingredients", isEditing: false },
      { order: 3, instruction: "Cook on griddle until golden", isEditing: false }
    ]
  }
];