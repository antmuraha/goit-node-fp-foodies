import { ColorToken } from "../types/colorTokens";

const withFdPrefix = (token: ColorToken): string => `--fd-${token}`;

/**
 * Return CSS variable value for a color token key.
 * Example: getColorCssVar("color-main") -> "var(--fd-color-main)"
 */
export const getColorCssVar = (colorToken: ColorToken): string => `var(${withFdPrefix(colorToken)})`;

/**
 * Return raw CSS var string (without var(...)) for a color token.
 */
export const getRawColorCssVar = (colorToken: ColorToken): string => withFdPrefix(colorToken);

/**
 * Returns theme color by token name with optional fallback.
 */
export const getColorCssVarWithFallback = (colorToken: ColorToken, fallback?: string): string => {
  const cssVar = withFdPrefix(colorToken);
  return fallback ? `var(${cssVar}, ${fallback})` : `var(${cssVar})`;
};
