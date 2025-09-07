import { useState } from "react";
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
    if (isElevenLabsConnected) return 'bg-red-500 hover:bg-red-600'; // Red for hang up
    if (isElevenLabsConnecting) return 'bg-yellow-500';
    return 'bg-green-500 hover:bg-green-600'; // Green for start call
  };

  const getVoiceIcon = () => {
    if (isElevenLabsConnected) return <PhoneOff className="w-8 h-8 text-white" />;
    if (isElevenLabsConnecting) return <Phone className="w-8 h-8 text-white" />;
    return <Phone className="w-8 h-8 text-white" />;
  };

  const getButtonText = () => {
    if (isElevenLabsConnected) return "Tap to hang up";
    if (isElevenLabsConnecting) return "Connecting...";
    return "Tap to start conversation";
  };

  return (
    <Card className={`${className} border-2 border-border/50`}>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          {/* Voice Controls */}
          <div className="flex items-center gap-4">
            {/* Text-to-Speech Button - only show if there's step text */}
            {currentStepText && (
              <div className="relative">
                <Button
                  onClick={handleReadStep}
                  variant="outline"
                  size="lg"
                  className="relative h-12 w-12 rounded-full"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Main Voice Conversation Button */}
            <div className="relative">
              <Button
                onClick={handleVoiceToggle}
                size="lg"
                className={`
                  w-20 h-20 rounded-full border-2 touch-target relative overflow-hidden
                  ${getVoiceStateColor()} transition-all duration-300 text-white font-medium
                  ${isElevenLabsConnecting ? 'animate-pulse' : ''}
                `}
                disabled={isElevenLabsConnecting}
              >
                {getVoiceIcon()}
              </Button>
              
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs text-muted-foreground">
                  {getButtonText()}
                </span>
              </div>
            </div>
          </div>

          {/* Status Text */}
          <div className="space-y-2 max-w-md">
            <p className="text-lg font-medium text-foreground">
              {displayText}
            </p>
            
            {/* Recent Messages */}
            {messages.length > 0 && (
              <div className="space-y-1 text-sm text-muted-foreground max-h-32 overflow-y-auto">
                {messages.slice(-3).map((message, index) => (
                  <p key={index} className="text-left bg-muted/30 rounded p-2">
                    {message}
                  </p>
                ))}
              </div>
            )}
            
            {!isElevenLabsConnected && !isElevenLabsConnecting && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Volume2 className="w-4 h-4" />
                <span>AI voice conversation ready</span>
              </div>
            )}
          </div>

          {/* Voice Conversation Hint */}
          {isElevenLabsConnecting ? (
            <div className="text-xs text-yellow-400 max-w-sm animate-pulse">
              🔗 Connecting to Chef Remy AI...
            </div>
          ) : isElevenLabsConnected ? (
            <div className="text-xs text-green-400 max-w-sm">
              🎤 Talk naturally! Ask for recipes, nutrition info, cooking tips, or anything else!
            </div>
          ) : (
            <div className="text-xs text-muted-foreground max-w-sm">
              {currentStepText && "Tap the speaker to hear the current step, or "}
              Tap the phone to start an AI conversation with Chef Remy
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}