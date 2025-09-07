import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, RotateCcw, Pause, Play, VolumeX, Volume2, CheckCircle2, Circle } from "lucide-react";
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
  const [showIngredients, setShowIngredients] = useState(true);
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

  const handleVoiceIngredientCheck = (ingredientName: string) => {
    const ingredient = recipe.ingredients.find(ing => 
      ing.name.toLowerCase().includes(ingredientName.toLowerCase())
    );
    if (ingredient) {
      handleIngredientToggle(ingredient.id);
      return `${checkedIngredients.has(ingredient.id) ? 'Unchecked' : 'Checked'} ${ingredient.name}`;
    }
    return `I couldn't find ${ingredientName} in the ingredient list`;
  };

  const getNextUncheckedIngredient = () => {
    return recipe.ingredients.find(ing => !checkedIngredients.has(ing.id));
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
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Cooking
            </Button>
            
            <div className="text-center">
              <h1 className="font-medium text-foreground">{recipe.title}</h1>
              <p className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {recipe.steps.length}
              </p>
            </div>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsSoundOn(!isSoundOn)}
            >
              {isSoundOn ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Ingredients Checklist */}
        {showIngredients && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Ingredients Checklist</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {checkedIngredients.size}/{recipe.ingredients.length} ready
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowIngredients(false)}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recipe.ingredients.map((ingredient) => {
                  const isChecked = checkedIngredients.has(ingredient.id);
                  return (
                    <div 
                      key={ingredient.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isChecked ? 'bg-cooking-success/10 border-cooking-success' : 'hover:bg-muted/30'
                      }`}
                      onClick={() => handleIngredientToggle(ingredient.id)}
                    >
                      <Checkbox 
                        checked={isChecked}
                        onChange={() => handleIngredientToggle(ingredient.id)}
                        className="pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className={`font-medium ${
                          isChecked ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}>
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </div>
                      </div>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-cooking-success" />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Step */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {currentStep.order}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    Current Step
                  </h2>
                </div>
                {currentStep.duration && (
                  <Badge variant="secondary" className="bg-cooking-timer/10 text-cooking-timer">
                    {Math.floor(currentStep.duration / 60)}:{(currentStep.duration % 60).toString().padStart(2, '0')}
                  </Badge>
                )}
              </div>

              <p className="text-xl leading-relaxed text-foreground font-medium">
                {currentStep.text}
              </p>

              {/* Ingredients for this step */}
              {currentStepIngredients.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground">Ingredients needed:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {currentStepIngredients.map((ingredient) => (
                      <div 
                        key={ingredient!.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <span className="font-medium text-foreground">{ingredient!.name}</span>
                        <span className="text-muted-foreground text-sm">
                          {ingredient!.amount} {ingredient!.unit}
                        </span>
                      </div>
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

        {/* Voice Assistant - Compact Mode */}
        <VoiceAssistant 
          className="voice-assistant-compact"
          compact={true}
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

        {/* Navigation Controls */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePreviousStep}
            disabled={currentStepIndex === 0}
            className="btn-cooking text-lg py-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous Step
          </Button>

          {currentStepIndex === recipe.steps.length - 1 ? (
            <Button
              size="lg"
              className="btn-hero text-lg py-6"
              onClick={() => {
                // TODO: Complete cooking session
                console.log("Cooking completed!");
              }}
            >
              Complete Cooking! 🎉
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleNextStep}
              className="btn-hero text-lg py-6"
            >
              Next Step
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="touch-target"
            onClick={() => {
              // TODO: Implement repeat step functionality
              console.log("Repeating step");
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Repeat
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="touch-target"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className="touch-target"
            onClick={() => setShowIngredients(!showIngredients)}
          >
            📋 {showIngredients ? 'Hide' : 'Show'} Ingredients
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            className="touch-target"
            onClick={() => {
              // TODO: Emergency help
              console.log("Emergency help");
            }}
          >
            🆘 Help
          </Button>
        </div>

        {/* Steps Overview */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-3">All Steps</h3>
            <div className="space-y-2">
              {recipe.steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-all
                    ${index === currentStepIndex 
                      ? 'bg-primary/10 border-primary' 
                      : index < currentStepIndex
                        ? 'bg-cooking-success/10 border-cooking-success'
                        : 'bg-card hover:bg-muted/30'
                    }
                  `}
                  onClick={() => setCurrentStepIndex(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${index === currentStepIndex 
                        ? 'bg-primary text-white' 
                        : index < currentStepIndex
                          ? 'bg-cooking-success text-white'
                          : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      {step.order}
                    </div>
                    <p className={`
                      text-sm
                      ${index < currentStepIndex ? 'line-through text-muted-foreground' : 'text-foreground'}
                    `}>
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}