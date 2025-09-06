import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface VoiceAssistantProps {
  isListening?: boolean;
  isProcessing?: boolean;
  onToggleListening?: () => void;
  lastResponse?: string;
  className?: string;
}

export function VoiceAssistant({ 
  isListening = false, 
  isProcessing = false,
  onToggleListening,
  lastResponse,
  className = ""
}: VoiceAssistantProps) {
  const [displayText, setDisplayText] = useState("Say 'Hey Chef' to start");

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

  return (
    <Card className={`${className} border-2 border-border/50`}>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          {/* Voice Indicator */}
          <div className="relative">
            <Button
              variant="outline"
              size="lg"
              className={`
                w-20 h-20 rounded-full border-2 touch-target relative overflow-hidden
                ${getVoiceStateColor()} hover:opacity-90 transition-all duration-300
                ${isListening ? 'voice-listening' : ''}
                ${isProcessing ? 'voice-pulse' : ''}
              `}
              onClick={onToggleListening}
            >
              {isListening ? (
                <Mic className="w-8 h-8 text-white" />
              ) : (
                <MicOff className="w-8 h-8 text-white" />
              )}
              
              {/* Animated ring for listening state */}
              {isListening && (
                <div className="voice-ring" />
              )}
            </Button>
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
          {!isListening && !isProcessing && (
            <div className="text-xs text-muted-foreground max-w-sm">
              Try: "What's next?", "Set timer for 5 minutes", "How much salt?"
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}