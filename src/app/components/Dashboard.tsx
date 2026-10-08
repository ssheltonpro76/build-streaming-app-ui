import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Film, Music, Upload, Trash2, Edit } from "lucide-react";
import { motion } from "motion/react";

interface ContentItem {
  id: string;
  title: string;
  video_url: string;
  type: "episode" | "music" | "movie";
  image?: string;
  duration?: string;
}

interface DashboardProps {
  onClose: () => void;
}

export function Dashboard({ onClose }: DashboardProps) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [contentType, setContentType] = useState<"episode" | "music" | "movie">("episode");

  useEffect(() => {
    // Mock: Load from localStorage
    const saved = localStorage.getItem("boc_content");
    if (saved) {
      setContent(JSON.parse(saved));
    }
  }, []);

  const uploadContent = () => {
    if (!title || !videoUrl) return;

    const newItem: ContentItem = {
      id: Date.now().toString(),
      title,
      video_url: videoUrl,
      type: contentType,
      duration: "45:00",
      image: "https://images.unsplash.com/photo-1672874926745-6ba2a12c2869?w=400"
    };

    const updated = [newItem, ...content];
    setContent(updated);
    localStorage.setItem("boc_content", JSON.stringify(updated));
    
    setTitle("");
    setVideoUrl("");
  };

  const deleteContent = (id: string) => {
    const updated = content.filter(item => item.id !== id);
    setContent(updated);
    localStorage.setItem("boc_content", JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">BoC Studio Control</h1>
          <Button variant="outline" onClick={onClose}>
            Close Dashboard
          </Button>
        </div>

        {/* Upload Card */}
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload New Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Content Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-950 border-zinc-800"
              />
              
              <Input
                placeholder="Video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="bg-zinc-950 border-zinc-800"
              />

              <div className="flex gap-2">
                <Button
                  variant={contentType === "episode" ? "default" : "outline"}
                  onClick={() => setContentType("episode")}
                  className={contentType === "episode" ? "bg-red-600" : ""}
                >
                  <Film className="w-4 h-4 mr-2" />
                  Episode
                </Button>
                <Button
                  variant={contentType === "music" ? "default" : "outline"}
                  onClick={() => setContentType("music")}
                  className={contentType === "music" ? "bg-red-600" : ""}
                >
                  <Music className="w-4 h-4 mr-2" />
                  Music
                </Button>
                <Button
                  variant={contentType === "movie" ? "default" : "outline"}
                  onClick={() => setContentType("movie")}
                  className={contentType === "movie" ? "bg-red-600" : ""}
                >
                  <Film className="w-4 h-4 mr-2" />
                  Movie
                </Button>
              </div>

              <Button
                onClick={uploadContent}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Content
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Library */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Content Library ({content.length} items)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {content.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No content uploaded yet</p>
              ) : (
                content.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.type === "music" ? (
                        <Music className="w-5 h-5 text-red-400" />
                      ) : (
                        <Film className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-400 capitalize">{item.type}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteContent(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-red-400">
                {content.filter(i => i.type === "episode").length}
              </p>
              <p className="text-sm text-gray-400">Episodes</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-red-400">
                {content.filter(i => i.type === "music").length}
              </p>
              <p className="text-sm text-gray-400">Music Tracks</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-red-400">
                {content.filter(i => i.type === "movie").length}
              </p>
              <p className="text-sm text-gray-400">Movies</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}