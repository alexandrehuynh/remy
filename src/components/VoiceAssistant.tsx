import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVoiceConversation } from '@/hooks/useVoiceConversation';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useToast } from '@/components/ui/use-toast';

interface VoiceAssistantProps {
  isListening?: boolean;
  isProcessing?: boolean;
  onToggleListening?: () => void;
  lastResponse?: string;
  className?: string;
  onStepNavigation?: (direction: 'next' | 'previous') => void;
  onTimerRequest?: (duration: number) => void;
  onRepeatRequest?: () => void;
  currentStepText?: string;
}

export function VoiceAssistant({ 
  isListening = false, 
  isProcessing = false,
  onToggleListening,
  lastResponse,
  className = "",
  onStepNavigation,
  onTimerRequest,
  onRepeatRequest,
  currentStepText
}: VoiceAssistantProps) {
  const [displayText, setDisplayText] = useState("Say 'Hey Chef' to start");
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();
  
  const { speak, stop, isPlaying } = useTextToSpeech();
  
  const { startConversation, endSession, status, isSpeaking } = useVoiceConversation({
    onStepNavigation,
    onTimerRequest,
    onRepeatRequest,
    agentId: "your-elevenlabs-agent-id" // Replace with your actual ElevenLabs agent ID
  });

  useEffect(() => {
    if (isProcessing) {
      setDisplayText("Processing...");
    } else if (isListening) {
      setDisplayText("Listening... Say your command");
    } else if (lastResponse) {
      setDisplayText(lastResponse);
    } else {
      setDisplayText("Say 'Hey Chef' to start");
    }
  }, [isListening, isProcessing, lastResponse]);

  const handleToggle = async () => {
    if (isActive) {
      setIsActive(false);
      onToggleListening?.();
      await endSession();
    } else {
      try {
        setIsActive(true);
        onToggleListening?.();
        await startConversation();
        
        toast({
          title: "Voice Assistant Active",
          description: "I'm listening! You can ask me about cooking steps, set timers, or navigate the recipe.",
        });
      } catch (error) {
        setIsActive(false);
        onToggleListening?.();
        toast({
          title: "Voice Assistant Error",
          description: error instanceof Error ? error.message : "Failed to start voice assistant",
          variant: "destructive",
        });
      }
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
      await speak(currentStepText);
    } catch (error) {
      toast({
        title: "Speech Error",
        description: "Failed to read step aloud",
        variant: "destructive",
      });
    }
  };

  const getVoiceState = () => {
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    return 'active';
  };

  const getVoiceStateColor = () => {
    const state = getVoiceState();
    switch (state) {
      case 'listening': return 'bg-voice-listening';
      case 'processing': return 'bg-voice-processing';
      default: return 'bg-voice-active';
    }
  };

  const isConnected = status === 'connected';
  const isCurrentlyListening = isActive && isConnected;

  return (
    <Card className={`${className} border-2 border-border/50`}>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          {/* Voice Controls */}
          <div className="flex items-center gap-4">
            {/* Text-to-Speech Button */}
            <div className="relative">
              <Button
                onClick={handleReadStep}
                variant={isPlaying ? "voice" : "outline"}
                size="lg"
                className="relative h-12 w-12 rounded-full"
                disabled={!currentStepText}
              >
                <Volume2 className="h-5 w-5" />
              </Button>
              
              {isPlaying && (
                <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse" />
              )}
            </div>

            {/* Voice Conversation Button */}
            <div className="relative">
              <Button
                onClick={handleToggle}
                variant={isCurrentlyListening ? "voice" : "outline"}
                size="lg"
                className={`
                  w-20 h-20 rounded-full border-2 touch-target relative overflow-hidden
                  ${getVoiceStateColor()} hover:opacity-90 transition-all duration-300
                  ${isCurrentlyListening ? 'voice-listening' : ''}
                  ${isProcessing ? 'voice-pulse' : ''}
                `}
              >
                {isCurrentlyListening ? (
                  <Mic className="w-8 h-8 text-white" />
                ) : (
                  <MicOff className="w-8 h-8 text-white" />
                )}
                
                {/* Animated ring for listening state */}
                {(isCurrentlyListening || isSpeaking) && (
                  <div className="voice-ring" />
                )}
              </Button>
            </div>
          </div>

          {/* Status Text */}
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              {isCurrentlyListening 
                ? (isSpeaking ? 'Chef Remy is speaking...' : 'Listening...') 
                : displayText
              }
            </p>
            
            {!isCurrentlyListening && !isProcessing && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Volume2 className="w-4 h-4" />
                <span>Voice commands available</span>
              </div>
            )}
          </div>

          {/* Voice Commands Hint */}
          {isCurrentlyListening && !isSpeaking ? (
            <div className="text-xs text-muted-foreground max-w-sm">
              Try: "What's next?", "Set a timer for 5 minutes", or "Repeat that"
            </div>
          ) : !isCurrentlyListening && !isProcessing ? (
            <div className="text-xs text-muted-foreground max-w-sm">
              Tap the speaker to hear the current step, or the mic to talk with Chef Remy
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}