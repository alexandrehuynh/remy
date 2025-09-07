import { Home, Search, Heart, User, ChefHat } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function BottomTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
      color: 'text-primary'
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      path: '/search',
      color: 'text-blue-500'
    },
    {
      id: 'cooking',
      label: 'Cook',
      icon: ChefHat,
      path: '/cook',
      color: 'text-orange-500'
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      path: '/favorites',
      color: 'text-red-500'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path || 
              (tab.path === '/cook' && location.pathname.startsWith('/cook'));
            
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                  isActive 
                    ? `${tab.color} bg-primary/10` 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`relative ${isActive ? 'animate-bounce-gentle' : ''}`}>
                  <Icon className="w-6 h-6" />
                  {isActive && (
                    <div className="absolute -inset-2 rounded-full bg-primary/20 animate-pulse-glow" />
                  )}
                </div>
                <span className="text-xs font-medium">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}