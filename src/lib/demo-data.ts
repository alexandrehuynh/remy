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
  },
  
  // SNACKS CATEGORY (3 new recipes)
  {
    id: "5",
    title: "Classic Guacamole with Tortilla Chips",
    description: "Fresh, creamy guacamole made with ripe avocados and zesty lime",
    image: caesarSalad, // Using placeholder - can be replaced later
    totalTime: 10,
    difficulty: "Easy",
    category: "Snacks",
    servings: 4,
    ingredients: [
      { id: "35", name: "ripe avocados", amount: "3", unit: "pieces" },
      { id: "36", name: "lime juice", amount: "2", unit: "tbsp" },
      { id: "37", name: "diced tomato", amount: "1", unit: "medium" },
      { id: "38", name: "white onion", amount: "1/4", unit: "cup" },
      { id: "39", name: "fresh cilantro", amount: "2", unit: "tbsp" },
      { id: "40", name: "salt", amount: "1/2", unit: "tsp" },
      { id: "41", name: "tortilla chips", amount: "1", unit: "bag" }
    ],
    steps: [
      {
        id: "31",
        order: 1,
        text: "Cut avocados in half and remove pits",
        duration: 60,
        ingredients: ["35"]
      },
      {
        id: "32",
        order: 2,
        text: "Scoop avocado into bowl and mash to desired consistency",
        duration: 120,
        ingredients: ["35"]
      },
      {
        id: "33",
        order: 3,
        text: "Mix in lime juice, diced tomato, onion, and cilantro",
        duration: 180,
        ingredients: ["36", "37", "38", "39"]
      },
      {
        id: "34",
        order: 4,
        text: "Season with salt and taste, adjust seasoning as needed",
        duration: 60,
        ingredients: ["40"]
      },
      {
        id: "35",
        order: 5,
        text: "Serve immediately with tortilla chips",
        duration: 30,
        ingredients: ["41"]
      }
    ]
  },

  {
    id: "6",
    title: "Buffalo Chicken Dip",
    description: "Creamy, spicy dip perfect for game day or parties",
    image: chickenAlfredo, // Using placeholder
    totalTime: 25,
    difficulty: "Easy",
    category: "Snacks",
    servings: 8,
    ingredients: [
      { id: "42", name: "cream cheese", amount: "8", unit: "oz" },
      { id: "43", name: "cooked chicken", amount: "2", unit: "cups" },
      { id: "44", name: "buffalo wing sauce", amount: "1/2", unit: "cup" },
      { id: "45", name: "cheddar cheese", amount: "1", unit: "cup" },
      { id: "46", name: "ranch dressing", amount: "1/4", unit: "cup" },
      { id: "47", name: "green onions", amount: "2", unit: "stalks" },
      { id: "48", name: "tortilla chips", amount: "1", unit: "bag" }
    ],
    steps: [
      {
        id: "36",
        order: 1,
        text: "Preheat oven to 375°F (190°C)",
        duration: 300,
        ingredients: []
      },
      {
        id: "37",
        order: 2,
        text: "Mix cream cheese, buffalo sauce, and ranch dressing until smooth",
        duration: 120,
        ingredients: ["42", "44", "46"]
      },
      {
        id: "38",
        order: 3,
        text: "Fold in shredded chicken and half the cheddar cheese",
        duration: 90,
        ingredients: ["43", "45"]
      },
      {
        id: "39",
        order: 4,
        text: "Transfer to baking dish and top with remaining cheese",
        duration: 60,
        ingredients: ["45"]
      },
      {
        id: "40",
        order: 5,
        text: "Bake for 15 minutes until hot and bubbly",
        duration: 900,
        ingredients: []
      },
      {
        id: "41",
        order: 6,
        text: "Garnish with chopped green onions and serve with chips",
        duration: 60,
        ingredients: ["47", "48"]
      }
    ]
  },

  {
    id: "7",
    title: "Homemade Trail Mix",
    description: "Perfect blend of nuts, dried fruits, and chocolate for energy on-the-go",
    image: chocolateCookies, // Using placeholder
    totalTime: 5,
    difficulty: "Easy",
    category: "Snacks",
    servings: 6,
    ingredients: [
      { id: "49", name: "mixed nuts", amount: "1", unit: "cup" },
      { id: "50", name: "dried cranberries", amount: "1/2", unit: "cup" },
      { id: "51", name: "chocolate chips", amount: "1/3", unit: "cup" },
      { id: "52", name: "mini pretzels", amount: "1/2", unit: "cup" },
      { id: "53", name: "sunflower seeds", amount: "1/4", unit: "cup" }
    ],
    steps: [
      {
        id: "42",
        order: 1,
        text: "Combine all nuts and seeds in a large bowl",
        duration: 60,
        ingredients: ["49", "53"]
      },
      {
        id: "43",
        order: 2,
        text: "Add dried cranberries and pretzels, mix gently",
        duration: 30,
        ingredients: ["50", "52"]
      },
      {
        id: "44",
        order: 3,
        text: "Fold in chocolate chips and store in airtight container",
        duration: 30,
        ingredients: ["51"]
      }
    ]
  },

  // ADDITIONAL BREAKFAST RECIPES (2 more)
  {
    id: "8",
    title: "Avocado Toast with Poached Eggs",
    description: "Nutritious and Instagram-worthy breakfast with creamy avocado and perfectly poached eggs",
    image: breakfastPancakes, // Using placeholder
    totalTime: 12,
    difficulty: "Easy",
    category: "Breakfast",
    servings: 2,
    ingredients: [
      { id: "54", name: "whole grain bread", amount: "2", unit: "slices" },
      { id: "55", name: "ripe avocado", amount: "1", unit: "large" },
      { id: "56", name: "eggs", amount: "2", unit: "large" },
      { id: "57", name: "lemon juice", amount: "1", unit: "tsp" },
      { id: "58", name: "salt", amount: "1/4", unit: "tsp" },
      { id: "59", name: "black pepper", amount: "1/8", unit: "tsp" },
      { id: "60", name: "red pepper flakes", amount: "1/8", unit: "tsp" }
    ],
    steps: [
      {
        id: "45",
        order: 1,
        text: "Toast bread slices until golden brown",
        duration: 180,
        ingredients: ["54"]
      },
      {
        id: "46",
        order: 2,
        text: "Mash avocado with lemon juice, salt, and pepper",
        duration: 120,
        ingredients: ["55", "57", "58", "59"]
      },
      {
        id: "47",
        order: 3,
        text: "Bring pot of water to gentle simmer for poaching eggs",
        duration: 300,
        ingredients: []
      },
      {
        id: "48",
        order: 4,
        text: "Poach eggs for 3-4 minutes until whites are set",
        duration: 240,
        ingredients: ["56"]
      },
      {
        id: "49",
        order: 5,
        text: "Spread avocado mixture on toast and top with poached egg",
        duration: 60,
        ingredients: []
      },
      {
        id: "50",
        order: 6,
        text: "Season with red pepper flakes and serve immediately",
        duration: 30,
        ingredients: ["60"]
      }
    ]
  },

  {
    id: "9",
    title: "Overnight Oats with Mixed Berries",
    description: "Prepare-ahead breakfast that's ready when you wake up",
    image: breakfastPancakes, // Using placeholder
    totalTime: 5,
    difficulty: "Easy",
    category: "Breakfast",
    servings: 2,
    ingredients: [
      { id: "61", name: "rolled oats", amount: "1", unit: "cup" },
      { id: "62", name: "milk", amount: "1", unit: "cup" },
      { id: "63", name: "Greek yogurt", amount: "1/2", unit: "cup" },
      { id: "64", name: "honey", amount: "2", unit: "tbsp" },
      { id: "65", name: "vanilla extract", amount: "1/2", unit: "tsp" },
      { id: "66", name: "mixed berries", amount: "1/2", unit: "cup" },
      { id: "67", name: "chia seeds", amount: "1", unit: "tbsp" }
    ],
    steps: [
      {
        id: "51",
        order: 1,
        text: "Mix oats, milk, yogurt, honey, and vanilla in jar",
        duration: 120,
        ingredients: ["61", "62", "63", "64", "65"]
      },
      {
        id: "52",
        order: 2,
        text: "Stir in chia seeds and half the berries",
        duration: 60,
        ingredients: ["67", "66"]
      },
      {
        id: "53",
        order: 3,
        text: "Refrigerate overnight, top with remaining berries before serving",
        duration: 60,
        ingredients: ["66"]
      }
    ]
  },

  // ADDITIONAL LUNCH RECIPES (2 more)
  {
    id: "10",
    title: "Classic BLT Sandwich",
    description: "The perfect combination of crispy bacon, fresh lettuce, and ripe tomatoes",
    image: caesarSalad, // Using placeholder
    totalTime: 10,
    difficulty: "Easy",
    category: "Lunch",
    servings: 2,
    ingredients: [
      { id: "68", name: "bacon strips", amount: "6", unit: "pieces" },
      { id: "69", name: "bread slices", amount: "4", unit: "pieces" },
      { id: "70", name: "large tomato", amount: "1", unit: "piece" },
      { id: "71", name: "lettuce leaves", amount: "4", unit: "leaves" },
      { id: "72", name: "mayonnaise", amount: "2", unit: "tbsp" }
    ],
    steps: [
      {
        id: "54",
        order: 1,
        text: "Cook bacon in skillet until crispy, about 4-5 minutes per side",
        duration: 600,
        ingredients: ["68"]
      },
      {
        id: "55",
        order: 2,
        text: "Toast bread slices until golden brown",
        duration: 180,
        ingredients: ["69"]
      },
      {
        id: "56",
        order: 3,
        text: "Slice tomato into 1/4 inch thick slices",
        duration: 60,
        ingredients: ["70"]
      },
      {
        id: "57",
        order: 4,
        text: "Spread mayonnaise on one side of each toast slice",
        duration: 60,
        ingredients: ["72"]
      },
      {
        id: "58",
        order: 5,
        text: "Layer lettuce, tomato, and bacon on two slices, top with remaining bread",
        duration: 120,
        ingredients: ["71", "70", "68"]
      }
    ]
  },

  {
    id: "11",
    title: "Chicken Quesadilla",
    description: "Crispy tortilla filled with seasoned chicken and melted cheese",
    image: chickenAlfredo, // Using placeholder
    totalTime: 15,
    difficulty: "Medium",
    category: "Lunch",
    servings: 2,
    ingredients: [
      { id: "73", name: "flour tortillas", amount: "2", unit: "large" },
      { id: "74", name: "cooked chicken", amount: "1", unit: "cup" },
      { id: "75", name: "cheddar cheese", amount: "1", unit: "cup" },
      { id: "76", name: "bell pepper", amount: "1/2", unit: "cup" },
      { id: "77", name: "onion", amount: "1/4", unit: "cup" },
      { id: "78", name: "olive oil", amount: "1", unit: "tbsp" },
      { id: "79", name: "salsa", amount: "1/2", unit: "cup" },
      { id: "80", name: "sour cream", amount: "1/4", unit: "cup" }
    ],
    steps: [
      {
        id: "59",
        order: 1,
        text: "Dice bell pepper and onion, sauté until soft",
        duration: 300,
        ingredients: ["76", "77", "78"]
      },
      {
        id: "60",
        order: 2,
        text: "Mix cooked chicken with sautéed vegetables",
        duration: 60,
        ingredients: ["74"]
      },
      {
        id: "61",
        order: 3,
        text: "Place filling and cheese on half of each tortilla",
        duration: 120,
        ingredients: ["75"]
      },
      {
        id: "62",
        order: 4,
        text: "Fold tortillas in half and cook in skillet 2-3 minutes per side",
        duration: 360,
        ingredients: ["73"]
      },
      {
        id: "63",
        order: 5,
        text: "Cut into wedges and serve with salsa and sour cream",
        duration: 60,
        ingredients: ["79", "80"]
      }
    ]
  },

  // ADDITIONAL DINNER RECIPES (2 more)
  {
    id: "12",
    title: "Beef Stir Fry with Vegetables",
    description: "Quick and flavorful stir fry with tender beef and crisp vegetables",
    image: chickenAlfredo, // Using placeholder
    totalTime: 20,
    difficulty: "Medium",
    category: "Dinner",
    servings: 4,
    ingredients: [
      { id: "81", name: "beef sirloin", amount: "1", unit: "lb" },
      { id: "82", name: "broccoli florets", amount: "2", unit: "cups" },
      { id: "83", name: "bell peppers", amount: "1", unit: "cup" },
      { id: "84", name: "snap peas", amount: "1", unit: "cup" },
      { id: "85", name: "soy sauce", amount: "3", unit: "tbsp" },
      { id: "86", name: "garlic", amount: "3", unit: "cloves" },
      { id: "87", name: "ginger", amount: "1", unit: "tbsp" },
      { id: "88", name: "vegetable oil", amount: "2", unit: "tbsp" },
      { id: "89", name: "cooked rice", amount: "4", unit: "cups" }
    ],
    steps: [
      {
        id: "64",
        order: 1,
        text: "Slice beef into thin strips against the grain",
        duration: 300,
        ingredients: ["81"]
      },
      {
        id: "65",
        order: 2,
        text: "Heat oil in wok or large skillet over high heat",
        duration: 120,
        ingredients: ["88"]
      },
      {
        id: "66",
        order: 3,
        text: "Stir fry beef strips until browned, about 3-4 minutes",
        duration: 240,
        ingredients: ["81"]
      },
      {
        id: "67",
        order: 4,
        text: "Add garlic and ginger, stir fry for 30 seconds",
        duration: 30,
        ingredients: ["86", "87"]
      },
      {
        id: "68",
        order: 5,
        text: "Add vegetables and stir fry until crisp-tender",
        duration: 300,
        ingredients: ["82", "83", "84"]
      },
      {
        id: "69",
        order: 6,
        text: "Add soy sauce and toss everything together",
        duration: 60,
        ingredients: ["85"]
      },
      {
        id: "70",
        order: 7,
        text: "Serve immediately over cooked rice",
        duration: 60,
        ingredients: ["89"]
      }
    ]
  },

  {
    id: "13",
    title: "Baked Salmon with Roasted Vegetables",
    description: "Healthy and delicious one-pan dinner with perfectly flaked salmon",
    image: caesarSalad, // Using placeholder
    totalTime: 25,
    difficulty: "Easy",
    category: "Dinner",
    servings: 4,
    ingredients: [
      { id: "90", name: "salmon fillets", amount: "4", unit: "pieces" },
      { id: "91", name: "broccoli", amount: "2", unit: "cups" },
      { id: "92", name: "baby carrots", amount: "1", unit: "cup" },
      { id: "93", name: "olive oil", amount: "3", unit: "tbsp" },
      { id: "94", name: "lemon", amount: "1", unit: "piece" },
      { id: "95", name: "garlic powder", amount: "1", unit: "tsp" },
      { id: "96", name: "salt", amount: "1", unit: "tsp" },
      { id: "97", name: "black pepper", amount: "1/2", unit: "tsp" }
    ],
    steps: [
      {
        id: "71",
        order: 1,
        text: "Preheat oven to 425°F (220°C)",
        duration: 300,
        ingredients: []
      },
      {
        id: "72",
        order: 2,
        text: "Toss vegetables with olive oil, salt, and pepper",
        duration: 180,
        ingredients: ["91", "92", "93", "96", "97"]
      },
      {
        id: "73",
        order: 3,
        text: "Arrange vegetables on baking sheet and roast 10 minutes",
        duration: 600,
        ingredients: []
      },
      {
        id: "74",
        order: 4,
        text: "Season salmon with garlic powder, salt, and pepper",
        duration: 120,
        ingredients: ["90", "95", "96", "97"]
      },
      {
        id: "75",
        order: 5,
        text: "Add salmon to baking sheet with vegetables",
        duration: 60,
        ingredients: ["90"]
      },
      {
        id: "76",
        order: 6,
        text: "Bake additional 12-15 minutes until salmon flakes easily",
        duration: 900,
        ingredients: []
      },
      {
        id: "77",
        order: 7,
        text: "Serve with fresh lemon wedges",
        duration: 60,
        ingredients: ["94"]
      }
    ]
  },

  // ADDITIONAL DESSERT RECIPES (2 more)
  {
    id: "14",
    title: "Fudgy Chocolate Brownies",
    description: "Rich, dense chocolate brownies that are irresistibly fudgy",
    image: chocolateCookies, // Using placeholder
    totalTime: 45,
    difficulty: "Medium",
    category: "Dessert",
    servings: 12,
    ingredients: [
      { id: "98", name: "dark chocolate", amount: "4", unit: "oz" },
      { id: "99", name: "butter", amount: "1/2", unit: "cup" },
      { id: "100", name: "granulated sugar", amount: "1", unit: "cup" },
      { id: "101", name: "eggs", amount: "2", unit: "large" },
      { id: "102", name: "vanilla extract", amount: "1", unit: "tsp" },
      { id: "103", name: "all-purpose flour", amount: "1/2", unit: "cup" },
      { id: "104", name: "cocoa powder", amount: "1/4", unit: "cup" },
      { id: "105", name: "salt", amount: "1/4", unit: "tsp" }
    ],
    steps: [
      {
        id: "78",
        order: 1,
        text: "Preheat oven to 350°F (175°C) and grease 8x8 pan",
        duration: 300,
        ingredients: []
      },
      {
        id: "79",
        order: 2,
        text: "Melt chocolate and butter together in microwave",
        duration: 180,
        ingredients: ["98", "99"]
      },
      {
        id: "80",
        order: 3,
        text: "Stir in sugar, then beat in eggs and vanilla",
        duration: 180,
        ingredients: ["100", "101", "102"]
      },
      {
        id: "81",
        order: 4,
        text: "Mix flour, cocoa powder, and salt in separate bowl",
        duration: 60,
        ingredients: ["103", "104", "105"]
      },
      {
        id: "82",
        order: 5,
        text: "Fold dry ingredients into chocolate mixture",
        duration: 120,
        ingredients: []
      },
      {
        id: "83",
        order: 6,
        text: "Pour into prepared pan and bake 25-30 minutes",
        duration: 1800,
        ingredients: []
      },
      {
        id: "84",
        order: 7,
        text: "Cool completely before cutting into squares",
        duration: 1200,
        ingredients: []
      }
    ]
  },

  {
    id: "15",
    title: "Fresh Berry Parfait",
    description: "Light and refreshing layered dessert with yogurt, berries, and granola",
    image: breakfastPancakes, // Using placeholder
    totalTime: 8,
    difficulty: "Easy",
    category: "Dessert",
    servings: 2,
    ingredients: [
      { id: "106", name: "Greek yogurt", amount: "1", unit: "cup" },
      { id: "107", name: "mixed berries", amount: "1", unit: "cup" },
      { id: "108", name: "granola", amount: "1/2", unit: "cup" },
      { id: "109", name: "honey", amount: "2", unit: "tbsp" },
      { id: "110", name: "vanilla extract", amount: "1/2", unit: "tsp" },
      { id: "111", name: "mint leaves", amount: "4", unit: "leaves" }
    ],
    steps: [
      {
        id: "85",
        order: 1,
        text: "Mix Greek yogurt with honey and vanilla",
        duration: 120,
        ingredients: ["106", "109", "110"]
      },
      {
        id: "86",
        order: 2,
        text: "Layer yogurt mixture in bottom of glasses",
        duration: 60,
        ingredients: []
      },
      {
        id: "87",
        order: 3,
        text: "Add layer of mixed berries",
        duration: 60,
        ingredients: ["107"]
      },
      {
        id: "88",
        order: 4,
        text: "Sprinkle granola over berries",
        duration: 30,
        ingredients: ["108"]
      },
      {
        id: "89",
        order: 5,
        text: "Repeat layers and garnish with mint leaves",
        duration: 120,
        ingredients: ["111"]
      }
    ]
  }
];