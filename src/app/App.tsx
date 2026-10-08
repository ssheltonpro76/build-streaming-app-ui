import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Hero } from "./components/Hero";
import { ContentRow } from "./components/ContentRow";
import { DetailPanel } from "./components/DetailPanel";
import { VideoPlayer } from "./components/VideoPlayer";
import { SearchOverlay } from "./components/SearchOverlay";
import { UserProfile } from "./components/UserProfile";
import { Dashboard } from "./components/Dashboard";
import { BoCAI } from "./components/BoCAI";

// Content Data with all images
const contentData = {
  featured: {
    title: "Da Hood Tales",
    subtitle: "The Baptism Into Da Game",
    description:
      "A hip-hop biblical cinematic universe where street culture meets scripture and destiny unfolds through music and truth. Follow the journey of modern-day disciples navigating faith, loyalty, and redemption in the urban landscape.",
    image: "https://images.unsplash.com/photo-1672874926745-6ba2a12c2869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0cmVldCUyMGNpbmVtYXRpYyUyMG5pZ2h0fGVufDF8fHx8MTc3NDU1MjIyNHww&ixlib=rb-4.1.0&q=80&w=1080",
  },

  continueWatching: [
    {
      id: "cw1",
      title: "Pilot: Baptism Into Da Game",
      image: "https://images.unsplash.com/photo-1575260526066-cac1342382ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc3RyZWV0cyUyMG5pZ2h0JTIwbGlnaHRzfGVufDF8fHx8MTc3NDU1MjIyNnww&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "52:34",
      type: "episode" as const,
      season: 1,
      episode: 1,
      releaseDate: "March 15, 2026",
      cast: ["Ji-c", "Big Lue", "Judas", "Apostle John"],
    },
    {
      id: "cw2",
      title: "Call of the First Disciples",
      image: "https://images.unsplash.com/photo-1690220929690-5889d50ed11f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGJhc2tldGJhbGwlMjBjb3VydHxlbnwxfHx8fDE3NzQ1NTIyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "48:12",
      type: "episode" as const,
      season: 1,
      episode: 2,
      releaseDate: "March 22, 2026",
      cast: ["Ji-c", "Big Lue", "Simon Peter", "Andrew"],
    },
    {
      id: "cw3",
      title: "Walking on the Water",
      image: "https://images.unsplash.com/photo-1715029881512-6f10fd80a6e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMGRyYW1hdGljJTIwc3Vuc2V0fGVufDF8fHx8MTc3NDU1MjIyNHww&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "51:45",
      type: "episode" as const,
      season: 1,
      episode: 3,
      releaseDate: "March 29, 2026",
      cast: ["Ji-c", "Simon Peter", "Doubting Thomas"],
    },
  ],

  episodes: [
    {
      id: "ep1",
      title: "The Baptism - Pilot Episode",
      image: "https://images.unsplash.com/photo-1672874926745-6ba2a12c2869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0cmVldCUyMGNpbmVtYXRpYyUyMG5pZ2h0fGVufDF8fHx8MTc3NDU1MjIyNHww&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "52:34",
      type: "episode" as const,
      season: 1,
      episode: 1,
      releaseDate: "March 15, 2026",
      cast: ["Ji-c", "Big Lue", "Judas", "John"],
    },
    {
      id: "ep2",
      title: "Call of the First Disciples",
      image: "https://images.unsplash.com/photo-1690220929690-5889d50ed11f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGJhc2tldGJhbGwlMjBjb3VydHxlbnwxfHx8fDE3NzQ1NTIyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "48:12",
      type: "episode" as const,
      season: 1,
      episode: 2,
      releaseDate: "March 22, 2026",
      cast: ["Ji-c", "Big Lue", "Peter", "Andrew"],
    },
    {
      id: "ep3",
      title: "Walking on the Water",
      image: "https://images.unsplash.com/photo-1715029881512-6f10fd80a6e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMGRyYW1hdGljJTIwc3Vuc2V0fGVufDF8fHx8MTc3NDU1MjIyNHww&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "51:45",
      type: "episode" as const,
      season: 1,
      episode: 3,
      releaseDate: "March 29, 2026",
      cast: ["Ji-c", "Peter", "Thomas"],
    },
    {
      id: "ep4",
      title: "The Betrayal",
      image: "https://images.unsplash.com/photo-1648729744549-ebc4251303c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFmZml0aSUyMHdhbGwlMjBhcnR8ZW58MXx8fHwxNzc0NTUyMjI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "56:23",
      type: "episode" as const,
      season: 1,
      episode: 4,
      releaseDate: "April 5, 2026",
      cast: ["Ji-c", "Judas", "Big Lue", "Peter"],
    },
    {
      id: "ep5",
      title: "The Last Supper",
      image: "https://images.unsplash.com/photo-1686845953474-8ff11a8762d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGFyY2hpdGVjdHVyZSUyMGJ1aWxkaW5nc3xlbnwxfHx8fDE3NzQ1NTIyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "49:15",
      type: "episode" as const,
      season: 1,
      episode: 5,
      releaseDate: "April 12, 2026",
      cast: ["Ji-c", "All Disciples"],
    },
    {
      id: "ep6",
      title: "Resurrection Street",
      image: "https://images.unsplash.com/photo-1699269266070-97882aaf9fec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXAlMjBob3AlMjBkYW5jZXIlMjBzdHJlZXR8ZW58MXx8fHwxNzc0NTUyMjI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "54:02",
      type: "episode" as const,
      season: 1,
      episode: 6,
      releaseDate: "April 19, 2026",
      cast: ["Ji-c", "Mary", "Peter", "John"],
    },
  ],

  music: [
    {
      id: "m1",
      title: "Ji-c Freestyle - Da Beginning",
      image: "https://images.unsplash.com/photo-1595963202332-e837eb8e466c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXAlMjBob3AlMjBhcnRpc3QlMjBzdHVkaW98ZW58MXx8fHwxNzc0NTQ2Mjk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "3:45",
      type: "music" as const,
      releaseDate: "March 2026",
      cast: ["Ji-c"],
    },
    {
      id: "m2",
      title: "Sons of Thunder Album",
      image: "https://images.unsplash.com/photo-1689793354800-de168c0a4c9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBzdGFnZSUyMGxpZ2h0c3xlbnwxfHx8fDE3NzQ0Nzk2NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "42:18",
      type: "music" as const,
      releaseDate: "March 2026",
      cast: ["James", "John"],
    },
    {
      id: "m3",
      title: "Big Lue Theme - King of Kings",
      image: "https://images.unsplash.com/photo-1772399764232-c35bac262ed6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNvcmRpbmclMjBzdHVkaW8lMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzc0NTIxODQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "4:12",
      type: "music" as const,
      releaseDate: "March 2026",
      cast: ["Big Lue"],
    },
    {
      id: "m4",
      title: "Street Gospel Mixtape",
      image: "https://images.unsplash.com/photo-1629426958038-a4cb6e3830a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZHMlMjBtdXNpY3xlbnwxfHx8fDE3NzQ0NTIyNjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "38:45",
      type: "music" as const,
      releaseDate: "April 2026",
      cast: ["Various Artists"],
    },
    {
      id: "m5",
      title: "Betrayal Cypher",
      image: "https://images.unsplash.com/photo-1544719576-0b52abab3d03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3Bob25lJTIwcmVjb3JkaW5nJTIwYm9vdGh8ZW58MXx8fHwxNzc0NTUyMjI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "5:23",
      type: "music" as const,
      releaseDate: "April 2026",
      cast: ["Judas", "Ji-c"],
    },
  ],

  trending: [
    {
      id: "t1",
      title: "The Baptism - Pilot Episode",
      image: "https://images.unsplash.com/photo-1672874926745-6ba2a12c2869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0cmVldCUyMGNpbmVtYXRpYyUyMG5pZ2h0fGVufDF8fHx8MTc3NDU1MjIyNHww&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "52:34",
      type: "episode" as const,
      season: 1,
      episode: 1,
      releaseDate: "March 15, 2026",
      cast: ["Ji-c", "Big Lue"],
    },
    {
      id: "t2",
      title: "Ji-c Freestyle - Da Beginning",
      image: "https://images.unsplash.com/photo-1595963202332-e837eb8e466c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXAlMjBob3AlMjBhcnRpc3QlMjBzdHVkaW98ZW58MXx8fHwxNzc0NTQ2Mjk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "3:45",
      type: "music" as const,
      releaseDate: "March 2026",
      cast: ["Ji-c"],
    },
    {
      id: "t3",
      title: "The Betrayal",
      image: "https://images.unsplash.com/photo-1648729744549-ebc4251303c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFmZml0aSUyMHdhbGwlMjBhcnR8ZW58MXx8fHwxNzc0NTUyMjI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "56:23",
      type: "episode" as const,
      season: 1,
      episode: 4,
      releaseDate: "April 5, 2026",
      cast: ["Ji-c", "Judas"],
    },
    {
      id: "t4",
      title: "Sons of Thunder Album",
      image: "https://images.unsplash.com/photo-1689793354800-de168c0a4c9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBzdGFnZSUyMGxpZ2h0c3xlbnwxfHx8fDE3NzQ0Nzk2NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      duration: "42:18",
      type: "music" as const,
      releaseDate: "March 2026",
      cast: ["James", "John"],
    },
  ],
};

