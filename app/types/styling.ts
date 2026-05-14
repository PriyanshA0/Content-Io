/**
 * ContentIo Styling System - Type Definitions
 * Comprehensive TypeScript interfaces for code and image mode styling
 */

// ─── WINDOW FRAME TYPES ────────────────────────────────────────────────────

export type WindowFrameType = "macOS" | "windows11" | "gnome" | "terminal" | "minimal";

export interface WindowFrameConfig {
  type: WindowFrameType;
  titleText: string;
  showButtons: boolean;
}

// ─── BACKGROUND TYPES ────────────────────────────────────────────────────

export type BackgroundCategory = "solid" | "gradient" | "mesh" | "pattern" | "glassmorphism";

export interface BackgroundOption {
  id: string;
  label: string;
  category: BackgroundCategory;
  cssValue: string;
  previewColor?: string; // For thumbnails
}

export type BackgroundPreset =
  | "black"
  | "white"
  | "navy"
  | "charcoal"
  | "slate"
  | "warmGrey"
  | "aurora"
  | "sunset"
  | "midnight"
  | "emerald"
  | "graphite"
  | "glass"
  | "auroraGradient"
  | "cottonCandy"
  | "oceanDepth"
  | "forest"
  | "fire"
  | "cyberpunk"
  | "vaporwave"
  | "monochrome"
  | "softPastelMesh"
  | "darkNeonMesh"
  | "sunriseMesh"
  | "dotGrid"
  | "diagonalLines"
  | "graphPaper"
  | "noise"
  | "frostedGlassLight"
  | "frostedGlassDark";

// ─── CODE TYPOGRAPHY TYPES ────────────────────────────────────────────────

export type CodeFontFamily =
  | "jetbrains"
  | "firacode"
  | "cascadia"
  | "sourcecodepro"
  | "plex"
  | "hack"
  | "courierprime";

export type FontWeight = 400 | 500 | 700;

export interface CodeTypography {
  fontFamily: CodeFontFamily;
  fontSize: number; // 10-24px
  lineHeight: number; // 1.2-2.0
  letterSpacing: number; // -1 to 3
  fontWeight: FontWeight;
  enableLigatures: boolean;
}

// ─── SYNTAX THEME TYPES ────────────────────────────────────────────────────

export type SyntaxThemeName =
  | "githubLight"
  | "solarizedLight"
  | "oneLight"
  | "materialLight"
  | "xcodeLight"
  | "dracula"
  | "nord"
  | "tokyoNight"
  | "monokai"
  | "oneDarkPro"
  | "ayuDark"
  | "gruvboxDark"
  | "catppuccinMocha"
  | "synthwave84"
  | "cobalt2"
  | "nightOwl"
  | "shadesOfPurple"
  | "materialDarker"
  | "palenight"
  | "vscDarkPlus";

export interface SyntaxThemePreset {
  name: SyntaxThemeName;
  label: string;
  syntaxHighlighterStyle: string; // Import path reference
  isLight: boolean;
  defaultBackground: BackgroundPreset;
  accentColor: string; // Hex for borders/glows
  textColor: string; // Hex for window chrome text
}

// ─── DECORATION TYPES ────────────────────────────────────────────────────

export type DropShadowType = "none" | "soft" | "medium" | "dramatic" | "glow-fuchsia" | "glow-cyan" | "glow-white";

export type BorderType = "none" | "subtle" | "solid" | "gradient";

export interface BorderConfig {
  type: BorderType;
  width: number; // 0-4px
  color: string; // Hex
}

export interface DecorationOptions {
  cornerRadius: number; // 0-48px
  innerCodeBlockRadius: number; // 0-32px
  dropShadow: DropShadowType;
  border: BorderConfig;
  enableReflection: boolean;
  noiseOverlay: number; // 0-30% opacity
}

// ─── 3D TRANSFORM TYPES ────────────────────────────────────────────────────

export interface Perspective3D {
  tiltX: number; // -30 to +30 degrees
  tiltY: number; // -30 to +30 degrees
  scale: number; // 0.8 to 1.2
  enableFloatAnimation: boolean;
}

// ─── LAYOUT TYPES ────────────────────────────────────────────────────────

export type MaxWidth = "400px" | "600px" | "800px" | "auto";
export type ContentAlignment = "left" | "center" | "right";
export type AspectRatioType = "free" | "1:1" | "16:9" | "4:5" | "9:16";

export interface LayoutConfig {
  padding: number; // 0-120px
  maxWidth: MaxWidth;
  alignment: ContentAlignment;
  aspectRatio: AspectRatioType;
}

