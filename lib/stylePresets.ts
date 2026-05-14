/**
 * ContentIo Style Presets & Maps
 * Background gradients, theme presets, and default configurations
 */

import {
  BackgroundOption,
  BackgroundPreset,
  SyntaxThemePreset,
  SyntaxThemeName,
  CodeStyleConfig,
  ImageStyleConfig,
  ImageFilters,
  ImageAdjustments,
  ImageFrame,
  CodeTypography,
  Perspective3D,
  LayoutConfig,
  WatermarkConfig,
  BorderConfig,
  DecorationOptions,
  WindowFrameConfig,
} from "@/app/types/styling";

// ─── BACKGROUND GRADIENTS & PATTERNS (20+) ────────────────────────────────

export const BACKGROUNDS: Record<BackgroundPreset, BackgroundOption> = {
  // Solids
  black: {
    id: "black",
    label: "Pure Black",
    category: "solid",
    cssValue: "#000000",
    previewColor: "#000000",
  },
  white: {
    id: "white",
    label: "Pure White",
    category: "solid",
    cssValue: "#ffffff",
    previewColor: "#ffffff",
  },
  navy: {
    id: "navy",
    label: "Deep Navy",
    category: "solid",
    cssValue: "#0f172a",
    previewColor: "#0f172a",
  },
  charcoal: {
    id: "charcoal",
    label: "Charcoal",
    category: "solid",
    cssValue: "#1a1a1a",
    previewColor: "#1a1a1a",
  },
  slate: {
    id: "slate",
    label: "Slate Grey",
    category: "solid",
    cssValue: "#475569",
    previewColor: "#475569",
  },
  warmGrey: {
    id: "warmGrey",
    label: "Warm Grey",
    category: "solid",
    cssValue: "#78716c",
    previewColor: "#78716c",
  },

  // Gradients
  aurora: {
    id: "aurora",
    label: "Aurora Borealis",
    category: "gradient",
    cssValue: "linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #22d3ee 100%)",
    previewColor: "#3b82f6",
  },
  sunset: {
    id: "sunset",
    label: "Sunset",
    category: "gradient",
    cssValue: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
    previewColor: "#8b5cf6",
  },
  midnight: {
    id: "midnight",
    label: "Midnight",
    category: "gradient",
    cssValue: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
    previewColor: "#0f172a",
  },
  emerald: {
    id: "emerald",
    label: "Emerald",
    category: "gradient",
    cssValue: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
    previewColor: "#10b981",
  },
  graphite: {
    id: "graphite",
    label: "Graphite",
    category: "gradient",
    cssValue: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    previewColor: "#1e293b",
  },
  auroraGradient: {
    id: "auroraGradient",
    label: "Aurora Gradient",
    category: "gradient",
    cssValue: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    previewColor: "#667eea",
  },
  cottonCandy: {
    id: "cottonCandy",
    label: "Cotton Candy",
    category: "gradient",
    cssValue: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    previewColor: "#f093fb",
  },
  oceanDepth: {
    id: "oceanDepth",
    label: "Ocean Depth",
    category: "gradient",
    cssValue: "linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)",
    previewColor: "#0093E9",
  },
  forest: {
    id: "forest",
    label: "Forest",
    category: "gradient",
    cssValue: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    previewColor: "#134e5e",
  },
  fire: {
    id: "fire",
    label: "Fire",
    category: "gradient",
    cssValue: "linear-gradient(135deg, #ff6b6b 0%, #ffa500 50%, #ffd700 100%)",
    previewColor: "#ff6b6b",
  },
  cyberpunk: {
    id: "cyberpunk",
    label: "Cyberpunk",
    category: "gradient",
    cssValue: "linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)",
    previewColor: "#ff00ff",
  },
  vaporwave: {
    id: "vaporwave",
    label: "Vaporwave",
    category: "gradient",
    cssValue: "linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)",
    previewColor: "#8338ec",
  },
  monochrome: {
    id: "monochrome",
    label: "Monochrome",
    category: "gradient",
    cssValue: "linear-gradient(135deg, #2d2d2d 0%, #ffffff 100%)",
    previewColor: "#555555",
  },

  // Mesh gradients (simulated with complex gradients)
  softPastelMesh: {
    id: "softPastelMesh",
    label: "Soft Pastel Mesh",
    category: "mesh",
    cssValue:
      "linear-gradient(135deg, rgba(255,179,186,0.8) 0%, rgba(255,223,186,0.6) 25%, rgba(255,250,200,0.6) 50%, rgba(186,225,255,0.8) 75%, rgba(220,198,224,0.8) 100%)",
    previewColor: "#ffb3ba",
  },
  darkNeonMesh: {
    id: "darkNeonMesh",
    label: "Dark Neon Mesh",
    category: "mesh",
    cssValue:
      "linear-gradient(135deg, rgba(255,0,128,0.3) 0%, rgba(0,255,255,0.3) 25%, rgba(255,255,0,0.3) 50%, rgba(255,0,255,0.3) 75%, rgba(0,255,0,0.3) 100%)",
    previewColor: "#001a33",
  },
  sunriseMesh: {
    id: "sunriseMesh",
    label: "Sunrise Mesh",
    category: "mesh",
    cssValue:
      "linear-gradient(135deg, rgba(255,94,77,0.7) 0%, rgba(255,193,7,0.6) 33%, rgba(76,175,80,0.5) 66%, rgba(3,169,244,0.6) 100%)",
    previewColor: "#ff5e4d",
  },

  // Patterns
  dotGrid: {
    id: "dotGrid",
    label: "Dot Grid",
    category: "pattern",
    cssValue:
      "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
    previewColor: "#1a1a1a",
  },
  diagonalLines: {
    id: "diagonalLines",
    label: "Diagonal Lines",
    category: "pattern",
    cssValue:
      "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)",
    previewColor: "#2d2d2d",
  },
  graphPaper: {
    id: "graphPaper",
    label: "Graph Paper",
    category: "pattern",
    cssValue:
      "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
    previewColor: "#1a1a1a",
  },
  noise: {
    id: "noise",
    label: "Noise Texture",
    category: "pattern",
    cssValue: "#1a1a1a",
    previewColor: "#1a1a1a",
  },

  // Glassmorphism
  frostedGlassLight: {
    id: "frostedGlassLight",
    label: "Frosted Glass Light",
    category: "glassmorphism",
    cssValue: "rgba(255, 255, 255, 0.7)",
    previewColor: "#ffffff",
  },
  frostedGlassDark: {
    id: "frostedGlassDark",
    label: "Frosted Glass Dark",
    category: "glassmorphism",
    cssValue: "rgba(15, 23, 42, 0.6)",
    previewColor: "#0f172a",
  },
  glass: {
    id: "glass",
    label: "Glass",
    category: "glassmorphism",
    cssValue: "rgba(2, 6, 23, 0.8)",
    previewColor: "#020617",
  },
};

