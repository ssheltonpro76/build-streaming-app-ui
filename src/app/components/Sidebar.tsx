import { Home, Film, Music, Search, User, TrendingUp, Clock, Settings, Sparkles, LayoutDashboard } from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onSearchOpen: () => void;
  onProfileOpen: () => void;
  onDashboardOpen?: () => void;
  onAiGeneratorOpen?: () => void;
}

export function Sidebar({ 
  activeView, 
  onViewChange, 
  onSearchOpen, 
  onProfileOpen,
  onDashboardOpen,
  onAiGeneratorOpen
}: SidebarProps) {
  const navItems = [
    { icon: Home, label: "Home", view: "home" },
    { icon: Film, label: "Episodes", view: "episodes" },
    { icon: Music, label: "Music", view: "music" },
    { icon: TrendingUp, label: "Trending", view: "trending" },
    { icon: Clock, label: "History", view: "history" },
  ];

  return (
    <div className="w-20 bg-zinc-950 flex flex-col items-center py-6 gap-6 border-r border-zinc-800">
      {/* Logo */}
      <motion.div
        className="text-red-500 font-bold text-xl mb-4"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        BoC
      </motion.div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          return (
            <motion.button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`relative p-3 rounded-lg transition-colors ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-6 h-6" />
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-red-500/20 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-6">
        {onAiGeneratorOpen && (
          <motion.button
            onClick={onAiGeneratorOpen}
            className="text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="AI Generator"
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
        {onDashboardOpen && (
          <motion.button
            onClick={onDashboardOpen}
            className="text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Dashboard"
          >
            <LayoutDashboard className="w-6 h-6" />
          </motion.button>
        )}
        <motion.button
          onClick={onSearchOpen}
          className="text-gray-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={onProfileOpen}
          className="text-gray-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <User className="w-6 h-6" />
        </motion.button>
        <motion.button
          className="text-gray-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}