import { useState } from "react";
import { Search, Sparkles, ChefHat } from "lucide-react";
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
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Floating Food Emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] text-4xl animate-float" style={{ animationDelay: '0s' }}>
          🍳
        </div>
        <div className="absolute top-32 right-[15%] text-3xl animate-float" style={{ animationDelay: '2s' }}>
          🥗
        </div>
        <div className="absolute bottom-40 left-[20%] text-5xl animate-float" style={{ animationDelay: '1s' }}>
          🍕
        </div>
        <div className="absolute bottom-32 right-[25%] text-3xl animate-float" style={{ animationDelay: '3s' }}>
          🍰
        </div>
        <div className="absolute top-40 left-[60%] text-4xl animate-float" style={{ animationDelay: '1.5s' }}>
          🥘
        </div>
        <div className="absolute bottom-60 right-[45%] text-3xl animate-float" style={{ animationDelay: '2.5s' }}>
          🍜
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
        {/* Brand Section */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse-glow">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Chef Remy
              </h1>
              <div className="flex items-center gap-2 justify-center mt-2">
                <Sparkles className="w-5 h-5 text-primary animate-pulse-glow" />
                <p className="text-white/90 text-lg">Your AI-Powered Cooking Companion</p>
                <Sparkles className="w-5 h-5 text-primary animate-pulse-glow" />
              </div>
            </div>
          </div>
        </div>

        {/* Voice Assistant Integration */}
        <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <VoiceAssistant 
            className="hero-voice-assistant bg-white/10 backdrop-blur-lg border-white/20"
            context={{
              currentPage: 'home'
            }}
          />
        </div>

        {/* Search Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
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
                  className="pl-12 py-6 text-lg bg-white/10 backdrop-blur-lg border-white/20 text-white placeholder:text-white/60 focus:bg-white/15 transition-all duration-300"
                />
              </div>
              
              <Button 
                onClick={handleSearch}
                size="lg" 
                className="px-8 py-6 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="animate-slide-in-left" style={{ animationDelay: '0.6s' }}>
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            <Button 
              variant="outline" 
              className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              onClick={() => onSearchChange && onSearchChange("quick meals")}
            >
              🚀 Quick Meals
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              onClick={() => onSearchChange && onSearchChange("healthy")}
            >
              🥗 Healthy Options
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              onClick={() => onSearchChange && onSearchChange("desserts")}
            >
              🍰 Desserts
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/cook/1')}
            >
              🔥 Start Cooking
            </Button>
          </div>
        </div>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
}