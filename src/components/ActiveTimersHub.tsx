import { Timer, Trash2, MessageCircle, Play, Pause, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface ActiveTimer {
  id: string;
  duration: number;
  label: string;
  type: 'step' | 'voice';
  stepNumber?: number;
}

interface ActiveTimersHubProps {
  activeTimers: ActiveTimer[];
  onTimerComplete: (timerId: string) => void;
  onTimerRemove: (timerId: string) => void;
  onAskAI?: () => void;
  className?: string;
}

// Compact Timer Component
interface CompactTimerProps {
  timer: ActiveTimer;
  onComplete: (timerId: string) => void;
  onRemove: (timerId: string) => void;
}

function CompactTimer({ timer, onComplete, onRemove }: CompactTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timer.duration);
  const [isRunning, setIsRunning] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  // Handle timer completion in separate effect to avoid setState during render
  useEffect(() => {
    if (timeLeft === 0 && isCompleted && !isRunning) {
      onComplete(timer.id);
    }
  }, [timeLeft, isCompleted, isRunning, onComplete, timer.id]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes} min`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  const progress = ((timer.duration - timeLeft) / timer.duration) * 100;

  return (
    <div className="bg-white dark:bg-gray-900/50 rounded-md border border-orange-200 p-2 relative min-h-[60px] flex flex-col justify-between">
      {/* Header with badge and remove button */}
      <div className="flex items-center justify-between mb-1">
        <Badge 
          variant={timer.type === 'step' ? 'default' : 'secondary'}
          className="text-xs px-1 py-0.5 h-4"
        >
          {timer.type === 'step' ? `Step ${timer.stepNumber}` : 'Voice'}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(timer.id)}
          className="h-4 w-4 p-0 hover:bg-red-100 hover:text-red-600"
        >
          <Trash2 className="w-2.5 h-2.5" />
        </Button>
      </div>

      {/* Timer content */}
      <div className="flex-1 space-y-1">
        <div className="text-xs text-muted-foreground truncate" title={timer.label}>
          {timer.label}
        </div>
        
        {/* Time display */}
        <div className="flex items-center justify-between">
          <div className={`text-sm font-bold font-mono ${
            isCompleted ? 'text-green-600' : timeLeft <= 60 ? 'text-red-600' : 'text-orange-600'
          }`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDuration(timer.duration)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all duration-300 ease-linear ${
              isCompleted ? 'bg-green-500' : timeLeft <= 60 ? 'bg-red-500' : 'bg-orange-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
            className="h-5 w-5 p-0 hover:bg-gray-100"
          >
            {isRunning ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(timer.duration);
              setIsCompleted(false);
            }}
            className="h-5 w-5 p-0 hover:bg-gray-100"
          >
            <Square className="w-2.5 h-2.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ActiveTimersHub({
  activeTimers,
  onTimerComplete,
  onTimerRemove,
  onAskAI,
  className = ""
}: ActiveTimersHubProps) {
  if (activeTimers.length === 0) {
    return null;
  }

  return (
    <Card className={`${className} border border-orange-200 bg-orange-50 dark:bg-orange-950/20`}>
      <CardContent className="p-2">
        {/* Ultra-Compact Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-orange-600" />
            <h3 className="text-xs font-semibold text-foreground">
              Active Timers ({activeTimers.length})
            </h3>
          </div>
          {onAskAI && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onAskAI}
              className="text-xs h-6 px-2 border-orange-300 hover:bg-orange-100"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Ask AI
            </Button>
          )}
        </div>

        {/* Ultra-Compact Timers Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
          {activeTimers.map((timer) => (
            <CompactTimer
              key={timer.id}
              timer={timer}
              onComplete={onTimerComplete}
              onRemove={onTimerRemove}
            />
          ))}
        </div>

      </CardContent>
    </Card>
  );
}