import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Pause, Play, VolumeX, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { Timer } from "@/components/Timer";
import { demoRecipes } from "@/lib/demo-data";

interface CookingModeProps {
  recipeId?: string;
}

export function CookingMode({ recipeId = "1" }: CookingModeProps) {
  const recipe = demoRecipes.find(r => r.id === recipeId) || demoRecipes[0];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);

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

  const handleVoiceToggle = () => {
    setIsVoiceListening(!isVoiceListening);
  };

  const handleVoiceCommand = (command: string) => {
    // Simulate voice command processing
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('next')) {
      handleNextStep();
      return "Moving to next step";
    } else if (lowerCommand.includes('back') || lowerCommand.includes('previous')) {
      handlePreviousStep();
      return "Going back to previous step";
    } else if (lowerCommand.includes('repeat')) {
      return currentStep.text;
    } else if (lowerCommand.includes('ingredients')) {
      const stepIngredients = currentStep.ingredients?.map(id => 
        recipe.ingredients.find(ing => ing.id === id)?.name
      ).filter(Boolean).join(', ');
      return stepIngredients ? `You need: ${stepIngredients}` : "No specific ingredients for this step";
    }
    
    return "I didn't understand that command. Try 'next step', 'go back', or 'repeat step'";
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
            <Button variant="ghost" size="sm">
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
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Voice Assistant */}
        <VoiceAssistant 
          isListening={isVoiceListening}
          onToggleListening={handleVoiceToggle}
          lastResponse="Ready to help with cooking!"
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
            onClick={() => {
              // TODO: Show all ingredients
              console.log("Showing ingredients");
            }}
          >
            📋 Ingredients
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