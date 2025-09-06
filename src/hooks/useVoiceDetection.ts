import { useState, useEffect, useRef } from 'react';

interface VoiceDetectionOptions {
  wakeWord?: string;
  onWakeWordDetected?: () => void;
  onCommandCaptured?: (command: string) => void;
  onError?: (error: string) => void;
}

export const useVoiceDetection = ({
  wakeWord = 'hey chef',
  onWakeWordDetected,
  onCommandCaptured,
  onError
}: VoiceDetectionOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isCapturingCommand, setIsCapturingCommand] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [supported, setSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSupported(false);
      onError?.('Speech recognition not supported in this browser');
      return;
    }

    setSupported(true);
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.toLowerCase().trim();
        
        if (!isCapturingCommand) {
          // Check for wake word
          if (transcript.includes(wakeWord)) {
            console.log('Wake word detected:', transcript);
            setIsCapturingCommand(true);
            onWakeWordDetected?.();
            
            // Clear timeout if exists
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            
            // Set timeout to stop capturing after 5 seconds
            timeoutRef.current = setTimeout(() => {
              setIsCapturingCommand(false);
            }, 5000);
          }
        } else {
          // Capture command after wake word
          const command = transcript.replace(wakeWord, '').trim();
          if (command.length > 0) {
            console.log('Command captured:', command);
            setLastCommand(command);
            setIsCapturingCommand(false);
            onCommandCaptured?.(command);
            
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      onError?.(event.error);
      
      // Restart recognition on error
      if (isListening) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.log('Recognition already started');
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      // Restart recognition if we're still supposed to be listening
      if (isListening) {
        try {
          recognition.start();
        } catch (e) {
          console.log('Recognition already started');
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [wakeWord, isListening, isCapturingCommand, onWakeWordDetected, onCommandCaptured, onError]);

  const startListening = () => {
    if (!supported || !recognitionRef.current) return false;
    
    try {
      setIsListening(true);
      recognitionRef.current.start();
      return true;
    } catch (error) {
      console.error('Failed to start listening:', error);
      onError?.('Failed to start voice detection');
      return false;
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      setIsCapturingCommand(false);
      recognitionRef.current.stop();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  };

  return {
    isListening,
    isCapturingCommand,
    lastCommand,
    supported,
    startListening,
    stopListening
  };
};