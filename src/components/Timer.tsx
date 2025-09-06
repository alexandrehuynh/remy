import { useState, useEffect } from "react";
import { Timer as TimerIcon, Play, Pause, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TimerProps {
  duration: number; // in seconds
  label?: string;
  autoStart?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function Timer({ 
  duration, 
  label = "Timer", 
  autoStart = false, 
  onComplete,
  className = ""
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  const handleStart = () => {
    if (isCompleted) {
      setTimeLeft(duration);
      setIsCompleted(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    setIsCompleted(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    setIsCompleted(false);
  };

  const getTimerColor = () => {
    if (isCompleted) return 'text-cooking-success';
    if (timeLeft <= 60 && timeLeft > 0) return 'text-cooking-timer timer-urgent';
    if (timeLeft <= 300 && timeLeft > 60) return 'text-cooking-warning';
    return 'text-foreground';
  };

  return (
    <Card className={`${className} ${isCompleted ? 'border-cooking-success' : ''}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Timer Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TimerIcon className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">{label}</span>
            </div>
            {isCompleted && (
              <div className="text-sm font-medium text-cooking-success">
                Complete!
              </div>
            )}
          </div>

          {/* Time Display */}
          <div className="text-center">
            <div className={`text-3xl font-bold font-mono ${getTimerColor()}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {duration > 0 && `of ${formatTime(duration)}`}
            </div>
          </div>

          {/* Progress Bar */}
          <Progress 
            value={progress} 
            className="h-2"
          />

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-2">
            {!isRunning ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleStart}
                className="touch-target"
              >
                <Play className="w-4 h-4 mr-1" />
                {isCompleted ? 'Restart' : 'Start'}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePause}
                className="touch-target"
              >
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleStop}
              className="touch-target"
            >
              <Square className="w-4 h-4 mr-1" />
              Stop
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="touch-target"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}