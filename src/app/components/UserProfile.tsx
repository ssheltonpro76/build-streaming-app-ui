import { X, User, Settings, LogOut, Crown, Heart, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const stats = [
    { label: "Watch Time", value: "127 hrs", icon: Clock },
    { label: "Favorites", value: "24", icon: Heart },
    { label: "Membership", value: "Premium", icon: Crown },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Profile Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-[380px] bg-zinc-950 border-l border-zinc-800 z-50 overflow-y-auto"
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold">Profile</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Avatar & Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Street Prophet</h3>
                  <p className="text-sm text-gray-400">prophet@dahood.tv</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="bg-zinc-900 rounded-lg p-3 text-center"
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1 text-red-400" />
                      <p className="text-sm font-semibold">{stat.value}</p>
                      <p className="text-xs text-gray-400">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Continue Watching */}
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">
                Continue Watching
              </h3>
              <div className="space-y-3">
                {[
                  { title: "Da Hood Tales", episode: "S1 E3", progress: 67 },
                  { title: "Walking on Water", episode: "S1 E4", progress: 23 },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-zinc-900 rounded-lg p-3 cursor-pointer hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.episode}</p>
                      </div>
                      <span className="text-xs text-red-400">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1">
                      <div
                        className="bg-red-600 h-1 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* My List */}
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">
                My List
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-red-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Settings & Actions */}
            <div className="p-6">
              <Button
                variant="ghost"
                className="w-full justify-start mb-2 hover:bg-zinc-900"
              >
                <Settings className="w-5 h-5 mr-3" />
                Account Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start mb-2 hover:bg-zinc-900"
              >
                <Crown className="w-5 h-5 mr-3 text-yellow-500" />
                Upgrade to Premium
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/20"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}