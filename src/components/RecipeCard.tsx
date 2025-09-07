import { Clock, Users, ChefHat, Play } from "lucide-react";
import { Recipe } from "@/lib/demo-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onStartCooking?: () => void;
}

export function RecipeCard({ recipe, onClick, onStartCooking }: RecipeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card 
      className="recipe-card cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
          <Badge 
            variant="secondary" 
            className={getDifficultyColor(recipe.difficulty)}
          >
            {recipe.difficulty}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.totalTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">{recipe.category}</span>
            </div>
          </div>
          
          {/* Start Cooking Button */}
          {onStartCooking && (
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onStartCooking();
              }}
              className="w-full btn-hero"
              size="sm"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Cooking
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}