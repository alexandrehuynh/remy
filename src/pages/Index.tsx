import { useState } from "react";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedRecipes } from "@/components/FeaturedRecipes";
import { BottomTabs } from "@/components/BottomTabs";
import { RecipeCard } from "@/components/RecipeCard";
import { demoRecipes } from "@/lib/demo-data";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showResults, setShowResults] = useState(false);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowResults(true);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowResults(true);
  };

  const filteredRecipes = demoRecipes.filter(recipe => {
    const matchesSearch = !searchQuery || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {showResults ? (
        // Search Results View
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Back to home button */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => setShowResults(false)}
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
            >
              ← Back to Home
            </button>
            <Badge variant="outline">
              {filteredRecipes.length} recipes found
            </Badge>
          </div>

          {/* Search summary */}
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {searchQuery ? `Results for "${searchQuery}"` : `${selectedCategory} Recipes`}
            </h2>
          </div>

          {/* Results */}
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-foreground mb-2">No recipes found</h3>
              <p className="text-muted-foreground">Try adjusting your search or browse our categories</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => {
                    console.log("Opening recipe:", recipe.title);
                  }}
                  onStartCooking={() => {
                    navigate(`/cook/${recipe.id}`);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Home View with Hero and Featured Content
        <>
          {/* Hero Section */}
          <Hero 
            onSearch={handleSearch}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Main Content */}
          <main className="container mx-auto px-4 py-12 space-y-16">
            {/* Category Grid */}
            <CategoryGrid 
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />

            {/* Featured Recipes */}
            <FeaturedRecipes />

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-secondary/50 rounded-xl border border-border">
                <div className="text-3xl font-bold text-primary mb-1">{demoRecipes.length}</div>
                <div className="text-sm text-muted-foreground">Total Recipes</div>
              </div>
              <div className="text-center p-6 bg-secondary/50 rounded-xl border border-border">
                <div className="text-3xl font-bold text-green-600 mb-1">12</div>
                <div className="text-sm text-muted-foreground">Cooked Today</div>
              </div>
              <div className="text-center p-6 bg-secondary/50 rounded-xl border border-border">
                <div className="text-3xl font-bold text-red-500 mb-1">8</div>
                <div className="text-sm text-muted-foreground">Favorites</div>
              </div>
              <div className="text-center p-6 bg-secondary/50 rounded-xl border border-border">
                <div className="text-3xl font-bold text-yellow-500 mb-1">4.8</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </main>
        </>
      )}

      {/* Bottom Navigation */}
      <BottomTabs />
    </div>
  );
};

export default Index;