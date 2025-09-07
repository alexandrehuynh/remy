import { useState, useEffect, useRef } from "react";
import { Volume2, Phone, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useElevenLabsConversation } from '@/hooks/useElevenLabsConversation';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/lib/logger';

interface VoiceAssistantProps {
  className?: string;
  onStepNavigation?: (direction: 'next' | 'previous') => void;
  onTimerRequest?: (duration: number) => void;
  onRepeatRequest?: () => void;
  currentStepText?: string;
  onRecipeSearch?: (recipes: unknown[]) => void;
  context?: {
    currentPage?: string;
    currentRecipe?: string;
    currentStep?: number;
  };
}

export function VoiceAssistant({ 
  className = "",
  onStepNavigation,
  onTimerRequest,
  onRepeatRequest,
  currentStepText,
  onRecipeSearch,
  context
}: VoiceAssistantProps) {
  const [displayText, setDisplayText] = useState("Ready to talk with Chef Remy");
  const [messages, setMessages] = useState<string[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const {
    isConnected: isElevenLabsConnected,
    isConnecting: isElevenLabsConnecting,
    startConversation,
    endConversation
  } = useElevenLabsConversation({
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
      setMessages(prev => [...prev.slice(-4), message]);
      setDisplayText(message);
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

  return (
    <Card className={`${className} border-2 border-border/50 overflow-hidden`}>
      <CardContent className="p-6">
        <div className={`flex transition-all duration-500 ${isElevenLabsConnected ? 'gap-6' : 'justify-center'}`}>
          {/* Main Voice Interface */}
          <div className={`flex flex-col items-center gap-4 ${isElevenLabsConnected ? 'w-1/2' : 'w-full'} transition-all duration-500`}>
            
            {/* Voice Button with Wave Animation */}
            <div className="relative">
              <Button
                onClick={handleVoiceToggle}
                size="lg"
                className={`
                  relative w-24 h-24 rounded-full border-0 transition-all duration-300 
                  ${getVoiceStateColor()}
                  hover:scale-105 active:scale-95
                `}
                disabled={isElevenLabsConnecting}
              >
                {/* Wave Animation Rings */}
                {(isElevenLabsConnected || isElevenLabsConnecting) && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse" />
                  </>
                )}
                
                {/* Icon */}
                {isElevenLabsConnected ? (
                  <PhoneOff className="w-10 h-10 text-white" />
                ) : isElevenLabsConnecting ? (
                  <Phone className="w-10 h-10 text-white animate-pulse" />
                ) : (
                  <Phone className="w-10 h-10 text-white" />
                )}
              </Button>

              {/* TTS Button - positioned to the side if conversation active */}
              {currentStepText && (
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
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-foreground">
                {getStatusText()}
              </p>
              
              {!isElevenLabsConnected && !isElevenLabsConnecting && (
                <p className="text-xs text-muted-foreground">
                  Ask for recipes, nutrition info, or cooking tips
                </p>
              )}
            </div>
          </div>

          {/* Chat History - slides in when connected with fixed height */}
          {isElevenLabsConnected && (
            <div className="w-1/2 flex flex-col animate-slide-in-right">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground border-b pb-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Conversation
              </div>
              
              {/* Fixed height chat container with scroll */}
              <div className="flex-1 h-48 bg-gray-50 dark:bg-gray-900/20 rounded-lg border overflow-hidden">
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}