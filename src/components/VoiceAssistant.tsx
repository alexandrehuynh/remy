import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVoiceDetection } from '@/hooks/useVoiceDetection';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useToast } from '@/components/ui/use-toast';

interface VoiceAssistantProps {
  className?: string;
  onStepNavigation?: (direction: 'next' | 'previous') => void;
  onTimerRequest?: (duration: number) => void;
  onRepeatRequest?: () => void;
  currentStepText?: string;
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
  context
}: VoiceAssistantProps) {
  const [displayText, setDisplayText] = useState("Ready for 'Hey Chef'");
  const { toast } = useToast();
  
  const { speak, stop, isPlaying } = useTextToSpeech();
  const { processCommand, isProcessing, lastResponse } = useVoiceChat();

  const handleWakeWordDetected = () => {
    setDisplayText("I'm listening! What can I help with?");
    toast({
      title: "Hey Chef Detected",
      description: "I'm listening for your command!",
    });
  };

  const handleCommandCaptured = async (command: string) => {
    setDisplayText(`Processing: "${command}"`);
    
    const response = await processCommand(command, context);
    
    if (response?.action) {
      switch (response.action.type) {
        case 'navigate':
          if (response.action.data?.direction) {
            onStepNavigation?.(response.action.data.direction);
          }
          break;
        case 'timer':
          if (response.action.data?.minutes) {
            onTimerRequest?.(response.action.data.minutes);
          }
          break;
        case 'read':
          if (response.action.data?.content === 'current-step' && currentStepText) {
            await speak(currentStepText);
          } else if (response.action.data?.content === 'ingredients') {
            onRepeatRequest?.();
          }
          break;
      }
    }
    
    setDisplayText("Ready for 'Hey Chef'");
  };

  const handleVoiceError = (error: string) => {
    console.error('Voice detection error:', error);
    toast({
      title: "Voice Error",
      description: error,
      variant: "destructive",
    });
  };

  const { 
    isListening, 
    isCapturingCommand, 
    supported, 
    startListening, 
    stopListening 
  } = useVoiceDetection({
    onWakeWordDetected: handleWakeWordDetected,
    onCommandCaptured: handleCommandCaptured,
    onError: handleVoiceError
  });

  useEffect(() => {
    if (isProcessing) {
      setDisplayText("Processing...");
    } else if (isCapturingCommand) {
      setDisplayText("Listening for your command...");
    } else if (isListening) {
      setDisplayText("Listening for 'Hey Chef'...");
    } else if (lastResponse) {
      setDisplayText(lastResponse);
    } else {
      setDisplayText("Ready for 'Hey Chef'");
    }
  }, [isListening, isCapturingCommand, isProcessing, lastResponse]);

  const handleToggle = async () => {
    if (isListening) {
      stopListening();
      setDisplayText("Voice detection stopped");
      toast({
        title: "Voice Assistant Stopped",
        description: "No longer listening for 'Hey Chef'",
      });
    } else {
      const started = startListening();
      if (started) {
        setDisplayText("Listening for 'Hey Chef'...");
        toast({
          title: "Voice Assistant Active",
          description: "Say 'Hey Chef' to get my attention!",
        });
      } else {
        toast({
          title: "Voice Assistant Error",
          description: "Failed to start voice detection",
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
    if (isCapturingCommand) return 'capturing';
    if (isListening) return 'listening';
    return 'inactive';
  };

  const getVoiceStateColor = () => {
    const state = getVoiceState();
    switch (state) {
      case 'capturing': return 'bg-green-500';
      case 'listening': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      default: return 'bg-muted';
    }
  };

  if (!supported) {
    return (
      <Card className={`${className} border-2 border-border/50`}>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Voice detection not supported in this browser
          </p>
        </CardContent>
      </Card>
    );
  }

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
                variant={isListening ? "voice" : "outline"}
                size="lg"
                className={`
                  w-20 h-20 rounded-full border-2 touch-target relative overflow-hidden
                  ${getVoiceStateColor()} hover:opacity-90 transition-all duration-300
                  ${isListening ? 'voice-listening' : ''}
                  ${isProcessing ? 'voice-pulse' : ''}
                `}
                disabled={isProcessing}
              >
                {isListening ? (
                  <Mic className="w-8 h-8 text-white" />
                ) : (
                  <MicOff className="w-8 h-8 text-white" />
                )}
                
                {/* Animated ring for listening state */}
                {(isListening || isCapturingCommand) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                )}
              </Button>
            </div>
          </div>

          {/* Status Text */}
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              {displayText}
            </p>
            
            {!isListening && !isProcessing && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Volume2 className="w-4 h-4" />
                <span>Voice commands available</span>
              </div>
            )}
          </div>

          {/* Voice Commands Hint */}
          {isCapturingCommand ? (
            <div className="text-xs text-green-400 max-w-sm animate-pulse">
              🎤 Say your command: "What's next?", "Set a timer for 5 minutes", or "Repeat that"
            </div>
          ) : isListening ? (
            <div className="text-xs text-blue-400 max-w-sm">
              Listening for "Hey Chef"...
            </div>
          ) : isProcessing ? (
            <div className="text-xs text-yellow-400 max-w-sm">
              🧠 Chef Remy is thinking...
            </div>
          ) : (
            <div className="text-xs text-muted-foreground max-w-sm">
              Tap the speaker to hear the current step, or "Hey Chef" to talk with Chef Remy
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}