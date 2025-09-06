import { ChefHat, Coffee, Sandwich, UtensilsCrossed, Cookie, Clock, Users, Flame } from "lucide-react";

// Recipe categories with icons
export const categories = [
  { name: 'Breakfast', icon: Coffee, color: 'text-orange-500' },
  { name: 'Lunch', icon: Sandwich, color: 'text-green-500' },
  { name: 'Dinner', icon: UtensilsCrossed, color: 'text-purple-500' },
  { name: 'Snacks', icon: Cookie, color: 'text-yellow-500' },
  { name: 'Dessert', icon: ChefHat, color: 'text-pink-500' }
];

// Recipe difficulty levels
export const difficulties = [
  { level: 'Easy', icon: Clock, color: 'text-green-500' },
  { level: 'Medium', icon: Users, color: 'text-yellow-500' },
  { level: 'Hard', icon: Flame, color: 'text-red-500' }
];

// Create options for recipe input
export const createOptions = [
  { 
    primaryText: "Upload Image", 
    secondaryText: "Import your favorite recipe", 
    icon: "Upload",
    disabled: false
  },
  { 
    primaryText: "Create Manually", 
    secondaryText: "Add ingredients and steps", 
    icon: "Edit",
    disabled: false
  },
  { 
    primaryText: "Generate with AI", 
    secondaryText: "Describe what you want to cook", 
    icon: "Sparkles",
    disabled: true
  },
  { 
    primaryText: "Web Search", 
    secondaryText: "Find recipes online", 
    icon: "Search",
    disabled: true
  },
  { 
    primaryText: "Community", 
    secondaryText: "Browse shared recipes", 
    icon: "Heart",
    disabled: true
  },
  { 
    primaryText: "Scan Fridge", 
    secondaryText: "Cook with what you have", 
    icon: "Camera",
    disabled: true
  }
];

// Voice commands that the assistant can understand
export const voiceCommands = [
  "Hey Chef, what's next?",
  "How much salt?",
  "Set timer for 5 minutes",
  "Repeat that step",
  "Go to next step",
  "Go back",
  "What ingredients do I need?",
  "How long is left on the timer?"
];

// Timer states
export const timerStates = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  FINISHED: 'finished'
} as const;

// Cooking session states
export const sessionStates = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  PAUSED: 'paused',
  COMPLETED: 'completed'
} as const;