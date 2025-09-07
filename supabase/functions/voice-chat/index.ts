import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VoiceChatRequest {
  command: string;
  context?: {
    currentPage?: string;
    currentRecipe?: string;
    currentStep?: number;
  };
}

interface VoiceChatResponse {
  response: string;
  action?: {
    type: 'navigate' | 'timer' | 'read' | 'info';
    data?: any;
  };
  tts?: boolean;
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const EDAMAM_RECIPE_APP_ID = 'bd205a75'
const EDAMAM_RECIPE_APP_KEY = 'be041b453651cdd575d68d91e5eab5be'
const EDAMAM_NUTRITION_APP_ID = '3fce856d'
const EDAMAM_NUTRITION_APP_KEY = 'c51fbf555cd8fa3a24e8209d285ef48f'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { command, context }: VoiceChatRequest = await req.json()

    if (!command) {
      throw new Error('Command is required')
    }

    console.log('Processing voice command:', command, 'Context:', context)

    // First try basic commands
    const basicResponse = processBasicCommand(command.toLowerCase(), context)
    if (basicResponse) {
      return new Response(
        JSON.stringify(basicResponse),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Use OpenAI for complex commands (recipe search, nutrition analysis)
    const aiResponse = await processAICommand(command, context)

    return new Response(
      JSON.stringify(aiResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Voice chat error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I'm sorry, I encountered an error. Please try again."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

function processBasicCommand(command: string, context?: any): VoiceChatResponse | null {
  // Navigation commands
  if (command.includes('next step') || command.includes('what\'s next')) {
    return {
      response: "Moving to the next step for you!",
      action: { type: 'navigate', data: { direction: 'next' } },
      tts: true
    }
  }

  if (command.includes('previous step') || command.includes('go back') || command.includes('last step')) {
    return {
      response: "Going back to the previous step.",
      action: { type: 'navigate', data: { direction: 'previous' } },
      tts: true
    }
  }

  // Timer commands
  if (command.includes('timer') || command.includes('set timer')) {
    const timeMatch = command.match(/(\d+)\s*(minute|minutes|min|mins)/);
    if (timeMatch) {
      const minutes = parseInt(timeMatch[1]);
      return {
        response: `Setting a ${minutes} minute timer for you!`,
        action: { type: 'timer', data: { minutes } },
        tts: true
      }
    } else {
      return {
        response: "How long would you like me to set the timer for? Please specify the number of minutes.",
        tts: true
      }
    }
  }

  // Reading commands
  if (command.includes('read') && (command.includes('ingredients') || command.includes('ingredient'))) {
    return {
      response: "Here are the ingredients for this recipe:",
      action: { type: 'read', data: { content: 'ingredients' } },
      tts: true
    }
  }

  if (command.includes('read') && command.includes('step')) {
    return {
      response: "Let me read the current step for you:",
      action: { type: 'read', data: { content: 'current-step' } },
      tts: true
    }
  }

  if (command.includes('repeat') || command.includes('say that again')) {
    return {
      response: "Let me repeat the current step:",
      action: { type: 'read', data: { content: 'current-step' } },
      tts: true
    }
  }

  // Help commands
  if (command.includes('help') || command.includes('what can you do')) {
    return {
      response: "I'm Chef Remy, your cooking assistant! I can help you navigate recipes, set timers, read ingredients and steps, search for recipes, analyze nutrition, and answer cooking questions. Just ask me naturally!",
      tts: true
    }
  }

  return null; // No basic command match, use AI
}

async function processAICommand(command: string, context?: any): Promise<VoiceChatResponse> {
  if (!OPENAI_API_KEY) {
    return {
      response: "I need an OpenAI API key to process complex commands. Please configure it in the environment.",
      tts: true
    }
  }

  try {
    // Determine if this is a recipe search or nutrition analysis
    if (isRecipeSearchCommand(command)) {
      return await handleRecipeSearch(command)
    } else if (isNutritionCommand(command)) {
      return await handleNutritionAnalysis(command)
    } else {
      // Use OpenAI for general cooking questions and complex reasoning
      return await handleGeneralQuery(command, context)
    }
  } catch (error) {
    console.error('AI processing error:', error)
    return {
      response: "I had trouble processing that request. Could you try rephrasing it?",
      tts: true
    }
  }
}

function isRecipeSearchCommand(command: string): boolean {
  const recipeKeywords = ['recipe', 'recipes', 'find', 'search', 'look up', 'cooking', 'dish', 'meal', 'food']
  return recipeKeywords.some(keyword => command.toLowerCase().includes(keyword))
}

function isNutritionCommand(command: string): boolean {
  const nutritionKeywords = ['nutrition', 'calories', 'protein', 'fat', 'carbs', 'nutrients', 'nutritional', 'analyze']
  return nutritionKeywords.some(keyword => command.toLowerCase().includes(keyword))
}

async function handleRecipeSearch(command: string): Promise<VoiceChatResponse> {
  try {
    // Extract search query using OpenAI
    const queryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Extract a concise search query from the user\'s recipe request. Return only the search terms, nothing else.'
          },
          {
            role: 'user',
            content: command
          }
        ],
        max_tokens: 50
      })
    })