// ─── SYNTAX THEME PRESETS (20+) ────────────────────────────────────────────

/**
 * Syntax theme presets with react-syntax-highlighter style mappings.
 * Note: The syntaxHighlighterStyle field is a string reference to be used dynamically.
 * Import all styles in EditorStudio.tsx and map them in runtime.
 */
export const SYNTAX_THEMES: Record<SyntaxThemeName, SyntaxThemePreset> = {
  githubLight: {
    name: "githubLight",
    label: "GitHub Light",
    syntaxHighlighterStyle: "github",
    isLight: true,
    defaultBackground: "white",
    accentColor: "#0969da",
    textColor: "#57606a",
  },
  solarizedLight: {
    name: "solarizedLight",
    label: "Solarized Light",
    syntaxHighlighterStyle: "solarizedlight",
    isLight: true,
    defaultBackground: "white",
    accentColor: "#268bd2",
    textColor: "#586e75",
  },
  oneLight: {
    name: "oneLight",
    label: "One Light",
    syntaxHighlighterStyle: "oneLight",
    isLight: true,
    defaultBackground: "white",
    accentColor: "#4078f2",
    textColor: "#6a737d",
  },
  materialLight: {
    name: "materialLight",
    label: "Material Light",
    syntaxHighlighterStyle: "materiallight",
    isLight: true,
    defaultBackground: "white",
    accentColor: "#7c4dff",
    textColor: "#546e7a",
  },
  xcodeLight: {
    name: "xcodeLight",
    label: "Xcode Light",
    syntaxHighlighterStyle: "xcode",
    isLight: true,
    defaultBackground: "white",
    accentColor: "#0066cc",
    textColor: "#333333",
  },
  dracula: {
    name: "dracula",
    label: "Dracula",
    syntaxHighlighterStyle: "dracula",
    isLight: false,
    defaultBackground: "charcoal",
    accentColor: "#ff79c6",
    textColor: "#f8f8f2",
  },
  nord: {
    name: "nord",
    label: "Nord",
    syntaxHighlighterStyle: "nord",
    isLight: false,
    defaultBackground: "navy",
    accentColor: "#88c0d0",
    textColor: "#eceff4",
  },
  tokyoNight: {
    name: "tokyoNight",
    label: "Tokyo Night",
    syntaxHighlighterStyle: "night",
    isLight: false,
    defaultBackground: "charcoal",
    accentColor: "#7aa2f7",
    textColor: "#a9b1d6",
  },
  monokai: {
    name: "monokai",
    label: "Monokai",
    syntaxHighlighterStyle: "monokai",
    isLight: false,
    defaultBackground: "black",
    accentColor: "#ff79c6",
    textColor: "#f8f8f2",
  },
  oneDarkPro: {
    name: "oneDarkPro",
    label: "One Dark Pro",
    syntaxHighlighterStyle: "atom-one-dark",
    isLight: false,
    defaultBackground: "navy",
    accentColor: "#61afef",
    textColor: "#abb2bf",
  },
  ayuDark: {
    name: "ayuDark",
    label: "Ayu Dark",
    syntaxHighlighterStyle: "atom-one-dark",
    isLight: false,
    defaultBackground: "charcoal",
    accentColor: "#80d4ff",
    textColor: "#cccac2",
  },
  gruvboxDark: {
    name: "gruvboxDark",
    label: "Gruvbox Dark",
    syntaxHighlighterStyle: "gruvbox-dark",
    isLight: false,
    defaultBackground: "charcoal",
    accentColor: "#fabd2f",
    textColor: "#ebdbb2",
  },
  catppuccinMocha: {
    name: "catppuccinMocha",
    label: "Catppuccin Mocha",
    syntaxHighlighterStyle: "atom-one-dark",
    isLight: false,
    defaultBackground: "black",
    accentColor: "#a6e3a1",
    textColor: "#cdd6f4",
  },
  synthwave84: {
    name: "synthwave84",
    label: "Synthwave 84",
    syntaxHighlighterStyle: "synthwave84",
    isLight: false,
    defaultBackground: "charcoal",
    accentColor: "#ff00ff",
    textColor: "#72f1b8",
  },
  cobalt2: {
    name: "cobalt2",
    label: "Cobalt2",
    syntaxHighlighterStyle: "atom-one-dark",
    isLight: false,
    defaultBackground: "navy",
    accentColor: "#0099ff",
    textColor: "#e0edee",
  },
  nightOwl: {
    name: "nightOwl",
    label: "Night Owl",
    syntaxHighlighterStyle: "night-owl",
    isLight: false,
    defaultBackground: "navy",
    accentColor: "#7fdbca",
    textColor: "#d6deeb",
  },
  shadesOfPurple: {
    name: "shadesOfPurple",
    label: "Shades of Purple",
    syntaxHighlighterStyle: "atom-one-dark",
    isLight: false,
    defaultBackground: "charcoal",
    accentColor: "#b362ff",
    textColor: "#a1ffe0",
  },
  materialDarker: {
    name: "materialDarker",
    label: "Material Darker",
    syntaxHighlighterStyle: "material-dark",
    isLight: false,
    defaultBackground: "black",
    accentColor: "#89ddff",
    textColor: "#eeffff",
  },
  palenight: {
    name: "palenight",
    label: "Palenight",
    syntaxHighlighterStyle: "atom-one-dark",
    isLight: false,
    defaultBackground: "charcoal",
    accentColor: "#c679dd",
    textColor: "#d0d0d0",
  },
  vscDarkPlus: {
    name: "vscDarkPlus",
    label: "VS Code Dark+",
    syntaxHighlighterStyle: "vsc-dark-plus",
    isLight: false,
    defaultBackground: "navy",
    accentColor: "#569cd6",
    textColor: "#d4d4d4",
  },
};

