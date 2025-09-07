import { useState, useRef, useCallback, useEffect } from 'react';
import { Conversation } from '@elevenlabs/client';
import { logger } from '@/lib/logger';

interface UseElevenLabsConversationOptions {
  agentId?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: string) => void;
  onError?: (error: string) => void;
  context?: Record<string, any>;
}

export const useElevenLabsConversation = ({
  agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID || 'agent_3501k4b6rc5nebvr4vcfct9wxkqr',
  onConnect,
  onDisconnect,
  onMessage,
  onError,
  context
}: UseElevenLabsConversationOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const conversationRef = useRef<Conversation | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const initializeAudioContext = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      if (!mediaStreamRef.current) {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
      }

      return true;
    } catch (error) {
      logger.error('Failed to initialize audio:', error);
      onError?.('Failed to access microphone');
      return false;
    }
  }, [onError]);

  const startConversation = useCallback(async () => {
    if (isConnected || isConnecting) return;

    setIsConnecting(true);

    try {
      const audioReady = await initializeAudioContext();
      if (!audioReady) {
        throw new Error('Audio initialization failed');
      }

      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      if (!apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      logger.debug('Starting ElevenLabs conversation with agent:', agentId);
      
      if (!agentId || agentId.length < 10) {
        throw new Error('Invalid ElevenLabs agent ID configured');
      }
      
      // Start the conversation session with updated API
      const conversation = await Conversation.startSession({
        signedUrl: `https://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`,
        onConnect: () => {
          logger.debug('ElevenLabs conversation connected successfully');
          setIsConnected(true);
          setIsConnecting(false);
          onConnect?.();
          
          // Send initial context to the agent
          if (context) {
            const contextMessage = `Context: ${JSON.stringify(context)}`;
            logger.debug('Sending context to agent:', contextMessage);
            // Note: Context should be sent as a system message or initial prompt
            // This depends on how the ElevenLabs agent is configured to handle context
          }
          
          onMessage?.('🤖 Connected to Chef Remy AI - ready to help with cooking!');
        },
        onDisconnect: () => {
          logger.debug('ElevenLabs conversation disconnected');
          setIsConnected(false);
          setIsSpeaking(false);
          onDisconnect?.();
        },
        onMessage: (message: any) => {
          logger.debug('ElevenLabs message received:', message);
          if (message) {
            // Handle different message types based on current API structure
            if (message.type === 'user_transcript' && message.transcript) {
              onMessage?.(`You: ${message.transcript}`);
            } else if (message.type === 'agent_response' && message.response) {
              onMessage?.(`Chef Remy: ${message.response}`);
            } else if (message.message) {
              onMessage?.(`Chef Remy: ${message.message}`);
            } else if (typeof message === 'string') {
              onMessage?.(`Chef Remy: ${message}`);
            }
          }
        },
        onError: (error: any) => {
          logger.error('ElevenLabs conversation error:', error);
          const errorMessage = error?.message || error?.error || error || 'Conversation error occurred';
          onError?.(errorMessage);
        },
        onStatusChange: (status: any) => {
          logger.debug('ElevenLabs status change:', status);
          if (status === 'connected') {
            setIsConnected(true);
            setIsConnecting(false);
          } else if (status === 'disconnected') {
            setIsConnected(false);
            setIsConnecting(false);
          }
        },
        onModeChange: (mode: any) => {
          logger.debug('ElevenLabs mode change:', mode);
          setIsSpeaking(mode === 'speaking');
        }
      });

      logger.debug('ElevenLabs conversation object created:', conversation);
      
      if (!conversation) {
        throw new Error('Failed to create ElevenLabs conversation session');
      }
      
      conversationRef.current = conversation;
      
      logger.debug('ElevenLabs conversation setup complete with callbacks');

    } catch (error) {
      logger.error('Failed to start conversation:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to start conversation');
      setIsConnecting(false);
    }
  }, [agentId, isConnected, isConnecting, onConnect, onDisconnect, onError, onMessage, initializeAudioContext, context]);

  const endConversation = useCallback(async () => {
    if (conversationRef.current) {
      try {
        logger.debug('Ending ElevenLabs conversation...');
        // Use the proper method to end the conversation
        await conversationRef.current.endSession();
      } catch (error) {
        logger.error('Error ending conversation:', error);
      }
      conversationRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        await audioContextRef.current.close();
      } catch (error) {
        logger.error('Error closing audio context:', error);
      }
      audioContextRef.current = null;
    }

    setIsConnected(false);
    setIsSpeaking(false);
    setIsConnecting(false);
    
    logger.debug('ElevenLabs conversation ended successfully');
  }, []);

  useEffect(() => {
    return () => {
      endConversation();
    };
  }, [endConversation]);

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    startConversation,
    endConversation
  };
};