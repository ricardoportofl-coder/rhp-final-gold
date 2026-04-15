import { createContext, useContext } from "react";

export type ColorScheme = "light" | "dark";

export const SERVICE_PRICES: Record<string, number> = {
  checkup:   150,
  whitening: 400,
  ortho:     250,
  implant:   350,
  emergency: 175,
};

export function getColors(scheme: ColorScheme) {
  const dk = scheme === "dark";
  return {
    bg:         dk ? "#000000"                  : "#F5F5F7",
    surface:    dk ? "#1c1c1e"                  : "#FFFFFF",
    surface2:   dk ? "#2c2c2e"                  : "#F5F5F7",
    surface3:   dk ? "#3a3a3c"                  : "#E8E8ED",
    surface4:   dk ? "#48484a"                  : "#D1D1D6",
    border:     dk ? "rgba(255,255,255,0.08)"   : "rgba(0,0,0,0.08)",
    borderFocus:dk ? "rgba(255,255,255,0.18)"   : "rgba(0,0,0,0.18)",
    text:       dk ? "#f5f5f7"                  : "#1D1D1F",
    textSub:    dk ? "rgba(235,235,245,0.6)"    : "#6E6E73",
    textMuted:  dk ? "rgba(235,235,245,0.3)"    : "#AEAEB2",
    accent:     "#007AFF",
    accentDim:  "rgba(0,122,255,0.10)",
    accentGlow: "rgba(0,122,255,0.22)",
    success:    "#34C759",
    successDim: "rgba(52,199,89,0.12)",
    warning:    "#FF9F0A",
    warningDim: "rgba(255,159,10,0.12)",
    danger:     "#FF3B30",
    dangerDim:  "rgba(255,59,48,0.08)",
    neutral:    "#8E8E93",
    neutralDim: "rgba(142,142,147,0.12)",
    shadow:     dk
      ? "0 1px 4px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.4)"
      : "0 1px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.06)",
    shadowMd:   dk
      ? "0 2px 8px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.5)"
      : "0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.08)",
    font: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif",
  };
}

export type Colors = ReturnType<typeof getColors>;

export const ThemeCtx = createContext<Colors>(getColors("light"));
export const useColors = () => useContext(ThemeCtx);
