export const theme = {
  colors: {
    background: '#000000', // True Black for OLED premium feel
    surface: '#121212', // Subtle off-black
    surfaceGlass: 'rgba(255, 255, 255, 0.08)', // Frosted glass effect
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.4)',
    textTertiary: 'rgba(255, 255, 255, 0.2)',

    // Dot States
    dotEmpty: '#1A1A1A', // Very dark grey, barely visible
    dotPassed: '#FFFFFF', // Pure white
    dotToday: '#D4AF37', // "Champagne Gold" - premium accent

    border: 'rgba(255, 255, 255, 0.1)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 20,
    xl: 28,
    xxl: 48,
    hero: 80, // Massive for the counter
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    full: 999,
  },
  shadows: {
    none: {
      shadowColor: 'transparent',
      elevation: 0,
    },
    glass: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
      elevation: 12,
    },
    glow: {
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
