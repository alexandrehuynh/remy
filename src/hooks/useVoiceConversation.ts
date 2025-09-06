import { useConversation } from '@11labs/react';
import { supabase } from '@/integrations/supabase/client';

interface UseVoiceConversationProps {
  onStepNavigation?: (direction: 'next' | 'previous') => void;
  onTimerRequest?: (duration: number) => void;
  onRepeatRequest?: () => void;
  agentId?: string;
}

export const useVoiceConversation = ({
  onStepNavigation,
  onTimerRequest,
  onRepeatRequest,
  agentId
}: UseVoiceConversationProps = {}) => {
  
  const conversation = useConversation({
    onConnect: () => {
      console.log('Voice conversation connected');
    },
    onDisconnect: () => {
      console.log('Voice conversation disconnected');
    },
    onMessage: (message) => {
      console.log('Voice message:', message);
    },
    onError: (error) => {
      console.error('Voice conversation error:', error);
    },
    clientTools: {
      nextStep: () => {
        onStepNavigation?.('next');
        return "Moving to next step";
      },
      previousStep: () => {
        onStepNavigation?.('previous');
        return "Moving to previous step";
      },
      setTimer: (parameters: { minutes: number }) => {
        const seconds = parameters.minutes * 60;
        onTimerRequest?.(seconds);
        return `Timer set for ${parameters.minutes} minutes`;
      },
      repeatStep: () => {
        onRepeatRequest?.();
        return "Repeating current step";
      }
    },
    overrides: {
      agent: {
        prompt: {
          prompt: `You are a helpful cooking assistant named Chef Remy. You help users while they cook by:
          - Reading out cooking instructions clearly
          - Setting timers when requested
          - Navigating between recipe steps
          - Answering cooking questions
          - Providing encouragement and tips
          
          Keep responses brief and cooking-focused. Always be encouraging and helpful.`
        },
        firstMessage: "Hi! I'm Chef Remy, your voice cooking assistant. I'm here to help you cook! What would you like to know?",
        language: "en"
      },
      tts: {
        voiceId: "EXAVITQu4vr4xnSDxMaL" // Sarah's voice - clear and friendly
      }
    }
  });

  const startConversation = async () => {
    try {
      // Request microphone access first
      await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!agentId) {
        throw new Error('ElevenLabs agent ID is required. Please create a Conversational AI agent at https://elevenlabs.io/conversational-ai and provide the agent ID.');
      }

      // Get signed URL from our edge function
      const { data, error } = await supabase.functions.invoke('get-signed-url', {
        body: { agent_id: agentId }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.signed_url) {
        throw new Error('Failed to get signed URL from ElevenLabs');
      }

      // Start session with signed URL
      await conversation.startSession({ signedUrl: data.signed_url });
    } catch (error) {
      console.error('Failed to start voice conversation:', error);
      throw error;
    }
  };

  return {
    ...conversation,
    startConversation
  };
};