// ─── DEFAULT TYPOGRAPHY ─────────────────────────────────────────────────

export const DEFAULT_TYPOGRAPHY: CodeTypography = {
  fontFamily: "jetbrains",
  fontSize: 14,
  lineHeight: 1.6,
  letterSpacing: 0,
  fontWeight: 400,
  enableLigatures: true,
};

// ─── DEFAULT PERSPECTIVE 3D ─────────────────────────────────────────────

export const DEFAULT_PERSPECTIVE_3D: Perspective3D = {
  tiltX: 0,
  tiltY: 0,
  scale: 1,
  enableFloatAnimation: false,
};

// ─── DEFAULT LAYOUT ─────────────────────────────────────────────────────

export const DEFAULT_LAYOUT: LayoutConfig = {
  padding: 48,
  maxWidth: "auto",
  alignment: "center",
  aspectRatio: "free",
};

// ─── DEFAULT WATERMARK ─────────────────────────────────────────────────

export const DEFAULT_WATERMARK: WatermarkConfig = {
  position: "bottom-right",
  style: "icon+text",
  opacity: 0.3,
};

// ─── DEFAULT BORDER ─────────────────────────────────────────────────

export const DEFAULT_BORDER: BorderConfig = {
  type: "none",
  width: 1,
  color: "#ffffff",
};

