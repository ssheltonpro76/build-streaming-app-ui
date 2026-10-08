import { X, Search, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

const trendingSearches = [
  "Da Hood Tales",
  "Ji-c Freestyle",
  "Sons of Thunder",
  "The Baptism",
  "Call of the First Disciples",
  "Walking on the Water",
  "Big Lue Theme",
  "Street Prophets",
];

const recentSearches = [
  "Episode 1",
  "Hip-hop soundtrack",
  "The Betrayal",
];

export function SearchOverlay({ isOpen, onClose, onSearch }: SearchOverlayProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    onSearch(searchTerm);
  };

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

          {/* Search Panel */}
          <motion.div
            className="fixed inset-x-0 top-0 bg-zinc-950 border-b border-zinc-800 z-50 p-6"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="max-w-4xl mx-auto">
              {/* Search Input */}
              <div className="flex gap-3 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for episodes, music, or artists..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
                    className="pl-10 h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-400 focus:border-red-500"
                    autoFocus
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onClose}
                  className="h-12 w-12 bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Trending & Recent */}
              <div className="grid grid-cols-2 gap-8">
                {/* Trending Searches */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Trending Searches
                  </h3>
                  <div className="space-y-2">
                    {trendingSearches.map((search) => (
                      <motion.button
                        key={search}
                        onClick={() => handleSearch(search)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors text-gray-300 hover:text-white"
                        whileHover={{ x: 4 }}
                      >
                        {search}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">
                    Recent Searches
                  </h3>
                  <div className="space-y-2">
                    {recentSearches.map((search) => (
                      <motion.button
                        key={search}
                        onClick={() => handleSearch(search)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors text-gray-300 hover:text-white"
                        whileHover={{ x: 4 }}
                      >
                        {search}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}