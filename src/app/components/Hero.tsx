import { Play, Plus, Info } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface HeroProps {
  featured: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
  };
  onPlay: () => void;
  onInfo: () => void;
}

export function Hero({ featured, onPlay, onInfo }: HeroProps) {
  return (
    <motion.div
      className="relative h-[500px] rounded-2xl overflow-hidden mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={featured.image}
          alt={featured.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-2">{featured.title}</h1>
          <p className="text-xl text-red-400 mb-4">{featured.subtitle}</p>
          <p className="text-gray-300 max-w-2xl mb-6 leading-relaxed">
            {featured.description}
          </p>

          <div className="flex gap-3">
            <Button
              onClick={onPlay}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8"
            >
              <Play className="w-5 h-5 mr-2 fill-white" />
              Watch Now
            </Button>
            <Button
              onClick={onInfo}
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              My List
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}