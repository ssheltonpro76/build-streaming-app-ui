import { X, Play, Plus, Share2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

interface DetailPanelProps {
  item: {
    id: string;
    title: string;
    image: string;
    description?: string;
    duration?: string;
    type: "episode" | "music" | "movie";
    episode?: number;
    season?: number;
    releaseDate?: string;
    cast?: string[];
  } | null;
  onClose: () => void;
  onPlay: () => void;
}

export function DetailPanel({ item, onClose, onPlay }: DetailPanelProps) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed right-0 top-0 bottom-0 w-[400px] bg-zinc-950 border-l border-zinc-800 z-50 overflow-y-auto"
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          {/* Header Image */}
          <div className="relative h-[225px]">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
            
            {item.episode && (
              <p className="text-red-400 mb-3">
                Season {item.season} • Episode {item.episode}
              </p>
            )}

            {item.duration && (
              <p className="text-gray-400 text-sm mb-4">{item.duration}</p>
            )}

            <div className="flex gap-2 mb-6">
              <Button
                onClick={onPlay}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <Play className="w-4 h-4 mr-2 fill-white" />
                {item.type === "music" ? "Listen" : "Watch"}
              </Button>
              <Button variant="outline" size="icon" className="bg-zinc-900 border-zinc-800">
                <Plus className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="bg-zinc-900 border-zinc-800">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-400">About</h4>
              <p className="text-gray-300 leading-relaxed">
                {item.description ||
                  "A powerful story of faith, struggle, and redemption set against the backdrop of urban life. Where scripture meets the streets, and destiny is forged through trials and truth."}
              </p>
            </div>

            {/* Release Date */}
            {item.releaseDate && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-2 text-gray-400">Release Date</h4>
                <p className="text-gray-300">{item.releaseDate}</p>
              </div>
            )}

            {/* Cast */}
            {item.cast && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-2 text-gray-400">Cast</h4>
                <div className="flex flex-wrap gap-2">
                  {item.cast.map((person, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-zinc-900 rounded-full text-sm"
                    >
                      {person}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rating */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-400">Rate this</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-800">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-800">
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Dislike
                </Button>
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t border-zinc-800 pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Type</span>
                <span className="text-white capitalize">{item.type}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Genre</span>
                <span className="text-white">Hip-Hop Drama</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Rating</span>
                <span className="text-white">TV-MA</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}