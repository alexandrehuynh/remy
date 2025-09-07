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

      <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
        {/* All Categories Option */}
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
            selectedCategory === "All" 
              ? "ring-2 ring-primary bg-gradient-hero border-primary/50" 
              : "hover:bg-gradient-hero/50"
          }`}
          onClick={() => onCategorySelect("All")}
        >
          <CardContent className="p-4 text-center h-32 flex flex-col justify-center">
            <div className="text-3xl mb-2">🍽️</div>
            <h3 className="font-semibold text-base mb-1">All Recipes</h3>
            <p className="text-xs text-muted-foreground">Browse everything</p>
          </CardContent>
        </Card>

        {/* Dynamic Categories */}
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Card 
              key={category.name}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                selectedCategory === category.name 
                  ? "ring-2 ring-primary bg-gradient-hero border-primary/50" 
                  : "hover:bg-gradient-hero/50"
              }`}
              onClick={() => onCategorySelect(category.name)}
            >
              <CardContent className="p-4 text-center h-32 flex flex-col justify-center">
                <div className="mb-2">
                  <IconComponent className={`w-8 h-8 mx-auto ${category.color}`} />
                </div>
                <h3 className="font-semibold text-base mb-1">{category.name}</h3>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}