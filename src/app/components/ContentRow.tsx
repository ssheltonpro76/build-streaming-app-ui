import { Card, CardContent } from "./ui/card";
import { Play, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface ContentItem {
  id: string;
  title: string;
  image: string;
  duration?: string;
  type: "episode" | "music" | "movie";
  episode?: number;
  season?: number;
}

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  onItemClick: (item: ContentItem) => void;
}

export function ContentRow({ title, items, onItemClick }: ContentRowProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 px-2">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
        {items.map((item, index) => (
          <ContentCard
            key={item.id}
            item={item}
            index={index}
            onClick={() => onItemClick(item)}
          />
        ))}
      </div>
    </div>
  );
}

function ContentCard({ item, index, onClick }: { item: ContentItem; index: number; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex-shrink-0"
    >
      <Card
        className="w-[280px] bg-zinc-900 border-zinc-800 cursor-pointer overflow-hidden group relative"
        onClick={onClick}
      >
        <div className="relative">
          {/* Thumbnail */}
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-[160px] object-cover"
          />

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              className="p-3 bg-red-600 rounded-full hover:bg-red-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-5 h-5 fill-white" />
            </motion.button>
            <motion.button
              className="p-3 bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Duration Badge */}
          {item.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs">
              {item.duration}
            </div>
          )}

          {/* Episode Badge */}
          {item.episode && (
            <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded text-xs font-semibold">
              S{item.season} E{item.episode}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <p className="font-medium line-clamp-1">{item.title}</p>
          <p className="text-sm text-gray-400 capitalize">{item.type}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}