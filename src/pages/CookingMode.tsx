import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, RotateCcw, VolumeX, Volume2, Timer as TimerIcon, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { ActiveTimersHub } from "@/components/ActiveTimersHub";
import { useToast } from "@/components/ui/use-toast";
import { demoRecipes } from "@/lib/demo-data";
import { logger } from "@/lib/logger";

export function CookingMode() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const recipe = demoRecipes.find(r => r.id === recipeId) || demoRecipes[0];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [activeTimers, setActiveTimers] = useState<{ id: string; duration: number; label: string; type: 'step' | 'voice'; stepNumber?: number }[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [contextUpdateFn, setContextUpdateFn] = useState<((context: any) => void) | null>(null);
  const [showTimerInput, setShowTimerInput] = useState(false);
  const [customTimerDuration, setCustomTimerDuration] = useState('');

  const currentStep = recipe.steps[currentStepIndex];
  const progress = (completedSteps.size / recipe.steps.length) * 100;

  useEffect(() => {
    if (!sessionStarted) {
      setSessionStarted(true);
      
      // Request notification permission for timer alerts
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            logger.debug('Notification permission granted for timer alerts');
          }
        });
      }
    }
  }, [sessionStarted]);

  const handleNextStep = () => {
    if (currentStepIndex < recipe.steps.length - 1) {
      // Mark current step as completed
      setCompletedSteps(prev => new Set(prev.add(currentStepIndex)));
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleStepCompletion = (stepIndex?: number) => {
    const targetStep = stepIndex ?? currentStepIndex;
    setCompletedSteps(prev => new Set(prev.add(targetStep)));
    
    // Auto-advance to next step if we completed the current step
    if (targetStep === currentStepIndex && currentStepIndex < recipe.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  // Handle manual step completion toggle when clicking on step circles
  const handleStepToggle = (stepIndex: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the step navigation
    
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepIndex)) {
        newSet.delete(stepIndex); // Uncross if already completed
      } else {
        newSet.add(stepIndex); // Cross out if not completed
      }
      return newSet;
    });
  };


  const handleIngredientToggle = (ingredientId: string) => {
    setCheckedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientId)) {
        newSet.delete(ingredientId);
      } else {
        newSet.add(ingredientId);
      }
      return newSet;
    });
  };


  const handleTimerRequest = (minutes: number) => {
    const newTimer = {
      id: `timer-${Date.now()}`,
      duration: minutes * 60, // convert to seconds
      label: `Voice Timer (${minutes} min)`,
      type: 'voice' as const
    };
    setActiveTimers(prev => [...prev, newTimer]);
  };

  // New function for step-based timers
  const handleStepTimerStart = (stepIndex: number, duration: number) => {
    const step = recipe.steps[stepIndex];
    const newTimer = {
      id: `step-timer-${stepIndex}-${Date.now()}`,
      duration: duration,
      label: shortenTimerLabel(step.text),
      type: 'step' as const,
      stepNumber: step.order
    };
    setActiveTimers(prev => [...prev, newTimer]);
    setShowTimerInput(false);
    setCustomTimerDuration('');
  };

  const handleCustomTimerStart = () => {
    const duration = parseInt(customTimerDuration);
    if (!isNaN(duration) && duration > 0) {
      handleStepTimerStart(currentStepIndex, duration * 60); // Convert minutes to seconds
    }
  };

  // Intelligent timer label shortening system
  const shortenTimerLabel = (text: string): string => {
    const patterns = [
      { keywords: ['water', 'boil'], replacement: 'Pasta water' },
      { keywords: ['water', 'pot'], replacement: 'Water' },
      { keywords: ['chicken', 'season'], replacement: 'Season chicken' },
      { keywords: ['chicken', 'cook'], replacement: 'Cook chicken' },
      { keywords: ['pasta', 'cook'], replacement: 'Cook pasta' },
      { keywords: ['pasta', 'fettuccine'], replacement: 'Cook pasta' },
      { keywords: ['garlic', 'mince'], replacement: 'Mince garlic' },
      { keywords: ['garlic', 'butter'], replacement: 'Garlic butter' },
      { keywords: ['butter', 'melt'], replacement: 'Melt butter' },
      { keywords: ['cream', 'pour'], replacement: 'Add cream' },
      { keywords: ['cheese', 'parmesan'], replacement: 'Add cheese' },
      { keywords: ['bread', 'toast'], replacement: 'Toast bread' },
      { keywords: ['onion'], replacement: 'Prep onion' },
      { keywords: ['olive oil'], replacement: 'Heat oil' }
    ];

    const lowerText = text.toLowerCase();
    
    // Find matching pattern
    for (const pattern of patterns) {
      const hasAllKeywords = pattern.keywords.every(keyword => 
        lowerText.includes(keyword.toLowerCase())
      );
      if (hasAllKeywords) {
        return pattern.replacement;
      }
    }
    
    // Fallback: First 15 characters + "..."
    return text.length > 15 ? text.slice(0, 15) + '...' : text;
  };

  const handleTimerInputToggle = () => {
    setShowTimerInput(!showTimerInput);
    setCustomTimerDuration(currentStep.duration ? Math.floor(currentStep.duration / 60).toString() : '5');
  };

  const handleTimerComplete = (timerId: string) => {
    const completedTimer = activeTimers.find(timer => timer.id === timerId);
    setActiveTimers(prev => prev.filter(timer => timer.id !== timerId));
    
    // Enhanced notification system
    if (completedTimer) {
      // Visual notification with Ask AI option
      toast({
        title: "⏰ Timer Complete!",
        description: (
          <div className="space-y-2">
            <p>{completedTimer.label}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAskAI(`Timer completed: ${completedTimer.label}. What should I do next?`)}
              className="w-full"
            >
              <Bell className="w-3 h-3 mr-1" />
              Ask Chef Remy for Next Steps
            </Button>
          </div>
        ),
        duration: 8000, // Longer duration to give user time to interact
      });

      // Audio notification
      if (isSoundOn && 'speechSynthesis' in window) {
        const message = completedTimer.type === 'step' 
          ? `Step ${completedTimer.stepNumber} timer finished! Check your cooking progress.`
          : `Voice timer finished for ${completedTimer.label}`;
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }

      // Browser notification (if permission granted)
      if (Notification.permission === 'granted') {
        new Notification('Cooking Timer Complete', {
          body: `${completedTimer.label} - Check your progress!`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'cooking-timer'
        });
      }
    }
  };

  const handleTimerRemove = (timerId: string) => {
    setActiveTimers(prev => prev.filter(timer => timer.id !== timerId));
  };

  const handleAskAI = (context?: string) => {
    // Cost-effective voice connection: only activate when user requests help
    console.log('User requested AI help:', context || 'General cooking assistance');
    
    // If we have a context update function, send the cooking context
    if (contextUpdateFn) {
      const updatedContext = {
        ...buildEnhancedContext(),
        aiRequestContext: context || 'User requested general cooking assistance',
        urgentRequest: true,
        timestamp: new Date().toISOString()
      };
      contextUpdateFn(updatedContext);
    }
    
    // Show instructions for cost-effective AI interaction
    toast({
      title: "🤖 Chef Remy Ready",
      description: context 
        ? "AI is now aware of your timer completion. Start talking to get guidance!"
        : "Tap the voice button in the sidebar to start your conversation with Chef Remy.",
      duration: 5000,
    });
  };

  const handleRecipeComplete = () => {
    // Mark all steps as completed
    setCompletedSteps(new Set(recipe.steps.map((_, index) => index)));
    
    // Clear any active timers
    setActiveTimers([]);
    
    // Show celebration notification
    toast({
      title: "🎉 Recipe Complete!",
      description: (
        <div className="space-y-2">
          <p>Congratulations! You've successfully made <strong>{recipe.title}</strong></p>
          <p className="text-sm text-muted-foreground">Redirecting to home in 3 seconds...</p>
        </div>
      ),
      duration: 4000,
    });
    
    // Update AI context with completion
    if (contextUpdateFn) {
      contextUpdateFn({
        ...buildEnhancedContext(),
        recipeStatus: 'completed',
        completionTime: new Date().toISOString(),
        finalMessage: `Recipe "${recipe.title}" has been successfully completed!`
      });
    }
    
    // Auto-redirect to home page after celebration
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const currentStepIngredients = currentStep.ingredients?.map(id => 
    recipe.ingredients.find(ing => ing.id === id)
  ).filter(Boolean) || [];

  // Enhanced context builder for comprehensive cooking guidance
  const buildEnhancedContext = useCallback(() => ({
    currentPage: 'cooking-mode',
    cookingSession: {
      recipe: {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        difficulty: recipe.difficulty,
        totalTime: recipe.totalTime,
        servings: recipe.servings
      },
      currentStep: {
        index: currentStepIndex,
        stepNumber: currentStep.order,
        text: currentStep.text,
        duration: currentStep.duration,
        canParallel: currentStep.canParallel,
        requiredIngredients: currentStepIngredients.map(ing => ({
          id: ing!.id,
          name: ing!.name,
          amount: ing!.amount,
          unit: ing!.unit
        }))
      },
      progress: {
        currentStepIndex,
        totalSteps: recipe.steps.length,
        completedSteps: Array.from(completedSteps),
        completionPercentage: Math.round((completedSteps.size / recipe.steps.length) * 100)
      },
      ingredients: {
        all: recipe.ingredients.map(ing => ({
          id: ing.id,
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          isChecked: checkedIngredients.has(ing.id)
        })),
        checkedCount: checkedIngredients.size,
        totalCount: recipe.ingredients.length
      },
      steps: recipe.steps.map((step, index) => ({
        id: step.id,
        stepNumber: step.order,
        text: step.text,
        duration: step.duration,
        canParallel: step.canParallel,
        ingredients: step.ingredients?.map(ingId => {
          const ing = recipe.ingredients.find(i => i.id === ingId);
          return ing ? `${ing.amount} ${ing.unit} ${ing.name}` : '';
        }).filter(Boolean) || [],
        isCompleted: completedSteps.has(index),
        isCurrent: index === currentStepIndex
      })),
      activeTimers: activeTimers.map(t => ({
        id: t.id,
        label: t.label,
        remainingSeconds: t.duration
      })),
      cookingTips: {
        parallelSteps: recipe.steps.filter(step => step.canParallel).map(s => s.order),
        totalEstimatedTime: recipe.totalTime,
        difficultyLevel: recipe.difficulty
      }
    }
  }), [recipe, currentStepIndex, currentStep, currentStepIngredients, completedSteps, checkedIngredients, activeTimers]);

  // Function to send context updates when cooking state changes
  const sendContextUpdate = useCallback(() => {
    if (contextUpdateFn) {
      const updatedContext = buildEnhancedContext();
      contextUpdateFn(updatedContext);
      logger.debug('Context update sent to voice agent');
    }
  }, [contextUpdateFn, buildEnhancedContext]);

  // Send context updates when key state changes
  useEffect(() => {
    sendContextUpdate();
  }, [currentStepIndex, completedSteps, checkedIngredients, activeTimers, sendContextUpdate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with Glow Effect */}
      <header className="sticky top-0 z-40 bg-gradient-hero backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-b border-primary/20 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="text-xs hover:bg-primary/10 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Exit
            </Button>
            
            <div className="text-center">
              <h1 className="text-sm font-medium gradient-text animate-fade-in">{recipe.title}</h1>
              <p className="text-xs text-muted-foreground">
                Step {currentStepIndex + 1}/{recipe.steps.length} • {Math.round(progress)}%
              </p>
            </div>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsSoundOn(!isSoundOn)}
              className="hover:bg-primary/10 transition-all duration-300 hover:scale-105"
            >
              {isSoundOn ? (
                <Volume2 className="w-3 h-3 animate-pulse-glow" />
              ) : (
                <VolumeX className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Reorganized Sidebar */}
        <aside className="w-80 border-r border-border bg-card/50 backdrop-blur-sm overflow-y-auto">
          <div className="p-4 pt-7 space-y-4">
            {/* Voice Assistant - Moved to Top */}
            <div className="animate-fade-in">
              <VoiceAssistant 
                className="voice-assistant-sidebar"
                compact={false}
                onStepNavigation={(direction) => {
                  if (direction === 'next') {
                    handleNextStep();
                  } else {
                    handlePreviousStep();
                  }
                }}
                onTimerRequest={handleTimerRequest}
                onRepeatRequest={() => {
                  console.log('Repeating current step');
                }}
                onIngredientCheck={(ingredientName) => {
                  const ingredient = recipe.ingredients.find(ing => 
                    ing.name.toLowerCase().includes(ingredientName.toLowerCase())
                  );
                  if (ingredient) {
                    handleIngredientToggle(ingredient.id);
                  }
                }}
                onStepCompletion={handleStepCompletion}
                currentStepText={currentStep.text}
                onContextUpdate={setContextUpdateFn}
                context={buildEnhancedContext()}
              />
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 animate-fade-in">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {Math.round(progress)}% Complete
              </p>
            </div>

            {/* Ingredients Checklist - No Scroll */}
            <Card className="border border-border bg-card animate-scale-in shadow-sm">
              <CardHeader className="px-3 py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Ingredients</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {checkedIngredients.size}/{recipe.ingredients.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-3 py-0 pb-3">
                <div className="space-y-1">
                  {recipe.ingredients.map((ingredient, index) => {
                    const isChecked = checkedIngredients.has(ingredient.id);
                    return (
                      <div 
                        key={ingredient.id}
                        className={`flex items-center space-x-2 p-2 rounded text-xs cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-fade-in ${
                          isChecked 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700' 
                            : 'hover:bg-muted/50 text-foreground'
                        }`}
                        onClick={() => handleIngredientToggle(ingredient.id)}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <Checkbox 
                          checked={isChecked}
                          className="w-3 h-3"
                        />
                        <span className={isChecked ? 'line-through' : ''}>
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs py-2 transition-all duration-300 hover:scale-105"
                onClick={() => console.log("Repeating step")}
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Repeat
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs py-2 border-orange-500/50 text-orange-600 hover:bg-orange-50 transition-all duration-300 hover:scale-105"
                onClick={() => console.log("Emergency help")}
              >
                🆘 Help
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content Area - Reorganized */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Active Timers Hub */}
            <ActiveTimersHub
              activeTimers={activeTimers}
              onTimerComplete={handleTimerComplete}
              onTimerRemove={handleTimerRemove}
              onAskAI={handleAskAI}
              className="animate-fade-in"
            />

            {/* Current Step and All Steps Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Current Step + Navigation */}
              <div className="space-y-4">
                {/* Current Step */}
                <Card className="border-2 border-primary/30 bg-card backdrop-blur-sm shadow-lg animate-scale-in">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary text-white rounded-full flex items-center justify-center font-bold text-base shadow-lg">
                          {currentStep.order}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-lg font-semibold text-foreground animate-fade-in">
                            Current Step
                          </h2>
                        </div>
                        {currentStep.duration && (
                          <Badge variant="secondary" className="text-sm bg-orange-100 text-orange-800 border-orange-200">
                            {Math.floor(currentStep.duration / 60)}:{(currentStep.duration % 60).toString().padStart(2, '0')}
                          </Badge>
                        )}
                      </div>

                      <p className="text-base leading-relaxed text-foreground">
                        {currentStep.text}
                      </p>

                      {/* Ingredients for this step */}
                      {currentStepIngredients.length > 0 && (
                        <div className="space-y-1">
                          <h3 className="text-sm font-medium text-foreground">Need for this step:</h3>
                          <div className="flex flex-wrap gap-1">
                            {currentStepIngredients.map((ingredient) => (
                              <Badge 
                                key={ingredient!.id}
                                variant="outline"
                                className="text-xs"
                              >
                                {ingredient!.amount} {ingredient!.unit} {ingredient!.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timer Starter for this step */}
                      {currentStep.duration && (
                        <div className="space-y-2">
                          {!showTimerInput ? (
                            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2">
                                <TimerIcon className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">Suggested Timer</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {Math.floor(currentStep.duration / 60)}:{(currentStep.duration % 60).toString().padStart(2, '0')}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleTimerInputToggle}
                                  className="h-8"
                                >
                                  Adjust
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleStepTimerStart(currentStepIndex, currentStep.duration)}
                                  className="h-8"
                                >
                                  Start Timer
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 space-y-3">
                              <div className="flex items-center gap-2">
                                <TimerIcon className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">Custom Timer</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={customTimerDuration}
                                  onChange={(e) => setCustomTimerDuration(e.target.value)}
                                  placeholder="Minutes"
                                  className="w-20 h-8 text-sm"
                                  min="1"
                                  max="120"
                                />
                                <span className="text-sm text-muted-foreground">minutes</span>
                                <div className="flex gap-1 ml-auto">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setShowTimerInput(false)}
                                    className="h-8"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={handleCustomTimerStart}
                                    className="h-8"
                                    disabled={!customTimerDuration || isNaN(parseInt(customTimerDuration)) || parseInt(customTimerDuration) <= 0}
                                  >
                                    Start Timer
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </CardContent>
                </Card>

                {/* Navigation Controls - Moved from bottom */}
                <div className="flex gap-4 animate-slide-in-left">
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={currentStepIndex === 0}
                    className="flex-1 border-primary/50 hover:bg-primary/10 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStepIndex === recipe.steps.length - 1 ? (
                    <Button
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      onClick={handleRecipeComplete}
                    >
                      Complete! 🎉
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextStep}
                      className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Right Column: All Steps */}
              <Card className="border border-border bg-card backdrop-blur-sm animate-fade-in">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-foreground mb-3">All Steps</h3>
                  <div className="space-y-2">
                    {recipe.steps.map((step, index) => (
                      <div 
                        key={step.id}
                        className={`
                          p-3 rounded-lg border cursor-pointer transition-all duration-300 text-xs hover:scale-[1.02] animate-scale-in
                          ${index === currentStepIndex 
                            ? 'bg-primary/10 border-primary/50 shadow-md' 
                            : completedSteps.has(index)
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200'
                              : 'bg-muted/30 border-muted hover:bg-muted/50'
                          }
                        `}
                        onClick={() => setCurrentStepIndex(index)}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className={`
                              w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 mt-0.5 cursor-pointer hover:scale-110
                              ${index === currentStepIndex 
                                ? 'bg-primary text-white hover:bg-primary/80' 
                                : completedSteps.has(index)
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30'
                              }
                            `}
                            onClick={(e) => handleStepToggle(index, e)}
                            title={completedSteps.has(index) ? "Click to mark as incomplete" : "Click to mark as completed"}
                          >
                            {completedSteps.has(index) ? '✓' : step.order}
                          </div>
                          <p className={`
                            flex-1 leading-relaxed
                            ${completedSteps.has(index) ? 'line-through text-muted-foreground' : 'text-foreground'}
                          `}>
                            {step.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}