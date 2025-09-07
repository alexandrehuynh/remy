import { useState } from "react";
import { Search, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Hero({ onSearch, searchQuery = "", onSearchChange }: HeroProps) {
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(localSearch);
    }
  };

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
        {/* Brand Section */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Chef Remy
              </h1>
              <p className="text-white/90 text-lg mt-2">Your AI-Powered Cooking Companion</p>
            </div>
          </div>
        </div>

        {/* Voice Assistant Integration */}
        <div className="mb-8">
          <VoiceAssistant 
            className="hero-voice-assistant bg-white/10 backdrop-blur-lg border-white/20"
            context={{
              currentPage: 'home'
            }}
          />
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-white/95 mb-6">
              What would you like to cook today?
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <Input
                  placeholder="Search recipes, ingredients, or cooking techniques..."
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 py-6 text-lg bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 transition-colors duration-200"
                />
              </div>
              
              <Button 
                onClick={handleSearch}
                size="lg" 
                className="px-8 py-6 text-lg bg-primary hover:bg-primary/90 transition-colors duration-200"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
          <Button 
            variant="outline" 
            className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-colors duration-200"
            onClick={() => onSearchChange && onSearchChange("quick meals")}
          >
            Quick Meals
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-colors duration-200"
            onClick={() => onSearchChange && onSearchChange("healthy")}
          >
            Healthy Options
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-colors duration-200"
            onClick={() => onSearchChange && onSearchChange("desserts")}
          >
            Desserts
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-colors duration-200"
            onClick={() => navigate('/cook/1')}
          >
            Start Cooking
          </Button>
        </div>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}