// ─── DEFAULT DECORATION ─────────────────────────────────────────────────

export const DEFAULT_DECORATION: DecorationOptions = {
  cornerRadius: 24,
  innerCodeBlockRadius: 12,
  dropShadow: "soft",
  border: DEFAULT_BORDER,
  enableReflection: false,
  noiseOverlay: 0,
};

// ─── DEFAULT WINDOW FRAME ─────────────────────────────────────────────────

export const DEFAULT_WINDOW_FRAME: WindowFrameConfig = {
  type: "macOS",
  titleText: "contentio.preview",
  showButtons: true,
};

// ─── DEFAULT CODE STYLE CONFIG ────────────────────────────────────────

export const DEFAULT_CODE_STYLE_CONFIG: CodeStyleConfig = {
  windowFrame: DEFAULT_WINDOW_FRAME,
  background: "aurora",
  typography: DEFAULT_TYPOGRAPHY,
  syntaxTheme: "oneDarkPro",
  decoration: DEFAULT_DECORATION,
  perspective3D: DEFAULT_PERSPECTIVE_3D,
  layout: DEFAULT_LAYOUT,
  watermark: DEFAULT_WATERMARK,
};

// ─── DEFAULT IMAGE FILTERS ────────────────────────────────────────────────

export const DEFAULT_IMAGE_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hueRotation: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  invert: false,
};

// ─── DEFAULT IMAGE ADJUSTMENTS ─────────────────────────────────────────────

export const DEFAULT_IMAGE_ADJUSTMENTS: ImageAdjustments = {
  objectFit: "contain",
  objectPosition: "center",
  zoom: 100,
  flipH: false,
  flipV: false,
  rotation: 0,
  opacity: 100,
  borderRadius: 0,
};

// ─── DEFAULT IMAGE FRAME ─────────────────────────────────────────────────

export const DEFAULT_IMAGE_FRAME: ImageFrame = {
  type: "none",
};

// ─── DEFAULT IMAGE STYLE CONFIG ────────────────────────────────────────

export const DEFAULT_IMAGE_STYLE_CONFIG: ImageStyleConfig = {
  filters: DEFAULT_IMAGE_FILTERS,
  adjustments: DEFAULT_IMAGE_ADJUSTMENTS,
  overlays: [],
  frame: DEFAULT_IMAGE_FRAME,
  background: "aurora",
  blurredImageBg: false,
};

// ─── FONT FAMILY MAPPINGS ─────────────────────────────────────────────────

export const FONT_FAMILIES = {
  jetbrains: {
    name: "JetBrains Mono",
    cssValue: "'JetBrains Mono', 'Courier New', monospace",
    googleFont: "JetBrains+Mono",
  },
  firacode: {
    name: "Fira Code",
    cssValue: "'Fira Code', 'Courier New', monospace",
    googleFont: "Fira+Code",
  },
  cascadia: {
    name: "Cascadia Code",
    cssValue: "'Cascadia Code', 'Courier New', monospace",
    googleFont: "Cascadia+Code",
  },
  sourcecodepro: {
    name: "Source Code Pro",
    cssValue: "'Source Code Pro', 'Courier New', monospace",
    googleFont: "Source+Code+Pro",
  },
  plex: {
    name: "IBM Plex Mono",
    cssValue: "'IBM Plex Mono', 'Courier New', monospace",
    googleFont: "IBM+Plex+Mono",
  },
  hack: {
    name: "Hack",
    cssValue: "'Hack', 'Courier New', monospace",
    googleFont: "Hack",
  },
  courierprime: {
    name: "Courier Prime",
    cssValue: "'Courier Prime', 'Courier New', monospace",
    googleFont: "Courier+Prime",
  },
};

// ─── PRESET FILTER PACKS (IMAGE MODE) ─────────────────────────────────

export const PRESET_FILTER_PACKS: Record<string, Partial<ImageFilters>> = {
  original: DEFAULT_IMAGE_FILTERS,
  vivid: {
    brightness: 110,
    saturation: 160,
    contrast: 110,
  },
  matte: {
    brightness: 105,
    contrast: 85,
    saturation: 80,
  },
  noir: {
    grayscale: 100,
    contrast: 120,
  },
  faded: {
    brightness: 115,
    contrast: 80,
    saturation: 70,
    sepia: 20,
  },
  chrome: {
    saturation: 130,
    contrast: 115,
    brightness: 105,
  },
  cool: {
    hueRotation: 200,
    saturation: 110,
  },
  warm: {
    hueRotation: 20,
    saturation: 130,
    brightness: 105,
  },
  lofi: {
    sepia: 40,
    contrast: 120,
    saturation: 80,
  },
};
