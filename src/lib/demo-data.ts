import chickenAlfredo from "@/assets/chicken-alfredo.jpg";
import breakfastPancakes from "@/assets/breakfast-pancakes.jpg";
import chocolateCookies from "@/assets/chocolate-cookies.jpg";
import caesarSalad from "@/assets/caesar-salad.jpg";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  totalTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  servings: number;
  ingredients: Ingredient[];
  steps: Step[];
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export interface Step {
  id: string;
  order: number;
  text: string;
  duration?: number; // in seconds
  canParallel?: boolean;
  ingredients?: string[]; // ingredient IDs needed for this step
}

export const demoRecipes: Recipe[] = [
  {
    id: "1",
    title: "Chicken Alfredo with Garlic Bread",
    description: "Creamy pasta with perfectly seasoned chicken and homemade garlic bread",
    image: chickenAlfredo,
    totalTime: 25,
    difficulty: "Medium",
    category: "Dinner",
    servings: 4,
    ingredients: [
      { id: "1", name: "chicken breast", amount: "2", unit: "pieces" },
      { id: "2", name: "heavy cream", amount: "1", unit: "cup" },
      { id: "3", name: "parmesan cheese", amount: "1/2", unit: "cup" },
      { id: "4", name: "fettuccine pasta", amount: "12", unit: "oz" },
      { id: "5", name: "garlic", amount: "4", unit: "cloves" },
      { id: "6", name: "butter", amount: "3", unit: "tbsp" },
      { id: "7", name: "italian bread", amount: "1", unit: "loaf" },
      { id: "8", name: "olive oil", amount: "2", unit: "tbsp" },
      { id: "9", name: "salt", amount: "1", unit: "tsp" },
      { id: "10", name: "black pepper", amount: "1/2", unit: "tsp" }
    ],
    steps: [
      {
        id: "1",
        order: 1,
        text: "Bring a large pot of salted water to boil for pasta",
        duration: 300,
        canParallel: true,
        ingredients: []
      },
      {
        id: "2",
        order: 2,
        text: "Season chicken breasts with salt and pepper, then cook in olive oil for 8 minutes per side",
        duration: 480,
        canParallel: true,
        ingredients: ["1", "8", "9", "10"]
      },
      {
        id: "3",
        order: 3,
        text: "Cook fettuccine pasta according to package directions (usually 12 minutes)",
        duration: 720,
        canParallel: true,
        ingredients: ["4"]
      },
      {
        id: "4",
        order: 4,
        text: "Mince garlic and melt butter in a large skillet over medium heat",
        duration: 120,
        ingredients: ["5", "6"]
      },
      {
        id: "5",
        order: 5,
        text: "Add garlic to melted butter and cook for 1 minute until fragrant",
        duration: 60,
        ingredients: ["5"]
      },
      {
        id: "6",
        order: 6,
        text: "Pour in heavy cream and bring to a gentle simmer",
        duration: 180,
        ingredients: ["2"]
      },
      {
        id: "7",
        order: 7,
        text: "Add parmesan cheese and whisk until smooth and creamy",
        duration: 120,
        ingredients: ["3"]
      },
      {
        id: "8",
        order: 8,
        text: "Slice cooked chicken and add to the alfredo sauce",
        duration: 180,
        ingredients: ["1"]
      },
      {
        id: "9",
        order: 9,
        text: "Toss drained pasta with the alfredo sauce and sliced chicken",
        duration: 120,
        ingredients: ["4"]
      },
      {
        id: "10",
        order: 10,
        text: "Slice bread, brush with butter and garlic, then toast until golden",
        duration: 300,
        canParallel: true,
        ingredients: ["7", "6", "5"]
      }
    ]
  },
  {
    id: "2",
    title: "Fluffy Pancakes with Berries",
    description: "Perfect weekend breakfast with light, fluffy pancakes and fresh berries",
    image: breakfastPancakes,
    totalTime: 20,
    difficulty: "Easy",
    category: "Breakfast",
    servings: 4,
    ingredients: [
      { id: "11", name: "all-purpose flour", amount: "2", unit: "cups" },
      { id: "12", name: "milk", amount: "1 3/4", unit: "cups" },
      { id: "13", name: "eggs", amount: "2", unit: "large" },
      { id: "14", name: "sugar", amount: "2", unit: "tbsp" },
      { id: "15", name: "baking powder", amount: "2", unit: "tsp" },
      { id: "16", name: "salt", amount: "1/2", unit: "tsp" },
      { id: "17", name: "butter", amount: "4", unit: "tbsp" },
      { id: "18", name: "mixed berries", amount: "1", unit: "cup" },
      { id: "19", name: "maple syrup", amount: "1/2", unit: "cup" }
    ],
    steps: [
      {
        id: "11",
        order: 1,
        text: "Heat griddle or large skillet over medium heat",
        duration: 180,
        ingredients: []
      },
      {
        id: "12",
        order: 2,
        text: "Mix flour, sugar, baking powder, and salt in a large bowl",
        duration: 120,
        ingredients: ["11", "14", "15", "16"]
      },
      {
        id: "13",
        order: 3,
        text: "In another bowl, whisk together milk, eggs, and melted butter",
        duration: 180,
        ingredients: ["12", "13", "17"]
      },
      {
        id: "14",
        order: 4,
        text: "Pour wet ingredients into dry ingredients and stir until just combined",
        duration: 60,
        ingredients: []
      },
      {
        id: "15",
        order: 5,
        text: "Pour 1/4 cup batter for each pancake onto hot griddle",
        duration: 240,
        ingredients: []
      },
      {
        id: "16",
        order: 6,
        text: "Cook until bubbles form on surface, then flip and cook 2 more minutes",
        duration: 180,
        ingredients: []
      },
      {
        id: "17",
        order: 7,
        text: "Serve hot with fresh berries and maple syrup",
        duration: 60,
        ingredients: ["18", "19"]
      }
    ]
  },
  {
    id: "3",
    title: "Classic Chocolate Chip Cookies",
    description: "Crispy on the outside, chewy on the inside - the perfect chocolate chip cookie",
    image: chocolateCookies,
    totalTime: 45,
    difficulty: "Easy",
    category: "Dessert",
    servings: 24,
    ingredients: [
      { id: "20", name: "all-purpose flour", amount: "2 1/4", unit: "cups" },
      { id: "21", name: "butter", amount: "1", unit: "cup" },
      { id: "22", name: "brown sugar", amount: "3/4", unit: "cup" },
      { id: "23", name: "white sugar", amount: "3/4", unit: "cup" },
      { id: "24", name: "eggs", amount: "2", unit: "large" },
      { id: "25", name: "vanilla extract", amount: "2", unit: "tsp" },
      { id: "26", name: "baking soda", amount: "1", unit: "tsp" },
      { id: "27", name: "salt", amount: "1", unit: "tsp" },
      { id: "28", name: "chocolate chips", amount: "2", unit: "cups" }
    ],
    steps: [
      {
        id: "18",
        order: 1,
        text: "Preheat oven to 375°F (190°C)",
        duration: 600,
        ingredients: []
      },
      {
        id: "19",
        order: 2,
        text: "Cream together butter and both sugars until light and fluffy",
        duration: 180,
        ingredients: ["21", "22", "23"]
      },
      {
        id: "20",
        order: 3,
        text: "Beat in eggs one at a time, then add vanilla",
        duration: 120,
        ingredients: ["24", "25"]
      },
      {
        id: "21",
        order: 4,
        text: "Mix flour, baking soda, and salt in separate bowl",
        duration: 60,
        ingredients: ["20", "26", "27"]
      },
      {
        id: "22",
        order: 5,
        text: "Gradually blend dry ingredients into wet mixture",
        duration: 120,
        ingredients: []
      },
      {
        id: "23",
        order: 6,
        text: "Stir in chocolate chips",
        duration: 30,
        ingredients: ["28"]
      },
      {
        id: "24",
        order: 7,
        text: "Drop rounded tablespoons onto ungreased baking sheets",
        duration: 300,
        ingredients: []
      },
      {
        id: "25",
        order: 8,
        text: "Bake for 9-11 minutes until golden brown",
        duration: 600,
        ingredients: []
      }
    ]
  },
  {
    id: "4",
    title: "Fresh Caesar Salad",
    description: "Crisp romaine lettuce with homemade Caesar dressing and garlic croutons",
    image: caesarSalad,
    totalTime: 15,
    difficulty: "Easy",
    category: "Lunch",
    servings: 4,
    ingredients: [
      { id: "29", name: "romaine lettuce", amount: "2", unit: "heads" },
      { id: "30", name: "parmesan cheese", amount: "1/2", unit: "cup" },
      { id: "31", name: "croutons", amount: "1", unit: "cup" },
      { id: "32", name: "caesar dressing", amount: "1/2", unit: "cup" },
      { id: "33", name: "black pepper", amount: "1/4", unit: "tsp" },
      { id: "34", name: "lemon", amount: "1/2", unit: "piece" }
    ],
    steps: [
      {
        id: "26",
        order: 1,
        text: "Wash and chop romaine lettuce into bite-sized pieces",
        duration: 180,
        ingredients: ["29"]
      },
      {
        id: "27",
        order: 2,
        text: "Place lettuce in large salad bowl",
        duration: 30,
        ingredients: ["29"]
      },
      {
        id: "28",
        order: 3,
        text: "Add Caesar dressing and toss gently to coat",
        duration: 60,
        ingredients: ["32"]
      },
      {
        id: "29",
        order: 4,
        text: "Top with grated parmesan cheese and croutons",
        duration: 60,
        ingredients: ["30", "31"]
      },
      {
        id: "30",
        order: 5,
        text: "Finish with fresh cracked black pepper and lemon juice",
        duration: 30,
        ingredients: ["33", "34"]
      }
    ]
  }
];