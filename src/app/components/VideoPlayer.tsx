import { X, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";
import { Button } from "./ui/button";
import { SimpleSlider } from "./SimpleSlider";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface VideoPlayerProps {
  item: {
    title: string;
    image: string;
    type: "episode" | "music" | "movie";
  } | null;
  onClose: () => void;
}

export function VideoPlayer({ item, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    if (!showControls) return;
    
    const timer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!item) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentTime = Math.floor((progress / 100) * 3600); // Mock: 60 min total
  const totalTime = 3600;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseMove={() => setShowControls(true)}
      >
        {/* Video Content */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Mock Video - Using Thumbnail */}
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-contain"
          />

          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <motion.button
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsPlaying(true)}
            >
              <div className="p-6 bg-red-600/90 rounded-full hover:bg-red-700/90 transition-colors">
                <Play className="w-16 h-16 fill-white" />
              </div>
            </motion.button>
          )}

          {/* Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress Bar */}
                <div className="mb-4">
                  <SimpleSlider
                    value={[progress]}
                    onValueChange={(value) => setProgress(value[0])}
                    max={100}
                    step={0.1}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(totalTime)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 fill-white" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <SkipForward className="w-5 h-5" />
                    </Button>
                    
                    {/* Volume */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </Button>
                      <SimpleSlider
                        value={[isMuted ? 0 : volume]}
                        onValueChange={(value) => {
                          setVolume(value[0]);
                          setIsMuted(false);
                        }}
                        max={100}
                        className="w-24"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex-1 px-6">
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Maximize className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Bar */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="absolute top-0 inset-x-0 bg-gradient-to-b from-black to-transparent p-6"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-white/20"
                >
                  <X className="w-6 h-6" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}