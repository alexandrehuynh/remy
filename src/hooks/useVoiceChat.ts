import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTextToSpeech } from './useTextToSpeech';

interface VoiceChatContext {
  currentPage?: string;
  currentRecipe?: string;
  currentStep?: number;
}

interface VoiceChatResponse {
  response: string;
  action?: {
    type: 'navigate' | 'timer' | 'read' | 'info';
    data?: any;
  };
  tts?: boolean;
}

export const useVoiceChat = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('');
  const { speak } = useTextToSpeech();

  const processCommand = async (command: string, context?: VoiceChatContext): Promise<VoiceChatResponse | null> => {
    setIsProcessing(true);
    
    try {
      console.log('Sending command to voice chat:', command);
      
      const { data, error } = await supabase.functions.invoke('voice-chat', {
        body: { command, context }
      });

      if (error) {
        console.error('Voice chat error:', error);
        throw new Error(error.message);
      }

      const response: VoiceChatResponse = data;
      setLastResponse(response.response);

      // Speak the response if TTS is enabled
      if (response.tts && response.response) {
        await speak(response.response);
      }

      return response;
    } catch (error) {
      console.error('Failed to process voice command:', error);
      const errorMessage = "I'm sorry, I had trouble processing that command. Please try again.";
      setLastResponse(errorMessage);
      await speak(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processCommand,
    isProcessing,
    lastResponse
  };
};