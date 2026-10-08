import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import {
  Sparkles, Send, X, Download, Image as ImageIcon, Upload,
  FileText, Users, Layout, Video, Music, Scissors, Film,
  ChevronRight, Check, Plus, Heart, MessageSquare, Edit3,
  Play, Pause, SkipBack, SkipForward, Trash2, Copy, RefreshCw,
  Settings, Wand2, FileVideo, FileAudio, Clock, ZoomIn, ZoomOut,
  Globe, Mic, Radio, BookOpen, Map, Star, Layers, Volume2,
  Share2, Tv, Package, ChevronDown, ChevronUp, Palette,
  AlignLeft, AlignCenter, Type, BarChart2, Award, Rocket,
  Headphones, Languages, UploadCloud, TrendingUp, Lock,
  Clapperboard, MonitorPlay, Repeat2, Bookmark, Zap,
  Camera, SlidersHorizontal, ImagePlay, Shuffle, Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

interface StoryboardShot {
  id: string;
  title: string;
  frames: KeyFrame[];
  duration: number;
  liked?: boolean;
  comments?: Comment[];
}

interface KeyFrame {
  id: string;
  image: string;
  prompt: string;
  model: string;
  type: "text-to-image" | "image-to-image";
  duration?: number;
  liked?: boolean;
}

interface Comment {
  id: string;
  text: string;
  timestamp: Date;
}

interface TimelineClip {
  id: string;
  type: "video" | "image" | "audio";
  source: string;
  start: number;
  duration: number;
  speed: number;
  volume: number;
}

interface AIModel {
  id: string;
  name: string;
  type: "image" | "video" | "audio";
}

// Vidu types
interface ViduGenerationMode {
  id: "text" | "image" | "reference";
  label: string;
  icon: React.ReactNode;
  desc: string;
}

interface ViduReference {
  id: string;
  name: string;
  image: string;
  type: "character" | "prop" | "scene" | "style";
  saved: boolean;
}

interface ViduOutput {
  id: string;
  prompt: string;
  model: string;
  mode: string;
  thumbnail: string;
  duration: number;
  resolution: string;
  hasAudio: boolean;
  liked: boolean;
  style: string;
}

interface ScriptScene {
  id: string;
  act: number;
  sceneNumber: number;
  heading: string;
  action: string;
  dialogue: { character: string; line: string }[];
  notes: string;
}

interface WorldCharacter {
  id: string;
  name: string;
  role: string;
  description: string;
  backstory: string;
  image: string;
  traits: string[];
}

interface WorldLocation {
  id: string;
  name: string;
  type: string;
  description: string;
  image: string;
}

interface SoundTrack {
  id: string;
  scene: string;
  genre: string;
  mood: string;
  tempo: string;
  duration: number;
  generated: boolean;
}

interface VoiceTrack {
  id: string;
  character: string;
  language: string;
  voice: string;
  text: string;
  generated: boolean;
}

interface DistributionPlatform {
  id: string;
  name: string;
  icon: string;
  status: "ready" | "pending" | "live";
  audience: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

interface BoCAIProps {
  isOpen: boolean;
  onClose: () => void;
}

const AI_MODELS: AIModel[] = [
  { id: "nano-banana", name: "Nano Banana Pro", type: "image" },
  { id: "vidu-q3-pro", name: "Vidu Q3 Pro ★ #1 Global", type: "video" },
  { id: "vidu-q3", name: "Vidu Q3 (16s + Audio)", type: "video" },
  { id: "vidu-q2-pro", name: "Vidu Q2 Pro", type: "video" },
  { id: "vidu-claw", name: "Vidu Claw (Marketing)", type: "video" },
  { id: "seedance-15", name: "Seedance 1.5 Pro", type: "video" },
  { id: "seedance-20", name: "Seedance 2.0", type: "video" },
  { id: "kling-30", name: "Kling 3.0", type: "video" },
  { id: "sora-2", name: "Sora 2 Pro", type: "video" },
  { id: "veo-31", name: "Veo 3.1", type: "video" },
  { id: "suno-v5", name: "Suno v5", type: "audio" },
];

const VIDU_MODELS = [
  { id: "vidu-q3-pro", name: "Vidu Q3 Pro", badge: "#1 Global", desc: "Best motion, 16s, 1080p, native audio" },
  { id: "vidu-q3", name: "Vidu Q3", badge: "Fast", desc: "Cinematic camera, synced SFX + BGM" },
  { id: "vidu-q2-pro", name: "Vidu Q2 Pro", badge: "#2 Global", desc: "Sharp semantics, lively motion" },
  { id: "vidu-claw", name: "Vidu Claw", badge: "Marketing", desc: "Ad & brand content specialist" },
];

const VIDU_STYLES = [
  { id: "realistic", label: "Realistic", preview: "🎬" },
  { id: "anime", label: "Anime", preview: "✨" },
  { id: "cinematic", label: "Cinematic", preview: "🎥" },
  { id: "scifi", label: "Sci-Fi", preview: "🚀" },
  { id: "fantasy", label: "Fantasy", preview: "🐉" },
  { id: "documentary", label: "Documentary", preview: "📽️" },
];

const VIDU_CAMERAS = [
  { id: "auto", label: "Auto" },
  { id: "pan-left", label: "Pan Left" },
  { id: "pan-right", label: "Pan Right" },
  { id: "zoom-in", label: "Zoom In" },
  { id: "zoom-out", label: "Zoom Out" },
  { id: "dolly", label: "Dolly" },
  { id: "tilt-up", label: "Tilt Up" },
  { id: "tilt-down", label: "Tilt Down" },
  { id: "orbit", label: "Orbit" },
  { id: "tracking", label: "Tracking" },
];

const VIDU_DURATIONS = ["4s", "8s", "16s"];
const VIDU_RESOLUTIONS = ["720p", "1080p"];

const SAMPLE_REFERENCES: ViduReference[] = [
  { id: "ref-1", name: "Solomon", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", type: "character", saved: true },
  { id: "ref-2", name: "Queen Zara", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200", type: "character", saved: true },
  { id: "ref-3", name: "City Streets", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=200", type: "scene", saved: true },
  { id: "ref-4", name: "Studio Interior", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200", type: "scene", saved: false },
  { id: "ref-5", name: "Cinematic Style", image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=200", type: "style", saved: true },
];

const SAMPLE_OUTPUTS: ViduOutput[] = [
  { id: "out-1", prompt: "Solomon walks through Brooklyn streets at golden hour, cinematic tracking shot", model: "Vidu Q3 Pro", mode: "text", thumbnail: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400", duration: 8, resolution: "1080p", hasAudio: true, liked: true, style: "Cinematic" },
  { id: "out-2", prompt: "Queen Zara in recording studio, ambient lighting, camera slowly pushes in", model: "Vidu Q3", mode: "reference", thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400", duration: 4, resolution: "1080p", hasAudio: true, liked: false, style: "Realistic" },
  { id: "out-3", prompt: "Anime-style performance scene with dynamic energy and crowd", model: "Vidu Q2 Pro", mode: "image", thumbnail: "https://images.unsplash.com/photo-1574607383476-f517f260d30b?w=400", duration: 4, resolution: "720p", hasAudio: false, liked: false, style: "Anime" },
];

const POPULAR_PROMPTS = [
  "Create a cinematic hip-hop music video with urban aesthetics",
  "Generate a street documentary opening scene at golden hour",
  "Produce a character-driven narrative with emotional depth",
  "Create an action sequence with dynamic camera movements",
  "Generate atmospheric B-roll footage for storytelling",
  "Create a lyric video with animated typography",
];

const WORKFLOWS = [
  { id: "sora-2", name: "Sora 2 Workflow", description: "Multi-shot editing with seamless transitions" },
  { id: "character-first", name: "Character-First", description: "Generate characters, then build story" },
  { id: "music-driven", name: "Music-Driven", description: "Start with audio, generate visuals" },
  { id: "script-to-screen", name: "Script-to-Screen", description: "Full script breakdown workflow" },
];

const SAMPLE_SCENES: ScriptScene[] = [
  {
    id: "s1", act: 1, sceneNumber: 1,
    heading: "EXT. BROOKLYN STREETS - DAWN",
    action: "We open on a deserted street corner. Graffiti covers every surface. SOLOMON, 28, walks with purpose, hood up, breath visible in the cold morning air.",
    dialogue: [
      { character: "SOLOMON", line: "(to himself)\nEvery king started somewhere..." }
    ],
    notes: "Establish theme of rising from nothing. Blue-toned lighting."
  },
  {
    id: "s2", act: 1, sceneNumber: 2,
    heading: "INT. SOLOMON'S APARTMENT - CONTINUOUS",
    action: "A sparse room. Bible on one side, a beat machine on the other. Solomon sits, opens both. He begins to write.",
    dialogue: [
      { character: "SOLOMON", line: "They said Goliath was unstoppable.\nThey forgot who threw the stone." }
    ],
    notes: "Close-up on hands moving between both books. Warm lamp glow."
  },
];

const SAMPLE_CHARACTERS: WorldCharacter[] = [
  {
    id: "c1", name: "Solomon", role: "Protagonist",
    description: "A gifted rapper and street philosopher who discovers his ancient lineage.",
    backstory: "Raised in Brooklyn by his grandmother, Solomon always felt called to something greater. After finding his grandfather's journals linking their family to ancient Hebrew scholars, he embarks on a journey to reconcile faith and street life.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    traits: ["Wise", "Conflicted", "Magnetic", "Loyal"]
  },
  {
    id: "c2", name: "Queen Zara", role: "Supporting Lead",
    description: "A music producer and spiritual leader who guides Solomon's path.",
    backstory: "Descended from a line of Ethiopian scholars, Zara moved to New York to preserve ancient musical traditions by fusing them with modern production.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300",
    traits: ["Powerful", "Mysterious", "Nurturing", "Ancient Knowledge"]
  },
];

const SAMPLE_LOCATIONS: WorldLocation[] = [
  { id: "l1", name: "The Cornerstone Studio", type: "Interior", description: "Underground recording studio built inside a converted church basement. Sacred geometry covers the walls.", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300" },
  { id: "l2", name: "Brooklyn Heights", type: "Exterior", description: "The streets where Solomon grew up. A battleground and a home.", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=300" },
];

const SAMPLE_SOUNDTRACKS: SoundTrack[] = [
  { id: "t1", scene: "Opening - City Streets", genre: "Cinematic Hip-Hop", mood: "Determined", tempo: "85 BPM", duration: 120, generated: true },
  { id: "t2", scene: "Character Introduction", genre: "Gospel Trap", mood: "Spiritual", tempo: "70 BPM", duration: 90, generated: false },
  { id: "t3", scene: "Performance Scene", genre: "Hard Rap", mood: "Triumphant", tempo: "96 BPM", duration: 180, generated: true },
];

const VOICE_LANGUAGES = ["English (US)", "English (UK)", "Spanish", "French", "Portuguese", "Swahili", "Arabic", "Mandarin", "Hindi", "Yoruba"];

const DISTRIBUTION_PLATFORMS: DistributionPlatform[] = [
  { id: "youtube", name: "YouTube", icon: "🎬", status: "ready", audience: "2.7B users" },
  { id: "netflix", name: "Netflix", icon: "🔴", status: "pending", audience: "238M subscribers" },
  { id: "prime", name: "Amazon Prime", icon: "📦", status: "pending", audience: "200M+ members" },
  { id: "tiktok", name: "TikTok", icon: "🎵", status: "ready", audience: "1.5B users" },
  { id: "instagram", name: "Instagram Reels", icon: "📸", status: "ready", audience: "2B users" },
  { id: "vimeo", name: "Vimeo", icon: "🎥", status: "ready", audience: "Creator focused" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

type TabId = "chat" | "generate" | "screenwriter" | "worldbuilder" | "storyboard" | "timeline" | "voicescore" | "distribution";

const TABS: { id: TabId; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: "chat", label: "Conversation", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "generate", label: "Generate", icon: <Clapperboard className="w-4 h-4" />, badge: "Vidu" },
  { id: "screenwriter", label: "Screenwriter", icon: <BookOpen className="w-4 h-4" />, badge: "AI" },
  { id: "worldbuilder", label: "World Builder", icon: <Globe className="w-4 h-4" />, badge: "AI" },
  { id: "storyboard", label: "Storyboard", icon: <Layout className="w-4 h-4" /> },
  { id: "timeline", label: "Editor", icon: <Film className="w-4 h-4" /> },
  { id: "voicescore", label: "Voice & Score", icon: <Mic className="w-4 h-4" />, badge: "AI" },
  { id: "distribution", label: "Distribution", icon: <Rocket className="w-4 h-4" /> },
];

export function BoCAI({ isOpen, onClose }: BoCAIProps) {
  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Welcome to BoCAI Studio — your full-process AI production suite.\n\nPowered by Flova + SuperCool AI, you can:\n• Write screenplays & dialogue with AI\n• Build your world: characters, locations & lore\n• Generate storyboards & keyframes\n• Compose original scores & voice your cast\n• Edit, color-grade, and mix your film\n• Distribute to Netflix, YouTube, Prime & more\n\nWhat would you like to create today?",
      suggestions: ["Write a screenplay", "Build my world", "Generate a music video", "Upload reference images"]
    }
  ]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("seedance-15");
  const [storyboardShots, setStoryboardShots] = useState<StoryboardShot[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Vidu Generate
  const [viduMode, setViduMode] = useState<"text" | "image" | "reference">("text");
  const [viduModel, setViduModel] = useState("vidu-q3-pro");
  const [viduPrompt, setViduPrompt] = useState("");
  const [viduNegativePrompt, setViduNegativePrompt] = useState("");
  const [viduStyle, setViduStyle] = useState("cinematic");
  const [viduCamera, setViduCamera] = useState("auto");
  const [viduDuration, setViduDuration] = useState("8s");
  const [viduResolution, setViduResolution] = useState("1080p");
  const [viduDraftMode, setViduDraftMode] = useState(false);
  const [viduOffPeak, setViduOffPeak] = useState(false);
  const [viduAudioSync, setViduAudioSync] = useState(true);
  const [viduSFX, setViduSFX] = useState(true);
  const [viduBGM, setViduBGM] = useState(true);
  const [viduDialogue, setViduDialogue] = useState(false);
  const [viduDialogueLang, setViduDialogueLang] = useState("English");
  const [viduFirstFrame, setViduFirstFrame] = useState<string | null>(null);
  const [viduLastFrame, setViduLastFrame] = useState<string | null>(null);
  const [viduRefs, setViduRefs] = useState<ViduReference[]>([]);
  const [myReferences, setMyReferences] = useState<ViduReference[]>(SAMPLE_REFERENCES);
  const [viduOutputs, setViduOutputs] = useState<ViduOutput[]>(SAMPLE_OUTPUTS);
  const [isGeneratingVidu, setIsGeneratingVidu] = useState(false);
  const [viduProgress, setViduProgress] = useState(0);
  const [viduTab, setViduTab] = useState<"create" | "gallery" | "references">("create");
  const [viduCredits] = useState(80);
  const viduFileRef = useRef<HTMLInputElement>(null);
  const viduFirstFrameRef = useRef<HTMLInputElement>(null);
  const viduLastFrameRef = useRef<HTMLInputElement>(null);

  // Screenwriter
  const [scriptScenes, setScriptScenes] = useState<ScriptScene[]>(SAMPLE_SCENES);
  const [selectedScene, setSelectedScene] = useState<string | null>("s1");
  const [scriptTitle, setScriptTitle] = useState("Da Hood Tales: Pilot");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [scriptPrompt, setScriptPrompt] = useState("");

  // World Builder
  const [characters, setCharacters] = useState<WorldCharacter[]>(SAMPLE_CHARACTERS);
  const [locations, setLocations] = useState<WorldLocation[]>(SAMPLE_LOCATIONS);
  const [worldTab, setWorldTab] = useState<"characters" | "locations" | "lore">("characters");
  const [loreText, setLoreText] = useState("Da Hood Tales exists in a present-day Brooklyn where ancient Hebrew, Ethiopian, and West African spiritual traditions have survived in coded form through hip-hop culture. Street art contains ancient glyphs. Certain beats carry frequencies that unlock ancestral memory. The conflict between the material world and the spiritual covenant is the central tension of the universe.");
  const [expandedChar, setExpandedChar] = useState<string | null>("c1");

  // Voice & Score
  const [soundtracks, setSoundtracks] = useState<SoundTrack[]>(SAMPLE_SOUNDTRACKS);
  const [voiceTracks, setVoiceTracks] = useState<VoiceTrack[]>([
    { id: "v1", character: "Solomon", language: "English (US)", voice: "Deep Male", text: "Every king started somewhere...", generated: true },
    { id: "v2", character: "Queen Zara", language: "English (US)", voice: "Warm Female", text: "They said Goliath was unstoppable. They forgot who threw the stone.", generated: false },
  ]);
  const [scoreTab, setScoreTab] = useState<"soundtrack" | "voice" | "dub">("soundtrack");
  const [selectedDubLang, setSelectedDubLang] = useState("Spanish");
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<string | null>(null);

  // Distribution
  const [platforms, setPlatforms] = useState<DistributionPlatform[]>(DISTRIBUTION_PLATFORMS);
  const [posterGenerated, setPosterGenerated] = useState(false);
  const [trailerGenerated, setTrailerGenerated] = useState(false);
  const [pitchDeckGenerated, setPitchDeckGenerated] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Conversation handlers ──────────────────────────────────────────────────

  const handleGenerate = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;
    const userMessage: Message = { role: "user", content: input || `Uploaded ${uploadedFiles.length} file(s)` };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);
    setTimeout(() => {
      const response = generateAIResponse();
      setMessages(prev => [...prev, response]);
      setIsGenerating(false);
      if (storyboardShots.length === 0) generateSampleStoryboard();
    }, 2000);
  };

  const generateAIResponse = (): Message => {
    const responses = [
      {
        content: "✨ Production plan created:\n\n**Creative Brief:**\n- Genre: Hip-hop cinematic narrative\n- Style: Urban documentary meets music video\n- Duration: 2-3 minutes\n- Aspect Ratio: 16:9\n\nI've drafted opening scenes in the Screenwriter tab and populated your World Builder with characters and locations.\n\nShall I generate the full storyboard?",
        suggestions: ["Generate storyboard", "Refine screenplay", "Add characters", "Compose score"]
      },
      {
        content: "🎬 Storyboard generated!\n\n**Next Steps:**\n1. Review each shot in the Storyboard tab\n2. Head to Voice & Score to add music and dialogue\n3. Assemble your final cut in the Editor\n4. Publish via the Distribution tab\n\nWhat would you like to refine?",
        suggestions: ["Generate videos", "Write more dialogue", "Add transition effects", "Create poster"]
      }
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateSampleStoryboard = () => {
    setStoryboardShots([
      { id: "shot-1", title: "Opening - City Streets at Sunset", duration: 8, frames: [
        { id: "f1", image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400", prompt: "Wide shot of city streets at golden hour", model: "nano-banana", type: "text-to-image" },
        { id: "f2", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400", prompt: "Urban landscape with dramatic lighting", model: "nano-banana", type: "text-to-image" },
      ], comments: [] },
      { id: "shot-2", title: "Character Introduction", duration: 10, frames: [
        { id: "f3", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", prompt: "Portrait of main character, confident expression", model: "nano-banana", type: "text-to-image" },
        { id: "f4", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", prompt: "Character in urban setting, medium shot", model: "nano-banana", type: "text-to-image" },
      ], comments: [] },
      { id: "shot-3", title: "Performance Scene", duration: 12, frames: [
        { id: "f5", image: "https://images.unsplash.com/photo-1574607383476-f517f260d30b?w=400", prompt: "Artist performing with dramatic stage lighting", model: "nano-banana", type: "text-to-image" },
        { id: "f6", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400", prompt: "Close-up performance shot with energy", model: "nano-banana", type: "text-to-image" },
      ], comments: [] },
    ]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    setShowUploadMenu(false);
  };

  const toggleLikeShot = (shotId: string) => {
    setStoryboardShots(shots => shots.map(s => s.id === shotId ? { ...s, liked: !s.liked } : s));
  };

  const toggleLikeFrame = (shotId: string, frameId: string) => {
    setStoryboardShots(shots => shots.map(s =>
      s.id === shotId ? { ...s, frames: s.frames.map(f => f.id === frameId ? { ...f, liked: !f.liked } : f) } : s
    ));
  };

  const addCommentToShot = (shotId: string, text: string) => {
    setStoryboardShots(shots => shots.map(s =>
      s.id === shotId ? { ...s, comments: [...(s.comments || []), { id: Date.now().toString(), text, timestamp: new Date() }] } : s
    ));
  };

  const startNewProject = () => {
    if (window.confirm("Start a new project? Context is preserved.")) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "✨ New project started! Previous context preserved. What would you like to create next?",
        suggestions: ["Continue with same characters", "New story arc", "Different style"]
      }]);
    }
  };

  // ── Vidu handlers ─────────────────────────────────────────────────────────

  const handleViduGenerate = () => {
    if (!viduPrompt.trim() && viduMode === "text") return;
    setIsGeneratingVidu(true);
    setViduProgress(0);
    const interval = setInterval(() => {
      setViduProgress(p => {
        if (p >= 95) { clearInterval(interval); return p; }
        return p + Math.random() * 15;
      });
    }, 300);
    const genTime = viduDraftMode ? 2000 : 4000;
    setTimeout(() => {
      clearInterval(interval);
      setViduProgress(100);
      const thumbs = [
        "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400",
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        "https://images.unsplash.com/photo-1574607383476-f517f260d30b?w=400",
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      ];
      const newOutput: ViduOutput = {
        id: `out-${Date.now()}`,
        prompt: viduPrompt || "Reference-based generation",
        model: VIDU_MODELS.find(m => m.id === viduModel)?.name || "Vidu Q3 Pro",
        mode: viduMode,
        thumbnail: thumbs[Math.floor(Math.random() * thumbs.length)],
        duration: parseInt(viduDuration),
        resolution: viduResolution,
        hasAudio: viduAudioSync,
        liked: false,
        style: VIDU_STYLES.find(s => s.id === viduStyle)?.label || "Cinematic",
      };
      setViduOutputs(prev => [newOutput, ...prev]);
      setIsGeneratingVidu(false);
      setViduProgress(0);
      setViduTab("gallery");
    }, genTime);
  };

  const toggleSaveRef = (id: string) => {
    setMyReferences(prev => prev.map(r => r.id === id ? { ...r, saved: !r.saved } : r));
  };

  const addViduRef = (ref: ViduReference) => {
    if (viduRefs.length >= 7) return;
    if (!viduRefs.find(r => r.id === ref.id)) {
      setViduRefs(prev => [...prev, ref]);
    }
  };

  const removeViduRef = (id: string) => {
    setViduRefs(prev => prev.filter(r => r.id !== id));
  };

  const toggleLikeOutput = (id: string) => {
    setViduOutputs(prev => prev.map(o => o.id === id ? { ...o, liked: !o.liked } : o));
  };

  const remixOutput = (output: ViduOutput) => {
    setViduPrompt(output.prompt);
    setViduMode("text");
    setViduTab("create");
  };

  // ── Screenwriter handlers ──────────────────────────────────────────────────

  const generateScene = () => {
    if (!scriptPrompt.trim()) return;
    setIsGeneratingScript(true);
    setTimeout(() => {
      const newScene: ScriptScene = {
        id: `s${Date.now()}`,
        act: 1,
        sceneNumber: scriptScenes.length + 1,
        heading: "INT. RECORDING STUDIO - NIGHT",
        action: `${scriptPrompt}. Solomon leans over the console, headphones around his neck. The beat drops and he closes his eyes — something ancient stirs.`,
        dialogue: [
          { character: "SOLOMON", line: "This is bigger than a song.\nThis is a covenant." },
          { character: "QUEEN ZARA", line: "Then treat it like one." }
        ],
        notes: "AI-generated from your prompt. Tone: contemplative. Lighting: warm amber."
      };
      setScriptScenes(prev => [...prev, newScene]);
      setSelectedScene(newScene.id);
      setScriptPrompt("");
      setIsGeneratingScript(false);
    }, 2000);
  };

  const deleteScene = (id: string) => {
    setScriptScenes(prev => prev.filter(s => s.id !== id));
    if (selectedScene === id) setSelectedScene(null);
  };

  // ── Voice & Score handlers ─────────────────────────────────────────────────

  const generateTrack = (id: string) => {
    setIsGeneratingAudio(id);
    setTimeout(() => {
      setSoundtracks(prev => prev.map(t => t.id === id ? { ...t, generated: true } : t));
      setIsGeneratingAudio(null);
    }, 2500);
  };

  const generateVoice = (id: string) => {
    setIsGeneratingAudio(id);
    setTimeout(() => {
      setVoiceTracks(prev => prev.map(v => v.id === id ? { ...v, generated: true } : v));
      setIsGeneratingAudio(null);
    }, 2000);
  };

  const generateDub = () => {
    setIsGeneratingAudio("dub");
    setTimeout(() => setIsGeneratingAudio(null), 3000);
  };

  // ── Distribution handlers ──────────────────────────────────────────────────

  const publishToPlatform = (id: string) => {
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, status: "live" } : p));
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  const selectedSceneData = scriptScenes.find(s => s.id === selectedScene);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-4 z-50 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex flex-col"
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-red-500 to-purple-600 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-none">BoCAI Studio <span className="text-gray-400 font-normal">• Powered by Flova + SuperCool AI</span></h2>
                  <p className="text-xs text-gray-500 mt-0.5">Full-Process AI Film Production</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={startNewProject} className="bg-zinc-900 border-zinc-700">
                  <Plus className="w-4 h-4 mr-1" /> New Project
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)} className="bg-zinc-900 border-zinc-700">
                  <Download className="w-4 h-4 mr-1" /> Export
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
              </div>
            </div>

            {/* Tab Bar */}
            <div className="flex border-b border-zinc-800 bg-zinc-900/30 overflow-x-auto shrink-0">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap shrink-0 ${
                    activeTab === tab.id ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.badge && (
                    <span className="text-[9px] bg-red-600 text-white px-1 rounded font-bold leading-4">{tab.badge}</span>
                  )}
                  {activeTab === tab.id && (
                    <motion.div layoutId="bocaiActiveTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex min-h-0">

              {/* ── CONVERSATION TAB ─────────────────────────────────────────── */}
              {activeTab === "chat" && (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message, index) => (
                      <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] ${message.role === "user" ? "" : "space-y-3"}`}>
                          <div className={`rounded-xl p-4 ${message.role === "user" ? "bg-red-600 text-white" : "bg-zinc-800 text-gray-100"}`}>
                            {message.role === "assistant" && (
                              <div className="flex items-center gap-2 mb-2 text-red-400">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-xs font-medium">BoCAI</span>
                              </div>
                            )}
                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                          </div>
                          {message.suggestions && (
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((s, i) => (
                                <Button key={i} variant="outline" size="sm" onClick={() => setInput(s)}
                                  className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-xs">{s}</Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {isGenerating && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-zinc-800 rounded-xl p-4">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
                            <span className="text-sm text-gray-400">BoCAI is generating...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t border-zinc-800 bg-zinc-900/30 p-4 space-y-3 shrink-0">
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Popular Prompts</p>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {POPULAR_PROMPTS.map((p, i) => (
                          <Button key={i} variant="outline" size="sm" onClick={() => setInput(p)}
                            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 whitespace-nowrap text-xs">
                            <Wand2 className="w-3 h-3 mr-1" />{p.slice(0, 40)}...
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Workflows</p>
                      <div className="flex gap-2 overflow-x-auto">
                        {WORKFLOWS.map(w => (
                          <Card key={w.id} className="bg-zinc-800 border-zinc-700 min-w-48 cursor-pointer hover:border-zinc-600 transition-colors">
                            <CardContent className="p-3">
                              <p className="text-sm font-medium mb-1">{w.name}</p>
                              <p className="text-xs text-gray-400">{w.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 bg-zinc-900/50 p-4 shrink-0">
                    <div className="flex gap-2 mb-2">
                      <div className="relative">
                        <Button variant="outline" size="sm" onClick={() => setShowUploadMenu(!showUploadMenu)} className="bg-zinc-800 border-zinc-700">
                          <Plus className="w-4 h-4" />
                        </Button>
                        {showUploadMenu && (
                          <div className="absolute bottom-full left-0 mb-2 bg-zinc-800 border border-zinc-700 rounded-lg p-2 space-y-1 min-w-40 z-10">
                            {[
                              { icon: <ImageIcon className="w-3 h-3 mr-2" />, label: "Upload Image" },
                              { icon: <FileVideo className="w-3 h-3 mr-2" />, label: "Upload Video" },
                              { icon: <FileAudio className="w-3 h-3 mr-2" />, label: "Upload Audio" },
                              { icon: <FileText className="w-3 h-3 mr-2" />, label: "Upload Script" },
                            ].map(item => (
                              <Button key={item.label} variant="ghost" size="sm" className="w-full justify-start text-xs"
                                onClick={() => fileInputRef.current?.click()}>
                                {item.icon}{item.label}
                              </Button>
                            ))}
                          </div>
                        )}
                        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} accept="image/*,video/*,audio/*,.txt,.pdf" />
                      </div>
                      <div className="relative">
                        <Button variant="outline" size="sm" onClick={() => setShowModelPicker(!showModelPicker)} className="bg-zinc-800 border-zinc-700">
                          <Settings className="w-4 h-4 mr-1" />
                          {AI_MODELS.find(m => m.id === selectedModel)?.name}
                        </Button>
                        {showModelPicker && (
                          <div className="absolute bottom-full left-0 mb-2 bg-zinc-800 border border-zinc-700 rounded-lg p-2 space-y-1 min-w-56 max-h-64 overflow-y-auto z-10">
                            {AI_MODELS.map(model => (
                              <Button key={model.id} variant="ghost" size="sm"
                                className={`w-full justify-start text-xs ${selectedModel === model.id ? "bg-zinc-700" : ""}`}
                                onClick={() => { setSelectedModel(model.id); setShowModelPicker(false); }}>
                                {model.name}
                                <span className="ml-auto text-xs text-gray-500 capitalize">{model.type}</span>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                      {uploadedFiles.length > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded text-xs">
                          <Upload className="w-3 h-3" />{uploadedFiles.length} file(s)
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Textarea placeholder="Enter your idea, story, script, or request..." value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                        className="flex-1 bg-zinc-800 border-zinc-700 min-h-20 resize-none" disabled={isGenerating} />
                      <Button onClick={handleGenerate} disabled={isGenerating} className="bg-red-600 hover:bg-red-700 h-20">
                        <Sparkles className="w-4 h-4 mr-2" />Generate
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── GENERATE TAB (Vidu) ──────────────────────────────────────── */}
              {activeTab === "generate" && (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Sub-tab bar */}
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-900/40 shrink-0">
                    <div className="flex gap-1">
                      {(["create", "gallery", "references"] as const).map(t => (
                        <button key={t} onClick={() => setViduTab(t)}
                          className={`px-4 py-1.5 rounded text-sm capitalize font-medium transition-colors ${viduTab === t ? "bg-red-600 text-white" : "text-gray-400 hover:text-white hover:bg-zinc-800"}`}>
                          {t === "create" ? "✦ Create" : t === "gallery" ? `🎞 Gallery (${viduOutputs.length})` : `📁 My References (${myReferences.filter(r => r.saved).length})`}
                        </button>
                      ))}
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      {/* Off-peak toggle */}
                      <button onClick={() => setViduOffPeak(!viduOffPeak)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${viduOffPeak ? "bg-green-600/20 text-green-400 border border-green-600/40" : "bg-zinc-800 text-gray-400 border border-zinc-700"}`}>
                        <Zap className="w-3 h-3" />
                        {viduOffPeak ? "Off-Peak: ∞ Free" : "Off-Peak Mode"}
                      </button>
                      {/* Credits */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-xs">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-gray-300">{viduCredits} credits</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden flex min-h-0">
                    {/* ── CREATE PANEL ── */}
                    {viduTab === "create" && (
                      <div className="flex-1 flex min-h-0">
                        {/* Left: Controls */}
                        <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-900/30 shrink-0 overflow-y-auto">
                          <div className="p-4 space-y-4">
                            {/* Model selector */}
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Model</label>
                              <div className="space-y-1.5">
                                {VIDU_MODELS.map(m => (
                                  <button key={m.id} onClick={() => setViduModel(m.id)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${viduModel === m.id ? "bg-red-600/10 border-red-600/60 text-white" : "bg-zinc-800/60 border-zinc-700 text-gray-300 hover:border-zinc-600"}`}>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">{m.name}</span>
                                      <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${m.badge === "#1 Global" ? "bg-yellow-500/20 text-yellow-400" : m.badge === "Marketing" ? "bg-blue-500/20 text-blue-400" : "bg-zinc-700 text-gray-400"}`}>{m.badge}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Mode */}
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Generation Mode</label>
                              <div className="grid grid-cols-3 gap-1.5">
                                {([
                                  { id: "text", label: "Text→Video", icon: <Type className="w-3.5 h-3.5" /> },
                                  { id: "image", label: "Image→Video", icon: <ImagePlay className="w-3.5 h-3.5" /> },
                                  { id: "reference", label: "Reference", icon: <Layers className="w-3.5 h-3.5" /> },
                                ] as const).map(mode => (
                                  <button key={mode.id} onClick={() => setViduMode(mode.id)}
                                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-colors ${viduMode === mode.id ? "bg-red-600/20 border-red-600/60 text-white" : "bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-600"}`}>
                                    {mode.icon}
                                    <span className="leading-tight text-center">{mode.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Style */}
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Style</label>
                              <div className="grid grid-cols-3 gap-1.5">
                                {VIDU_STYLES.map(s => (
                                  <button key={s.id} onClick={() => setViduStyle(s.id)}
                                    className={`flex items-center gap-1 px-2 py-1.5 rounded border text-xs transition-colors ${viduStyle === s.id ? "bg-red-600/20 border-red-600/60 text-white" : "bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-600"}`}>
                                    <span>{s.preview}</span><span>{s.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Camera */}
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
                                <Camera className="w-3 h-3" /> Camera Movement
                              </label>
                              <div className="grid grid-cols-2 gap-1">
                                {VIDU_CAMERAS.map(c => (
                                  <button key={c.id} onClick={() => setViduCamera(c.id)}
                                    className={`px-2 py-1.5 rounded border text-xs transition-colors ${viduCamera === c.id ? "bg-red-600/20 border-red-600/60 text-white" : "bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-600"}`}>
                                    {c.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Duration & Resolution */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Duration</label>
                                <div className="flex gap-1">
                                  {VIDU_DURATIONS.map(d => (
                                    <button key={d} onClick={() => setViduDuration(d)}
                                      className={`flex-1 py-1.5 rounded border text-xs transition-colors ${viduDuration === d ? "bg-red-600/20 border-red-600/60 text-white" : "bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-600"}`}>
                                      {d}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Resolution</label>
                                <div className="flex gap-1">
                                  {VIDU_RESOLUTIONS.map(r => (
                                    <button key={r} onClick={() => setViduResolution(r)}
                                      className={`flex-1 py-1.5 rounded border text-xs transition-colors ${viduResolution === r ? "bg-red-600/20 border-red-600/60 text-white" : "bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-600"}`}>
                                      {r}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Audio options */}
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Audio</label>
                              <div className="space-y-1.5">
                                {[
                                  { key: "audioSync", label: "Native Audio Sync", val: viduAudioSync, set: setViduAudioSync },
                                  { key: "sfx", label: "Sound Effects (SFX)", val: viduSFX, set: setViduSFX },
                                  { key: "bgm", label: "Background Music (BGM)", val: viduBGM, set: setViduBGM },
                                  { key: "dialogue", label: "AI Dialogue / Lip Sync", val: viduDialogue, set: setViduDialogue },
                                ].map(opt => (
                                  <div key={opt.key} className="flex items-center justify-between bg-zinc-800/60 rounded px-3 py-2">
                                    <span className="text-xs text-gray-300">{opt.label}</span>
                                    <button onClick={() => opt.set(!opt.val)}
                                      className={`w-9 h-5 rounded-full transition-colors relative ${opt.val ? "bg-red-600" : "bg-zinc-600"}`}>
                                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${opt.val ? "left-4" : "left-0.5"}`} />
                                    </button>
                                  </div>
                                ))}
                                {viduDialogue && (
                                  <div className="flex gap-1 ml-1">
                                    {["English", "Chinese", "Japanese"].map(lang => (
                                      <button key={lang} onClick={() => setViduDialogueLang(lang)}
                                        className={`flex-1 py-1 rounded border text-xs transition-colors ${viduDialogueLang === lang ? "bg-red-600/20 border-red-600/60 text-white" : "bg-zinc-800 border-zinc-700 text-gray-400"}`}>
                                        {lang}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Quality mode */}
                            <div className="flex items-center justify-between bg-zinc-800/60 rounded px-3 py-2 border border-zinc-700">
                              <div>
                                <p className="text-xs text-gray-300 font-medium">Draft Mode</p>
                                <p className="text-xs text-gray-500">Fast preview, ~2s generation</p>
                              </div>
                              <button onClick={() => setViduDraftMode(!viduDraftMode)}
                                className={`w-9 h-5 rounded-full transition-colors relative ${viduDraftMode ? "bg-yellow-500" : "bg-zinc-600"}`}>
                                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${viduDraftMode ? "left-4" : "left-0.5"}`} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Right: Prompt + Frame inputs */}
                        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-5 space-y-4">
                          {/* Mode-specific inputs */}
                          {viduMode === "text" && (
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Prompt</label>
                                <Textarea value={viduPrompt} onChange={e => setViduPrompt(e.target.value)}
                                  placeholder="Describe your scene, action, mood, and camera movement in detail..."
                                  className="bg-zinc-900 border-zinc-700 min-h-28 resize-none text-sm" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Negative Prompt (optional)</label>
                                <Input value={viduNegativePrompt} onChange={e => setViduNegativePrompt(e.target.value)}
                                  placeholder="e.g. blurry, shaky, watermark, low quality"
                                  className="bg-zinc-900 border-zinc-700 text-sm" />
                              </div>
                            </div>
                          )}

                          {viduMode === "image" && (
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Prompt</label>
                                <Textarea value={viduPrompt} onChange={e => setViduPrompt(e.target.value)}
                                  placeholder="Describe how the image should animate..."
                                  className="bg-zinc-900 border-zinc-700 min-h-20 resize-none text-sm" />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                {/* First frame */}
                                <div>
                                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">First Frame</label>
                                  <div onClick={() => viduFirstFrameRef.current?.click()}
                                    className="border-2 border-dashed border-zinc-700 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors bg-zinc-900 relative overflow-hidden">
                                    {viduFirstFrame ? (
                                      <img src={viduFirstFrame} className="w-full h-full object-cover" alt="First frame" />
                                    ) : (
                                      <>
                                        <ImagePlay className="w-6 h-6 text-gray-600 mb-1" />
                                        <p className="text-xs text-gray-500">Upload first frame</p>
                                      </>
                                    )}
                                  </div>
                                  <input ref={viduFirstFrameRef} type="file" accept="image/*" className="hidden"
                                    onChange={e => { const f = e.target.files?.[0]; if (f) setViduFirstFrame(URL.createObjectURL(f)); }} />
                                </div>
                                {/* Last frame */}
                                <div>
                                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Last Frame <span className="text-gray-600">(optional)</span></label>
                                  <div onClick={() => viduLastFrameRef.current?.click()}
                                    className="border-2 border-dashed border-zinc-700 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors bg-zinc-900 relative overflow-hidden">
                                    {viduLastFrame ? (
                                      <img src={viduLastFrame} className="w-full h-full object-cover" alt="Last frame" />
                                    ) : (
                                      <>
                                        <ImagePlay className="w-6 h-6 text-gray-600 mb-1" />
                                        <p className="text-xs text-gray-500">Upload last frame</p>
                                      </>
                                    )}
                                  </div>
                                  <input ref={viduLastFrameRef} type="file" accept="image/*" className="hidden"
                                    onChange={e => { const f = e.target.files?.[0]; if (f) setViduLastFrame(URL.createObjectURL(f)); }} />
                                </div>
                              </div>
                            </div>
                          )}

                          {viduMode === "reference" && (
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Prompt</label>
                                <Textarea value={viduPrompt} onChange={e => setViduPrompt(e.target.value)}
                                  placeholder="Describe the scene using your reference characters/objects..."
                                  className="bg-zinc-900 border-zinc-700 min-h-20 resize-none text-sm" />
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-xs text-gray-500 uppercase tracking-wider">Active References <span className="text-gray-600">({viduRefs.length}/7)</span></label>
                                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => setViduTab("references")}>
                                    <Bookmark className="w-3 h-3 mr-1" />Browse Library
                                  </Button>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                  {viduRefs.map(ref => (
                                    <div key={ref.id} className="relative group">
                                      <img src={ref.image} alt={ref.name} className="w-full aspect-square object-cover rounded-lg" />
                                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                        <button onClick={() => removeViduRef(ref.id)} className="text-white">
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                      <p className="text-xs text-gray-400 truncate mt-1">{ref.name}</p>
                                      <span className="text-xs text-gray-600 capitalize">{ref.type}</span>
                                    </div>
                                  ))}
                                  {viduRefs.length < 7 && (
                                    <div onClick={() => setViduTab("references")}
                                      className="border-2 border-dashed border-zinc-700 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors">
                                      <Plus className="w-5 h-5 text-gray-600" />
                                      <p className="text-xs text-gray-600 mt-1">Add ref</p>
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-1">Multi-entity consistency powered by U-ViT architecture</p>
                              </div>
                            </div>
                          )}

                          {/* Quick-add from My References */}
                          {viduMode === "reference" && (
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Quick-Add from Library</label>
                              <div className="flex gap-2 overflow-x-auto pb-1">
                                {myReferences.filter(r => r.saved).map(ref => (
                                  <button key={ref.id} onClick={() => addViduRef(ref)}
                                    disabled={!!viduRefs.find(r => r.id === ref.id) || viduRefs.length >= 7}
                                    className={`shrink-0 flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-colors ${viduRefs.find(r => r.id === ref.id) ? "border-red-600/60 bg-red-600/10" : "border-zinc-700 bg-zinc-800 hover:border-zinc-500"} disabled:opacity-40`}>
                                    <img src={ref.image} alt={ref.name} className="w-10 h-10 rounded object-cover" />
                                    <p className="text-xs text-gray-400 truncate w-12 text-center">{ref.name}</p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Generate button */}
                          <div className="space-y-2">
                            {isGeneratingVidu ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                  <span className="flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                                    {viduDraftMode ? "Draft preview generating (~2s)..." : "HD video generating..."}
                                  </span>
                                  <span>{Math.min(Math.round(viduProgress), 100)}%</span>
                                </div>
                                <div className="w-full bg-zinc-800 rounded-full h-2">
                                  <motion.div className="bg-gradient-to-r from-red-600 to-purple-600 h-2 rounded-full"
                                    style={{ width: `${Math.min(viduProgress, 100)}%` }} />
                                </div>
                              </div>
                            ) : (
                              <Button onClick={handleViduGenerate} className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 h-11">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate with {VIDU_MODELS.find(m => m.id === viduModel)?.name}
                                {viduDraftMode && <span className="ml-2 text-xs opacity-75">(Draft)</span>}
                              </Button>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Cpu className="w-3 h-3" />
                              <span>
                                {viduModel === "vidu-q3-pro" ? "~10s generation" : "~15s generation"} •
                                {" "}{viduDuration} • {viduResolution}
                                {viduAudioSync && " • Native audio"}
                                {viduOffPeak && " • Off-peak (free)"}
                              </span>
                            </div>
                          </div>

                          {/* Prompt suggestions */}
                          <div>
                            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Example Prompts</label>
                            <div className="space-y-1.5">
                              {[
                                "Solomon walks through Brooklyn at golden hour, confident tracking shot, warm cinematic light",
                                "Queen Zara in recording studio, soft ambient lighting, slow push-in, spiritual atmosphere",
                                "Aerial cityscape at dawn, birds-eye to street level dolly down, fog over buildings",
                                "Anime-style performance on stage, dynamic crowd energy, flashy lighting effects",
                                "Close-up of hands on a Bible and beat machine, rack focus between both, warm lamp",
                              ].map((p, i) => (
                                <button key={i} onClick={() => setViduPrompt(p)}
                                  className="w-full text-left px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded text-xs text-gray-400 hover:text-gray-300 transition-colors">
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── GALLERY PANEL ── */}
                    {viduTab === "gallery" && (
                      <div className="flex-1 overflow-y-auto p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">Generated Videos</h3>
                          <Button size="sm" onClick={() => setViduTab("create")} className="bg-red-600 hover:bg-red-700 text-xs">
                            <Plus className="w-3 h-3 mr-1" />New Generation
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {viduOutputs.map(output => (
                            <Card key={output.id} className="bg-zinc-900 border-zinc-800 overflow-hidden group">
                              <div className="relative">
                                <img src={output.thumbnail} alt={output.prompt} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <Button size="icon" className="bg-white/20 hover:bg-white/30 w-10 h-10">
                                    <Play className="w-5 h-5 text-white" />
                                  </Button>
                                </div>
                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex gap-1">
                                  <span className="bg-black/70 text-xs px-2 py-0.5 rounded">{output.duration}s</span>
                                  <span className="bg-black/70 text-xs px-2 py-0.5 rounded">{output.resolution}</span>
                                  {output.hasAudio && <span className="bg-black/70 text-xs px-2 py-0.5 rounded">🔊</span>}
                                </div>
                                <div className="absolute top-2 right-2 flex gap-1">
                                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                    output.mode === "reference" ? "bg-purple-600/80" :
                                    output.mode === "image" ? "bg-blue-600/80" : "bg-zinc-700/80"
                                  }`}>
                                    {output.mode === "reference" ? "Ref" : output.mode === "image" ? "Img" : "Text"}→Vid
                                  </span>
                                </div>
                              </div>
                              <CardContent className="p-3 space-y-2">
                                <p className="text-xs text-gray-300 line-clamp-2">{output.prompt}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex gap-1 text-xs text-gray-500">
                                    <span>{output.model}</span>
                                    <span>•</span>
                                    <span>{output.style}</span>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleLikeOutput(output.id)}>
                                      <Heart className={`w-3.5 h-3.5 ${output.liked ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remixOutput(output)}>
                                      <Repeat2 className="w-3.5 h-3.5 text-gray-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                      <Download className="w-3.5 h-3.5 text-gray-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                      <Share2 className="w-3.5 h-3.5 text-gray-500" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── MY REFERENCES PANEL ── */}
                    {viduTab === "references" && (
                      <div className="flex-1 overflow-y-auto p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">My References</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Save characters, props & scenes for consistent multi-entity generation (up to 7 per video)</p>
                          </div>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs" onClick={() => viduFileRef.current?.click()}>
                            <Plus className="w-3 h-3 mr-1" />Upload Reference
                          </Button>
                          <input ref={viduFileRef} type="file" accept="image/*" multiple className="hidden"
                            onChange={e => {
                              Array.from(e.target.files || []).forEach(f => {
                                const newRef: ViduReference = {
                                  id: `ref-${Date.now()}-${Math.random()}`,
                                  name: f.name.replace(/\.[^.]+$/, ""),
                                  image: URL.createObjectURL(f),
                                  type: "character",
                                  saved: true,
                                };
                                setMyReferences(prev => [...prev, newRef]);
                              });
                            }} />
                        </div>

                        {/* Filter by type */}
                        <div className="flex gap-1.5 mb-4">
                          {["all", "character", "prop", "scene", "style"].map(t => (
                            <button key={t} className="px-3 py-1 rounded-full text-xs border border-zinc-700 bg-zinc-800 text-gray-400 hover:text-white hover:border-zinc-500 capitalize transition-colors">
                              {t}
                            </button>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          {myReferences.map(ref => (
                            <Card key={ref.id} className="bg-zinc-900 border-zinc-800 overflow-hidden group">
                              <div className="relative">
                                <img src={ref.image} alt={ref.name} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs"
                                    onClick={() => { addViduRef(ref); setViduMode("reference"); setViduTab("create"); }}>
                                    Use in Video
                                  </Button>
                                </div>
                                <div className="absolute top-2 left-2">
                                  <span className={`text-xs px-1.5 py-0.5 rounded capitalize font-medium ${
                                    ref.type === "character" ? "bg-red-600/80" :
                                    ref.type === "scene" ? "bg-blue-600/80" :
                                    ref.type === "style" ? "bg-purple-600/80" : "bg-zinc-600/80"
                                  }`}>{ref.type}</span>
                                </div>
                              </div>
                              <CardContent className="p-2.5">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium truncate flex-1">{ref.name}</p>
                                  <button onClick={() => toggleSaveRef(ref.id)} className="ml-2 shrink-0">
                                    <Bookmark className={`w-4 h-4 ${ref.saved ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`} />
                                  </button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {/* Empty slot */}
                          <div onClick={() => viduFileRef.current?.click()}
                            className="border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center min-h-48 cursor-pointer hover:border-zinc-600 transition-colors group">
                            <Upload className="w-6 h-6 text-gray-600 group-hover:text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500 group-hover:text-gray-400">Upload image</p>
                          </div>
                        </div>

                        <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Cpu className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">U-ViT Multi-Entity Consistency</p>
                              <p className="text-xs text-gray-400 mt-1">Vidu's proprietary Universal Vision Transformer physically maps facial landmarks and body ratios, creating a digital mold of each character. Upload references for up to 7 subjects — they'll all appear in your video with their identities preserved, no character drift.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── SCREENWRITER TAB ─────────────────────────────────────────── */}
              {activeTab === "screenwriter" && (
                <div className="flex-1 flex min-h-0">
                  {/* Scene list */}
                  <div className="w-64 border-r border-zinc-800 flex flex-col bg-zinc-900/40 shrink-0">
                    <div className="p-3 border-b border-zinc-800">
                      <Input value={scriptTitle} onChange={e => setScriptTitle(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-sm font-semibold" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {scriptScenes.map((scene, i) => (
                        <button key={scene.id} onClick={() => setSelectedScene(scene.id)}
                          className={`w-full text-left px-3 py-3 border-b border-zinc-800/50 transition-colors ${
                            selectedScene === scene.id ? "bg-red-600/10 border-l-2 border-l-red-500" : "hover:bg-zinc-800/50"
                          }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Scene {scene.sceneNumber}</span>
                            <span className="text-xs text-gray-600">Act {scene.act}</span>
                          </div>
                          <p className="text-sm font-medium truncate mt-0.5">{scene.heading}</p>
                        </button>
                      ))}
                    </div>
                    {/* Generate scene */}
                    <div className="p-3 border-t border-zinc-800 space-y-2">
                      <Textarea value={scriptPrompt} onChange={e => setScriptPrompt(e.target.value)}
                        placeholder="Describe next scene..." className="bg-zinc-800 border-zinc-700 text-xs min-h-16 resize-none" />
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-xs" onClick={generateScene} disabled={isGeneratingScript}>
                        {isGeneratingScript ? <><Sparkles className="w-3 h-3 mr-1 animate-pulse" />Generating...</> : <><Sparkles className="w-3 h-3 mr-1" />AI Generate Scene</>}
                      </Button>
                    </div>
                  </div>

                  {/* Scene editor */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {selectedSceneData ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">ACT {selectedSceneData.act}</span>
                            <span className="text-gray-400 text-sm">Scene {selectedSceneData.sceneNumber}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="text-xs bg-zinc-900 border-zinc-700">
                              <RefreshCw className="w-3 h-3 mr-1" />Rewrite
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteScene(selectedSceneData.id)} className="text-xs text-red-400 hover:text-red-300">
                              <Trash2 className="w-3 h-3 mr-1" />Delete
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Scene Heading</label>
                          <Input defaultValue={selectedSceneData.heading} className="bg-zinc-900 border-zinc-700 font-mono text-sm" />
                        </div>

                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Action / Description</label>
                          <Textarea defaultValue={selectedSceneData.action} className="bg-zinc-900 border-zinc-700 text-sm min-h-24 resize-none" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-gray-500 uppercase tracking-wider">Dialogue</label>
                            <Button variant="ghost" size="sm" className="text-xs text-gray-400">
                              <Plus className="w-3 h-3 mr-1" />Add Line
                            </Button>
                          </div>
                          <div className="space-y-3">
                            {selectedSceneData.dialogue.map((d, i) => (
                              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                                <Input defaultValue={d.character} className="bg-transparent border-none text-red-400 font-bold text-sm mb-2 p-0 h-auto" />
                                <Textarea defaultValue={d.line} className="bg-transparent border-none text-gray-200 text-sm resize-none min-h-12 p-0" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Director Notes</label>
                          <Textarea defaultValue={selectedSceneData.notes} className="bg-zinc-900 border-zinc-700 text-sm min-h-16 resize-none text-yellow-400" />
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs">
                            <Wand2 className="w-3 h-3 mr-1" />AI Enhance Scene
                          </Button>
                          <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-700 text-xs">
                            <Video className="w-3 h-3 mr-1" />Send to Storyboard
                          </Button>
                          <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-700 text-xs">
                            <Mic className="w-3 h-3 mr-1" />Generate Voices
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">Select a scene to edit</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── WORLD BUILDER TAB ────────────────────────────────────────── */}
              {activeTab === "worldbuilder" && (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex gap-1 p-3 border-b border-zinc-800 bg-zinc-900/40 shrink-0">
                    {(["characters", "locations", "lore"] as const).map(t => (
                      <button key={t} onClick={() => setWorldTab(t)}
                        className={`px-4 py-1.5 rounded text-sm capitalize font-medium transition-colors ${worldTab === t ? "bg-red-600 text-white" : "text-gray-400 hover:text-white hover:bg-zinc-800"}`}>
                        {t}
                      </button>
                    ))}
                    <Button variant="outline" size="sm" className="ml-auto bg-zinc-900 border-zinc-700 text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />AI Generate
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5">
                    {worldTab === "characters" && (
                      <div className="space-y-4">
                        {characters.map(char => (
                          <Card key={char.id} className="bg-zinc-900 border-zinc-800">
                            <div className="flex items-start gap-4 p-4 cursor-pointer" onClick={() => setExpandedChar(expandedChar === char.id ? null : char.id)}>
                              <img src={char.image} alt={char.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-bold">{char.name}</h3>
                                    <p className="text-xs text-red-400">{char.role}</p>
                                  </div>
                                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedChar === char.id ? "rotate-180" : ""}`} />
                                </div>
                                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{char.description}</p>
                                <div className="flex gap-1.5 mt-2 flex-wrap">
                                  {char.traits.map(t => (
                                    <span key={t} className="text-xs bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">{t}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <AnimatePresence>
                              {expandedChar === char.id && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden">
                                  <div className="px-4 pb-4 pt-0 border-t border-zinc-800 space-y-3">
                                    <div>
                                      <label className="text-xs text-gray-500 uppercase tracking-wider">Backstory</label>
                                      <p className="text-sm text-gray-300 mt-1">{char.backstory}</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" className="text-xs bg-zinc-800 border-zinc-700"><Edit3 className="w-3 h-3 mr-1" />Edit</Button>
                                      <Button size="sm" variant="outline" className="text-xs bg-zinc-800 border-zinc-700"><ImageIcon className="w-3 h-3 mr-1" />New Portrait</Button>
                                      <Button size="sm" variant="outline" className="text-xs bg-zinc-800 border-zinc-700"><Video className="w-3 h-3 mr-1" />Generate Scene</Button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Card>
                        ))}
                        <Button variant="outline" className="w-full border-dashed border-zinc-700 text-gray-400 hover:text-white">
                          <Plus className="w-4 h-4 mr-2" />Add Character
                        </Button>
                      </div>
                    )}

                    {worldTab === "locations" && (
                      <div className="grid grid-cols-2 gap-4">
                        {locations.map(loc => (
                          <Card key={loc.id} className="bg-zinc-900 border-zinc-800 overflow-hidden group cursor-pointer hover:border-zinc-700 transition-colors">
                            <div className="relative">
                              <img src={loc.image} alt={loc.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-xs">{loc.type}</div>
                            </div>
                            <CardContent className="p-3">
                              <h3 className="font-semibold">{loc.name}</h3>
                              <p className="text-xs text-gray-400 mt-1">{loc.description}</p>
                              <div className="flex gap-2 mt-3">
                                <Button size="sm" variant="ghost" className="text-xs h-7"><ImageIcon className="w-3 h-3 mr-1" />More Shots</Button>
                                <Button size="sm" variant="ghost" className="text-xs h-7 text-red-400"><Sparkles className="w-3 h-3 mr-1" />AI Expand</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        <div className="border-2 border-dashed border-zinc-800 rounded-lg flex items-center justify-center h-64 cursor-pointer hover:border-zinc-600 transition-colors group">
                          <div className="text-center">
                            <Plus className="w-8 h-8 text-gray-600 mx-auto group-hover:text-gray-400 transition-colors" />
                            <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-400">Add Location</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {worldTab === "lore" && (
                      <div className="space-y-4 max-w-3xl">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Universe Lore & Canon</h3>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />AI Expand Lore
                          </Button>
                        </div>
                        <Textarea value={loreText} onChange={e => setLoreText(e.target.value)}
                          className="bg-zinc-900 border-zinc-800 min-h-48 text-sm text-gray-300 resize-none" />
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Mythology", icon: <Star className="w-4 h-4" />, count: 3 },
                            { label: "Factions", icon: <Users className="w-4 h-4" />, count: 2 },
                            { label: "Timeline", icon: <Clock className="w-4 h-4" />, count: 1 },
                          ].map(item => (
                            <Card key={item.label} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors">
                              <CardContent className="p-3 flex items-center gap-3">
                                <div className="text-red-400">{item.icon}</div>
                                <div>
                                  <p className="text-sm font-medium">{item.label}</p>
                                  <p className="text-xs text-gray-500">{item.count} entries</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── STORYBOARD TAB ───────────────────────────────────────────── */}
              {activeTab === "storyboard" && (
                <div className="flex-1 overflow-y-auto p-6">
                  {storyboardShots.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Layout className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-2">No storyboard yet</p>
                        <p className="text-sm text-gray-500">Start in the Conversation tab</p>
                        <Button className="mt-4 bg-red-600 hover:bg-red-700" onClick={() => setActiveTab("chat")}>
                          <MessageSquare className="w-4 h-4 mr-2" />Go to Conversation
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {storyboardShots.map((shot, shotIndex) => (
                        <Card key={shot.id} className="bg-zinc-900 border-zinc-800">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-base flex items-center gap-2">
                                  <span className="bg-red-600 text-white w-6 h-6 rounded flex items-center justify-center text-xs">{shotIndex + 1}</span>
                                  {shot.title}
                                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleLikeShot(shot.id)}>
                                    <Heart className={`w-4 h-4 ${shot.liked ? "fill-red-500 text-red-500" : ""}`} />
                                  </Button>
                                </CardTitle>
                                <p className="text-sm text-gray-400 mt-1">Duration: {shot.duration}s</p>
                              </div>
                              <div className="flex gap-1">
                                {[Edit3, Copy, RefreshCw, Trash2].map((Icon, i) => (
                                  <Button key={i} variant="ghost" size="icon" className="h-8 w-8"><Icon className="w-4 h-4" /></Button>
                                ))}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {shot.frames.map((frame) => (
                                <div key={frame.id} className="relative group">
                                  <img src={frame.image} alt={frame.prompt} className="w-full h-48 object-cover rounded-lg" />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                    <Button variant="ghost" size="icon" className="bg-zinc-900/80" onClick={() => toggleLikeFrame(shot.id, frame.id)}>
                                      <Heart className={`w-4 h-4 ${frame.liked ? "fill-red-500 text-red-500" : ""}`} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="bg-zinc-900/80"><Edit3 className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" className="bg-zinc-900/80"><RefreshCw className="w-4 h-4" /></Button>
                                  </div>
                                  <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs">{frame.model}</div>
                                  {frame.liked && <div className="absolute top-2 right-2"><Heart className="w-4 h-4 fill-red-500 text-red-500" /></div>}
                                  <p className="text-xs text-gray-400 line-clamp-2 mt-2">{frame.prompt}</p>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-zinc-800 pt-3">
                              <div className="flex gap-2">
                                <Input placeholder="Add comment for AI generation..."
                                  className="flex-1 bg-zinc-800 border-zinc-700 text-sm"
                                  onKeyDown={e => {
                                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                                      addCommentToShot(shot.id, e.currentTarget.value);
                                      e.currentTarget.value = "";
                                    }
                                  }} />
                                <Button size="sm" className="bg-red-600 hover:bg-red-700"><Sparkles className="w-4 h-4" /></Button>
                              </div>
                              {shot.comments && shot.comments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {shot.comments.map(c => (
                                    <div key={c.id} className="text-xs bg-zinc-800 p-2 rounded">{c.text}</div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-red-600 hover:bg-red-700"><Video className="w-4 h-4 mr-2" />Generate All Videos</Button>
                        <Button variant="outline"><Plus className="w-4 h-4 mr-2" />Add Shot</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── EDITOR / TIMELINE TAB ────────────────────────────────────── */}
              {activeTab === "timeline" && (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Editor toolbar */}
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-900/40 shrink-0 overflow-x-auto">
                    {[
                      { icon: <Scissors className="w-3.5 h-3.5" />, label: "Cut" },
                      { icon: <Layers className="w-3.5 h-3.5" />, label: "Layers" },
                      { icon: <Palette className="w-3.5 h-3.5" />, label: "Color Grade" },
                      { icon: <Volume2 className="w-3.5 h-3.5" />, label: "Sound Mix" },
                      { icon: <Type className="w-3.5 h-3.5" />, label: "Titles" },
                    ].map(tool => (
                      <Button key={tool.label} variant="outline" size="sm" className="bg-zinc-900 border-zinc-700 text-xs shrink-0">
                        {tool.icon}<span className="ml-1">{tool.label}</span>
                      </Button>
                    ))}
                    <div className="ml-auto flex items-center gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-700"><ZoomOut className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-700"><ZoomIn className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {storyboardShots.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400 mb-2">No clips in timeline</p>
                          <p className="text-sm text-gray-500">Generate videos from your storyboard first</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Video track */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Video className="w-4 h-4 text-red-400" />
                            <span className="text-xs font-medium text-gray-300">VIDEO TRACK</span>
                          </div>
                          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 space-y-2">
                            {storyboardShots.map((shot, i) => (
                              <div key={shot.id} className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-6 shrink-0">{i + 1}</span>
                                <div className="flex-1 bg-red-600/20 border border-red-600/40 rounded px-3 py-2 cursor-pointer hover:bg-red-600/30 transition-colors"
                                  style={{ width: `${Math.min(shot.duration * 8, 100)}%` }}>
                                  <p className="text-xs font-medium truncate">{shot.title}</p>
                                  <p className="text-xs text-gray-400">{shot.duration}s</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Audio track */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Music className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-medium text-gray-300">AUDIO TRACK</span>
                          </div>
                          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 space-y-2">
                            {soundtracks.filter(t => t.generated).map((t, i) => (
                              <div key={t.id} className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 w-6 shrink-0">{i + 1}</span>
                                <div className="flex-1 bg-purple-600/20 border border-purple-600/40 rounded px-3 py-2">
                                  <p className="text-xs font-medium truncate">{t.scene}</p>
                                  <p className="text-xs text-gray-400">{t.genre} • {t.tempo} • {t.duration}s</p>
                                </div>
                              </div>
                            ))}
                            {soundtracks.filter(t => t.generated).length === 0 && (
                              <p className="text-xs text-gray-500 text-center py-2">No generated tracks yet — visit Voice & Score tab</p>
                            )}
                          </div>
                        </div>

                        {/* Color grading panel */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Palette className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-300">COLOR GRADE</span>
                          </div>
                          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 grid grid-cols-4 gap-3">
                            {[
                              { label: "Contrast", value: 65 },
                              { label: "Saturation", value: 45 },
                              { label: "Warmth", value: 55 },
                              { label: "Shadows", value: 30 },
                            ].map(ctrl => (
                              <div key={ctrl.label}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-400">{ctrl.label}</span>
                                  <span className="text-xs text-gray-500">{ctrl.value}</span>
                                </div>
                                <input type="range" min="0" max="100" defaultValue={ctrl.value}
                                  className="w-full h-1.5 rounded-full appearance-none bg-zinc-700 cursor-pointer accent-red-500" />
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {["Cinematic", "Warm Tone", "Cold Steel", "Vintage", "Neon"].map(preset => (
                              <Button key={preset} variant="outline" size="sm" className="text-xs bg-zinc-900 border-zinc-700">{preset}</Button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Playback controls */}
                  <div className="border-t border-zinc-800 p-3 flex items-center gap-2 bg-zinc-900/50 shrink-0">
                    <Button variant="outline" size="icon" className="h-8 w-8"><SkipBack className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8"><SkipForward className="w-4 h-4" /></Button>
                    <div className="flex-1 bg-zinc-800 h-2 rounded-full overflow-hidden cursor-pointer">
                      <div className="bg-red-600 h-full transition-all" style={{ width: isPlaying ? "35%" : "0%" }} />
                    </div>
                    <span className="text-xs text-gray-400 w-24 text-right">
                      {storyboardShots.reduce((sum, s) => sum + s.duration, 0)}s total
                    </span>
                  </div>
                </div>
              )}

              {/* ── VOICE & SCORE TAB ────────────────────────────────────────── */}
              {activeTab === "voicescore" && (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex gap-1 p-3 border-b border-zinc-800 bg-zinc-900/40 shrink-0">
                    {(["soundtrack", "voice", "dub"] as const).map(t => (
                      <button key={t} onClick={() => setScoreTab(t)}
                        className={`px-4 py-1.5 rounded text-sm capitalize font-medium transition-colors ${scoreTab === t ? "bg-red-600 text-white" : "text-gray-400 hover:text-white hover:bg-zinc-800"}`}>
                        {t === "soundtrack" ? "🎵 Soundtrack" : t === "voice" ? "🎤 Voice Acting" : "🌍 Dubbing"}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto p-5">
                    {scoreTab === "soundtrack" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">AI Soundtrack Generator</h3>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs">
                            <Plus className="w-3 h-3 mr-1" />Add Track
                          </Button>
                        </div>
                        <div className="grid gap-3">
                          {soundtracks.map(track => (
                            <Card key={track.id} className="bg-zinc-900 border-zinc-800">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{track.scene}</p>
                                    <div className="flex gap-2 mt-1 flex-wrap">
                                      <span className="text-xs bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded">{track.genre}</span>
                                      <span className="text-xs bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded">{track.mood}</span>
                                      <span className="text-xs bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded">{track.tempo}</span>
                                      <span className="text-xs text-gray-500">{track.duration}s</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {track.generated ? (
                                      <>
                                        <span className="text-xs text-green-400 flex items-center gap-1"><Check className="w-3 h-3" />Generated</span>
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><Play className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="w-4 h-4" /></Button>
                                      </>
                                    ) : (
                                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs"
                                        onClick={() => generateTrack(track.id)}
                                        disabled={isGeneratingAudio === track.id}>
                                        {isGeneratingAudio === track.id
                                          ? <><Sparkles className="w-3 h-3 mr-1 animate-pulse" />Composing...</>
                                          : <><Music className="w-3 h-3 mr-1" />Compose</>}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                {track.generated && (
                                  <div className="mt-3 bg-zinc-800 rounded h-8 flex items-center px-3 gap-2">
                                    <div className="flex gap-0.5 items-end h-5">
                                      {Array.from({ length: 40 }).map((_, i) => (
                                        <div key={i} className="bg-red-500/60 rounded-sm w-1" style={{ height: `${20 + Math.sin(i * 0.8) * 12}px` }} />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <Card className="bg-zinc-900 border-zinc-800">
                          <CardHeader className="pb-2"><CardTitle className="text-sm">Generate New Track</CardTitle></CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Genre</label>
                                <select className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white">
                                  {["Cinematic Hip-Hop", "Gospel Trap", "Orchestral", "R&B Soul", "Hard Rap"].map(g => <option key={g}>{g}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Mood</label>
                                <select className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white">
                                  {["Triumphant", "Melancholic", "Spiritual", "Intense", "Hopeful"].map(m => <option key={m}>{m}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Duration</label>
                                <select className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white">
                                  {["30s", "60s", "90s", "2min", "3min"].map(d => <option key={d}>{d}</option>)}
                                </select>
                              </div>
                            </div>
                            <Button className="w-full bg-red-600 hover:bg-red-700 text-sm">
                              <Sparkles className="w-4 h-4 mr-2" />Generate with Suno v5
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {scoreTab === "voice" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">AI Voice Acting Studio</h3>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs"><Plus className="w-3 h-3 mr-1" />Add Voice</Button>
                        </div>
                        {voiceTracks.map(vt => (
                          <Card key={vt.id} className="bg-zinc-900 border-zinc-800">
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-red-600/20 border border-red-600/40 rounded-full flex items-center justify-center">
                                    <Mic className="w-4 h-4 text-red-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{vt.character}</p>
                                    <p className="text-xs text-gray-400">{vt.voice} • {vt.language}</p>
                                  </div>
                                </div>
                                {vt.generated
                                  ? <span className="text-xs text-green-400 flex items-center gap-1"><Check className="w-3 h-3" />Ready</span>
                                  : <span className="text-xs text-yellow-400">Pending</span>}
                              </div>
                              <Textarea defaultValue={vt.text} className="bg-zinc-800 border-zinc-700 text-sm min-h-16 resize-none" />
                              <div className="flex gap-2">
                                {vt.generated
                                  ? <Button variant="outline" size="sm" className="text-xs bg-zinc-800 border-zinc-700"><Play className="w-3 h-3 mr-1" />Preview</Button>
                                  : <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs" onClick={() => generateVoice(vt.id)} disabled={isGeneratingAudio === vt.id}>
                                      {isGeneratingAudio === vt.id ? <><Sparkles className="w-3 h-3 mr-1 animate-pulse" />Generating...</> : <><Mic className="w-3 h-3 mr-1" />Generate Voice</>}
                                    </Button>}
                                <Button variant="outline" size="sm" className="text-xs bg-zinc-800 border-zinc-700"><RefreshCw className="w-3 h-3 mr-1" />Regenerate</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {scoreTab === "dub" && (
                      <div className="space-y-5">
                        <div>
                          <h3 className="font-semibold mb-1">Voice Dubbing Studio</h3>
                          <p className="text-sm text-gray-400">Dub your film into 30+ languages with AI-generated voices that match each character's original tone.</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-2 block">Target Language</label>
                          <div className="flex flex-wrap gap-2">
                            {VOICE_LANGUAGES.map(lang => (
                              <button key={lang} onClick={() => setSelectedDubLang(lang)}
                                className={`px-3 py-1.5 rounded text-sm transition-colors ${selectedDubLang === lang ? "bg-red-600 text-white" : "bg-zinc-800 border border-zinc-700 text-gray-300 hover:border-zinc-500"}`}>
                                {lang}
                              </button>
                            ))}
                          </div>
                        </div>
                        <Card className="bg-zinc-900 border-zinc-800">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-3">
                              <Languages className="w-5 h-5 text-red-400" />
                              <div>
                                <p className="font-medium text-sm">Dub entire film to {selectedDubLang}</p>
                                <p className="text-xs text-gray-400">2 characters • all dialogue tracks</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {voiceTracks.map(vt => (
                                <div key={vt.id} className="flex items-center justify-between bg-zinc-800 rounded px-3 py-2">
                                  <div>
                                    <span className="text-sm font-medium">{vt.character}</span>
                                    <span className="text-xs text-gray-400 ml-2">→ {selectedDubLang}</span>
                                  </div>
                                  {vt.generated
                                    ? <span className="text-xs text-green-400"><Check className="w-3 h-3 inline mr-1" />Dubbed</span>
                                    : <span className="text-xs text-gray-500">Pending source</span>}
                                </div>
                              ))}
                            </div>
                            <Button className="w-full bg-red-600 hover:bg-red-700"
                              onClick={generateDub} disabled={isGeneratingAudio === "dub"}>
                              {isGeneratingAudio === "dub"
                                ? <><Sparkles className="w-4 h-4 mr-2 animate-pulse" />Dubbing in progress...</>
                                : <><Globe className="w-4 h-4 mr-2" />Generate Full Dub — {selectedDubLang}</>}
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── DISTRIBUTION TAB ─────────────────────────────────────────── */}
              {activeTab === "distribution" && (
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  {/* Promo assets */}
                  <div>
                    <h3 className="font-semibold mb-3">Promotional Assets</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Film Poster", desc: "AI-generated poster art", generated: posterGenerated, action: () => setPosterGenerated(true), icon: <ImageIcon className="w-5 h-5" /> },
                        { label: "Trailer Cut", desc: "60-second auto trailer", generated: trailerGenerated, action: () => setTrailerGenerated(true), icon: <Film className="w-5 h-5" /> },
                        { label: "Pitch Deck", desc: "Investor presentation PDF", generated: pitchDeckGenerated, action: () => setPitchDeckGenerated(true), icon: <BarChart2 className="w-5 h-5" /> },
                      ].map(asset => (
                        <Card key={asset.label} className="bg-zinc-900 border-zinc-800">
                          <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${asset.generated ? "bg-green-600/20 text-green-400" : "bg-zinc-800 text-gray-400"}`}>
                              {asset.generated ? <Check className="w-5 h-5" /> : asset.icon}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{asset.label}</p>
                              <p className="text-xs text-gray-400">{asset.desc}</p>
                            </div>
                            {asset.generated
                              ? <Button variant="outline" size="sm" className="text-xs w-full bg-zinc-800 border-zinc-700"><Download className="w-3 h-3 mr-1" />Download</Button>
                              : <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs w-full" onClick={asset.action}><Sparkles className="w-3 h-3 mr-1" />Generate</Button>}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Platforms */}
                  <div>
                    <h3 className="font-semibold mb-3">Distribution Platforms</h3>
                    <div className="grid gap-3">
                      {platforms.map(p => (
                        <div key={p.id} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
                          <span className="text-2xl shrink-0">{p.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.audience}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              p.status === "live" ? "bg-green-600/20 text-green-400" :
                              p.status === "pending" ? "bg-yellow-600/20 text-yellow-400" :
                              "bg-zinc-800 text-gray-400"
                            }`}>
                              {p.status === "live" ? "● Live" : p.status === "pending" ? "◐ Pending" : "○ Ready"}
                            </span>
                            {p.status !== "live" && (
                              <Button size="sm" variant="outline" className="text-xs bg-zinc-800 border-zinc-700"
                                onClick={() => publishToPlatform(p.id)}>
                                <UploadCloud className="w-3 h-3 mr-1" />Publish
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analytics preview */}
                  <div>
                    <h3 className="font-semibold mb-3">Projected Reach</h3>
                    <Card className="bg-zinc-900 border-zinc-800">
                      <CardContent className="p-4 grid grid-cols-3 gap-4 text-center">
                        {[
                          { label: "Estimated Views", value: "2.4M", sub: "in first 30 days", icon: <TrendingUp className="w-4 h-4 text-red-400" /> },
                          { label: "Platform Revenue", value: "$4,800", sub: "estimated monthly", icon: <BarChart2 className="w-4 h-4 text-green-400" /> },
                          { label: "Total Reach", value: "6.2B+", sub: "across all platforms", icon: <Globe className="w-4 h-4 text-blue-400" /> },
                        ].map(stat => (
                          <div key={stat.label} className="space-y-1">
                            <div className="flex justify-center">{stat.icon}</div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                            <p className="text-xs text-gray-600">{stat.sub}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

            </div>
          </motion.div>

          {/* Export Modal */}
          <AnimatePresence>
            {showExportModal && (
              <>
                <motion.div className="fixed inset-0 bg-black/50 z-[60]"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowExportModal(false)} />
                <motion.div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md"
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader><CardTitle>Export Project</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        { icon: <FileVideo className="w-4 h-4 mr-2" />, label: "Export Final Video (MP4)", primary: true },
                        { icon: <FileText className="w-4 h-4 mr-2" />, label: "Export Screenplay (PDF)" },
                        { icon: <Users className="w-4 h-4 mr-2" />, label: "Export World Bible (PDF)" },
                        { icon: <Layout className="w-4 h-4 mr-2" />, label: "Export Storyboard (PDF)" },
                        { icon: <Headphones className="w-4 h-4 mr-2" />, label: "Export Audio Tracks (ZIP)" },
                        { icon: <BarChart2 className="w-4 h-4 mr-2" />, label: "Export Pitch Deck (PPTX)" },
                        { icon: <Download className="w-4 h-4 mr-2" />, label: "Export All Assets (ZIP)" },
                      ].map(item => (
                        <Button key={item.label} variant={item.primary ? "default" : "outline"}
                          className={`w-full justify-start ${item.primary ? "bg-red-600 hover:bg-red-700" : ""}`}>
                          {item.icon}{item.label}
                        </Button>
                      ))}
                      <Button variant="ghost" className="w-full" onClick={() => setShowExportModal(false)}>Cancel</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
