export interface ImageFilters {
  brightness: number;    // 50–200, default 100
  contrast: number;      // 50–200, default 100
  saturation: number;    // 0–300, default 100
  hueRotate: number;     // 0–360, default 0
  blur: number;          // 0–20, default 0
  grayscale: number;     // 0–100, default 0
  sepia: number;         // 0–100, default 0
  invert: boolean;       // default false
}

export interface ImageAdjustments {
  objectFit: "contain" | "cover" | "fill";   // default "contain"
  objectPosition: "center"|"top"|"bottom"|"left"|"right"; // default "center"
  scale: number;         // 50–200, default 100
  flipH: boolean;        // default false
  flipV: boolean;        // default false
  rotation: number;      // -180 to 180, default 0
  imageOpacity: number;  // 20–100, default 100
  imageRadius: number;   // 0–48, default 8
}

export interface ImageOverlay {
  colorOverlay: boolean;
  colorOverlayColor: string;      // hex, default "#000000"
  colorOverlayOpacity: number;    // 0–80, default 0
  gradientOverlay: boolean;
  gradientDirection: "to bottom"|"to top"|"to right"|"to left"|"135deg";
  gradientColor1: string;
  gradientColor2: string;
  gradientOpacity: number;        // 0–80
  vignette: boolean;
  vignetteIntensity: number;      // 0–100
  scanlines: boolean;
  grain: boolean;
  grainIntensity: number;         // 0–50
  lightLeak: boolean;
}

export type ImagePresetId =
  | "original"|"vivid"|"matte"|"noir"|"faded"|"chrome"
  |"cool"|"warm"|"duotone-fuchsia"|"duotone-cyan"|"lofi"|"glitch";

export const IMAGE_FILTER_PRESETS: Record<ImagePresetId, Partial<ImageFilters>> = {
  original:        { brightness:100, contrast:100, saturation:100, hueRotate:0, blur:0, grayscale:0, sepia:0, invert:false },
  vivid:           { brightness:110, contrast:110, saturation:160 },
  matte:           { brightness:105, contrast:85,  saturation:80  },
  noir:            { grayscale:100,  contrast:120 },
  faded:           { brightness:115, contrast:80,  saturation:70,  sepia:20 },
  chrome:          { saturation:130, contrast:115, brightness:105 },
  cool:            { hueRotate:200,  saturation:110 },
  warm:            { hueRotate:20,   saturation:130, brightness:105 },
  "duotone-fuchsia":{ grayscale:100 },
  "duotone-cyan":  { grayscale:100 },
  lofi:            { sepia:40,  contrast:120, saturation:80 },
  glitch:          { hueRotate:15, contrast:110 },
};

export const DEFAULT_IMAGE_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hueRotate: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  invert: false,
};

export const DEFAULT_IMAGE_ADJUSTMENTS: ImageAdjustments = {
  objectFit: "contain",
  objectPosition: "center",
  scale: 100,
  flipH: false,
  flipV: false,
  rotation: 0,
  imageOpacity: 100,
  imageRadius: 8,
};

export const DEFAULT_IMAGE_OVERLAY: ImageOverlay = {
  colorOverlay: false,
  colorOverlayColor: "#000000",
  colorOverlayOpacity: 0,
  gradientOverlay: false,
  gradientDirection: "to bottom",
  gradientColor1: "#000000",
  gradientColor2: "#ffffff",
  gradientOpacity: 0,
  vignette: false,
  vignetteIntensity: 0,
  scanlines: false,
  grain: false,
  grainIntensity: 6,
  lightLeak: false,
};

export type ImageFrame = "none"|"border"|"glow"|"polaroid"|"shadow-float";