export default function App() {
  const [activeView, setActiveView] = useState("home");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [playingItem, setPlayingItem] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
  };

  const handlePlay = (item?: any) => {
    const itemToPlay = item || selectedItem || contentData.featured;
    setPlayingItem(itemToPlay);
    setSelectedItem(null);
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    setIsSearchOpen(false);
    // In a real app, this would filter content
  };

  const renderContent = () => {
    switch (activeView) {
      case "episodes":
        return (
          <>
            <ContentRow
              title="Season 1 Episodes"
              items={contentData.episodes}
              onItemClick={handleItemClick}
            />
            <ContentRow
              title="Continue Watching"
              items={contentData.continueWatching}
              onItemClick={handleItemClick}
            />
          </>
        );
      case "music":
        return (
          <ContentRow
            title="Original Soundtracks"
            items={contentData.music}
            onItemClick={handleItemClick}
          />
        );
      case "trending":
        return (
          <>
            <ContentRow
              title="Trending Now"
              items={contentData.trending}
              onItemClick={handleItemClick}
            />
            <ContentRow
              title="Popular Episodes"
              items={contentData.episodes}
              onItemClick={handleItemClick}
            />
          </>
        );
      case "history":
        return (
          <ContentRow
            title="Recently Watched"
            items={contentData.continueWatching}
            onItemClick={handleItemClick}
          />
        );
      default:
        return (
          <>
            <Hero
              featured={contentData.featured}
              onPlay={() => handlePlay(contentData.featured)}
              onInfo={() => handleItemClick(contentData.featured)}
            />
            <ContentRow
              title="Continue Watching"
              items={contentData.continueWatching}
              onItemClick={handleItemClick}
            />
            <ContentRow
              title="Da Hood Tales - Season 1"
              items={contentData.episodes}
              onItemClick={handleItemClick}
            />
            <ContentRow
              title="Music & Soundtracks"
              items={contentData.music}
              onItemClick={handleItemClick}
            />
            <ContentRow
              title="Trending Now"
              items={contentData.trending}
              onItemClick={handleItemClick}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onSearchOpen={() => setIsSearchOpen(true)}
        onProfileOpen={() => setIsProfileOpen(true)}
        onDashboardOpen={() => setIsDashboardOpen(true)}
        onAiGeneratorOpen={() => setIsAiGeneratorOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">{renderContent()}</div>
      </div>

      {/* Detail Panel */}
      <DetailPanel
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onPlay={() => handlePlay()}
      />

      {/* Video Player */}
      <VideoPlayer item={playingItem} onClose={() => setPlayingItem(null)} />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />

      {/* User Profile */}
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Dashboard */}
      {isDashboardOpen && (
        <Dashboard onClose={() => setIsDashboardOpen(false)} />
      )}

      {/* AI Generator */}
      <BoCAI
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
      />

      {/* Custom Scrollbar Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}