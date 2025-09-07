import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/lib/constants";

interface CategoryGridProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export function CategoryGrid({ selectedCategory, onCategorySelect }: CategoryGridProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">Explore Categories</h2>
        <p className="text-muted-foreground">Discover recipes by your favorite cooking styles</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* All Categories Option */}
        <Card 
          className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
            selectedCategory === "All" 
              ? "ring-2 ring-primary bg-gradient-hero border-primary/50" 
              : "hover:bg-gradient-hero/50"
          }`}
          onClick={() => onCategorySelect("All")}
        >
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3 animate-bounce-gentle">🍽️</div>
            <h3 className="font-semibold text-lg mb-1">All Recipes</h3>
            <p className="text-sm text-muted-foreground">Browse everything</p>
          </CardContent>
        </Card>

        {/* Dynamic Categories */}
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Card 
              key={category.name}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in ${
                selectedCategory === category.name 
                  ? "ring-2 ring-primary bg-gradient-hero border-primary/50" 
                  : "hover:bg-gradient-hero/50"
              }`}
              onClick={() => onCategorySelect(category.name)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-3 animate-bounce-gentle" style={{ animationDelay: `${index * 0.2}s` }}>
                  <IconComponent className={`w-12 h-12 mx-auto ${category.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}