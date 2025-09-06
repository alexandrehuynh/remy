import { useState } from "react";
import { ArrowLeft, Clock, Users, ChefHat, Play, Edit, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { Timer } from "@/components/Timer";
import { demoRecipes, Recipe, Step } from "@/lib/demo-data";

interface RecipeDetailProps {
  recipeId?: string;
}

export function RecipeDetail({ recipeId = "1" }: RecipeDetailProps) {
  const recipe = demoRecipes.find(r => r.id === recipeId) || demoRecipes[0];
  const [currentStep, setCurrentStep] = useState(0);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleStartCooking = () => {
    // TODO: Navigate to cooking mode
    console.log("Starting cooking mode for:", recipe.title);
  };

  const handleVoiceToggle = () => {
    setIsVoiceListening(!isVoiceListening);
  };

  const toggleStepComplete = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex);
    } else {
      newCompleted.add(stepIndex);
    }
    setCompletedSteps(newCompleted);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Recipes
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Recipe Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="aspect-[4/3] overflow-hidden rounded-lg">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={getDifficultyColor(recipe.difficulty)}
                >
                  {recipe.difficulty}
                </Badge>
                <Badge variant="outline">{recipe.category}</Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-foreground">
                {recipe.title}
              </h1>
              
              <p className="text-lg text-muted-foreground">
                {recipe.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-card rounded-lg border">
              <div className="text-center">
                <Clock className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <div className="text-2xl font-bold text-foreground">{recipe.totalTime}</div>
                <div className="text-sm text-muted-foreground">minutes</div>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <div className="text-2xl font-bold text-foreground">{recipe.servings}</div>
                <div className="text-sm text-muted-foreground">servings</div>
              </div>
              <div className="text-center">
                <ChefHat className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <div className="text-2xl font-bold text-foreground">{recipe.steps.length}</div>
                <div className="text-sm text-muted-foreground">steps</div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full btn-hero text-lg"
              onClick={handleStartCooking}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Cooking
            </Button>
          </div>
        </div>

        {/* Voice Assistant */}
        <VoiceAssistant 
          isListening={isVoiceListening}
          onToggleListening={handleVoiceToggle}
          lastResponse="Ready to help with cooking!"
        />

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Ingredients</span>
              <Badge variant="secondary">{recipe.ingredients.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recipe.ingredients.map((ingredient) => (
                <div 
                  key={ingredient.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground">{ingredient.name}</span>
                  <span className="text-muted-foreground">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Instructions</span>
              <Badge variant="secondary">
                {completedSteps.size} of {recipe.steps.length} completed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recipe.steps.map((step, index) => (
              <div key={step.id} className="space-y-3">
                <div 
                  className={`
                    p-4 rounded-lg border transition-all cursor-pointer
                    ${completedSteps.has(index) 
                      ? 'bg-cooking-success/10 border-cooking-success' 
                      : 'bg-card hover:bg-muted/30'
                    }
                  `}
                  onClick={() => toggleStepComplete(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold
                      ${completedSteps.has(index)
                        ? 'bg-cooking-success text-white border-cooking-success'
                        : 'bg-background border-border text-foreground'
                      }
                    `}>
                      {step.order}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <p className={`text-lg leading-relaxed ${
                        completedSteps.has(index) ? 'line-through text-muted-foreground' : 'text-foreground'
                      }`}>
                        {step.text}
                      </p>
                      
                      {step.duration && (
                        <div className="flex items-center gap-4">
                          <Timer 
                            duration={step.duration} 
                            label={`Step ${step.order}`}
                            className="flex-1"
                          />
                        </div>
                      )}
                      
                      {step.ingredients && step.ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {step.ingredients.map(ingredientId => {
                            const ingredient = recipe.ingredients.find(i => i.id === ingredientId);
                            return ingredient ? (
                              <Badge key={ingredient.id} variant="outline" className="text-xs">
                                {ingredient.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {index < recipe.steps.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}