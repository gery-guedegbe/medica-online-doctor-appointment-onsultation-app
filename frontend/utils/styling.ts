import { Dimensions, PixelRatio, useWindowDimensions } from "react-native";

// Dimensions de référence de la maquette Figma (iPhone 14 Pro Max)
const BASE_WIDTH = 428;
const BASE_HEIGHT = 926;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const [shortDimension, longDimension] =
  SCREEN_WIDTH < SCREEN_HEIGHT
    ? [SCREEN_WIDTH, SCREEN_HEIGHT]
    : [SCREEN_HEIGHT, SCREEN_WIDTH];

// ─── Fonctions statiques ───────────────────────────────────────
// Usage: StyleSheet.create() et tout code hors composant React

/**
 * Scale horizontal — fonts, paddings, margins, icônes, bordures
 * Référence: largeur écran vs BASE_WIDTH (428px Figma)
 */
export const scale = (size: number): number =>
  Math.round(
    PixelRatio.roundToNearestPixel((shortDimension / BASE_WIDTH) * size),
  );

/**
 * Scale vertical — hauteurs de composants, espacements verticaux
 * Référence: hauteur écran vs BASE_HEIGHT (926px Figma)
 */
export const verticalScale = (size: number): number =>
  Math.round(
    PixelRatio.roundToNearestPixel((longDimension / BASE_HEIGHT) * size),
  );

// Alias courts pour les StyleSheet (usage fréquent)
export const s = scale;
export const vs = verticalScale;

// ─── Hook réactif ──────────────────────────────────────────────
// Usage: dans les composants React (rotation, resize, tablet)

/**
 * Hook qui retourne les fonctions de scale + infos device
 * Se met à jour automatiquement si les dimensions changent
 *
 * @example
 * const { s, vs, isTablet } = useScaling();
 * <View style={{ padding: s(16), height: vs(56) }} />
 */
export const useScaling = () => {
  const { width, height } = useWindowDimensions();

  const short = Math.min(width, height);
  const long = Math.max(width, height);

  return {
    s: (size: number): number =>
      Math.round(PixelRatio.roundToNearestPixel((short / BASE_WIDTH) * size)),
    vs: (size: number): number =>
      Math.round(PixelRatio.roundToNearestPixel((long / BASE_HEIGHT) * size)),
    isTablet: width >= 600,
    isLandscape: width > height,
    width,
    height,
  };
};
