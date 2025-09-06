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

    const response = processCommand(command.toLowerCase(), context)

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Voice chat error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I'm sorry, I didn't understand that. Please try again."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

function processCommand(command: string, context?: any): VoiceChatResponse {
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

  // Information commands
  if (command.includes('how long') || command.includes('cooking time') || command.includes('prep time')) {
    return {
      response: "Let me check the timing information for this recipe.",
      action: { type: 'info', data: { type: 'timing' } },
      tts: true
    }
  }

  if (command.includes('how many') && (command.includes('serving') || command.includes('portion'))) {
    return {
      response: "Let me tell you about the serving size for this recipe.",
      action: { type: 'info', data: { type: 'servings' } },
      tts: true
    }
  }

  // Recipe creation commands
  if (command.includes('create') && command.includes('recipe')) {
    let recipeType = 'general';
    if (command.includes('pasta')) recipeType = 'pasta';
    else if (command.includes('chicken')) recipeType = 'chicken';
    else if (command.includes('vegetarian')) recipeType = 'vegetarian';
    else if (command.includes('dessert')) recipeType = 'dessert';

    return {
      response: `I'd love to help you create a ${recipeType} recipe! Let me guide you through the process.`,
      action: { type: 'navigate', data: { page: 'create-recipe', recipeType } },
      tts: true
    }
  }

  // Help commands
  if (command.includes('help') || command.includes('what can you do')) {
    return {
      response: "I'm Chef Remy, your cooking assistant! I can help you navigate recipes, set timers, read ingredients and steps, and answer cooking questions. Just say 'Hey Chef' followed by what you need!",
      tts: true
    }
  }

  // Default response
  return {
    response: "I'm not sure how to help with that. Try asking me to go to the next step, set a timer, read ingredients, or ask what I can do!",
    tts: true
  }
}