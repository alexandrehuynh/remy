import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, RotateCcw, VolumeX, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { Timer } from "@/components/Timer";
import { demoRecipes } from "@/lib/demo-data";
import { logger } from "@/lib/logger";

export function CookingMode() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const recipe = demoRecipes.find(r => r.id === recipeId) || demoRecipes[0];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [activeTimers, setActiveTimers] = useState<{ id: string; duration: number; label: string }[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [contextUpdateFn, setContextUpdateFn] = useState<((context: any) => void) | null>(null);

  const currentStep = recipe.steps[currentStepIndex];
  const progress = (completedSteps.size / recipe.steps.length) * 100;

  useEffect(() => {
    if (!sessionStarted) {
      setSessionStarted(true);
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
      label: `Step ${currentStep.order} Timer`
    };
    setActiveTimers(prev => [...prev, newTimer]);
  };

  const handleTimerComplete = (timerId: string) => {
    setActiveTimers(prev => prev.filter(timer => timer.id !== timerId));
    // Play notification sound or show alert
    if (isSoundOn && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Timer finished!');
      window.speechSynthesis.speak(utterance);
    }
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
            {/* Current Step and All Steps Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Step */}
              <Card className="border-2 border-primary/30 bg-card backdrop-blur-sm shadow-lg animate-scale-in">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                        {currentStep.order}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-foreground animate-fade-in">
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
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-foreground">Need for this step:</h3>
                        <div className="flex flex-wrap gap-2">
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

                    {/* Timer for this step */}
                    {currentStep.duration && (
                      <Timer 
                        duration={currentStep.duration}
                        label={`Step ${currentStep.order}`}
                        autoStart={false}
                        onComplete={() => handleTimerComplete(`step-${currentStep.id}`)}
                      />
                    )}

                    {/* Active Voice Timers */}
                    {activeTimers.map((timer) => (
                      <Timer
                        key={timer.id}
                        duration={timer.duration}
                        label={timer.label}
                        autoStart={true}
                        onComplete={() => handleTimerComplete(timer.id)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* All Steps - No Scroll, Full Text */}
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

            {/* Navigation Controls */}
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
                  onClick={() => {
                    console.log("Cooking completed!");
                  }}
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
        </main>
      </div>
    </div>
  );
}