// ─── WATERMARK TYPES ────────────────────────────────────────────────────

export type WatermarkPosition = "bottom-right" | "bottom-left" | "bottom-center";
export type WatermarkStyle = "icon+text" | "text-only" | "icon-only";

export interface WatermarkConfig {
  position: WatermarkPosition;
  style: WatermarkStyle;
  opacity: number; // 10-80%
}

// ─── CODE STYLE CONFIG (COMPREHENSIVE) ────────────────────────────────────

export interface CodeStyleConfig {
  // Window frame
  windowFrame: WindowFrameConfig;

  // Background
  background: BackgroundPreset;

  // Code typography
  typography: CodeTypography;

  // Syntax theme
  syntaxTheme: SyntaxThemeName;

  // Decorations
  decoration: DecorationOptions;

  // 3D transforms
  perspective3D: Perspective3D;

  // Layout
  layout: LayoutConfig;

  // Watermark
  watermark: WatermarkConfig;
}

// ─── IMAGE FILTER TYPES (PHASE 2) ────────────────────────────────────────

export interface ImageFilters {
  brightness: number; // 50-200, default 100
  contrast: number; // 50-200, default 100
  saturation: number; // 0-300, default 100
  hueRotation: number; // 0-360, default 0
  blur: number; // 0-20px, default 0
  grayscale: number; // 0-100%, default 0
  sepia: number; // 0-100%, default 0
  invert: boolean; // default false
}

export type PresetFilterPack =
  | "original"
  | "vivid"
  | "matte"
  | "noir"
  | "faded"
  | "chrome"
  | "cool"
  | "warm"
  | "duotoneFuchsia"
  | "duotoneCyan"
  | "glitch"
  | "lofi";

// ─── IMAGE ADJUSTMENT TYPES ────────────────────────────────────────────────

export type ObjectFit = "contain" | "cover" | "fill";
export type ObjectPosition = "center" | "top" | "bottom" | "left" | "right";

export interface ImageAdjustments {
  objectFit: ObjectFit;
  objectPosition: ObjectPosition;
  zoom: number; // 50-200%
  flipH: boolean;
  flipV: boolean;
  rotation: number; // -180 to 180
  opacity: number; // 20-100%
  borderRadius: number; // 0-48px
}

// ─── IMAGE OVERLAY TYPES ────────────────────────────────────────────────

export type OverlayType = "color" | "gradient" | "vignette" | "scanlines" | "grain" | "lightleak";

export interface ColorOverlay {
  type: "color";
  color: string; // Hex
  opacity: number; // 0-80%
}

export interface GradientOverlay {
  type: "gradient";
  direction: "top" | "bottom" | "left" | "right" | "diagonal";
  color1: string; // Hex
  color2: string; // Hex
  opacity: number; // 0-80%
}

export interface VignetteOverlay {
  type: "vignette";
  intensity: number; // 0-100%
}

export interface ScanlinesOverlay {
  type: "scanlines";
  enabled: boolean;
}

export interface GrainOverlay {
  type: "grain";
  enabled: boolean;
  intensity: number; // 0-100%
}

export interface LightLeakOverlay {
  type: "lightleak";
  enabled: boolean;
}

export type ImageOverlay = ColorOverlay | GradientOverlay | VignetteOverlay | ScanlinesOverlay | GrainOverlay | LightLeakOverlay;

// ─── IMAGE FRAME TYPES ────────────────────────────────────────────────────

export type ImageFrameType = "none" | "thinBorder" | "glowBorder" | "polaroid" | "instantPhoto" | "deviceMockup" | "shadow";

export interface ImageFrame {
  type: ImageFrameType;
  borderWidth?: number; // 1-4px
  borderColor?: string; // Hex
  glowIntensity?: number; // For glow borders
  shadowType?: "none" | "soft" | "hard" | "floating";
  polaroidCaption?: string;
  deviceType?: "browser" | "phone" | "tablet";
}

// ─── IMAGE STYLE CONFIG (PHASE 2) ────────────────────────────────────────

export interface ImageStyleConfig {
  // Filters
  filters: ImageFilters;

  // Adjustments
  adjustments: ImageAdjustments;

  // Overlays
  overlays: ImageOverlay[];

  // Frame
  frame: ImageFrame;

  // Background
  background: BackgroundPreset;
  blurredImageBg: boolean; // Use blurred version of image as background
}

// ─── LANGUAGE TYPE ────────────────────────────────────────────────────

export type EditorLanguage = "javascript" | "typescript" | "python" | "bash" | "java" | "cpp";

// ─── MODE TYPE ────────────────────────────────────────────────────

export type EditorMode = "code" | "image";
