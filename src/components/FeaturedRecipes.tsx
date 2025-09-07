import { useState } from "react";
import { Star, Clock, Users, ChefHat, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/RecipeCard";
import { demoRecipes } from "@/lib/demo-data";
import { useNavigate } from "react-router-dom";

export function FeaturedRecipes() {
  const navigate = useNavigate();
  const [hoveredRecipe, setHoveredRecipe] = useState<string | null>(null);

  // Get top 3 recipes for featured section
  const featuredRecipes = demoRecipes.slice(0, 3);
  // Get remaining recipes for the grid
  const gridRecipes = demoRecipes.slice(3);

  return (
    <div className="space-y-12">
      {/* Featured Hero Recipes */}
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary animate-pulse-glow" />
            <h2 className="text-3xl font-bold gradient-text">Featured Recipes</h2>
            <Sparkles className="w-6 h-6 text-primary animate-pulse-glow" />
          </div>
          <p className="text-muted-foreground">Hand-picked recipes perfect for any occasion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRecipes.map((recipe, index) => (
            <Card 
              key={recipe.id}
              className="group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-card border-primary/20 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
              onMouseEnter={() => setHoveredRecipe(recipe.id)}
              onMouseLeave={() => setHoveredRecipe(null)}
              onClick={() => navigate(`/cook/${recipe.id}`)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg h-48">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Floating badge */}
                  <Badge className="absolute top-4 right-4 bg-primary/90 text-white animate-bounce-gentle">
                    ⭐ Featured
                  </Badge>

                  {/* Recipe stats overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-2">{recipe.title}</h3>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.totalTime}min
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {recipe.servings}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        4.8
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {recipe.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {recipe.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {recipe.difficulty}
                    </Badge>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/cook/${recipe.id}`);
                    }}
                  >
                    <ChefHat className="w-4 h-4 mr-2" />
                    Start Cooking
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold gradient-text mb-2">More Delicious Recipes</h2>
          <p className="text-muted-foreground">Discover your next favorite dish</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gridRecipes.map((recipe, index) => (
            <div 
              key={recipe.id}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <RecipeCard
                recipe={recipe}
                onClick={() => {
                  console.log("Opening recipe:", recipe.title);
                }}
                onStartCooking={() => {
                  navigate(`/cook/${recipe.id}`);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}