    const queryResult = await queryResponse.json()
    const searchQuery = queryResult.choices?.[0]?.message?.content?.trim() || command

    // Search Edamam API
    const params = new URLSearchParams({
      type: 'public',
      q: searchQuery,
      app_id: EDAMAM_RECIPE_APP_ID,
      app_key: EDAMAM_RECIPE_APP_KEY,
      from: '0',
      to: '3'
    })

    const edamamResponse = await fetch(`https://api.edamam.com/api/recipes/v2?${params.toString()}`)
    const edamamData = await edamamResponse.json()

    if (edamamData.hits && edamamData.hits.length > 0) {
      const recipes = edamamData.hits.slice(0, 3)
      let response = `I found ${recipes.length} great ${searchQuery} recipe${recipes.length > 1 ? 's' : ''} for you:\n\n`
      
      recipes.forEach((hit: any, index: number) => {
        const recipe = hit.recipe
        response += `${index + 1}. ${recipe.label}\n`
        if (recipe.cuisineType?.length > 0) {
          response += `   Cuisine: ${recipe.cuisineType[0]}\n`
        }
        if (recipe.totalTime > 0) {
          response += `   Cook time: ${recipe.totalTime} minutes\n`
        }
        response += `   Calories: ${Math.round(recipe.calories)} total\n\n`
      })

      response += "Would you like more details about any of these recipes?"

      return {
        response: response,
        tts: true
      }
    } else {
      return {
        response: `I couldn't find any recipes for "${searchQuery}". Try being more specific or asking for a different type of dish!`,
        tts: true
      }
    }
  } catch (error) {
    console.error('Recipe search error:', error)
    return {
      response: "I had trouble searching for recipes. Please try again with a different search term.",
      tts: true
    }
  }
}

async function handleNutritionAnalysis(command: string): Promise<VoiceChatResponse> {
  try {
    // Extract ingredient using OpenAI
    const ingredientResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Extract the ingredient and quantity from the nutrition request. Format as "quantity ingredient" (e.g., "1 cup rice", "100g chicken breast"). Return only the ingredient string.'
          },
          {
            role: 'user',
            content: command
          }
        ],
        max_tokens: 50
      })
    })

    const ingredientResult = await ingredientResponse.json()
    const ingredient = ingredientResult.choices?.[0]?.message?.content?.trim() || command

    // Analyze nutrition with Edamam
    const params = new URLSearchParams({
      ingr: ingredient,
      app_id: EDAMAM_NUTRITION_APP_ID,
      app_key: EDAMAM_NUTRITION_APP_KEY
    })

    const nutritionResponse = await fetch(`https://api.edamam.com/api/nutrition-data?${params.toString()}`)
    const nutritionData = await nutritionResponse.json()

    if (nutritionData.calories) {
      let response = `Nutrition information for ${ingredient}:\n\n`
      response += `Calories: ${Math.round(nutritionData.calories)}\n`
      response += `Protein: ${Math.round(nutritionData.totalNutrients?.PROCNT?.quantity || 0)}g\n`
      response += `Fat: ${Math.round(nutritionData.totalNutrients?.FAT?.quantity || 0)}g\n`
      response += `Carbs: ${Math.round(nutritionData.totalNutrients?.CHOCDF?.quantity || 0)}g\n`
      response += `Fiber: ${Math.round(nutritionData.totalNutrients?.FIBTG?.quantity || 0)}g\n`

      return {
        response: response,
        tts: true
      }
    } else {
      return {
        response: `I couldn't analyze the nutrition for "${ingredient}". Please try with a more specific ingredient and quantity, like "1 cup rice" or "100g chicken breast".`,
        tts: true
      }
    }
  } catch (error) {
    console.error('Nutrition analysis error:', error)
    return {
      response: "I had trouble analyzing the nutrition. Please try again with a specific ingredient and quantity.",
      tts: true
    }
  }
}

async function handleGeneralQuery(command: string, context?: any): Promise<VoiceChatResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are Chef Remy, a helpful cooking assistant. Provide conversational, friendly responses about cooking, recipes, and food. Keep responses concise but helpful. Context: ${JSON.stringify(context || {})}`
          },
          {
            role: 'user',
            content: command
          }
        ],
        max_tokens: 200
      })
    })

    const result = await response.json()
    const aiResponse = result.choices?.[0]?.message?.content?.trim() || "I'm not sure how to help with that. Try asking about recipes, nutrition, or cooking techniques!"

    return {
      response: aiResponse,
      tts: true
    }
  } catch (error) {
    console.error('OpenAI error:', error)
    return {
      response: "I'm having trouble thinking right now. Please try your question again!",
      tts: true
    }
  }
}