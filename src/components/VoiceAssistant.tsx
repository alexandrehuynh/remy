import { useState, useEffect, useRef } from "react";
import { Volume2, Phone, PhoneOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useElevenLabsConversation } from '@/hooks/useElevenLabsConversation';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/lib/logger';
import voiceIcon from "@/assets/voice.png";

interface VoiceAssistantProps {
  className?: string;
  onStepNavigation?: (direction: 'next' | 'previous') => void;
  onTimerRequest?: (duration: number) => void;
  onRepeatRequest?: () => void;
  currentStepText?: string;
  onRecipeSearch?: (recipes: unknown[]) => void;
  onIngredientCheck?: (ingredientName: string) => void;
  onStepCompletion?: (stepIndex?: number) => void;
  compact?: boolean; // New compact mode prop
  onContextUpdate?: (updateContextFn: (context: any) => void) => void; // New callback to expose updateContext
  context?: {
    currentPage?: string;
    currentRecipe?: string;
    currentStep?: number;
    totalSteps?: number;
    completedSteps?: number[];
    availableIngredients?: string[];
    checkedIngredients?: string[];
    activeTimers?: Array<{ label: string; remaining: number }>;
    cookingSessionStarted?: boolean;
    recipeSteps?: Array<{
      stepNumber: number;
      text: string;
      isCompleted: boolean;
      isCurrent: boolean;
      duration?: number;
    }>;
  };
}

