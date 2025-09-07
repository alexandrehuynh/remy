import { useState, useEffect } from "react";
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

export function CookingMode() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const recipe = demoRecipes.find(r => r.id === recipeId) || demoRecipes[0];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [activeTimers, setActiveTimers] = useState<{ id: string; duration: number; label: string }[]>([]);

  const currentStep = recipe.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / recipe.steps.length) * 100;

  useEffect(() => {
    if (!sessionStarted) {
      setSessionStarted(true);
    }
  }, [sessionStarted]);

  const handleNextStep = () => {
    if (currentStepIndex < recipe.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Compact */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="text-xs"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Exit
            </Button>
            
            <div className="text-center">
              <h1 className="text-sm font-medium text-foreground">{recipe.title}</h1>
              <p className="text-xs text-muted-foreground">
                Step {currentStepIndex + 1}/{recipe.steps.length} • {Math.round(progress)}%
              </p>
            </div>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsSoundOn(!isSoundOn)}
            >
              {isSoundOn ? (
                <Volume2 className="w-3 h-3" />
              ) : (
                <VolumeX className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Ingredients & Controls */}
        <aside className="w-80 border-r border-border bg-card/30 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Progress Bar */}
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
            </div>

            {/* Ingredients Checklist - Compact */}
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="px-0 py-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Ingredients</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {checkedIngredients.size}/{recipe.ingredients.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-0 py-0">
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {recipe.ingredients.map((ingredient) => {
                    const isChecked = checkedIngredients.has(ingredient.id);
                    return (
                      <div 
                        key={ingredient.id}
                        className={`flex items-center space-x-2 p-2 rounded text-xs cursor-pointer transition-all ${
                          isChecked ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleIngredientToggle(ingredient.id)}
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

            {/* Quick Actions - Compact */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs py-2"
                onClick={() => console.log("Repeating step")}
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Repeat
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs py-2"
                onClick={() => console.log("Emergency help")}
              >
                🆘 Help
              </Button>
            </div>

            {/* Voice Assistant - Always Visible */}
            <div className="border-t pt-4 mt-4">
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
                currentStepText={currentStep.text}
                context={{
                  currentPage: 'cooking-mode',
                  currentRecipe: recipe.title,
                  currentStep: currentStepIndex,
                  availableIngredients: recipe.ingredients.map(ing => ing.name),
                  checkedIngredients: Array.from(checkedIngredients)
                }}
              />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Current Step - Clean & Focused */}
            <Card className="border border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {currentStep.order}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-foreground">
                        Current Step
                      </h2>
                    </div>
                    {currentStep.duration && (
                      <Badge variant="secondary" className="text-xs">
                        {Math.floor(currentStep.duration / 60)}:{(currentStep.duration % 60).toString().padStart(2, '0')}
                      </Badge>
                    )}
                  </div>

                  <p className="text-base leading-relaxed text-foreground">
                    {currentStep.text}
                  </p>

                  {/* Ingredients for this step - Compact */}
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


            {/* Navigation Controls - Cleaner */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStepIndex === 0}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStepIndex === recipe.steps.length - 1 ? (
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    console.log("Cooking completed!");
                  }}
                >
                  Complete! 🎉
                </Button>
              ) : (
                <Button
                  onClick={handleNextStep}
                  className="flex-1"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>


            {/* Steps Overview - Compact */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">All Steps</h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {recipe.steps.map((step, index) => (
                    <div 
                      key={step.id}
                      className={`
                        p-2 rounded border cursor-pointer transition-all text-xs
                        ${index === currentStepIndex 
                          ? 'bg-primary/10 border-primary' 
                          : index < currentStepIndex
                            ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                            : 'bg-card hover:bg-muted/30'
                        }
                      `}
                      onClick={() => setCurrentStepIndex(index)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`
                          w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold
                          ${index === currentStepIndex 
                            ? 'bg-primary text-white' 
                            : index < currentStepIndex
                              ? 'bg-green-600 text-white'
                              : 'bg-muted text-muted-foreground'
                          }
                        `}>
                          {step.order}
                        </div>
                        <p className={`
                          ${index < currentStepIndex ? 'line-through text-muted-foreground' : 'text-foreground'}
                        `}>
                          {step.text.length > 60 ? step.text.slice(0, 60) + '...' : step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}