export function VoiceAssistant({ 
  className = "",
  onStepNavigation,
  onTimerRequest,
  onRepeatRequest,
  currentStepText,
  onRecipeSearch,
  onIngredientCheck,
  onStepCompletion,
  compact = false,
  onContextUpdate,
  context
}: VoiceAssistantProps) {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState("Ready to talk with Chef Remy");
  const [messages, setMessages] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(!compact);
  const [pendingRecipeSearch, setPendingRecipeSearch] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const {
    isConnected: isElevenLabsConnected,
    isConnecting: isElevenLabsConnecting,
    startConversation,
    endConversation,
    updateContext
  } = useElevenLabsConversation({
    context,
    onConnect: () => {
      setDisplayText("🤖 Connected to Chef Remy AI - Start talking!");
      toast({
        title: "Connected to Chef Remy",
        description: "You can now have a natural conversation with Chef Remy!",
      });
    },
    onDisconnect: () => {
      setDisplayText("Ready to talk with Chef Remy");
      toast({
        title: "Disconnected",
        description: "Voice conversation ended",
      });
    },
    onMessage: (message: string) => {
      if (!compact) {
        setMessages(prev => [...prev.slice(-4), message]);
      }
      setDisplayText(message);
      
      // Check for recipe search confirmation patterns in the message
      if (context?.currentPage === 'home' && message.toLowerCase().includes('would you like to start cooking')) {
        setPendingRecipeSearch('detected');
      }
      
      // Check for confirmation responses
      if (pendingRecipeSearch && (message.toLowerCase().includes('yes') || message.toLowerCase().includes('let\'s cook'))) {
        // Navigate to cooking mode with demo recipe
        navigate('/cook/1');
        setPendingRecipeSearch(null);
        toast({
          title: "Starting Cooking Session",
          description: "Let's get cooking! I'll guide you through each step.",
        });
      }
      
      // Process cooking mode commands
      if (context?.currentPage === 'cooking-mode') {
        const lowerMessage = message.toLowerCase();
        
        // Step completion commands
        if (lowerMessage.includes('finished') || lowerMessage.includes('done') || lowerMessage.includes('complete')) {
          if (lowerMessage.includes('step')) {
            onStepCompletion?.();
            toast({
              title: "Step Completed",
              description: "Moving to the next step!",
            });
          }
        }
        
        // Navigation commands
        if (lowerMessage.includes('next step')) {
          onStepNavigation?.('next');
        } else if (lowerMessage.includes('previous step') || lowerMessage.includes('go back')) {
          onStepNavigation?.('previous');
        }
        
        // Timer commands
        const timerMatch = lowerMessage.match(/set.*timer.*(\d+).*minute/);
        if (timerMatch) {
          const minutes = parseInt(timerMatch[1]);
          onTimerRequest?.(minutes);
          toast({
            title: "Timer Set",
            description: `Timer set for ${minutes} minutes`,
          });
        }
        
        // Ingredient checking commands
        context.availableIngredients?.forEach(ingredient => {
          if (lowerMessage.includes(ingredient.toLowerCase()) && (lowerMessage.includes('check') || lowerMessage.includes('mark'))) {
            onIngredientCheck?.(ingredient);
            toast({
              title: "Ingredient Checked",
              description: `Marked ${ingredient} as used`,
            });
          }
        });
      }
    },
    onError: (error: string) => {
      console.error('ElevenLabs error:', error);
      toast({
        title: "Voice Error",
        description: error,
        variant: "destructive",
      });
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Expose updateContext function to parent component
  useEffect(() => {
    if (onContextUpdate && updateContext) {
      onContextUpdate(updateContext);
    }
  }, [onContextUpdate, updateContext]);

  const handleVoiceToggle = async () => {
    logger.debug('[VoiceAssistant] Voice toggle clicked');
    
    if (isElevenLabsConnected) {
      logger.debug('[VoiceAssistant] Ending ElevenLabs conversation...');
      await endConversation();
    } else {
      logger.debug('[VoiceAssistant] Starting ElevenLabs conversation...');
      await startConversation();
    }
  };

  const handleReadStep = async () => {
    if (!currentStepText) {
      toast({
        title: "No Step Text",
        description: "No current step to read aloud",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use ElevenLabs TTS if available, otherwise fall back to browser TTS
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(currentStepText);
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      toast({
        title: "Speech Error",
        description: "Failed to read step aloud",
        variant: "destructive",
      });
    }
  };

  const getVoiceStateColor = () => {
    if (isElevenLabsConnected) return 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30'; 
    if (isElevenLabsConnecting) return 'bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/30';
    return 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'; 
  };

  const getStatusText = () => {
    if (isElevenLabsConnecting) return "Connecting to Chef Remy...";
    if (isElevenLabsConnected) return "🎤 Connected - Talk naturally!";
    return "Tap to start AI conversation";
  };

  // Check if we should use compact mode (also check for className that includes 'compact' or 'sidebar')
  const isCompactMode = compact || className.includes('compact');
  const isSidebarMode = className.includes('sidebar');
  
  return (
    <Card className={`${className} ${isSidebarMode ? 'border-0 shadow-none bg-transparent' : 'border-2 border-border/50'} overflow-hidden`}>
      <CardContent className={isSidebarMode ? "p-0" : isCompactMode ? "p-4" : "p-6"}>
        <div className={`${isSidebarMode ? 'space-y-3' : `flex transition-all duration-500 ${isElevenLabsConnected && !isCompactMode ? 'gap-6' : 'justify-center'}`}`}>
          {/* Main Voice Interface */}
          <div className={`${isSidebarMode ? 'w-full' : `flex flex-col items-center gap-4 ${isElevenLabsConnected && !isCompactMode ? 'w-1/2' : 'w-full'} transition-all duration-500`}`}>
            
            {/* Voice Button with Wave Animation */}
            <div className="relative flex justify-center">
              <Button
                onClick={handleVoiceToggle}
                size={isSidebarMode ? "default" : isCompactMode ? "default" : "lg"}
                className={`
                  relative ${isSidebarMode ? 'w-12 h-12' : isCompactMode ? 'w-16 h-16' : 'w-24 h-24'} rounded-full border-0 transition-all duration-300 
                  ${isElevenLabsConnected || isElevenLabsConnecting ? getVoiceStateColor() : 'bg-transparent'}
                  hover:scale-105 active:scale-95 flex items-center justify-center
                `}
                style={!isElevenLabsConnected && !isElevenLabsConnecting ? {
                  backgroundImage: `url(${voiceIcon})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                } : undefined}
                disabled={isElevenLabsConnecting}
              >
                {/* Wave Animation Rings */}
                {(isElevenLabsConnected || isElevenLabsConnecting) && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse" />
                  </>
                )}
                
                {/* Voice Icon */}
                {isElevenLabsConnected ? (
                  <PhoneOff className={`${isSidebarMode ? 'w-4 h-4' : isCompactMode ? 'w-6 h-6' : 'w-10 h-10'} text-white`} />
                ) : null}
              </Button>

              {/* TTS Button - positioned to the side if conversation active */}
              {currentStepText && !isCompactMode && !isSidebarMode && (
                <div className={`absolute ${isElevenLabsConnected ? '-left-16' : '-right-16'} top-1/2 -translate-y-1/2`}>
                  <Button
                    onClick={handleReadStep}
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 rounded-full"
                    title="Read current step aloud"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Status Text */}
            {!isSidebarMode && (
              <div className="text-center space-y-2">
                <p className={`${isCompactMode ? 'text-xs' : 'text-sm'} font-medium text-white drop-shadow-lg`}>
                  {isCompactMode && isElevenLabsConnected ? displayText.slice(0, 50) + (displayText.length > 50 ? '...' : '') : getStatusText()}
                </p>
                
                {!isElevenLabsConnected && !isElevenLabsConnecting && !isCompactMode && (
                  <p className="text-xs text-white/90 drop-shadow-md">
                    Ask for recipes, nutrition info, or cooking tips
                  </p>
                )}
              </div>
            )}
            
            {/* Sidebar Status - Compact */}
            {isSidebarMode && (
              <div className="text-center mt-2">
                <p className="text-xs font-medium text-foreground">
                  {isElevenLabsConnected ? "🎤 Chef Remy" : "Talk to AI"}
                </p>
                {isElevenLabsConnected && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {displayText.slice(0, 40)}...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Chat History - different layouts based on mode */}
          {isElevenLabsConnected && !isCompactMode && (
            <div className={`${isSidebarMode ? 'w-full mt-3' : 'w-1/2'} flex flex-col ${!isSidebarMode ? 'animate-slide-in-right' : ''}`}>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground border-b pb-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Conversation
              </div>
              
              {/* Fixed height chat container with scroll */}
              <div className={`${isSidebarMode ? 'h-48 max-h-48' : 'h-48 max-h-48'} bg-gray-50 dark:bg-gray-900/20 rounded-lg border overflow-hidden flex-shrink-0`}>
                <div ref={chatContainerRef} className="h-full overflow-y-auto p-3 space-y-2 scroll-smooth">
                  {messages.length > 0 ? (
                    messages.map((message, index) => (
                      <div 
                        key={index} 
                        className={`text-xs p-2 rounded-lg max-w-[85%] ${
                          message.startsWith('You:') 
                            ? 'bg-blue-500 text-white ml-auto' 
                            : 'bg-white dark:bg-gray-800 border'
                        }`}
                      >
                        <div className="font-medium text-[10px] opacity-70 mb-1">
                          {message.startsWith('You:') ? 'You' : 'Chef Remy'}
                        </div>
                        <div>
                          {message.replace(/^(You:|Chef Remy:)\s*/, '')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground italic text-center py-8">
                      Start talking to see your conversation here
                    </div>
                  )}
                </div>
              </div>
              
              {/* TTS Button for sidebar mode */}
              {isSidebarMode && currentStepText && (
                <div className="flex justify-center mt-2">
                  <Button
                    onClick={handleReadStep}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    title="Read current step aloud"
                  >
                    <Volume2 className="h-3 w-3 mr-1" />
                    Read Step
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}